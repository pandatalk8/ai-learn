---
title: AI Agent 工程三周学习计划
created: 2026-10-15
duration: 21 天
study_budget: 每天约 2–3 小时，按 2.5 小时计共 52.5 小时
basis: AI-Agent-RAG-Harness-Loop-学习导航.md
level: 已有基础编程和 API 调用经验
---

# AI Agent 工程三周学习计划

用同一个“企业知识研究助手”贯穿 21 天，完成 **Agent 与 RAG → 系统集成与可靠运行 → 本地模型、优化与微调验证** 三个阶段。

本计划基于现有学习导航压缩编排，默认你能阅读 Python、处理 JSON 和调用 API，每天投入约 2–3 小时。目标是建立工程全貌、完成最小项目并学会验证；三周不以精通全部框架、训练方法和生产部署为目标。

阅读材料使用导航中已整理的公开 GitHub 文件或官方网页，无需访问私有知识库。具体 SDK 用法按实际安装版本核对；本计划不要求照搬资料中的历史模型名、命令或默认配置。

## 三周目标

| 周次 | 核心问题 | 周末应该拿出的成果 |
| --- | --- | --- |
| 第 1 周 | AI 如何使用工具，并根据企业资料回答？ | 可引用原文的单 Agent/RAG 助手、检索基线和框架选型记录 |
| 第 2 周 | 如何连接系统，并保证任务可检查、可恢复、能停止？ | MCP 知识服务、Harness/Loop、检查点与最小 A2A 协作演示 |
| 第 3 周 | 如何使用本地模型，并验证优化或微调是否值得？ | 本地推理报告、性能对照、微调数据与实验、最终交付 |

企业落地优先练习知识检索、系统集成、权限、可靠性和成本；复杂多 Agent、开放式自我改进、多卡推理与偏好训练放到三周之后。

## 贯穿项目与范围

**项目：企业知识研究助手。**

用户提出一个制度、产品或技术问题；助手搜索资料、读取证据、生成带引用的回答。资料不足时说明未知，发现冲突时列出差异。任务中断后能恢复，达到预算后正确停止。

### 第一版范围

- 使用 20–30 份 Markdown/文本资料，先避开复杂 PDF 与 OCR。
- 只提供搜索、读取及写出本地报告等有限能力，不接入真实付款、发信或生产数据修改。
- 用一个已有语言环境，主线采用 Python；已有其他技术栈时沿用熟悉的环境。
- LangChain、LlamaIndex 各做一次小型对照，再选一条主线；LangGraph 用于学习状态与恢复，不要求重写全部项目。
- 先用能正常接入的模型建立基线，第 3 周再替换成本地模型。没有本地推理资源时按降级方案完成。

### 评测数据

第 2 天建立 **30 题**：20 题开发集、10 题留出测试集。按来源文档或问题家族隔离，避免把同题改写分到两边。

题目应覆盖直接事实、术语/版本、跨文档综合、证据冲突、无答案与访问限制。每题保存答案要点、证据路径和允许的拒答方式。

第 3–20 天用开发集定位问题。第 21 天首次运行固定留出集；看过测试错误后再做的优化，不能继续用这批题声称“独立测试收益”。

## 每天如何分配时间

| 时间 | 工作 | 应留下的记录 |
| --- | --- | --- |
| 约 30 分钟 | 只读当天核心问题对应的章节 | 3 条理解、1 个未解问题 |
| 约 90 分钟 | 修改贯穿项目或执行对照实验 | 可运行版本、配置和结果 |
| 约 30 分钟 | 验收、记录失败、保存进度 | 当日结论、失败原因和下一步 |

可以让 AI 编写代码、测试与分析脚本。你负责说明需求、核对证据、理解关键机制并完成验收。安装或排障超过 30 分钟时收缩任务，避免一天耗在环境配置上。

## 第 1 周：Agent、RAG 与框架

**周目标：** 跑通“问题→检索→证据→回答”，能区分检索错误与生成错误。

