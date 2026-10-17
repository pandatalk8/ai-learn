# 《Agentic Design Patterns》读书笔记：构建智能体系统的 21 种设计模式

![image-20260324195515497](../../../Library/Application Support/typora-user-images/image-20260324195515497.png)****



> 本文是对 Antonio Gulli 所著 *Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems*（Springer, 2025）一书的提纲挈领式梳理。全书 424 页，涵盖 21 种核心模式、7 个附录，配套代码使用 LangChain/LangGraph、CrewAI 和 Google ADK 三大框架。

---

## 一、这本书在解决什么问题？

大模型很强，但单次调用远远不够。真正有用的 AI 系统需要：**拆解任务、调用工具、自我纠错、多个 Agent 协作、在约束条件下做出决策**。这些能力不是靠一个 prompt 就能搞定的，而是需要**设计模式**——一套可复用的架构方案。

这本书把业界散落在各处的实践经验，系统化地提炼成了 21 种设计模式，按"从简单到复杂"的顺序编排，每种模式都给出了**原理 + 代码 + 适用场景**。

---

## 二、核心架构：四大部分

### Part 1：基础模式（Ch 1-7，103 页）—— "一个 Agent 能做什么"

这部分回答的核心问题：**如何让一个 Agent 完成一项复杂任务？**

| 模式 | 核心思想 | 一句话理解 |
|------|---------|-----------|
| **Prompt Chaining** | 把复杂任务拆成多个 prompt 串联执行 | 流水线：上一步的输出是下一步的输入 |
| **Routing** | 根据输入内容动态选择不同的处理路径 | if-else 的智能版：让 LLM 自己判断走哪条路 |
| **Parallelization** | 多个子任务同时执行，最后汇总 | Map-Reduce：先扇出、再聚合 |
| **Reflection** | Agent 审视自己的输出并迭代改进 | 自我代码审查：写完再检查一遍 |
| **Tool Use** | Agent 调用外部 API、数据库、搜索引擎等工具 | 给 LLM 装上手脚：不只是想，还能做 |
| **Planning** | Agent 先制定执行计划，再逐步执行 | 项目经理模式：先列 TODO，再逐项完成 |
| **Multi-Agent** | 多个专职 Agent 分工协作完成任务 | 团队协作：每人有明确角色和职责 |

**关键洞察**：这 7 种模式的复杂度是递增的。Prompt Chaining 是最简单的线性流程，Multi-Agent 是最复杂的分布式协作。实际项目中往往需要组合使用。

### Part 2：记忆与适应（Ch 8-11，61 页）—— "Agent 如何变聪明"

这部分解决的是 Agent 的**状态管理**问题——没有记忆的 Agent 就是个无状态函数，每次都从零开始。

| 模式 | 核心思想 | 一句话理解 |
|------|---------|-----------|
| **Memory Management** | 短期记忆（对话上下文）+ 长期记忆（向量数据库） | 人也有工作记忆和长期记忆，Agent 同理 |
| **Learning and Adaptation** | Agent 从反馈中学习，调整后续行为 | 不犯同样的错：把经验教训存下来 |
| **MCP (Model Context Protocol)** | 标准化 Agent 与外部数据/工具的连接协议 | USB 接口：一个标准连接所有设备 |
| **Goal Setting and Monitoring** | Agent 设定子目标并监控执行进度 | OKR 管理：目标拆解 + 进度追踪 |

**关键洞察**：MCP 是 Anthropic 提出的开放协议，正在成为 Agent 工具连接的事实标准。这一章的实用价值会随着生态成熟持续增长。

### Part 3：可靠性保障（Ch 12-14，34 页）—— "Agent 出错了怎么办"

如果说 Part 1-2 是让 Agent "能干活"，Part 3 就是让 Agent "干得靠谱"。

| 模式 | 核心思想 | 一句话理解 |
|------|---------|-----------|
| **Exception Handling & Recovery** | 优雅处理失败，自动重试或降级 | try-catch 的 Agent 版：预料到会出错，并准备好备选方案 |
| **Human-in-the-Loop** | 关键节点让人类介入审批或纠正 | 自动驾驶 L3：大部分自动，关键时刻人类接管 |
| **Knowledge Retrieval (RAG)** | 从外部知识库检索相关信息增强生成 | 开卷考试：不靠背，靠查 |

