---
title: "AlphaEvolve"
type: entity
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, evolutionary-search, coding-agent, Google]
aliases: [AlphaEvolve]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - Harness Engineering
  - Darwin Gödel Machine
  - 多样性坍塌
  - 评估器设计
confidence: high
---

# AlphaEvolve

一句话：编码 agent 驱动的**进化式搜索**系统——维护候选程序池，用冻结 LLM 生成 diff，评估并保留成功子代。

## 来源

Novikov et al. 2025（arxiv:2506.13131），经 Weng 综述。

## 设计要点

- 提示含父程序、结果、指令，有时含元信息  
- 全仓可访问，但可演化区域用 `# EVOLVE-BLOCK-START/END` 标记  
- 元提示词可与指令、上下文共同演化  

适合候选可自动评估、适应度易量化的问题（kernel、算法竞赛等）；评估模糊时吃力。

## Sources

- arXiv: https://arxiv.org/abs/2506.13131  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
