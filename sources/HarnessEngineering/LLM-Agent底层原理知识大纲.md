---
title: 深度理解 LLM Agent 底层原理
created: 2026-10-12
updated: 2026-10-12
source_checked_at: 2026-10-12
type: knowledge-outline
review: unreviewed
verification: sources-checked
tags:
  - LLM-Agent
  - RAG
  - MCP
  - 多智能体
---

# 深度理解 LLM Agent 底层原理

> 知识范围：任务规划、Function Calling、MCP、RAG、向量知识库、长短期记忆、上下文工程、多智能体编排与评估。
>
> 本文为 AI 协助整理的学习大纲，尚未经过人工复核。2026-10-12 已核对所列官方页面及论文题名与原始入口；不表示已复现论文实验或验证所有工程行为。

## 学习主线

理解 Agent 如何把用户目标转化为行动，利用外部知识与工具，根据反馈持续推进，最后验证任务是否完成。

目标输入 → 任务规划 → 工具与知识调用 → 观察反馈 → 更新状态与记忆 → 调整计划 → 验证交付

## 资料使用说明

- 每个条目都映射到官方资料；编号可以直接点击，完整题名、发布方与用途见文末资料目录。
- 官方资料优先采用 OpenAI、Anthropic、DeepSeek、Kimi / Moonshot AI。MCP 协议和向量索引另补 MCP、Meta / Faiss 官方资料，避免用模型厂商文档代替协议和算法规范。
- 论文选取以奠基性方法、代表性架构和评估工作为主。“经典/代表作”是阅读筛选，不是按实时引用次数排名；较新的官方技术报告单独标注，不一概称为高被引经典。
- 表中的论文是相关方法或研究背景。Schema 字段、重试、幂等、权限、删除与版本迁移等工程规则，以官方契约和应用实现为准；没有直接对应的论文时明确留空。
- 论文年份统一使用首次公开年份，可能早于会议或期刊发表年份。官方文档是动态页面，具体模型支持范围与 API 参数以打开时的内容为准。
- 四家提供的能力不同，无需为每个知识点凑齐四家。Kimi 文件问答不自动等于向量 RAG，DeepSeek/Kimi 上下文缓存不等于长期记忆；记忆分类也不是四家统一的 API 标准。

## 一、基础认知：从大语言模型到 Agent

### 1.1 LLM 的工作基础

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| Token 与文本生成机制 | [O17][O17] | [P01][P01]、[P02][P02] |
| 上下文窗口与容量限制 | [O17][O17] | [P25][P25] |
| 指令遵循与结构化输出 | [O04][O04] | [P03][P03] |
| 语言理解、推理与幻觉 | [O08][O08]、[O37][O37]、[O10][O10] | [P04][P04]、[P37][P37]、[P32][P32] |
| 模型知识的时效性 | [O01][O01] | [P02][P02] |

**阅读重点**：先理解 Token 与上下文，再区分预训练、指令训练和推理训练。

**本节论文**：[Attention Is All You Need][P01]（2017，基础经典）；[Language Models are Few-Shot Learners][P02]（2020，基础经典）；[Training language models to follow instructions with human feedback][P03]（2022，基础经典）；[DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning][P37]（2025，官方研究论文）；[DeepSeek-V3 Technical Report][P38]（2024，官方技术报告）。

### 1.2 Agent 的核心组成

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 模型：理解输入并判断下一步 | [O01][O01] | [P02][P02] |
| 指令：定义目标、约束与行为规范 | [O02][O02] | [P03][P03] |
| 工具：访问数据并执行外部操作 | [O03][O03] | [P07][P07] |
| 状态：记录任务进度与执行结果 | [O13][O13] | [P06][P06] |
| 记忆：保存可复用的信息与经验 | [O22][O22] | [P23][P23] |
| 执行循环：持续行动、观察与调整 | [O13][O13] | [P06][P06] |

**阅读重点**：画出模型、工具执行器、任务状态和外部存储的边界。

**本节论文**：[MRKL Systems: A modular, neuro-symbolic architecture that combines large language models, external knowledge sources and discrete reasoning][P05]（2022，架构代表作）；[ReAct: Synergizing Reasoning and Acting in Language Models][P06]（2022，Agent 经典）；[MemGPT: Towards LLMs as Operating Systems][P23]（2023，记忆代表作）。

### 1.3 架构边界

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 普通对话：根据输入生成回答 | [O01][O01] | [P02][P02] |
| 固定工作流：按照预定义路径执行 | [O02][O02] | [P05][P05] |
| 自主 Agent：由模型动态决定行动路径 | [O02][O02] | [P06][P06] |
| 不同架构的适用条件与成本 | [O02][O02]、[O12][O12] | [P27][P27] |

**阅读重点**：比较固定控制流与模型决定下一步；不要把有多步调用的程序都当成自主 Agent。

**本节论文**：[MRKL Systems: A modular, neuro-symbolic architecture that combines large language models, external knowledge sources and discrete reasoning][P05]（2022，架构代表作）；[ReAct: Synergizing Reasoning and Acting in Language Models][P06]（2022，Agent 经典）。

### 1.4 Agent 运行闭环

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 接收目标 | [O13][O13] | [P06][P06] |
| 判断下一步 | [O13][O13] | [P06][P06] |
| 执行动作 | [O13][O13] | [P06][P06] |
| 观察结果 | [O13][O13] | [P06][P06] |
| 更新状态 | [O13][O13] | [P06][P06] |
| 继续执行或结束任务 | [O13][O13] | [P06][P06] |

**阅读重点**：对照四家工具调用流程；看清结果如何回到下一次模型输入。

**本节论文**：[ReAct: Synergizing Reasoning and Acting in Language Models][P06]（2022，Agent 经典）。

**核心问题：模型生成文本，如何变成系统执行任务？**

## 二、任务规划：把目标拆成可执行步骤

### 2.1 目标建模

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 输入与预期交付物 | [O02][O02]、[O29][O29] | [P08][P08] |
| 时间、成本和权限约束 | [O13][O13]、[O32][O32]、[O12][O12] | [P12][P12] |
| 成功标准与验收条件 | [O10][O10]、[O29][O29] | [P31][P31] |
| 模糊目标的澄清 | [O02][O02] | [P08][P08] |

**阅读重点**：先写验收标准，再研究分解；经典规划与自然语言计划的可验证程度不同。

**本节论文**：[Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models][P08]（2023，规划代表作）；[LLM+P: Empowering Large Language Models with Optimal Planning Proficiency][P12]（2023，规划拓展）。

### 2.2 任务分解

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 子任务粒度 | [O02][O02]、[O27][O27] | [P08][P08] |
| 任务依赖关系 | [O27][O27] | [P13][P13] |
| 顺序执行与并行执行 | [O21][O21]、[O27][O27] | [P13][P13] |
| 中间结果与检查点 | [O29][O29] | [P10][P10] |

**阅读重点**：区分子任务分解和依赖图；有依赖的调用不能直接并行。

**本节论文**：[Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models][P08]（2023，规划代表作）；[An LLM Compiler for Parallel Function Calling][P13]（2023，并行执行代表作）。

### 2.3 规划方式

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 预先制定计划，再逐步执行 | [O02][O02] | [P08][P08] |
| 根据观察结果动态决定下一步 | [O08][O08]、[O27][O27] | [P06][P06] |
| 分层规划：整体目标、阶段任务、具体动作 | [O27][O27] | [P12][P12]、[P09][P09] |

**阅读重点**：分别比较固定计划、边执行边规划与候选路径搜索。

**本节论文**：[ReAct: Synergizing Reasoning and Acting in Language Models][P06]（2022，Agent 经典）；[Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models][P08]（2023，规划代表作）；[Tree of Thoughts: Deliberate Problem Solving with Large Language Models][P09]（2023，推理代表作）；[LLM+P: Empowering Large Language Models with Optimal Planning Proficiency][P12]（2023，规划拓展）。

### 2.4 常见模式

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| ReAct：结合推理、行动与观察 | [O02][O02] | [P06][P06] |
| Plan-and-Execute：规划与执行分离 | [O13][O13] | [P08][P08] |
| 规划者与执行者分工 | [O02][O02]、[O27][O27] | [P13][P13] |
| 执行结果检查与计划修订 | [O29][O29] | [P10][P10] |

**阅读重点**：ReAct 对照原论文；Plan-and-Solve 是提示策略，Plan-and-Execute 是更广的运行时设计模式。

**本节论文**：[ReAct: Synergizing Reasoning and Acting in Language Models][P06]（2022，Agent 经典）；[Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models][P08]（2023，规划代表作）；[An LLM Compiler for Parallel Function Calling][P13]（2023，并行执行代表作）。

### 2.5 失败恢复与停止条件

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 信息不足时补充检索 | [O24][O24] | [P06][P06] |
| 执行失败时重试或切换路径 | [O13][O13]、[O29][O29] | [P10][P10] |
| 成功判定 | [O10][O10]、[O29][O29] | [P31][P31] |
| 最大轮数、时间与成本预算 | [O13][O13]、[O43][O43]、[O12][O12] | —（工程规则以官方契约为准） |

