---
title: "Lisa Su's $1,499 lunchbox PC ran a 235B model on stage"
author: Brooks Whale X (@BrooksWhaleX)
source_url: https://x.com/BrooksWhaleX/status/2066305081444876410
reference_url: https://www.amd.com/en/products/processors/desktops/ryzen/ryzen-ai-halo.html
source_platform: X
tweet_id: "2066305081444876410"
published: 2026-06-15
captured: 2026-06-16
type: clip
lang: zh
tags: [local-llm, amd, ryzen-ai-max, strix-halo, unified-memory, mini-pc, lisa-su, on-device-ai, hardware, qwen3]
capture_status: text-only
---

# Lisa Su's $1,499 lunchbox PC ran a 235B model on stage

**By Brooks Whale X (@BrooksWhaleX)**
**Published on X: 2026-06-15 · ~599,857 views**

## Captured Tweet (zh)

> 震惊：苏姿丰 1,499 美元的"饭盒"把英伟达 4000 美元的 AI 怪兽碾成渣！AMD CEO 苏姿丰走上台，单手举着一台饭盒大小的 PC，现场跑起了一个 2350 亿参数的模型。没有数据中心。没有云。没有租来的 GPU。里面那块芯片是 AMD Ryzen AI Max+ 395。

## The Chip (reference: amd.com product page)

AMD Ryzen AI Max+ 395 — codename Strix Halo.

- 16 Zen 5 cores / 32 threads
- Integrated Radeon 8060S iGPU (RDNA 3.5, 40 CUs)
- XDNA 2 NPU, ~50 TOPS
- Up to 128GB unified memory, shared across CPU / GPU / NPU

## Summary

At an AMD event, Lisa Su held up a lunchbox-sized mini PC and ran a ~235B-parameter LLM (Qwen3-235B class) locally — no datacenter, no cloud, no rented GPUs. The claimed price point is $1,499.

The real enabler is **unified memory**, not raw NPU throughput. Consumer discrete GPUs cap out around 24GB VRAM, so a 235B model simply won't fit. Strix Halo's up-to-128GB pool shared by CPU/GPU/NPU lets the model load and run on-device — slowly, but locally and offline. The honest framing is "it fits and runs," not "it beats Nvidia on speed"; the original tweet's "碾成渣 (crushes Nvidia)" overclaims.

## Notes For The Knowledge Base

Strong, citable data point for the on-device / local-LLM thesis: the binding constraint for running frontier-size models locally is memory capacity, and AMD's unified-memory APUs attack exactly that wall. Pairs directly with [[2026-06-15-gipp-gmktec-evo-x2-claude-code-offline]] (mini PC running a coding agent offline, $1,800 once vs $200/mo) — both are evidence for the "one-time hardware vs recurring cloud subscription" economic argument. Use the accurate framing (unified memory as the real lever), not the "crushes Nvidia" hook, when citing.

A rewritten zh tweet based on this clip lives outside the vault (tweet-generator output, 2026-06-16).
