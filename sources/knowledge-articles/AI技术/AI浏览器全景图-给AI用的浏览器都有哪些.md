# AI 浏览器全景图：给 AI 用的浏览器都有哪些？

你可能已经注意到了一个趋势：AI 不再只是帮你聊天、写文案、生成图片，它开始自己上网了。

打开浏览器、点击按钮、填写表单、跨页面跳转——这些你每天做的事情，AI 正在学着自己完成。而为了让 AI 能高效地"上网"，一整个新赛道正在爆发。

这篇文章帮你理清楚：2026 年，给 AI 用的浏览器和自动化工具，到底有哪些？它们各自在解决什么问题？

## 为什么 AI 需要专门的浏览器？

你可能会问，AI 直接用 Playwright 或 Selenium 操控浏览器不就行了？

理论上可以，但实际操作中有三个核心问题：

**1. 反爬和反机器人检测**。现代网站越来越擅长识别自动化访问——Cloudflare、reCAPTCHA、行为分析……传统的 headless 浏览器一打开就被封。AI 浏览器需要内置反检测能力。

**2. Token 消耗太高**。如果让 AI 通过截图理解网页，一张截图就是上千 token。把整个 DOM 树塞给大模型，更是天文数字。AI 浏览器需要高效的内容提取和精简机制，把网页"翻译"成大模型能高效消费的格式。

**3. 规模化运行**。一个 AI Agent 同时操控 100 个浏览器会话，本地机器扛不住。云端浏览器基础设施应运而生。

理解了这三个问题，你就能看懂整个赛道的分层。

## 四层架构：从底层到应用

我把目前的 AI 浏览器生态分成四层：

```
┌─────────────────────────────────────────────┐
│  第四层：AI 浏览器 Agent 产品                  │
│  OpenAI Operator · Google Mariner · Manus    │
├─────────────────────────────────────────────┤
│  第三层：AI 浏览器自动化框架                    │
│  Browser Use · Stagehand · Skyvern · AgentQL │
├─────────────────────────────────────────────┤
│  第二层：云端浏览器基础设施                      │
│  Browserbase · Steel · Hyperbrowser · Anchor │
├─────────────────────────────────────────────┤
│  第一层：浏览器自动化协议                        │
│  Playwright · Puppeteer · Selenium · CDP      │
└─────────────────────────────────────────────┘
```

从下往上，越底层越通用，越上层越"智能"。我们逐层拆解。

---

## 第一层：浏览器自动化协议

这一层是地基。所有上层工具，几乎都跑在这几个框架之上。

### Playwright（微软）

目前 AI 浏览器自动化领域的事实标准。支持 Chromium、Firefox、WebKit 三大引擎，一套 API 通吃。

2026 年最重要的更新是 **Playwright MCP**——微软官方推出的 MCP Server，能把浏览器的无障碍访问树（Accessibility Tree）直接推送给 AI Agent。相比截图方案，token 消耗降低约 4 倍。GitHub Copilot 已经内置了 Playwright MCP。

- 开源协议：Apache 2.0
- GitHub Stars：82,700+
- 官网：playwright.dev

### Puppeteer（Google）

Node.js 生态中最成熟的浏览器自动化库，专注 Chrome/Chromium。生态庞大，但仅支持 Chromium 是它的局限。同样已推出 MCP Server 供 AI Agent 接入。

- GitHub Stars：93,600+
- 官网：pptr.dev

### Selenium

最老牌的浏览器自动化框架，2004 年诞生。Selenium 5 开始引入 AI 能力——自愈型定位器（self-healing locators），当页面 UI 变化时能自动适应，据称可减少约 40% 的构建失败。支持 Java、Python、C#、Ruby、JavaScript 五种语言。

但说实话，在 AI Agent 的场景下，Selenium 正在被 Playwright 全面取代。

### Lightpanda（新秀）

用 Zig 语言从零构建的 headless 浏览器，不是 Chromium 的魔改版。专门为 AI 和自动化场景设计：比 Chrome Headless 快 11 倍，内存占用低 9 倍，服务器成本降低 82%。

秘诀是跳过了所有渲染——不解析 CSS、不解码图片、不走 GPU 合成。对 AI 来说，反正也不需要"看到"页面长什么样。兼容 Playwright/Puppeteer 的 CDP 协议。

- 开源，GitHub Stars：23,000+
- 官网：lightpanda.io

---

## 第二层：云端浏览器基础设施

这一层解决的核心问题：**让 AI Agent 在云端大规模运行浏览器，不被封，不崩溃。**

这是一个"浏览器即服务"（Browser-as-a-Service）市场。

### Browserbase

这个赛道目前融资最多的公司，2025 年 6 月完成 4000 万美元 B 轮，估值 3 亿美元。

核心卖点：隐身模式（反检测）、CAPTCHA 自动解决、代理轮转、会话持久化（保持登录状态）。2025 年处理了超过 5000 万个浏览器会话。兼容 Playwright/Puppeteer/Selenium。

同时也是 Stagehand（后面会讲）的母公司。

- 定价：免费版 1 小时/月 | 开发者 $20/月 100 小时 | 创业公司 $99/月 500 小时
- 官网：browserbase.com

