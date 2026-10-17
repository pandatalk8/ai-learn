---
title: "SIA"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, harness, weights, joint-optimization, RSI]
aliases: [SIA, self-improving agent joint optimization]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - Harness Engineering
  - 递归自我改进
  - Meta-Harness
  - Reward hacking
confidence: medium
---

# SIA

一句话：把 **harness 改进** 与 **模型权重更新** 放进同一优化循环的早期尝试。

## 来源

Hebbar et al. 2026（arxiv:2605.27276），经 Weng 综述；证据仍偏暂时。

## 三组件

| 组件 | 作用 |
|---|---|
| Meta-Agent | 提出初始 harness |
| Task-Specific Agent | 执行任务 |
| Feedback-Agent | 根据近期轨迹，决定下一步更新 harness 还是权重 |

## 评价（Weng）

方向有趣，但实验存在混杂：任务 agent 与 meta/feedback 用模型能力差距大、baseline 偏弱，难与相关方法清晰对照。训练稳定性与 Goodhart 效应仍开放。

## Sources

- arXiv: https://arxiv.org/abs/2605.27276  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
