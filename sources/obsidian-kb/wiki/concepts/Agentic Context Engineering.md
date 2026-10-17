---
title: "Agentic Context Engineering"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, context, ACE, memory, agent]
aliases: [ACE, Agentic Context Engineering]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
  - sources/clips/2026-07-10-agentic-context-engineering-authors.md
related:
  - Context Engineering
  - Meta Context Engineering
  - Meta-Harness
  - Harness Engineering
  - ACE 论文作者团队
confidence: high
---

# Agentic Context Engineering

一句话：把上下文当成**可演化的 playbook**，而不是越来越长的 prompt；用生成—反思—策展循环维护条目化记忆。

## 来源

ACE（Zhang et al. 2025，arxiv:2510.04618），经 Lilian Weng 2026-07-04 综述引入本库。

论文完整作者、机构、当前公开任职与研究方向见 [[ACE 论文作者团队]]；本地事实来源为 `sources/clips/2026-07-10-agentic-context-engineering-authors.md`。

## 三个组件

| 组件 | 作用 |
|---|---|
| 生成器（Generator） | 生成任务轨迹，并参考 playbook 条目 |
| 反思器（Reflector） | 从成功/失败轨迹提炼洞见 |
| 策展器（Curator） | 以增量、条目化方式更新结构化上下文 |

每个 bullet 有标识符与描述。

## 关键设计

策展器**不重写整段 prompt blob**，而是输出 `(identifier, description)` 条目，由确定性逻辑合并进上下文日志，并周期性精炼与去重——用于避免迭代重写中的**上下文坍塌**与**简短偏差（brevity bias）**。

局限：更新规则与整体工作流仍偏手工；进一步的自我改进见 [[Meta Context Engineering]]。

## Sources

- arXiv: https://arxiv.org/abs/2510.04618  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
- `sources/clips/2026-07-10-agentic-context-engineering-authors.md`
