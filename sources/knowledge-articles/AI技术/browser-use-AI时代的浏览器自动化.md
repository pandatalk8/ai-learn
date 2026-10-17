# browser-use：给 AI 一个真正的浏览器

2024 年 10 月底，两个苏黎世联邦理工（ETH Zurich）的数据科学硕士——Magnus Muller 和 Gregor Zunic——在学校的 Student Project House 里写了一个 Python 库。Magnus 用四天时间撸出了 MVP，扔到 Hacker News 上。

帖子冲到了第一名。三个月后，GitHub Star 数突破五万。

这个项目叫 browser-use。它做的事情用一句话就能说清楚：**让 AI Agent 能像人一样操控浏览器——打开网页、点击按钮、填写表单、切换标签页、提取内容。**

截至 2026 年 6 月，browser-use 在 GitHub 上有 97,000+ Star，315 位贡献者，126 个版本迭代。它拿到了 Y Combinator W25 的入场券，2025 年 3 月完成了 1700 万美元种子轮融资，由 Felicis Ventures 领投，Paul Graham 个人参投。

这篇文章拆解 browser-use 的方方面面——开源项目的技术架构、云服务的商业能力、定价逻辑、以及它在一众竞品中的位置。

---

## 一、为什么需要 AI 浏览器自动化？

传统的浏览器自动化工具——Selenium、Puppeteer、Playwright——已经存在很多年了。它们靠 CSS 选择器和 XPath 定位元素，用脚本驱动操作。问题是什么？

**脆。**

网站改了一个按钮的 class 名，你的脚本就挂了。据 browser-use 团队引用的数据，传统自动化脚本在 30 天内的维护率高达 15%-25%——每四个脚本就有一个会因为前端改版而失效。

AI 驱动的方式完全不同。你不告诉它"点击 `#submit-btn`"，你告诉它"提交这个表单"。它自己看页面、理解布局、找到按钮、点击。前端改了？它重新看一遍，照样能找到。

**browser-use 的维护率不到 5%。** 代价是什么？每次操作需要调用 LLM，单次任务的 API 费用在 $0.02 到 $0.30 之间，执行速度也从传统脚本的 1-5 秒拉长到 15-45 秒。

这是一笔取舍：用速度和成本换可靠性和零维护。对于高频、结构固定的任务，传统脚本仍然更合适；对于结构多变、一次性、或者需要理解语义的任务，AI 方案碾压。

---

## 二、核心架构：Agent 循环

browser-use 的核心是一个 Agent 循环。理解了这个循环，就理解了它为什么能工作。

```
┌─────────────────────────────────────────────────────────┐
│                     Agent 主循环                         │
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │ 1. 感知   │───►│ 2. 决策   │───►│ 3. 执行   │         │
│  │ 页面状态   │    │ LLM 推理  │    │ 浏览器操作  │         │
│  └──────────┘    └──────────┘    └──────────┘          │
│       ▲                                  │              │
│       │          状态更新                  │              │
│       └──────────────────────────────────┘              │
│                                                         │
│  循环终止条件：Agent 调用 done() 或达到步数上限            │
└─────────────────────────────────────────────────────────┘
```

每一轮循环分三步：

**第一步，感知。** browser-use 用"双通道"方式理解当前页面：

- **DOM 语义树**——`DomService` 把原始 HTML 转化为精简的结构化文本，过滤掉不可交互的元素，给每个可交互元素分配一个数字编号（从 1 开始）。这样 LLM 拿到的不是一坨 HTML，而是一份干净的"页面菜单"。
- **截图 + 视觉标注**——当 `use_vision=True` 时，系统同时截取页面截图，在可交互元素上叠加彩色边框和数字编号。这让 LLM 能理解空间布局，处理那些光靠 DOM 文本无法判断的场景（比如没有 label 的输入框）。

**第二步，决策。** `MessageManager` 把当前页面状态、任务描述、历史操作记录打包成 prompt，发给 LLM。LLM 返回结构化的动作指令。

