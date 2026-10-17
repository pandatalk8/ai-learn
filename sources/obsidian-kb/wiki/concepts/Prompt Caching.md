---
title: "Prompt Caching"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, performance, inference, codex, responses-api]
aliases: [prompt caching, cache hit, exact prefix cache]
sources:
  - sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md
related:
  - Agent Loop
  - Context Compaction
  - Codex
  - Context Engineering
confidence: high
---

# Prompt Caching

一句话：推理时复用与**前缀完全一致**的 prompt 已算结果，使采样从近似二次方变为线性。

## Codex 语境（OpenAI）

- 新 prompt 应把旧 prompt 作为 **exact prefix** 扩展  
- 静态内容（instructions、tools 等）靠前；可变内容靠后  
- Cache miss 典型原因：中途改 tools / model / sandbox / cwd；MCP 工具枚举顺序不稳定  

策略：中途配置变化时，**追加**新的 developer/user 消息说明变化，而不是改写更早的 item。

## Sources

- `sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md`
- https://platform.openai.com/docs/guides/prompt-caching
