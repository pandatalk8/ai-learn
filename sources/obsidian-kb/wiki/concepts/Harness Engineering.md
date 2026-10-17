---
title: "Harness Engineering"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, agent, harness, loop-engineering, context-engineering, RSI]
aliases: [harness, agent harness, harness engineering, 套件工程, Agent 运行时]
sources:
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md
  - raw/notes/2026-06-28-loop-engineering-harness-engineering.md
  - sources/clips/2026-06-14-omarsar0-autonomous-long-running-coding-agents.md
related:
  - 递归自我改进
  - Loop Engineering
  - Context Engineering
  - 自动化研究
confidence: high
---

# Harness Engineering

一句话：Harness 是包在基础模型外面的部署与运行时系统——它决定模型如何规划、调用工具、管理上下文、保存产物和评估结果；**Harness Engineering** 就是把这一层当成可设计、可测试、可进化的工程对象。

## 为什么重要

模型预训练后的 eval 分数只反映「裸模型」能力。真实任务里，模型必须通过部署层与世界交互。Claude Code、Codex 一类产品说明：**同一代模型，harness 好坏会直接决定可用性和生产力**。

相对早期「Agent = LLM + 记忆 + 工具 + 规划 + 行动」，harness engineering 还包含：

- 工作流 / 循环设计（loop）
- 评估与权限控制
- 持久状态管理
- 子 agent 与后台任务
- 上下文如何被构造与压缩

它更接近操作系统或 IDE 运行时，而不是一组 prompt 模板。

## 核心设计模式

| 模式 | 含义 |
|---|---|
| 工作流自动化 | plan → execute → observe/test → improve，直到目标达成 |
| 文件系统作持久记忆 | 日志、diff、轨迹落盘；上下文只加载当前必要片段 |
| 子 agent / 后台任务 | 并行探索、隔离污染；父 agent 做进程管理 |
| 编码 agent 标准工具面 | 文件、shell、LSP/git、搜索、artifact、委派 |

## 优化对象会升级

随着模型变强，被优化的对象会从自然语言提示，转向可执行系统：

```text
prompts → structured context → workflow → harness code → optimizer code
```

常见研究分支：

- **Context Engineering**：ACE / MCE 等把上下文当成可演化 playbook 或文件系统函数
- **Meta-Harness**：用编码 agent 搜索更好的 harness 代码
- **Workflow 搜索**：ADAS、AFlow 等把 agent 工作流当成可搜索程序空间
- **Self-Improving Harness**：STOP、Self-Harness、AlphaEvolve、Darwin Gödel Machine 等优化改进机制本身

## 与 Loop Engineering 的关系

Loop 强调迭代循环；**真正决定循环是否沿目标进化的，是 harness**。没有稳定评估、状态和权限边界，loop 只是反复生成。

个人笔记见：`raw/notes/2026-06-28-loop-engineering-harness-engineering.md`。

## 近期 RSI 路径中的位置

Weng 的判断：近端递归自我改进更可能先发生在 harness / 训练流水线 / 部署系统，而不是模型直接改写权重。成熟 harness 支持 auto-research 与自我改进循环；更强模型反过来减少对过度工程化 harness 的依赖。

详见 [[递归自我改进]]。

## 风险

- 评估器不可靠 → 优化到错误目标
- reward hacking
- 上下文与记忆生命周期失控
- 多样性坍塌、负结果被丢掉
- 短期任务成功 vs 长期代码库健康冲突
- 人类需要上移到更高抽象的监督点，而不是被移除

## Sources

- 源笔记：[wiki/sources/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md](../sources/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md)
- 原文剪藏：`sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
- 中文全译：`sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md`
- 个人判断：`raw/notes/2026-06-28-loop-engineering-harness-engineering.md`
- 相关：`sources/clips/2026-06-14-omarsar0-autonomous-long-running-coding-agents.md`
