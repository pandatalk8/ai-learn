---
title: "Context Compaction"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, context, memory, codex, agent]
aliases: [compaction, auto-compact, /compact, context compression]
sources:
  - sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md
related:
  - Agent Loop
  - Context Engineering
  - Prompt Caching
  - Codex
confidence: high
---

# Context Compaction

一句话：当 token 数超过阈值时，把对话 `input` **换成更短但仍有代表性的 item 列表**，腾出 context window 继续跑 agent。

## Codex 演进

1. **早期**：用户手动 `/compact`，用现有对话 + 摘要指令再问 Responses API，用摘要 assistant message 作为新 `input`  
2. **现制**：Responses API 的 `/responses/compact`；返回含 `type=compaction` 与 `encrypted_content` 的 item 列表，可保留模型对原对话的 latent 理解  
3. 超过 `auto_compact_limit` 时 **自动** compaction  

## Sources

- `sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md`
