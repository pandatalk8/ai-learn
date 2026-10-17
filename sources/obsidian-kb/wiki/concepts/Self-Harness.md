---
title: "Self-Harness"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, harness, self-improvement, agent]
aliases: [Self Harness, self-harness]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - Harness Engineering
  - Meta-Harness
  - Self-Taught Optimizer
  - Reward hacking
  - 评估器设计
confidence: high
---

# Self-Harness

一句话：LLM agent 通过「弱点挖掘 → 有边界提案 → 验证合并」循环改进自己的 harness。

## 来源

Zhang et al. 2026（arxiv:2606.09498），经 Weng 综述。

## 三阶段循环

1. **弱点挖掘**：在当前 harness $h_t$ 上评估，收集 trace；把失败聚类为验证器支撑的失败模式（需区分表面错误码与因果机制）。  
2. **Harness 提案**：同一模型在 $h_t$ 下作 proposer；上下文有界：可编辑表面、失败模式、应保留的通过行为、历史编辑摘要；偏好可处理、可窄改的复发错误，候选要多样。  
3. **提案验证**：held-in 测弱点是否解决，held-out 测是否引入回归；无回归才合并为 $h_{t+1}$。

实验显示可在 Terminal-Bench-2 上为不同基座学出模型特定 harness 指令并提升 held-out pass rate。

## 风险

若程序可随意改「操作系统级」边界，抽象会塌。**可编辑表面、权限与安全层应在循环之外**。见 [[Reward hacking]]。

## Sources

- arXiv: https://arxiv.org/abs/2606.09498  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
