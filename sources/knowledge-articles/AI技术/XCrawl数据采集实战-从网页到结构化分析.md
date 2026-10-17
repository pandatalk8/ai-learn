# XCrawl 数据采集实战：从网页到结构化分析

> 做研究、写报告、跟踪竞品、分析市场——这些工作的第一步永远是"拿数据"。但传统爬虫的门槛太高：写代码、配代理、处理反爬、解析 HTML……很多人就卡在这一步。今天这篇教程，手把手教你用 XCrawl CLI 完成从数据采集到分析的完整流程，不需要写爬虫代码。

---

## 准备工作

### 安装

XCrawl CLI 需要 Node.js >= 18。两种安装方式：

```bash
# 方式一：全局安装（推荐）
npm install -g @xcrawl/cli

# 方式二：免安装直接用
npx -y @xcrawl/cli@0.2.7 --help
```

### 登录认证

```bash
# 浏览器登录（推荐，会自动弹出授权页面）
xcrawl login --browser

# 或者直接用 API Key
xcrawl login --api-key <YOUR_API_KEY>
```

API Key 保存在 `~/.xcrawl/config.json`，后续使用不需要重复登录。

确认账户状态：

```bash
xcrawl status
```

看到 Credits 余额就说明一切就绪。新账户送 1,000 个免费 credits，不需要绑卡。

---

## 场景一：采集竞品定价数据，生成对比分析

假设你在做市场调研，需要对比几家竞品的定价策略。

### 第一步：单页抓取，快速验证

先抓一个页面看看效果：

```bash
xcrawl scrape https://competitor.com/pricing --format markdown
```

返回的是去除了导航栏、广告、脚本等噪音的干净 Markdown 正文。你可以快速判断这个页面是否包含你需要的信息。

如果你想看到完整的元数据（状态码、标题、最终 URL 等），加 `--json` 参数：

```bash
xcrawl scrape https://competitor.com/pricing --json
```

### 第二步：AI 提取结构化数据

光拿到正文不够，你要的是结构化的价格数据。这时候用 API 的 JSON 提取功能——用自然语言告诉它你要什么字段：

```bash
curl -s -X POST 'https://run.xcrawl.com/v1/scrape' \
  -H 'Authorization: Bearer $XCRAWL_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://competitor.com/pricing",
    "output": {
      "formats": ["json"]
    },
    "json": {
      "prompt": "提取所有定价方案，包含：方案名称、月费价格、年费价格、包含功能列表、用户数限制"
    }
  }'
```

返回的是可以直接入库的 JSON 结构，不用写一行解析代码。竞品网站改版了？Prompt 不用改，AI 会自动适应新的页面结构。

### 第三步：批量采集多个竞品

把竞品 URL 列表写到文件里：

```bash
cat > competitors.txt << 'EOF'
https://competitor-a.com/pricing
https://competitor-b.com/pricing
https://competitor-c.com/pricing
https://competitor-d.com/pricing
https://competitor-e.com/pricing
EOF
```

一行命令批量抓取：

```bash
xcrawl scrape --input competitors.txt --format markdown --concurrency 3
```

`--concurrency 3` 表示最多 3 个请求并行，既快又不会太激进。结果默认保存到 `.xcrawl/` 目录，每个 URL 一个文件。

如果想把所有结果合并成一个 JSON 数组输出到终端：

```bash
xcrawl scrape --input competitors.txt --json
```

### 第四步：用 Claude Code 生成分析报告

拿到数据后，直接在 Claude Code 里说：

> "读取 .xcrawl/ 目录下的所有竞品定价数据，生成一份对比分析报告，包含：价格区间对比、功能覆盖度矩阵、性价比排名、定价策略分析。输出到 pricing-analysis.md"

数据采集 + 分析报告，全程可能不超过 10 分钟。

---

## 场景二：爬取整站文档，构建知识库

你在搭建一个 RAG（检索增强生成）系统，需要把某个产品的文档站全部抓下来作为知识源。

### 第一步：用 Map 发现站点结构

先看看这个站点有多少个页面：

```bash
xcrawl map https://docs.example.com --limit 200 --json
```

Map 会快速返回站点内所有可发现的 URL 列表，包括 sitemap 和页面内链接。你可以用 `--limit` 控制返回数量，避免拿到太多无关页面。

