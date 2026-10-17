# Claude Code + XCrawl：抓取 X 上 AI 博主热门内容实战

> Claude Code 的 Skill 系统让它不再只是一个聊天机器人——你可以给它装上各种"技能模块"，让它像一个真正的工作助手一样帮你干活。今天这篇教程，我们用 XCrawl Skill 来做一件很多内容创作者都想做的事：**批量抓取 X（Twitter）上活跃 AI 博主的热门内容，建立自己的选题素材库。**

---

## 为什么要抓取 X 上的 AI 内容？

如果你在做 AI 相关的自媒体，X 是最重要的信息源之一。全球最活跃的 AI 从业者——从 Karpathy 到 Andrew Ng，从宝玉到 Dotey——几乎都在 X 上第一时间分享观点、拆解技术、讨论趋势。

但问题是：

- X 的信息流太快，你不可能 24 小时盯着看
- 好内容转瞬即逝，错过就很难找回来
- 手动复制粘贴效率太低，一个博主的内容就够你忙半天
- 你想做系统性的选题研究，但 X 的搜索功能很弱

如果有一个工具，能帮你**按关键词、按博主、按话题批量采集 X 上的热门内容**，然后整理成结构化的素材，你的内容生产效率会完全不一样。

这就是 Claude Code + XCrawl 能做的事。

---

## 准备工作

### 1. 安装 XCrawl Skill

如果你的 Claude Code 还没有 XCrawl Skill，先装一个。把下面这个 `SKILL.md` 文件放到 `~/.claude/skills/xcrawl/` 目录下就行（具体内容可以参考我之前分享的 Skill 配置）。

装好之后，在 Claude Code 里输入 `/xcrawl` 就能调用了。

### 2. 登录 XCrawl

在 Claude Code 里直接说：

```
/xcrawl login
```

或者手动执行：

```bash
xcrawl login --browser
```

浏览器会弹出认证页面，授权后 API Key 自动保存到本地。新用户送 1,000 个免费 credits，够用一阵子。

确认登录成功：

```bash
xcrawl status
```

看到账户信息和剩余 credits 就说明一切就绪了。

---

## 实战一：按话题搜索 X 上的热门 AI 内容

XCrawl 的 Search API 支持 Google 的 `site:` 语法，这意味着你可以精准地只搜索 X 上的内容。

### 搜索某个 AI 话题的热门推文

在 Claude Code 里直接说：

> "帮我搜索 X 上关于 vibe coding 的热门讨论"

Claude Code 会通过 XCrawl Skill 执行：

```bash
xcrawl search "site:x.com vibe coding AI" --limit 10 --json
```

返回结果像这样：

```json
{
  "query": "site:x.com vibe coding AI",
  "results": [
    {
      "snippet": "There's a new kind of coding I call \"vibe coding\", where you fully give in to the vibes...",
      "title": "There's a new kind of coding I call \"vibe coding\"...",
      "url": "https://x.com/karpathy/status/1886192184808149383"
    },
    {
      "snippet": "Vibe coding is real. 1 month later, Aura hits 15k MRR and 21.7k users...",
      "title": "Vibe coding is real. 1 month later, Aura hits 15k MRR...",
      "url": "https://x.com/MengTo/status/1943717847236325519"
    }
  ]
}
```

每条结果包含**推文摘要、标题和原始链接**。你一眼就能看出哪些内容值得深入研究。

### 搜索中文 AI 圈的讨论

```bash
xcrawl search "site:x.com Claude Code AI 编程" --limit 10 --json
```

中文搜索同样好使。你会看到宝玉、FinanceYF5、dotey 这些中文 AI 圈活跃博主的内容直接出现在结果里：

```json
{
  "snippet": "Claude Code 虽然叫Code，但它的功能绝对不止是写代码，而是一款真正意义上的通用Agent...",
  "title": "Claude Code 是我今年最推荐的AI 产品，没有之...",
  "url": "https://x.com/oran_ge/status/2005425765274533898"
}
```

---

## 实战二：按博主采集内容

想系统性地研究某个 AI 博主都在聊什么？用 `from:` 语法。

### 采集某个博主的 AI 相关推文

```bash
xcrawl search "site:x.com from:dotey AI" --limit 10 --json
```

返回的就是 @dotey 这个账号发布的所有跟 AI 相关的推文。你可以换成任何博主的用户名：

```bash
# Karpathy 的 AI 内容
xcrawl search "site:x.com from:karpathy AI agent" --limit 10 --json

# Andrew Ng 的最新分享
xcrawl search "site:x.com from:AndrewYNg deep learning" --limit 10 --json

# 宝玉的中文 AI 讨论
xcrawl search "site:x.com from:dotey Claude" --limit 10 --json
```

### 批量采集多个博主

这是 Claude Code 真正发力的地方——你不需要一个一个手动跑命令，直接告诉它你的需求：

> "帮我采集以下 AI 博主最近关于 AI Agent 的讨论：@karpathy、@AndrewYNg、@dotey、@levie、@MatthewBerman，每人 10 条，整理成一个 Markdown 表格保存到 ai-bloggers-agent.md"

Claude Code 会自动：
1. 逐个调用 `xcrawl search` 采集每个博主的内容
2. 解析返回的 JSON 数据
3. 整理成表格格式
4. 写入本地文件

一句话下去，5 个博主的 50 条相关推文就整理好了。

---

## 实战三：抓取推文全文