**第三步，执行。** `Controller` 把 LLM 的指令翻译成 Playwright 操作，驱动浏览器完成动作。如果标准操作失败（比如 React/Vue 组件拦截了原生点击事件），系统会自动降级到 JavaScript 事件派发。

执行完成后，系统重新截图、重新提取 DOM，回到第一步。如此循环，直到 Agent 判断任务完成并调用 `done()`。

系统还内置了**死循环检测**——如果 Agent 反复执行相同操作，它会识别并跳出。

---

## 三、动作空间：Agent 能做什么？

browser-use 内置了一套完整的浏览器操作原语：

| 动作 | 功能 | 说明 |
|------|------|------|
| `go_to_url(url, new_tab)` | 导航 | 支持在新标签页中打开 |
| `go_back` | 后退 | 浏览器历史后退 |
| `click_element_by_index(index)` | 点击 | 通过元素编号点击，支持 Ctrl+点击 |
| `input_text(index, text)` | 输入 | 向指定输入框填写文字，可选清空已有内容 |
| `scroll_down` / `scroll_up` | 滚动 | 页面或特定元素滚动 |
| `send_keys(keys)` | 键盘操作 | 发送 Enter、Escape、Tab、PageDown 等 |
| `switch_tab(tab_id)` | 切换标签页 | 多标签页操作 |
| `close_tab(tab_id)` | 关闭标签页 | — |
| `extract_page_content` | 提取内容 | 获取页面文本或结构化数据 |
| `done(text, success)` | 完成任务 | 标记任务结束并返回结果 |

这些是"低级"操作，你也可以通过自定义 Action 扩展能力——后面会讲。

---

## 四、LLM 支持：15+ 提供商，一行代码切换

browser-use 不绑定任何特定的 LLM。它通过统一接口支持几乎所有主流模型：

| 提供商 | 接入方式 | 代表模型 |
|--------|---------|---------|
| Browser Use 自研 | `ChatBrowserUse()` | bu-2-0（专为浏览器操作优化的模型） |
| OpenAI | `ChatOpenAI()` | gpt-5、gpt-5-mini |
| Anthropic | `ChatAnthropic()` | claude-sonnet-4-6、claude-opus-4-6 |
| Google | `ChatGoogle()` | gemini-2.5-flash |
| DeepSeek | `ChatDeepSeek()` | deepseek-chat |
| Ollama（本地） | `ChatOllama()` | llama3.1:8b |
| OpenRouter | `ChatOpenRouter()` | 300+ 模型 |
| Azure / AWS Bedrock | 各自 SDK | 企业级部署 |
| 任意 OpenAI 兼容接口 | `ChatOpenAI(base_url=...)` | 自定义端点 |

切换模型就是换一行代码：

```python
# 用 OpenAI
llm = ChatOpenAI(model="gpt-5")

# 换成 Claude
llm = ChatAnthropic(model="claude-sonnet-4-6")

# 换成本地 Ollama
llm = ChatOllama(model="llama3.1:8b")

# 用 browser-use 自研模型
llm = ChatBrowserUse()
```

2026 年 1 月，browser-use 发布了自研的 Browser Use Model（BU 2.0），一个 300 亿参数的模型，专门为浏览器操作场景优化，准确率提升了 12%。同年 12 月还开源了他们的第一个浏览器操作语言模型。

---

## 五、代码实战：从零开始跑一个 Agent

### 安装

```bash
pip install uv
uv venv --python 3.12
source .venv/bin/activate
uv pip install browser-use
uvx browser-use install  # 安装 Playwright 浏览器
```

在 `.env` 文件中配置 API Key：

```
OPENAI_API_KEY=sk-your-key
# 或者
ANTHROPIC_API_KEY=sk-ant-your-key
```

### 最简示例

