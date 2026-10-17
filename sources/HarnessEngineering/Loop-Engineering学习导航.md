---
title: Loop Engineering 学习导航：从 Agent 执行循环到可验证的持续改进
date: 2026-10-14
updated: 2026-10-14
type: learning-guide
review: unreviewed
verification: source_pages_checked_2026-10-14
tags:
  - Loop-Engineering
  - Harness-Engineering
  - AI-Agent
  - 长程任务
  - 评估
  - 持续改进
---

# Loop Engineering 学习导航

> 学习目标：能够设计一个会执行、会验证、会保存进度，并能在明确边界内继续推进任务的 Agent 系统。
>
> 本文为 AI 协助整理的学习导航。资料入口及主要内容已核对，未复现论文实验。学习阶段、练习和验收标准是本文的教学设计，不是厂商承诺的通用最佳方案。

## 一、先建立概念边界

Loop Engineering 可以理解为：设计驱动 Agent 反复执行任务的机制，明确每轮输入、行动、观测、验证、状态更新和停止条件。IBM 的入门文章介绍了这一实践；2026 年的专题论文将触发、持久化状态、验证器、预算和人工接管列为研究对象。[L01][L01]、[L21][L21]

这一术语仍在发展。学习时应同时检索 `agent loop`、`harness engineering`、`long-running agents`、`verification`、`evaluation`、`feedback` 和 `self-improving agents`，不要仅靠一个关键词筛选资料。

### 1.1 三种循环需要分开理解

| 循环 | 主要目标 | 一轮发生什么 | 完成标准 |
| --- | --- | --- | --- |
| 执行循环 | 完成当前任务 | 模型判断 → 请求工具 → 执行工具 → 返回观察 | 任务交付物满足要求 |
| 验证与修订循环 | 改善当前交付物 | 生成候选 → 检查 → 反馈 → 修订 | 满足验收条件，或达到预算上限 |
| 系统改进循环 | 改善以后处理任务的能力 | 修改提示、工具、记忆或运行机制 → 评估 → 保留或回退 | 在独立任务上产生可重复收益 |

这是本文用于组织学习的分类。执行循环参考 [L02][L02]、[L03][L03]；修订与反馈参考 [L15][L15]、[L16][L16]；系统级改进参考 [L19][L19]。

重复运行并不自动产生学习；一份回答被修订，也不表示模型权重发生变化。RSI 则进一步涉及系统改善自身改进能力的研究问题。学习 Loop Engineering 时，可以先做好任务执行与验证，再进入系统改进。[L16][L16]、[L19][L19]

### 1.2 与相邻概念的关系

| 概念 | 学习时关注的问题 | 与 Loop Engineering 的连接 |
| --- | --- | --- |
| Prompt Engineering | 单次调用的指令是否清晰 | 决定每轮模型收到什么任务 |
| Context Engineering | 哪些信息应该进入当前上下文 | 决定各轮之间保留、加载和压缩什么 |
| Harness Engineering | 工具、环境、状态、权限和观测如何支撑模型 | 提供循环实际运行的基础设施 |
| Workflow / Orchestration | 各步骤和角色怎样衔接 | 决定控制流、依赖和交接 |
| Evaluation | 结果是否有效，系统是否改善 | 提供继续、停止和保留改进的依据 |
| RSI | 系统能否持续改善自身的改进能力 | 属于进阶研究，不是普通循环的必备条件 |

上表是阅读导向，概念之间有重叠，不构成统一的行业分层标准。对照 [L04][L04]、[L07][L07]、[L09][L09]、[L19][L19] 阅读。

## 二、学习地图与前置知识

```text
目标与验收条件
    ↓
最小 Agent 执行循环
    ↓
验证器与结构化反馈
    ↓
持久化状态、上下文与恢复
    ↓
触发、权限、预算与可观测性
    ↓
基线比较、回归测试与受控改进
```

建议具备以下基础：