**阅读重点**：研究如何记录失败、修订计划与判断完成；迭代上限不能替代结果验收。

**本节论文**：[Reflexion: Language Agents with Verbal Reinforcement Learning][P10]（2023，反馈与记忆代表作）；[Self-Refine: Iterative Refinement with Self-Feedback][P11]（2023，反馈代表作）。

**核心问题：计划由谁维护，执行偏离计划后如何恢复？**

## 三、Function Calling：模型如何使用工具

### 3.1 工具定义

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 工具名称与用途描述 | [O19][O19]、[O26][O26]、[O33][O33]、[O36][O36] | [P07][P07] |
| 参数 Schema | [O03][O03]、[O19][O19] | —（工程规则以官方契约为准） |
| 必填参数与类型约束 | [O03][O03]、[O04][O04] | —（工程规则以官方契约为准） |
| 返回结果与错误格式 | [O20][O20]、[O33][O33]、[O36][O36] | —（工程规则以官方契约为准） |

**阅读重点**：字段与 Schema 看官方契约；论文解释模型如何学会选工具和生成参数。

**本节论文**：[Toolformer: Language Models Can Teach Themselves to Use Tools][P07]（2023，工具学习代表作）；[Kimi K2: Open Agentic Intelligence][P39]（2025，官方技术报告）。

### 3.2 调用流程

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 程序向模型提供工具描述 | [O03][O03]、[O33][O33]、[O36][O36] | [P07][P07] |
| 模型提出工具调用及参数 | [O03][O03]、[O33][O33]、[O36][O36] | [P07][P07] |
| 程序校验参数并执行工具 | [O20][O20] | —（工程规则以官方契约为准） |
| 程序返回执行结果 | [O03][O03]、[O20][O20] | —（工程规则以官方契约为准） |
| 模型根据结果继续判断 | [O18][O18] | [P06][P06] |

**阅读重点**：跟踪调用 ID、模型请求、实际执行与结果回传。

**本节论文**：[ReAct: Synergizing Reasoning and Acting in Language Models][P06]（2022，Agent 经典）；[Toolformer: Language Models Can Teach Themselves to Use Tools][P07]（2023，工具学习代表作）。

### 3.3 工具选择与参数生成

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 工具描述的清晰度 | [O19][O19]、[O26][O26] | [P07][P07] |
| 相似工具之间的区分 | [O26][O26]、[O40][O40] | [P07][P07] |
| 参数歧义与缺失信息 | [O03][O03]、[O19][O19] | [P39][P39] |
| 结构化输出与执行前校验 | [O04][O04]、[O03][O03] | —（工程规则以官方契约为准） |

**阅读重点**：研究描述、参数约束和按需工具加载，分别检查选错工具与填错参数。

**本节论文**：[Toolformer: Language Models Can Teach Themselves to Use Tools][P07]（2023，工具学习代表作）；[Kimi K2: Open Agentic Intelligence][P39]（2025，官方技术报告）。

### 3.4 执行控制

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 串行与并行调用 | [O21][O21] | [P13][P13] |
| 超时与重试 | [O20][O20]、[O13][O13] | —（工程规则以官方契约为准） |
| 幂等与重复执行 | [O43][O43]、[O20][O20] | —（工程规则以官方契约为准） |
| 调用次数和成本限制 | [O13][O13]、[O12][O12] | —（工程规则以官方契约为准） |

**阅读重点**：并行以依赖关系为前提；幂等键、超时和重试需要应用与下游服务实现。

**本节论文**：[An LLM Compiler for Parallel Function Calling][P13]（2023，并行执行代表作）；[τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains][P31]（2024，工具评估代表作）。

### 3.5 权限与错误处理

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 只读工具与写入工具 | [O32][O32]、[O11][O11] | [P34][P34] |
| 授权与敏感操作确认 | [O32][O32]、[O09][O09] | [P35][P35] |
| 参数错误 | [O04][O04]、[O20][O20] | —（工程规则以官方契约为准） |
| 工具不可用 | [O20][O20] | —（工程规则以官方契约为准） |
| 结果不完整 | [O20][O20]、[O26][O26] | [P31][P31] |
| 执行失败后的恢复 | [O20][O20]、[O13][O13] | [P10][P10] |

**阅读重点**：Schema 校验、工具权限和业务授权是不同层面的控制。

**本节论文**：[InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated Large Language Model Agents][P34]（2024，安全评估代表作）；[Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection][P35]（2023，安全代表作）。

**核心问题：模型负责提出调用，运行程序负责实际执行，两者如何协作？**

## 四、MCP：工具和上下文如何标准化接入

### 4.1 MCP 的定位

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 连接 AI 应用与外部能力的协议 | [O45][O45] | —（工程规则以官方契约为准） |
| 工具与数据接口的标准化 | [O45][O45]、[O46][O46] | —（工程规则以官方契约为准） |
| 不同应用之间的能力复用 | [O09][O09]、[O41][O41] | —（工程规则以官方契约为准） |

**阅读重点**：以协议规范确定 MCP 定位；相关论文仅解释工具与外部模块架构。

**本节论文**：[MRKL Systems: A modular, neuro-symbolic architecture that combines large language models, external knowledge sources and discrete reasoning][P05]（2022，架构代表作）；[Toolformer: Language Models Can Teach Themselves to Use Tools][P07]（2023，工具学习代表作）。

> 本节论文用于理解工具架构或安全背景，不是 MCP 协议的原始定义；协议字段与语义请读 MCP 官方资料。

### 4.2 架构组成

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| Host：承载 AI 功能的应用 | [O45][O45] | —（工程规则以官方契约为准） |
| Client：与 MCP Server 通信的组件 | [O45][O45] | —（工程规则以官方契约为准） |
| Server：提供工具、资源与提示模板的服务 | [O45][O45] | —（工程规则以官方契约为准） |

**阅读重点**：按 Host、Client、Server 画通信路径；论文是模块化架构背景。

**本节论文**：[MRKL Systems: A modular, neuro-symbolic architecture that combines large language models, external knowledge sources and discrete reasoning][P05]（2022，架构代表作）。

> 本节论文用于理解工具架构或安全背景，不是 MCP 协议的原始定义；协议字段与语义请读 MCP 官方资料。

### 4.3 核心能力

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| Tools：可调用的操作 | [O46][O46] | —（工程规则以官方契约为准） |
| Resources：可读取的上下文与数据 | [O46][O46] | —（工程规则以官方契约为准） |
| Prompts：可复用的提示模板 | [O46][O46] | —（工程规则以官方契约为准） |

**阅读重点**：分别理解工具、数据和提示模板；论文不定义 MCP 三类原语。

**本节论文**：[MRKL Systems: A modular, neuro-symbolic architecture that combines large language models, external knowledge sources and discrete reasoning][P05]（2022，架构代表作）；[Toolformer: Language Models Can Teach Themselves to Use Tools][P07]（2023，工具学习代表作）。

> 本节论文用于理解工具架构或安全背景，不是 MCP 协议的原始定义；协议字段与语义请读 MCP 官方资料。

### 4.4 连接与调用流程

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 初始化 / 能力发现（按协议版本区分） | [O45][O45]、[O47][O47] | —（工程规则以官方契约为准） |
| 能力发现 | [O45][O45]、[O47][O47] | —（工程规则以官方契约为准） |
| 请求与响应 | [O45][O45]、[O09][O09] | —（工程规则以官方契约为准） |
| 连接生命周期与异常处理 | [O45][O45]、[O47][O47] | —（工程规则以官方契约为准） |

**阅读重点**：先确定协议版本，再读能力发现与消息交换；具体方法名由规范定义。

**本节论文**：[MRKL Systems: A modular, neuro-symbolic architecture that combines large language models, external knowledge sources and discrete reasoning][P05]（2022，架构代表作）。

> 本节论文用于理解工具架构或安全背景，不是 MCP 协议的原始定义；协议字段与语义请读 MCP 官方资料。

> 版本提示：本次打开的 MCP 文档为 `2026-07-28` 版，强调无状态请求与 `server/discover` 能力发现。旧版 `initialize` 握手和新版发现流程不能混用，应先确认客户端、服务端与 SDK 所用协议版本。

### 4.5 与 Function Calling 的关系

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| Function Calling：模型提出结构化工具调用的机制 | [O03][O03]、[O33][O33]、[O36][O36] | [P07][P07] |
| MCP：外部能力的接入与通信协议 | [O45][O45] | —（工程规则以官方契约为准） |
| 应用如何将 MCP 工具提供给模型 | [O09][O09]、[O41][O41] | —（工程规则以官方契约为准） |

**阅读重点**：对照 MCP tools/list、tools/call 与模型工具调用；协议接入和模型调用分属不同层。

