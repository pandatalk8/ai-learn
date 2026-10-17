# Hermes Agent vs OpenClaw：两大开源 AI Agent 深度对比

> 2026 年上半年，AI Agent 赛道最受关注的两个开源项目——OpenClaw 和 Hermes Agent——分别代表了两种截然不同的智能体哲学。一个要做你生活的自动化层，一个要做跟你一起成长的学习体。本文从架构、功能、记忆、学习能力、生态等多个维度展开系统对比。

---

## 先厘清：它们各自是什么？

**OpenClaw** 由奥地利开发者 Peter Steinberger（PSPDFKit 创始人）在 2025 年 11 月发布。它的定位是"个人 AI 助手"，核心能力是把 AI Agent 接入你已有的聊天平台——WhatsApp、Telegram、Slack、Discord、微信、钉钉等 25+ 个渠道。你在任何一个聊天窗口给它发消息，它就能帮你读写文件、操控浏览器、发邮件、管理日历、执行定时任务。截至 2026 年 5 月，它在 GitHub 上积累了超过 36 万 Stars，是开源历史上增速最快的项目之一。创始人已于 2026 年 2 月被 OpenAI acqui-hire。

**Hermes Agent** 由 Nous Research 团队在 2026 年 2 月 25 日发布。Nous Research 此前以开源微调模型 Hermes 系列闻名（基于 Llama 的 8B/70B/405B 版本，专注 agentic 能力和工具调用）。Hermes Agent 是他们从"做模型"到"做框架"的自然延伸——一个模型无关的 AI Agent 框架，核心卖点是"闭环学习"：Agent 在完成任务后会自动提炼可复用的 Skill，下一次遇到类似任务时直接调用，越用越快。发布 10 周即突破 11 万 Stars。

两者都是 MIT 协议开源，都支持自部署，都强调隐私和本地控制。但从架构到设计哲学，几乎在每一个维度上都走了不同的路。

---

## 设计哲学：生活自动化 vs 持续进化

理解两个项目最核心的差异，需要先理解它们各自回答的问题。

OpenClaw 回答的问题是：**"AI 如何融入普通人的日常生活？"**

它的策略是"去用户所在的地方"。不要求你学习新工具，不要求你打开终端，甚至不要求你离开 WhatsApp。你在最熟悉的聊天界面发一句话，背后的 AI 就替你干活了。这个设计让非技术用户也能使用 AI Agent，极大降低了门槛。

Hermes Agent 回答的问题是：**"AI Agent 如何随着使用越来越强？"**

它关注的不是"今天能帮你做什么"，而是"做完之后如何变得更好"。每完成一个复杂任务，Hermes 会提炼出可复用的工作流（Skill），存入本地知识库。积累 20 个以上 Skill 后，类似任务的完成时间可以缩短约 40%。这是一个典型的复利模型——前期投入较大，但长期回报递增。

一句话概括：OpenClaw 追求覆盖面，Hermes Agent 追求深度。

---

## 架构对比：横向管道 vs 三层纵深

**OpenClaw 的架构：Hub-and-Spoke 四层管道**

OpenClaw 采用"网关中心制"设计：

| 层级 | 功能 | 说明 |
|------|------|------|
| Channels 通道层 | 消息接入 | 25+ 平台连接器（WhatsApp、Telegram、Slack 等） |
| Gateway 网关层 | 中枢协调 | 会话管理、消息路由、鉴权、工具执行调度 |
| Agent 智能体层 | 推理与决策 | 内置 Pi Agent（基于 Pi SDK，仅 4 个基础工具） |
| Memory 记忆层 | 状态持久化 | JSONL 对话记录 + Markdown 长期记忆 |

技术栈是 TypeScript + Node.js 24。整个体系围绕一个核心场景构建：多个用户通过多个聊天平台，与一个 24/7 在线的 AI 助手交互。Gateway 是绝对的核心节点——所有消息都经过它路由、鉴权、调度。

**Hermes Agent 的架构：三层纵深**

Hermes Agent 采用经典的三层分离设计：

| 层级 | 功能 | 说明 |
|------|------|------|
| Interface 接口层 | 多通道接入 | Telegram、Discord、Slack、WhatsApp、Signal、Email、CLI |
| Core 核心层 | 编排引擎 | AIAgent 类，处理 Provider 选择、Prompt 构建、工具执行、上下文压缩、持久化 |
| Execution 执行层 | 后端隔离 | 7 种终端后端——本地、Docker、SSH、Singularity、Modal、Daytona、Vercel Sandbox |

技术栈是 Python 3.11+ + uv。核心代码集中在 `run_agent.py`（约 13,700 行），是一个同步编排引擎。它的特点是执行后端可以灵活切换——同一个 Agent 可以在本地跑，也可以隔离到 Docker 或远程 SSH 服务器执行，安全性和灵活性更高。