```python
from browser_use import Agent, ChatOpenAI
from dotenv import load_dotenv
import asyncio

load_dotenv()

async def main():
    agent = Agent(
        task="去 Hacker News 找到 Show HN 板块排名第一的帖子",
        llm=ChatOpenAI(model="gpt-5"),
    )
    result = await agent.run()
    print(result)

asyncio.run(main())
```

就这么多。Agent 会自动打开浏览器、导航到 Hacker News、找到 Show HN、提取第一个帖子的信息。

### 开启视觉模式

```python
agent = Agent(
    task="在 Google Flights 上比较旧金山到纽约的机票价格",
    llm=ChatGoogle(model="gemini-2.5-flash"),
    use_vision=True,  # Agent 会同时"看"截图
)
```

视觉模式让 Agent 能处理纯 DOM 难以理解的复杂布局——日历选择器、地图界面、图表等。

### 自定义 Action：扩展 Agent 能力

这是 browser-use 最强大的扩展点。你可以用装饰器定义新的工具，Agent 在执行任务时会自动调用：

```python
from browser_use import Agent, Tools, ActionResult, ChatOpenAI

tools = Tools()

@tools.action(description="将产品列表保存到本地 JSON 文件")
def save_products(products: list[dict]) -> str:
    import json
    with open("products.json", "w") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    return f"已保存 {len(products)} 个产品"

agent = Agent(
    task="去亚马逊搜索 wireless headphones，提取前五个结果并保存",
    llm=ChatOpenAI(model="gpt-5"),
    tools=tools,
)
```

自定义 Action 还支持注入浏览器上下文——通过参数名匹配 `browser_session`、`cdp_client`、`page_extraction_llm` 等，你可以在自定义逻辑中直接操作浏览器底层。

---

## 六、基准测试：到底有多准？

browser-use 在 WebVoyager 基准测试上（586 个多样化网页任务，使用 GPT-4o）取得了 **89.1% 的成功率**：

| 网站 | 成功率 | 平均步数 |
|------|--------|---------|
| Hugging Face | 100% | 9.7 |
| Google Flights | 95% | — |
| Amazon | 92% | — |
| GitHub | 92% | — |
| Apple | 91% | — |
| BBC News | 91% | — |
| Booking.com | 80% | 32.7 |

Booking.com 拖了后腿——复杂的日期选择器、动态加载、反爬策略让 Agent 平均需要 32.7 步才能完成任务。

2026 年 3 月，browser-use 在 Online-Mind2Web 基准上达到了 **97%**。但需要客观地说：WebVoyager 基准已经趋于饱和，商业竞品 Surfer 2 达到了 97.1%，Magnitude 达到 93.9%。在更难的 ClawBench 真实环境测试中，最好的 Agent 也只有约 33% 的成功率。

**基准分数不代表一切，但 browser-use 的表现稳定在第一梯队。**

---

## 七、browser-use Cloud：从开源到商业

开源版本你自己部署浏览器、管理基础设施、处理反爬。browser-use Cloud 把这些全部托管了。

### 核心能力

| 能力 | 说明 |
|------|------|
| **隐身浏览器** | 定制的 Chromium 分支，内置反指纹、反检测，自动绕过 Cloudflare |
| **CAPTCHA 自动处理** | 内置验证码识别，大多数场景下 CAPTCHA 根本不会触发 |
| **全球代理** | 195+ 国家的住宅 IP 代理，默认开启 |
| **并发执行** | 最高 500 个并发浏览器会话（Scaleup 计划） |
| **实时预览** | 每个任务生成 `live_url`，可以实时观看 Agent 操作 |
| **人工介入** | 通过 live_url 随时接管浏览器，处理登录、敏感操作 |
| **会话录制** | 全程录制，支持确定性重放（零 LLM 成本回放相同操作） |
| **浏览器档案** | 云端持久化 Chrome Profile，保存登录态和 Cookie |

### Skills：把网站操作变成 API