### 第二步：用 Crawl 批量爬取

确认 URL 范围后，启动爬取任务：

```bash
xcrawl crawl start https://docs.example.com \
  --max-pages 100 \
  --wait \
  --interval 3000 \
  --wait-timeout 120000
```

参数解释：
- `--max-pages 100`：最多爬取 100 个页面
- `--wait`：启动后自动轮询，等爬取完成再返回
- `--interval 3000`：每 3 秒检查一次任务状态
- `--wait-timeout 120000`：最多等 2 分钟

Crawl 是异步的。如果你不加 `--wait`，它会立即返回一个 `job-id`，你可以随时查看进度：

```bash
xcrawl crawl status <job-id>
```

状态流转：`pending` → `crawling` → `completed`（或 `failed`）。

### 第三步：数据落地

爬取完成后，所有页面内容以 Markdown 格式保存在本地。你可以直接：

- 灌进向量数据库（Pinecone、Weaviate、Chroma 等）构建 RAG
- 用 Claude Code 做全文检索和问答
- 生成文档摘要或知识图谱

一个 100 页的文档站，从发起爬取到数据落地，通常在 2 分钟内完成。

---

## 场景三：追踪搜索趋势与竞品 SEO

你想了解某个关键词的搜索格局——谁排在前面、标题怎么写的、内容策略是什么。

### 第一步：采集 SERP 数据

```bash
xcrawl search "AI coding assistant" --limit 20 --country US --language en --json
```

返回结构化的搜索结果：排名位置、标题、URL、描述摘要，全部是干净的 JSON。

你可以针对一组关键词批量采集：

```bash
for keyword in "AI coding assistant" "vibe coding tools" "claude code vs cursor"; do
  echo "--- $keyword ---"
  xcrawl search "$keyword" --limit 10 --country US --json
done > serp_data.json
```

### 第二步：深入分析排名靠前的内容

拿到搜索结果后，用 Scrape 抓取排名靠前页面的完整内容：

```bash
# 从搜索结果中提取前 5 个 URL，逐个抓取
xcrawl scrape https://top-result-1.com https://top-result-2.com \
  --format markdown --concurrency 2
```

### 第三步：生成 SEO 分析报告

把 SERP 数据和页面内容交给 Claude Code：

> "分析 serp_data.json 中的搜索结果数据和 .xcrawl/ 目录下的页面内容，生成一份 SEO 竞争分析报告：排名分布、标题关键词频率、内容长度与排名关系、竞品内容策略总结"

---

## 场景四：监控社交媒体热点内容

以 X（Twitter）为例，你想追踪 AI 领域最近的热门讨论。

### 搜索特定话题

```bash
xcrawl search "site:x.com AI agent 2026" --limit 20 --json
```

`site:x.com` 限定只搜索 X 平台的内容。返回的 snippet 就是推文摘要。

### 搜索特定博主

```bash
xcrawl search "site:x.com from:karpathy AI" --limit 10 --json
```

### 抓取推文全文

Search 返回的是摘要，想看全文用 Scrape：

```bash
xcrawl scrape "https://x.com/karpathy/status/1886192184808149383" --format markdown
```

### 批量采集 + 趋势分析

```bash
# 采集多个话题
for topic in "AI agent" "vibe coding" "Claude Code" "RAG" "AI startup"; do
  xcrawl search "site:x.com $topic" --limit 10 --json
done > twitter_trends.json
```

然后让 Claude Code 分析：

> "读取 twitter_trends.json，按话题分类统计讨论热度，识别高频提及的工具/产品/人物，生成一份 AI 行业社交媒体趋势周报"

---

## 场景五：电商评价采集与情感分析

你想了解某个品类的用户真实反馈。

### 采集产品页面

```bash
xcrawl scrape https://amazon.com/dp/XXXXXXXXXX --format markdown
```

### AI 提取结构化评价数据

```bash
curl -s -X POST 'https://run.xcrawl.com/v1/scrape' \
  -H 'Authorization: Bearer $XCRAWL_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://amazon.com/dp/XXXXXXXXXX/reviews",
    "output": {
      "formats": ["json"]
    },
    "json": {
      "prompt": "提取所有用户评价，包含：用户名、评分（1-5星）、评价标题、评价正文、评价日期、是否已验证购买"
    }
  }'
```