**架构设计背后的取舍：**

OpenClaw 的 Gateway 中心制让它能高效处理多用户、多通道的并发对话，但单点依赖也带来了扩展性挑战。它目前仍以单实例部署为主，多用户/多租户改造是社区的活跃议题。

Hermes Agent 的三层分离让执行环境可以独立扩展，Docker/SSH/Singularity 等后端选项适合需要资源隔离的技术用户。但它的核心编排引擎是同步的，在高并发消息场景下不如 OpenClaw 的事件驱动模型高效。

---

## 驱动循环：事件响应 vs 学习闭环

智能体的核心是循环——接收输入、决策、执行、观察、再决策。两者的循环形态差异明显。

**OpenClaw：事件驱动的响应循环**

消息从任意通道进入 → 标准化 → 路由决策 → 排入队列 → Agent 处理 → 响应回传

这是一个多线程、事件驱动的模型。多条消息可以同时处理，每条走独立的会话上下文。加上 Cron / Heartbeat 机制，OpenClaw 也能在没有用户消息的情况下主动执行任务——凌晨检查竞品网站、定时生成报告、自动监控服务器状态。

**Hermes Agent：带学习闭环的执行循环**

任务执行 → 模式提炼 → Skill 创建 → 下次匹配调用 → Skill 迭代优化

Hermes 的循环多了一个关键环节：**任务完成后的复盘与知识沉淀**。它会分析自己执行任务的步骤，识别可复用的模式，写成 Markdown 格式的 Skill 文件。这些 Skill 遵循 agentskills.io 开放标准（与 Claude Code、Cursor 使用的 Skill 规范兼容），意味着在 Hermes 上积累的 Skill 理论上可以迁移到其他支持该标准的 Agent 框架中。

每执行约 15 个任务，Hermes 还会进行一次整体性能自评，分析成功和失败的模式。这种"元认知"机制在当前 Agent 框架中相当少见。

---

## 模型支持：绑定 vs 无关

**OpenClaw**：模型无关。支持 Claude、GPT、DeepSeek、Gemini 等多家 API。通过 Pi Agent 的 Provider 抽象层接入，切换模型只需修改配置。

**Hermes Agent**：同样模型无关，且覆盖面更广。支持 18+ 个 Provider——Nous Portal、OpenRouter（200+ 模型）、NVIDIA NIM、OpenAI、Kimi/Moonshot、MiniMax、Hugging Face、自定义端点等。Provider 解析系统将 (provider, model) 元组映射到 API 模式、密钥和 base URL，支持 OAuth 流程和凭证池管理。

两者在模型支持上都做到了不锁定，但 Hermes Agent 的 Provider 体系更成熟，尤其是对国产模型（Kimi、MiniMax）和本地推理（NVIDIA NIM、Hugging Face）的原生支持，对需要合规或低延迟部署的用户更有吸引力。

---

## 记忆系统：文件记录 vs 全文检索

记忆是 Agent 从"一次性工具"变成"长期助手"的关键。两者的记忆实现差距较大。

**OpenClaw 的记忆：**

- 会话存储使用 JSONL 文件，按 Agent 和 Session 分目录管理
- 长期记忆使用 Markdown 文件，Agent 可以在对话中主动写入和读取
- 记忆检索主要靠文件路径和名称匹配，没有全文搜索

这个方案简单直观，易于理解和调试——打开文件就能看到 Agent 记住了什么。但随着记忆积累增多，检索效率会下降，Agent 难以在大量历史信息中精准定位相关内容。

**Hermes Agent 的记忆：**

- 存储层使用 SQLite + FTS5 全文搜索引擎
- Agent 主动筛选值得记住的信息（而非记录所有内容）
- 跨会话全文检索：可以搜索数周前的对话内容，结合 LLM 摘要进行召回
- Honcho 辩证用户建模：持续构建对用户偏好、回答格式、决策风格的深度画像
- 缓存感知设计：记忆检索与 Prompt Caching 集成，不会因为记忆增长而持续推高 token 成本

Hermes 的记忆系统在工程复杂度上远超 OpenClaw，带来的好处是长期使用后 Agent 的"了解你"程度会有质的差异。但这也意味着更高的部署和运维门槛——你需要理解 SQLite、FTS5 和 Honcho 的交互机制才能有效排查问题。

---

## Skill 系统：静态扩展 vs 自主进化

两者都有 Skill 系统，但运作方式完全不同。

**OpenClaw 的 Skill：人工编写的插件**

