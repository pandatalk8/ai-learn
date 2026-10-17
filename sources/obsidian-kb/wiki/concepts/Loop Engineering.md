---
title: "Loop Engineering"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, agent, loop, harness, iteration]
aliases: [loop engineering, agent loop, 循环工程, 迭代循环]
sources:
  - raw/notes/2026-06-28-loop-engineering-harness-engineering.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-06-14-omarsar0-autonomous-long-running-coding-agents.md
related:
  - Harness Engineering
  - 递归自我改进
confidence: high
---

# Loop Engineering

一句话：把 agent 工作设计成可重复的「计划—执行—观察—改进」循环；**价值不在转圈本身，而在循环能否沿指定目标持续迭代进化**。

## 基本形态

常见 goal-oriented loop：

```text
plan → execute → observe / test → improve → execute again
          ↑__________________________________|
```

直到目标达成，或触发向用户澄清任务/偏好。

编码 agent 里，工具调用与工具结果进入下一轮生成，形成 runtime 上的 agent loop（而非静态 prompt 模板）。

## 关键判断

个人笔记的核心判断：

> Loop Engineering 的意义不在于循环，而在于迭代。  
> 能否沿指定路径和目标进化，取决于 [[Harness Engineering]]。

没有 harness 提供的：

- 明确目标与约束
- 评估器 / 测试
- 持久状态与轨迹
- 权限与失败恢复

loop 只会重复生成，不会稳定进化。

## 与相关概念

| 概念 | 关系 |
|---|---|
| [[Harness Engineering]] | harness 是 loop 能正确迭代的运行时与规则层 |
| [[递归自我改进]] | 当 loop 改进的是产生智能/产出的机制本身时，进入 RSI |
| 自主长时 coding agent | 目标合约、评估器、验证器、session mining 都是 loop 的工程件 |

## Sources

- 个人笔记：`raw/notes/2026-06-28-loop-engineering-harness-engineering.md`
- Lilian Weng 综述：`sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
- omarsar0 长时 agent：`sources/clips/2026-06-14-omarsar0-autonomous-long-running-coding-agents.md`
