---
title: "Meta Context Engineering"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, context, MCE, meta-optimization, agent]
aliases: [MCE, Meta Context Engineering]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - Context Engineering
  - Agentic Context Engineering
  - Meta-Harness
  - Harness Engineering
confidence: high
---

# Meta Context Engineering

一句话：把「如何管理上下文」与「上下文里有什么」分开；**元层演化技能，基础层优化上下文**。

## 来源

MCE（Ye et al. 2026，arxiv:2601.21557），经 Weng 综述整理。

## 双层优化

技能 $s$ 定义上下文函数 $c_s=(\rho_s, F_s)$：

- $\rho_s$：静态组件（提示词、知识库、代码库）
- $F_s$：动态算子（搜索、选择、过滤、格式化）

```text
内层：给定技能 s，在训练数据上找最佳上下文 c_s*
外层：找在验证集上表现最好的技能 s*
```

元层 agent 对历史技能做 agentic crossover；基础层工程师执行技能并从 rollout 反馈学习上下文函数。

## 与 ACE 的差别

- [[Agentic Context Engineering]] 仍用手工规则维护 playbook 结构  
- MCE 用**自由形式技能**存储任务关键知识，技能与上下文一起演化  
- 实现上常把上下文函数实例化为专用目录中的文件（如 `skill.md` + 动态 rollout）

## Sources

- arXiv: https://arxiv.org/abs/2601.21557  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
