---
title: "Responses API"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, OpenAI, API, inference, codex]
aliases: [OpenAI Responses API, /v1/responses]
sources:
  - sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md
related:
  - Codex
  - Agent Loop
  - Prompt Caching
  - Context Compaction
confidence: high
---

# Responses API

一句话：OpenAI 侧驱动 Codex 等 agent **模型 inference** 的 HTTP API；客户端提交 `instructions` / `tools` / `input`，服务端组装最终 prompt。

## Codex 使用的端点

| 场景 | 端点 |
|---|---|
| ChatGPT 登录 | `https://chatgpt.com/backend-api/codex/responses` |
| API key | `https://api.openai.com/v1/responses` |
| 本地 oss（ollama 等） | 默认 `http://localhost:11434/v1/responses` |

返回 SSE 流（`response.*` 事件）供 CLI 做 UI 流式与后续 `input` 追加。

## 设计选择（Codex）

- 默认**不**用 `previous_response_id`，以保持无状态与 ZDR 友好  
- 依赖 prompt caching + compaction 管性能与窗口  

## Sources

- `sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md`
- https://platform.openai.com/docs/api-reference/responses
