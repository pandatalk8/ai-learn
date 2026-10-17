---
title: "Harness Engineering for Self-Improvement（面向自我改进的 Harness Engineering）"
original_title: "Harness Engineering for Self-Improvement"
author: Lilian Weng
source_url: https://lilianweng.github.io/posts/2026-07-04-harness/
source_platform: personal blog
published: 2026-07-04
captured: 2026-07-10
type: web-clip
lang: zh-CN
status: reviewed
capture_status: full-text-translation
translation_standard: sentence-aligned-literal
translation_notes: "Aligned to EN structure; free-translation hotspots revised 2026-07-10; image syntax restored to EN-style relative paths."
kb_role: formal-source
translation_of: sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
reading_time: "28 min"
tags: [language-model, agent, auto-research, self-improvement, prompting, harness-engineering, recursive-self-improvement]
wiki_source: wiki/sources/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
---

# Harness Engineering for Self-Improvement（面向自我改进的 Harness Engineering）

**递归自我改进（recursive self-improvement, RSI）** 这一概念可以追溯到 [I. J. Good（1965）](https://philpapers.org/rec/GOOSCT)；他将一台“超智能机器”定义为：一种能在所有智力活动上超越人类、并设计更好的机器来改进自身的系统。[Yudkowsky（2008）](https://www.lesswrong.com/posts/JBadX7rwdcRFzGuju/recursive-self-improvement) 用短语“recursive self-improvement”指一种特定的反馈回路：AI 使用其当前智能，去改进产生其智能的认知机器。

在现代 AI 中，这一反馈回路可能意味着模型直接重写自己的权重；或者更宽泛地说，模型改进*训练流水线*与*部署系统*，而这又使后继模型在具有经济价值的任务上获得更好表现。AI 研究开发的速度已被证明在前沿实验室中大幅加快（[Anthropic](https://www.anthropic.com/institute/recursive-self-improvement)；[OpenAI](https://openai.com/index/how-agents-are-transforming-work/)）。

我明确提到*“部署系统”*，因为原始模型与真实世界上下文之间的这一层，看起来与模型的原始智能同样重要（即预训练之后立刻做的评测）。Harness 是 AI 部署的重要组成部分，这一点由 Claude Code 与 Codex 等成功的编码 agent 产品所表明。**Harness** 是环绕基础模型的系统，它编排执行，并决定模型如何思考与规划、调用工具与行动、感知与管理上下文、存储产物，以及评估结果。

这一篇帖子将聚焦 harness engineering 相关研究，以及它如何贡献于 RSI。最近许多关于自动化研究、自我改进 Agent、进化式程序搜索的工作，都可以围绕这个问题来组织。其他关于模型自博弈、合成数据、测试时训练，以及更广义持续学习主题的工作，也符合 RSI 的愿景（例如 [Yuan et al. 2024](https://arxiv.org/abs/2401.10020)、[Chen et al. 2024](https://arxiv.org/abs/2401.01335)、[Zhao et al. 2025](https://arxiv.org/abs/2505.03335)、[Choi et al. 2026](https://openreview.net/forum?id=lTbBFAoPSA)），但它们不是本文重点。

## Harness 设计模式

与[早期 agent 框架](https://lilianweng.github.io/posts/2023-06-23-agent/)相比——“agent = LLM + memory + tools + planning + action”——harness engineering 还额外包含*工作流设计（例如 loop engineering）、评估、权限控制，以及持久状态管理*。它不再只是提示词模板，而更接近运行时与软件系统设计：模型如何观察、行动、记忆、检查自身，以及改进。

设计应当有意保持简单且通用，以便支持泛化，并很可能参考既有软件工程实践，以受益于预训练知识。操作系统与 harness 之间也有很强的类比。与 OS 类似，harness 应封装复杂逻辑，同时保持接口简单。与此同时，配置、工具接口与其他协议可能逐渐在全行业标准化。

### 模式 1：工作流自动化

定义一个模型可以在其中运行、测试和迭代的工作流，是自动化的关键设计。Karpathy 的 autoresearch 仓库（<https://github.com/karpathy/autoresearch>）就是一个清晰示例，说明这样的工作流可以如何构建。常见工作流遵循一个目标导向循环：计划、执行、观察/测试、改进，再次执行，*直到*目标达成。这个过程可能会主动向用户请求澄清任务规格或执行偏好。

![简化的 Codex Agent 循环：Agent 调用工具，工具响应会影响模型的下一次生成。（图片来源：OpenAI Codex Agent 文章）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-openai-agent-loop.png)

*简化的 Codex Agent 循环：Agent 调用工具，工具响应会影响模型的下一次生成。  
（图片来源：[OpenAI Codex Agent 文章](https://openai.com/index/unrolling-the-codex-agent-loop/)）*

这个工作流图也强调了：模型会分析自己的轨迹和失败案例，然后通过“Agent runtime”持续迭代，而不是依赖一个静态提示词模板。

### 模式 2：文件系统作为持久记忆

在长周期 Agent 系统中，一个反复出现的模式是：用简单方式控制丰富状态和产物。Harness 不应该把整个工作流和所有日志都塞进上下文；相反，它应该把持久状态保存在文件中。在长周期 Agent rollout 中，实验日志、代码 diff、论文摘要、错误 trace、过去 rollout 轨迹等产物，常常会增长到远远超过模型训练时上下文窗口的长度。

学习如何读取、写入和编辑文件系统（通常通过 `bash` 命令）是 LLM 的一项基础技能。因此，用文件这种简单形式管理持久记忆，会自然受益于核心模型能力的提升。

### 模式 3：子 Agent 与后台任务

Harness 可以启动多个子 Agent 并行执行，也可以监控后台任务。当主 Agent 需要搜索多个假设、并发运行实验，或委派隔离的子任务而不污染主上下文时，这非常有用。父 Agent 因而需要一个小型进程管理器：启动任务、检查日志、取消失败运行，并把结果合并回主 Agent 线程。

关键设计选择是让并行性变得显式且可检查。如果子 Agent 的输出只存在于临时聊天上下文中，它们很快就会过时并被隐藏起来。如果它们被存储为文件、日志和状态记录，模型就能在中断后恢复，并基于自己的执行历史进行推理。

### 案例研究：编码 Agent Harness

主流编码 Agent 的核心接口已经在 Claude Code、Codex、OpenCode 和 Cursor 风格 Agent 之间趋于稳定。它们通常使用类似下面的循环：

![Figure](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-coding-harness-loop.png)

在获得一组工具之后，编码 Agent 就能在给定仓库中开发和调试问题，类似人类开发者配备 IDE 后的工作方式。

（不是完整列表；仅用于演示。若感兴趣可阅读[此文](https://github.com/yasasbanukaofficial/claude-code)。）

| 分组 | 工具定义 |
| --- | --- |
| 文件系统 | - 文件发现：`glob`、`grep`、`ls` - 文件读取：`read`、`read_many` - 文件修改：`write`（写入一个全新文件）；`edit`（字符串精确匹配替换）；`multi_edit`；`apply_patch`（应用结构化 patch/diff） |
| Shell 执行 | 运行命令：`bash`、`PowerShell` |
| IO | `lsp`，以及 `git_status`、`git_diff`、`git_commit` 等 git 工具 |
| 外部上下文 | MCP 工具、Skills |
| Web 搜索 | `web_search`、`web_fetch`、浏览器工具 |
| Artifacts | 读取文档、图片；生成 HTML、图片 |
| 后台进程 | 例如：`CronCreate`、`CronDelete`、`CronList` |
| Agent 委派 | 例如：`spawn_agent`、`resume_agent`、`wait_agent`、`list_agents`、`close_agent`、`interrupt_agent` 等 |

### Harness 层与核心智能？

很难预测未来 RSI 会在多大程度上依赖 harness engineering，但 RSI 的近期实用路径不太可能从模型直接重写自己的权重开始。我对近期实用路径的预测是：

1. Harness engineering 会朝着元方法论（meta-methodology）的方向演进，也就是改进“获得更好答案的机器”，而不仅仅是改进答案本身。Harness 系统本身会成为优化对象，启发式规则会减少，更通用的机制会增加。
2. 成熟的 harness 又会支持面向模型自我改进循环的自动化研究；而更聪明的模型会防止 harness 过度工程化，并保持系统可持续。

最终，许多 harness 改进可能会被*内化*进核心模型行为中，但它与外部上下文和工具之间的接口仍然应当保留。我们已经在[提示词工程](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)中看到过这个模式的较弱版本：随着指令微调和模型推理能力提升，手工提示词技巧变得没那么核心，但*指定目标、约束、上下文和评估的需求并没有消失*。

## Harness 优化

Harness 系统中被优化对象的演进大致是：指令[提示词](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/) -> 结构化上下文 -> 工作流 -> harness 代码 -> 优化器代码。随着模型变得更智能、更强大，我们会走向更复杂的目标和更通用的方法。

### 上下文工程

随着 Agent 任务周期显著拉长，简单地把所有工具响应和模型生成都追加进上下文，很快就会失控。上下文管理是一层用于为 LLM 构造更结构化、更简洁上下文，并管理持久状态的机制。毫无疑问，长上下文研究会继续进步，但眼下长上下文智能与上下文工程有时会交织在一起。

**Agentic Context Engineering**（ACE；[Zhang et al. 2025](https://arxiv.org/abs/2510.04618)）把上下文看作一个不断演化的 playbook，而不是一段越来越长的提示词。它有三个组件，用来维护一个由 bullet points 组成的上下文 playbook；每个条目都有标识符和描述。

1. *生成器*：生成任务轨迹，并参考 bullet points。
2. *反思器*：从成功和失败轨迹中提炼洞见。
3. *策展器*：用增量、条目化的方式更新结构化上下文。

![Agentic Context Engineering（ACE）框架。（图片来源：Zhang et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-ace.png)

*Agentic Context Engineering（ACE）框架。（图片来源：[Zhang et al. 2025](https://arxiv.org/abs/2510.04618)）*

为了在迭代重写过程中避免上下文坍塌和简短偏差，ACE 的一个关键设计选择是：策展器不会重写完整的提示词 blob。相反，它输出一组结构化、条目化的。bullet，形式为（标识符，描述）；这些 bullet 会通过确定性逻辑被合并进结构化上下文日志。上下文条目会被周期性地精炼和去重。

ACE 从 rollout 中学习洞见，这帮助我们走向自管理记忆；但它的更新规则和整体工作流仍然是手工设计的。为了走向更自我改进的循环，**Meta Context Engineering**（MCE；[Ye et al. 2026](https://arxiv.org/abs/2601.21557)）把机制（如何管理上下文）与 artifact 内容（上下文里有什么）分离开来，在元优化层进行技能演化，在基础层进行上下文优化。

一个 MCE 技能 $s \in \mathcal{S}$ 定义一个上下文函数 $c_s=(\rho_s,F_s)$，并把输入 $x$ 映射到上下文 $c = F_s(x;\rho_s)$，其中：

- $\rho_s = \{\rho_1,\dots,\rho_m\}$ 是静态组件（提示词、知识库、代码库）。
- $F_s = \{F_1,\dots,F_k\}$ 是动态算子（搜索、选择、过滤、格式化）。

双层优化的目标是：在给定技能 $s$ 的情况下，在训练数据上找到最佳上下文 $c_s^*$；同时，外层循环寻找能在验证集上带来最佳表现的最优技能：

$$
\text{Inner: }c_s^*=\arg\max_{c_s}J_\text{train}(c_s;s)\quad
\text{Outer: }s^*=\arg\max_{s\in\mathcal{S}}J_\text{val}(c_s^*)
$$

技能数据库会追踪历史上的技能、上下文函数和评估指标 $\mathcal{H}_{k-1} = \{(s_i,c_i,J_i^\text{train}, J_i^\text{val})\}_{i=1}^{k-1}$。一个元层 Agent 会基于先前技能做 Agentic [交叉](https://en.wikipedia.org/wiki/Crossover_(evolutionary_algorithm))，为任务 $\tau$ 创建新技能：$s_k=\text{crossover}(\tau,\mathcal{H}_{k-1})$。

然后，一个基础层上下文工程师执行技能 $s_k$，并在当前技能指导下，从 rollout 反馈 $\mathcal{R}_k$ 中学习上下文函数：$c_k=\text{engineer}(\tau,s_k;c_{k-1}^*,\mathcal{R}_k)$。

![Meta Context Engineering（MCE）框架：元层技能演化搜索上下文管理机制，而基础层优化任务上下文。（图片来源：Ye et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-mce.png)

*Meta Context Engineering（MCE）框架：元层技能演化搜索上下文管理机制，而基础层优化任务上下文。（图片来源：[Ye et al. 2026](https://arxiv.org/abs/2601.21557)）*

MCE 不像 ACE 那样强制规定如何构造上下文的启发式规则。它使用*自由形式技能*来存储任务中最重要的知识，并让技能和受技能条件化的上下文一起迭代演化。在实现上，上下文函数 $c$ 被实例化为专用目录中的一组文件，包括静态组件（`skill.md`）和动态组件（上下文与数据 rollout）。元层和基础层优化都在 Agentic 编码环境中执行，并使用一组标准工具：

$$
\mathcal{T}=\{\texttt{Read},\texttt{Write},\texttt{Edit},\texttt{Bash},\texttt{Glob},\texttt{Grep},\texttt{TodoWrite}\}
$$

**Meta-Harness**（[Lee et al. 2026](https://arxiv.org/abs/2603.28052)）又向下推进了一层：被优化对象是决定并优化“哪些信息应被存储、检索并呈现给模型”的*代码*。它名字中的“Meta-”意味着它是一个用于优化 harness 的 harness。

![Meta-Harness 外层循环优化算法。（图片来源：Lee et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-meta-harness-outer-loop.png)

*Meta-Harness 外层循环优化算法。（图片来源：[Lee et al. 2026](https://arxiv.org/abs/2603.28052)）*

用于创建新 harness 的 proposer 本身就是一个编码 Agent，最终输出是一组位于 Pareto 前沿上的 harness 候选。

- 整个执行历史都可以通过文件系统访问，因此编码 Agent 会用 `grep` 或 `cat` 之类命令阅读历史，而不是把所有东西塞进单一提示词上下文。
- 被提出的 harness 是文件系统中的一个字典，里面包含自己的源代码、分数、rollout 轨迹和状态更新。
- Meta-harness 循环会迭代创建新 harness，并且只保留合格者。

![Meta-Harness 在（左）少量迭代文本分类任务和（右）TerminalBench-2 上的表现。注意，TerminalBench-2 实验中的搜索是从 Terminus-KIRA 和 Terminus-2 这两个非常强的 harness 初始化的。（图片来源：Lee et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-meta-harness.png)

*Meta-Harness 在（左）少量迭代文本分类任务和（右）TerminalBench-2 上的表现。注意，TerminalBench-2 实验中的搜索是从 Terminus-KIRA 和 Terminus-2 这两个非常强的 harness 初始化的。（图片来源：[Lee et al. 2026](https://arxiv.org/abs/2603.28052)）*

不过，重要经验已经很清楚：一旦 harness 设计变成可执行搜索空间，强大的编码 Agent 就能利用人类工程师所使用的同一设计空间。

### 工作流设计

Harness engineering 中的工作流设计可以由领域专家手工完成。以自动化研究为例，已经有多种框架被提出并测试。**AI Scientist** 系统（[Lu et al. 2026](https://www.nature.com/articles/s41586-026-10265-5)）构建了一条流水线，用于提出研究想法、写代码、运行实验、分析结果、撰写论文并执行同行评审。[Meng et al.（2026）](https://arxiv.org/abs/2605.26340)在 **ScientistOne** 中把可验证性作为核心设计约束：每一个 claim（引用、数值、方法、结论）都必须追溯到证据来源，并由 Chain-of-Evidence 检查进行审计。

![AI Scientist 用于想法生成、实验、论文写作和评审的流水线。（图片来源：Lu et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-ai-scientist.png)

*AI Scientist 用于想法生成、实验、论文写作和评审的流水线。（图片来源：[Lu et al. 2026](https://www.nature.com/articles/s41586-026-10265-5)）*

**Autodata** Agent（[Kulikov et al. 2026](https://arxiv.org/abs/2606.25996)）被设计为一个数据科学家，用于生成训练和评估数据。主 Agent 管理一个*挑战者*、一个*弱求解器*、一个*强求解器*和一个*验证器/裁判*。它的目标是合成“恰到好处”难度的数据，也就是强求解器能成功、弱求解器会失败。

在 Autodata 中，挑战者提示词会根据来自求解器和验证器的反馈迭代更新。这里的局限是：合成任务被用于微调弱求解器，而不是强求解器；如果这个循环不能迭代改进强模型，它就更像是在生成的提示词分布上做间接蒸馏，RSI 的味道会更少。

![Autodata 围绕挑战者、求解器和验证器角色生成合成训练与评估数据的 Agentic 工作流设计。（图片来源：Kulikov et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-autodata.png)

*Autodata 围绕挑战者、求解器和验证器角色生成合成训练与评估数据的 Agentic 工作流设计。（图片来源：[Kulikov et al. 2026](https://arxiv.org/abs/2606.25996)）*

工作流设计空间是*巨大的*。因此，我们自然可以把工作流设计看作一个搜索问题，也就应该能通过算法找到好的解，而不只是靠人工手工设计。沿着这个方向，**Automated Design of Agentic Systems**（ADAS；[Hu et al. 2025](https://arxiv.org/abs/2408.08435)）把 Agent 设计本身表述为一个优化问题，即“元 Agent 搜索”：由一个元 Agent 提出新的 Agentic 工作流设计。

1. 用 CoT 和 self-refine 这样的简单 Agent 初始化一个 Agentic 工作流 archive。
2. 要求一个元 Agent 受到 archive 中已有解的启发，以*代码*形式编写新 Agent。
   - 元 Agent 先生成新工作流的高层描述，然后用代码实现它。
   - 草稿程序随后会经过两轮由元 Agent 执行的 self-refine 步骤（即要求模型给出反馈，然后要求同一个模型基于反馈改进先前输出；[Madaan et al. 2023](https://arxiv.org/abs/2303.17651)），以检查其新颖性。
3. 评估每个新候选，并把成功者加入 archive。
4. 重复步骤 2-3，直到达到最大迭代次数。

![Automated Design of Agentic Systems（ADAS）示意图。（图片来源：Hu et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-adas.png)

*Automated Design of Agentic Systems（ADAS）示意图。  
（图片来源：[Hu et al. 2025](https://arxiv.org/abs/2408.08435)）*

**AFlow**（[Zhang et al. 2025](https://arxiv.org/abs/2410.10762)）把 Agentic 工作流表示为一张图，其中节点代表调用 LLM 的动作，边则用代码实现逻辑操作。工作流优化依赖 [MCTS](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search)（Monte Carlo Tree Search，蒙特卡洛树搜索）：

1. 用一个模板在树中初始化起始工作流 $W_0$。
2. 用分数和均匀探索的软混合策略选择一个工作流节点。
3. 要求 LLM 基于其评估表现生成一个修改后的工作流，从而扩展该节点。
4. 执行并评估新工作流。
5. 如果新工作流在 $N$ 轮预算内表现出改进，则把它加入树中。
6. 重复步骤 2-5，并在 top-$k$ 平均分进入平台期或预算耗尽时停止。

![AFlow 在工作流候选树上的优化过程。（图片来源：Zhang et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-aflow.png)

*AFlow 在工作流候选树上的优化过程。（图片来源：[Zhang et al. 2025](https://arxiv.org/abs/2410.10762)）*

AFlow 在问答、代码和数学任务中的实验显示，相比手工设计工作流和 ADAS，AFlow 有不错的提升。

![AFlow 与手工方法和 ADAS 的实验对比。（图片来源：Zhang et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-aflow-exp.png)

*AFlow 与手工方法和 ADAS 的实验对比。（图片来源：[Zhang et al. 2025](https://arxiv.org/abs/2410.10762)）*

### 自我改进的 Harness

无论是上下文工程还是工作流设计，都只是 harness 的一部分。我们需要搜索整个设计空间，并共同优化上下文管理逻辑、工作流、权限和许多其他 harness 组件。正如我们在 Meta-Harness、ADAS 和 AFlow 等工作中看到的那样，**✨代码✨**是定义程序与系统的**通用语言**。简单来说，harness 就是代码，它规定提示词、工具调用、子 Agent、控制流、记忆和工作流逻辑如何协同工作。如果 LLM 能优化执行 Agent 的代码，它就能访问一个比手写提示词大得多的设计空间。

**Self-Taught Optimizer**（STOP；[Zelikman et al. 2023](https://arxiv.org/abs/2310.02304)）是递归式 scaffolding 改进的早期例子之一。在 $t=0$ 时刻，一个种子改进器 $I_0$ 接收初始解 $s$、效用函数 $u$ 和黑盒语言模型 $M$，并返回一个改进后的解 $s’$，也就是 $s’ = I(u, s; M)$。STOP 的目标不是直接改进 $s$，而是*改进改进器 $I$ 本身*。

首先，我们把元效用定义为：给定改进器函数 $I$ 在一组下游任务 $\mathcal{D}$ 上的平均效用：

$$
\hat{u}(I) \triangleq \frac{1}{\vert\mathcal{D}\vert}\mathbb{E}_{(u,s)\sim \mathcal{D}}[u(I(u,s; M))]
$$

因为改进改进器函数本身也是一个优化问题，所以我们可以基于 $I_{t-1}$ 的表现（由元效用衡量），通过自我改进更新递归得到新版本 $I_t$：

$$
I_t=I_{t-1}(\hat{u},I_{t-1};M)
$$

![Self-Taught Optimizer（STOP）算法。（图片来源：Zelikman et al. 2023）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-STOP-algo.png)

*Self-Taught Optimizer（STOP）算法。（图片来源：[Zelikman et al. 2023](https://arxiv.org/abs/2310.02304)）*

在 Zelikman et al.（2023）的实验中，改进后的改进器发现了多种策略，例如遗传算法、分解并改进局部、多臂提示词老虎机、模拟退火、改变温度，以及 beam/tree search。这类似于把 harness 工作流表示为一个可优化对象。

![STOP 发现的自我改进策略示例。（图片来源：Zelikman et al. 2023）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-STOP-patterns.png)

*STOP 发现的自我改进策略示例。（图片来源：[Zelikman et al. 2023](https://arxiv.org/abs/2310.02304)）*

他们的发现中有一个*警示性*结果：STOP 在使用 GPT-4 时，跨迭代提升了下游平均表现；但在 GPT-3.5 和 Mixtral 等较弱模型上，表现反而下降。递归结构本身并不够。基础模型必须*足够有能力*，才能改进机制。这说明 harness 改进可以让模型部署得更好，但智能仍然是核心。

更新的一项工作 **Self-Harness**（[Zhang et al. 2026](https://arxiv.org/abs/2606.09498)）依赖 LLM Agent 通过“提出-评估-接受”循环改进自己的 harness。

![Self-Harness 使用弱点挖掘、有边界的 harness 提案和验证组成的循环来更新 harness。（图片来源：Zhang et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-self-harness.png)

*Self-Harness 使用弱点挖掘、有边界的 harness 提案和验证组成的循环来更新 harness。（图片来源：[Zhang et al. 2026](https://arxiv.org/abs/2606.09498)）*

Self-Harness 的循环包含三个阶段：

1. *弱点挖掘*：把失败聚类为由验证器支撑的失败模式。
   - 当前 harness $h_t$ 被用于在任务上评估，并收集执行 trace 供分析。
   - 注意，两个运行在错误日志表面上可能共享相同的验证器结果，比如超时或缺失 artifact，但它们的因果机制可能不同。因此，我们需要包含丰富信息的失败记录，包括终端验证器层面的原因、相关 Agent 行为的因果状态，以及 trace 暴露出的抽象 Agent 机制，从而揭示根因。
2. *Harness 提案*：基于挖掘出的失败模式，提出有边界的 harness 编辑。
   - 同一个模型在 $h_t$ 下作为 proposer 被调用。
   - 模型会获得一个有边界的提案上下文：（1）当前 harness 的可编辑表面，（2）评估系统中由验证器支撑的失败模式，（3）应当保留的通过行为记录，以及（4）先前尝试过的编辑摘要。
   - Harness 编辑应该优先处理反复出现、可处理的错误模式（例如不是任务本身太难），并且应该能通过狭窄修改解决。
   - Harness 编辑候选应该彼此不同且多样。
3. *提案验证*：验证并合并合格编辑，以创建新 harness $h_{t+1}$。
   - 候选编辑会在 held-in $D_\text{in}$（用于测试弱点是否被解决）和 held-out $D_\text{out}$（用于检查是否引入其他未知问题）划分上通过回归测试评估。
   - 只有在 held-in 和 held-out 数据上都没有回归的候选才会被接受。
   - 被接受的候选会被合并，用于把 harness 更新到 $h_{t+1}$；被拒绝的候选会被记录，但不会改变 active harness。

在 Terminal-Bench-2 上运行 `MiniMax M2.5`、`Qwen3.5-35B-A3B` 和 `GLM-5` 时，Self-Harness 被证明能够学习针对不同基础模型弱点的模型特定 harness 指令，并提升 held-out pass rate。

Self-Harness 这类工作确实让我担心：如果一个程序被允许编辑操作系统，抽象边界就会被打破。可编辑表面需要被妥善设计，权限控制和安全层需要位于这个循环之外。围绕[奖励黑客](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)的所有挑战仍然存在。

### 进化式搜索

进化式搜索是一种受自然选择启发的优化方法（参见我以前关于[进化算法](https://lilianweng.github.io/posts/2019-09-05-evolution-strategies/)的文章）。它通过对一组解进行变异，并只保留群体中“适应度”高的解，来演化一个解的种群。当（1）搜索空间非常大或形状奇特；并且（2）很难直接用梯度优化，但评估解却很容易时，进化式搜索会很有用。Harness 搜索看起来很适合这种方法。

过去研究中，进化式搜索已经被用于提示词工程。**Promptbreeder**（[Fernando et al. 2023](https://arxiv.org/abs/2309.16797)）通过一组丰富的变异操作优化任务特定提示词；有趣的是，变异提示词（即指示 LLM 变异任务提示词的指令）本身也会通过进化被改进。**GEPA**（[Agrawal et al. 2025](https://arxiv.org/abs/2507.19457)）把基于[反思](https://lilianweng.github.io/posts/2023-06-23-agent/#self-reflection)的提示词方法与进化式搜索结合起来，并使用对试错轨迹的自然语言反思来提出提示词更新。

[Novikov et al.（2025）](https://arxiv.org/abs/2506.13131)提出了 **AlphaEvolve**，这是一个编码 Agent 进化式搜索系统。它保存一个候选程序池，并提示被冻结的 LLM 生成用于改进的 diff。随着系统反复评估子程序并保留成功者，它会随着时间发现更好的解。

![AlphaEvolve 的工作方式。（图片来源：Novikov et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-alphaevolve.png)

*AlphaEvolve 的工作方式。（图片来源：[Novikov et al. 2025](https://arxiv.org/abs/2506.13131)）*

AlphaEvolve 设计中有几个细节很重要：

- 提示词包含父程序、结果、指令，有时还包含元信息。
- 编码 Agent 可以访问完整仓库，但用于改进的代码区域会用 `# EVOLVE-BLOCK-START` 和 `# EVOLVE-BLOCK-END` 明确标记。
- 元提示词会按照 LLM 的建议，与指令和上下文共同演化，类似于我们演化解程序的方式。

消融实验展示了进化流程、提示词中的上下文、元提示词、全文件演化以及使用更强 LLM 的价值。

![消融实验展示了 AlphaEvolve 中多个设计的价值。（图片来源：Novikov et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-alphaevolve-plot.png)

*消融实验展示了 AlphaEvolve 中多个设计的价值。（图片来源：[Novikov et al. 2025](https://arxiv.org/abs/2506.13131)）*

最近的变体，例如 **ThetaEvolve**（[Wang et al. 2025](https://arxiv.org/abs/2511.23473)），把进化式搜索与 RL 和上下文学习结合起来。另一方面，**ShinkaEvolve**（[Lange et al. 2025](https://arxiv.org/abs/2509.19349)）引入了三个新组件，用于提高 LLM 采样效率：

- 通过设计父代采样，在性能排名和后代数量之间取得平衡，从而实现更高采样效率的探索。
- 基于 embedding 余弦相似度，丢弃与现有种群过于相似的候选，从而进行代码新颖性拒绝采样。
- 在元 scratchpad 中识别成功解里的好模式，以指导未来变异。

不同于上述聚焦于解改进的方法，**Darwin Gödel Machine**（DGM；[Zhang et al. 2025](https://arxiv.org/abs/2505.22954)）明确以一个可编辑的 harness-code 仓库的演化为目标，并使用基于 LLM 的编码 Agent。准确地说，这个 Agent 被允许修改自己的 harness。后续关于 Hyperagents 的工作（[Zhang et al. 2026](https://arxiv.org/abs/2603.19461)）引入了一个元 Agent，用于控制如何修改已有任务 Agent 来创建新 Agent。

1. 从池中的一个编码 Agent 开始。
2. 在每轮迭代中，根据性能成比例、并与子代数量成反比的概率选择一个父代，对其进行修改并分叉，产生新 Agent。
3. 被选中的父代 Agent 检查自己的 benchmark 评估日志，然后提出对自身 harness 代码库的改进，生成一个新版本的编码 Agent。代码编辑通过两个基本工具实现：（1）bash（参数：`<bash_command>`）和（2）editor（参数：`view/create/edit <file_path>`）。
4. 新编码 Agent 会被评估，只有性能足够高者会被加入池中。
5. 重复步骤 2-4，直到达到某些停止条件。

DGM 是固定模型下的 harness 演化。在以 `Claude 3.5 Sonnet` 作为基础 LLM、初始 harness 配置较简单的实验中，DGM 发现的 Agent 在 SWE-bench Verified（20% 到 50%）和 Polyglot（14.2% 到 30.7%）上可与手工 Agent 相当，甚至超过它们。

当候选解可以自动评估、并且候选适应度容易量化时，这类方法很有效，例如矩阵乘法、GPU kernel 优化、算法竞赛、数据中心调度。它在评估缓慢、模糊或主要依赖启发式的领域会遇到困难。进化的计算效率和有效性也令人担忧。

### 与模型权重的联合优化

Harness 演化改变的是模型周围的非参数系统。为了实现完整自我改进，完全可以允许模型同时更新自己的权重。权重更新可以通过改进模型训练流水线，或通过测试时持续学习来实现。持续学习这个主题本身值得未来单独写一篇文章。

**SIA**（[Hebbar et al. 2026](https://arxiv.org/abs/2605.27276)）是把 harness 改进和模型参数更新结合到同一个优化循环中的早期尝试。其设计包含三个组件：

- *Meta-Agent*：提出初始 harness。
- *Task-Specific Agent*：执行任务。
- *Feedback-Agent*：基于近期轨迹选择更新 harness 还是模型权重。

![SIA 中的 Feedback-Agent 决定下一次迭代类型。（图片来源：Hebbar et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-SIA.png)

*SIA 中的 Feedback-Agent 决定下一次迭代类型。（图片来源：[Hebbar et al. 2026](https://arxiv.org/abs/2605.27276)）*

SIA 的实验中有一些混杂选择，使结果较难解释。例如，任务特定 Agent 远弱于 Meta-Agent 和 Feedback-Agent 所用模型（`gpt-oss-120b` vs `Claude Sonnet 4.6`），而且 baseline 太弱，无法与相关方法清晰交叉参照。我会认为这个方向很有趣，但证据仍是暂时性的。与此同时，训练稳定性和 Goodhart 效应等许多挑战仍然开放。

## 未来挑战

AI Scientist 这一类工作有力地展示：由专家设计的 harness 可以协调 auto-research 循环的很大一部分，并以撰写研究论文的形式进行实验。但论文生产并不等同于科学发现。一个系统可以写出看似合理的论文，同时仍然存在伪造引用、实现漂移或实验结果薄弱的问题。

[Trehan & Chopra（2026）](https://arxiv.org/abs/2601.03315)测试了 LLM 是否能在最少 scaffolding 和基础工具（即 `read_file`、`write_file`、`llm_search`、`list_files`）支持下，从一个研究想法走到一篇论文。每个想法都有一个专用工作区，Agent 可以在其中生成和读取文档，并将其作为上下文的一部分。他们在三个领域进行了实验（世界模型、多 Agent RL、AI 安全与对齐），每个领域包含 45-50 篇高质量种子文档，用于启发新想法。只有四个想法被人类专家选中进入完整流水线，只有一个被完整执行成论文。他们在实验中观察到六种反复出现的失败模式：

- *偏向训练数据默认值*：使用旧库、过时命令、标准格式，或采用没有扎根于实际仓库或数据集的假设。
- *执行压力下的实现漂移*：当实现变得技术上复杂时，模型可能转向常见的更简单解，而不是所提出的方法。
- *记忆和上下文退化*：长周期项目会丢失关键细节，除非日志被写成持久 artifact。
- *过度乐观*：尽管实验有噪声或失败，模型仍宣称成功；[Bubeck et al.（2025）](https://arxiv.org/abs/2511.16072)也观察到类似的“p-hacking and eureka-ing”模式，即模型可以引入“数值胶带”，并在信号仍然是噪声时宣布胜利。
- *领域智能不足*：模型缺乏隐性技艺知识，例如预测实现复杂度、判断实验结果是否可信，或知道哪些 baseline 重要。
- *科学品味薄弱*：实验也许可以执行，但未能回答正确的问题。

在通向完整 RSI 的道路上，研究者已经取得了真实进展，但仍有几个瓶颈。

**1. 弱而模糊的评估器。** 许多研究 claim 没有快速而精确的验证器，许多真实世界任务也是如此。当前自我改进循环最适合那些评估指标可测量、客观的任务，类似于 [RL 的工作方式](https://lilianweng.github.io/posts/2018-02-19-rl-overview/)。

研究品味、新颖性和长期科学价值要难衡量得多。例如，研究品味往往混合了问题构造、实验设计，以及对哪些意外结果值得追求、哪些失败案例值得重试的判断。

**2. 上下文和记忆生命周期。** 随着 AI Agent 变得更自主、更独立，记忆会不断增长。一个有用的 harness 需要管理上下文和记忆，以弥补现有长上下文生成的限制，同时最大化长周期任务的成功率。既然人类能够在一生中维持记忆，我在这里看到一种类比：[上下文工程](#上下文工程)会、也应该成为智能的核心部分，而不只是停留在软件系统层。

**3. 负结果。** 研究者受到激励去发表成功结果，因此文献会偏向成功案例。LLM 基于海量数据训练（至少目前主要由人类创造，lol），可能不擅长判断何时应放弃一个假设、报告负结果，甚至承认失败，因为数据中成功案例和失败案例不平衡。研究 harness 应该让失败尝试易于保存，因为从失败中学习是缩小任务搜索空间的最佳方式。

**4. 多样性坍塌。** 进化式和 RL 循环往往会利用已知高奖励模式。我们需要[机制](https://lilianweng.github.io/posts/2020-06-07-exploration-drl/)来防止种群坍塌成同一种解的变体。这对开放式研究尤其关键，因为最佳路径在当前评估器下最初可能看起来更差。

**5. [奖励黑客](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)。** 自我改进循环会优化它获得的任何信号。如果奖励来自单元测试，Agent 可能过拟合测试；如果奖励来自 judge model，它可能学会针对这个 judge 的奖励黑客技巧；如果奖励来自 benchmark 分数，它可能利用 benchmark artifacts。

评估器和权限控制很可能应该位于演化 harness 的循环之外，并在重要决策点配合 held-out tests、trace audits 和人类 review。监督可以在多大程度上扩展和自动化，仍然是开放研究方向。

**6. 长期成功。** 外在优化循环依赖单个 rollout 之外的奖励，而这些 rollout 可以在训练沙箱中模拟。

以编码 Agent 为例。编码 Agent 已经提高了软件工程中的日常生产力，但许多优化目标仍然过于短期。它往往能完成手头任务，但不那么明显的是，它应该如何保护一个由数百或数千名工程师共同维护的仓库的长期健康。标准的基于沙箱的 RLVR 风格训练，很少能捕捉可维护性、所有权边界、迁移成本、向后兼容性或未来调试负担。

**7. 人类的角色。** 人类应当向栈的上层移动，而不是被移出循环，这意味着人类应在正确的时间、正确的抽象层级提供监督，并且我们的系统设计应考虑何时以及如何设立此类接触点。

上面列出的许多挑战都需要人类的反馈与引导。毕竟，我们是在为人类更好的未来构建技术，而不是反过来。

## 引用

请按如下方式引用本文：

> Weng, Lilian. “Harness Engineering for Self-Improvement”. Lil’Log (Jul 2026). https://lilianweng.github.io/posts/2026-07-04-harness/

或者使用 BibTeX 引用：

```bibtex
@article{weng2026harness,
  title = {Harness Engineering for Self-Improvement},
  author = {Weng, Lilian},
  journal = {lilianweng.github.io},
  year = {2026},
  month = {July},
  url = "https://lilianweng.github.io/posts/2026-07-04-harness/"
}
```

## 附录：一些有用的 benchmark

- **[PaperBench](https://arxiv.org/abs/2504.01848)**：从零复现 20 篇 ICML 2024 Spotlight 和 Oral 论文，包括理解论文贡献、开发代码库，以及成功执行实验。
  - 每个复现任务会被分解为更小、可单独评分的任务。
  - 总共有 8,316 条 rubric，由论文作者共同开发。
  - 当时最好的模型（`Claude 3.5 Sonnet`，约 21%）没有超过 ML 博士。
  - 包括 PaperBench、PaperBench Code-Dev（轻量版本）和 JudgeEval。
- **[CORE-Bench](https://arxiv.org/abs/2409.11363)**：评估已发表研究的计算可复现性。
  - 270 个任务，基于横跨计算机科学、社会科学和医学的 90 篇科学论文。
  - 任务涉及根据给定代码和数据复现结果。
  - 包含多个难度等级，以及纯语言任务和视觉语言任务。
  - 当时报告的最佳 Agent（`GPT-4o` 和 `GPT-4o-mini`）在最难任务上仅达到 21% 准确率。
- **[ScienceAgentBench](https://arxiv.org/abs/2410.05080)**：评估用于数据驱动科学发现的 LLM Agent。
  - 从数学、化学、生物、地理四个学科的 44 篇同行评审论文中提取 102 个任务。
  - 覆盖这些领域中的基础数据科学任务：数据处理、模型开发、数据分析和信息可视化。
- **[RE-Bench](https://arxiv.org/abs/2411.15114)**：在现实 ML 研究工程环境中，将前沿 AI Agent 与人类专家对比评估。
  - 7 个具有挑战性、开放式的 ML 研究工程环境。
  - 每个环境 =（评分函数，起始解，参考解）；每个都可以用不超过 8 块 H100 GPU 运行。
  - 示例：优化 kernel、运行 scaling-law 实验、修复 embedding、为 QA 微调 GPT-2 等。
  - 包含来自 61 名不同人类专家的 71 次八小时尝试的数据。
  - 人类专家在 82% 的 8 小时尝试中取得非零分；24% 达到或超过强参考解。
  - 在 2 小时预算下，最佳 AI Agent 得分比人类高 4 倍，但人类在更长预算下收益更好，并在 8 小时和 32 小时设置下超过 Agent。
- **[MLE-bench](https://arxiv.org/abs/2410.07095)**：在离线 Kaggle 竞赛上评估 ML 工程 Agent。
  - 包含从 Kaggle 精选的 75 个 ML 工程竞赛。
  - 测试训练模型、准备数据集、运行实验，以及向评分脚本提交预测。
  - 使用 Kaggle 公开排行榜作为人类 baseline。
  - 论文中最佳设置 `o1-preview` 搭配 AIDE scaffolding，在 16.9% 的竞赛中至少达到 Kaggle 铜牌水平。
  - 包含资源扩展和污染分析。
- **[KernelBench](https://arxiv.org/abs/2502.10517)**：评估生成 GPU kernel 的正确性和速度。
  - 250 个 PyTorch 任务，用于评估 LLM 是否能写出快速且正确的 kernel。
  - 评估指标 fast\_p = 生成的 kernel 中正确且快于 baseline 的比例。

## 参考文献

[1] Good, I. J. [“Speculations Concerning the First Ultraintelligent Machine.”](https://philpapers.org/rec/GOOSCT) *Advances in Computers*, 6:31–88, 1965.

[2] Yudkowsky, Eliezer. [“Recursive Self-Improvement.”](https://www.lesswrong.com/posts/JBadX7rwdcRFzGuju/recursive-self-improvement) LessWrong, 2008.

[3] Choi, et al. [“Anchored Self-Play for Code Repair.”](https://openreview.net/forum?id=lTbBFAoPSA) ICML 2026.

[4] Zhao, et al. [“Absolute Zero: Reinforced Self-play Reasoning with Zero Data.”](https://arxiv.org/abs/2505.03335) arXiv preprint arXiv:2505.03335, 2025.

[5] Yuan, et al. [“Self-Rewarding Language Models.”](https://arxiv.org/abs/2401.10020) arXiv preprint arXiv:2401.10020, 2024.

[6] Chen, et al. [“Self-Play Fine-Tuning Converts Weak Language Models to Strong Language Models.”](https://arxiv.org/abs/2401.01335) ICML 2024.

[7] Zhang, et al. [“Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models.”](https://arxiv.org/abs/2510.04618) ICLR 2026.

[8] Ye, et al. [“Meta Context Engineering via Agentic Skill Evolution.”](https://arxiv.org/abs/2601.21557) arXiv preprint arXiv:2601.21557, 2026.

[9] Lee, et al. [“Meta-Harness: End-to-End Optimization of Model Harnesses.”](https://arxiv.org/abs/2603.28052) arXiv preprint arXiv:2603.28052, 2026.

[10] Lu, et al. [“Towards end-to-end automation of AI research.”](https://www.nature.com/articles/s41586-026-10265-5) *Nature*, 651:914–919, 2026.

[11] Meng, et al. [“ScientistOne: Towards Human-Level Autonomous Research via Chain-of-Evidence.”](https://arxiv.org/abs/2605.26340) arXiv preprint arXiv:2605.26340, 2026.

[12] Kulikov, et al. [“Autodata: An agentic data scientist to create high quality synthetic data.”](https://arxiv.org/abs/2606.25996) arXiv preprint arXiv:2606.25996, 2026.

[13] Hu, Lu, and Clune. [“Automated Design of Agentic Systems.”](https://arxiv.org/abs/2408.08435) ICLR 2025.

[14] Madaan, et al. [“Self-Refine: Iterative Refinement with Self-Feedback.”](https://arxiv.org/abs/2303.17651) NeurIPS 2023.

[15] Zhang, et al. [“AFlow: Automating Agentic Workflow Generation.”](https://arxiv.org/abs/2410.10762) ICLR 2025.

[16] Zelikman, et al. [“Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation.”](https://arxiv.org/abs/2310.02304) COLM 2024.

[17] Zhang, et al. [“Self-Harness: Harnesses That Improve Themselves.”](https://arxiv.org/abs/2606.09498) arXiv preprint arXiv:2606.09498, 2026.

[18] Fernando, et al. [“Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution.”](https://arxiv.org/abs/2309.16797) arXiv preprint arXiv:2309.16797, 2023.

[19] Agrawal, A. et al. [“GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning.”](https://arxiv.org/abs/2507.19457) arXiv preprint arXiv:2507.19457, 2025.

[20] Novikov, et al. [“AlphaEvolve: A coding agent for scientific and algorithmic discovery.”](https://arxiv.org/abs/2506.13131) arXiv preprint arXiv:2506.13131, 2025.

[21] Lange, Imajuku, and Cetin. [“ShinkaEvolve: Towards Open-Ended And Sample-Efficient Program Evolution.”](https://arxiv.org/abs/2509.19349) arXiv preprint arXiv:2509.19349, 2025.

[22] Wang, et al. [“ThetaEvolve: Test-time Learning on Open Problems.”](https://arxiv.org/abs/2511.23473) arXiv preprint arXiv:2511.23473, 2025.

[23] Zhang, et al. [“Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents.”](https://arxiv.org/abs/2505.22954) arXiv preprint arXiv:2505.22954, 2025.

[24] Zhang, et al. [“Hyperagents.”](https://arxiv.org/abs/2603.19461) arXiv preprint arXiv:2603.19461, 2026.

[25] Yuksekgonul, et al. [“Learning to Discover at Test Time.”](https://arxiv.org/abs/2601.16175) arXiv preprint arXiv:2601.16175, 2026.

[26] Riaz, et al. [“Epistemic Uncertainty for Test-Time Discovery.”](https://arxiv.org/abs/2605.11328) arXiv preprint arXiv:2605.11328, 2026.

[27] Hebbar, et al. [“SIA: Self Improving AI with Harness & Weight Updates.”](https://arxiv.org/abs/2605.27276) arXiv preprint arXiv:2605.27276, 2026.

[28] Trehan and Chopra. [“Why LLMs Aren’t Scientists Yet: Lessons from Four Autonomous Research Attempts.”](https://arxiv.org/abs/2601.03315) arXiv preprint arXiv:2601.03315, 2026.

[29] Bubeck, et al. [“Early science acceleration experiments with GPT-5.”](https://arxiv.org/abs/2511.16072) arXiv preprint arXiv:2511.16072, 2025.

[30] Starace, et al. [“PaperBench: Evaluating AI’s Ability to Replicate AI Research.”](https://arxiv.org/abs/2504.01848) ICML 2025.

[31] Wijk, et al. [“RE-Bench: Evaluating frontier AI R&D capabilities of language model agents against human experts.”](https://arxiv.org/abs/2411.15114) ICML 2025.

[32] Chan, et al. [“MLE-bench: Evaluating Machine Learning Agents on Machine Learning Engineering.”](https://arxiv.org/abs/2410.07095) arXiv preprint arXiv:2410.07095, 2024.

[33] Chen, et al. [“ScienceAgentBench: Toward Rigorous Assessment of Language Agents for Data-Driven Scientific Discovery.”](https://arxiv.org/abs/2410.05080) ICLR 2025.

[34] Siegel, et al. [“CORE-Bench: Fostering the Credibility of Published Research Through a Computational Reproducibility Agent Benchmark.”](https://arxiv.org/abs/2409.11363) TMLR 2024.

[35] Ouyang, et al. [“KernelBench: Can LLMs Write Efficient GPU Kernels?”](https://arxiv.org/abs/2502.10517) arXiv preprint arXiv:2502.10517, 2025.
