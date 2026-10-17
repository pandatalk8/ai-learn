# Harness Engineering：AI 智能体时代的新工程学

> **📅 时间线速览**
>
> ```
> 2023─2024  前概念时期
>    ├─ 2024.04  SWE-bench (Princeton) ─── 在智能体评估中首次使用"harness"概念
>    └─ 2024.12  Building Effective Agents (Anthropic) ─── 奠定思想基础
>
> 2025  概念萌芽
>    └─ 2025.11  Effective Harnesses for Long-Running Agents (Anthropic)
>               ─── 首篇以"harness"为核心术语的架构实践文章
>
> 2026  概念爆发
>    ├─ 2026.02  Harness Engineering (OpenAI) ─── 首次命名为独立学科
>    ├─ 2026.02  Harness Engineering for Coding Agent Users (Thoughtworks)
>    │           ─── 系统化分类框架：Guides/Sensors × Computational/Inferential
>    ├─ 2026.03  The Anatomy of an Agent Harness (LangChain)
>    │           ─── 提出 Agent = Model + Harness 公式
>    ├─ 2026.03  Natural-Language Agent Harnesses (学术论文)
>    │           ─── 自然语言定义的可移植 harness
>    └─ 2026.04  Externalization in LLM Agents (学术综述)
>               ─── 将 harness engineering 定位为统一层
> ```

当 AI 编码智能体变得越来越强大，一个新问题浮出水面：模型本身已经足够聪明，但围绕模型的那套"脚手架"却决定了智能体到底能不能干成事。

2026 年初，一个新术语在 AI 工程界迅速走红——**Harness Engineering**（管控工程）。它描述的是一门新兴学科：如何设计环境、约束和反馈回路，让 AI 智能体在真实世界中可靠地完成复杂任务。

这篇文章梳理 Harness Engineering 的起源、关键人物、核心文献，以及这个概念从萌芽到成型的完整脉络。

---

## 一、概念溯源：Harness 从何而来

"Harness"一词并非 AI 领域的原创。在传统软件工程中，**test harness**（测试工具）是一个经典概念——一套用于在受控环境中运行和验证代码的基础设施。JUnit 是 test harness，CI/CD 流水线也是 test harness。

当 LLM 智能体兴起后，开发者发现自己面临一个类似的问题：模型需要被"套上缰绳"。你得告诉它能用哪些工具、如何管理上下文、怎样在多个会话之间传递状态、出了错该如何恢复。这一整套围绕模型的运行时基础设施，就是 **agent harness**。

"Harness"这个词的选择很精确——它既有"驾驭"的含义（像马具一样约束和引导），也有"利用"的含义（像太阳能电池板一样将原始能量转化为可用的功）。

---

## 二、发展时间线

### 2023–2024：前概念时期

#### SWE-bench 评估框架（2023–2024）

最早在 AI 智能体语境中使用"harness"一词的项目之一是普林斯顿大学的 **SWE-bench**。Carlos E. Jimenez 和 John Yang 等人构建了一套评估框架，用来测试语言模型解决真实 GitHub issue 的能力。他们将测试基础设施称为"evaluation harness"——一套容器化的环境，用于可复现地运行和评估智能体的表现。

SWE-bench 于 2024 年被 ICLR 接收为 oral presentation，并在同年 6 月迁移到基于 Docker 的全容器化评估框架。虽然这里的"harness"指的是评估基础设施，但它预示了一种思维方式：智能体的有效性不仅取决于模型，更取决于它运行在什么样的环境中。

> **论文：** Carlos E. Jimenez, John Yang, et al. *SWE-bench: Can Language Models Resolve Real-World GitHub Issues?* ICLR 2024.
> **链接：** https://www.swebench.com

#### Anthropic《Building Effective Agents》（2024 年 12 月）

