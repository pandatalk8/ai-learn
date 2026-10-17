---
title: "Unrolling the Codex agent loop"
type: source-summary
status: reviewed
created: 2026-07-10
updated: 2026-07-10
source: "sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md"
source_type: web-clip
author: "Michael Bolin"
organization: OpenAI
published: 2026-01-23
source_url: "https://openai.com/index/unrolling-the-codex-agent-loop/"
tags: [OpenAI, Codex, agent-loop, harness, Responses API, prompt-caching, context-window]
confidence: high
related_concepts:
  - "[[Loop Engineering]]"
  - "[[Harness Engineering]]"
  - "[[Context Engineering]]"
  - "[[Agent Loop]]"
related_entities:
  - "[[Codex]]"
  - "[[OpenAI]]"
---

# Unrolling the Codex agent loop

OpenAI 工程博客：对 **Codex harness / agent loop** 的技术拆解。作者 Michael Bolin（OpenAI Member of the Technical Staff），2026-01-23。

| 字段 | 值 |
|---|---|
| 原文剪藏 | `sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md` |
| 原文链接 | https://openai.com/index/unrolling-the-codex-agent-loop/ |
| 配图 | 5 张 SVG 图，`sources/clips/imgs/2026-01-23-openai-unrolling-codex-agent-loop-*.svg` |

## 核心观点

Codex 产品线（CLI / Cloud / VS Code 等）共享同一 **harness**：核心是 **agent loop**——编排用户、模型与工具调用，使 LLM 能完成有意义的软件工作。

### Agent loop

1. 把用户输入编入 **prompt**  
2. 经 **inference**（Responses API）采样模型  
3. 模型要么给出最终 **assistant message**，要么发起 **tool call**  
4. Agent 执行工具、把输出追加进 prompt，再次 inference  
5. 循环直到 assistant message；一 turn 内可有多次 inference↔tool 迭代  

多轮对话中，历史消息与 tool call 会进入新 turn 的 prompt，上下文不断变长 → **context window management** 是 harness 职责。

### 初始 prompt 构造

Responses API 侧把 client 提交的 `instructions` / `tools` / `input` 组装成带 role 的 item 列表（`system` > `developer` > `user` > `assistant`）。Codex 侧还会注入：

- sandbox / shell 权限相关 developer 消息  
- 可选 `config.toml` 的 developer instructions  
- 聚合的 user instructions（`AGENTS.md` / `AGENTS.override.md`、项目树文档、skills 等）  

### 性能

- 对话增长使发往 API 的 JSON 呈二次方趋势；Codex **不用** `previous_response_id`，以保持无状态与 ZDR 友好  
- 依赖 **prompt caching**：新 prompt 必须以旧 prompt 为 **exact prefix**；改 tools/model/sandbox/cwd 等可能 cache miss  
- 上下文快满时用 **compaction**（现走 `/responses/compact`）压缩 `input`

## 与本库关系

- 直接支撑 [[Codex]]、[[Loop Engineering]]、[[Harness Engineering]]  
- Lilian Weng 文引用了其中 agent loop 图：`sources/clips/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md`  
- 与 [[Context Engineering]]、prompt caching、工具 schema 稳定性（参见 Armin 文）相关  

## Sources

- 全文剪藏：`sources/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.md`
- 图谱：`.kb/links/clips/2026-01-23-openai-unrolling-the-codex-agent-loop.yaml`
