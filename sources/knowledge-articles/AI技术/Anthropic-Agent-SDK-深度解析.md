# Anthropic Agent SDK 深度解析：原理、使用与实战评估

## 一、什么是 Agent SDK？

Anthropic Agent SDK（原名 Claude Code SDK）是 Anthropic 官方推出的 AI Agent 开发框架。它将驱动 Claude Code 的核心能力——自主工具调用、Agent 循环、上下文管理——封装为可编程的 SDK，让开发者用几行代码就能构建具备自主行动能力的 AI Agent。

**核心定位：** 不再是"调 API 拿回答"，而是"给任务让 AI 自己干活"。

### 安装与支持

```bash
# Python（3.10+）
pip install claude-agent-sdk

# TypeScript / Node.js（18+）
npm install @anthropic-ai/claude-agent-sdk
```

环境变量配置：

```bash
export ANTHROPIC_API_KEY=your-api-key

# 也支持 Amazon Bedrock / Google Vertex AI / Azure AI Foundry
export CLAUDE_CODE_USE_BEDROCK=1   # Bedrock
export CLAUDE_CODE_USE_VERTEX=1    # Vertex AI
```

---

## 二、核心架构与工作原理

### 2.1 Agent Loop：自主决策循环

Agent SDK 的核心是一个**自主决策循环（Agent Loop）**，这是它与传统 API 调用最本质的区别。

```
用户给出任务
    ↓
┌─────────────────────────────┐
│  Claude 分析任务，决定行动    │
│         ↓                   │
│  调用工具（Read/Edit/Bash…） │
│         ↓                   │
│  观察工具返回结果             │
│         ↓                   │
│  决定下一步：继续/完成/提问   │
└────────────┬────────────────┘
             │ 循环直到任务完成
             ↓
        返回最终结果
```

**关键设计理念：**

1. **Claude 自主编排工具调用。** 开发者不需要写 if/else 来决定调什么工具，Claude 自己判断
2. **流式消息输出。** `query()` 返回异步迭代器，实时流式输出工作进度
3. **自动处理多轮交互。** 一个 `query()` 调用可能包含数十次工具调用，全部自动完成

### 2.2 消息类型体系

SDK 定义了清晰的消息类型，贯穿整个 Agent Loop：

| 消息类型 | 含义 | 典型用途 |
|---------|------|---------|
| `SystemMessage` | 系统级事件（初始化、MCP 状态） | 获取 session_id、工具列表 |
| `AssistantMessage` | Claude 的推理和工具调用 | 展示思考过程、跟踪工具使用 |
| `ResultMessage` | 最终结果 | 获取完成状态、费用、token 用量 |
| `ToolUseBlock` | 单次工具调用详情 | 审计和调试 |

### 2.3 与传统 API 调用的对比

```
┌─────────────────────────────────────────────────────────┐
│              传统 Anthropic API 调用                      │
│                                                          │
│  开发者 → 发送 prompt → 收到回复                          │
│  开发者 → 解析 tool_use → 执行工具 → 发回结果             │
│  开发者 → 再次发送 → 收到回复 → 重复...                   │
│                                                          │
│  所有工具执行逻辑由开发者实现                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              Agent SDK                                    │
│                                                          │
│  开发者 → query("完成这个任务") → 等待结果                │
│                                                          │
│  SDK 内部自动处理：                                       │
│  Claude 决策 → 工具执行 → 结果反馈 → 再次决策 → ...       │
│                                                          │
│  开发者只需要消费流式消息                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 三、核心 API 详解

### 3.1 query() — 最核心的函数

`query()` 是 Agent SDK 的入口函数。一次调用启动完整的 Agent Loop。

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage


async def main():
    async for message in query(
        prompt="Review utils.py for bugs and fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],
            permission_mode="acceptEdits",
        ),
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)
        elif isinstance(message, ResultMessage):
            print(f"Cost: ${message.total_cost_usd}")


asyncio.run(main())
```

### 3.2 ClaudeAgentOptions — 配置一切

`ClaudeAgentOptions` 是 Agent 行为的控制中心：

