# Harness Engineering：AI 智能体时代的核心工程能力

> 本文是 Harness Engineering 的一手学习资料汇编。所有核心观点均来自 Anthropic 和 OpenAI 的官方工程博客、文档和论文，文末附完整原始出处。

---

2025 年底到 2026 年初，Anthropic 和 OpenAI 几乎同时发布了关于"Harness"的重量级工程文章。两家公司不约而同地指向同一个结论：**AI 智能体的可靠性瓶颈，越来越不是模型本身，而是模型周围的运行环境。**

这个运行环境，就是 Harness。

围绕它形成的工程实践，被 OpenAI 命名为 Harness Engineering——一个正在快速成型的新工程学科。

本文梳理了三篇核心一手资料的关键信息，帮你建立对这个领域的完整认知。

## 什么是 Harness

"Harness"直译是"线束"或"挽具"。在 AI 智能体语境下，它指的是**模型认知与外部现实之间的操作接口**——包括执行沙箱、工具接口、知识层、可观测性、评估体系、安全策略等所有让智能体"落地可用"的基础设施。

一个好的 Harness 做五件事：

1. 给智能体一个受控的世界去行动
2. 让这个世界足够清晰，智能体能理解和推理
3. 记录足够的结构化信息，用于调试和评分
4. 约束危险或低价值的操作
5. 让改进可以通过可重放的评估来衡量

这个定义比"Agent 框架"更有用，因为它涵盖了完整的反馈闭环：编排、运行时、评分、可观测性、安全性。

## 三篇核心一手资料

### 资料一：Anthropic——长时间运行智能体的有效管控框架

