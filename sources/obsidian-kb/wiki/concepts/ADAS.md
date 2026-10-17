---
title: "ADAS"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, agent, workflow, search, ADAS]
aliases: [Automated Design of Agentic Systems, ADAS]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - 自动化研究
  - AFlow
  - Meta-Harness
  - Harness Engineering
confidence: high
---

# ADAS

一句话：**Automated Design of Agentic Systems**——把 agent 工作流设计本身做成优化问题，由元 agent 用代码搜索新设计。

## 来源

Hu et al. 2025（arxiv:2408.08435）。

## 元 agent 搜索循环

1. 用 CoT、self-refine 等简单 agent 初始化 archive  
2. 元 agent 受 archive 启发，**用代码**写新 agent（先高层描述再实现；经 self-refine 检查新颖性）  
3. 评估候选，成功者入 archive  
4. 迭代至预算用尽  

核心思想：工作流设计空间巨大，应靠算法搜索而不只靠手写。对比见 [[AFlow]]。

## Sources

- arXiv: https://arxiv.org/abs/2408.08435  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
