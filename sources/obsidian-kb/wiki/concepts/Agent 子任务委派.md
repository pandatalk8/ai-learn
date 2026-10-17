---
title: "Agent 子任务委派"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, agent, subagent, harness, parallelism]
aliases: [sub-agent, subagent, agent delegation, 子 Agent]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - Harness Engineering
  - 文件系统作为持久记忆
  - Loop Engineering
confidence: medium
---

# Agent 子任务委派

一句话：Harness 启动多个子 agent / 后台任务并行探索，父 agent 做进程管理——启动、检查、取消、合并。

## 适用场景

- 并行搜索多个假设
- 并发跑实验
- 隔离子任务，避免污染主上下文

## 父 agent 需要的能力

类似小型进程管理器：

1. 启动 jobs  
2. 检查日志  
3. 取消失败运行  
4. 把结果合并回主线程  

编码 agent 常见委派工具形态：`spawn_agent`、`resume_agent`、`wait_agent`、`list_agents`、`close_agent`、`interrupt_agent` 等。

## 设计关键

**并行必须显式且可检查。** 子 agent 输出只存在临时 chat 中会很快过时；应结合 [[文件系统作为持久记忆]] 写成文件、日志与状态记录。

## Sources

- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
- `wiki/sources/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
