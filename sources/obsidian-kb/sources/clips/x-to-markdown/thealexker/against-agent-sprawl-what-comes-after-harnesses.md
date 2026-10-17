---
title: "Against agent sprawl: what comes after harnesses"
author: "Alex Ker 🔭"
handle: "@thealexker"
source_url: "https://x.com/thealexker/status/2085808354660647405"
tweet_id: "2085808354660647405"
article_id: "2085803718755442688"
published: 2026-08-07
captured: 2026-08-10
type: x-article
language: en
status: source
media:
  - imgs/against-agent-sprawl-cover.jpg
  - imgs/co-harness-results.png
  - imgs/sia-overview.jpg
  - imgs/herdr-agent-depot.jpg
  - imgs/harness-depot-diagram.png
  - imgs/agent-manager-attention.png
---

# Against agent sprawl: what comes after harnesses

> Source: [Alex Ker on X](https://x.com/thealexker/status/2085808354660647405), August 7, 2026.

![A growing collection of agent interfaces](imgs/against-agent-sprawl-cover.jpg)

The best model is no longer the clear choice.

Engineers used to argue about models; now we argue about harness-model fit, because models are never shipped in isolation. Frontier labs post-train the two together and release harnesses tuned for their models. Instead of running N tabs of Claude Code, we now need to run a fleet of heterogeneous harnesses each for their model as a way to control for quality, performance, and cost. And this fleet has hundreds of context windows, yet you still have one as a human. In this essay, I'll make the case for why harness fleets are inevitable, why they break your attention, and what I think the new abstraction layer on top of harnesses looks like.

## Harness + model is becoming one artifact

The harness-model co-evolution is solidifying into a formal paradigm. Adapting a harness for a model and a model for a harness produces step-change improvements, as two recent papers show.

[Co-Harness](https://arxiv.org/pdf/2607.22688) (Meituan/AI2) alternates between harness and model optimization. A HarnessCritic analyzes failed trajectories, attributes harness-level failure modes, and proposes local updates. The model can then be trained on higher-quality rollouts produced by the improved harness, distilled into weights via SFT. Notably, two rounds of this loop beat a human-designed harness by ~25 points on average across AIME and HMMT on Qwen3-8B and Qwen3-32B. We’re shifting away from handcrafted harnesses to learned harnesses, paralleling how traditional ML feature engineering gave way to features learned from data.

![Co-Harness dual-loop overview](imgs/co-harness-results.png)

Similarly, [SIA](https://arxiv.org/pdf/2605.27276) (Hexo Labs) runs another algorithm to combine updates jointly within the weights themselves and the harness surrounding it. Rather than fixing the order of updates, a feedback agent determines and dynamically interleaves harness and weight updates after the trajectories and performance are observed. Harness updates edit the prompt, tools, and retry logic; weight updates run RL into a LoRA adapter. The interesting proposal here is that the dual optimization process is complementary: the harness makes the model agentic, i.e. making it useful in an ever-evolving set of tool-use and deployment settings, while weight updates build domain intuition that no prompt or scaffold can instill.

![SIA interleaves harness and model-weight updates](imgs/sia-overview.jpg)

As a broader takeaway, the capabilities of the models are not able to be expressed to the full extent if not tested on a good corresponding harness. In the worst case, benchmark numbers on an ill-fitting harness undersell how far the model has actually come. And once a harness optimizes itself against a particular model for a particular task, the pair becomes the optimized artifact: swap either half and you pay for it in performance and cost. Hence, the rational setup is a fleet, each harness running the model it was co-trained with, each specialized for different tasks. Claude Code paired with Claude models is the obvious example, and harness-profiles in LangChain's Deep Agents CLI point in the same direction for open models. So if the fleet of harnesses is coming and necessary to run in a many model future, the bottleneck, in turn, is your capacity.

## Depots: centralize your agents

Agent context windows keep growing but the human context window has remained stagnant. We are rate-limited by human attention, and our biology can never keep up with the rate of information we receive from LLMs today. The new cycle of development is this: we assign our ideas to our agents, only to be subjugated to their output stream, a wall of tokens overwhelming us into oblivion. It’s no wonder we feel like we’re working more and working harder than ever before.

The sprawl of agents calls for consolidation. The solution pattern is what I’ll call depots. You may have already built versions of your own or used a few of the early attempts at this on the market; examples include Gas Town, Conductor, and Herdr. And I believe depots will be the natural next abstraction and interface for managing multiple harnesses.

![Herdr as an example of an agent depot](imgs/herdr-agent-depot.jpg)

Example of what it looks like in Herdr.

Just like a train depot is a central location where trains start and terminate, a harness depot is the central location that dispatches and receives individual threads of work. More specifically, a depot is a central hub where agents inside harnesses can report on status, request human reviews, maintain durable execution and permissions, and internally cross-communicate to work as a team. If the harness is the rails that the model runs on, the depot is where these rails come together.

![A depot centralizes multiple coding-agent harnesses](imgs/harness-depot-diagram.png)

To dive deeper into why depots are needed, consider why we now frequently say that understanding, judgement, and review is now the bottleneck. @geoffreylitt recently wrote a great piece on how to understand what our agents produce [here](https://x.com/geoffreylitt/status/2072522251300409556). At the root of this, the constraint moved from our previous inability to complete desired work to now having too much output to digest, measure, then decide the direction to continue working. Much of “doing” has been handed off to agents, and what remains is the thing that surrounds it: goal-setting and evaluating with a high degree of discernment. Thus, the new type of work–that is, choosing and assessing the execution–will demand a new interface.

The interface will require more centralization to match our innate capacity for understanding. Up until recently, we cared about engineering the harness, or everything that wrapped around the model to make it useful. Formats like OpenAI-Compatible endpoints and MCPs made it convenient to standardize how we consume the tap of intelligence. However, *nothing* standardizes how we oversee that intelligence.

The naive versions of depots look like tmux, or having multiple windows of terminal open. Ghostty in particular is a popular choice for running many resource-hungry agents in your terminal due to its low resource profile and raw performance. As this continues, we will see an emerging class of friction-reduction and progress visibility software that will help you precisely manage all your tasks at the same time, and highlight the most critical output info in the context window for human decision-making.

Because many of the models are highly verbose, reading too much that is non-essential will slow you down. You don’t really care about which agents are working; you only want to know which agents need your attention. This is analogous to all individual contributors moving into the managerial class. The manager’s job is unblocking their direct reports when needed. The depot enables you, the newly minted manager, to focus your attention to where it’s immediately needed and unblock your team of agents.

![Trust in agents enables a higher level of abstraction](imgs/agent-manager-attention.png)

## Review is the new work

In order to combat the amount of code generated, depots will be a critical component that will also be responsible for a first pass local review. On the other hand, remote review should be reserved for human-eyes only. In other words, there needs to be a local code review or filter (by you and other AI agents) before creating the official PR for your teammates. Gas Town is great at this. The Refinery exists to streamline many agents (called polecats) merging their changes into a single project.

From the docs: Per-rig merge queue processor. When polecats complete work via gt done, the Refinery batches merge requests, run verification gates, and merge to main using a Bors-style bisecting queue. Failed MRs are isolated and either fixed inline or re-dispatched. Refinery can perform actions like CI checks (linting, formatting, etc.), Merge conflict management, and AI code reviews for quality and security. The result is then passed on officially as a PR. The other depots are catching up to this too. Generally, I expect to see more intermediate subreviews before the final human one to act as a counterweight to the volume of code generated.

Moreover, the future of human review of agentic work will not be on a line-by-line code level, or even at a PR level. This is because code reviews and pull requests were functionally built for human consumption–to be shared with the engineering manager or peers. Instead the new engineering process will involve changing the product at the feature level, which humans would approve or reject by visiting preview URLs, watching demo videos, or flipping through screenshots. Sandboxed test environments will be set up to mimic production, and run through various QA scenarios with real usage data. Cursor Cloud Agents is a good early example of this.

The overarching theme beyond harnesses is increasing signal to noise. Collaborating with tens to hundreds of agents means fielding their microtasks and interruptions within your narrow bandwidth. The depot's job is to collapse them: filter the output, prioritize it, and surface only the parts that need our judgement. The depot, the central command interface over our harnesses, is the natural abstraction through which we are able to manage many context windows efficiently without burning out our own.

As depots mature and bubble up what's actually essential and absorb the hand-holding, knowledge work will feel lighter. The future is less like a needy team pinging you around the clock and more like a feed: results arriving already shaped to your intent, agents intuiting what you want next.

## Capture note

The article text, links, formatting, and media order were recovered from the X article data. All six images were downloaded from X's media CDN and referenced locally.
