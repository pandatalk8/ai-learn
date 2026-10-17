---
title: "Darwin Gödel Machine"
type: entity
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, evolutionary-search, harness, coding-agent]
aliases: [DGM, Darwin Godel Machine, Darwin Gödel Machine]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - Harness Engineering
  - AlphaEvolve
  - Meta-Harness
  - Self-Harness
confidence: high
---

# Darwin Gödel Machine

一句话：在**固定模型**下演化可编辑的 harness 代码仓库——coding agent 被允许修改自己的 harness。

## 来源

DGM（Zhang et al. 2025，arxiv:2505.22954），经 Weng 综述。

## 循环概要

1. 池中从一编码 agent 开始  
2. 按性能与子代数选父代，修改并分叉  
3. 父代读自己的 benchmark 日志，提出 harness 改进（bash + editor）  
4. 评估新 agent，足够好则入池  
5. 迭代至停止条件  

报告：以 Claude 3.5 Sonnet 与简单初始 harness 时，SWE-bench Verified / Polyglot 可接近或超过部分手工 agent。

## Sources

- arXiv: https://arxiv.org/abs/2505.22954  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