2025 年 12 月发布的 Skills 功能值得单独说。

你用自然语言描述一个网站交互流程，browser-use 把它编译成一个可重复调用的 API 端点。比如"登录 LinkedIn，搜索某个职位，提取前 20 条结果"——这个流程变成一个 REST 接口，后续调用不需要 AI 重新理解页面，直接执行确定性脚本。

**这解决了 AI 自动化最大的痛点：可重复性。** 第一次用 AI 理解和探索，之后用脚本稳定执行。

### Code Mode

2026 年 6 月刚推出。Agent 完成一个任务后，自动生成可复用的 Python/JavaScript 脚本。你可以拿这个脚本去做批量执行，不再依赖 LLM。

### Browser Use Box

持久化的云端浏览器环境，按天计费：

| 规格 | 价格 |
|------|------|
| Small | $1/天 |
| Medium | $2/天 |
| Large | $4/天 |

适合需要长时间运行的监控任务或持久化会话。

---

## 八、Cloud 定价详解

### 订阅计划

| 计划 | 月费 | 含 Credit | 并发数 | 团队人数 |
|------|------|----------|--------|---------|
| Free | $0 | — | 3 | 1 |
| Dev | $29 | $29 | 25 | 5 |
| Business | $299 | $299 | 200 | 不限 |
| Scaleup | $999 | $999 | 500 | 不限 |
| Enterprise | 定制 | 定制 | 定制 | 不限 |

年付打折：按 10 个月的价格买 12 个月。新用户注册送 $10 Credit，无需绑卡。

### 按量计费

| 项目 | 价格 |
|------|------|
| 浏览器会话 | $0.02/小时（按分钟计费） |
| 代理带宽 | $5/GB（Scaleup 低至 $4/GB） |
| Claude Sonnet 4.6 | 输入 $3.60/百万 token，输出 $18.00/百万 token |
| Claude Opus 4.6 | 输入 $6.00/百万 token，输出 $30.00/百万 token |
| GPT-5.4 mini | 输入 $0.90/百万 token，输出 $5.40/百万 token |

### BYOK（自带 Key）

如果你已经有 OpenAI 或 Anthropic 的 API Key，可以直接用自己的——browser-use 只收 0.2 倍的编排费用。比如你用 Claude Sonnet，Anthropic 收你 $3/百万 token 输入，browser-use 额外收 $0.60。

**对于高频用户来说，BYOK 模式能显著降低成本。**

---

## 九、Cloud SDK：代码接入

### Python SDK

```bash
pip install browser-use-sdk
```

```python
from browser_use_sdk.v3 import AsyncBrowserUse
import asyncio

async def main():
    client = AsyncBrowserUse()  # 自动读取 BROWSER_USE_API_KEY 环境变量
    result = await client.run(
        "去 GitHub Trending 找到今天排名前三的 Python 项目"
    )
    print(result.output)

asyncio.run(main())
```

### REST API

```bash
curl -X POST https://api.browser-use.com/api/v3/sessions \
  -H "X-Browser-Use-API-Key: bu_your_key" \
  -H "Content-Type: application/json" \
  -d '{"task": "搜索 Google 并提取第一页结果"}'
```

返回 `task_id`、`status` 和 `live_url`——你可以用这个 URL 实时观看 Agent 操作。

### 两种模式

| 模式 | 接口 | 适用场景 |
|------|------|---------|
| Agent 模式 | `sessions.create()` / `run()` | 自然语言驱动，AI 自主决策 |
| Browser 模式 | `browsers.create()` | 原始 CDP 连接，配合 Playwright/Puppeteer 使用 |

Browser 模式适合那些已经有 Playwright 脚本、只想用 browser-use Cloud 的隐身浏览器和代理能力的团队。

---

## 十、开源 vs Cloud：怎么选？