OpenClaw 的 Skill 通过 `SKILL.md` 元数据文件定义，本质上是人类编写的指令集。社区或用户写好一个 Skill，发布到生态系统中，其他人安装后即可使用。这个模式类似 VS Code 的插件生态——丰富、开放，但依赖人工维护和更新。

目前 OpenClaw 组织下有 54 个仓库，社区贡献的 Skill 覆盖了网页爬取、浏览器自动化、邮件处理、文件操作、API 调用等主流场景。

**Hermes Agent 的 Skill：自动生成的经验结晶**

Hermes 的 Skill 可以由 Agent 在任务执行后自动创建。这是它与 OpenClaw 最本质的差异：

1. 你让 Hermes 完成一个复杂任务（比如"调研这 5 家公司的最新融资信息，整理成对比表格"）
2. 任务完成后，Hermes 分析自己的执行步骤，识别出可复用的模式
3. 它自动写一个 Markdown Skill 文件，记录"做这类调研任务的标准流程"
4. 下次你提出类似请求，Hermes 会先查 Skill 库，直接调用已有流程，跳过从零推理的过程
5. 如果执行结果不理想，Skill 会被迭代优化

这套机制遵循 agentskills.io 开放标准，Skill 文件可以在支持该标准的 Agent 之间迁移。

当然，OpenClaw 的 Skill 也可以手动编写后实现类似的复用效果，只是没有"自动提炼"这一步。对于明确知道自己需要什么的用户，手动编写的 Skill 可能更精确可控；对于任务类型多变、难以预先定义工作流的用户，Hermes 的自主学习更有价值。

---

## 平台接入：广度 vs 深度

**OpenClaw 在这方面有压倒性优势。**

OpenClaw 支持 25+ 个消息平台：

| 类别 | 平台 |
|------|------|
| 即时通讯 | WhatsApp、Telegram、Signal、iMessage |
| 办公协作 | Slack、Discord、Microsoft Teams、Google Chat |
| 邮件 | Gmail、Outlook |
| 中国生态 | 微信、钉钉、QQ |
| 开放协议 | Matrix、IRC |
| 更多 | 50+ 集成（生产力工具、智能家居、自动化） |

加上移动节点（iOS/Android 配对设备），OpenClaw 可以利用手机的摄像头和麦克风进行语音和视觉工作流。

**Hermes Agent 的通道支持相对有限：**

Telegram、Discord、Slack、WhatsApp、Signal、Email、CLI——7 个通道。覆盖了技术用户的主要场景，但在中国生态（微信、钉钉）和企业协作（Teams、Google Chat）上缺失。

如果你的使用场景是"在 WhatsApp 上指挥 AI 帮你处理邮件、管日历、查网页"，OpenClaw 是明确更优的选择。如果你主要通过 CLI 或 Telegram 与 Agent 交互，Hermes 完全够用。

---

## 执行环境与安全

**OpenClaw：**

- 本地执行为主，Gateway 进程直接调用 Shell、浏览器等
- 权限管理依赖 Gateway 层的配置
- 安全隐患：Cisco 研究团队曾指出未经审核的第三方 Skill 可能导致数据泄露
- 中国已限制国有企业和政府机构使用（2026 年 3 月）

**Hermes Agent：**

- 7 种执行后端可选：本地、Docker、SSH、Singularity、Modal、Daytona、Vercel Sandbox
- Docker 和 SSH 后端提供进程级隔离，敏感操作不在主机上直接执行
- 对需要合规审计的场景更友好

Hermes 在执行环境隔离上的设计明显更成熟。如果你需要让 Agent 执行高权限操作（如部署代码、管理服务器），Docker/SSH 隔离能有效降低风险。OpenClaw 的执行环境相对开放，适合个人使用场景，但在企业部署时需要额外的安全加固。

---

## 部署与上手门槛

**OpenClaw：**

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

两行命令完成安装，本地会启动一个 Dashboard（`http://127.0.0.1:18789/`），后续通过 Web 界面配置通道、添加 API Key、管理 Agent。对于有基本命令行经验的用户，10 分钟内可以跑起来。

**Hermes Agent：**

```bash
pip install hermes-agent  # 或 uv 安装
```

Python 生态，需要 Python 3.11+。配置过程涉及 Provider 设置、终端后端选择、Skill 目录初始化等步骤。对 Python 开发者友好，但对非技术用户的门槛高于 OpenClaw。

**上手体验的差异：**

OpenClaw 的 Dashboard + 多平台接入设计，让它更接近一个"开箱即用的产品"。Hermes Agent 更像一个"需要配置的框架"——灵活度更高，但前期投入也更大。

---

## 社区与生态

**OpenClaw：**

