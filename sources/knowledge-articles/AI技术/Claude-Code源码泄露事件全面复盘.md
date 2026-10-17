# Claude Code 源码泄露事件全面复盘：51 万行代码裸奔 48 小时里发生了什么

> 2026 年 3 月 31 日，Anthropic 的旗舰 AI 编程工具 Claude Code 的完整源码意外泄露。1,900 个文件、512,000 行 TypeScript 代码，因为一个 npm 打包配置失误，在全网裸奔。这篇文章用公开信息还原这 48 小时里到底发生了什么，以及这些源码暴露了 Anthropic 的哪些秘密。

---

## 第一幕：一个 .map 文件引爆全网

### 怎么泄露的？

故事的起因极其简单——一个本不该出现在生产包里的 source map 文件。

Claude Code 的 CLI 工具通过 npm 分发（包名 `@anthropic-ai/claude-code`）。正常情况下，npm 包里只包含编译压缩后的 `cli.js`（约 12MB），不包含原始 TypeScript 源码。但 Anthropic 的工程师在某次更新时，忘了把 `.map` 文件从发布物中排除。

> "A single misconfigured .npmignore or files field in package.json can expose everything."
> —— [The Register 报道](https://www.theregister.com/2026/03/31/anthropic_claude_code_source_code/)

更精确地说，Claude Code 使用 Bun 将 JavaScript 编译成独立的二进制可执行文件。Bun 在编译时默认会嵌入 source map。那个 57MB 的 `cli.js.map` 文件里，藏着 4,756 个源文件的完整内容——其中 1,906 个是 Claude Code 自身的 TypeScript/TSX 源码，剩下 2,850 个是 `node_modules` 依赖。

有人下载了这个 map 文件，用标准工具还原出了完整的源码目录结构。然后上传到了 GitHub。

### 时间线

根据 X 上的讨论和媒体报道，事件大致经过如下：

**3 月 31 日上午** — 有开发者在 npm 包中发现了异常的 `.map` 文件，还原出 Claude Code 完整源码。消息开始在技术社区传播。

**3 月 31 日中午** — 源码被上传到 GitHub，多个 fork 出现。X 上 #ClaudeCode 话题开始爆发。[@Gorden_Sun](https://x.com/Gorden_Sun/status/2038907120637317346) 最早确认这是真实的新版源码（支持 `claude-opus-4-6`）。[@ZHO_ZHO_ZHO](https://x.com/ZHO_ZHO_ZHO/status/2038995661962744317) 的反应代表了很多开发者的心态："觉也别睡了，逐行学习！"

**3 月 31 日下午** — Anthropic 开始发出 DMCA 删除通知，GitHub 上的 mirror 陆续被下架。但源码传播速度远超法务反应速度。有开发者向 Anthropic 提出质疑：

> "You filed a DMCA takedown notice of my personal Claude Code repo…"
> —— [@robertmclaws](https://x.com/robertmclaws/status/2039129333428871463)

**3 月 31 日晚间** — 各路技术大佬开始发布深度分析。[@evilcos](https://x.com/evilcos/status/2039137097295307122) 带着三个问题读完了 51.2 万行代码；[@dotey](https://x.com/dotey/status/2039020301434909095) 把源码跑了起来并[分析了反蒸馏机制](https://x.com/dotey/status/2039042306871906655)；[Latent Space](https://x.com/latentspacepod/status/2039227555132354802) 发布了社区发现的 mega-compilation。

**4 月 1 日** — Claude Code [负责人公开回应](https://x.com/hungryturbo/status/2039370190614618244)："错误在所难免。重要的是要认识到这绝不是个人的错，而是流程、文化或基础设施的问题。" [@dotey 澄清](https://x.com/dotey/status/2039173976275009799)泄露原因不是 Bun 的锅，而是开发者配置失误。同日，已有团队[用 Python 和 Rust 重写](https://x.com/GitHub_Daily/status/2039003264637886698)了 Claude Code 的核心功能，GitHub fork 数量[突破 88.5K](https://x.com/support_huihui/status/2039289919508746492)。

**4 月 1 日晚间** — [@kevincodex](https://x.com/kevincodex/status/2039000379724341292) 宣布社区 fork 已经支持接入任意 LLM。[@aigclink](https://x.com/aigclink/status/2039163692873650600) 发布反封号工具 cc-gateway。[The Hacker News](https://thehackernews.com/2026/04/claude-code-tleaked-via-npm-packaging.html)、[Ars Technica](https://arstechnica.com/ai/2026/03/entire-claude-code-cli-source-code-leaks-thanks-to-exposed-map-file/)、[The Register](https://www.theregister.com/2026/03/31/anthropic_claude_code_source_code/) 等主流科技媒体跟进报道。

---

## 第二幕：源码里到底藏了什么

51.2 万行代码，1,900 个文件。社区用不到 48 小时就把它扒了个底朝天。以下是最重要的发现。

### 1. 三层反蒸馏机制

这是最让人震惊的发现之一。Anthropic 在 Claude Code 里埋了系统性的反蒸馏（anti-distillation）防御，专门对付竞争对手通过 API 录制训练数据的行为。

**第一层：注入假工具。** 源码中有一个 `ANTI_DISTILLATION_CC` 标志，开启后会在系统提示词里插入伪造的工具定义。如果有人录制 Claude Code 的 API 交互去训练自己的模型，训练集就会被"投毒"。

**第二层：摘要替换。** 在某些场景下，服务端会把工具调用之间的文本做摘要处理配合签名返回，后续轮次再通过签名恢复。抓包的人只能拿到摘要，看不到完整的中间推理过程。

**第三层：客户端校验。** API 请求中会先放一个 `cch=c8a49` 的占位符，在请求发出前通过 Bun 原生 HTTP 栈（Zig 实现）替换为计算后的哈希值。服务端用这个值来验证请求是否来自真正的 Claude Code 二进制，而非第三方客户端。

> "别来挨我。"——这三层机制传达出的信号非常明确。
> —— [知乎 @恋猫](https://zhuanlan.zhihu.com/p/2022639631787652896)

### 2. 用正则表达式检测用户情绪

在 `userPromptKeywords.ts` 中，有一段很长的正则表达式，专门匹配用户的愤怒和挫败情绪：

```
/\b(wtf|wth|ffs|omfg|shit(ty|tiest)?|dumbass|horrible|awful|
piss(ed|ing)? off|piece of (shit|crap|junk)|what the (fuck|hell)|
fucking? (broken|useless|terrible|awful|horrible)|fuck you|
screw (this|you)|so frustrating|this sucks|damn it)\b/
```

一家做大模型的公司，用正则来检测情绪——看起来有点粗糙，但从工程角度来看非常合理：这种简单判断不值得消耗一次 LLM 推理的成本。这也体现了 Claude Code 团队的工程哲学：**不是所有问题都该交给 AI，该用传统方案的地方就用传统方案。**

### 3. Undercover Mode：卧底模式

源码中有一个 `undercover.ts`，功能是在 Claude Code 被用于非 Anthropic 内部仓库时，自动隐藏所有可能暴露公司内部信息的内容——内部代号、Slack 频道名、内部仓库名，甚至"Claude Code"这个名字本身。

最有意思的一句注释：

> "There is NO force-OFF. This guards against model codename leaks."

单向开关，只能开不能关。这意味着如果 Anthropic 员工用 Claude Code 给开源项目提交 PR，外部人员可能完全看不出有 AI 参与。

### 4. autoCompact：Token 消耗的元凶

[@imyouhu](https://x.com/imyouhu/status/2039191460256612770) 在 X 上率先指出，源码中的 `autoCompact.ts` 暴露了一个严重的性能问题。注释里的内部统计数据：

> "BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures (up to 3,272) in a single session, wasting ~250K API calls/day globally."

autoCompact 是 Claude Code 的上下文压缩机制，当会话接近 token 上限时自动触发。但它的失败重试逻辑有 bug——极端情况下一个会话会连续失败 3,272 次，全球每天因此浪费约 25 万次 API 调用。

这解释了很多用户抱怨的"token 消耗异常快"的问题。

### 5. 三层上下文压缩架构

[HuggingFace 社区的分析](https://discuss.huggingface.co/t/claude-code-source-leak-production-ai-architecture-patterns-from-512-000-lines/174846)揭示了 Claude Code 的上下文管理策略：

- **MicroCompact**：局部清理，针对单轮对话中的冗余内容
- **AutoCompact**：接近上下文窗口限制时触发的自动摘要（13K buffer、20K summary、带熔断机制）
- **Full Compact**：紧急压缩 + 选择性重新注入（50K token 预算）

### 6. 640+ 种遥测事件

源码暴露了 Anthropic 的遥测（telemetry）系统规模——超过 640 种不同的遥测事件类型，覆盖 40+ 个维度的用户行为指纹。[@aigclink](https://x.com/aigclink/status/2039163692873650600) 在 X 上评论："Anthropic 会通过 640+ 种遥测事件、40+ 维度指纹检测异常使用情况。"

这也是社区随后开发 cc-gateway 反追踪工具的直接原因。

### 7. 内部使用 Capybara (Mythos) 模型

[@scaling01](https://x.com/scaling01/status/2038948989257630166) 在分析源码后指出，Anthropic 内部已经在使用代号为 Capybara (Mythos) 的开发中模型，版本甚至超过了当前公开发布的模型。

### 8. 彩蛋：BUDDY 数字宠物系统

[HuggingFace 的分析](https://discuss.huggingface.co/t/claude-code-source-leak-production-ai-architecture-patterns-from-512-000-lines/174846)中提到，源码里包含一个未发布的 BUDDY 数字宠物系统——大概是给 Claude Code 准备的某种趣味功能，但从未公开。

---

## 第三幕：社区的 48 小时

如果说泄露本身是一场事故，那社区的反应则是一场速度与激情的表演。

### 24 小时内：Python 重写上线

[@GitHub_Daily](https://x.com/GitHub_Daily/status/2039003264637886698) 报道，有开发者在发现泄露后不到 24 小时，就用 Python 从零重写了 Claude Code 的核心功能，并启动了 Rust 移植工作。

### 48 小时内：接入任意 LLM

[@kevincodex](https://x.com/kevincodex/status/2039000379724341292)："We forked the leaked source, added a shim, and opened it to any LLM." 社区 fork 版已经能脱离 Anthropic 的 API，接入 OpenAI、Gemini、本地模型等任意 LLM。

### DMCA 拉锯战

Anthropic 法务团队迅速行动，对 GitHub 上的 mirror 仓库发出 DMCA 删除通知。但互联网的记忆是永恒的——源码早已被镜像到多个平台。到事件发生两天后，GitHub 上相关仓库的 star 总数已超过 94K。

### 两种截然不同的声音

**"就这？" 派：**

> "Claude Code 源码泄露这事，最重要的不是泄露本身。是大家看完源码发现：就这？一个 agent loop，一套 tool dispatch，一个 context window 管理器。"
> —— [@leewaytor](https://x.com/leewaytor/status/2039032196154138927)

> "Claude code 源码泄露了，然后一堆人又——就这分分钟克隆一个。我觉得没啥用，你能克隆 Claude 的大模型吗？你能克隆 Claude 的迭代能力吗？"
> —— [@zhang_baoqing](https://x.com/zhang_baoqing/status/2039143140993409476)

**"金矿" 派：**

> "作为 Agent 创业者，Claude Code 源码泄露是学习机会。"
> —— [@grok](https://x.com/grok/status/2039309486951653710)

> "512,000 lines across 1,900 files. 5 things about how it actually works that surprised me."
> —— [@rvivek](https://x.com/rvivek/status/2039064177940263195)

两边说的其实都对。源码本身确实是标准的 agent 架构——agent loop + tool dispatch + context management。但 **Anthropic 在工程细节上的打磨深度**，是光看架构图看不出来的。三层上下文压缩、反蒸馏投毒、640 种遥测事件、原生二进制校验——这些才是真正的 know-how。

---

## 第四幕：这件事的真正意义

### 对 Anthropic

短期看是一次公关危机和 IP 泄露。长期看影响可能有限——正如 [@zhang_baoqing](https://x.com/zhang_baoqing/status/2039143140993409476) 所说，源码只是前端客户端，真正的核心竞争力（模型能力、训练数据、推理基础设施）并不在其中。

但这件事暴露了一个尴尬的事实：一家以"AI 安全"为核心使命的公司，在最基本的软件供应链安全上翻了车。[The Hacker News 的报道](https://thehackernews.com/2026/04/claude-code-tleaked-via-npm-packaging.html)标题一针见血——"Claude Code Source Leaked via npm Packaging Error Fueling Supply Chain Risks"。

### 对 AI 工程社区

这是一份免费的生产级 AI 应用架构教科书。在此之前，大家讨论 AI Agent 的架构更多停留在理论层面。Claude Code 的源码第一次展示了一个日活百万级的 AI Agent 产品，在工程上到底是怎么做的——上下文怎么压缩、工具怎么调度、权限怎么管理、安全怎么分层。

### 对 AI 行业

反蒸馏机制的曝光，让"模型蒸馏"这个灰色地带的攻防战浮出水面。Anthropic 显然不是唯一一家在做这种防御的公司，但它可能是第一家被公开曝光的。

---

## 尾声

Claude Code 负责人的回应或许是对这件事最好的总结：

> "错误在所难免。作为团队，重要的是要认识到这绝不是个人的错，而是流程、文化或基础设施的问题。"

一个 `.npmignore` 文件的疏忽，引发了 2026 年 AI 行业最大的一次源码泄露。51.2 万行代码在 48 小时内被全球开发者翻了个底朝天，Anthropic 精心构建的防蒸馏体系、遥测监控、卧底模式全部暴露在阳光下。

但最讽刺的是——分析这些代码的主力工具，正是 Claude 自己。

> "Everyone says they went through 600K lines of the code. The irony is that Claude itself went through it."
> —— [@godofprompt](https://x.com/godofprompt/status/2039051678930935889)

---

*本文素材通过 XCrawl + Claude Code 从 X、The Register、HuggingFace、知乎等平台采集整理。所有引用均来自公开可访问的内容。*

---

## 参考来源

### 媒体报道
- [Anthropic goes nude, exposes Claude Code source by accident — The Register](https://www.theregister.com/2026/03/31/anthropic_claude_code_source_code/)
- [Entire Claude Code CLI source code leaks thanks to exposed map file — Ars Technica](https://arstechnica.com/ai/2026/03/entire-claude-code-cli-source-code-leaks-thanks-to-exposed-map-file/)
- [Claude Code Source Leaked via npm Packaging Error — The Hacker News](https://thehackernews.com/2026/04/claude-code-tleaked-via-npm-packaging.html)

### 深度分析
- [Claude Code 源码里有意思设定：伪造、投毒、卧底、封号 — 知乎 @恋猫](https://zhuanlan.zhihu.com/p/2022639631787652896)
- [Claude Code 源码深度解析 — 知乎](https://zhuanlan.zhihu.com/p/2022442135182406883)
- [Claude Code Source Leak: Production AI Architecture Patterns — HuggingFace](https://discuss.huggingface.co/t/claude-code-source-leak-production-ai-architecture-patterns-from-512-000-lines/174846)
- [The Claude Code Source Code Leak — Marco Kotrotsos / Medium](https://kotrotsos.medium.com/the-claude-code-source-code-leak-8c991f0f0b73)
- [Claude Code 源码「换壳」反杀 — 36Kr](https://eu.36kr.com/zh/p/3747613304193796)

### X（Twitter）讨论
- [@chenchengpro — 泄露经过还原](https://x.com/chenchengpro/status/2038904406406476195)
- [@Gorden_Sun — 确认源码真实性](https://x.com/Gorden_Sun/status/2038907120637317346)
- [@evilcos — 51.2 万行源码深度分析](https://x.com/evilcos/status/2039137097295307122)
- [@dotey — 反蒸馏机制分析](https://x.com/dotey/status/2039042306871906655)
- [@dotey — 源码跑起来](https://x.com/dotey/status/2039020301434909095)
- [@dotey — 澄清泄露原因](https://x.com/dotey/status/2039173976275009799)
- [@imyouhu — autoCompact 问题](https://x.com/imyouhu/status/2039191460256612770)
- [@aigclink — 反封号工具 cc-gateway](https://x.com/aigclink/status/2039163692873650600)
- [@scaling01 — Capybara 模型发现](https://x.com/scaling01/status/2038948989257630166)
- [@hungryturbo — 负责人回应](https://x.com/hungryturbo/status/2039370190614618244)
- [@kevincodex — 社区 fork 接入任意 LLM](https://x.com/kevincodex/status/2039000379724341292)
- [@GitHub_Daily — 24h Python 重写](https://x.com/GitHub_Daily/status/2039003264637886698)
- [@robertmclaws — DMCA 争议](https://x.com/robertmclaws/status/2039129333428871463)
- [@latentspacepod — 社区发现汇总](https://x.com/latentspacepod/status/2039227555132354802)
- [@rvivek — 5 个核心发现](https://x.com/rvivek/status/2039064177940263195)
- [@godofprompt — Claude 分析自己的源码](https://x.com/godofprompt/status/2039051678930935889)
- [@leewaytor — "就这？"](https://x.com/leewaytor/status/2039032196154138927)
- [@zhang_baoqing — 克隆源码没用](https://x.com/zhang_baoqing/status/2039143140993409476)
- [@ZHO_ZHO_ZHO — "觉也别睡了"](https://x.com/ZHO_ZHO_ZHO/status/2038995661962744317)
- [@support_huihui — GitHub fork 数据](https://x.com/support_huihui/status/2039289919508746492)
- [@grok — Agent 创业者视角](https://x.com/grok/status/2039309486951653710)
