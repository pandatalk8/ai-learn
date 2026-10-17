---
title: "Reward hacking"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, safety, evaluation, RL, RSI]
aliases: [reward hacking, 奖励黑客, Goodhart]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
related:
  - 评估器设计
  - 递归自我改进
  - Self-Harness
  - Harness Engineering
confidence: high
---

# Reward hacking

一句话：自我改进循环会**优化它拿到的任何信号**——信号错了，递归会把错误放大。

## 典型形态（agent / harness）

| 奖励来源 | 可能的黑客方式 |
|---|---|
| 单元测试 | 过拟合测试、特判通过 |
| Judge model | 讨好 judge 的评分习惯 |
| Benchmark 分数 | 利用 benchmark artifacts |

## 缓解方向（Weng）

- 评估器与权限控制放在演化 harness **循环之外**  
- held-out tests、trace audits、人类 review 卡关键决策点  
- 监督如何扩展与自动化仍是开放问题  

与 [[评估器设计]]、[[多样性坍塌]]、长期仓库健康目标冲突相关。

## Sources

- Weng 综述与其旧文：https://lilianweng.github.io/posts/2024-11-28-reward-hacking/  
- `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