- 368K+ Stars，76K+ Forks
- 54 个组织仓库，覆盖核心框架、Channel 插件、Skill 库等
- 创始人被 OpenAI 收购后，项目交由非营利基金会治理
- 社区极其活跃：7,100+ open issues，说明用户基数大但也暗示维护压力大
- 中文社区成熟，有大量部署教程和实战案例

**Hermes Agent：**

- 110K+ Stars（发布 10 周）
- 增速极快，但生态尚在早期
- Nous Research 团队有长期的开源 AI 社区声誉（Hermes 模型系列）
- awesome-hermes-agent 等社区资源开始涌现
- 与 agentskills.io 标准的绑定可能带来跨框架的 Skill 互通

OpenClaw 的先发优势和社区规模目前遥遥领先。但 Hermes Agent 的增长曲线非常陡峭，如果 Nous Research 持续投入，生态差距可能在 2026 年下半年明显缩小。

---

## 适用场景对照

| 场景 | 更适合的选择 | 原因 |
|------|------------|------|
| 个人日常自动化（邮件、日历、提醒） | OpenClaw | 多通道接入，24/7 在线，上手快 |
| 非技术用户使用 AI Agent | OpenClaw | 聊天界面交互，零学习成本 |
| 技术用户的编程辅助 | 两者都不是最优（Claude Code 更强） | Agent 框架的定位不同于 Coding Agent |
| 需要长期积累领域知识的重复性工作 | Hermes Agent | 自主学习闭环，Skill 自动迭代 |
| 研究/数据分析类任务 | Hermes Agent | 深度记忆 + Skill 复用 + 灵活执行后端 |
| 企业合规部署 | Hermes Agent | 执行环境隔离（Docker/SSH），Provider 灵活 |
| 中国生态集成（微信、钉钉） | OpenClaw | 原生支持中国平台 |
| 多模型切换和实验 | Hermes Agent | 18+ Provider 原生支持，切换无代码改动 |
| 作为 Python 库嵌入自有系统 | Hermes Agent | 可直接 import AIAgent 作为库使用 |
| 快速搭建 AI 助手原型 | OpenClaw | 安装到可用只需 10 分钟 |

---

## 各自的短板

**OpenClaw 的短板：**

1. **多用户/多租户改造困难**。Gateway 单实例设计适合个人使用，但企业级多用户部署需要大量定制工作，社区至今没有成熟方案。
2. **Skill 不会自主进化**。所有 Skill 依赖人工编写和维护，Agent 本身不能从任务执行中学到新东西。
3. **安全模型不够严格**。执行环境缺乏隔离，第三方 Skill 审核机制不完善。对个人无所谓，对企业是硬伤。
4. **创始人离开后的治理风险**。Peter Steinberger 加入 OpenAI 后，项目转由非营利基金会管理。长期的产品方向和维护质量存在不确定性。

**Hermes Agent 的短板：**

1. **生态还太早期**。发布仅两个多月，Skill 生态、社区教程、第三方集成都远不如 OpenClaw 成熟。
2. **平台接入有限**。7 个通道对技术用户够用，但无法覆盖微信、钉钉等中国生态，限制了它在中文市场的渗透。
3. **学习闭环需要时间投入**。Skill 积累到产生明显效率提升（约 20 个以上），需要用户持续使用数周。短期使用看不到学习闭环的价值。
4. **核心代码集中度过高**。`run_agent.py` 约 13,700 行，可维护性和可读性值得关注。单个文件承担了过多职责，对社区贡献者不太友好。
5. **上手门槛偏高**。Python 环境配置、Provider 设置、执行后端选择——对非技术用户来说，每一步都是障碍。

---

## 总结：选哪个？

OpenClaw 和 Hermes Agent 代表了 AI Agent 发展的两个方向。

OpenClaw 解决的是**触达问题**——如何让尽可能多的人在尽可能多的平台上用上 AI Agent。它的价值在于降低门槛、扩大覆盖面、让 AI 融入已有的工作和生活场景。如果你想要一个"装上就能用"的数字助手，OpenClaw 是当前的最佳选择。

Hermes Agent 解决的是**深度问题**——如何让 AI Agent 在长期使用中持续变强。它的价值在于学习闭环、知识积累、执行效率随时间递增。如果你愿意投入前期配置成本，换取一个越用越懂你、越用越快的 AI 助手，Hermes Agent 的回报曲线更有吸引力。

两者并非互斥。技术上完全可以用 OpenClaw 做前端消息接入，用 Hermes Agent 做后端智能引擎——社区里已经有人在做这种集成尝试。但这需要相当的工程能力，短期内不是主流用法。

对大多数用户来说，更实际的判断标准是：

- **你更在意"现在就能帮我做什么"→ OpenClaw**
- **你更在意"三个月后它能变成什么"→ Hermes Agent**
