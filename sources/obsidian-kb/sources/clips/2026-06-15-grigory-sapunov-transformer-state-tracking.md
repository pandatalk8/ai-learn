---
title: "Transformers have a topological flaw in tracking dynamic state"
author: Grigory Sapunov
source_url: https://x.com/che_shr_cat/status/2066476519271125209
source_platform: X
tweet_id: "2066476519271125209"
published: 2026-06-15
captured: 2026-06-16
type: clip
lang: en
tags: [ai, transformers, state-tracking, architecture, llm-limitations, deep-learning, expressivity]
images:
  - imgs/2026-06-15-grigory-sapunov-transformer-state-tracking-1.jpg
capture_status: partial
---

# Transformers have a topological flaw in tracking dynamic state

**By Grigory Sapunov (@che_shr_cat)**
**Published on X: 2026-06-15 · ~24K views, 5 replies · thread (🧵)**

Opening tweet (1/) captured verbatim:

> 1/ Standard transformers have a fundamental topological flaw: they cannot track dynamic states over time without running out of layers. Once a state representation reaches the top layer of the feedforward stack, the model's ability to update its belief collapses. 🧵

![Figure](imgs/2026-06-15-grigory-sapunov-transformer-state-tracking-1.jpg)

## Notes For The Knowledge Base

This is the head of a thread; only tweet 1/ is captured here (remaining tweets are gated behind X login). The core claim: standard transformers have a depth-bounded limitation on tracking dynamic state — once a state reaches the top feedforward layer there are no more layers left to keep updating it, so belief-updating "collapses." Connects to the broader literature on transformer expressivity / state-tracking limits (cf. work on transformers vs. RNNs/state-space models for sequential state). **TODO:** re-capture the full thread from an authenticated session before citing specifics.