**本节论文**：[Toolformer: Language Models Can Teach Themselves to Use Tools][P07]（2023，工具学习代表作）。

> 本节论文用于理解工具架构或安全背景，不是 MCP 协议的原始定义；协议字段与语义请读 MCP 官方资料。

### 4.6 工程边界

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 身份认证 | [O48][O48] | —（工程规则以官方契约为准） |
| 权限管理 | [O49][O49]、[O32][O32] | —（工程规则以官方契约为准） |
| 服务隔离 | [O49][O49] | [P34][P34] |
| 外部内容可信度 | [O09][O09]、[O49][O49] | [P35][P35] |

**阅读重点**：区分身份认证、权限范围与外部内容的指令可信度。

**本节论文**：[InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated Large Language Model Agents][P34]（2024，安全评估代表作）；[Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection][P35]（2023，安全代表作）。

> 本节论文用于理解工具架构或安全背景，不是 MCP 协议的原始定义；协议字段与语义请读 MCP 官方资料。

**核心问题：如何让不同 Agent 应用复用同一组工具和数据接口？**

## 五、RAG：让回答建立在外部知识之上

### 5.1 基本原理

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 检索相关资料 | [O05][O05] | [P15][P15] |
| 将证据放入模型上下文 | [O01][O01]、[O05][O05] | [P14][P14] |
| 根据证据生成回答与引用 | [O05][O05]、[O27][O27] | [P14][P14]、[P32][P32] |

**阅读重点**：理解检索证据进入上下文的过程，并区分原论文训练方案与常见推理期 RAG。

**本节论文**：[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks][P14]（2020，RAG 经典）。

### 5.2 离线准备

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 文档解析与清洗 | [O42][O42]、[O25][O25] | —（工程规则以官方契约为准） |
| 文档切分 | [O05][O05]、[O25][O25] | [P14][P14] |
| 元数据提取 | [O05][O05] | —（工程规则以官方契约为准） |
| Embedding 生成 | [O06][O06] | [P16][P16]、[P15][P15] |
| 索引构建与更新 | [O05][O05]、[O50][O50] | [P19][P19] |

**阅读重点**：切片与上下文补全看官方工程文章，检索表示学习看论文。

**本节论文**：[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks][P14]（2020，RAG 经典）；[Dense Passage Retrieval for Open-Domain Question Answering][P15]（2020，检索经典）。

### 5.3 在线流程

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 理解用户查询 | [O24][O24] | [P21][P21] |
| 检索候选资料 | [O05][O05] | [P15][P15] |
| 重排序与筛选 | [O25][O25] | [P17][P17] |
| 组装上下文 | [O24][O24] | [P14][P14] |
| 生成回答 | [O05][O05]、[O27][O27] | [P14][P14] |
| 检查引用与证据支持程度 | [O10][O10] | [P32][P32]、[P33][P33] |

**阅读重点**：拆开检索、筛选、生成与事实检查；有引用不等于引用支持所有结论。

**本节论文**：[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks][P14]（2020，RAG 经典）；[Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection][P20]（2023，RAG 代表作）；[FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation][P32]（2023，事实评估代表作）。

### 5.4 检索策略

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 关键词检索 | [O25][O25] | —（工程规则以官方契约为准） |
| 向量检索 | [O05][O05]、[O06][O06] | [P15][P15] |
| 混合检索 | [O25][O25]、[O05][O05] | [P17][P17] |
| 元数据过滤 | [O05][O05] | —（工程规则以官方契约为准） |
| 重排序 | [O25][O25] | [P17][P17] |

**阅读重点**：官方文章覆盖关键词与混合检索，DPR/ColBERT 用于比较不同稠密检索方法。

**本节论文**：[Dense Passage Retrieval for Open-Domain Question Answering][P15]（2020，检索经典）；[ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT][P17]（2020，检索代表作）。

### 5.5 进阶方法

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 查询改写 | [O24][O24] | [P21][P21] |
| 多轮检索 | [O27][O27] | [P06][P06] |
| 按需检索 | [O24][O24] | [P20][P20] |
| 根据证据缺口追加检索 | [O27][O27] | [P20][P20] |

**阅读重点**：比较检索决策、假设文档检索与多步搜索；假设文档只用于检索。

**本节论文**：[Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection][P20]（2023，RAG 代表作）；[Precise Zero-Shot Dense Retrieval without Relevance Labels][P21]（2022，检索代表作）；[ReAct: Synergizing Reasoning and Acting in Language Models][P06]（2022，Agent 经典）。

### 5.6 失败分析

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 没有召回相关证据 | [O25][O25] | [P33][P33] |
| 召回内容不相关 | [O10][O10]、[O25][O25] | [P33][P33] |
| 证据存在冲突 | [O10][O10] | [P32][P32] |
| 上下文信息不足 | [O24][O24] | [P25][P25] |
| 回答超出证据范围 | [O10][O10] | [P32][P32] |

**阅读重点**：按检索错误、证据使用错误和事实错误拆分评估。

**本节论文**：[Ragas: Automated Evaluation of Retrieval Augmented Generation][P33]（2023，RAG 评估代表作）；[FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation][P32]（2023，事实评估代表作）；[Lost in the Middle: How Language Models Use Long Contexts][P25]（2023，长上下文代表作）。

**核心问题：是检索没找到证据，还是模型没有正确使用证据？**

## 六、向量知识库：语义检索的底层机制

### 6.1 Embedding 原理

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 文本如何映射为向量 | [O06][O06] | [P16][P16] |
| 语义相似性的表达 | [O06][O06] | [P16][P16] |
| Embedding 模型与适用任务 | [O06][O06] | [P15][P15] |

**阅读重点**：区分语义相似度训练目标与检索相关性训练目标。

**本节论文**：[Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks][P16]（2019，Embedding 经典）；[Dense Passage Retrieval for Open-Domain Question Answering][P15]（2020，检索经典）。

### 6.2 相似度计算

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 余弦相似度 | [O06][O06] | [P16][P16] |
| 点积 | [O06][O06]、[O50][O50] | [P15][P15] |
| 欧氏距离 | [O06][O06]、[O50][O50] | [P19][P19] |
| 相似度与相关性的区别 | [O06][O06]、[O05][O05] | [P15][P15] |

**阅读重点**：检查向量归一化和距离约定，不能脱离模型与索引配置解释分数。

**本节论文**：[Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks][P16]（2019，Embedding 经典）；[Billion-scale similarity search with GPUs][P19]（2017，向量索引经典）。

### 6.3 向量索引

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 精确搜索 | [O50][O50] | [P19][P19] |
| 近似最近邻搜索 | [O50][O50] | [P18][P18]、[P19][P19] |
| HNSW 的基本思路 | [O50][O50] | [P18][P18] |
| IVF 的基本思路 | [O50][O50] | [P19][P19] |
| 召回率、速度与资源消耗的权衡 | [O50][O50] | [P18][P18]、[P19][P19] |

**阅读重点**：HNSW 看原论文；IVF 与具体索引参数结合 Faiss 文档。

**本节论文**：[Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs][P18]（2016，向量索引经典）；[Billion-scale similarity search with GPUs][P19]（2017，向量索引经典）。

### 6.4 数据设计

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 原始文档与切片 | [O05][O05] | [P14][P14] |
| 向量与文本映射 | [O05][O05]、[O51][O51] | [P15][P15] |
| 来源、时间与版本 | [O05][O05] | —（工程规则以官方契约为准） |
| 权限元数据 | [O05][O05]、[O11][O11] | —（工程规则以官方契约为准） |

**阅读重点**：保留文档 ID、来源和元数据；权限需要服务端校验。

**本节论文**：[Dense Passage Retrieval for Open-Domain Question Answering][P15]（2020，检索经典）；[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks][P14]（2020，RAG 经典）。

### 6.5 检索调优

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 切片大小与重叠 | [O05][O05]、[O25][O25] | [P14][P14] |
| Top-K | [O05][O05] | [P15][P15] |
| 元数据过滤 | [O05][O05] | —（工程规则以官方契约为准） |
| 重排序 | [O25][O25] | [P17][P17] |
| 检索质量评估 | [O10][O10] | [P33][P33] |

**阅读重点**：分别评估切片、检索和排序，避免只看最终回答主观质量。

**本节论文**：[Dense Passage Retrieval for Open-Domain Question Answering][P15]（2020，检索经典）；[ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT][P17]（2020，检索代表作）；[Ragas: Automated Evaluation of Retrieval Augmented Generation][P33]（2023，RAG 评估代表作）。

### 6.6 生命周期管理

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 增量更新 | [O05][O05]、[O51][O51] | —（工程规则以官方契约为准） |
| 删除与失效处理 | [O05][O05]、[O51][O51] | —（工程规则以官方契约为准） |
| 版本管理 | [O05][O05]、[O51][O51] | —（工程规则以官方契约为准） |
| Embedding 模型迁移与重新索引 | [O06][O06]、[O51][O51] | [P15][P15] |

