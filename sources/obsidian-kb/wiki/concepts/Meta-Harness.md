---
title: "Meta-Harness"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, harness, meta-optimization, coding-agent]
aliases: [Meta Harness, meta-harness]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - Harness Engineering
  - Context Engineering
  - Self-Harness
  - Meta Context Engineering
confidence: high
---

# Meta-Harness

一句话：用 coding agent **搜索并优化 harness 本身**——被优化对象是决定信息如何被存储、检索、呈现给模型的代码。

## 来源

Lee et al. 2026（arxiv:2603.28052），经 Weng 综述。名字里的 Meta- 表示：这是一个用于优化 harness 的 harness。

## 机制要点

- **Proposer** 本身是编码 agent  
- 执行历史走文件系统（`grep` / `cat`），不把全部历史塞进单一 prompt  
- 候选 harness 以字典/目录形式存放：源码、分数、rollout、状态  
- 循环迭代创建候选，只保留合格者；输出常在 Pareto 前沿上  

## 启示

一旦 harness 设计成为可执行搜索空间，强 coding agent 就能利用人类工程师同一设计空间。这把优化对象从提示词推进到 **harness code**，衔接 [[Harness Engineering]] 的演进路径。

## Sources

- arXiv: https://arxiv.org/abs/2603.28052  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