### Steel

开源的 headless 浏览器 API。亚秒级启动，会话最长 24 小时，内置 CAPTCHA 解决和反检测。最大亮点是内容提取优化——能把发送给大模型的 token 数量减少最多 80%。

可以自部署，也有托管云服务。

- 开源，GitHub Stars：6,500+
- 免费版：100 浏览器小时/月
- 官网：steel.dev

### Hyperbrowser

YC 投资的云端浏览器平台。支持 10,000+ 并发浏览器，亚秒级启动，99.9% 以上正常运行时间。内置住宅代理网络轮转。

还推出了自己的 AI 自动化框架 HyperAgent，支持自然语言指令。

- 定价：免费版 1,000 积分 | Startup $30/月
- 官网：hyperbrowser.ai

### Anchor Browser

以色列创业公司，专注企业级场景。最大差异化：支持 VPN 集成和企业身份认证（Okta、Azure AD），能让 AI Agent 访问企业内网系统。这是其他云端浏览器很少涉足的领域。

给 Groq 的 Agent 平台提供底层支持。

- 定价：$0.05/小时起
- 官网：anchorbrowser.io

### Browserless

较早期的玩家，Headless Chrome 即服务。现在已经加入了对 CrewAI 和 Stagehand 的原生集成。

- 定价：免费版 1,000 单位 | Starter $50/月
- 官网：browserless.io

---

## 第三层：AI 浏览器自动化框架

这一层是当前竞争最激烈的战场。这些框架在浏览器之上加了一层 AI 推理能力——你不需要写 CSS 选择器来找按钮，直接告诉 AI"点击登录按钮"就行。

### Browser Use ⭐

目前最火的开源 AI 浏览器 Agent 框架，GitHub 78,000+ Stars。YC W25 批次，融了 1700 万美元种子轮。

支持 Python 和 TypeScript，模型无关（OpenAI、Anthropic、Google、本地模型都行）。核心技术是 DOM 蒸馏——把网页 DOM 精简到大模型能高效处理的程度。WebVoyager 基准测试得分 89.1%，目前公开评测中的最高分之一。

一个简单的例子：

```python
from browser_use import Agent
import asyncio

async def main():
    agent = Agent(
        task="去京东搜索MacBook Pro，找到价格最低的在售商品，截图保存",
        llm=ChatOpenAI(model="gpt-4o"),
    )
    result = await agent.run()

asyncio.run(main())
```

就这么几行代码，AI 会自己打开浏览器、搜索、浏览、比价、截图。

- 开源，GitHub Stars：78,000+
- 官网：browser-use.com

### Stagehand（Browserbase 出品）

Browserbase 推出的 AI 浏览器自动化 SDK，TypeScript 优先。GitHub 50,000+ Stars，是 2025-2026 年增长最快的开源 AI 项目之一。

设计哲学很优雅——三个核心原语：

- `act()`：执行操作（点击、输入、滚动）
- `extract()`：提取结构化数据
- `observe()`：观察页面状态

加上一个高层级的 Stagehand Agent 处理复杂任务。

最巧妙的设计是**自动缓存 + 自愈**：它会记住之前的操作路径，下次执行时跳过 LLM 调用直接执行；当网站改版导致路径失效时，才重新调用 AI 推理。v3 版本速度提升了 44%。

- 开源，GitHub Stars：50,000+
- 官网：stagehand.dev

### Skyvern

视觉优先的方案。不依赖 HTML 选择器，而是给网页截图，用 Vision-LLM（GPT-4o、Claude）来理解页面。像人一样"看"网页。

好处是对 UI 变化极其鲁棒——页面改版了也不怕，反正是"看"而不是"解析"。代价是更慢、更贵（每一步都要消耗视觉模型的 token）。

还有一个拖拽式的无代码工作流构建器。

- 开源（AGPL-3.0），GitHub Stars：14,000+
- 定价：免费版 1,000 积分/月 | Hobby $29/月 | Pro $149/月
- 官网：skyvern.com

### AgentQL

不走通用 Agent 路线，而是解决一个具体痛点：**用自然语言替代 CSS/XPath 选择器**。

传统爬虫最头疼的就是选择器一换页面就挂。AgentQL 用语义理解来定位元素——你告诉它"找到价格"，它就能在不同网站上找到价格，不管 class 名叫什么。

- 开源 SDK + 商业 API
- 定价：免费版 1,200 次调用/月 | Pro $99/月
- 官网：agentql.com

### Agent Browser（Vercel Labs）

Vercel 出品，Rust 构建的 CLI 工具。核心创新是 Snapshot + Refs 系统——给页面元素分配稳定的引用标识符（@e1, @e2），让 AI 模型能精确地引用和操控元素。

专门为 AI 编程助手（如 Claude Code）设计。

- 开源，GitHub Stars：14,000+
- GitHub：github.com/vercel-labs/agent-browser

---

## 第四层：AI 浏览器 Agent 产品

这一层面向终端用户——你不需要写代码，直接告诉 AI 你想做什么，它帮你在网上完成。

### OpenAI Operator / ChatGPT Agent

