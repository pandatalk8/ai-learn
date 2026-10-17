---
title: "Harness Engineering for Self-Improvement — 中英逐段对照"
original_title: "Harness Engineering for Self-Improvement"
author: Lilian Weng
source_url: https://lilianweng.github.io/posts/2026-07-04-harness/
source_en: sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
source_zh: sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
type: web-clip-parallel
lang: en-zh
status: reviewed
created: 2026-07-10
format: paragraph-aligned bilingual
tags: [language-model, agent, harness-engineering, recursive-self-improvement, bilingual, translation]
---

# Harness Engineering for Self-Improvement — 中英逐段对照

> 本文为 Lilian Weng 原文与中文全译的**逐段对照**版本。  
> 英文源：`sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`  
> 中文源：`sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md`  
> 原文链接：https://lilianweng.github.io/posts/2026-07-04-harness/

## 阅读说明

- 按英文段落切分，与中文一一对应（共 **179** 段）。
- 每段编号为 `§N`，先 **EN**，后 **ZH**。
- 公式、代码块、参考文献条目等与原文一致处，两侧可能相同。
- 图片使用本地路径 `imgs/...`（与英文剪藏一致）。

### §1

**EN**

# Harness Engineering for Self-Improvement

**ZH**

# Harness Engineering for Self-Improvement（面向自我改进的 Harness Engineering）

### §2

**EN**