**关键洞察**：RAG 放在"可靠性"而非"基础模式"里，体现了作者的观点——RAG 的核心价值不是"增强能力"，而是"减少幻觉、提高可靠性"。

### Part 4：高级模式（Ch 15-21，114 页）—— "工业级 Agent 系统"

这部分是从原型到生产的跨越。

| 模式 | 核心思想 | 一句话理解 |
|------|---------|-----------|
| **Inter-Agent Communication (A2A)** | Agent 之间的标准化通信协议 | 微服务间的 gRPC：Agent 也需要 API 合约 |
| **Resource-Aware Optimization** | 在 token 预算、延迟、成本约束下优化 | 省钱模式：用小模型处理简单任务，大模型处理难题 |
| **Reasoning Techniques** | Chain-of-Thought、Tree-of-Thought 等推理策略 | 解数学题：列步骤比直接写答案更准确 |
| **Guardrails / Safety Patterns** | 输入/输出过滤、内容安全、权限控制 | 安全围栏：防止 Agent 做不该做的事 |
| **Evaluation and Monitoring** | 系统性评估 Agent 表现，持续监控 | 上线后的仪表盘：知道 Agent 干得好不好 |
| **Prioritization** | 多任务/多目标场景下的优先级决策 | 紧急 vs 重要：Agent 也需要做取舍 |
| **Exploration and Discovery** | Agent 主动探索未知领域、发现新知识 | 科研模式：不只是回答问题，还能提出问题 |

**关键洞察**：A2A（Agent-to-Agent）是 Google 主推的协议，与 MCP 互补——MCP 解决 Agent-to-Tool，A2A 解决 Agent-to-Agent。作者作为 Google 工程师，自然在这里有深入的第一手洞察。

---

## 三、附录亮点

- **Appendix A: Advanced Prompting Techniques**（28 页）—— 最全面的提示工程技术汇总
- **Appendix B: From GUI to Real World**——从图形界面到真实环境的落地
- **Appendix C: Agentic Frameworks Overview**——主流框架横向对比
- **Appendix D: AgentSpace**——Google 的企业级 Agent 平台
- **Appendix F: Under the Hood**——推理引擎内部工作原理揭秘（14 页，技术含量最高）
- **Appendix G: Coding Agents**——编程 Agent 专题

---

## 四、这本书的独特价值

### 1. 模式化思维
不是零散的技巧集合，而是**系统化的设计模式目录**——类似《设计模式》之于面向对象编程，这本书试图成为 Agent 领域的"GoF"。

### 2. 三框架并行
每种模式用 LangChain/LangGraph、CrewAI、Google ADK 三套代码实现，既能横向对比框架差异，也方便读者选择自己熟悉的技术栈。

### 3. Google 内部视角
作者是 Google CTO Office 的高级总监/杰出工程师，对 A2A 协议、AgentSpace、Gemini 推理引擎的讲解具有第一手权威性。

### 4. 从原型到生产
不仅仅讲"怎么让 Agent 跑起来"，更花了大量篇幅讲**异常处理、安全护栏、资源优化、评估监控**——这些才是真正上生产时要解决的问题。

---

## 五、适合谁读？

| 读者类型 | 推荐阅读方式 |
|---------|-------------|
| **AI 应用开发者** | 通读全书，重点跑代码 |
| **技术管理者/架构师** | 重点读 Part 4 + 附录 C/D |
| **AI 产品经理** | 读每章的概念部分，跳过代码 |
| **AI 初学者** | 先读 Part 1，配合附录 A 的提示工程基础 |

---

## 六、一张图总结

```
                    ┌─────────────────────────────┐
                    │     Part 4: 工业化部署        │
                    │  A2A · 资源优化 · 安全护栏     │
                    │  评估监控 · 推理 · 优先级       │
                    ├─────────────────────────────┤
                    │     Part 3: 可靠性保障        │
                    │  异常处理 · 人机协作 · RAG     │
                    ├─────────────────────────────┤
                    │     Part 2: 记忆与适应        │
                    │  记忆管理 · 学习 · MCP · 目标  │
                    ├─────────────────────────────┤
                    │     Part 1: 基础模式          │
                    │  链式 · 路由 · 并行 · 反思     │
                    │  工具 · 规划 · 多Agent         │
                    └─────────────────────────────┘
                         ↑ 复杂度递增 ↑
```

---

## 参考链接

- 

- **作者**：Antonio Gulli，Google CTO Office Senior Director & Distinguished Engineer

  