```python
options = ClaudeAgentOptions(
    # 允许使用的工具
    allowed_tools=["Read", "Edit", "Bash", "Glob", "Grep"],

    # 权限模式
    permission_mode="acceptEdits",  # 自动批准文件编辑

    # 系统提示词
    system_prompt="You are a senior Python engineer",

    # MCP 服务器（外部工具集成）
    mcp_servers={
        "github": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-github"],
            "env": {"GITHUB_TOKEN": os.environ["GITHUB_TOKEN"]},
        }
    },

    # 子 Agent 定义
    agents={
        "reviewer": AgentDefinition(
            description="Code reviewer",
            prompt="Review code quality",
            tools=["Read", "Glob", "Grep"],
        )
    },

    # 生命周期钩子
    hooks={
        "PreToolUse": [HookMatcher(matcher="Bash", hooks=[audit_bash])],
    },

    # 扩展思考
    thinking={"type": "enabled", "budget_tokens": 20000},

    # 会话恢复
    resume="session-id-here",
)
```

### 3.3 内置工具集

Agent SDK 内置了与 Claude Code 相同的工具集：

| 工具 | 能力 | 默认权限 |
|-----|------|---------|
| `Read` | 读取文件 | 预批准 |
| `Write` | 创建新文件 | 需授权 |
| `Edit` | 精确编辑文件 | 需授权 |
| `Bash` | 执行终端命令 | 需授权 |
| `Glob` | 按模式搜索文件 | 预批准 |
| `Grep` | 按正则搜索内容 | 预批准 |
| `WebSearch` | 搜索网页 | 需授权 |
| `WebFetch` | 抓取网页内容 | 需授权 |
| `Agent` | 调用子 Agent | 需授权 |
| `AskUserQuestion` | 向用户提问 | 交互式 |

---

## 四、进阶能力

### 4.1 自定义工具（Custom Tools）

通过 `@tool` 装饰器定义自定义工具，再用 MCP 服务器暴露给 Agent：

```python
from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions
from typing import Any


@tool("query_database", "Query the user database", {"sql": str})
async def query_database(args: dict[str, Any]) -> dict[str, Any]:
    # 你的数据库查询逻辑
    result = await db.execute(args["sql"])
    return {
        "content": [{"type": "text", "text": str(result)}]
    }


@tool("send_notification", "Send a notification", {"message": str, "channel": str})
async def send_notification(args: dict[str, Any]) -> dict[str, Any]:
    await notify(args["channel"], args["message"])
    return {
        "content": [{"type": "text", "text": "Notification sent."}]
    }


# 打包成 MCP 服务器
server = create_sdk_mcp_server(
    name="my-tools",
    version="1.0.0",
    tools=[query_database, send_notification]
)

options = ClaudeAgentOptions(
    mcp_servers={"my-tools": server},
    allowed_tools=["mcp__my-tools__query_database", "mcp__my-tools__send_notification"],
)
```

### 4.2 MCP 服务器集成

MCP（Model Context Protocol）是 Agent SDK 连接外部世界的标准协议。已有大量现成的 MCP 服务器：

```python
# 连接 GitHub
mcp_servers = {
    "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {"GITHUB_TOKEN": os.environ["GITHUB_TOKEN"]},
    },
    # 连接 PostgreSQL
    "postgres": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-postgres", DATABASE_URL],
    },
    # 连接远程 HTTP MCP 服务器
    "remote-api": {
        "type": "http",
        "url": "https://my-mcp-server.example.com/mcp",
    },
}
```

### 4.3 多 Agent 协作（Subagents）

这是 Agent SDK 最强大的模式之一——**一个主 Agent 调度多个专业子 Agent**：

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep", "Agent"],
    agents={
        "frontend-reviewer": AgentDefinition(
            description="Reviews frontend code for React best practices",
            prompt="Analyze frontend code quality and accessibility",
            tools=["Read", "Glob", "Grep"],
        ),
        "security-scanner": AgentDefinition(
            description="Scans for security vulnerabilities",
            prompt="Check for OWASP top 10 vulnerabilities",
            tools=["Read", "Glob", "Grep"],
        ),
        "test-writer": AgentDefinition(
            description="Writes missing unit tests",
            prompt="Identify untested code paths and write tests",
            tools=["Read", "Edit", "Bash"],
        ),
    },
)

# 主 Agent 自动协调多个子 Agent
async for message in query(
    prompt="Do a comprehensive code review: check frontend quality, "
           "scan for security issues, and write tests for uncovered code.",
    options=options,
):
    pass
