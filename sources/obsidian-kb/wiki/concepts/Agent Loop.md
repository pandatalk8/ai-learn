---
title: "Agent Loop"
type: concept
status: reviewed
created: 2026-07-10
updated: 2026-07-10
tags: [AI, agent, loop, harness, codex]
aliases: [agent loop, the agent loop, conversation turn, agentic loop]
sources:
  - sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md
  - sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md
related:
  - Loop Engineering
  - Harness Engineering
  - Codex
  - Context Engineering
confidence: high
---

# Agent Loop

一句话：Agent 在「构造 prompt → 模型 inference → 可选 tool call → 把工具结果写回 prompt → 再 inference」之间循环，直到产出面向用户的 assistant message。

## 标准形态（Codex / 通用）

```text
user input
   → build prompt
   → model inference
        ├─ assistant message  →  turn 结束，控制权回用户
        └─ tool call → execute tool → append output → 再 inference
```

- **Turn**：从用户输入到 agent 返回 assistant message 的旅程；内部可有多次 inference↔tool 迭代。  
- **Thread**：Codex 中的会话；新用户消息会带上历史 messages 与 tool calls。  

## 与 Loop Engineering / Harness

- [[Loop Engineering]]：强调循环能否沿目标**进化**  
- [[Harness Engineering]]：agent loop 是 harness 的核心 runtime  
- [[Codex]]：OpenAI 对 harness/agent loop 的产品化实现与开源 CLI  

## 工程要点（来自 OpenAI 文）

- Prompt 必须可缓存时保持 **exact prefix** 增长  
- Context window 管理与 compaction  
- 工具执行可改本地环境，因此「输出」不只有文本，也包括代码 diff  

## Sources

- `sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md`
- `wiki/sources/2026-01-23-openai-unrolling-the-codex-agent-loop.md`