| 天数 | 学习重点与阅读 | 动手任务 | 当日验收与产物 |
| --- | --- | --- | --- |
| Day 1 | Agent、工作流与工具边界；[什么是智能体][R01]、[执行循环][R04] | 画模型、工具执行器、状态和资料库的关系；写任务目标、输出格式和约束 | `task-spec.md` 与架构草图；能说清哪些由模型决定、哪些由程序执行 |
| Day 2 | 数据与证据；[RAG 介绍][R03] | 整理 20–30 份资料，保留标题、来源、版本；建立并隔离 30 题 | 语料清单、20 题开发集、10 题留出集；每题有证据或无答案标记 |
| Day 3 | 工具调用与观察反馈；[执行循环][R04] | 实现 `search_documents`、`read_document`；先固定顺序，再让模型选工具 | 至少复盘 3 条轨迹；有参数校验、工具错误和最大调用次数 |
| Day 4 | RAG 数据流；[RAG 介绍][R03] | 按标题/段落分块；实现关键词/BM25 检索与证据约束生成；保存无检索基线 | 任意回答能回到片段；无答案时不会强行编造引用 |
| Day 5 | 向量检索与评测；[检索评测][R05] | 增加一种 embedding 与精确向量检索；在开发集对比无检索、关键词/BM25、向量三条路径 | 对照表；分析术语匹配、近义表达和版本冲突等至少 3 个失败 |
| Day 6 | 框架职责；[LangChain][F01]、[LlamaIndex][F03] | 两个框架各复现一个最小例子：LangChain 接已有工具；LlamaIndex 接同一语料做检索 | 框架映射与选型记录；固定模型和数据，指出默认参数造成的差异 |
| Day 7 | 引用、上下文与第一周复盘；[上下文工程][R06] | 选定主线框架或保留朴素实现；修复一个明确错误；跑完整开发集 | V1 演示、开发集结果、失败清单；能够现场展示 1 题成功、1 题合理拒答 |

### 第 1 周检查点

- 能从问题追踪到工具请求、原文证据和最终答案。
- 能区分“没检索到”“检索到了但被丢弃”“证据进入上下文却被误用”。
- 能解释框架在项目中替你处理了什么，没有只根据演示回答选型。
- 留出集没有被用于调参。

**进度落后时：** 保留一条可靠检索基线；混合检索、reranker 和第二套框架的完整迁移转为选做。不要通过删除引用与评测来赶进度。

## 第 2 周：MCP、Harness、Loop 与 A2A

**周目标：** 从“能够运行”走向“能够检查、恢复和正确结束”。

| 天数 | 学习重点与阅读 | 动手任务 | 当日验收与产物 |
| --- | --- | --- | --- |
| Day 8 | MCP 的角色与工具；[MCP 规范][P01]、[Tools][P02] | 将已有搜索/读取能力封装成最小 MCP 服务，用一个兼容客户端调用 | 完成发现、调用、错误回传；本地工具与 MCP 工具的同输入结果一致 |
| Day 9 | 上下文、记忆与 Skills；[上下文工程][R06]、[文件式记忆][R07] | 分开维护任务状态、证据和长期记忆；写一个“带证据报告”Skill/任务包 | 上下文组成表与任务包；明确什么信息何时读取、更新或删除 |
| Day 10 | Harness 与任务契约；[Harness 概览][R08]、[长任务案例][R13] | 加入路径/资料访问范围、工具超时、结构化错误和预算；设计成功、失败、暂停出口 | 运行配置和失败日志；越界请求被执行层拒绝，达到预算能退出 |
| Day 11 | 检查点与恢复；[LangGraph 概览][F02]、[持久化][R10] | 用文件状态或持久化 checkpointer 保存进度；中断进程后重新恢复 | 不是只用内存 checkpointer；重启后核对实际产物，避免重复写出 |
| Day 12 | 验证与修订 Loop；[执行/验证模板][R02] | 写引用与覆盖检查；最多进行 2 次修订，每次指出具体缺口；无进展即停止 | 一次生成与有界修订对照；能解释每轮为什么继续、为什么退出 |
| Day 13 | A2A 与 MCP 的区别；[协议比较][P04]、[核心概念][P05]、[Task 生命周期][P06] | 为独立“引用核对服务”设计 Agent Card、输入输出和任务流程；有余力运行最小协议例子 | 必做：交互时序与消息/任务/产物样例；选做：真实 A2A 客户端/服务端调用 |
| Day 14 | 故障演练与第二周复盘；[持久化][R10] | 重复测试参数错误、超时、进程重启、证据缺失、越权和预算耗尽 | 故障矩阵、V2 演示；主 Agent 对远端/模拟产物进行验证后才合并 |