```

**Subagent 的设计特点：**

- 每个子 Agent 有独立的上下文窗口和系统提示词
- 子 Agent 内部的工具调用对主 Agent 不可见（减少噪音）
- 只有子 Agent 的最终结论返回给主 Agent
- 可以并行运行多个子 Agent

### 4.4 会话管理（Sessions）

Sessions 让 Agent 记住之前的对话上下文：

```python
from claude_agent_sdk import query, ClaudeAgentOptions, SystemMessage

# 第一轮：分析代码
session_id = None
async for message in query(
    prompt="Read and analyze the auth module",
    options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"]),
):
    if isinstance(message, SystemMessage) and message.subtype == "init":
        session_id = message.session_id

# 第二轮：基于上一轮的理解继续
async for message in query(
    prompt="Now find all places that call the auth module",
    options=ClaudeAgentOptions(resume=session_id),
):
    pass  # Claude 记住了第一轮读过的代码

# 第三轮：进一步深入
async for message in query(
    prompt="Refactor the most problematic caller",
    options=ClaudeAgentOptions(resume=session_id),
):
    pass
```

### 4.5 Hooks：生命周期拦截

Hooks 是 Agent SDK 的"中间件"系统，可以在工具执行前后插入自定义逻辑：

| Hook | 触发时机 | 用途 |
|------|---------|------|
| `PreToolUse` | 工具执行前 | 拦截危险操作、修改输入 |
| `PostToolUse` | 工具执行后 | 记录日志、验证结果 |
| `PostToolUseFailure` | 工具失败后 | 优雅处理错误 |
| `PreCompact` | 上下文压缩前 | 归档完整对话记录 |
| `Stop` | Agent 停止执行 | 保存状态、清理资源 |
| `Notification` | 状态更新 | 转发到 Slack/飞书 |

**实战示例：保护 .env 文件不被修改**

```python
async def protect_env_files(input_data, tool_use_id, context):
    file_path = input_data["tool_input"].get("file_path", "")
    if file_path.endswith(".env"):
        return {
            "hookSpecificOutput": {
                "permissionDecision": "deny",
                "permissionDecisionReason": "Cannot modify .env files"
            }
        }
    return {}

options = ClaudeAgentOptions(
    hooks={
        "PreToolUse": [
            HookMatcher(matcher="Edit|Write", hooks=[protect_env_files])
        ]
    }
)
```

### 4.6 权限系统

Agent SDK 提供了多层权限控制：

```
Hook（最先执行，可直接拦截）
  ↓
Deny Rules（黑名单）
  ↓
Permission Mode（全局策略）
  ↓
Allow Rules（白名单预批准）
  ↓
canUseTool 回调（运行时动态决策）
```

**权限模式：**

| 模式 | 行为 | 适用场景 |
|-----|------|---------|
| `default` | 未授权工具会提示用户 | 交互式使用 |
| `acceptEdits` | 自动批准文件读写操作 | 自动化代码修改 |
| `bypassPermissions` | 批准所有工具 | 完全信任的自动化流水线 |
| `plan` | 只规划不执行 | 方案预览 |

---

## 五、能用来干什么？

### 5.1 自动化代码审查与修复

```python
# 一行代码启动代码审查 + 自动修复
async for msg in query(
    prompt="Review this project for bugs, security issues, and code smells. Fix everything you find.",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Edit", "Glob", "Grep", "Bash"],
        permission_mode="acceptEdits",
    ),
):
    pass
```

Agent 会自主：读取文件 → 分析问题 → 编辑代码 → 运行测试 → 验证修复。

### 5.2 智能数据管道

结合 MCP 服务器，Agent 可以连接数据库、API、文件系统：

```python
# 自然语言查询数据库
async for msg in query(
    prompt="上周有多少新注册用户？按天分布是怎样的？生成一个分析报告。",
    options=ClaudeAgentOptions(
        mcp_servers={"postgres": postgres_server},
        allowed_tools=["mcp__postgres__query", "Write"],
    ),
):
    pass
```

### 5.3 多 Agent 研究系统

Anthropic 官方展示了一个多 Agent 研究系统的案例：

- **主 Agent（协调者）：** 接收研究主题，拆分成子任务
- **子 Agent A（文献检索）：** 搜索网络获取相关资料
- **子 Agent B（数据分析）：** 分析收集到的数据
- **子 Agent C（报告撰写）：** 综合所有信息生成报告

### 5.4 CI/CD 流水线集成

在 CI/CD 中使用 Agent 自动化代码质量检查：

```python
# CI 流水线中的自动化审查
async for msg in query(
    prompt="Review the diff against main branch. Check for: "
           "1) Security vulnerabilities "
           "2) Performance regressions "
           "3) Breaking API changes "
           "Output a structured report.",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Glob", "Grep", "Bash"],
    ),
):
    pass
