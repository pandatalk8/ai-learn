---
title: "Claude Design System Prompt"
author: Trystan-SA
source_url: https://github.com/Trystan-SA/claude-design-system-prompt
source_platform: GitHub
repo: Trystan-SA/claude-design-system-prompt
published: unknown
captured: 2026-07-05
type: clip
lang: en
license: MIT
tags: [ai, design, design-system, prompt-engineering, claude, codex, frontend, accessibility, ai-slop]
capture_status: summary
---

# Claude Design System Prompt

GitHub repository: <https://github.com/Trystan-SA/claude-design-system-prompt>

## Summary

This repository packages a reverse-engineered Claude Design-style system prompt plus a procedural skill library. Its goal is to turn a general LLM into an opinionated design collaborator that can produce HTML/CSS/JS artifacts while behaving more like a designer than a generic code generator.

The central thesis is that AI design output fails when it blindly fills space with fashionable defaults. The prompt pushes the model toward intentional design decisions: understand the audience and goal first, root work in existing brand or system context, remove filler, commit to a coherent aesthetic, preserve accessibility, build real interaction states, and run explicit review passes before delivery.

## What Is Included

The repo has two variants:

- `claude/`: a Claude Code / Claude.ai-oriented version, with `system-prompt.md` and a `skills/` directory.
- `codex/`: an OpenAI Codex-oriented version, with an `AGENTS.md`, a Codex-adapted `system-prompt.md`, and the same skills adjusted for sequential review instead of parallel subagents.

The skill library has 14 procedures grouped into three categories:

- Production skills: discovery questions, aesthetic direction, wireframes, slide decks, interactive prototypes, tweak panels, and high-fidelity variations.
- System skills: design-token extraction and reusable-component extraction.
- Review skills: accessibility audit, AI-slop check, hierarchy/rhythm review, interaction-state pass, and final polish pass.

## Main Design Principles

The system prompt is organized into 20 chapters. The most reusable principles are:

1. Treat the model as a designer using code, not a code generator that happens to make visuals.
2. Ask one focused round of clarifying questions when audience, format, fidelity, brand context, or variation count are unclear.
3. Read existing brand assets, design systems, code, screenshots, or UI kits before inventing new visual language.
4. Remove filler: placeholder claims, redundant sections, decorative clutter, ungrounded stats, and repeated calls to action.
5. Avoid generic AI aesthetics such as gratuitous gradients, decorative emoji, weak hand-drawn SVG illustrations, arbitrary rounded cards, and silent default typography choices.
6. Use deliberate visual hierarchy: size, color, weight, position, density, and spacing scales should guide attention.
7. Treat accessibility as a baseline: contrast, semantic HTML, keyboard navigation, visible focus, labels, alt text, reduced motion, and clear validation states.
8. Build components and tokens instead of one-off pages.
9. Use the web medium properly: CSS Grid, custom properties, `oklch()`, container queries, real state, and real interactions.
10. Prefer fewer polished ideas over many shallow ones.

## Model Calibration Notes

The README argues that newer Anthropic frontier models benefit from calmer, condition-based prompting rather than quota-heavy imperative prompting. It also notes that optional capabilities can under-trigger, so skill triggers should be explicit. For visual variety, it recommends explicit variation specs rather than relying on sampling randomness.

The Codex variant is separately maintained and does not depend on the Claude-specific subagent assumptions.

## Knowledge Base Notes

This source is useful for:

- Building a reusable prompt or AGENTS.md style guide for AI-assisted frontend/design work.
- Defining a checklist for detecting "AI-slop" in generated UI.
- Separating design-agent workflow into production, system extraction, and review procedures.
- Comparing Claude-style and Codex-style agent instruction patterns.
- Writing about the shift from prompt tricks to process design: skill triggers, review gates, artifacts, and explicit operating rules.

## Key Claims To Verify Before Reuse

- The repository describes itself as reverse-engineered from Claude Design. Treat this as the repository author's framing, not as an official Anthropic claim.
- Model names and calibration notes may become stale quickly; re-check the README before citing current model behavior.
- The detailed prompt and skills are MIT licensed, but any claim about Anthropic's internal implementation should be phrased cautiously.