### 情感分析

拿到结构化评价数据后，交给 Claude Code：

> "分析这些用户评价数据：正面/负面/中性比例分布、高频投诉关键词、用户最满意的功能点、NPS 评估、改进建议汇总"

---

## 实用技巧

### 1. 选择正确的输出格式

| 格式 | 用途 | 命令 |
|------|------|------|
| `markdown` | 喂给 AI、存知识库、内容阅读 | `--format markdown` |
| `json` | 结构化提取、入数据库 | `--format json`（CLI）或 API 的 `json.prompt` |
| `html` | 保留原始格式、二次解析 | `--format html` |
| `text` | 纯文本提取 | `--format text` |
| `screenshot` | 页面快照、视觉对比 | `--format screenshot` |

### 2. 管理 Credits 消耗

不同操作消耗的 credits 不同。API 返回中会告诉你明细：

```json
"credits_detail": {
  "base_cost": 1,
  "traffic_cost": 0,
  "json_extract_cost": 4
}
```

省 credits 的策略：
- 用 `search` 先做初筛（消耗少），确认目标后再 `scrape` 全文
- 只抓你需要的格式，不要同时请求多种格式
- 用 `--limit` 控制搜索和爬取数量
- 定期用 `xcrawl status` 检查余量

### 3. 批量抓取的最佳实践

```bash
# 从文件读取 URL 列表
xcrawl scrape --input urls.txt --concurrency 5

# 指定输出目录
xcrawl scrape --input urls.txt --output ./data/

# 输出为 JSON 数组（方便程序处理）
xcrawl scrape --input urls.txt --json > results.json
```

`--concurrency` 默认是 3，对于大多数场景够用。太高可能触发目标网站的限流。

### 4. 调试技巧

```bash
# 开启 debug 模式，查看请求详情
xcrawl scrape https://example.com --debug

# 设置更长的超时时间（默认 30 秒）
xcrawl scrape https://example.com --timeout 60000

# 使用区域代理（比如美国 IP）
xcrawl scrape https://example.com --proxy US
```

### 5. 配置持久化

把常用设置持久化，不用每次都传参：

```bash
# 设置默认输出格式为 JSON
xcrawl config set default-format json

# 设置默认超时为 60 秒
xcrawl config set timeout-ms 60000

# 查看当前所有配置
xcrawl config keys
```

配置优先级：命令行参数 > 环境变量 > 配置文件 > 默认值。

### 6. 环境变量快速配置

适合在 CI/CD 或脚本中使用：

```bash
export XCRAWL_API_KEY=your_key
export XCRAWL_DEFAULT_FORMAT=markdown
export XCRAWL_OUTPUT_DIR=./crawl_data
export XCRAWL_TIMEOUT_MS=60000
```

---

## 一个完整的数据分析工作流

把上面的能力串起来，这是一个你可以直接复用的完整工作流：

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  定义目标    │ ──→ │  数据采集     │ ──→ │  数据清洗     │ ──→ │  分析报告     │
│  确定数据源  │     │  XCrawl CLI  │     │  Claude Code │     │  Claude Code │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**第一步：定义目标。** 明确你要分析什么、数据在哪里、需要哪些字段。

**第二步：数据采集。** 根据场景选择 XCrawl 的命令：
- 已知具体 URL → `xcrawl scrape`
- 需要发现页面 → `xcrawl map` + `xcrawl crawl start`
- 需要搜索定位 → `xcrawl search`
- 需要结构化字段 → API 的 `json.prompt`

**第三步：数据清洗。** 让 Claude Code 读取采集结果，去重、过滤、标准化格式。

**第四步：分析报告。** 让 Claude Code 基于清洗后的数据生成分析报告——图表、表格、趋势、洞察。

整个流程中，你需要做的只是两件事：**定义目标** 和 **验收结果**。中间的采集、清洗、分析，全部由 XCrawl + Claude Code 完成。

---

> 数据采集从来不该是瓶颈。真正有价值的工作，是从数据中发现别人看不到的东西。XCrawl 帮你把"拿数据"这一步压缩到最短，让你的时间花在"用数据"上。