```

### 5.5 其他典型场景

- **邮件 Agent：** 连接 IMAP，自然语言管理邮件
- **客服工单分流：** 自动分类、优先级排序、初步回复
- **文档生成：** 阅读代码库自动生成 API 文档
- **合规扫描：** 检查代码是否符合安全合规要求

---

## 六、解决了什么问题？解决得怎么样？

### 6.1 解决的核心问题

**问题 1：工具调用编排的复杂性**

传统 API 调用中，开发者需要：
- 自己实现 tool_use 的解析和执行
- 手动处理多轮工具调用的循环
- 管理上下文窗口和对话历史
- 处理各种边界情况和错误恢复

**Agent SDK 的解决方案：** 一个 `query()` 调用全搞定。Claude 自主决策调什么工具、调几次、什么时候停。

**评价：** ★★★★★ 极大降低了 Agent 开发的门槛。从几百行编排代码到几行调用。

---

**问题 2：Agent 安全性和可控性**

放任 AI 自主执行工具是危险的。需要多层安全保障。

**Agent SDK 的解决方案：**
- 5 层权限系统（Hook → Deny → Mode → Allow → canUseTool）
- 细粒度工具权限控制
- Hook 系统可拦截任何工具调用
- Plan 模式可以只看方案不执行

**评价：** ★★★★☆ 权限系统设计精良。但生产环境中仍需额外审计和监控基础设施。

---

**问题 3：复杂任务需要多个 Agent 协作**

单一 Agent 处理复杂任务时容易上下文混乱或遗漏。

**Agent SDK 的解决方案：**
- Subagent 机制，每个子 Agent 有独立的上下文和工具集
- 主 Agent 编排子 Agent，只接收最终结论
- 减少上下文噪音，提高专注度

**评价：** ★★★★☆ 子 Agent 设计思路正确，实际效果取决于任务拆分质量和模型能力。

---

**问题 4：连接外部工具和服务**

Agent 需要与数据库、API、第三方服务交互。

**Agent SDK 的解决方案：**
- 原生 MCP 协议支持
- 同时支持 stdio 和 HTTP 两种传输协议
- 丰富的开源 MCP 服务器生态

**评价：** ★★★★☆ MCP 生态正在快速成长，但部分 MCP 服务器质量参差不齐。

---

### 6.2 与竞品对比

| 维度 | Claude Agent SDK | LangGraph | CrewAI | OpenAI Agents SDK |
|------|-----------------|-----------|--------|-------------------|
| 模型支持 | 仅 Claude | 50+ LLM | 30+ LLM | 仅 GPT |
| 内置工具 | 丰富（10+） | 极少 | 极少 | 有限 |
| 编排复杂度 | 简单（自动循环） | 复杂（需定义图） | 中等（角色定义） | 中等 |
| 学习曲线 | 低 | 高 | 中 | 中 |
| 安全机制 | 优秀（5 层） | 一般 | 一般 | 一般 |
| MCP 支持 | 原生一等公民 | 通过插件 | 通过插件 | 无 |
| 生产成熟度 | 较新 | 成熟 | 成熟 | 成熟 |

---

## 七、存在什么问题？

### 7.1 模型锁定（Vendor Lock-in）

**问题：** Agent SDK 只支持 Claude 模型，不支持 GPT、Gemini 或开源模型。

**影响：**
- 无法根据任务复杂度混用不同模型（比如简单任务用便宜模型）
- 完全依赖 Anthropic 的定价和服务可用性
- 迁移成本高

**对策：** 如果你需要多模型支持，LangGraph 或 LiteLLM + 自建编排是更灵活的选择。

### 7.2 上下文窗口限制

**问题：** 长时间运行的 Agent 容易耗尽上下文窗口。当工具调用次数很多时，对话历史迅速膨胀。

**影响：**
- 复杂任务执行到一半可能失败
- Agent 可能"忘记"之前的分析结论
- 费用随上下文增长而显著增加

**官方建议：** 使用两层 Agent 架构——Initializer Agent 做规划，Coding Agent 做执行。但这增加了复杂度。

### 7.3 会话管理粗糙

**问题：**
- 会话永久存储在本地，没有自动清理机制
- 没有内置的跨会话记忆/知识库
- SDK 不提供会话级别的费用统计，需要手动累加
- Python SDK 不暴露单步 token 用量

**影响：** 生产环境需要额外开发会话管理、清理、监控功能。

### 7.4 调试困难

**问题：** Agent 的行为是非确定性的——同样的 prompt 可能产生不同的工具调用序列。

**影响：**
- 难以复现和调试问题
- 测试覆盖率难以保证
- 线上问题排查需要完整的执行日志

**现状：** Hook 系统提供了一定的可观测性，但缺少内置的分布式追踪和可视化调试工具。

### 7.5 企业级功能缺失

**问题：**
- 本地 MCP 服务器缺乏集中式认证和审计追踪
- 没有内置的速率限制和并发控制
- 缺少 Agent 行为的监控仪表板
- 没有 A/B 测试框架来对比不同 Agent 配置的效果

**影响：** 企业生产部署需要大量额外的基础设施建设。

### 7.6 费用不透明

**问题：** Agent 的费用高度不可预测。一个看似简单的任务可能触发大量工具调用，每次调用都消耗 token。

**影响：**
- 难以做预算估算
- 需要实现费用熔断机制
- `max_turns` 可以限制循环次数，但不能精确控制费用

**建议：** 在 `ResultMessage` 中监控 `total_cost_usd`，设置费用阈值告警。

### 7.7 视觉和浏览器交互能力有限

**问题：** Claude 通过 MCP 进行浏览器自动化时，无法看到浏览器原生弹窗（alert/confirm/prompt），视觉工具在某些 UI 场景下可能遗漏信息。

---

## 八、最佳实践

### 8.1 最小权限原则

```python
# 好：只给必要的工具
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep"],  # 只读分析
)

