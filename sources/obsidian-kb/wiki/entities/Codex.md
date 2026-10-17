---
title: "Codex"
type: entity
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, coding-agent, OpenAI, product, harness]
aliases: [OpenAI Codex, Codex agent, Codex CLI, Codex harness]
sources:
  - sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
  - sources/clips/2026-07-04-armin-ronacher-better-models-worse-tools.md
related:
  - Agent Loop
  - Harness Engineering
  - Loop Engineering
  - OpenAI
  - Claude Code
  - Context Engineering
confidence: high
---

# Codex

一句话：OpenAI 的软件 agent 产品族（CLI / Cloud / IDE 等）共享同一 **harness**——核心是 [[Agent Loop]] 与执行逻辑。

## 产品与 harness

| 层面 | 说明 |
|---|---|
| 表面 | Codex CLI、Codex Cloud、VS Code 扩展等 |
| 共享核心 | Codex harness：agent loop + 工具执行 + 上下文管理 |
| 开源 | CLI 核心见 https://github.com/openai/codex |

OpenAI 工程文（Bolin, 2026-01-23）把 harness 定义为：为所有 Codex 体验提供核心 agent loop 与执行逻辑，并通过 CLI 暴露。

## Agent loop 要点

1. 组装 prompt（system/developer/user instructions、tools、input）  
2. 经 **Responses API** 做 inference  
3. tool call → 本地执行 → 追加输出 → 再 inference  
4. 直到 assistant message，turn 结束  
5. 性能：prompt caching（exact prefix）、compaction、尽量避免 mid-thread cache miss  

详见：`sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md`

## 在其他本地材料中的角色

- Lilian Weng：用 Codex agent loop 图说明 coding harness 模式  
- Armin Ronacher：对比闭源模型与相对更可观察的 harness  

## Sources

- `sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md`
- `wiki/sources/2026-01-23-openai-unrolling-the-codex-agent-loop.md`
- https://openai.com/index/unrolling-the-codex-agent-loop/
- https://github.com/openai/codex
