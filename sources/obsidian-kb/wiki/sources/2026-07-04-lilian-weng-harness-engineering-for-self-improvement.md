---
title: "Harness Engineering for Self-Improvement"
type: source-summary
status: reviewed
created: 2026-07-10
updated: 2026-07-10
source: "sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md"
source_zh: "sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md"
source_type: web-clip
author: "Lilian Weng"
published: 2026-07-04
source_url: "https://lilianweng.github.io/posts/2026-07-04-harness/"
tags: [AI, agent, harness-engineering, recursive-self-improvement, context-engineering, auto-research]
confidence: high
related_concepts:
  - "[[Harness Engineering]]"
  - "[[递归自我改进]]"
  - "[[Loop Engineering]]"
  - "[[Context Engineering]]"
related_entities:
  - "[[Lilian Weng]]"
graph:
  - ".kb/links/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.yaml"
  - ".kb/links/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.yaml"
---

# Harness Engineering for Self-Improvement

Lilian Weng 关于 harness engineering 与递归自我改进（RSI）的长文综述。

| 字段 | 值 |
|---|---|
| 原文剪藏 | `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md` |
| 中文全译 | `sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md` |
| 原文链接 | https://lilianweng.github.io/posts/2026-07-04-harness/ |
| 发表 | 2026-07-04 |
| 配图 | 17 张，位于 `sources/clips/imgs/2026-07-04-lilian-weng-harness-engineering-for-self-improvement-*.png` |

## 核心观点

Weng 把近期 agent 系统进展放进 **递归自我改进（RSI）** 框架：近期实用路径不太可能从模型直接改写权重开始，而更可能从模型周围的部署系统与 harness 开始。

**Harness** 是围绕基础模型的系统层：编排执行，并决定模型如何思考与规划、调用工具、管理上下文、存储产物、评估结果。

文章把 harness engineering 从早期「LLM + 记忆 + 工具 + 规划 + 行动」的 agent 框架中区分出来，强调它更接近**运行时与软件系统设计**，包括工作流、评估、权限、持久状态、上下文工程和自我改进机制。

## 关键设计模式

1. **工作流自动化**：plan → execute → observe/test → improve，直到目标达成。
2. **文件系统作为持久记忆**：长周期 agent 应把日志、diff、轨迹落在文件里，而不是全塞进上下文。
3. **子 agent 与后台任务**：并行假设搜索、隔离子任务；父 agent 负责启动、检查、取消与合并。
4. **编码 agent harness**：Claude Code / Codex 等接口趋同，围绕文件、shell、LSP/git、搜索、artifact、后台进程与 agent 委派。

## 优化对象的升级

演进路径大致是：

```text
提示词 → 结构化上下文 → 工作流 → harness 代码 → 优化器代码
```

主要路线：

| 路线 | 代表工作 | 要点 |
|---|---|---|
| Context Engineering | ACE、MCE、Meta-Harness | 上下文可演化；最终优化「管上下文的代码」 |
| Workflow Design | AI Scientist、ScientistOne、Autodata、ADAS、AFlow | 手写或搜索 agent 工作流 |
| Self-Improving Harness | STOP、Self-Harness、AlphaEvolve、DGM 等 | 优化「改进机制」本身 |
| 与权重联合优化 | SIA 等 | harness 更新与参数更新同循环；证据仍偏早期 |

## 风险与瓶颈

- 评估器模糊、难校准
- 上下文与记忆生命周期
- 负结果如何保留
- 多样性坍塌
- reward hacking
- 短期 benchmark 目标 vs 仓库/系统长期健康
- 人类应上移监督栈，而不是被移出回路

## 对知识库的用途

可作为以下主题的核心外部来源：

- [[Harness Engineering]]
- [[递归自我改进]]
- [[Loop Engineering]]
- Context Engineering / 长期记忆
- 自动化研究系统
- agent 自我改进与评估器设计

## 相关本地材料

- 原文：`sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`
- 中译：`sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.md`
- 个人笔记：`raw/notes/2026-06-28-loop-engineering-harness-engineering.md`
- 相关剪藏：`sources/clips/2026-06-14-omarsar0-autonomous-long-running-coding-agents.md`
- 相关剪藏：`sources/clips/2026-07-04-armin-ronacher-better-models-worse-tools.md`

## 知识图谱

机器边（正式层 `.kb/links/`）：

| 文件 | 角色 |
|---|---|
| `.kb/links/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.yaml` | 英文正式源 → 概念/实体/相关材料 |
| `.kb/links/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.zh-CN.yaml` | 中译 `derived_from` 英文源 |
| `.kb/links/concepts/Harness Engineering.yaml` | 概念中枢 |
| `.kb/links/concepts/递归自我改进.yaml` | RSI 子图 |
| `.kb/links/concepts/Loop Engineering.yaml` | Loop 子图 |
| `.kb/links/concepts/Context Engineering.yaml` | 上下文工程子图 |
| `.kb/links/entities/Lilian Weng.yaml` | 作者实体 |
| `.kb/links/raw/2026-06-28-loop-engineering-harness-engineering.yaml` | 个人判断 → 概念 |

人类入口：[[maps/AI技术]] · [[Harness Engineering]] · [[递归自我改进]] · [[Loop Engineering]] · [[Context Engineering]] · [[Lilian Weng]]
