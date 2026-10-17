---
title: "Self-Evolving Multi-Agent Systems via Decentralized Memory (DecentMem)"
author: alphaXiv (@askalphaxiv)
source_url: https://x.com/askalphaxiv/status/2066362692965691530
paper_url: https://www.alphaxiv.org/abs/2605.22721
paper_id: "2605.22721"
source_platform: X
tweet_id: "2066362692965691530"
published: 2026-06-15
captured: 2026-06-16
type: clip
lang: en
tags: [ai, multi-agent-systems, memory, decentralized-memory, agents, llm-research, specialization, paper]
images:
  - imgs/2026-06-15-alphaxiv-decentmem-self-evolving-agents-1.jpg
---

# Self-Evolving Multi-Agent Systems via Decentralized Memory (DecentMem)

**Paper announcement by alphaXiv (@askalphaxiv)**
**Published on X: 2026-06-15 · ~27K views, 17 replies**
**Paper:** https://www.alphaxiv.org/abs/2605.22721 (arXiv id 2605.22721)

![Figure](imgs/2026-06-15-alphaxiv-decentmem-self-evolving-agents-1.jpg)

Announcement text captured verbatim:

> "Self-Evolving Multi-Agent Systems via Decentralized Memory"
>
> Multi-agent systems usually share one memory pool, but that makes agents converge toward the same behavior and lose useful specialization. This paper gives each agent its own memory, split into reuse and exploration [to le]arn from past collaboration without collapsing into one shared strategy.
>
> This paper's DecentMem gets O(log T) regret, up to 23.8% better accuracy than centralized memory, and up to 49% fewer tokens.

## Key Points

- **Problem:** a shared/centralized memory pool makes agents converge to the same behavior and lose specialization.
- **Method (DecentMem):** each agent gets its own memory, partitioned into a *reuse* component and an *exploration* component, so it learns from past collaboration without collapsing into one shared strategy.
- **Results:** O(log T) regret; up to **23.8%** higher accuracy vs. centralized memory; up to **49%** fewer tokens.

## Notes For The Knowledge Base

The X announcement text (above) is the captured source. The alphaXiv abstract page (2605.22721) renders client-side and was not auto-fetchable; quantitative claims (23.8% accuracy, 49% fewer tokens, O(log T) regret) come from the announcement and should be verified against the paper PDF before citation. Strong reference for pieces on agent memory architecture and multi-agent specialization.