Search API 返回的是摘要（snippet），如果你想看到推文的完整内容，可以用 Scrape API 抓取单条推文页面。

```bash
xcrawl scrape "https://x.com/levie/status/1987269365725901293" --format markdown --json
```

返回结果里会包含推文的完整正文、互动数据（浏览量、转发数、点赞数），以及回复区的内容。

实测示例——Aaron Levie 的一条关于 AI Agent 专业化的长推文，完整内容、7.4 万浏览量、231 转发、203 点赞，全部抓到。

### 批量抓取完整推文

先用 Search 拿到 URL 列表，再用 Scrape 批量抓取全文：

```bash
# 第一步：搜索并提取 URL
xcrawl search "site:x.com AI agent 2026" --limit 20 --json > search_results.json

# 第二步：从结果中提取 URL（用 jq 或让 Claude Code 帮你处理）
# 第三步：批量抓取
xcrawl scrape URL1 URL2 URL3 ... --format markdown --json
```

或者更省事——直接跟 Claude Code 说：

> "搜索 X 上最近关于 AI Agent 的 20 条热门推文，把每条推文的完整内容都抓下来，按热度排序，保存到 ai-agent-tweets.md"

Claude Code 会把搜索、抓取、排序、整理这个完整流程自动串起来。

---

## 实战四：建立系统化的选题素材库

上面的操作都是单次任务。如果你想建立一个持续更新的素材库，可以这样设计流程：

### 定义你关注的话题清单

```markdown
## 我的关注话题
- AI Agent / AI 代理
- Vibe Coding / AI 编程
- Claude Code / Cursor
- RAG / 检索增强生成
- AI 创业 / AI Startup
- Prompt Engineering
```

### 定义你关注的博主清单

```markdown
## 重点关注博主
- @karpathy — 前 Tesla AI 总监，AI 行业风向标
- @AndrewYNg — DeepLearning.AI 创始人，教育向
- @dotey — 中文 AI 圈意见领袖，翻译 + 原创
- @levie — Box CEO，企业 AI 应用视角
- @MatthewBerman — AI 工具评测，实操向
- @oran_ge — 中文 AI 产品推荐
- @shao__meng — Claude Code 深度用户
```

### 让 Claude Code 帮你批量执行

把上面的清单整理成一个文件（比如 `ai-sources.md`），然后跟 Claude Code 说：

> "读取 ai-sources.md 里的话题和博主清单，用 xcrawl 搜索每个话题和博主的最新内容，每个维度采集 10 条，去重后按话题分类整理，生成一份素材周报保存到 weekly-digest-2026-04-02.md"

这就是一个完整的内容研究工作流了。如果你每周跑一次，半年下来就是一个非常有价值的 AI 行业素材数据库。

---

## 几个实用技巧

### 1. 善用搜索语法精准定位

XCrawl 的 Search API 走的是 Google 搜索，所以 Google 的高级搜索语法都能用：

```bash
# 限定 X 平台
site:x.com

# 指定作者
from:username

# 排除转发，只看原创
site:x.com from:karpathy -"RT @"

# 搜索包含链接的推文（通常质量更高）
site:x.com AI agent url:github.com

# 时间范围（Google 语法）
site:x.com "vibe coding" after:2026-01-01
```

### 2. 用 --json 输出方便后续处理

加 `--json` 参数让输出变成机器可读的 JSON 格式，Claude Code 可以直接解析、过滤、排序、统计。

```bash
xcrawl search "site:x.com AI startup" --limit 20 --json
```

### 3. 控制 Credits 消耗

每次 search 和 scrape 都会消耗 credits。建议：

- 先用 `search` 做初筛（消耗少），确认有价值的推文后再用 `scrape` 抓全文（消耗多）
- 用 `--limit` 控制搜索结果数量，不要一次拉太多
- 定期用 `xcrawl status` 检查 credits 余量

### 4. 搜索 vs 抓取：什么时候用哪个

| 需求 | 用什么 | 命令 |
|------|--------|------|
| 发现某个话题有哪些热门推文 | Search | `xcrawl search "site:x.com ..."` |
| 看某个博主最近在聊什么 | Search | `xcrawl search "site:x.com from:xxx"` |
| 获取某条推文的完整内容 | Scrape | `xcrawl scrape "https://x.com/..."` |
| 批量采集推文全文 | Search → Scrape | 先搜索拿 URL，再批量 scrape |

---

## 这套流程解决了什么问题

回到最开始的问题：做 AI 自媒体，选题和素材采集是最耗时的环节。

传统做法：每天花 1-2 小时刷 X，看到好内容截图保存，整理到笔记软件里。效率低，遗漏多，难以系统化。

现在的做法：

1. **5 分钟**定义话题和博主清单
2. **1 句话**让 Claude Code 通过 XCrawl 批量采集
3. **自动生成**结构化的素材文档

从"人肉刷信息流"变成"AI 帮你定向采集"。省下来的时间，用来做真正有价值的事——**思考、提炼观点、输出内容**。

这才是 Claude Code Skill 系统的正确打开方式：不是让 AI 替你思考，而是让 AI 帮你把机械性的工作自动化，把你的时间还给创造性的工作。

---

> XCrawl 注册送 1,000 免费 credits，不用绑卡。如果你也在做 AI 相关的内容创作，建议试试这套工作流，你会发现素材采集这件事，真的可以从"体力活"变成"一句话的事"。