**阅读重点**：模型变更后重新生成文档和查询向量，并验证旧索引是否仍适用。

**本节论文**：[Billion-scale similarity search with GPUs][P19]（2017，向量索引经典）；[Dense Passage Retrieval for Open-Domain Question Answering][P15]（2020，检索经典）。

> 索引生命周期属于工程设计。Faiss 仅是向量索引库，不自动提供业务权限、文档版本管理或完整向量数据库服务。

**核心问题：向量相似为什么不一定意味着答案相关或事实正确？**

## 七、长短期记忆：Agent 如何保持连续性

### 7.1 短期记忆

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 当前对话 | [O07][O07]、[O34][O34]、[O38][O38] | [P23][P23] |
| 任务状态 | [O13][O13] | [P06][P06] |
| 工具执行结果 | [O20][O20] | [P06][P06] |
| 当前工作上下文 | [O24][O24] | [P23][P23] |

**阅读重点**：对照状态延续与应用侧历史管理；历史存在不表示全量历史都进入当前上下文。

**本节论文**：[MemGPT: Towards LLMs as Operating Systems][P23]（2023，记忆代表作）。

### 7.2 长期记忆

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 用户偏好 | [O22][O22] | [P22][P22] |
| 历史事件 | [O22][O22] | [P22][P22] |
| 任务经验 | [O22][O22]、[O29][O29] | [P10][P10] |
| 持久化知识 | [O22][O22]、[O05][O05] | [P14][P14]、[P23][P23] |

**阅读重点**：看跨会话持久化和按需读取，区分偏好、经验与文档知识。

**本节论文**：[Generative Agents: Interactive Simulacra of Human Behavior][P22]（2023，记忆经典）；[MemGPT: Towards LLMs as Operating Systems][P23]（2023，记忆代表作）。

### 7.3 记忆类型

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 事实记忆：已知信息 | [O22][O22] | [P22][P22] |
| 情景记忆：历史事件与经历 | [O22][O22] | [P22][P22] |
| 程序性记忆：方法、流程与经验 | [O22][O22]、[O29][O29] | [P10][P10] |

**阅读重点**：事实、情景与程序性记忆是本大纲的教学分类；四家文档没有统一的同名分类标准。

**本节论文**：[Generative Agents: Interactive Simulacra of Human Behavior][P22]（2023，记忆经典）；[Reflexion: Language Agents with Verbal Reinforcement Learning][P10]（2023，反馈与记忆代表作）；[MemGPT: Towards LLMs as Operating Systems][P23]（2023，记忆代表作）。

### 7.4 写入策略

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 什么信息值得记住 | [O22][O22]、[O24][O24] | [P22][P22] |
| 去重与归纳 | [O22][O22]、[O24][O24] | [P22][P22] |
| 来源与可信度标记 | [O22][O22]、[O29][O29] | [P24][P24] |
| 敏感信息处理 | [O22][O22]、[O32][O32] | —（工程规则以官方契约为准） |

**阅读重点**：分开设计写入准则、归纳方式与来源标记；需要记录推断与原始证据的差异。

**本节论文**：[Generative Agents: Interactive Simulacra of Human Behavior][P22]（2023，记忆经典）；[Reflexion: Language Agents with Verbal Reinforcement Learning][P10]（2023，反馈与记忆代表作）。

### 7.5 读取策略

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 相关性 | [O05][O05]、[O24][O24] | [P22][P22] |
| 时效性 | [O22][O22]、[O24][O24] | [P24][P24] |
| 重要性 | [O22][O22]、[O24][O24] | [P22][P22] |
| 访问权限 | [O22][O22]、[O32][O32] | —（工程规则以官方契约为准） |
| 上下文预算 | [O17][O17]、[O24][O24] | [P23][P23] |

**阅读重点**：相关性、时间和重要性用于排序，权限在检索前后都应有明确边界。

**本节论文**：[Generative Agents: Interactive Simulacra of Human Behavior][P22]（2023，记忆经典）；[LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory][P24]（2024，记忆评估代表作）。

### 7.6 遗忘与纠错

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 过期信息处理 | [O22][O22] | [P24][P24] |
| 冲突记忆更新 | [O22][O22] | [P24][P24] |
| 错误记忆修正 | [O22][O22] | [P24][P24] |
| 用户主动删除 | [O22][O22] | —（工程规则以官方契约为准） |

**阅读重点**：更新与删除看工具契约；知识更新和过时信息识别看 LongMemEval，不能把删除文件等同于模型遗忘。

**本节论文**：[LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory][P24]（2024，记忆评估代表作）。

### 7.7 记忆与 RAG 的关系

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 记忆可以借助检索实现 | [O22][O22]、[O05][O05] | [P23][P23]、[P14][P14] |
| 记忆还需要写入、更新与遗忘策略 | [O22][O22] | [P24][P24] |
| 文档知识与个人记忆的管理差异 | [O22][O22]、[O05][O05] | [P22][P22]、[P14][P14] |

**阅读重点**：RAG 是检索增强生成方法，长期记忆另需写入、更新和遗忘策略。

**本节论文**：[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks][P14]（2020，RAG 经典）；[MemGPT: Towards LLMs as Operating Systems][P23]（2023，记忆代表作）。

**核心问题：如何保留有用经验，又避免错误长期积累？**

## 八、上下文工程：把信息送到模型面前

### 8.1 上下文构成

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 系统指令 | [O24][O24] | [P03][P03] |
| 用户目标 | [O24][O24] | [P06][P06] |
| 任务状态 | [O13][O13]、[O24][O24] | [P06][P06] |
| 工具描述 | [O19][O19]、[O24][O24] | [P07][P07] |
| 检索证据 | [O05][O05]、[O24][O24] | [P14][P14] |
| 历史记忆 | [O22][O22]、[O24][O24] | [P23][P23] |

**阅读重点**：列出不同信息来源，观察它们如何共同占用上下文。

**本节论文**：[MemGPT: Towards LLMs as Operating Systems][P23]（2023，记忆代表作）；[Lost in the Middle: How Language Models Use Long Contexts][P25]（2023，长上下文代表作）。

### 8.2 上下文预算

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 必须保留的信息 | [O24][O24] | [P25][P25] |
| 可以压缩的信息 | [O07][O07]、[O23][O23] | [P26][P26] |
| 可以外置的信息 | [O22][O22]、[O24][O24] | [P23][P23] |
| 为输出预留空间 | [O17][O17]、[O08][O08] | —（工程规则以官方契约为准） |

**阅读重点**：为推理与输出留预算，测试压缩是否丢失任务约束。

**本节论文**：[Lost in the Middle: How Language Models Use Long Contexts][P25]（2023，长上下文代表作）；[LongLLMLingua: Accelerating and Enhancing LLMs in Long Context Scenarios via Prompt Compression][P26]（2023，上下文压缩代表作）。

### 8.3 管理方法

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 摘要与压缩 | [O07][O07]、[O24][O24] | [P26][P26] |
| 滚动窗口 | [O38][O38]、[O23][O23] | [P23][P23] |
| 按需加载 | [O40][O40]、[O24][O24] | [P23][P23] |
| 状态外置 | [O22][O22]、[O29][O29] | [P23][P23] |
| 分阶段上下文构建 | [O24][O24] | [P06][P06] |

**阅读重点**：分别比较摘要、删除可重新获取的结果、按需加载和外置状态。

**本节论文**：[MemGPT: Towards LLMs as Operating Systems][P23]（2023，记忆代表作）；[LongLLMLingua: Accelerating and Enhancing LLMs in Long Context Scenarios via Prompt Compression][P26]（2023，上下文压缩代表作）。

### 8.4 信息优先级

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 权威来源 | [O11][O11]、[O24][O24] | [P35][P35] |
| 近期状态 | [O24][O24]、[O39][O39] | [P24][P24] |
| 关键约束 | [O24][O24] | [P25][P25] |
| 当前任务相关性 | [O24][O24] | [P25][P25] |

**阅读重点**：证据可信度与缓存顺序是不同问题；把外部文本当数据处理。

**本节论文**：[Lost in the Middle: How Language Models Use Long Contexts][P25]（2023，长上下文代表作）；[LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory][P24]（2024，记忆评估代表作）；[Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection][P35]（2023，安全代表作）。

### 8.5 常见问题

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 上下文污染 | [O11][O11]、[O24][O24] | [P35][P35] |
| 摘要丢失细节 | [O24][O24] | [P26][P26] |
| 重复信息 | [O23][O23]、[O40][O40] | [P26][P26] |
| 指令冲突 | [O11][O11] | [P35][P35] |
| 无关信息占用预算 | [O24][O24] | [P25][P25] |

**阅读重点**：分别测试位置效应、压缩损失与指令注入。