### 第 2 周检查点

- MCP 接入有实际调用记录，协议版本和依赖被记录。
- 任务状态与对话摘要分开；检查点在进程退出后仍存在。
- 执行器控制权限和预算，模型无法仅凭输出文本绕过。
- “请求已接收”“远端已完成”“主任务验收通过”是不同状态。
- 如果 Day 13 只完成模拟，就在报告中写“协议设计演练，未完成 A2A 互操作验证”。

**进度落后时：** 先保证 MCP、恢复和有界 Loop；A2A 完成设计及模拟即可，不为增加角色而牺牲单 Agent 的可靠性。

## 第 3 周：本地模型、推理优化与微调

**周目标：** 理解模型工程如何影响整个系统，并完成一个可解释的小实验。

| 天数 | 学习重点与阅读 | 动手任务 | 当日验收与产物 |
| --- | --- | --- | --- |
| Day 15 | 本地部署路线；按硬件选读 [Ollama][D01]、[llama.cpp][D02]、[vLLM][D03] 或 [MLX-LM][D04] | 选择一个资源允许、支持目标任务的模型与引擎；记录 revision、模板、精度和硬件 | 一个可重启的本地服务；若资源不足，交付配置与容量估算，执行降级路线 |
| Day 16 | 服务兼容与任务质量；[Transformers 生成][T01] | 用已有模型适配层切换后端；测试中文、引用、JSON、工具请求及拒答 | 本地/既有后端对照；区分“接口可调用”和“模型会正确用工具” |
| Day 17 | Prefill、Decode、KV Cache 与压测；[推理调优][D05] | 固定负载，测短/长输入与少量并发；记录首 token、总时间、吞吐与资源 | 基线压测表；说明数据是冷启动还是预热后、单请求还是聚合吞吐 |
| Day 18 | 一项性能优化；[前缀缓存][D06]、[推理调优][D05] | 只选一种当前引擎支持的改变：上下文精简、量化、缓存或并发配置；同时回归质量 | 前后对照与保留/回退决定；不宣称无实测的加速效果 |
| Day 19 | 微调决策与数据；[SFT][T02]、[LoRA][T03]、[数据格式][T07] | 选“输出规范/工具路由”等一个稳定目标；整理约 50–100 条人工核对的小实验样本，按来源/问题家族拆分 | 数据卡、训练/验证拆分、独立评测题和基础模型/提示词基线；这是管线练习数据量，不是效果保证 |
| Day 20 | SFT + LoRA/QLoRA；[量化训练][T04] 或 [MLX-LM 训练][T06] | 有资源时在小模型上执行短训练并重新加载 Adapter；无资源时完成训练配置、样本模板检查和离线评测设计 | 实跑路线：训练日志、Adapter 与开发集对照；设计路线：明确写“未训练，效果未验证” |
| Day 21 | 留出测试、演示与交付 | 冻结候选版本和配置，首次运行 10 题留出集；对比预先选定的基线；完成故障与回退演示 | 最终报告、结果表、架构图、演示及继续学习清单 |

### 第 3 周检查点

- 硬件、权重、chat template、引擎与配置可以追溯。
- 性能报告与质量报告同时存在，不用更短但漏项的答案制造加速。
- 知道 RAG 解决外部证据问题，微调侧重稳定任务行为，两者可以组合。
- 训练 loss 与端到端任务结果分开报告。
- 微调、Adapter 加载或目标引擎兼容性未验证时，明确列为未完成。

### 硬件与时间不足时的替代路线

