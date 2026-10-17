---
title: "AFlow"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, agent, workflow, MCTS, AFlow]
aliases: [AFlow]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - ADAS
  - 自动化研究
  - Harness Engineering
confidence: high
---

# AFlow

一句话：把 agentic 工作流表示成**图**（节点=LLM 动作，边=代码逻辑），用 **MCTS** 搜索更好的工作流。

## 来源

Zhang et al. 2025（arxiv:2410.10762）。

## 优化步骤（概要）

1. 模板初始化 $W_0$  
2. 按分数与探索的软混合选节点  
3. LLM 基于评估表现提出修改并扩展  
4. 执行评估  
5. 有改进则加回树（预算内）  
6. top-k 均分平台或预算耗尽则停  

在 QA、代码、数学任务上，相对手工方法与 [[ADAS]] 有改进（据论文与 Weng 综述）。

## Sources

- arXiv: https://arxiv.org/abs/2410.10762  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
