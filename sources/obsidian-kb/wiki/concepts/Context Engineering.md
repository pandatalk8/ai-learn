---
title: "Context Engineering"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, agent, context, memory, harness]
aliases: [context engineering, 上下文工程]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - Harness Engineering
  - 文件系统作为持久记忆
  - Agentic Context Engineering
  - Meta Context Engineering
  - Meta-Harness
confidence: high
---

# Context Engineering

一句话：在 agent 任务周期变长时，不靠无限塞上下文，而是**主动构造、压缩、演化**模型可见信息，并与持久状态协同。

## 为什么需要

把全部工具响应和生成日志直接追加进上下文，长周期任务很快失控。Context engineering 负责：

- 构造更结构化、更简洁的上下文
- 管理持久状态（常与文件系统记忆配合）
- 在长上下文能力仍有限时，补上可工程化的记忆层

它是 [[Harness Engineering]] 的核心优化面之一。

## 文章中的主要路线

| 方法 | 要点 |
|---|---|
| ACE（Agentic Context Engineering） | 上下文是可演化 playbook；生成器 / 反思器 / 策展器；条目化增量更新，避免整段重写坍塌 |
| MCE（Meta Context Engineering） | 分离「如何管上下文」与「上下文里有什么」；技能与上下文双层优化 |
| Meta-Harness | 再下沉一层：优化决定存储/检索/呈现的**代码** |

演进直觉：

```text
prompts → structured context → workflow → harness code → optimizer code
```

## 与持久记忆

Context engineering 管「当前窗口里放什么」；[[文件系统作为持久记忆]] 管「窗口外什么可恢复」。二者配合才撑得住长周期 agent。

## Sources

- 源笔记：`wiki/sources/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
- 英文剪藏：`sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
- 中文全译：`sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md`
- 图谱边：`.kb/links/concepts/Context Engineering.yaml`