| 条件 | 完成方式 | 不应声称的结果 |
| --- | --- | --- |
| 只有 CPU 或内存较小 | 用能运行的小模型完成加载和简单问答；保持既有后端完成 Agent/RAG | 已达到生产吞吐，或大模型部署成功 |
| Apple Silicon | 在受支持模型中选择 Ollama、llama.cpp 或 MLX-LM 一条路线 | 已验证 NVIDIA/CUDA 或多卡性能 |
| 无训练硬件 | 完成 Day 19 数据工作、Day 20 配置/模板检查；把实际训练列为后续任务 | 已完成 LoRA/QLoRA 微调或证明其收益 |
| 每天不足 2 小时 | 优先 Agent/RAG、MCP、恢复和评测；部署做最小验证，A2A/训练做设计演练 | 三周已掌握全部导航内容 |

首次训练不要同时调整数据、基座、量化和检索。可以验证“训练管线运行且 Adapter 可重新加载”，即使暂未观察到质量收益；结论如实写在报告里。

## 最终交付与验收

### 必交清单

1. **架构与职责图**：模型、检索、工具、协议、状态、验证器分别在哪里。
2. **任务契约与运行配置**：目标、限制、验收、依赖及版本。
3. **语料与评测清单**：来源、文档版本、开发/留出拆分和指标口径。
4. **演示项目**：带引用的知识助手、实际 MCP 调用和有限修订循环。
5. **恢复与失败矩阵**：至少覆盖工具错误、重启、证据不足、越权、无进展与预算耗尽。
6. **模型工程记录**：部署/压测/训练分别标记实测、模拟、设计或未完成。
7. **最终报告**：成功案例、失败案例、资源成本、优化结论和下一步。

### Day 21 演示顺序

- 一个需要检索证据的问题，并打开对应原文。
- 一个资料中没有答案的问题，展示拒答或澄清。
- 一个需要修订的报告，展示检查结果如何推动下一轮。
- 一次进程中断与恢复，并核对产物。
- 一次无进展或预算耗尽后的正确退出。
- 展示本地模型或微调实验，明确哪些已验证、哪些未运行。

### 最终结果表模板

| 配置 | 检索证据命中 | 任务验收通过 | 引用支持 | 恰当拒答 | 端到端耗时 | 调用/资源成本 |
| --- | --- | --- | --- | --- | --- | --- |
| 预先固定的基线 | 待测 | 待测 | 待测 | 待测 | 待测 | 待测 |
| 最终 Agent/RAG | 待测 | 待测 | 待测 | 待测 | 待测 | 待测 |
| 本地后端（若已运行） | 待测 | 待测 | 待测 | 待测 | 待测 | 待测 |
| 微调后端（若已运行） | 待测 | 待测 | 待测 | 待测 | 待测 | 待测 |

指标按适用题型分别计算，报告分母；不适用项写 N/A。10 题留出集只能给出初步信号，不能凭单次结果推广到企业真实任务。需要稳定结论时增加独立样本、重复运行和人工抽查。

## 三周后选择一个方向继续

| 方向 | 继续解决的问题 |
| --- | --- |
| 企业 RAG | PDF/OCR、混合检索、重排、权限、增量更新、删除和缓存失效 |
| Agent 运行时 | 状态机、长任务、幂等、任务队列、追踪和可靠性 |
| 协议与协作 | MCP 多服务治理、实际 A2A 互操作、认证与任务交接 |
| 本地推理 | 负载压测、量化、KV Cache、前缀缓存、调度和容量 |
| 微调 | 更多高质量数据、超参数对照、部署回归，再按需求学习 DPO/蒸馏 |

## 核心资料

以下链接沿用学习导航的公开资料。固定提交链接保留核对时版本；动态官方页面的内容可能更新。