| 维度 | 开源版 | Cloud |
|------|--------|-------|
| 成本 | 只付 LLM API 费用 | 订阅 + 按量 |
| 会话时长 | 无限制 | 单次最长 15 分钟 |
| 模型选择 | 任意，包括本地 Ollama | Claude / GPT 系列 |
| 反爬/隐身 | 自己处理 | 内置，定制 Chromium |
| CAPTCHA | 自己解决 | 自动处理 |
| 代理 IP | 自备 | 195+ 国家住宅 IP |
| 并发扩展 | 受限于你的机器 | 最高 500 并发 |
| 数据主权 | 数据留在本地 | 经过 browser-use 服务器 |
| 合规 | 自行负责 | SOC 2 Type II |
| 适合谁 | 开发者、技术团队、隐私敏感场景 | 需要规模化、无运维、反爬能力的团队 |

**一句话总结：小规模自用选开源，规模化生产选 Cloud。**

---

## 十一、竞品对比

### vs 传统自动化（Playwright / Selenium / Puppeteer）

| 维度 | browser-use | Playwright 等 |
|------|-------------|---------------|
| 驱动方式 | LLM 推理 | 确定性脚本 |
| 定位元素 | AI 理解语义 | CSS/XPath 选择器 |
| 30 天维护率 | <5% | 15%-25% |
| 单次执行速度 | 15-45 秒 | 1-5 秒 |
| 单次执行成本 | $0.02-0.30 | $0 |
| 上手难度 | 自然语言描述任务 | 编写脚本 |
| UI 变更适应 | 自动适应 | 脚本失效 |

### vs Stagehand

Stagehand 是 TypeScript 生态的竞品，思路不同——它只暴露三个原语：`act()`、`extract()`、`observe()`，让开发者组合使用。browser-use 是全自主的 Agent 循环。

| 维度 | browser-use | Stagehand |
|------|-------------|-----------|
| 语言 | Python | TypeScript |
| 设计哲学 | 全自主 Agent | 开发者组合原语 |
| 单次成本 | $0.02-0.30 | $0.002-0.02 |
| WebVoyager | ~89% | ~75% |
| GitHub Star | ~97K | ~10K |
| 选择器缓存 | 无 | 有（成功操作自动缓存，后续跳过 LLM） |

Stagehand 的选择器缓存是个亮点——第一次用 AI 找到元素后，后续执行直接复用缓存，不调 LLM。browser-use 的 Skills 功能走的是类似的路线，但在 Cloud 层面实现。

**生产环境的最佳实践：混合使用。** 80% 可预测的步骤用 Playwright 硬编码，20% 需要语义理解的步骤用 browser-use 兜底。

---

## 十二、生态系统

browser-use 已经不只是一个 Python 库，它是一个完整的生态：

| 项目 | Star | 定位 |
|------|------|------|
| browser-use | 97K+ | 核心库 |
| web-ui | 16K+ | 浏览器中运行 AI Agent 的前端界面 |
| workflow-use | 4K+ | 工作流编排，"RPA 2.0" |
| macOS-use | 1.9K+ | 让 AI 操控 Mac 应用 |
| vibetest-use | 798 | AI 驱动的 QA 自动化测试 |
| agent-sdk | 685 | Agent 开发 SDK |
| browser-use-node | 30 | Node.js SDK |

workflow-use 值得关注——它是 browser-use 之上的工作流层，可以把多个浏览器任务编排成复杂的自动化流程，定位直指传统 RPA 工具（UiPath、Automation Anywhere）。

---

## 最后

browser-use 的野心很大。Magnus Muller 在融资公告里说过一句话："自动化的工作流在网络上的数量将超过人类交互。"

这话放在 2024 年听起来像吹牛。但看看 browser-use 的增长曲线——四天 MVP，三个月五万 Star，一年不到近十万 Star——你很难不认真对待它。

**开源版免费、MIT 协议、十五行代码跑起来。Cloud 版注册送 $10 Credit，不绑卡。不管你想用哪个版本，试一次的成本几乎为零。**