**发布时间：** 2025 年 11 月 26 日  
**作者：** Justin Young，Anthropic  
**原文链接：** [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

这是最早系统讨论 Harness 设计的工程博客。它从一个具体任务出发——让 Claude 从零构建一个 claude.ai 的克隆应用——揭示了长时间运行智能体的核心困难。

#### 核心发现

智能体必须在离散的上下文窗口中工作，每次新会话对之前的工作毫无记忆。即使有上下文压缩（compaction）技术，Opus 4.5 在跨窗口场景下仍然无法从一条高层提示完成生产级应用。

两种典型失败模式：

**模式一：一步到位症。** 智能体试图一口气完成所有功能，上下文耗尽时留下半成品代码，下一个会话只能连蒙带猜。

**模式二：过早宣布胜利。** 在项目已有部分功能后，新会话的智能体环顾四周，觉得"看起来差不多了"，直接收工。

#### 解决方案：两阶段智能体架构

Anthropic 从人类工程师的交接实践中获得灵感，设计了两个角色：

**初始化智能体**（仅首次运行）：
- 创建 `init.sh` 启动脚本
- 生成 `claude-progress.txt` 进度日志
- 初始化 Git 仓库
- 展开完整的功能需求清单（JSON 格式，200+ 功能点，全部初始标记为"未通过"）

**编码智能体**（后续每次运行）：
- 先读进度文件和 git 日志，了解现状
- 每次只做一个功能
- 做完就提交代码、更新进度
- 用浏览器自动化工具做端到端测试

关键设计决策：

- 功能清单用 JSON 而非 Markdown，因为模型更不容易随意篡改 JSON
- 编码智能体只能修改 `passes` 字段，提示词中加了强硬约束
- 每次开始先验证已有功能没坏，再写新代码
- 使用 Puppeteer MCP 做真实的浏览器端到端测试

#### 最关键的一句话

> "The key insight here was finding a way for agents to quickly understand the state of work when starting with a fresh context window."

让智能体在全新上下文中快速了解工作状态——这是整个 Harness 设计的出发点。

---

### 资料二：Anthropic——长期运行应用开发的 Harness 设计

**发布时间：** 2026 年 3 月 24 日  
**作者：** Prithvi Rajasekaran，Anthropic Labs  
**原文链接：** [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps)

这是第一篇文章的升级版，从两智能体进化为三智能体架构，引入了 GAN（生成对抗网络）的思想，重点突破了智能体的自我评估瓶颈。

#### 核心发现：自我评估失灵

Prithvi 发现了一个更深层的问题：**智能体在评估自己的工作时，倾向于自信地给出好评——即使质量明显平庸。**

> "Agents tend to respond by confidently praising work—even when quality is obviously mediocre."

对于前端设计这类主观任务，这个问题尤为严重，因为没有类似测试用例的二元验证手段。

还有一个问题是"上下文焦虑"——模型在上下文窗口接近上限时会提前收尾，即使任务远未完成。Sonnet 4.5 上这种现象非常明显，仅靠上下文压缩无法解决，需要彻底的上下文重置。

#### 解决方案：三智能体 + GAN 式反馈环

**规划智能体（Planner）**
- 把 1-4 句话的简短提示，展开为完整的产品规范
- 侧重产品范围和高层技术设计，避免过度指定实现细节
- 主动在产品设计中织入 AI 功能

**生成智能体（Generator）**
- 按 Sprint 推进，每次实现一个功能
- 使用 React + Vite + FastAPI + SQLite/PostgreSQL 技术栈
- 自带 Git 版本控制

**评估智能体（Evaluator）**
- 用 Playwright MCP 像真实用户一样操作应用
- 按照 Sprint 合同逐项验证
- 四个维度评分：产品深度、功能性、视觉设计、代码质量
- 任何一项低于阈值，Sprint 即判定失败

Sprint 合同是生成智能体和评估智能体在实现之前协商的明确协议，定义了"完成"的标准。这弥合了高层产品规范与可验证实现之间的断层。

#### 前端设计：让主观质量可评分

在前端设计实验中，Prithvi 建立了四个评分标准：

1. **设计质量**——是否感觉像一个连贯的整体，而非零件的拼凑
2. **原创性**——是否有自主的创意决策，还是模板默认值
3. **工艺**——排版层次、间距一致性、色彩和谐、对比度
4. **功能性**——用户能否理解界面、找到主要操作、完成任务

有意加权设计质量和原创性（Claude 在工艺和功能性上已经默认表现不错），推动模型冒更大的美学风险。

最惊人的案例：为一家荷兰艺术博物馆设计网站时，前 9 轮迭代产出了一个干净的深色主题页面。第 10 轮，模型推翻了整个方案，重新设计为一个 3D 空间体验——用 CSS 透视渲染的方格地板，墙上自由悬挂的画作，门廊式的房间导航。这种创造性跃迁在单次生成中从未出现过。

#### 实际成本对比

**复古游戏制作器（Opus 4.5）**

| 方案 | 耗时 | 成本 |
|------|------|------|
| 单智能体 | 20 分钟 | $9 |
| 完整 Harness | 6 小时 | $200 |

单智能体版本界面看起来还行，但核心游戏机制全坏了——实体出现在屏幕上，但不响应任何输入。Harness 版本虽贵 20 倍，但能做出真正可玩的游戏。

**数字音频工作站（Opus 4.6，简化版 Harness）**

| 阶段 | 耗时 | 成本 |
|------|------|------|
| 规划 | 4.7 分钟 | $0.46 |
| 构建（Round 1） | 2 小时 7 分钟 | $71.08 |
| QA（Round 1） | 8.8 分钟 | $3.24 |
| 构建（Round 2） | 1 小时 2 分钟 | $36.89 |
| QA（Round 2） | 6.8 分钟 | $3.09 |
| 构建（Round 3） | 10.9 分钟 | $5.88 |
| QA（Round 3） | 9.6 分钟 | $4.06 |
| **总计** | **3 小时 50 分钟** | **$124.70** |

#### 模型升级如何影响 Harness 设计

Opus 4.6 发布后，作者测试了简化 Harness 的可能性：

- Sprint 分解结构对 4.6 来说不再关键（模型原生规划能力更强了）
- 规划智能体和评估智能体仍然有可测量的价值
- 评估智能体的价值取决于任务复杂度——对于在模型能力边界上的任务更有用

#### 最关键的一句话

> "The space of interesting harness combinations doesn't shrink as models improve. Instead, it moves, and the interesting work for AI engineers is to keep finding the next novel combination."

模型越强，Harness 的可能性空间不会缩小——它只会移动。AI 工程师的工作就是不断找到下一个有价值的组合。

---

### 资料三：OpenAI——Harness Engineering

**发布时间：** 2026 年 2 月 11 日  
**作者：** OpenAI  
**原文链接：** [Harness Engineering: Leveraging Codex in an Agent-First World](https://openai.com/index/harness-engineering/)

OpenAI 的这篇文章首次使用了"Harness Engineering"这个术语，并正式将其定义为一个独立的工程学科。与 Anthropic 侧重实验案例不同，OpenAI 更侧重工程方法论和最佳实践。

#### 核心主张

智能体的有效性来自仓库的可读性、结构化文档、工作树本地化的应用实例、以及智能体可见的日志和指标——约束应通过机制而非散文来执行。

#### 关键实践

**仓库可读性是第一等 Harness 原语**

- 一份简短的 `AGENTS.md` 充当导航图
- 结构化的 `docs/` 目录才是真正的"系统记录簿"
- 执行计划（execution plans）应签入仓库
- 自定义 linter 和结构化测试用于机械化地执行不变量

核心洞察：**仓库的形状是运行时的一部分，而非仅仅是文档。** 如果智能体无法在仓库中找到某个事实，那这个事实对智能体来说实际上不存在。

**工作树本地化（Worktree-local）**

智能体应该在独立的工作树中操作，配有本地化的应用实例用于验证。这确保了隔离性和可重现性。

**可追踪性是必需的**

OpenAI 定义了"trace grading"——对决策、工具调用和推理步骤的端到端 trace 进行结构化评分。从"只看输出"的评估转向"看过程"的评估。

至少应存储：
- 任务输入
- 模型配置
- 运行时的工具定义
- 完整的工具调用序列
- 工具输入和归一化输出
- 状态差异
- 最终产物
- 评分器输出

没有 trace，你只能知道智能体失败了。有了 trace，你通常能知道为什么。

---

## 跨文献的共识：六条 Harness 设计原则

综合三篇一手资料，以下原则已在实践中反复验证：

### 1. 让状态转换显式化

大多数智能体失败本质上是状态管理失败，只是伪装成了推理失败。每个有意义的步骤应该产出以下之一：

- 无操作（no-op）
- 观察（observation）
- 提案（proposal）
- 外部副作用（external side effect）
- 终结结果（terminal result）

显式存储步骤类型。

### 2. 把规划和执行分开

即使两者由同一个模型完成，也要分开接口。规划的表示应该是可检视、可评分的，不需要重新解析自由文本。

Anthropic 在三智能体架构中体现了这一点（规划器独立于生成器），OpenAI 在 Agents SDK 设计中也遵循这个原则。

### 3. 先做可重放，再考虑可扩展

可重放的 trace 让你能够：
- 复现回归
- 公平对比不同的提示词和模型
- 调试工具和策略失败
- 衡量随时间的漂移

没有可重放能力的扩展，只是更昂贵的混乱。

### 4. 工具质量是 Harness 问题

Anthropic 明确指出：详细的工具描述、严格的 schema、示例、紧凑且高信号的响应——这些实质性地影响智能体行为。智能体往往失败不是因为推理能力不足，而是因为工具描述模糊、接口臃肿或工具数量太多。

设计工具时应当：
- 为机器使用而设计，而非人类阅读美感
- 使用语义稳定的标识符
- 保持输出紧凑且与决策相关
- 合并重叠的工具
- 为工具接口做版本管理

### 5. 隔离和可重现性优先于便利性

OpenHands 推荐 Docker 沙箱，将进程沙箱视为不安全的，因为缺乏隔离。这是正确的默认心智模型。

如果智能体能执行命令、修改文件、浏览网页或调用外部 API，你的 Harness 需要：
- 隔离执行
- 有界凭证
- 确定性的环境搭建
- 干净的重置语义
- 可审计的权限

### 6. 改进 Harness，而非堆叠提示词

这是所有文献共同强调的反模式：**当同一个失败反复出现时，应该把修复编码为工具约束、linter、fixture、策略、评分器或文档映射——而不是在提示词中加又一段巨长的指令。**

Prithvi 在前端设计实验中用评分标准取代了散文式的质量要求。Justin 用 JSON 功能清单取代了对模型行为的口头约束。OpenAI 提出用自定义 linter 和结构化测试取代自然语言规则。

同一个方向，三种实现。

---

## 实践参考架构

综合三篇资料，一个完整的 Harness 系统包含六个层次：

```
┌─────────────────────────────────────────┐
│              任务入口（Task Intake）       │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│         规划 / 编排（Orchestrator）        │
└───┬───────────┬───────────┬─────────────┘
    │           │           │
┌───▼───┐ ┌────▼────┐ ┌───▼────┐
│知识层  │ │执行运行时│ │状态存储 │
└───────┘ └────┬────┘ └────────┘
               │
         ┌─────▼─────┐
         │  工具层    │
         └─────┬─────┘
               │
    ┌──────────▼──────────┐
    │  可观测性 / Trace    │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │  评估 / 回归 / CI    │
    └─────────────────────┘
```

### 任务入口

将工作归一化为类型化的任务规范。最小字段：

- `task_id`
- `goal`
- `success_criteria`
- `environment`
- `allowed_tools`
- `risk_level`
- `budget`
- `timeout`
- `artifacts_expected`

不要把用户的原始文本直接当作运行时的唯一事实来源。

### 规划 / 编排

- 选择模型和推理预算
- 任务分解
- 选择工具
- 管理重试和退避
- 决定何时停止、升级或移交

这一层应该尽量薄。复杂的隐藏编排逻辑难以评估。优先选择显式的计划和显式的状态转换。

### 执行运行时

这是智能体实际行动的"世界"：容器/虚拟机、浏览器会话、挂载的仓库、种子数据库、临时凭证。

要求：确定性的环境镜像、每次运行隔离、已知状态重置、资源限制、超时控制、事件捕获。

### 工具层

按领域组织，版本化接口，严格 schema。每个工具应定义：用途、允许的调用者、输入 schema、输出 schema、副作用、重试安全性、幂等性说明、脱敏规则。

### 知识层

渐进式披露：
- `AGENTS.md` 作为路由图
- `ARCHITECTURE.md` 作为系统全景
- `docs/` 下的结构化文档
- `docs/generated/` 下的生成式参考
- `docs/exec-plans/active/` 下的活跃执行计划

如果一条规则很重要，用 linter 或测试来执行，而非一段段落。

### 可观测性和评估层

为每次运行捕获结构化 trace。建立三类评估器：

- **结果评估器**：任务是否成功
- **过程评估器**：执行序列是否合理
- **策略评估器**：是否违反了约束

---

## 值得关注的指标

### 主要指标

- 任务成功率
- pass^k（重复运行一致性）
- 每个成功任务的成本
- 端到端延迟
- 人工介入率
- 策略违规率

### 调试指标

- 工具选择错误率
- Schema 验证失败率
- 重试次数
- 从失败中恢复的比率
- 每个成功任务的步骤数
- 每次运行消耗的上下文字节数

### 编码智能体专项

- 测试通过增量
- diff 大小
- 涉及的文件数
- 回退率
- 合并后的二次修复率

---

## 常见反模式

**1. 用提示词补丁替代 Harness 改进**

当同一个失败反复出现时，在提示词里加更多指令。正确做法是把修复编码为工具约束、linter、fixture 或评分器。

**2. 只做黑盒结果评分**

只看最终输出对不对，忽略过程中的不安全重试、脆弱的工具使用、策略违规。应该尽早加入过程评估器和策略评估器。

**3. 让环境漂移**

如果重置不彻底，评估就变成噪声。固定镜像版本、种子数据，把 teardown 纳入 Harness 合约。

**4. 暴露太多相似工具**

工具歧义制造选择错误。激进地合并。

**5. 把关键知识存在仓库之外**

如果架构决策、策略或任务流程存在于聊天记录或人脑里，智能体的表现就会看起来不稳定——因为环境本身就不稳定。

---

## 启动建议：最小可用 Harness

如果从零开始，按这个顺序构建：

1. 基于 Docker 的隔离运行时，支持状态重置
2. 小而精的类型化工具集：shell、patch、仓库读取、测试运行
3. 每步操作的结构化 trace 日志
4. 20-50 个代表性任务的本地数据集
5. 结果评估器 + 一个策略评估器
6. CI 任务：每次编排或提示词变更时回放数据集

**先不要做：**
- 多智能体路由
- 向量记忆
- 复杂的自我反思循环
- 大而全的工具目录
- 到处用 LLM 做评审

这些会在你建立稳定的测量基线之前引入成本和歧义。

---

## 一手资料原始出处

### Anthropic

1. **Effective Harnesses for Long-Running Agents**（2025.11.26）  
   作者：Justin Young  
   链接：https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents  
   要点：两阶段智能体架构、功能清单、增量推进、端到端测试

2. **Harness Design for Long-Running Application Development**（2026.03.24）  
   作者：Prithvi Rajasekaran，Anthropic Labs  
   链接：https://www.anthropic.com/engineering/harness-design-long-running-apps  
   要点：GAN 式三智能体架构、自我评估失灵、前端设计评分标准、Sprint 合同、模型升级对 Harness 的影响

3. **Anthropic Tool Use 文档**  
   链接：https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools  
   要点：工具描述质量对智能体行为的实质性影响

### OpenAI

4. **Harness Engineering: Leveraging Codex in an Agent-First World**（2026.02.11）  
   链接：https://openai.com/index/harness-engineering/  
   要点：仓库可读性、结构化文档、工作树本地化、机械化约束执行

5. **Agents SDK 文档**  
   链接：https://developers.openai.com/api/docs/guides/agents-sdk  
   要点：完整 trace、工作流级 trace 评分、数据集、可重现评估

6. **Agent Evals / Trace Grading 文档**  
   链接：https://developers.openai.com/api/docs/guides/agent-evals  
   链接：https://developers.openai.com/api/docs/guides/trace-grading  
   要点：从输出评估到过程评估的范式转变

### 相关开源与基准

7. **OpenHands 沙箱文档**  
   链接：https://docs.openhands.dev/openhands/usage/sandboxes/overview  
   要点：Docker 沙箱 > 进程沙箱，隔离性和可重现性

8. **SWE-bench**（软件工程智能体基准）  
   论文：https://arxiv.org/abs/2310.06770  
   要点：真实仓库问题修复，长上下文 + 执行环境 + 跨文件协调编辑

9. **WebArena / WebArena-Verified**（Web 智能体基准）  
   论文：https://arxiv.org/abs/2307.13854  
   仓库：https://github.com/ServiceNow/webarena-verified  
   要点：长周期真实 Web 任务，确定性评分，网络 trace 回放评估

10. **tau-bench**（工具与策略对话智能体基准）  
    论文：https://arxiv.org/abs/2406.12045  
    仓库：https://github.com/sierra-research/tau-bench  
    要点：用户交互 + 策略遵从的可靠性问题，重复运行一致性

---

## 最后的观察

三篇文献指向同一个底层论点：

**如果你希望模型升级带来复利效应，先把 Harness 做好。如果 Harness 是混乱的，模型升级只会更快地产出混乱。**

具体来说：

- 让环境可读
- 让操作受约束
- 让运行可追踪
- 让评估可重放
- 让知识有版本
- 让正确性尽可能机械化

这就是 Harness Engineering 的全部。

它不玄妙，但它决定了你的智能体是"演示能跑"还是"生产可用"。