**本节论文**：[Lost in the Middle: How Language Models Use Long Contexts][P25]（2023，长上下文代表作）；[LongLLMLingua: Accelerating and Enhancing LLMs in Long Context Scenarios via Prompt Compression][P26]（2023，上下文压缩代表作）；[Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection][P35]（2023，安全代表作）。

**核心问题：知识已经存储，为什么 Agent 仍然可能“想不起来”？**

## 九、多智能体编排：如何分工与协作

### 9.1 适用条件

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 任务可以独立并行 | [O27][O27] | [P13][P13] |
| 需要不同能力或专业视角 | [O14][O14]、[O31][O31] | [P27][P27]、[P28][P28] |
| 需要独立复核 | [O02][O02] | [P11][P11] |
| 分工收益能够覆盖协调成本 | [O27][O27]、[O12][O12] | [P27][P27] |

**阅读重点**：先确认任务可独立分解，再比较单 Agent 与多 Agent 的质量、延迟和成本。

**本节论文**：[AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation][P27]（2023，多智能体代表作）；[MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework][P29]（2023，多智能体代表作）。

### 9.2 架构模式

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 主管与执行者 | [O14][O14]、[O27][O27] | [P27][P27] |
| 流水线 | [O02][O02] | [P29][P29] |
| 并行专家 | [O27][O27] | [P13][P13] |
| 任务交接 | [O14][O14] | [P27][P27] |
| 执行者与评审者 | [O02][O02] | [P11][P11] |

**阅读重点**：比较主管调用专家、任务交接、流水线和评审模式。

**本节论文**：[AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation][P27]（2023，多智能体代表作）；[CAMEL: Communicative Agents for “Mind” Exploration of Large Language Model Society][P28]（2023，多智能体代表作）；[MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework][P29]（2023，多智能体代表作）。

### 9.3 任务分派

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 明确职责边界 | [O27][O27]、[O31][O31] | [P28][P28] |
| 定义输入与输出 | [O27][O27] | [P29][P29] |
| 明确完成标准 | [O10][O10]、[O27][O27] | [P31][P31] |
| 分配工具与权限 | [O31][O31]、[O32][O32] | —（工程规则以官方契约为准） |

**阅读重点**：为每个角色约定目标、输入、输出和工具边界。

**本节论文**：[CAMEL: Communicative Agents for “Mind” Exploration of Large Language Model Society][P28]（2023，多智能体代表作）；[MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework][P29]（2023，多智能体代表作）。

### 9.4 通信与状态

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 消息协议 | [O14][O14]、[O31][O31] | [P27][P27] |
| 共享状态 | [O07][O07]、[O14][O14] | [P29][P29] |
| 独立上下文 | [O31][O31] | [P27][P27] |
| 信息同步与交接 | [O14][O14]、[O27][O27] | [P29][P29] |

**阅读重点**：区分消息内容、共享业务状态与各 Agent 的模型上下文。

**本节论文**：[AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation][P27]（2023，多智能体代表作）；[MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework][P29]（2023，多智能体代表作）。

### 9.5 结果整合

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 冲突处理 | [O27][O27]、[O10][O10] | [P11][P11] |
| 证据合并 | [O27][O27] | [P32][P32] |
| 重复结果去除 | [O27][O27]、[O10][O10] | [P29][P29] |
| 质量审核 | [O10][O10] | [P32][P32] |

**阅读重点**：角色评审还需外部证据和明确评分标准，不能靠互相认同判断正确。

**本节论文**：[Self-Refine: Iterative Refinement with Self-Feedback][P11]（2023，反馈代表作）；[MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework][P29]（2023，多智能体代表作）；[FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation][P32]（2023，事实评估代表作）。

### 9.6 协调成本

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 重复劳动 | [O27][O27] | [P29][P29] |
| 信息损失 | [O27][O27]、[O31][O31] | [P27][P27] |
| 延迟增加 | [O12][O12]、[O27][O27] | [P13][P13] |
| Token 开销 | [O27][O27]、[O40][O40]、[O30][O30] | [P13][P13] |
| 错误传播 | [O10][O10]、[O27][O27] | [P31][P31] |

**阅读重点**：建立单 Agent 基线，分别统计并行收益、信息重复和协调开销。

**本节论文**：[An LLM Compiler for Parallel Function Calling][P13]（2023，并行执行代表作）；[AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation][P27]（2023，多智能体代表作）。

### 9.7 退出与恢复

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 超时与失败接管 | [O13][O13]、[O27][O27] | —（工程规则以官方契约为准） |
| 循环依赖处理 | [O13][O13]、[O27][O27] | [P13][P13] |
| 局部任务终止 | [O13][O13] | —（工程规则以官方契约为准） |
| 全局任务完成判定 | [O10][O10]、[O13][O13] | [P31][P31] |

**阅读重点**：将重试、检查点与任务完成判定写入应用运行时。

**本节论文**：[AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation][P27]（2023，多智能体代表作）；[τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains][P31]（2024，工具评估代表作）。

**核心问题：增加 Agent 后，收益是否超过协调成本？**

## 十、可靠性与评估：如何证明 Agent 有效

### 10.1 任务指标

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 完成率 | [O10][O10]、[O28][O28] | [P30][P30] |
| 结果正确性 | [O10][O10]、[O28][O28] | [P31][P31] |
| 人工介入率 | [O10][O10]、[O28][O28] | [P31][P31] |
| 验收标准满足程度 | [O10][O10]、[O28][O28] | [P31][P31] |

**阅读重点**：任务结果、政策合规和重复运行一致性分开衡量。

**本节论文**：[AgentBench: Evaluating LLMs as Agents][P30]（2023，Agent 评估代表作）；[τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains][P31]（2024，工具评估代表作）。

### 10.2 规划与工具指标

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 规划步骤有效性 | [O28][O28] | [P30][P30] |
| 工具选择准确性 | [O26][O26] | [P31][P31] |
| 参数准确性 | [O26][O26]、[O44][O44] | [P31][P31] |
| 失败恢复能力 | [O28][O28] | [P31][P31]、[P10][P10] |

**阅读重点**：工具轨迹用于诊断，最终任务完成用于验收；允许多条有效路径。

**本节论文**：[τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains][P31]（2024，工具评估代表作）；[An LLM Compiler for Parallel Function Calling][P13]（2023，并行执行代表作）。

### 10.3 RAG 指标

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 召回质量 | [O25][O25] | [P33][P33] |
| 证据相关性 | [O10][O10]、[O25][O25] | [P33][P33] |
| 回答忠实度 | [O10][O10] | [P33][P33] |
| 引用准确性 | [O10][O10] | [P32][P32] |

**阅读重点**：分别测召回、上下文质量、回答忠实度与原子事实支持。

**本节论文**：[Ragas: Automated Evaluation of Retrieval Augmented Generation][P33]（2023，RAG 评估代表作）；[FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation][P32]（2023，事实评估代表作）。

### 10.4 记忆指标

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 读取准确性 | [O22][O22]、[O28][O28] | [P24][P24] |
| 更新正确性 | [O22][O22]、[O28][O28] | [P24][P24] |
| 过期信息使用率 | [O22][O22]、[O28][O28] | [P24][P24] |
| 错误记忆传播情况 | [O22][O22]、[O28][O28] | [P24][P24] |

**阅读重点**：设计跨会话、时间变化、事实更新与应当拒答的案例。

**本节论文**：[LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory][P24]（2024，记忆评估代表作）。

### 10.5 运行指标

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 延迟 | [O12][O12] | [P13][P13] |
| 成本 | [O35][O35]、[O39][O39]、[O12][O12] | [P13][P13] |
| 工具调用次数 | [O28][O28] | [P31][P31] |
| 重试次数 | [O28][O28]、[O44][O44] | [P31][P31] |

**阅读重点**：记录端到端耗时、Token 与调用次数；缓存命中只是成本指标之一。

**本节论文**：[An LLM Compiler for Parallel Function Calling][P13]（2023，并行执行代表作）；[τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains][P31]（2024，工具评估代表作）。

### 10.6 安全与可观测性

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 提示注入防护 | [O11][O11]、[O49][O49] | [P34][P34]、[P35][P35] |
| 权限隔离 | [O32][O32]、[O49][O49] | [P35][P35] |
| 执行日志 | [O15][O15] | —（工程规则以官方契约为准） |
| 轨迹回放 | [O15][O15]、[O28][O28] | [P31][P31] |
| 关键操作审计 | [O15][O15]、[O32][O32] | —（工程规则以官方契约为准） |

**阅读重点**：追踪帮助定位问题；安全训练、提示防护和运行时权限各有边界。

**本节论文**：[InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated Large Language Model Agents][P34]（2024，安全评估代表作）；[Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection][P35]（2023，安全代表作）；[Constitutional AI: Harmlessness from AI Feedback][P36]（2022，对齐代表作）。