The concept of **recursive self-improvement (RSI)** dates back to [I. J. Good (1965)](https://philpapers.org/rec/GOOSCT), where he defined an “ultraintelligent machine” as a system that can surpass humans in all intellectual activities and design better machines to improve itself. [Yudkowsky (2008)](https://www.lesswrong.com/posts/JBadX7rwdcRFzGuju/recursive-self-improvement) used the phrase “recursive self-improvement” for a specific feedback loop: an AI uses its current intelligence to improve the cognitive machinery that produces its intelligence.

**ZH**

**递归自我改进（recursive self-improvement, RSI）** 这一概念可以追溯到 [I. J. Good（1965）](https://philpapers.org/rec/GOOSCT)；他将一台“超智能机器”定义为：一种能在所有智力活动上超越人类、并设计更好的机器来改进自身的系统。[Yudkowsky（2008）](https://www.lesswrong.com/posts/JBadX7rwdcRFzGuju/recursive-self-improvement) 用短语“recursive self-improvement”指一种特定的反馈回路：AI 使用其当前智能，去改进产生其智能的认知机器。

### §3

**EN**

This feedback loop in modern AI may indicate the model rewriting its own weights directly, or more broadly the model improves the *training pipeline* and the *deployment system*, which in turn enables a better successor model with improved performance across economically valuable tasks. The speed of research development in AI has been shown to drastically accelerated in frontier labs ([Anthropic](https://www.anthropic.com/institute/recursive-self-improvement); [OpenAI](https://openai.com/index/how-agents-are-transforming-work/)).

**ZH**

在现代 AI 中，这一反馈回路可能意味着模型直接重写自己的权重；或者更宽泛地说，模型改进*训练流水线*与*部署系统*，而这又使后继模型在具有经济价值的任务上获得更好表现。AI 研究开发的速度已被证明在前沿实验室中大幅加快（[Anthropic](https://www.anthropic.com/institute/recursive-self-improvement)；[OpenAI](https://openai.com/index/how-agents-are-transforming-work/)）。

### §4

**EN**

I explicitly mention *“deployment system”* because the layer between the raw model and the real-world context seems to be as important as the model’s raw intelligence (i.e. the evals right after pretraining). Harnesses are important components of AI deployment, as shown by successful coding agent products such as Claude Code and Codex. A **harness** is the system surrounding a base model that orchestrates execution and decides how the model thinks and plans, calls tools and acts, perceives and manages context, stores artifacts, and evaluates results.

**ZH**

我明确提到*“部署系统”*，因为原始模型与真实世界上下文之间的这一层，看起来与模型的原始智能同样重要（即预训练之后立刻做的评测）。Harness 是 AI 部署的重要组成部分，这一点由 Claude Code 与 Codex 等成功的编码 agent 产品所表明。**Harness** 是环绕基础模型的系统，它编排执行，并决定模型如何思考与规划、调用工具与行动、感知与管理上下文、存储产物，以及评估结果。

### §5

**EN**

This one post will focus on research around harness engineering and how it contributes to RSI. Much recent work on auto-research, self-improving agents, and evolutionary program search can be organized around this question. Other work on model self-play, synthetic data, test-time training and a broader theme of continual learning also matches the RSI vision (e.g. [Yuan et al. 2024](https://arxiv.org/abs/2401.10020), [Chen et al. 2024](https://arxiv.org/abs/2401.01335)), [Zhao et al. 2025](https://arxiv.org/abs/2505.03335), [Choi et al. 2026](https://openreview.net/forum?id=lTbBFAoPSA))) but they will not be the focus of this post.

**ZH**

这一篇帖子将聚焦 harness engineering 相关研究，以及它如何贡献于 RSI。最近许多关于自动化研究、自我改进 Agent、进化式程序搜索的工作，都可以围绕这个问题来组织。其他关于模型自博弈、合成数据、测试时训练，以及更广义持续学习主题的工作，也符合 RSI 的愿景（例如 [Yuan et al. 2024](https://arxiv.org/abs/2401.10020)、[Chen et al. 2024](https://arxiv.org/abs/2401.01335)、[Zhao et al. 2025](https://arxiv.org/abs/2505.03335)、[Choi et al. 2026](https://openreview.net/forum?id=lTbBFAoPSA)），但它们不是本文重点。

---

### §6

**EN**

## Harness Design Patterns

**ZH**

## Harness 设计模式

### §7

**EN**

Compared with [early agent frameworks](https://lilianweng.github.io/posts/2023-06-23-agent/), “agent = LLM + memory + tools + planning + action”, harnesses engineering additionally include *workflow design (e.g. loop engineering), evaluation, permission controls, and persistent state management*. It is no longer only prompt templates, but closer to runtime and software system design: how the model observes, acts, memorizes, checks itself, and improves.

**ZH**

与[早期 agent 框架](https://lilianweng.github.io/posts/2023-06-23-agent/)相比——“agent = LLM + memory + tools + planning + action”——harness engineering 还额外包含*工作流设计（例如 loop engineering）、评估、权限控制，以及持久状态管理*。它不再只是提示词模板，而更接近运行时与软件系统设计：模型如何观察、行动、记忆、检查自身，以及改进。

### §8

**EN**

The design should be deliberately simple and generic to enable generalization, likely with reference to existing software engineering practices to benefit from prertaining knowlege. There is also a strong analogy between operating systems and harnesses. Similar to an OS, a harness should encapsulate complicated logic while keeping the interface simple. Meanwhile, configs, tool interfaces and other protocols may gradually become standardized across the industry.

**ZH**

设计应当有意保持简单且通用，以便支持泛化，并很可能参考既有软件工程实践，以受益于预训练知识。操作系统与 harness 之间也有很强的类比。与 OS 类似，harness 应封装复杂逻辑，同时保持接口简单。与此同时，配置、工具接口与其他协议可能逐渐在全行业标准化。

### §9

**EN**

### Pattern 1: Workflow Automation

**ZH**

### 模式 1：工作流自动化

### §10

**EN**

Defining a workflow in which the model can operate, test, and iterate is a key design for automation. Karpathy’s autoresearch repo (<https://github.com/karpathy/autoresearch>) is a clean example of how such a workflow can be constructed. A common workflow follows a goal-oriented loop of plan, execute, observe/test, improve, and execute again *until* the goal is achieved. The process may trigger proactive requests to users for clarity in task specification or execution preference.

**ZH**

定义一个模型可以在其中运行、测试和迭代的工作流，是自动化的关键设计。Karpathy 的 autoresearch 仓库（<https://github.com/karpathy/autoresearch>）就是一个清晰示例，说明这样的工作流可以如何构建。常见工作流遵循一个目标导向循环：计划、执行、观察/测试、改进，再次执行，*直到*目标达成。这个过程可能会主动向用户请求澄清任务规格或执行偏好。

### §11

**EN**

![A simplified Codex agent loop: the agent calls tools and tool responses affect the model's next generation. (Image source: OpenAI codex agent post )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-openai-agent-loop.png)

**ZH**

![简化的 Codex Agent 循环：Agent 调用工具，工具响应会影响模型的下一次生成。（图片来源：OpenAI Codex Agent 文章）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-openai-agent-loop.png)

### §12

**EN**

*A simplified Codex agent loop: the agent calls tools and tool responses affect the model's next generation.  
(Image source: [OpenAI codex agent post](https://openai.com/index/unrolling-the-codex-agent-loop/))*

**ZH**

*简化的 Codex Agent 循环：Agent 调用工具，工具响应会影响模型的下一次生成。  
（图片来源：[OpenAI Codex Agent 文章](https://openai.com/index/unrolling-the-codex-agent-loop/)）*

### §13

**EN**

The workflow graph also emphasizes the model analyzing its own trajectories and failure cases and then iterating on its progress through an “agent runtime” rather than a static prompt template.

**ZH**

这个工作流图也强调了：模型会分析自己的轨迹和失败案例，然后通过“Agent runtime”持续迭代，而不是依赖一个静态提示词模板。

### §14

**EN**

### Pattern 2: File System as Persistent Memory

**ZH**

### 模式 2：文件系统作为持久记忆

### §15

**EN**

A recurring pattern in long-horizon agent systems is simple control over rich states and artifacts. A harness should not carry the entire workflow and all logs in context; instead, it should keep durable state in files. In long-horizon agentic rollout, artifacts such as experiment logs, code diffs, paper summaries, error traces, and past rollout trajectories often grow much longer than the context window that the model has trained for.

**ZH**

在长周期 Agent 系统中，一个反复出现的模式是：用简单方式控制丰富状态和产物。Harness 不应该把整个工作流和所有日志都塞进上下文；相反，它应该把持久状态保存在文件中。在长周期 Agent rollout 中，实验日志、代码 diff、论文摘要、错误 trace、过去 rollout 轨迹等产物，常常会增长到远远超过模型训练时上下文窗口的长度。

### §16

**EN**

Learning how to read, write, and edit the file system (commonly via `bash` commands) is a foundation skill for LLMs, and thus managing persistent memory in the simple form of files naturally benefits from improvements in core model capability.

**ZH**

学习如何读取、写入和编辑文件系统（通常通过 `bash` 命令）是 LLM 的一项基础技能。因此，用文件这种简单形式管理持久记忆，会自然受益于核心模型能力的提升。

### §17

**EN**

### Pattern 3: Sub-agent and Backend Jobs

**ZH**

### 模式 3：子 Agent 与后台任务

### §18

**EN**

A harness can spawn multiple subagents to execute in parallel and monitor backend jobs. This is useful when the main agent needs to search multiple hypotheses, run experiments concurrently, or delegate isolated subtasks without polluting the main context. The parent agent then needs a small process manager: launch jobs, inspect logs, cancel failed runs, and merge results back into the main agent thread.

**ZH**

Harness 可以启动多个子 Agent 并行执行，也可以监控后台任务。当主 Agent 需要搜索多个假设、并发运行实验，或委派隔离的子任务而不污染主上下文时，这非常有用。父 Agent 因而需要一个小型进程管理器：启动任务、检查日志、取消失败运行，并把结果合并回主 Agent 线程。

### §19

**EN**

The key design choice is to make parallelism explicit and inspectable. If subagent outputs only live in a transient chat context, they quickly become obselete and hidden. If they are stored as files, logs, and status records, the model can recover after interruptions and reason over its own execution history.

**ZH**

关键设计选择是让并行性变得显式且可检查。如果子 Agent 的输出只存在于临时聊天上下文中，它们很快就会过时并被隐藏起来。如果它们被存储为文件、日志和状态记录，模型就能在中断后恢复，并基于自己的执行历史进行推理。

### §20

**EN**

### Case study: Coding Agent Harness

**ZH**

### 案例研究：编码 Agent Harness

### §21

**EN**

The core interface of mainstream coding agents has become stabilized across Claude Code, Codex, OpenCode, and Cursor-style agents. They commonly use a loop like:

**ZH**

主流编码 Agent 的核心接口已经在 Claude Code、Codex、OpenCode 和 Cursor 风格 Agent 之间趋于稳定。它们通常使用类似下面的循环：

### §22

**EN**

![Figure](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-coding-harness-loop.png)

**ZH**

![Figure](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-coding-harness-loop.png)

### §23

**EN**

With access to a set of tools, the coding agent is able to develop and debug issues in a given repository, similar to how human developers are equipped with IDEs.

**ZH**

在获得一组工具之后，编码 Agent 就能在给定仓库中开发和调试问题，类似人类开发者配备 IDE 后的工作方式。

### §24

**EN**

(Not a comprenhensive list; shown for demonstration. Read [this](https://github.com/yasasbanukaofficial/claude-code) if interested.)

**ZH**

（不是完整列表；仅用于演示。若感兴趣可阅读[此文](https://github.com/yasasbanukaofficial/claude-code)。）

### §25

**EN**

| Group | Tool definitions |
| --- | --- |
| File system | - File discovery: `glob`, `grep`, `ls` - File read: `read`, `read_many` - File modification: `write` (a whole new file); `edit` (string exact-match replacement); `multi_edit`; `apply_patch` (applies a structured patch/diff) |
| Shell execution | Run commands: `bash`, `PowerShell` |
| IO | `lsp`, git tools like `git_status`, `git_diff`, `git_commit` |
| External context | MCP tools, Skills |
| Web search | `web_search`, `web_fetch`, browser tools |
| Artifacts | Read docs, images; generate HTML, images |
| Backend processes | Such as: `CronCreate`, `CronDelete`, `CronList` |
| Agent delegation | Such as: `spawn_agent`, `resume_agent`, `wait_agent`, `list_agents`, `close_agent`, `interrupt_agent`, etc. |

**ZH**

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

### §26

**EN**

### Harness Layer vs Core Intelligence?

**ZH**

### Harness 层与核心智能？

### §27

**EN**

It is hard to forecast how much the future of RSI will rely on harness engineering, but the near-term path of RSI is unlikely to start as a model directly rewriting its weights. My prediction of a practical near-term path is:

**ZH**

很难预测未来 RSI 会在多大程度上依赖 harness engineering，但 RSI 的近期实用路径不太可能从模型直接重写自己的权重开始。我对近期实用路径的预测是：

### §28

**EN**

1. Harness engineering will evolve in the direction of meta-methodology (i.e. improving the machinery for getting better answers, not just improving the answer itself). The harness system itself becomes an optimization target, with fewer heuristic rules and more general mechanisms.
2. In turn, mature harnesses enable auto-research for model self-improvement loop and smarter models prevents harnesses from overengineering and keep the system sustainable.

**ZH**

1. Harness engineering 会朝着元方法论（meta-methodology）的方向演进，也就是改进“获得更好答案的机器”，而不仅仅是改进答案本身。Harness 系统本身会成为优化对象，启发式规则会减少，更通用的机制会增加。
2. 成熟的 harness 又会支持面向模型自我改进循环的自动化研究；而更聪明的模型会防止 harness 过度工程化，并保持系统可持续。

### §29

**EN**

Eventually it is possible that many harness improvements will be *internalized* into core model behavior, but the interface with external context and tools should remain. We have seen a softer version of this pattern with [prompt engineering](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/): manual prompt tricks became less central as instruction tuning and model reasoning improved, but *the need to specify goals, constraints, context, and evaluation did not disappear*.

**ZH**

最终，许多 harness 改进可能会被*内化*进核心模型行为中，但它与外部上下文和工具之间的接口仍然应当保留。我们已经在[提示词工程](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)中看到过这个模式的较弱版本：随着指令微调和模型推理能力提升，手工提示词技巧变得没那么核心，但*指定目标、约束、上下文和评估的需求并没有消失*。

---

### §30

**EN**

## Harness Optimization

**ZH**

## Harness 优化

### §31

**EN**

The progression in the object being optimized in the harness system is roughly: instruction [prompts](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/) → structured context → workflow → harness code → optimizer code. As the model becomes more intelligent and powerful, we move toward more complex targets and generic methods.

**ZH**

Harness 系统中被优化对象的演进大致是：指令[提示词](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/) -> 结构化上下文 -> 工作流 -> harness 代码 -> 优化器代码。随着模型变得更智能、更强大，我们会走向更复杂的目标和更通用的方法。

### §32

**EN**

### Context Engineering

**ZH**

### 上下文工程

### §33

**EN**

Simply appending all the tool responses and model generations into the context can quickly grow out of control as the agentic job horizon increases significantly. Context management is a layer to construct a more structed and concise context for LLM and manage persistant states. There is no doubt that long-context research will keep on making progress but at the moment long-context intelligence and context engineering sometime intertwines.

**ZH**

随着 Agent 任务周期显著拉长，简单地把所有工具响应和模型生成都追加进上下文，很快就会失控。上下文管理是一层用于为 LLM 构造更结构化、更简洁上下文，并管理持久状态的机制。毫无疑问，长上下文研究会继续进步，但眼下长上下文智能与上下文工程有时会交织在一起。

### §34

**EN**

**Agentic Context Engineering** (ACE; [Zhang et al. 2025](https://arxiv.org/abs/2510.04618)) treats context as an evolving playbook rather than an increasingly lengthening prompt. It has three components to maintain one context playbook of bullet points, each with an identifier and a description.

**ZH**

**Agentic Context Engineering**（ACE；[Zhang et al. 2025](https://arxiv.org/abs/2510.04618)）把上下文看作一个不断演化的 playbook，而不是一段越来越长的提示词。它有三个组件，用来维护一个由 bullet points 组成的上下文 playbook；每个条目都有标识符和描述。

### §35

**EN**

1. *Generator*: produces task trajectories, with reference to bullet points.
2. *Reflector*: distills insights from successful and failed trajectories.
3. *Curator*: updates the structured context with incremental, itemized entries.

**ZH**

1. *生成器*：生成任务轨迹，并参考 bullet points。
2. *反思器*：从成功和失败轨迹中提炼洞见。
3. *策展器*：用增量、条目化的方式更新结构化上下文。

### §36

**EN**

![The framework of Agentic Context Engineering (ACE). (Image source: Zhang et al. 2025 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-ace.png)

**ZH**

![Agentic Context Engineering（ACE）框架。（图片来源：Zhang et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-ace.png)

### §37

**EN**

*The framework of Agentic Context Engineering (ACE). (Image source: [Zhang et al. 2025](https://arxiv.org/abs/2510.04618))*

**ZH**

*Agentic Context Engineering（ACE）框架。（图片来源：[Zhang et al. 2025](https://arxiv.org/abs/2510.04618)）*

### §38

**EN**

To prevent context collapse and brevity bias during iterative rewrites, one key design choice in ACE is that the curator does not rewrite a full prompt blob. It instead outputs a collection of structured, itemized bullets in the form of (identifier, description), and these bullets are merged into a structured context logbook with deterministic logic. The context items are refined and deduplicated periodically.

**ZH**

为了在迭代重写过程中避免上下文坍塌和简短偏差，ACE 的一个关键设计选择是：策展器不会重写完整的提示词 blob。相反，它输出一组结构化、条目化的 bullet，形式为（标识符，描述）；这些 bullet 会通过确定性逻辑被合并进结构化上下文日志。上下文条目会被周期性地精炼和去重。

### §39

**EN**

The fact that ACE learns insights from rollouts helps us move toward self-managed memory, but the update rules and the overall workflow are still handcrafted. To move toward a more self-improving loop, **Meta Context Engineering** (MCE; [Ye et al. 2026](https://arxiv.org/abs/2601.21557)) separates the mechanism (how to manage context) from the artifact content (what is in context), running skill evolution at the meta-optimization level and context optimization at the base level.

**ZH**

ACE 从 rollout 中学习洞见，这帮助我们走向自管理记忆；但它的更新规则和整体工作流仍然是手工设计的。为了走向更自我改进的循环，**Meta Context Engineering**（MCE；[Ye et al. 2026](https://arxiv.org/abs/2601.21557)）把机制（如何管理上下文）与 artifact 内容（上下文里有什么）分离开来，在元优化层进行技能演化，在基础层进行上下文优化。

### §40

**EN**

An MCE skill $s \in \mathcal{S}$ defines a context function $c_s=(\rho_s,F_s)$ and maps an input $x$ to context $c = F_s(x;\rho_s)$, where:

**ZH**

一个 MCE 技能 $s \in \mathcal{S}$ 定义一个上下文函数 $c_s=(\rho_s,F_s)$，并把输入 $x$ 映射到上下文 $c = F_s(x;\rho_s)$，其中：

### §41

**EN**

- $\rho_s = \{\rho_1,\dots,\rho_m\}$ are static components (prompts, knowledge bases, code libraries).
- $F_s = \{F_1,\dots,F_k\}$ are dynamic operators (search, selection, filtering, formatting).

**ZH**

- $\rho_s = \{\rho_1,\dots,\rho_m\}$ 是静态组件（提示词、知识库、代码库）。
- $F_s = \{F_1,\dots,F_k\}$ 是动态算子（搜索、选择、过滤、格式化）。

### §42

**EN**

The bi-level optimization is to find the best context $c_s^*$ given skill $s$ on the training data, while the outer loop finds the optimal skill that provides the best performance on the validation set:

**ZH**

双层优化的目标是：在给定技能 $s$ 的情况下，在训练数据上找到最佳上下文 $c_s^*$；同时，外层循环寻找能在验证集上带来最佳表现的最优技能：

### §43

**EN = ZH**

$$
\text{Inner: }c_s^*=\arg\max_{c_s}J_\text{train}(c_s;s)\quad
\text{Outer: }s^*=\arg\max_{s\in\mathcal{S}}J_\text{val}(c_s^*)
$$

### §44

**EN**

The skill database tracks the history of previous skills, context functions and eval metrics $\mathcal{H}_{k-1} = \{(s_i,c_i,J_i^\text{train}, J_i^\text{val})\}_{i=1}^{k-1}$. A meta-level agent performs agentic [crossover](https://en.wikipedia.org/wiki/Crossover_(evolutionary_algorithm)) over prior skills to create a new skill given a task $\tau$: $s_k=\text{crossover}(\tau,\mathcal{H}_{k-1})$.

**ZH**

技能数据库会追踪历史上的技能、上下文函数和评估指标 $\mathcal{H}_{k-1} = \{(s_i,c_i,J_i^\text{train}, J_i^\text{val})\}_{i=1}^{k-1}$。一个元层 Agent 会基于先前技能做 Agentic [交叉](https://en.wikipedia.org/wiki/Crossover_(evolutionary_algorithm))，为任务 $\tau$ 创建新技能：$s_k=\text{crossover}(\tau,\mathcal{H}_{k-1})$。

### §45

**EN**

Then a base-level context engineer executes the skill $s_k$ and learns the context function from rollout feedback $\mathcal{R}_k$, guided by the current skill: $c_k=\text{engineer}(\tau,s_k;c_{k-1}^*,\mathcal{R}_k)$.

**ZH**

然后，一个基础层上下文工程师执行技能 $s_k$，并在当前技能指导下，从 rollout 反馈 $\mathcal{R}_k$ 中学习上下文函数：$c_k=\text{engineer}(\tau,s_k;c_{k-1}^*,\mathcal{R}_k)$。

### §46

**EN**

![The framework of Meta Context Engineering (MCE): meta-level skill evolution searches over context-management mechanisms, while the base level optimizes the task context. (Image source: Ye et al. 2026 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-mce.png)

**ZH**

![Meta Context Engineering（MCE）框架：元层技能演化搜索上下文管理机制，而基础层优化任务上下文。（图片来源：Ye et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-mce.png)

### §47

**EN**

*The framework of Meta Context Engineering (MCE): meta-level skill evolution searches over context-management mechanisms, while the base level optimizes the task context. (Image source: [Ye et al. 2026](https://arxiv.org/abs/2601.21557))*

**ZH**

*Meta Context Engineering（MCE）框架：元层技能演化搜索上下文管理机制，而基础层优化任务上下文。（图片来源：[Ye et al. 2026](https://arxiv.org/abs/2601.21557)）*

### §48

**EN**

MCE does not enforce a heuristic rule for how to structure context as ACE does. It uses *free-form skills* to store the most important knowledge for a task, and evolves the skill and the skill-conditioned context iteratively together. Implementation-wise, a context function $c$ is instantiated as a collection of files in a dedicated directory, including both static (`skill.md`) and dynamic (context and data rollouts) components. Both meta-level and base-level optimization are executed in agentic coding envs with a standard tool set,

**ZH**

MCE 不像 ACE 那样强制规定如何构造上下文的启发式规则。它使用*自由形式技能*来存储任务中最重要的知识，并让技能和受技能条件化的上下文一起迭代演化。在实现上，上下文函数 $c$ 被实例化为专用目录中的一组文件，包括静态组件（`skill.md`）和动态组件（上下文与数据 rollout）。元层和基础层优化都在 Agentic 编码环境中执行，并使用一组标准工具：

### §49

**EN = ZH**

$$
\mathcal{T}=\{\texttt{Read},\texttt{Write},\texttt{Edit},\texttt{Bash},\texttt{Glob},\texttt{Grep},\texttt{TodoWrite}\}
$$

### §50

**EN**

**Meta-Harness** ([Lee et al. 2026](https://arxiv.org/abs/2603.28052)) moves another level deeper: the optimized object is the *code* that determines and optimizes what information should be stored, retrieved, and presented to the model. “Meta-” in its name means it is a harness for optimizing harnesses.

**ZH**

**Meta-Harness**（[Lee et al. 2026](https://arxiv.org/abs/2603.28052)）又向下推进了一层：被优化对象是决定并优化“哪些信息应被存储、检索并呈现给模型”的*代码*。它名字中的“Meta-”意味着它是一个用于优化 harness 的 harness。

### §51

**EN**

![The Meta-Harness outer-loop optimization algorithm. (Image source: Lee et al. 2026 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-meta-harness-outer-loop.png)

**ZH**

![Meta-Harness 外层循环优化算法。（图片来源：Lee et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-meta-harness-outer-loop.png)

### §52

**EN**

*The Meta-Harness outer-loop optimization algorithm. (Image source: [Lee et al. 2026](https://arxiv.org/abs/2603.28052))*

**ZH**

*Meta-Harness 外层循环优化算法。（图片来源：[Lee et al. 2026](https://arxiv.org/abs/2603.28052)）*

### §53

**EN**

The proposer for creating a new harness is itself a coding agent and the final output is a collection of harness candidates on the Pareto frontier.

**ZH**

用于创建新 harness 的 proposer 本身就是一个编码 Agent，最终输出是一组位于 Pareto 前沿上的 harness 候选。

### §54

**EN**

- The entire execution history is accessible via a file system, and thus the coding agent uses commands like `grep` or `cat` to read through it instead of shoveling everything into a single prompt context.
- The proposed harness is a dictionary in the file system containing its own source code, scores, rollout trajectories, and state updates.
- The mete-harness loop iteratively creates new harnesses, and only qualified ones are kept.

**ZH**

- 整个执行历史都可以通过文件系统访问，因此编码 Agent 会用 `grep` 或 `cat` 之类命令阅读历史，而不是把所有东西塞进单一提示词上下文。
- 被提出的 harness 是文件系统中的一个字典，里面包含自己的源代码、分数、rollout 轨迹和状态更新。
- Meta-harness 循环会迭代创建新 harness，并且只保留合格者。

### §55

**EN**

![The performance of Meta-Harness on (Left) text classification with a small number of iterations and (Right) TerminalBench-2. Note that the search in the TerminalBench-2 experiment is initialized from Terminus-KIRA and Terminus-2, two very strong harnesses. (Image source: Lee et al. 2026 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-meta-harness.png)

**ZH**

![Meta-Harness 在（左）少量迭代文本分类任务和（右）TerminalBench-2 上的表现。注意，TerminalBench-2 实验中的搜索是从 Terminus-KIRA 和 Terminus-2 这两个非常强的 harness 初始化的。（图片来源：Lee et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-meta-harness.png)

### §56

**EN**

*The performance of Meta-Harness on (Left) text classification with a small number of iterations and (Right) TerminalBench-2. Note that the search in the TerminalBench-2 experiment is initialized from Terminus-KIRA and Terminus-2, two very strong harnesses. (Image source: [Lee et al. 2026](https://arxiv.org/abs/2603.28052))*

**ZH**

*Meta-Harness 在（左）少量迭代文本分类任务和（右）TerminalBench-2 上的表现。注意，TerminalBench-2 实验中的搜索是从 Terminus-KIRA 和 Terminus-2 这两个非常强的 harness 初始化的。（图片来源：[Lee et al. 2026](https://arxiv.org/abs/2603.28052)）*

### §57

**EN**

Still, the important lesson is clear: once harness design becomes an executable search space, a strong coding agent can exploit the same design space human engineers use.

**ZH**

不过，重要经验已经很清楚：一旦 harness 设计变成可执行搜索空间，强大的编码 Agent 就能利用人类工程师所使用的同一设计空间。

### §58

**EN**

### Workflow Design

**ZH**

### 工作流设计

### §59

**EN**

Workflow design in harness engineering can be handcrafted by domain experts. Taking auto-research as an example, various frameworks have been proposed and tested. The **AI Scientist** system ([Lu et al. 2026](https://www.nature.com/articles/s41586-026-10265-5)) builds a pipeline to propose research ideas, write code, run experiments, analyze results, write a manuscript, and perform peer review. [Meng et al. (2026)](https://arxiv.org/abs/2605.26340) make verifiability the central design constraint in **ScientistOne**, where every claim (citation, numerical, methodological, conclusion) must trace to an evidence source and is audited by Chain-of-Evidence checks.

**ZH**

Harness engineering 中的工作流设计可以由领域专家手工完成。以自动化研究为例，已经有多种框架被提出并测试。**AI Scientist** 系统（[Lu et al. 2026](https://www.nature.com/articles/s41586-026-10265-5)）构建了一条流水线，用于提出研究想法、写代码、运行实验、分析结果、撰写论文并执行同行评审。[Meng et al.（2026）](https://arxiv.org/abs/2605.26340)在 **ScientistOne** 中把可验证性作为核心设计约束：每一个 claim（引用、数值、方法、结论）都必须追溯到证据来源，并由 Chain-of-Evidence 检查进行审计。

### §60

**EN**

![AI Scientist pipeline for idea generation, experimentation, paper writing, and review. (Image source: Lu et al. 2026 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-ai-scientist.png)

**ZH**

![AI Scientist 用于想法生成、实验、论文写作和评审的流水线。（图片来源：Lu et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-ai-scientist.png)

### §61

**EN**

*AI Scientist pipeline for idea generation, experimentation, paper writing, and review. (Image source: [Lu et al. 2026](https://www.nature.com/articles/s41586-026-10265-5))*

**ZH**

*AI Scientist 用于想法生成、实验、论文写作和评审的流水线。（图片来源：[Lu et al. 2026](https://www.nature.com/articles/s41586-026-10265-5)）*

### §62

**EN**

The **Autodata** agent ([Kulikov et al. 2026](https://arxiv.org/abs/2606.25996)) is designed to work as a data scientist for generating training and evaluation data. The main agent manages a *challenger* that proposes problems, a *weak solver*, a *strong solver*, and a *verifier/judge*, aiming to synthesize data at the “just right” level of difficulty, meaning that the strong solver succeeds but the weak solver fails.

**ZH**

**Autodata** Agent（[Kulikov et al. 2026](https://arxiv.org/abs/2606.25996)）被设计为一个数据科学家，用于生成训练和评估数据。主 Agent 管理一个*挑战者*、一个*弱求解器*、一个*强求解器*和一个*验证器/裁判*。它的目标是合成“恰到好处”难度的数据，也就是强求解器能成功、弱求解器会失败。

### §63

**EN**

In Autodata, the challenger prompt is updated iteratively according to feedback from the solvers and verifier. The limitation here is that synthesized tasks are used to fine-tune weak solvers but not strong solvers; if the loop cannot iteratively improve the strong model, it is more like indirect distillation over a generated prompt distribution, with less RSI flavor.

**ZH**

在 Autodata 中，挑战者提示词会根据来自求解器和验证器的反馈迭代更新。这里的局限是：合成任务被用于微调弱求解器，而不是强求解器；如果这个循环不能迭代改进强模型，它就更像是在生成的提示词分布上做间接蒸馏，RSI 的味道会更少。

### §64

**EN**

![Autodata agentic workflow design for generating synthetic training and evaluation data around challenger, solver, and verifier roles. (Image source: Kulikov et al. 2026 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-autodata.png)

**ZH**

![Autodata 围绕挑战者、求解器和验证器角色生成合成训练与评估数据的 Agentic 工作流设计。（图片来源：Kulikov et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-autodata.png)

### §65

**EN**

*Autodata agentic workflow design for generating synthetic training and evaluation data around challenger, solver, and verifier roles. (Image source: [Kulikov et al. 2026](https://arxiv.org/abs/2606.25996))*

**ZH**

*Autodata 围绕挑战者、求解器和验证器角色生成合成训练与评估数据的 Agentic 工作流设计。（图片来源：[Kulikov et al. 2026](https://arxiv.org/abs/2606.25996)）*

### §66

**EN**

The design space for workflow is *enormous*, and naturally we can think of workflow design as a search problem, and therefore we should be able to find good solutions by algorithms rather than only manually craft them. Following this direction, **Automated Design of Agentic Systems** (ADAS; [Hu et al. 2025](https://arxiv.org/abs/2408.08435)) formulates agent design itself as an optimization problem, “meta-agent search” where a meta-agent proposes new designs of agentic workflows.

**ZH**

工作流设计空间是*巨大的*。因此，我们自然可以把工作流设计看作一个搜索问题，也就应该能通过算法找到好的解，而不只是靠人工手工设计。沿着这个方向，**Automated Design of Agentic Systems**（ADAS；[Hu et al. 2025](https://arxiv.org/abs/2408.08435)）把 Agent 设计本身表述为一个优化问题，即“元 Agent 搜索”：由一个元 Agent 提出新的 Agentic 工作流设计。

### §67

**EN**

1. Initialize an archive of agentic workflows with simple agents such as CoT and self-refine.
2. Ask a meta-agent to program new agents, all in *code*, inspired by existing solutions in the archive.
   - The meta-agent first generates a high-level description of the new workflow, and then implements it in code.
   - The draft program then goes through two self-refine steps (i.e. ask the model to provide feedback and then ask the same model to refine the previously generated outputs based on the feedback; [Madaan et al. 2023](https://arxiv.org/abs/2303.17651)) by the meta-agent to check its novelty.
3. Evaluate each new candidate and add successful ones back to the archive.
4. Repeat steps 2-3 until the maximum iteration count is reached.

**ZH**

1. 用 CoT 和 self-refine 这样的简单 Agent 初始化一个 Agentic 工作流 archive。
2. 要求一个元 Agent 受到 archive 中已有解的启发，以*代码*形式编写新 Agent。
   - 元 Agent 先生成新工作流的高层描述，然后用代码实现它。
   - 草稿程序随后会经过两轮由元 Agent 执行的 self-refine 步骤（即要求模型给出反馈，然后要求同一个模型基于反馈改进先前输出；[Madaan et al. 2023](https://arxiv.org/abs/2303.17651)），以检查其新颖性。
3. 评估每个新候选，并把成功者加入 archive。
4. 重复步骤 2-3，直到达到最大迭代次数。

### §68

**EN**

![Illustration of Automated Design of Agentic Systems (ADAS). (Image source: Hu et al. 2025 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-adas.png)

**ZH**

![Automated Design of Agentic Systems（ADAS）示意图。（图片来源：Hu et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-adas.png)

### §69

**EN**

*Illustration of Automated Design of Agentic Systems (ADAS).  
(Image source: [Hu et al. 2025](https://arxiv.org/abs/2408.08435))*

**ZH**

*Automated Design of Agentic Systems（ADAS）示意图。  
（图片来源：[Hu et al. 2025](https://arxiv.org/abs/2408.08435)）*

### §70

**EN**

**AFlow** ([Zhang et al. 2025](https://arxiv.org/abs/2410.10762)) represents an agentic workflow as a graph, where nodes represent LLM-invoking actions and edges implement logical operations in code. The workflow optimization relies on [MCTS](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search) (Monte Carlo Tree Search):

**ZH**

**AFlow**（[Zhang et al. 2025](https://arxiv.org/abs/2410.10762)）把 Agentic 工作流表示为一张图，其中节点代表调用 LLM 的动作，边则用代码实现逻辑操作。工作流优化依赖 [MCTS](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search)（Monte Carlo Tree Search，蒙特卡洛树搜索）：

### §71

**EN**

1. Initialize the starting workflow $W_0$ in the tree with a template.
2. Select a workflow node using a soft mixture of score and uniform exploration.
3. Expand it by asking an LLM to produce a modified workflow conditioned on its evaluation performance.
4. Execute and evaluate the new workflow.
5. Add it back to the tree if the new workflow shows improvement within a budget of $N$ rounds.
6. Repeat steps 2-5 and stop when the top-$k$ average score plateaus or hit the budget.

**ZH**

1. 用一个模板在树中初始化起始工作流 $W_0$。
2. 用分数和均匀探索的软混合策略选择一个工作流节点。
3. 要求 LLM 基于其评估表现生成一个修改后的工作流，从而扩展该节点。
4. 执行并评估新工作流。
5. 如果新工作流在 $N$ 轮预算内表现出改进，则把它加入树中。
6. 重复步骤 2-5，并在 top-$k$ 平均分进入平台期或预算耗尽时停止。

### §72

**EN**

![AFlow optimization process over a tree of workflow candidates. (Image source: Zhang et al. 2025 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-aflow.png)

**ZH**

![AFlow 在工作流候选树上的优化过程。（图片来源：Zhang et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-aflow.png)

### §73

**EN**

*AFlow optimization process over a tree of workflow candidates. (Image source: [Zhang et al. 2025](https://arxiv.org/abs/2410.10762))*

**ZH**

*AFlow 在工作流候选树上的优化过程。（图片来源：[Zhang et al. 2025](https://arxiv.org/abs/2410.10762)）*

### §74

**EN**

Experiments of AFlow in QA, code, and math tasks showed decent improvement of AFlow over manually designed workflows and ADAS.

**ZH**

AFlow 在问答、代码和数学任务中的实验显示，相比手工设计工作流和 ADAS，AFlow 有不错的提升。

### §75

**EN**

![AFlow experiments in comparison to manual methods and ADAS. (Image source: Zhang et al. 2025 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-aflow-exp.png)

**ZH**

![AFlow 与手工方法和 ADAS 的实验对比。（图片来源：Zhang et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-aflow-exp.png)

### §76

**EN**

*AFlow experiments in comparison to manual methods and ADAS. (Image source: [Zhang et al. 2025](https://arxiv.org/abs/2410.10762))*

**ZH**

*AFlow 与手工方法和 ADAS 的实验对比。（图片来源：[Zhang et al. 2025](https://arxiv.org/abs/2410.10762)）*

### §77

**EN**

### Self-Improving Harness

**ZH**

### 自我改进的 Harness

### §78

**EN**

Either context engineering or workflow design is only one part of a harness. We need to search through the entire design space and optimize context-management logic, workflow, permissions, and many other harness components together. As we have seen in work like Meta-Harness, ADAS, and AFlow, **✨code✨** is a **universal language** for defining programs and systems. In simple words, a harness is code that programs how prompts, tool calls, subagents, control flow, memory, and workflow logic work together. If an LLM can optimize the code that executes agents, it can access a *much larger design space* than hand-written prompts.

**ZH**

无论是上下文工程还是工作流设计，都只是 harness 的一部分。我们需要搜索整个设计空间，并共同优化上下文管理逻辑、工作流、权限和许多其他 harness 组件。正如我们在 Meta-Harness、ADAS 和 AFlow 等工作中看到的那样，**✨代码✨**是定义程序与系统的**通用语言**。简单来说，harness 就是代码，它规定提示词、工具调用、子 Agent、控制流、记忆和工作流逻辑如何协同工作。如果 LLM 能优化执行 Agent 的代码，它就能访问一个比手写提示词大得多的设计空间。

### §79

**EN**

**Self-Taught Optimizer** (STOP; [Zelikman et al. 2023](https://arxiv.org/abs/2310.02304)) is one of the early examples of recursive scaffolding improvement. A seed improver $I_0$ at step $t=0$ takes an initial solution $s$, a utility function $u$, and a black-box language model $M$, and returns an improved solution $s’$, that is, $s’ = I(u, s; M)$. The goal of STOP is not directly to improve $s$ but *to improve the improver $I$ itself*.

**ZH**

**Self-Taught Optimizer**（STOP；[Zelikman et al. 2023](https://arxiv.org/abs/2310.02304)）是递归式 scaffolding 改进的早期例子之一。在 $t=0$ 时刻，一个种子改进器 $I_0$ 接收初始解 $s$、效用函数 $u$ 和黑盒语言模型 $M$，并返回一个改进后的解 $s’$，也就是 $s’ = I(u, s; M)$。STOP 的目标不是直接改进 $s$，而是*改进改进器 $I$ 本身*。

### §80

**EN**

First, let’s define the meta-utility as the average utility of a given improver function $I$ over a collection of downstream tasks $\mathcal{D}$:

**ZH**

首先，我们把元效用定义为：给定改进器函数 $I$ 在一组下游任务 $\mathcal{D}$ 上的平均效用：

### §81

**EN = ZH**

$$
\hat{u}(I) \triangleq \frac{1}{\vert\mathcal{D}\vert}\mathbb{E}_{(u,s)\sim \mathcal{D}}[u(I(u,s; M))]
$$

### §82

**EN**

Because improving the improver function is an optimization problem itself, we can recursively get a new version of $I_t$ based on $I_{t-1}$’s performance measured by meta-utility via a self-improvement update:

**ZH**

因为改进改进器函数本身也是一个优化问题，所以我们可以基于 $I_{t-1}$ 的表现（由元效用衡量），通过自我改进更新递归得到新版本 $I_t$：

### §83

**EN = ZH**

$$
I_t=I_{t-1}(\hat{u},I_{t-1};M)
$$

### §84

**EN**

![Algorithm of Self-Taught Optimizer (STOP). (Image source: Zelikman et al. 2023 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-STOP-algo.png)

**ZH**

![Self-Taught Optimizer（STOP）算法。（图片来源：Zelikman et al. 2023）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-STOP-algo.png)

### §85

**EN**

*Algorithm of Self-Taught Optimizer (STOP). (Image source: [Zelikman et al. 2023](https://arxiv.org/abs/2310.02304))*

**ZH**

*Self-Taught Optimizer（STOP）算法。（图片来源：[Zelikman et al. 2023](https://arxiv.org/abs/2310.02304)）*

### §86

**EN**

In Zelikman et al. (2023)’s experiments, the improved improver discovered various strategies, such as genetic algorithms, decomposing and improving parts, multi-armed prompt bandits, simulated annealing, varying temperature, and beam/tree search. This is analogous to how a harness workflow can be represented as an object for optimization.

**ZH**

在 Zelikman et al.（2023）的实验中，改进后的改进器发现了多种策略，例如遗传算法、分解并改进局部、多臂提示词老虎机、模拟退火、改变温度，以及 beam/tree search。这类似于把 harness 工作流表示为一个可优化对象。

### §87

**EN**

![Examples of self-improvement strategies discovered by STOP. (Image source: Zelikman et al. 2023 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-STOP-patterns.png)

**ZH**

![STOP 发现的自我改进策略示例。（图片来源：Zelikman et al. 2023）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-STOP-patterns.png)

### §88

**EN**

*Examples of self-improvement strategies discovered by STOP. (Image source: [Zelikman et al. 2023](https://arxiv.org/abs/2310.02304))*

**ZH**

*STOP 发现的自我改进策略示例。（图片来源：[Zelikman et al. 2023](https://arxiv.org/abs/2310.02304)）*

### §89

**EN**

A *cautionary* result in their findings is that STOP improved mean downstream performance across iterations with GPT-4 but degraded with weaker models like GPT-3.5 and Mixtral. Recursive structure alone is not enough. The base model must be *capable enough* to improve the mechanism. This implies that harness improvement enables better deployment of the model but intelligence is still the core.

**ZH**

他们的发现中有一个*警示性*结果：STOP 在使用 GPT-4 时，跨迭代提升了下游平均表现；但在 GPT-3.5 和 Mixtral 等较弱模型上，表现反而下降。递归结构本身并不够。基础模型必须*足够有能力*，才能改进机制。这说明 harness 改进可以让模型部署得更好，但智能仍然是核心。

### §90

**EN**

A more recent work, **Self-Harness** ([Zhang et al. 2026](https://arxiv.org/abs/2606.09498)), relies on LLM agents to improve their own harness via a propose-evaluate-accept loop.

**ZH**

更新的一项工作 **Self-Harness**（[Zhang et al. 2026](https://arxiv.org/abs/2606.09498)）依赖 LLM Agent 通过“提出-评估-接受”循环改进自己的 harness。

### §91

**EN**

![Self-Harness uses a loop of weakness mining, bounded harness proposal, and validation to update a harness. (Image source: Zhang et al. 2026 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-self-harness.png)

**ZH**

![Self-Harness 使用弱点挖掘、有边界的 harness 提案和验证组成的循环来更新 harness。（图片来源：Zhang et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-self-harness.png)

### §92

**EN**

*Self-Harness uses a loop of weakness mining, bounded harness proposal, and validation to update a harness. (Image source: [Zhang et al. 2026](https://arxiv.org/abs/2606.09498))*

**ZH**

*Self-Harness 使用弱点挖掘、有边界的 harness 提案和验证组成的循环来更新 harness。（图片来源：[Zhang et al. 2026](https://arxiv.org/abs/2606.09498)）*

### §93

**EN**

The loop in Self-Harness has three stages:

**ZH**

Self-Harness 的循环包含三个阶段：

### §94

**EN**

1. *Weakness mining*: cluster failures into verifier-grounded failure patterns.
   - The current harness $h_t$ is used to evaluate on tasks and execution traces are collected for analysis.
   - Note that two runs can share the same verifier outcome in the error logs on the surface, such as timeout or missing artifact, while having different causal mechanisms. Therefore we need a failure record of rich information, containing the terminal verifier-level cause, the causal status of the relevant agent behavior, and the abstract agent mechanism exposed by the trace, to uncover the root causes.
2. *Harness proposal*: propose bounded harness edits based on mined failure patterns.
   - The same model is invoked under $h_t$ as a proposer.
   - The model is provided with a bounded proposal context: (1) the editable surfaces of the current harness, (2) the verifier-grounded failure patterns from the evaluation system, (3) records of passing behaviors that should be preserved, and (4) summaries of previously attempted edits.
   - Harness edits should prefer recurrent error patterns that are addressable (e.g. not task-specific difficulty) and can be resolved by narrow changes.
   - Harness edit candidates should be distinct and diverse.
3. *Proposal validation*: validate and merge qualified edits to create a new harness $h_{t+1}$.
   - Candidate edits are evaluated by regression tests on held-in $D_\text{in}$ (for testing whether the weakness is resolved) and held-out $D_\text{out}$ (for checking whether other unknown issues were introduced) splits.
   - Candidates are accepted only if they have no regression on both held-in and held-out data.
   - Accepted candidates are merged to update the harness to $h_{t+1}$, while rejected candidates are logged without changing the active harness.

**ZH**

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

### §95

**EN**

When running `MiniMax M2.5`, `Qwen3.5-35B-A3B`, and `GLM-5` on Terminal-Bench-2, Self-Harness was shown to learn model-specific harness instructions that target at different weaknesses of different base models and improve held-out pass rates.

**ZH**

在 Terminal-Bench-2 上运行 `MiniMax M2.5`、`Qwen3.5-35B-A3B` 和 `GLM-5` 时，Self-Harness 被证明能够学习针对不同基础模型弱点的模型特定 harness 指令，并提升 held-out pass rate。

### §96

**EN**

Self-harness type of work does raise my concerns that if a program is allowed to edit the OS system, abstraction boundaries are broken. The editable surface needs to be properly designed and the permission control and security layers need to live outside this loop. All the challenges around [reward hacking](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/) still remain.

**ZH**

Self-Harness 这类工作确实让我担心：如果一个程序被允许编辑操作系统，抽象边界就会被打破。可编辑表面需要被妥善设计，权限控制和安全层需要位于这个循环之外。围绕[奖励黑客](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)的所有挑战仍然存在。

### §97

**EN**

### Evolutionary Search

**ZH**

### 进化式搜索

### §98

**EN**

Evolutionary search is an optimization method inspired by natural selection (see my old post on [evolutionary algorithm](https://lilianweng.github.io/posts/2019-09-05-evolution-strategies/)). It evolves a population of solutions by mutating them and only keeping those with high “fitness” in the crowd. Evolutionary search comes in handy when (1) the search space is extensive or weirdly shaped; and (2) it is hard to optimize directly with gradients but easy to evaluate solutions. Harness search seems to be a good fit here.

**ZH**

进化式搜索是一种受自然选择启发的优化方法（参见我以前关于[进化算法](https://lilianweng.github.io/posts/2019-09-05-evolution-strategies/)的文章）。它通过对一组解进行变异，并只保留群体中“适应度”高的解，来演化一个解的种群。当（1）搜索空间非常大或形状奇特；并且（2）很难直接用梯度优化，但评估解却很容易时，进化式搜索会很有用。Harness 搜索看起来很适合这种方法。

### §99

**EN**

Evolutionary search has been used in prompt engineering in the past studies. **Promptbreeder** ([Fernando et al. 2023](https://arxiv.org/abs/2309.16797)) optimizes task-specific prompts through a rich set of mutation operations, and interestingly the mutation prompts (i.e. instructions to an LLM to mutate a task prompt) are themselves also improved through evolution. **GEPA** ([Agrawal et al. 2025](https://arxiv.org/abs/2507.19457)) combines [reflection](https://lilianweng.github.io/posts/2023-06-23-agent/#self-reflection)-based prompting with evolutionary search and uses natural language reflection over trajectories of trial and error to propose prompt updates.

**ZH**

过去研究中，进化式搜索已经被用于提示词工程。**Promptbreeder**（[Fernando et al. 2023](https://arxiv.org/abs/2309.16797)）通过一组丰富的变异操作优化任务特定提示词；有趣的是，变异提示词（即指示 LLM 变异任务提示词的指令）本身也会通过进化被改进。**GEPA**（[Agrawal et al. 2025](https://arxiv.org/abs/2507.19457)）把基于[反思](https://lilianweng.github.io/posts/2023-06-23-agent/#self-reflection)的提示词方法与进化式搜索结合起来，并使用对试错轨迹的自然语言反思来提出提示词更新。

### §100

**EN**

[Novikov et al. (2025)](https://arxiv.org/abs/2506.13131) introduced **AlphaEvolve** as a coding-agent evolutionary search system, which stores a pool of candidate programs and prompts frozen LLMs to generate diffs for improvement. As the system repeatedly evaluates child programs and keeps successful ones, it discovers better solutions in time.

**ZH**

[Novikov et al.（2025）](https://arxiv.org/abs/2506.13131)提出了 **AlphaEvolve**，这是一个编码 Agent 进化式搜索系统。它保存一个候选程序池，并提示被冻结的 LLM 生成用于改进的 diff。随着系统反复评估子程序并保留成功者，它会随着时间发现更好的解。

### §101

**EN**

![How AlphaEvolve works. (Image source: Novikov et al. 2025 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-alphaevolve.png)

**ZH**

![AlphaEvolve 的工作方式。（图片来源：Novikov et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-alphaevolve.png)

### §102

**EN**

*How AlphaEvolve works. (Image source: [Novikov et al. 2025](https://arxiv.org/abs/2506.13131))*

**ZH**

*AlphaEvolve 的工作方式。（图片来源：[Novikov et al. 2025](https://arxiv.org/abs/2506.13131)）*

### §103

**EN**

A few details matter in the design of AlphaEvolve:

**ZH**

AlphaEvolve 设计中有几个细节很重要：

### §104

**EN**

- The prompt includes parent programs, results, instructions, and sometimes meta information.
- The coding agent has access to the full repo, but code regions for improvement are explicitly marked with `# EVOLVE-BLOCK-START` and `# EVOLVE-BLOCK-END`.
- Meta-prompt co-evolves with instructions and context as suggested by LLM, in a similar way as how we evolve solution programs.

**ZH**

- 提示词包含父程序、结果、指令，有时还包含元信息。
- 编码 Agent 可以访问完整仓库，但用于改进的代码区域会用 `# EVOLVE-BLOCK-START` 和 `# EVOLVE-BLOCK-END` 明确标记。
- 元提示词会按照 LLM 的建议，与指令和上下文共同演化，类似于我们演化解程序的方式。

### §105

**EN**

Ablations show the evolution procedure, context in prompts, meta-prompts, full-file evolution and the use of stronger LLMs.

**ZH**

消融实验展示了进化流程、提示词中的上下文、元提示词、全文件演化以及使用更强 LLM 的价值。

### §106

**EN**

![Ablations show the value of everal designs in AlphaEvolve. (Image source: Novikov et al. 2025 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-alphaevolve-plot.png)

**ZH**

![消融实验展示了 AlphaEvolve 中多个设计的价值。（图片来源：Novikov et al. 2025）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-alphaevolve-plot.png)

### §107

**EN**

*Ablations show the value of everal designs in AlphaEvolve. (Image source: [Novikov et al. 2025](https://arxiv.org/abs/2506.13131))*

**ZH**

*消融实验展示了 AlphaEvolve 中多个设计的价值。（图片来源：[Novikov et al. 2025](https://arxiv.org/abs/2506.13131)）*

### §108

**EN**

Recent variants such as **ThetaEvolve** ([Wang et al. 2025](https://arxiv.org/abs/2511.23473)) combines evolutionary search with RL and in-context learning. **ShinkaEvolve** ([Lange et al. 2025](https://arxiv.org/abs/2509.19349)), on the other hand, introduced three new components to improve LLM sampling efficiency:

**ZH**

最近的变体，例如 **ThetaEvolve**（[Wang et al. 2025](https://arxiv.org/abs/2511.23473)），把进化式搜索与 RL 和上下文学习结合起来。另一方面，**ShinkaEvolve**（[Lange et al. 2025](https://arxiv.org/abs/2509.19349)）引入了三个新组件，用于提高 LLM 采样效率：

### §109

**EN**

- More sample-efficient exploration by designing parent sampling to balance performance rank and offspring count.
- Code-novelty rejection sampling by discarding candidates that are too similar to the existing population based on embedding-based cosine similarity.
- Identifying good patterns in successful solutions in a meta-scratchpad to guide future mutation.

**ZH**

- 通过设计父代采样，在性能排名和后代数量之间取得平衡，从而实现更高采样效率的探索。
- 基于 embedding 余弦相似度，丢弃与现有种群过于相似的候选，从而进行代码新颖性拒绝采样。
- 在元 scratchpad 中识别成功解里的好模式，以指导未来变异。

### §110

**EN**

Unlike the methods above, which focus on solution improvement, **Darwin Gödel Machine** (DGM; [Zhang et al. 2025](https://arxiv.org/abs/2505.22954)) explicitly targets the evolution of an editable harness-code repository with an LLM-based coding agent. Precisely, this agent is allowed to modify its own harness. A follow-up work on Hyperagents ([Zhang et al. 2026](https://arxiv.org/abs/2603.19461)) introduced a meta-agent to control how to modify existing task agents to create new ones.

**ZH**

不同于上述聚焦于解改进的方法，**Darwin Gödel Machine**（DGM；[Zhang et al. 2025](https://arxiv.org/abs/2505.22954)）明确以一个可编辑的 harness-code 仓库的演化为目标，并使用基于 LLM 的编码 Agent。准确地说，这个 Agent 被允许修改自己的 harness。后续关于 Hyperagents 的工作（[Zhang et al. 2026](https://arxiv.org/abs/2603.19461)）引入了一个元 Agent，用于控制如何修改已有任务 Agent 来创建新 Agent。

### §111

**EN**

1. Start with one coding agent in the pool.
2. In each iteration, pick one parent with a probability proportional to its performance and inversely to the number of children it has, to modify and branch off to produce new agents.
3. The selected parent agent examines its own benchmark evaluation log and then proposes improvements to its own harness codebase to generate a new version of the coding agent. Code editing is implemented with two basic tools: (1) bash (args: `<bash_command>`) and (2) editor (args: `view/create/edit <file_path>`).
4. New coding agents are evaluated, and only those with sufficiently high performance are added back into the pool.
5. Repeat steps 2-4 until some stop criteria hit.

**ZH**

1. 从池中的一个编码 Agent 开始。
2. 在每轮迭代中，根据性能成比例、并与子代数量成反比的概率选择一个父代，对其进行修改并分叉，产生新 Agent。
3. 被选中的父代 Agent 检查自己的 benchmark 评估日志，然后提出对自身 harness 代码库的改进，生成一个新版本的编码 Agent。代码编辑通过两个基本工具实现：（1）bash（参数：`<bash_command>`）和（2）editor（参数：`view/create/edit <file_path>`）。
4. 新编码 Agent 会被评估，只有性能足够高者会被加入池中。
5. 重复步骤 2-4，直到达到某些停止条件。

### §112

**EN**

DGM is harness evolution under a fixed model. In experiments with `Claude 3.5 Sonnet` as the base LLM and simple initial harness configs, the DGM-discovered agents are comparable to or outperform handcrafted agents on SWE-bench Verified (20% to 50%) and Polyglot (14.2% to 30.7%).

**ZH**

DGM 是固定模型下的 harness 演化。在以 `Claude 3.5 Sonnet` 作为基础 LLM、初始 harness 配置较简单的实验中，DGM 发现的 Agent 在 SWE-bench Verified（20% 到 50%）和 Polyglot（14.2% 到 30.7%）上可与手工 Agent 相当，甚至超过它们。

### §113

**EN**

This family of methods works well when candidate solutions are automatically evaluable and candidate fitness is easy to quantify, such as matrix multiplication, GPU kernel optimization, algorithm contests, datacenter scheduling. It struggles with domains where evaluation is slow, ambiguous, or mostly heuristic-based. The compute efficiency and effectiveness of evolution are also concerns.

**ZH**

当候选解可以自动评估、并且候选适应度容易量化时，这类方法很有效，例如矩阵乘法、GPU kernel 优化、算法竞赛、数据中心调度。它在评估缓慢、模糊或主要依赖启发式的领域会遇到困难。进化的计算效率和有效性也令人担忧。

### §114

**EN**

### Joint Optimization with Model Weights

**ZH**

### 与模型权重的联合优化

### §115

**EN**

Harness evolution changes the non-parametric system around the model. To enable full self-improvement, the model can totally be allowed to update its own weights at the same time. The weight update can be implemented via improvements in the model training pipeline or continual learning at test time. The topic of continual learning is worthy of its own post in the future.

**ZH**

Harness 演化改变的是模型周围的非参数系统。为了实现完整自我改进，完全可以允许模型同时更新自己的权重。权重更新可以通过改进模型训练流水线，或通过测试时持续学习来实现。持续学习这个主题本身值得未来单独写一篇文章。

### §116

**EN**

**SIA** ([Hebbar et al. 2026](https://arxiv.org/abs/2605.27276)) is an early attempt to combine harness improvement and model-parameter updates in the same optimization loop, with three components in the design:

**ZH**

**SIA**（[Hebbar et al. 2026](https://arxiv.org/abs/2605.27276)）是把 harness 改进和模型参数更新结合到同一个优化循环中的早期尝试。其设计包含三个组件：

### §117

**EN**

- *Meta-Agent*: proposes the initial harness.
- *Task-Specific Agent*: executes the task.
- *Feedback-Agent*: chooses whether to update the harness or the model weights based on recent trajectories.

**ZH**

- *Meta-Agent*：提出初始 harness。
- *Task-Specific Agent*：执行任务。
- *Feedback-Agent*：基于近期轨迹选择更新 harness 还是模型权重。

### §118

**EN**

![The Feedback-Agent in SIA decides the next iteration type. (Image source: Hebbar et al. 2026 )](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-SIA.png)

**ZH**

![SIA 中的 Feedback-Agent 决定下一次迭代类型。（图片来源：Hebbar et al. 2026）](imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-SIA.png)

### §119

**EN**

*The Feedback-Agent in SIA decides the next iteration type. (Image source: [Hebbar et al. 2026](https://arxiv.org/abs/2605.27276))*

**ZH**

*SIA 中的 Feedback-Agent 决定下一次迭代类型。（图片来源：[Hebbar et al. 2026](https://arxiv.org/abs/2605.27276)）*

### §120

**EN**

There are a few confounding choices in SIA’s experiments that make the results hard to interpret. For example, the task-specific agent is much weaker than the models used for the Meta-Agent and Feedback-Agent (`gpt-oss-120b` vs `Claude Sonnet 4.6`), and the baselines are too weak to cross-reference cleanly against related methods. I would consider the direction interesting, but the evidence provisional. Yet many challenges, such as training stability and Goodhart effect, still remain open.

**ZH**

SIA 的实验中有一些混杂选择，使结果较难解释。例如，任务特定 Agent 远弱于 Meta-Agent 和 Feedback-Agent 所用模型（`gpt-oss-120b` vs `Claude Sonnet 4.6`），而且 baseline 太弱，无法与相关方法清晰交叉参照。我会认为这个方向很有趣，但证据仍是暂时性的。与此同时，训练稳定性和 Goodhart 效应等许多挑战仍然开放。

---

### §121

**EN**

## Future Challenges

**ZH**

## 未来挑战

### §122

**EN**

The AI Scientist line of work is a strong demonstration that an expert-designed harness can coordinate a large portion of auto-research loop, experimented in the form of writing research papers. But paper production is not identical to scientific discovery. A system can write a plausible manuscript while still having fabricated citations, implementation drift, or weak experimental results.

**ZH**

AI Scientist 这一类工作有力地展示：由专家设计的 harness 可以协调 auto-research 循环的很大一部分，并以撰写研究论文的形式进行实验。但论文生产并不等同于科学发现。一个系统可以写出看似合理的论文，同时仍然存在伪造引用、实现漂移或实验结果薄弱的问题。

### §123

**EN**

[Trehan & Chopra (2026)](https://arxiv.org/abs/2601.03315) tested whether LLMs can go from a research idea to a paper with minimal scaffolding and basic tools (i.e., `read_file`, `write_file`, `llm_search`, `list_files`). Each idea had a dedicated workspace where agents could generate and read documents as part of context. They experimented in three domains (world models, multi-agent RL, AI safety & alignment), with each domain containing 45-50 high-quality seed documents to inspire new ideas. Only four ideas were selected by human experts to run through the full pipeline, and only one was fully executed into a paper. They observed six recurring failure modes in the experiments:

**ZH**

[Trehan & Chopra（2026）](https://arxiv.org/abs/2601.03315)测试了 LLM 是否能在最少 scaffolding 和基础工具（即 `read_file`、`write_file`、`llm_search`、`list_files`）支持下，从一个研究想法走到一篇论文。每个想法都有一个专用工作区，Agent 可以在其中生成和读取文档，并将其作为上下文的一部分。他们在三个领域进行了实验（世界模型、多 Agent RL、AI 安全与对齐），每个领域包含 45-50 篇高质量种子文档，用于启发新想法。只有四个想法被人类专家选中进入完整流水线，只有一个被完整执行成论文。他们在实验中观察到六种反复出现的失败模式：

### §124

**EN**

- *Bias toward training-data defaults*: use old libraries, stale commands, standard formats, or assumptions not grounded in the actual repository or dataset.
- *Implementation drift under execution pressure*: when implementation becomes technically complex, the model may move toward a common simpler solution rather than the proposed method.
- *Memory and context degradation*: long-horizon projects lose critical details unless logs are written as persistent artifacts.
- *Over-optimism*: the model declares success despite noisy or failed experiments, similarly observed as “p-hacking and eureka-ing” pattern by [Bubeck et al. (2025)](https://arxiv.org/abs/2511.16072) where models can introduce “numerical duct tape” and declare victory when signals are still noise.
- *Insufficient domain intelligence*: the model lacks tacit craft knowledge, e.g. predicting implementation complexity, judging whether an experimental result is plausible, or knowing which baselines matter.
- *Weak scientific taste*: experiments may be executable but fail to answer the right question.

**ZH**

- *偏向训练数据默认值*：使用旧库、过时命令、标准格式，或采用没有扎根于实际仓库或数据集的假设。
- *执行压力下的实现漂移*：当实现变得技术上复杂时，模型可能转向常见的更简单解，而不是所提出的方法。
- *记忆和上下文退化*：长周期项目会丢失关键细节，除非日志被写成持久 artifact。
- *过度乐观*：尽管实验有噪声或失败，模型仍宣称成功；[Bubeck et al.（2025）](https://arxiv.org/abs/2511.16072)也观察到类似的“p-hacking and eureka-ing”模式，即模型可以引入“数值胶带”，并在信号仍然是噪声时宣布胜利。
- *领域智能不足*：模型缺乏隐性技艺知识，例如预测实现复杂度、判断实验结果是否可信，或知道哪些 baseline 重要。
- *科学品味薄弱*：实验也许可以执行，但未能回答正确的问题。

### §125

**EN**

Toward full RSI, researchers have made real progress, but several bottlenecks remain.

**ZH**

在通向完整 RSI 的道路上，研究者已经取得了真实进展，但仍有几个瓶颈。

### §126

**EN**

**1. Weak and fuzzy evaluators.** Many research claims do not have a fast and precise verifier, and the same is true for many real-world tasks. Current self-improvement loops work best for tasks when evaluation metrics are measurable and objective, similar as [how RL works](https://lilianweng.github.io/posts/2018-02-19-rl-overview/).

**ZH**

**1. 弱而模糊的评估器。** 许多研究 claim 没有快速而精确的验证器，许多真实世界任务也是如此。当前自我改进循环最适合那些评估指标可测量、客观的任务，类似于 [RL 的工作方式](https://lilianweng.github.io/posts/2018-02-19-rl-overview/)。

### §127

**EN**

Research taste, novelty, and long-term scientific value are much harder to measure. For example, research taste often mixes problem framing, experimental design, and judgment about which surprising results are worth pursuing and which failure cases are worth retries.

**ZH**

研究品味、新颖性和长期科学价值要难衡量得多。例如，研究品味往往混合了问题构造、实验设计，以及对哪些意外结果值得追求、哪些失败案例值得重试的判断。

### §128

**EN**

**2. Context and memory lifecycle.** Memory grows as AI agents become more autonomous and independent. A useful harness needs to manage context and memory to complement existing limitation in long-context generation while still maximizing the success of long-horizon tasks. Since humans are able to maintain memory through our life time, I see an anoloy here that [context engineering](#context-engineering) will and should become a core part of intelligence, rather than staying in the software system layer.

**ZH**

**2. 上下文和记忆生命周期。** 随着 AI Agent 变得更自主、更独立，记忆会不断增长。一个有用的 harness 需要管理上下文和记忆，以弥补现有长上下文生成的限制，同时最大化长周期任务的成功率。既然人类能够在一生中维持记忆，我在这里看到一种类比：[上下文工程](#上下文工程)会、也应该成为智能的核心部分，而不只是停留在软件系统层。

### §129

**EN**

**3. Negative results.** Researchers are incentivized to publish successful results and thus literature is biased toward successes. LLMs trained on a vast amount of data (mostly human created, at least for now, lol) may be bad at deciding when to abandon a hypothesis, report a negative result, or even acknowledge a failure due to the imablance of success vs failure cases in data. A research harness should make failed attempts easy to preserve, as learning from failure is the best way to trim down the task search space.

**ZH**

**3. 负结果。** 研究者受到激励去发表成功结果，因此文献会偏向成功案例。LLM 基于海量数据训练（至少目前主要由人类创造，lol），可能不擅长判断何时应放弃一个假设、报告负结果，甚至承认失败，因为数据中成功案例和失败案例不平衡。研究 harness 应该让失败尝试易于保存，因为从失败中学习是缩小任务搜索空间的最佳方式。

### §130

**EN**

**4. Diversity collapse.** Evolutionary and RL loops tend to exploit known high-reward patterns. We need [mechanisms](https://lilianweng.github.io/posts/2020-06-07-exploration-drl/) to prevent the population from collapsing into variants of the same solution. This is especially critical for open-ended research, where the best path may initially look worse under the current evaluator.

**ZH**

**4. 多样性坍塌。** 进化式和 RL 循环往往会利用已知高奖励模式。我们需要[机制](https://lilianweng.github.io/posts/2020-06-07-exploration-drl/)来防止种群坍塌成同一种解的变体。这对开放式研究尤其关键，因为最佳路径在当前评估器下最初可能看起来更差。

### §131

**EN**

**5. [Reward hacking](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/).** A self-improvement loop optimizes whatever signal it is given. If the reward comes from unit tests, the agent may overfit to tests; if it comes from a judge model, it may learn reward hacking tricks specific to this judge; if it comes from benchmark scores, it may exploit benchmark artifacts.

**ZH**

**5. [奖励黑客](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/)。** 自我改进循环会优化它获得的任何信号。如果奖励来自单元测试，Agent 可能过拟合测试；如果奖励来自 judge model，它可能学会针对这个 judge 的奖励黑客技巧；如果奖励来自 benchmark 分数，它可能利用 benchmark artifacts。

### §132

**EN**

The evaluator and permission control should likely sit outside the loop that evolves harness, with held-out tests, trace audits, and human review at decision points that matter—how much oversight can be scaled up and automated remains an open research area.

**ZH**

评估器和权限控制很可能应该位于演化 harness 的循环之外，并在重要决策点配合 held-out tests、trace audits 和人类 review。监督可以在多大程度上扩展和自动化，仍然是开放研究方向。

### §133

**EN**

**6. Long-term success.** An extrinsic loop of optimization works on rewards outside of individual rollouts that we can simulate in training sandbox.

**ZH**

**6. 长期成功。** 外在优化循环依赖单个 rollout 之外的奖励，而这些 rollout 可以在训练沙箱中模拟。

### §134

**EN**

Take coding agent as an example. Coding agents have already increased daily productivity in software engineering, but many optimization goals are still too short-term. It can often complete the task at hand, but less obvious how it should protect the long-term health of a repo collectively maintained by hundreds or thousands of engineers. Standard sandbox-based RLVR-style training rarely captures maintainability, ownership boundaries, migration cost, backwards compatibility, or future debugging burden.

**ZH**

以编码 Agent 为例。编码 Agent 已经提高了软件工程中的日常生产力，但许多优化目标仍然过于短期。它往往能完成手头任务，但不那么明显的是，它应该如何保护一个由数百或数千名工程师共同维护的仓库的长期健康。标准的基于沙箱的 RLVR 风格训练，很少能捕捉可维护性、所有权边界、迁移成本、向后兼容性或未来调试负担。

### §135

**EN**

**7. The role of humans.** Humans should move up the stack, not be removed from the loop, meaning that human should provide oversight at the right time, at the right abstraction level and our system design should consider when and how to set up such touch points.

**ZH**

**7. 人类的角色。** 人类应当向栈的上层移动，而不是被移出循环，这意味着人类应在正确的时间、正确的抽象层级提供监督，并且我们的系统设计应考虑何时以及如何设立此类接触点。

### §136

**EN**

Many challenges listed above need human’s feedback and steering. After all, we are building the technology for better future of humanity, not other way around.

**ZH**

上面列出的许多挑战都需要人类的反馈与引导。毕竟，我们是在为人类更好的未来构建技术，而不是反过来。

---

### §137

**EN**

## Citation

**ZH**

## 引用

### §138

**EN**

Please cite this work as:

**ZH**

请按如下方式引用本文：

### §139

**EN**

> Weng, Lilian. “Harness Engineering for Self-Improvement”. Lil’Log (Jul 2026). https://lilianweng.github.io/posts/2026-07-04-harness/

**ZH**

> Weng, Lilian. “Harness Engineering for Self-Improvement”. Lil’Log (Jul 2026). https://lilianweng.github.io/posts/2026-07-04-harness/

### §140

**EN**

Or use the BibTeX citation:

**ZH**

或者使用 BibTeX 引用：

### §141

**EN**

```
@article{weng2026harness,
  title = {Harness Engineering for Self-Improvement},
  author = {Weng, Lilian},
  journal = {lilianweng.github.io},
  year = {2026},
  month = {July},
  url = "https://lilianweng.github.io/posts/2026-07-04-harness/"
}
```

**ZH**

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

---

### §142

**EN**

## Appendix: Some useful benchmarks

**ZH**

## 附录：一些有用的 benchmark

### §143

**EN**

- **[PaperBench](https://arxiv.org/abs/2504.01848)**: replicate 20 ICML 2024 Spotlight and Oral papers from scratch, including understanding paper contributions, developing a codebase, and successfully executing experiments.
  - Each replication task is decomposed into smaller, individually gradable tasks.
  - 8,316 rubrics in total, co-developed with the paper authors.
  - The best model at the time (`Claude 3.5 Sonnet`, ~21%) does not outperform ML PhDs.
  - Includes PaperBench, PaperBench Code-Dev (a lighter version), and JudgeEval.
- **[CORE-Bench](https://arxiv.org/abs/2409.11363)**: evaluate computational reproducibility of published research.
  - 270 tasks based on 90 scientific papers across computer science, social science, and medicine.
  - Tasks involve reproducing results from provided code and data.
  - Includes multiple difficulty levels and both language-only and vision-language tasks.
  - The best reported agent at the time (`GPT-4o` and `GPT-4o-mini`) achieved only 21% accuracy on the hardest task.
- **[ScienceAgentBench](https://arxiv.org/abs/2410.05080)**: evaluate LLM agents for data-driven scientific discovery.
  - Extracts 102 tasks from 44 peer-reviewed publications in four disciplines (math, chemistry, biology, geography).
  - Covers basic data-science tasks in these domains: data processing, model development, data analysis, and information visualization.
- **[RE-Bench](https://arxiv.org/abs/2411.15114)**: evaluate frontier AI agents on realistic ML research-engineering envs against human experts.
  - 7 challenging, open-ended ML research-engineering environments.
  - Each environment = (scoring function, starting solution, reference solution); each can be run with 8 or fewer H100 GPUs.
  - Examples: optimize a kernel, run a scaling-law experiment, fix an embedding, fine-tune GPT-2 for QA, etc.
  - Includes data from 71 eight-hour attempts by 61 distinct human experts.
  - Human experts achieved non-zero score in 82% of 8-hour attempts; 24% matched or exceeded strong reference solutions.
  - Best AI agents scored 4× higher than humans at a 2-hour budget, but humans had better returns to longer budgets and exceeded agents at 8-hour and 32-hour settings.
- **[MLE-bench](https://arxiv.org/abs/2410.07095)**: evaluate ML engineering agents on offline Kaggle competitions.
  - Contains 75 ML-engineering competitions curated from Kaggle.
  - Tests training models, preparing datasets, running experiments, and submitting predictions to grading scripts.
  - Uses Kaggle public leaderboards as human baselines.
  - Best setup in the paper, `o1-preview` with AIDE scaffolding, reached at least Kaggle bronze-medal level in 16.9% of competitions.
  - Includes resource-scaling and contamination analyses.
- **[KernelBench](https://arxiv.org/abs/2502.10517)**: evaluate correctness and speed for generated GPU kernels.
  - 250 PyTorch tasks to evaluate whether LLM can write fast and correct kernels.
  - The evaluation metric fast\_p = the percentage of generated kernels that are correct and faster than baseline.

**ZH**

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

---

### §144

**EN**

## References

**ZH**

## 参考文献

### §145

**EN = ZH**

[1] Good, I. J. [“Speculations Concerning the First Ultraintelligent Machine.”](https://philpapers.org/rec/GOOSCT) *Advances in Computers*, 6:31–88, 1965.

### §146

**EN = ZH**

[2] Yudkowsky, Eliezer. [“Recursive Self-Improvement.”](https://www.lesswrong.com/posts/JBadX7rwdcRFzGuju/recursive-self-improvement) LessWrong, 2008.

### §147

**EN = ZH**

[3] Choi, et al. [“Anchored Self-Play for Code Repair.”](https://openreview.net/forum?id=lTbBFAoPSA) ICML 2026.

### §148

**EN = ZH**

[4] Zhao, et al. [“Absolute Zero: Reinforced Self-play Reasoning with Zero Data.”](https://arxiv.org/abs/2505.03335) arXiv preprint arXiv:2505.03335, 2025.

### §149

**EN = ZH**

[5] Yuan, et al. [“Self-Rewarding Language Models.”](https://arxiv.org/abs/2401.10020) arXiv preprint arXiv:2401.10020, 2024.

### §150

**EN = ZH**

[6] Chen, et al. [“Self-Play Fine-Tuning Converts Weak Language Models to Strong Language Models.”](https://arxiv.org/abs/2401.01335) ICML 2024.

### §151

**EN = ZH**

[7] Zhang, et al. [“Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models.”](https://arxiv.org/abs/2510.04618) ICLR 2026.

### §152

**EN = ZH**

[8] Ye, et al. [“Meta Context Engineering via Agentic Skill Evolution.”](https://arxiv.org/abs/2601.21557) arXiv preprint arXiv:2601.21557, 2026.

### §153

**EN = ZH**

[9] Lee, et al. [“Meta-Harness: End-to-End Optimization of Model Harnesses.”](https://arxiv.org/abs/2603.28052) arXiv preprint arXiv:2603.28052, 2026.

### §154

**EN = ZH**

[10] Lu, et al. [“Towards end-to-end automation of AI research.”](https://www.nature.com/articles/s41586-026-10265-5) *Nature*, 651:914–919, 2026.

### §155

**EN = ZH**

[11] Meng, et al. [“ScientistOne: Towards Human-Level Autonomous Research via Chain-of-Evidence.”](https://arxiv.org/abs/2605.26340) arXiv preprint arXiv:2605.26340, 2026.

### §156

**EN = ZH**

[12] Kulikov, et al. [“Autodata: An agentic data scientist to create high quality synthetic data.”](https://arxiv.org/abs/2606.25996) arXiv preprint arXiv:2606.25996, 2026.

### §157

**EN = ZH**

[13] Hu, Lu, and Clune. [“Automated Design of Agentic Systems.”](https://arxiv.org/abs/2408.08435) ICLR 2025.

### §158

**EN = ZH**

[14] Madaan, et al. [“Self-Refine: Iterative Refinement with Self-Feedback.”](https://arxiv.org/abs/2303.17651) NeurIPS 2023.

### §159

**EN = ZH**

[15] Zhang, et al. [“AFlow: Automating Agentic Workflow Generation.”](https://arxiv.org/abs/2410.10762) ICLR 2025.

### §160

**EN = ZH**

[16] Zelikman, et al. [“Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation.”](https://arxiv.org/abs/2310.02304) COLM 2024.

### §161

**EN = ZH**

[17] Zhang, et al. [“Self-Harness: Harnesses That Improve Themselves.”](https://arxiv.org/abs/2606.09498) arXiv preprint arXiv:2606.09498, 2026.

### §162

**EN = ZH**

[18] Fernando, et al. [“Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution.”](https://arxiv.org/abs/2309.16797) arXiv preprint arXiv:2309.16797, 2023.

### §163

**EN = ZH**

[19] Agrawal, A. et al. [“GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning.”](https://arxiv.org/abs/2507.19457) arXiv preprint arXiv:2507.19457, 2025.

### §164

**EN = ZH**

[20] Novikov, et al. [“AlphaEvolve: A coding agent for scientific and algorithmic discovery.”](https://arxiv.org/abs/2506.13131) arXiv preprint arXiv:2506.13131, 2025.

### §165

**EN = ZH**

[21] Lange, Imajuku, and Cetin. [“ShinkaEvolve: Towards Open-Ended And Sample-Efficient Program Evolution.”](https://arxiv.org/abs/2509.19349) arXiv preprint arXiv:2509.19349, 2025.

### §166

**EN = ZH**

[22] Wang, et al. [“ThetaEvolve: Test-time Learning on Open Problems.”](https://arxiv.org/abs/2511.23473) arXiv preprint arXiv:2511.23473, 2025.

### §167

**EN = ZH**

[23] Zhang, et al. [“Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents.”](https://arxiv.org/abs/2505.22954) arXiv preprint arXiv:2505.22954, 2025.

### §168

**EN = ZH**

[24] Zhang, et al. [“Hyperagents.”](https://arxiv.org/abs/2603.19461) arXiv preprint arXiv:2603.19461, 2026.

### §169

**EN = ZH**

[25] Yuksekgonul, et al. [“Learning to Discover at Test Time.”](https://arxiv.org/abs/2601.16175) arXiv preprint arXiv:2601.16175, 2026.

### §170

**EN = ZH**

[26] Riaz, et al. [“Epistemic Uncertainty for Test-Time Discovery.”](https://arxiv.org/abs/2605.11328) arXiv preprint arXiv:2605.11328, 2026.

### §171

**EN = ZH**

[27] Hebbar, et al. [“SIA: Self Improving AI with Harness & Weight Updates.”](https://arxiv.org/abs/2605.27276) arXiv preprint arXiv:2605.27276, 2026.

### §172

**EN = ZH**

[28] Trehan and Chopra. [“Why LLMs Aren’t Scientists Yet: Lessons from Four Autonomous Research Attempts.”](https://arxiv.org/abs/2601.03315) arXiv preprint arXiv:2601.03315, 2026.

### §173

**EN = ZH**

[29] Bubeck, et al. [“Early science acceleration experiments with GPT-5.”](https://arxiv.org/abs/2511.16072) arXiv preprint arXiv:2511.16072, 2025.

### §174

**EN = ZH**

[30] Starace, et al. [“PaperBench: Evaluating AI’s Ability to Replicate AI Research.”](https://arxiv.org/abs/2504.01848) ICML 2025.

### §175

**EN = ZH**

[31] Wijk, et al. [“RE-Bench: Evaluating frontier AI R&D capabilities of language model agents against human experts.”](https://arxiv.org/abs/2411.15114) ICML 2025.

### §176

**EN = ZH**

[32] Chan, et al. [“MLE-bench: Evaluating Machine Learning Agents on Machine Learning Engineering.”](https://arxiv.org/abs/2410.07095) arXiv preprint arXiv:2410.07095, 2024.

### §177

**EN = ZH**

[33] Chen, et al. [“ScienceAgentBench: Toward Rigorous Assessment of Language Agents for Data-Driven Scientific Discovery.”](https://arxiv.org/abs/2410.05080) ICLR 2025.

### §178

**EN = ZH**

[34] Siegel, et al. [“CORE-Bench: Fostering the Credibility of Published Research Through a Computational Reproducibility Agent Benchmark.”](https://arxiv.org/abs/2409.11363) TMLR 2024.

### §179

**EN = ZH**

[35] Ouyang, et al. [“KernelBench: Can LLMs Write Efficient GPU Kernels?”](https://arxiv.org/abs/2502.10517) arXiv preprint arXiv:2502.10517, 2025.

---

## 元信息

| 字段 | 值 |
| --- | --- |
| 段落数 | 179 |
| 英文源 | `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md` |
| 中文源 | `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md` |
| 作者 | Lilian Weng |
| 原文 | https://lilianweng.github.io/posts/2026-07-04-harness/ |