2024 年 12 月 20 日，Anthropic 的 **Erik Schluntz** 和 **Barry Zhang** 发表了一篇影响深远的博客文章——[《Building Effective Agents》](https://www.anthropic.com/news/building-effective-agents)。

这篇文章没有使用"harness"一词，但奠定了 Harness Engineering 的思想基础。核心论点是：最成功的智能体实现往往不依赖复杂框架或专用库，而是建立在**简单、可组合的模式**之上。文中区分了两个概念——"工作流"（按预定义模式编排多个 LLM）和"智能体"（LLM 动态指导自身的流程和工具使用）。

这篇文章的关键洞察可以浓缩为一句话：**围绕模型的系统设计，比模型本身更重要。**

---

### 2025：概念萌芽

#### Anthropic《Effective Harnesses for Long-Running Agents》（2025 年 11 月）

2025 年 11 月 26 日，Anthropic 工程师 **Justin Young** 发表了[《Effective Harnesses for Long-Running Agents》](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)。这是**第一篇以"harness"作为核心架构术语的主要行业博客文章**。

文章聚焦一个具体问题：如何让 AI 智能体跨越多个上下文窗口持续有效工作。Justin Young 和团队提出了一套两阶段 harness 方案：

- **初始化智能体（Initializer Agent）**：在首次运行时搭建环境——创建 `init.sh` 启动脚本、`claude-progress.txt` 进度文件、功能清单（JSON 格式的端到端测试列表），以及初始 git 提交。
- **编码智能体（Coding Agent）**：每次会话只做增量进展，完成后提交 git 并更新进度文件，为下一个会话留下干净的状态。

文中总结了四种失败模式——过早宣布完成、一次做太多、不测试就标记通过、不知道如何启动应用——以及对应的 harness 解决方案。这些实践灵感来自对高效软件工程师日常工作方式的观察：轮班交接要有记录，代码要能 revert，每次只做一件事。

这篇文章标志着"agent harness"从一个隐含概念变成了一个被明确命名和讨论的架构范式。

---

### 2026：概念爆发

#### OpenAI《Harness Engineering》（2026 年 2 月）

2026 年 2 月 11 日，OpenAI 发表了[《Harness Engineering: Leveraging Codex in an Agent-First World》](https://openai.com/index/harness-engineering/)，作者包括 **Ryan Lopopolo**、Victor Zhu 和 Zach Brock。

这篇文章**首次将"Harness Engineering"作为一门命名学科提出**。OpenAI 的 Codex 团队用这套方法论构建了一个完整的产品——一个小团队在约五个月内交付了超过一百万行代码的 beta 产品，**没有手动编写任何源代码**。

核心做法是：人类工程师的角色从"写代码"转变为"设计环境"。工程师通过声明式提示描述任务，Codex 智能体执行代码生成、测试和可观测性等工作。Harness 将脚手架、反馈回路、文档和架构约束编码为机器可读的制品（artifacts），智能体据此执行开发工作流。

OpenAI 的一个关键发现是：**更多约束往往带来更高的可靠性。** 当智能体在由 linter 和 validator 执行的严格架构边界内运行时，表现反而更好。用他们的话说："给 Codex 一张地图，而不是一本一千页的说明书。"

#### Martin Fowler / Birgitta Böckeler《Harness Engineering for Coding Agent Users》（2026 年 2 月 / 4 月）

仅一周后的 2 月 17 日，软件工程思想领袖 **Martin Fowler** 的网站发表了 **Birgitta Böckeler**（Thoughtworks 杰出工程师）撰写的[《Harness Engineering for Coding Agent Users》](https://martinfowler.com/articles/harness-engineering.html)（4 月 2 日扩展更新）。

Böckeler 对 harness 给出了精确定义："AI 智能体中除了模型本身之外的一切。"她引入了一套分类框架来描述 harness 的控制机制：

| | 前馈控制（Guides） | 反馈控制（Sensors） |
|---|---|---|
| **计算性（Computational）** | 确定性的，快速的 | 确定性的观察 |
| **推理性（Inferential）** | 语义化的，基于 AI | 基于 AI 的自我修正 |

- **Guides（引导）**：预判性控制，在智能体行动之前引导其行为。
- **Sensors（传感）**：观察性控制，在智能体行动之后实现自我修正。

她还指出 harness 需要调节三个维度：**可维护性**（代码质量，最成熟）、**架构适配性**（性能和结构要求）和**行为正确性**（功能正确，发展最不成熟）。

Böckeler 的一个重要观点是：好的 harness 不应该追求完全消除人类输入，而应该将人类的注意力引导到最重要的地方。

#### LangChain《The Anatomy of an Agent Harness》（2026 年 3 月）

2026 年 3 月 10 日，LangChain 的 **Vivek Trivedy** 发表了[《The Anatomy of an Agent Harness》](https://blog.langchain.com/the-anatomy-of-an-agent-harness/)，提出了一个简洁有力的公式：

> **Agent = Model + Harness**

"如果你不是模型，你就是 harness。"

文章从期望的智能体行为出发，反向推导出 harness 的核心组件：文件系统（持久化存储）、Bash/代码执行（自主解决问题）、沙箱（安全隔离）、记忆系统（跨会话学习）、上下文管理（对抗"上下文腐化"）和长周期执行（规划与自我验证）。

Trivedy 还提出了一个值得关注的论断：即使模型持续进步，harness engineering 仍然有价值——就像 prompt engineering 在模型越来越强之后依然重要一样。

#### 学术界跟进（2026 年 3–4 月）

学术界也迅速响应：

- **2026 年 3 月 26 日**，Linyue Pan 等人在 arXiv 发表了[《Natural-Language Agent Harnesses》](https://arxiv.org/abs/2603.25723)，提出用自然语言而非代码来定义 harness 逻辑，使其可编辑、可迁移、可研究。他们引入了"Intelligent Harness Runtime"（IHR）的概念，用于执行这些自然语言规范。

- **2026 年 4 月 9 日**，Chenyu Zhou 等 21 位研究者发表了综述论文[《Externalization in LLM Agents》](https://arxiv.org/abs/2604.08224)，将 harness engineering 定位为协调记忆、技能和协议的"统一层"，标志着这一概念开始获得学术共识。

---

## 三、核心思想

纵观这条发展线索，Harness Engineering 的核心思想可以归纳为几点：

**1. 模型是引擎，harness 是整辆车。**

模型决定了你有多少马力，harness 决定了你能不能安全地开到目的地。没有方向盘、刹车和导航的引擎，再强也只是一堆噪音。

**2. 增量优于一步到位。**

长时间运行的智能体最大的陷阱是"一口气做完"。有效的 harness 强制智能体每次只推进一个功能，提交一次代码，更新一次进度。

**3. 约束带来可靠性。**

这是一个反直觉的发现：给智能体更多自由，它反而容易迷失；给它更严格的边界和更清晰的地图，它反而表现更好。

**4. 交接是一等公民。**

每次上下文窗口切换都是一次"轮班交接"。有效的 harness 把交接制度化：进度文件、git 提交日志、功能清单、启动脚本——这些都是工程师每天在做的事情，只不过现在需要让智能体也养成这些习惯。

**5. 测试必须端到端。**

智能体天生倾向于用单元测试或 curl 命令"证明"自己完成了任务。有效的 harness 强制它像真实用户一样操作浏览器、验证功能。

---

## 四、相关概念辨析

| 概念 | 含义 | 关注的问题 |
|------|------|-----------|
| **Framework（框架）** | 开发者用来构建智能体的 SDK（如 LangChain、CrewAI） | 你*怎么造*一个智能体 |
| **Scaffolding（脚手架）** | 第一次提示之前的静态设置（系统提示、工具定义、子智能体注册） | 智能体*启动前*的准备 |
| **Harness（管控）** | 运行时编排（工具调度、上下文管理、安全、记忆、恢复） | 智能体*运行时*的行为 |
| **Orchestration（编排）** | Harness 的子集，侧重多智能体协调 | 多个智能体如何*协作* |

框架回答"你怎么造"，harness 回答"它怎么跑"。

---

## 五、关键文献索引

| 时间 | 文献 | 作者/团队 | 贡献 |
|------|------|----------|------|
| 2024.04 | [SWE-bench](https://www.swebench.com) (ICLR 2024) | Carlos E. Jimenez, John Yang 等 (Princeton) | 在智能体评估中引入"harness"概念 |
| 2024.12 | [Building Effective Agents](https://www.anthropic.com/news/building-effective-agents) | Erik Schluntz, Barry Zhang (Anthropic) | 奠定思想基础：简单可组合模式优于复杂框架 |
| 2025.11 | [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Justin Young (Anthropic) | 首次以"harness"为核心术语的架构实践 |
| 2026.02 | [Harness Engineering](https://openai.com/index/harness-engineering/) | Ryan Lopopolo 等 (OpenAI) | 首次将"Harness Engineering"命名为独立学科 |
| 2026.02–04 | [Harness Engineering for Coding Agent Users](https://martinfowler.com/articles/harness-engineering.html) | Birgitta Böckeler (Thoughtworks) | 系统化分类框架：Guides/Sensors × Computational/Inferential |
| 2026.03 | [The Anatomy of an Agent Harness](https://blog.langchain.com/the-anatomy-of-an-agent-harness/) | Vivek Trivedy (LangChain) | 提出 Agent = Model + Harness 公式 |
| 2026.03 | [Natural-Language Agent Harnesses](https://arxiv.org/abs/2603.25723) | Linyue Pan 等 | 提出自然语言定义的可移植 harness |
| 2026.04 | [Externalization in LLM Agents](https://arxiv.org/abs/2604.08224) | Chenyu Zhou 等 | 综述论文，将 harness engineering 定位为统一层 |

---

## 六、展望

Harness Engineering 的诞生折射出 AI 工程领域一个更深层的转变：**人类的核心价值正从"写代码"转向"设计系统"。**

当模型足够强大，工程师的工作不再是一行行地编写逻辑，而是设计约束、搭建环境、定义质量标准、构建反馈回路。Harness engineering 就是这种新型工程能力的第一个正式名字。

这门学科还很年轻。多智能体架构中的 harness 设计、非编码场景（科学研究、金融建模）的 harness 模式、自然语言定义的可移植 harness——这些方向都处于早期探索阶段。

但有一点已经很清楚：在 AI 智能体时代，写好提示词只是入门，设计好 harness 才是真功夫。