- 能阅读 Python 或 TypeScript 程序。
- 理解 API 请求、JSON、工具调用和错误处理。
- 会使用 Git、运行测试和查看日志。
- 知道上下文窗口、RAG 与外部存储分别解决什么问题。

缺少 Agent 基础时，先读本目录的 [LLM Agent 底层原理知识大纲](LLM-Agent底层原理知识大纲.md)，重点看任务规划、Function Calling、记忆和评估章节。

### 2.1 教材主线：Agentic Large Language Models

新增 [L22][L22]：《Agentic Large Language Models》。arXiv 标注为 472 页教材，首次提交于 2026-10-09。可通过 [在线全文](https://arxiv.org/html/2610.13455v1) 阅读目录和章节，或使用 [PDF](https://arxiv.org/pdf/2610.13455)。

建议将教材用于梳理概念，将官方工程资料用于落实接口、状态和运行约束。下面是本导航设计的章节映射，不是教材作者指定的课程顺序。

| 学习阶段 | 教材对应位置 | 阅读重点 |
| --- | --- | --- |
| 阶段一：执行循环 | 第 9 章；第 11 章 §11.2–11.3 | Agent 交互与工具架构 |
| 阶段二：验证与修订 | 第 6 章 §6.2.4；第 10 章 §10.3–10.4 | 自反思与实践评估 |
| 阶段三：恢复与记忆 | 第 9 章 §9.3；第 11 章 §11.5 | 记忆架构与错误恢复 |
| 阶段四：运行控制 | 第 11 章 §11.4–11.6 | MCP、恢复与安全 |
| 阶段五：协作分工 | 第 14 章 | 多智能体诊断案例 |
| 阶段六：持续改进 | 第 8 章；第 6 章 §6.2.4 | 元学习与提示改进 |
| 检索拓展 | 第 12 章 | RAG 与检索评估 |

教材涉及元学习的内外循环，但不能直接等同于应用运行循环或开放式 RSI；Hooks、调度、预算和追踪仍结合原有工程资料学习。

## 三、阶段一：理解最小执行循环

**目标**：能够解释一次用户请求中，模型和工具执行器如何反复交互。

**必读**：[L02][L02] → [L03][L03] → [L14][L14]。

**教材配读**：[L22][L22] 第 9、11 章。

| 材料 | 阅读重点 | 读完应能回答 |
| --- | --- | --- |
| OpenAI：Unrolling the Codex agent loop | 用户输入、模型调用、工具请求、结果回传与上下文 | 一次对话 turn 为什么可以包含多次模型调用？ |
| OpenAI：Running agents | 运行循环、状态延续、暂停与异常 | 模型结束输出、运行暂停和任务完成有什么区别？ |
| ReAct | 行动与观察如何影响后续决策 | 新观察怎样改变原有计划？ |

**练习**：用两个只读工具构建一个资料查询 Agent，记录每次请求、工具参数、返回结果和最终答案。开始时使用单 Agent，便于定位控制流。

**验收**：能够从日志重建执行顺序；能够识别工具错误；具有明确的轮数上限；不会因为模型说“完成”就忽略任务要求。

**注意**：ReAct 是方法论文，不定义今天各家 API 的消息格式；现代推理模型也不一定提供可见的完整推理过程。运行日志重点记录可观察的决策和行动。

## 四、阶段二：把目标转成可验证的完成条件

**目标**：让循环能够根据证据决定继续、修订、停止或请求人工判断。

**必读**：[L04][L04]、[L09][L09]、[L10][L10]；方法拓展读 [L15][L15]、[L16][L16]。

**教材配读**：[L22][L22] §6.2.4、§10.3–10.4。

建议在开始执行前写下四项内容：

1. **交付物**：最终应该产生什么文件、结果或状态变化。
2. **验收证据**：什么测试、数据或检查能证明交付有效。
3. **约束**：允许修改什么，哪些行为需要人工参与。
4. **退出方式**：成功、失败、暂停和预算耗尽各如何报告。

例如，“把项目做好”可以改写成一个练习任务：修复指定缺陷，保留已有行为，通过相关测试，并附上修改依据。测试能证明其中一部分要求，需求覆盖仍需单独检查。

### 4.1 选择合适的验证器

| 对象 | 可采用的验证方法 | 需要额外考虑的边界 |
| --- | --- | --- |
| 数据和结构 | Schema、类型、范围和约束检查 | 格式合法不保证数据真实 |
| 程序行为 | 单元、集成和端到端测试 | 测试集可能遗漏需求 |
| 研究报告 | 来源检查、主张与证据对应、人工抽查 | 有引用不保证引用支持结论 |
| 设计与写作 | 明确评分标准、模型辅助评审、人工校准 | 主观偏好和评分器偏差 |
| 外部操作 | 检查实际状态、回执与审计记录 | 请求成功不一定意味着业务完成 |

这是练习中选择验证器的建议，评估方法参考 [L09][L09]、[L10][L10]。

**练习**：构造三个故意失败的候选结果：格式错误、测试失败、遗漏要求。让验证器分别输出失败原因及可执行反馈。

**验收**：生成者无法直接修改验收规则；验证器能够识别预先准备的错误；评分结果与人工判断发生冲突时有处理方式。

**注意**：Self-Refine 研究自反馈修订，Reflexion 研究反馈与文字经验。另设评审 Agent 有助于组织工作，但不自动形成独立、正确的判断。[L15][L15]、[L16][L16]、[L09][L09]

## 五、阶段三：让长程任务能够恢复

**目标**：中断、上下文压缩或重启后，系统能继续工作，而不重复已经完成的动作。

**必读**：[L06][L06] → [L07][L07] → [L08][L08]；拓展读 [L17][L17]。

**教材配读**：[L22][L22] §9.3、§11.5。

需要区分：

- **对话历史**：模型与用户、工具之间发生过的交互。
- **任务状态**：当前进度、待办、失败、阻塞和验收结果。
- **长期记忆**：值得跨任务保留的事实或经验。
- **环境状态**：文件、仓库、数据库或外部服务的实际情况。

上下文摘要不能替代实际环境核对；记忆文件也不能替代任务状态机。Anthropic 的长任务文章讨论了用结构化产物交接进度的做法，上下文文章和记忆工具文档补充了信息保留与按需读取。[L06][L06]、[L07][L07]、[L08][L08]

### 5.1 建议的练习状态记录

```yaml
# 教学示例，不是任何厂商的标准 Schema。
task_id: example-001
status: running
objective: 修复一个已确认的缺陷
acceptance_checks:
  - related_tests_pass
completed_steps: []
pending_steps: []
last_checkpoint: null
artifact_version: null
last_verification: null
budget_used: {}
blocked_reason: null
next_action: null
```

状态记录至少要能回答：目标是什么、哪些步骤已经验证、实际产物在哪里、为什么阻塞、下一步是什么。

**练习**：在任务中途停止进程，重新启动后读取检查点，并核对文件与测试状态；另外模拟“工具已执行，但回执未保存”的情况。

**验收**：没有重复执行有副作用的动作；计划和实际产物一致；恢复时能识别不确定状态并请求核对。

**注意**：需要重复执行的操作，应在应用和下游服务中设计幂等或去重机制。仅靠提示词提醒“不要重复”不能提供可靠保证。

## 六、阶段四：设计触发、控制与可观测性

**目标**：循环何时启动、何时继续、何时停下，都有可解释的运行规则。

**必读**：[L01][L01]、[L11][L11]、[L12][L12]、[L13][L13]。

**教材配读**：[L22][L22] §11.4–11.6。

| 机制 | 学习重点 | 建议练习 |
| --- | --- | --- |
| 手动触发 | 固定输入与可重复运行 | 对同一测试任务重复运行 |
| 事件触发 | 去重、并发与任务归属 | 模拟重复收到同一事件 |
| 定时触发 | 上次任务未完成时如何处理 | 检查重叠运行与恢复策略 |
| Hooks | 事件前后的确定性检查 | 对修改范围做检查 |
| 预算控制 | 时间、调用次数与费用限制 | 故意制造无法收敛的任务 |
| 权限控制 | 工具访问范围与批准流程 | 验证越界请求被拦截 |
| 执行追踪 | 输入、行动、结果、产物和验证记录 | 从失败轨迹定位原因 |

Hooks、定时器和外层脚本是控制机制；是否产生有效反馈，取决于它们连接了什么检查与状态更新。预算上限属于运行限制，不能单独证明任务已完成。

建议为教学系统定义 `running`、`paused`、`succeeded`、`failed`、`budget_exhausted` 等状态，并使每次转换附带原因。名称可以自行调整，关键是将成功、失败和等待人工输入分开。

**练习**：模拟工具超时、重复触发、预算耗尽和等待批准四种情况，检查系统是否落到正确状态。

**验收**：可以停止运行；知道在哪里恢复；每次状态变化都能追溯；运行限制由程序执行，而不只写在提示词里。

## 七、阶段五：学习生成、评审与协调的分工

**目标**：当单 Agent 难以兼顾实现与验证时，能够引入清晰的角色边界。

**必读**：[L05][L05]、[L09][L09]；方法对照 [L15][L15]、[L16][L16]。

**教材配读**：[L22][L22] 第 14 章；诊断案例与本导航的生成、评审分工是不同应用。

Anthropic 的长程应用开发文章描述了 planner、generator、evaluator 三种角色，并强调把评审要求具体化。它提供了一个可研究的工程案例，不能直接推出所有任务都需要三个 Agent。[L05][L05]

建议逐步比较以下配置：

1. 单 Agent + 固定测试。
2. 单 Agent + 测试 + 明确的评审标准。
3. 生成 Agent + 评审 Agent + 固定测试。
4. 有明确需求时，再增加规划与协调角色。

**练习**：在同一批任务上比较上述配置，记录结果质量、费用、延迟和人工介入情况。

**验收**：能够说明新增角色解决了什么问题；能够识别重复劳动和交接丢失的信息；没有仅凭多角色意见一致就宣布成功。

## 八、阶段六：从完成任务走向持续改进

**目标**：验证一次运行机制的修改，是否让系统在后续任务中稳定变好。

**必读**：[L09][L09]、[L10][L10]、[L18][L18]；进阶读 [L19][L19]、[L20][L20]。

**教材配读**：[L22][L22] 第 8 章、§6.2.4，注意区分训练与运行时改进。

### 8.1 建立改进实验

```text
固定基线与任务集
    ↓
提出一个可解释的改动
    ↓
在开发任务上试验
    ↓
在独立留出任务上验证
    ↓
比较质量、成本、延迟和失败类型
    ↓
保留、回退，或继续收集证据
```

建议一次只改变一个主要因素，例如工具描述、上下文选择、失败反馈格式或检查点策略。保留原始轨迹与版本，避免无法解释收益来自哪里。

| 指标 | 用途 |
| --- | --- |
| 任务完成率 | 衡量验收条件满足情况 |
| 重复运行一致性 | 检查同一任务是否稳定成功 |
| 成本与延迟 | 判断收益是否值得额外资源 |
| 恢复成功率 | 衡量中断与失败后的表现 |
| 人工介入次数与原因 | 判断哪些环节仍需人类判断 |
| 回归失败 | 发现新改动损害的已有能力 |

评估设计参考 [L09][L09]、[L10][L10]；重复运行可靠性可结合 τ-bench 学习。[L18][L18]

### 8.2 进入自我改进研究前的边界

Darwin Gödel Machine 研究 Agent 修改自身代码，并用编码基准评估候选版本；AlphaEvolve 展示了以自动评价驱动程序搜索的工业研究案例。两者适合学习候选生成、评估、保留与搜索空间设计。[L19][L19]、[L20][L20]

阅读时重点追问：

- 被改进的是输出、工作流、Agent 代码，还是模型权重？
- 评价器能否被候选系统绕过或影响？
- 评估任务是否独立于改进过程？
- 收益能否迁移到新的任务？
- 是否保留失败候选、版本记录与回退路径？

**练习**：只允许修改工具描述或任务模板，在固定评估流程下比较候选版本。先验证受限改进，再讨论更开放的系统自修改。

**验收**：改进在留出任务上成立；结果可重复；没有通过修改测试、筛选结果或隐藏失败获得“进步”。

## 九、最短精读路线

如果只选六份材料，建议按以下顺序：

| 顺序 | 资料 | 解决的问题 |
| --- | --- | --- |
| 1 | [L02][L02]：Unrolling the Codex agent loop | Agent 怎样行动与观察 |
| 2 | [L04][L04]：Harness engineering | 环境怎样提供反馈和约束 |
| 3 | [L06][L06]：Effective harnesses for long-running agents | 长程任务怎样保持进度 |
| 4 | [L09][L09]：Demystifying evals for AI agents | 怎样判定结果有效 |
| 5 | [L05][L05]：Harness design for long-running application development | 规划、生成与评审怎样配合 |
| 6 | [L18][L18]：τ-bench | 怎样衡量多步执行的可靠性 |

术语入门先看 [L01][L01]；研究该术语的形成与实证问题再看 [L21][L21]。后者是较新的专题预印本，本次页面标注为 under review，不作为成熟方法已经被广泛验证的证据。

教材配套顺序建议：**第 9、11 章 → 第 6、10 章 → 第 14 章 → 第 8 章**；需要检索能力时补读第 12 章，基础薄弱时回读第 2–4 章。[L22][L22]

## 十、四周实践安排

以下安排以已有编程基础为前提，时间长短可根据项目复杂度调整。

| 周次 | 阅读范围与教材配读 | 实践产物 | 通过标准 |
| --- | --- | --- | --- |
| 第 1 周 | 阶段一、二；教材第 9、11、6 章 | 最小工具循环、任务说明、验证器 | 能识别预设失败并给出可执行反馈 |
| 第 2 周 | 阶段三；教材 §9.3、§11.5 | 持久化状态、检查点与恢复流程 | 中断后继续，不重复关键动作 |
| 第 3 周 | 阶段四、五；教材 §11.4–11.6、第 14 章 | 运行限制、追踪和必要的评审分工 | 能定位失败，并处理预算与暂停 |
| 第 4 周 | 阶段六；教材第 8、10 章 | 基线、留出集、版本比较报告 | 能证明收益并发现回归 |

建议贯穿使用同一个小项目，例如“修复指定缺陷并提交可审核的补丁”，或“整理带证据的主题研究报告”。项目应当有实际产物和可检查的要求。

## 十一、资料目录

链接采用编号，方便与阶段对应。官方工程复盘提供实践经验，API 文档确定接口语义，论文提供方法与实验；三者的证据用途不同。

| 编号 | 材料与原始链接 | 来源 / 类型 | 建议用途 |
| --- | --- | --- | --- |
| L01 | [What is loop engineering?](https://www.ibm.com/think/topics/loop-engineering) | IBM，官方概念文章，2026 | 建立术语与组件地图 |
| L02 | [Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/) | OpenAI，工程文章，2026 | 执行循环基础 |
| L03 | [Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents) | OpenAI，动态 SDK 文档 | 循环、状态、暂停与异常 |
| L04 | [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) | OpenAI，工程复盘，2026 | 环境设计与反馈 |
| L05 | [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) | Anthropic，工程文章，2026 | 规划、生成与评审分工 |
| L06 | [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Anthropic，工程文章，2025 | 跨会话任务交接 |
| L07 | [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Anthropic，工程文章，2025 | 上下文选择与压缩 |
| L08 | [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool) | Anthropic，动态 API 文档 | 应用侧记忆读写 |
| L09 | [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | Anthropic，工程文章，2026 | 任务、轨迹、评分与可靠性 |
| L10 | [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) | OpenAI，动态方法指南 | 数据集、评分器与持续评估 |
| L11 | [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) | OpenAI，动态 SDK 文档 | 工具接入和执行追踪 |
| L12 | [Hooks reference](https://code.claude.com/docs/en/hooks) | Anthropic，动态工具文档 | 事件触发的程序控制 |
| L13 | [Configure permissions](https://code.claude.com/docs/en/agent-sdk/permissions) | Anthropic，动态 SDK 文档 | 运行时权限与审批 |
| L14 | [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) | Yao 等，2022，方法论文 | 行动与观察循环 |
| L15 | [Self-Refine: Iterative Refinement with Self-Feedback](https://arxiv.org/abs/2303.17651) | Madaan 等，2023，方法论文 | 自反馈修订 |
| L16 | [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366) | Shinn 等，2023，方法论文 | 反馈、经验与后续尝试 |
| L17 | [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) | Packer 等，2023，系统论文 | 分层记忆与上下文管理 |
| L18 | [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045) | Yao 等，2024，评估论文 | 多步任务与重复运行可靠性 |
| L19 | [Darwin Godel Machine: Open-Ended Evolution of Self-Improving Agents](https://arxiv.org/abs/2505.22954) | Zhang 等，2025，研究论文 | Agent 代码改进与候选归档 |
| L20 | [AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) | Google DeepMind，官方研究介绍，2025 | 自动评价驱动程序搜索 |
| L21 | [Loop Engineering: Building Blocks, Adoption, and Impact](https://arxiv.org/abs/2608.21884) | Lulla 等，2026，专题预印本 | 术语、组成和实证研究边界 |

| L22 | [Agentic Large Language Models](https://arxiv.org/abs/2610.13455) | van Duijn、van der Meer、Plaat、van Stein，2026，教材 | 概念主线与案例；[在线全文](https://arxiv.org/html/2610.13455v1)、[PDF](https://arxiv.org/pdf/2610.13455) |

论文年份使用首次公开年份。动态文档中的参数、事件名和产品支持范围，以实际实现时打开的页面为准。L10 用于学习评估方法，不预设其关联托管平台长期可用。

## 十二、与本目录已有文档的衔接

- [LLM Agent 底层原理知识大纲](LLM-Agent底层原理知识大纲.md)：补齐规划、工具、RAG、记忆与多智能体基础。
- [AI 智能体的 Harness Engineering](research/harness-engineering-for-ai-agents.zh-CN.md)：深入理解运行环境、观测、权限和验证设施；其中时效性信息应回到原始来源复核。
- [面向自主智能体的AI循环工程：RSI、长程任务与持续行为](面向自主智能体的AI循环工程：RSI、长程任务与持续行为.md)：延伸到自动研究与递归自我改进；该文保留自身的资料检查日期与研究状态。

学习本导航时，建议每一阶段都保存三个产物：运行轨迹、失败案例和下一轮修改假设。最终应能用证据解释：系统为什么继续、为什么停止，以及一次改动究竟改善了什么。

[L01]: https://www.ibm.com/think/topics/loop-engineering
[L02]: https://openai.com/index/unrolling-the-codex-agent-loop/
[L03]: https://developers.openai.com/api/docs/guides/agents/running-agents
[L04]: https://openai.com/index/harness-engineering/
[L05]: https://www.anthropic.com/engineering/harness-design-long-running-apps
[L06]: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
[L07]: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
[L08]: https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
[L09]: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
[L10]: https://developers.openai.com/api/docs/guides/evaluation-best-practices
[L11]: https://developers.openai.com/api/docs/guides/agents/integrations-observability
[L12]: https://code.claude.com/docs/en/hooks
[L13]: https://code.claude.com/docs/en/agent-sdk/permissions
[L14]: https://arxiv.org/abs/2210.03629
[L15]: https://arxiv.org/abs/2303.17651
[L16]: https://arxiv.org/abs/2303.11366
[L17]: https://arxiv.org/abs/2310.08560
[L18]: https://arxiv.org/abs/2406.12045
[L19]: https://arxiv.org/abs/2505.22954
[L20]: https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/
[L21]: https://arxiv.org/abs/2608.21884
[L22]: https://arxiv.org/abs/2610.13455
