---
title: "Self-Taught Optimizer"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, STOP, self-improvement, scaffolding]
aliases: [STOP, Self-Taught Optimizer]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - Self-Harness
  - Meta-Harness
  - 递归自我改进
  - Harness Engineering
confidence: high
---

# Self-Taught Optimizer

一句话：递归改进的是**改进器 $I$ 本身**，而不只是当前解 $s$。

## 来源

STOP（Zelikman et al. 2023，arxiv:2310.02304）。

## 核心形式

种子改进器 $I_0$ 接收初始解 $s$、效用 $u$、黑盒模型 $M$，返回改进解 $s'=I(u,s;M)$。目标是改进 $I$。

元效用：改进器在下游任务集合上的平均效用。自我更新：

```text
I_t = I_{t-1}(û, I_{t-1}; M)
```

实验中发现的策略包括遗传算法、分解改进、提示词 bandit、模拟退火、调温度、beam/tree search 等——类似把 harness 工作流当成可优化对象。

## 警示

STOP 在 GPT-4 上可提升下游平均表现，在更弱模型上反而下降。**递归结构不够，基础模型必须足够强** 才能改进机制。

## Sources

- arXiv: https://arxiv.org/abs/2310.02304  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