# 坏：一上来就给所有权限
options = ClaudeAgentOptions(
    permission_mode="bypassPermissions",  # 危险
)
```

### 8.2 用 Hook 做审计日志

```python
async def audit_log(input_data, tool_use_id, context):
    tool_name = input_data.get("tool_name")
    tool_input = input_data.get("tool_input", {})
    logger.info(f"Tool: {tool_name}, Input: {tool_input}, ID: {tool_use_id}")
    return {}

options = ClaudeAgentOptions(
    hooks={
        "PreToolUse": [HookMatcher(hooks=[audit_log])],
    }
)
```

### 8.3 费用控制

```python
total_cost = 0.0

async for message in query(prompt="...", options=options):
    if isinstance(message, ResultMessage):
        total_cost += message.total_cost_usd
        if total_cost > 5.0:  # 费用熔断
            print(f"Cost limit reached: ${total_cost}")
            break
```

### 8.4 两层 Agent 架构处理复杂任务

```python
# 第一层：Planner Agent（只读，规划方案）
plan = await run_planner_agent("Refactor the auth system")

# 第二层：Executor Agent（按计划执行）
await run_executor_agent(f"Execute this plan:\n{plan}")
```

---

## 九、总结

### 适合使用 Agent SDK 的场景

- 你的技术栈以 Claude 为核心
- 需要 Agent 自主操作文件系统和终端
- 对安全性有较高要求（多层权限控制）
- 需要快速构建原型（API 极其简单）
- 已有 MCP 服务器生态可复用

### 不适合使用 Agent SDK 的场景

- 需要混用多个 LLM 模型
- 需要复杂的工作流图（带分支、循环、条件判断）
- 需要成熟的生产级监控和可观测性
- 对费用极其敏感、需要精确预算
- 需要完全离线部署

### 一句话评价

**Agent SDK 是目前最简洁的 AI Agent 开发框架，用极少的代码就能获得 Claude Code 级别的自主能力。但它的模型锁定、企业级功能缺失和费用不可预测性，意味着在生产环境中需要额外的工程投入来弥补这些短板。**

---

*本文基于 Claude Agent SDK 2026 年 3 月版本撰写，SDK 仍在快速迭代中，部分细节可能已更新。*

**参考资源：**

- [Agent SDK 官方文档](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Python SDK 仓库](https://github.com/anthropics/claude-agent-sdk-python)
- [TypeScript SDK 仓库](https://github.com/anthropics/claude-agent-sdk-typescript)
- [官方示例仓库](https://github.com/anthropics/claude-agent-sdk-demos)
- [Anthropic 工程博客：Building Agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