- [Agent 概念（中文）][R01]、[执行循环（中文）][R04]
- [RAG 数据流][R03]、[检索评测][R05]
- [LangChain][F01]、[LangGraph][F02]、[LlamaIndex][F03]
- [MCP 规范][P01]、[MCP Tools][P02]
- [上下文工程][R06]、[文件式记忆][R07]、[Harness 概览][R08]
- [执行与验证模板][R02]、[持久化与恢复][R10]、[长任务案例][R13]
- [A2A 与 MCP][P04]、[A2A 概念][P05]、[Task 生命周期][P06]
- [Ollama][D01]、[llama.cpp][D02]、[vLLM][D03]、[MLX-LM][D04]
- [推理调优][D05]、[前缀缓存][D06]
- [Transformers][T01]、[SFT][T02]、[LoRA][T03]、[QLoRA/量化训练][T04]、[MLX-LM 训练][T06]、[训练数据格式][T07]

[D01]: https://docs.ollama.com/faq
[D02]: https://github.com/ggml-org/llama.cpp
[D03]: https://docs.vllm.ai/en/stable/
[D04]: https://github.com/ml-explore/mlx-lm
[D05]: https://docs.vllm.ai/en/stable/configuration/optimization/
[D06]: https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/
[F01]: https://docs.langchain.com/oss/python/langchain/overview
[F02]: https://docs.langchain.com/oss/python/langgraph/overview
[F03]: https://developers.llamaindex.ai/python/framework/
[P01]: https://modelcontextprotocol.io/specification/2026-07-28
[P02]: https://modelcontextprotocol.io/specification/2026-07-28/server/tools
[P04]: https://a2a-protocol.org/latest/topics/a2a-and-mcp/
[P05]: https://a2a-protocol.org/latest/topics/key-concepts/
[P06]: https://a2a-protocol.org/latest/topics/life-of-a-task/
[R01]: https://github.com/huggingface/agents-course/blob/3c469e773ec04e5f338b727ff20e3a6ea823ff81/units/zh-CN/unit1/what-are-agents.mdx
[R02]: https://github.com/anthropics/claude-quickstarts/blob/9ec32b91df50b0d4906cae64b13c6298055ff40d/autonomous-coding/prompts/coding_prompt.md
[R03]: https://github.com/run-llama/llama_index/blob/619d74664e8404612038bc15a1a40c686037277c/docs/src/content/docs/framework/understanding/rag/index.mdx
[R04]: https://github.com/huggingface/agents-course/blob/3c469e773ec04e5f338b727ff20e3a6ea823ff81/units/zh-CN/unit1/agent-steps-and-structure.mdx
[R05]: https://github.com/run-llama/llama_index/blob/619d74664e8404612038bc15a1a40c686037277c/docs/src/content/docs/framework/module_guides/evaluating/usage_pattern_retrieval.md
[R06]: https://github.com/mrbear1024/Articles/blob/09ec7a87b7ccf3cc9ffc25d56cbb5e52cf49bf5d/AI%E6%8A%80%E6%9C%AF/AI%E6%99%BA%E8%83%BD%E4%BD%93%E7%9A%84%E6%9C%89%E6%95%88%E4%B8%8A%E4%B8%8B%E6%96%87%E5%B7%A5%E7%A8%8B.md
[R07]: https://github.com/langchain-ai/docs/blob/d1f86e4cb91261778387119bf551ab4bd3ecde00/src/oss/deepagents/memory.mdx
[R08]: https://github.com/langchain-ai/docs/blob/d1f86e4cb91261778387119bf551ab4bd3ecde00/src/oss/deepagents/overview.mdx
[R10]: https://github.com/langchain-ai/docs/blob/d1f86e4cb91261778387119bf551ab4bd3ecde00/src/oss/langgraph/persistence.mdx
[R13]: https://github.com/anthropics/claude-quickstarts/blob/9ec32b91df50b0d4906cae64b13c6298055ff40d/autonomous-coding/README.md
[T01]: https://huggingface.co/docs/transformers/llm_tutorial
[T02]: https://huggingface.co/docs/trl/sft_trainer
[T03]: https://huggingface.co/docs/peft/developer_guides/lora
[T04]: https://huggingface.co/docs/peft/developer_guides/quantization
[T06]: https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md
[T07]: https://huggingface.co/docs/trl/dataset_formats