### 10.7 评估方法

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 固定测试集 | [O10][O10]、[O44][O44] | [P30][P30] |
| 失败案例分析 | [O28][O28] | [P31][P31] |
| 回归测试 | [O10][O10]、[O28][O28] | [P31][P31] |
| 端到端任务验证 | [O10][O10]、[O28][O28] | [P30][P30] |

**阅读重点**：固定数据集与回归集，检查评分器和真实任务表现是否一致。

**本节论文**：[AgentBench: Evaluating LLMs as Agents][P30]（2023，Agent 评估代表作）；[τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains][P31]（2024，工具评估代表作）；[Ragas: Automated Evaluation of Retrieval Augmented Generation][P33]（2023，RAG 评估代表作）。

**核心问题：一次演示成功，如何转化为可重复的稳定表现？**

## 十一、综合实践：构建一个知识研究 Agent

### 11.1 项目目标

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 围绕一个主题检索资料，生成带引用的研究报告，并验证报告是否满足任务要求。 | [O27][O27]、[O16][O16] | [P06][P06]、[P14][P14]、[P32][P32] |

**阅读重点**：将研究问题、证据范围、引用要求和报告验收标准写清楚。

**本节论文**：[ReAct: Synergizing Reasoning and Acting in Language Models][P06]（2022，Agent 经典）；[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks][P14]（2020，RAG 经典）；[FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation][P32]（2023，事实评估代表作）。

### 11.2 实现步骤

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| 建立最小 Agent 循环 | [O16][O16]、[O13][O13] | [P06][P06] |
| 接入搜索与文档读取工具 | [O03][O03]、[O36][O36] | [P07][P07] |
| 引入任务规划和验收标准 | [O02][O02]、[O10][O10] | [P08][P08] |
| 建立文档索引与 RAG | [O05][O05]、[O25][O25] | [P14][P14]、[P15][P15] |
| 添加任务状态和长期记忆 | [O22][O22]、[O07][O07] | [P23][P23] |
| 按需加入检索、写作、审核 Agent | [O14][O14]、[O27][O27] | [P27][P27] |
| 记录执行轨迹，评估质量与成本 | [O15][O15]、[O28][O28] | [P31][P31] |

**阅读重点**：从最小循环逐步添加能力，每增加一层都观察质量与成本变化。

**本节论文**：[ReAct: Synergizing Reasoning and Acting in Language Models][P06]（2022，Agent 经典）；[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks][P14]（2020，RAG 经典）；[MemGPT: Towards LLMs as Operating Systems][P23]（2023，记忆代表作）；[AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation][P27]（2023，多智能体代表作）。

### 11.3 交付物

| 知识点 | 官方资料 | 论文 / 关联研究 |
| --- | --- | --- |
| Agent 架构图 | [O01][O01]、[O14][O14] | [P05][P05] |
| 工具定义与调用流程 | [O03][O03]、[O18][O18] | [P07][P07] |
| 文档索引与检索流程 | [O05][O05]、[O25][O25] | [P14][P14] |
| 记忆读写策略 | [O22][O22] | [P23][P23] |
| 多智能体协作流程 | [O14][O14]、[O27][O27] | [P27][P27] |
| 测试集与评估报告 | [O10][O10]、[O28][O28] | [P31][P31]、[P33][P33] |

**阅读重点**：交付物应包含可复现的配置、轨迹、数据集和结果，而不只是架构说明。

**本节论文**：[AgentBench: Evaluating LLMs as Agents][P30]（2023，Agent 评估代表作）；[τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains][P31]（2024，工具评估代表作）；[Ragas: Automated Evaluation of Retrieval Augmented Generation][P33]（2023，RAG 评估代表作）。

## 建议学习顺序

1. 基础认知与运行循环
2. Function Calling
3. 任务规划
4. RAG 与向量知识库
5. 记忆与上下文工程
6. MCP
7. 多智能体编排
8. 可靠性评估与综合实践

## 优先精读路线

1. **认识 Agent**：[Building effective agents][O02] → [ReAct][P06] → [Running agents][O13]。
2. **掌握工具调用**：[OpenAI Function calling][O03] → [Claude 工具循环][O18] → [DeepSeek Tool Calls][O33] → [Kimi Tool Calls][O36] → [Toolformer][P07]。
3. **掌握 RAG**：[Retrieval][O05] → [Contextual Retrieval][O25] → [RAG][P14] → [DPR][P15] → [Self-RAG][P20]。
4. **理解向量索引**：[Embeddings][O06] → [Sentence-BERT][P16] → [HNSW][P18] → [Faiss 索引][O50]。
5. **设计记忆与上下文**：[Context engineering][O24] → [Memory tool][O22] → [Generative Agents][P22] → [MemGPT][P23] → [Lost in the Middle][P25]。
6. **理解 MCP**：[架构][O45] → [服务端原语][O46] → [版本兼容][O47] → [OpenAI MCP 接入][O09] → [授权与安全][O48]。
7. **研究多智能体**：[Anthropic 研究系统][O27] → [编排与交接][O14] → [AutoGen][P27] → [MetaGPT][P29]。
8. **建立评估闭环**：[Agent evals][O28] → [τ-bench][P31] → [Ragas][P33] → [LongMemEval][P24]。
9. **拓展模型训练原理**：[InstructGPT][P03] → [Constitutional AI][P36] → [DeepSeek-R1][P37] → [Kimi K2][P39]。

## 官方资料目录

编号是本地阅读索引，不是厂商定义的文档编号。