OpenAI 2025 年 1 月推出 Operator，8 月并入 ChatGPT 成为"Agent 模式"。底层是 CUA（Computer-Using Agent）模型——GPT-4o 视觉能力 + 强化学习。

在专用的云端浏览器中运行，用户可以实时监控和干预。WebVoyager 得分 87%。

- ChatGPT Pro $200/月完整使用 | Plus $20/月有限使用

### Google Project Mariner

基于 Gemini 2.0 的浏览器 Agent 研究原型。以 Chrome 扩展形式运行，能同时处理 10 个任务。WebVoyager 得分 83.5%。

目前仅面向美国 Google AI Ultra 订阅者开放，正在集成到 Gemini API。

### Anthropic Computer Use / Claude Cowork

Anthropic 的方案比较独特——不仅仅是浏览器控制，而是**整台电脑的控制**。Claude 可以打开应用、操控浏览器、编辑表格、运行开发工具。

2024 年 10 月推出 beta，2026 年 1 月推出 Claude Cowork，定位"数字同事"。这是所有方案中覆盖范围最广的，但也因此在纯浏览器场景下不一定最精准。

- Claude Pro $20/月

### Amazon Nova Act

AWS 推出的浏览器自动化 Agent SDK。背后是定制的 Nova 2 Lite 模型，专攻高可靠性——在日期选择器、下拉菜单、弹窗等棘手 UI 交互上，追求 90% 以上的成功率。

ScreenSpot Web Text 基准测试 93.9%。支持自然语言 + Python 代码混合编写。

- AWS 按量计费
- 官网：aws.amazon.com/nova/act

### Manus

2025 年现象级产品。作为浏览器扩展运行在你本地浏览器上，用你已有的登录状态和会话。这意味着不需要重新登录任何网站，也不会被反爬检测拦截（因为用的是你真实的浏览器环境和 IP）。

AI 推理在云端完成，但浏览器操作在本地执行。目前已被 Meta 收购。

### Convergence Proxy

伦敦公司 Convergence AI 开发，用独创的 LMLM（Large Meta Learning Model）和生成式树搜索。WebVoyager 得分 88%，上线两周就有 25,000 用户和 150,000 次自动化操作。

2025 年 5 月被 Salesforce 收购，集成到 Agentforce 平台。开放了轻量级的 Proxy Lite 3B 模型。

---

## 两种技术路线之争

在所有这些产品中，存在一个根本性的技术路线分歧：

### 路线一：DOM/结构化数据

代表：Playwright MCP、Browser Use、Stagehand

通过解析 DOM 树或无障碍访问树，把网页转化成结构化文本给 AI。

- 优势：快、便宜（token 少）、精确
- 劣势：复杂的视觉布局可能丢失信息，纯图片/Canvas 页面束手无策

### 路线二：视觉/截图

代表：Skyvern、OpenAI CUA、Convergence Proxy

给网页截图，让视觉大模型"看"网页。

- 优势：对 UI 变化鲁棒，能处理任何可视内容
- 劣势：慢、贵（每步都消耗大量视觉 token），偶尔会"看错"

**趋势是融合**。越来越多的工具采用混合方案——优先用 DOM 提取，遇到复杂视觉场景时回退到截图。

---

## 怎么选？

根据你的场景：

| 你想做什么 | 推荐方案 |
|-----------|---------|
| 给自己的 AI Agent 加上浏览器能力 | Browser Use 或 Stagehand |
| 大规模运行浏览器爬虫 | Browserbase 或 Steel + Playwright |
| 不写代码，让 AI 帮你上网办事 | ChatGPT Agent 或 Claude Computer Use |
| 企业内网自动化 | Anchor Browser |
| 追求极致性能和低成本 | Lightpanda + Browser Use |
| 需要高可靠性的表单填写 | Amazon Nova Act |

---

## 这个市场有多大？

据预测，AI 浏览器自动化市场将从 2026 年的 45 亿美元增长到 2034 年的 768 亿美元，年复合增长率 32.8%。

推动力来自三个方面：

1. **大模型够强了**。GPT-4o、Claude、Gemini 2.5 的推理和视觉能力，让 AI 真的能"理解"网页。
2. **云端浏览器基础设施成熟了**。Browserbase 等平台让规模化运行浏览器不再是工程噩梦。
3. **MCP 协议成为标准**。2025 年 12 月 Anthropic 把 MCP 捐赠给 Linux 基金会，成为 AI Agent 连接外部工具的行业标准。浏览器是 MCP 最重要的连接对象之一。

---

## 写在最后

两年前，"AI 上网"还是一个科幻概念。今天，这个领域已经有了完整的产业链——从底层协议到云端基础设施，从开发框架到终端产品，从开源社区到风投热钱。

对开发者来说，现在是入场的好时机。Browser Use 和 Stagehand 这样的开源框架降低了门槛，几行代码就能让你的 AI 应用获得浏览器能力。

对普通用户来说，AI 帮你上网办事已经从"能用"进入了"好用"阶段。

唯一可以确定的是：AI 会越来越多地代替你点击、滚动、填写、搜索。你的浏览器，正在变成 AI 的浏览器。