| 编号 | 发布方 | 官方资料 | 对应内容 / 阅读边界 |
| --- | --- | --- | --- |
| O01 | OpenAI | [Building agents](https://developers.openai.com/tracks/building-agents) | 模型、工具、状态与编排的整体入口。 |
| O02 | Anthropic | [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | 工作流与 Agent 的区别、分解、并行和评审模式；2024 年架构文章，API 实现应配合当前文档。 |
| O03 | OpenAI | [Function calling](https://developers.openai.com/api/docs/guides/function-calling) | 工具定义、参数 Schema、调用与回传、工具选择和并行控制。 |
| O04 | OpenAI | [Structured model outputs](https://developers.openai.com/api/docs/guides/structured-outputs) | 结构化输出、Schema 约束和异常分支；区分 JSON 格式正确与业务结果正确。 |
| O05 | OpenAI | [Retrieval](https://developers.openai.com/api/docs/guides/retrieval) | 向量存储、检索、过滤、切片、排序与文件生命周期。 |
| O06 | OpenAI | [Vector embeddings](https://developers.openai.com/api/docs/guides/embeddings) | Embedding、相似度、维度与检索应用。 |
| O07 | OpenAI | [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state) | 历史传递、状态延续、上下文窗口与压缩。 |
| O08 | OpenAI | [Reasoning models](https://developers.openai.com/api/docs/guides/reasoning) | 推理能力、工具调用中的状态保留、推理预算；内部推理不等于应用可观察的计划。 |
| O09 | OpenAI | [MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) | MCP 工具发现与调用、认证、审批及数据边界。 |
| O10 | OpenAI | [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | 测试集、评分器、人工校准和持续评估；阅读方法论，具体平台生命周期另查当期文档。 |
| O11 | OpenAI | [Safety in building agents](https://developers.openai.com/api/docs/guides/agent-builder-safety) | 提示注入、结构化数据流、工具授权与安全控制。 |
| O12 | OpenAI | [Latency optimization](https://developers.openai.com/api/docs/guides/latency-optimization) | Token、请求数量、并行与端到端延迟优化。 |
| O13 | OpenAI | [Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents) | 执行循环、停止、对话延续、暂停与失败处理。 |
| O14 | OpenAI | [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration) | 交接与主管模式，明确专家职责和最终答复的所有者。 |
| O15 | OpenAI | [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) | SDK 接入 MCP、执行追踪与排错。 |
| O16 | OpenAI | [Agents SDK quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart) | 从单 Agent 到工具、状态、专家与追踪的实现路线。 |
| O17 | Anthropic | [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) | Token 容量、思考与工具结果对上下文的占用。 |
| O18 | Anthropic | [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works) | 客户端与服务端工具、执行循环、停止原因。 |
| O19 | Anthropic | [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) | 工具描述、输入结构与工具选择。 |
| O20 | Anthropic | [Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) | tool_use/tool_result 的对应关系与错误回传。 |
| O21 | Anthropic | [Parallel tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use) | 并行工具请求与结果处理。 |
| O22 | Anthropic | [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool) | 应用侧持久化、创建/读取/更新/删除和路径隔离。 |
| O23 | Anthropic | [Context editing](https://platform.claude.com/docs/en/build-with-claude/context-editing) | 清理历史工具结果，配合记忆管理长任务上下文。 |
| O24 | Anthropic | [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | 上下文选择、按需检索、压缩和外部笔记。 |
| O25 | Anthropic | [Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval) | 切片上下文、关键词与语义检索结合、重排序。 |
| O26 | Anthropic | [Writing effective tools for agents — with agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | 工具边界、描述、返回格式与工具评估。 |
| O27 | Anthropic | [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) | 并行研究、任务委派、汇总引用、协调成本与恢复。 |
| O28 | Anthropic | [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | 任务、轨迹、结果、评分器与重复运行的可靠性。 |
| O29 | Anthropic | [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | 进度文件、分阶段交付、跨会话恢复与验收。 |
| O30 | Anthropic | [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) | 程序化组合工具、按需加载与减少中间结果占用。 |
| O31 | Anthropic | [Subagents in the SDK](https://code.claude.com/docs/en/agent-sdk/subagents) | 子 Agent 配置、独立上下文、工具与任务委派。 |
| O32 | Anthropic | [Configure permissions](https://code.claude.com/docs/en/agent-sdk/permissions) | 工具权限、允许/拒绝策略与人工审批。 |
| O33 | DeepSeek | [Tool Calls](https://api-docs.deepseek.com/guides/tool_calls/) | 外部函数定义、调用结果回传与思考模式下的工具使用。 |
| O34 | DeepSeek | [Multi-round Conversation](https://api-docs.deepseek.com/guides/multi_round_chat/) | Chat Completions 的无状态请求与应用侧历史拼接。 |
| O35 | DeepSeek | [Context Caching](https://api-docs.deepseek.com/guides/kv_cache/) | 前缀复用与缓存命中；属于计算缓存，不是长期记忆。 |
| O36 | Kimi / Moonshot AI | [Use Kimi API for Tool Calls](https://platform.kimi.ai/docs/guide/use-kimi-api-to-complete-tool-calls) | 工具定义、执行、结果回传与流式调用。 |
| O37 | Kimi / Moonshot AI | [Thinking Models](https://platform.kimi.ai/docs/guide/use-thinking-models) | 思考模式、reasoning_content 与多轮工具调用。 |
| O38 | Kimi / Moonshot AI | [Set Parameters for Multi-turn Chat](https://platform.kimi.ai/docs/guide/engage-in-multi-turn-conversations-using-kimi-api) | 历史管理与对话上下文长度控制。 |
| O39 | Kimi / Moonshot AI | [Best Practices for context caching](https://platform.kimi.ai/docs/guide/context-caching) | 固定前缀、缓存命中和费用观测；不提供跨任务的语义记忆。 |
| O40 | Kimi / Moonshot AI | [Dynamically Loaded Tools](https://platform.kimi.ai/docs/guide/use-dynamic-tool-loading) | 按需加载工具定义与上下文开销控制。 |
| O41 | Kimi / Moonshot AI | [Configure ModelScope MCP Server in Playground](https://platform.kimi.ai/docs/guide/configure-the-modelscope-mcp-server) | 在 Playground 接入 MCP 的具体例子，不代替协议规范。 |
| O42 | Kimi / Moonshot AI | [Use Kimi API for File-Based Q&A](https://platform.kimi.ai/docs/guide/use-kimi-api-for-file-based-qa) | 文件上传、内容提取与文档问答；不应直接等同于向量 RAG。 |
| O43 | Kimi / Moonshot AI | [How to Fix Repeated Tool Calls](https://platform.kimi.ai/docs/guide/tool-call-repeat) | 检查消息布局、识别重复调用与限制循环。 |
| O44 | Kimi / Moonshot AI | [Best Practices for Benchmarking](https://platform.kimi.ai/docs/guide/benchmark-best-practice) | 可复现实验、样本与运行参数。 |
| O45 | MCP 官方 | [Architecture overview](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture) | Host/Client/Server、通信层、能力发现与协议版本。 |
| O46 | MCP 官方 | [Understanding MCP servers](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts) | Tools、Resources、Prompts 的职责与使用方式。 |
| O47 | MCP 官方 | [Versioning and Compatibility](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning) | 版本与能力发现；对照旧版初始化流程。 |
| O48 | MCP 官方 | [Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) | 认证与授权规范。 |
| O49 | MCP 官方 | [Security Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) | 授权边界、第三方服务与安全威胁。 |
| O50 | Meta / Faiss 官方 | [Faiss indexes](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes) | Flat、IVF、HNSW 与压缩索引的具体实现。 |
| O51 | Meta / Faiss 官方 | [Special operations on indexes](https://github.com/facebookresearch/faiss/wiki/Special-operations-on-indexes) | 删除、重建、ID 管理与索引操作限制。 |

## 论文目录

以下为原始论文入口，提供方法与评估依据。技术报告和研究原型不应直接被当作生产系统的性能承诺。

| 编号 | 论文 | 首次公开 | 作者 / 团队 | 类型 | 核心阅读内容 |
| --- | --- | --- | --- | --- | --- |
| P01 | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) | 2017 | Vaswani et al. | 基础经典 | Transformer、注意力与序列建模。 |
| P02 | [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) | 2020 | Brown et al. / OpenAI | 基础经典 | 自回归生成与上下文中的少样本学习。 |
| P03 | [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155) | 2022 | Ouyang et al. / OpenAI | 基础经典 | 指令微调和 RLHF，解释能力与指令遵循的差异。 |
| P04 | [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903) | 2022 | Wei et al. | 推理经典 | 用中间步骤改善推理；不等同于现代模型内部推理接口。 |
| P05 | [MRKL Systems: A modular, neuro-symbolic architecture that combines large language models, external knowledge sources and discrete reasoning](https://arxiv.org/abs/2205.00445) | 2022 | Karpas et al. / AI21 Labs | 架构代表作 | 模型与外部模块组合；是工具架构背景，不是 MCP 规范。 |
| P06 | [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) | 2022 | Yao et al. | Agent 经典 | 推理、行动与观察交替；阅读任务轨迹与实验。 |
| P07 | [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761) | 2023 | Schick et al. / Meta | 工具学习代表作 | 学习何时调用 API、生成参数并利用结果；不定义厂商 API 格式。 |
| P08 | [Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models](https://arxiv.org/abs/2305.04091) | 2023 | Wang et al. | 规划代表作 | 先规划再求解；不是通用 Plan-and-Execute 运行时的完整实现。 |
| P09 | [Tree of Thoughts: Deliberate Problem Solving with Large Language Models](https://arxiv.org/abs/2305.10601) | 2023 | Yao et al. | 推理代表作 | 候选思路搜索、评估与回溯。 |
| P10 | [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366) | 2023 | Shinn et al. | 反馈与记忆代表作 | 用反馈形成文字经验并用于后续尝试，不等同于更新模型权重。 |
| P11 | [Self-Refine: Iterative Refinement with Self-Feedback](https://arxiv.org/abs/2303.17651) | 2023 | Madaan et al. | 反馈代表作 | 生成、反馈、修订循环；自评不保证事实正确。 |
| P12 | [LLM+P: Empowering Large Language Models with Optimal Planning Proficiency](https://arxiv.org/abs/2304.11477) | 2023 | Liu et al. | 规划拓展 | 连接语言模型与经典规划器。 |
| P13 | [An LLM Compiler for Parallel Function Calling](https://arxiv.org/abs/2312.04511) | 2023 | Kim et al. | 并行执行代表作 | 任务依赖图与并行多工具执行。 |
| P14 | [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) | 2020 | Lewis et al. / Meta | RAG 经典 | 参数知识与外部检索结合；原论文包含训练机制，区别于只在推理时拼接上下文。 |
| P15 | [Dense Passage Retrieval for Open-Domain Question Answering](https://arxiv.org/abs/2004.04906) | 2020 | Karpukhin et al. / Meta | 检索经典 | 双编码器与稠密段落检索。 |
| P16 | [Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks](https://arxiv.org/abs/1908.10084) | 2019 | Reimers & Gurevych | Embedding 经典 | 句向量训练与相似度计算。 |
| P17 | [ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT](https://arxiv.org/abs/2004.12832) | 2020 | Khattab & Zaharia | 检索代表作 | Token 级后期交互，比较双编码器与更细粒度检索。 |
| P18 | [Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs](https://arxiv.org/abs/1603.09320) | 2016 | Malkov & Yashunin | 向量索引经典 | HNSW 图结构与近似搜索。 |
| P19 | [Billion-scale similarity search with GPUs](https://arxiv.org/abs/1702.08734) | 2017 | Johnson, Douze & Jégou / Meta | 向量索引经典 | 大规模相似度搜索、GPU 与 Faiss 背景。 |
| P20 | [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection](https://arxiv.org/abs/2310.11511) | 2023 | Asai et al. | RAG 代表作 | 检索决策与证据评价；原方法有训练环节，不只是自检提示词。 |
| P21 | [Precise Zero-Shot Dense Retrieval without Relevance Labels](https://arxiv.org/abs/2212.10496) | 2022 | Gao et al. | 检索代表作 | HyDE：生成假设文档后检索；假设文档不能当作事实证据。 |
| P22 | [Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442) | 2023 | Park et al. | 记忆经典 | 经验记录、反思、规划及按相关性/重要性/时间读取。 |
| P23 | [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) | 2023 | Packer et al. | 记忆代表作 | 分层记忆与上下文交换；有限上下文的系统化管理。 |
| P24 | [LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory](https://arxiv.org/abs/2410.10813) | 2024 | Wu et al. | 记忆评估代表作 | 信息提取、多会话与时间推理、知识更新和拒答。 |
| P25 | [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) | 2023 | Liu et al. | 长上下文代表作 | 证据位置与长上下文使用效果；长度不等于有效利用。 |
| P26 | [LongLLMLingua: Accelerating and Enhancing LLMs in Long Context Scenarios via Prompt Compression](https://arxiv.org/abs/2310.06839) | 2023 | Jiang et al. | 上下文压缩代表作 | 压缩上下文与信息保留。 |
| P27 | [AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155) | 2023 | Wu et al. / Microsoft Research | 多智能体代表作 | 可对话 Agent 与协作流程；具体框架 API 随版本变化。 |
| P28 | [CAMEL: Communicative Agents for “Mind” Exploration of Large Language Model Society](https://arxiv.org/abs/2303.17760) | 2023 | Li et al. | 多智能体代表作 | 角色设定与协作对话。 |
| P29 | [MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework](https://arxiv.org/abs/2308.00352) | 2023 | Hong et al. | 多智能体代表作 | 按角色、标准流程与中间产物组织协作。 |
| P30 | [AgentBench: Evaluating LLMs as Agents](https://arxiv.org/abs/2308.03688) | 2023 | Liu et al. | Agent 评估代表作 | 多环境 Agent 任务评估。 |
| P31 | [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045) | 2024 | Yao et al. | 工具评估代表作 | 用户、工具、规则与重复运行可靠性。 |
| P32 | [FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation](https://arxiv.org/abs/2305.14251) | 2023 | Min et al. | 事实评估代表作 | 将长回答拆成原子事实并检查证据支持。 |
| P33 | [Ragas: Automated Evaluation of Retrieval Augmented Generation](https://arxiv.org/abs/2309.15217) | 2023 | Es et al. | RAG 评估代表作 | 拆分检索与生成指标；模型评分需要校准。 |
| P34 | [InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated Large Language Model Agents](https://arxiv.org/abs/2403.02691) | 2024 | Zhan et al. | 安全评估代表作 | 工具读取的外部内容带来的间接提示注入。 |
| P35 | [Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection](https://arxiv.org/abs/2302.12173) | 2023 | Greshake et al. | 安全代表作 | 不可信内容被解释成指令的攻击机制。 |
| P36 | [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) | 2022 | Bai et al. / Anthropic | 对齐代表作 | 基于原则与 AI 反馈的训练；不代替应用侧权限隔离。 |
| P37 | [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948) | 2025 | DeepSeek-AI | 官方研究论文 | 强化学习、推理、自检和策略调整；不能由此推断所有 API 能力。 |
| P38 | [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437) | 2024 | DeepSeek-AI | 官方技术报告 | MoE、MLA、训练与推理基础设施，作为模型底层拓展。 |
| P39 | [Kimi K2: Open Agentic Intelligence](https://arxiv.org/abs/2507.20534) | 2025 | Kimi Team / Moonshot AI | 官方技术报告 | 工具使用与 Agent 能力的训练和评估；区别于应用编排实现。 |

<!-- 文内引用链接定义 -->

[O01]: https://developers.openai.com/tracks/building-agents
[O02]: https://www.anthropic.com/engineering/building-effective-agents
[O03]: https://developers.openai.com/api/docs/guides/function-calling
[O04]: https://developers.openai.com/api/docs/guides/structured-outputs
[O05]: https://developers.openai.com/api/docs/guides/retrieval
[O06]: https://developers.openai.com/api/docs/guides/embeddings
[O07]: https://developers.openai.com/api/docs/guides/conversation-state
[O08]: https://developers.openai.com/api/docs/guides/reasoning
[O09]: https://developers.openai.com/api/docs/guides/tools-connectors-mcp
[O10]: https://developers.openai.com/api/docs/guides/evaluation-best-practices
[O11]: https://developers.openai.com/api/docs/guides/agent-builder-safety
[O12]: https://developers.openai.com/api/docs/guides/latency-optimization
[O13]: https://developers.openai.com/api/docs/guides/agents/running-agents
[O14]: https://developers.openai.com/api/docs/guides/agents/orchestration
[O15]: https://developers.openai.com/api/docs/guides/agents/integrations-observability
[O16]: https://developers.openai.com/api/docs/guides/agents/quickstart
[O17]: https://platform.claude.com/docs/en/build-with-claude/context-windows
[O18]: https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works
[O19]: https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools
[O20]: https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
[O21]: https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use
[O22]: https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
[O23]: https://platform.claude.com/docs/en/build-with-claude/context-editing
[O24]: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
[O25]: https://www.anthropic.com/engineering/contextual-retrieval
[O26]: https://www.anthropic.com/engineering/writing-tools-for-agents
[O27]: https://www.anthropic.com/engineering/multi-agent-research-system
[O28]: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
[O29]: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
[O30]: https://www.anthropic.com/engineering/code-execution-with-mcp
[O31]: https://code.claude.com/docs/en/agent-sdk/subagents
[O32]: https://code.claude.com/docs/en/agent-sdk/permissions
[O33]: https://api-docs.deepseek.com/guides/tool_calls/
[O34]: https://api-docs.deepseek.com/guides/multi_round_chat/
[O35]: https://api-docs.deepseek.com/guides/kv_cache/
[O36]: https://platform.kimi.ai/docs/guide/use-kimi-api-to-complete-tool-calls
[O37]: https://platform.kimi.ai/docs/guide/use-thinking-models
[O38]: https://platform.kimi.ai/docs/guide/engage-in-multi-turn-conversations-using-kimi-api
[O39]: https://platform.kimi.ai/docs/guide/context-caching
[O40]: https://platform.kimi.ai/docs/guide/use-dynamic-tool-loading
[O41]: https://platform.kimi.ai/docs/guide/configure-the-modelscope-mcp-server
[O42]: https://platform.kimi.ai/docs/guide/use-kimi-api-for-file-based-qa
[O43]: https://platform.kimi.ai/docs/guide/tool-call-repeat
[O44]: https://platform.kimi.ai/docs/guide/benchmark-best-practice
[O45]: https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture
[O46]: https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts
[O47]: https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning
[O48]: https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
[O49]: https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices
[O50]: https://github.com/facebookresearch/faiss/wiki/Faiss-indexes
[O51]: https://github.com/facebookresearch/faiss/wiki/Special-operations-on-indexes
[P01]: https://arxiv.org/abs/1706.03762
[P02]: https://arxiv.org/abs/2005.14165
[P03]: https://arxiv.org/abs/2203.02155
[P04]: https://arxiv.org/abs/2201.11903
[P05]: https://arxiv.org/abs/2205.00445
[P06]: https://arxiv.org/abs/2210.03629
[P07]: https://arxiv.org/abs/2302.04761
[P08]: https://arxiv.org/abs/2305.04091
[P09]: https://arxiv.org/abs/2305.10601
[P10]: https://arxiv.org/abs/2303.11366
[P11]: https://arxiv.org/abs/2303.17651
[P12]: https://arxiv.org/abs/2304.11477
[P13]: https://arxiv.org/abs/2312.04511
[P14]: https://arxiv.org/abs/2005.11401
[P15]: https://arxiv.org/abs/2004.04906
[P16]: https://arxiv.org/abs/1908.10084
[P17]: https://arxiv.org/abs/2004.12832
[P18]: https://arxiv.org/abs/1603.09320
[P19]: https://arxiv.org/abs/1702.08734
[P20]: https://arxiv.org/abs/2310.11511
[P21]: https://arxiv.org/abs/2212.10496
[P22]: https://arxiv.org/abs/2304.03442
[P23]: https://arxiv.org/abs/2310.08560
[P24]: https://arxiv.org/abs/2410.10813
[P25]: https://arxiv.org/abs/2307.03172
[P26]: https://arxiv.org/abs/2310.06839
[P27]: https://arxiv.org/abs/2308.08155
[P28]: https://arxiv.org/abs/2303.17760
[P29]: https://arxiv.org/abs/2308.00352
[P30]: https://arxiv.org/abs/2308.03688
[P31]: https://arxiv.org/abs/2406.12045
[P32]: https://arxiv.org/abs/2305.14251
[P33]: https://arxiv.org/abs/2309.15217
[P34]: https://arxiv.org/abs/2403.02691
[P35]: https://arxiv.org/abs/2302.12173
[P36]: https://arxiv.org/abs/2212.08073
[P37]: https://arxiv.org/abs/2501.12948
[P38]: https://arxiv.org/abs/2412.19437
[P39]: https://arxiv.org/abs/2507.20534
