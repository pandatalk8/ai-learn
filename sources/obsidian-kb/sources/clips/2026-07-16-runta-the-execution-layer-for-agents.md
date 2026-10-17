---
title: "Runta: the execution layer for agents"
author: Guanlan Dai
organization: Runta
source_url: https://runta.com/blog/runta-the-execution-layer-for-agents/
source_platform: runta-blog
published: 2026-07-16
captured: 2026-07-18
type: web-clip
lang: en
capture_status: full-text-html
kb_role: formal-source
reading_time: "4 min"
tags: [agents, announcement, execution-layer, agent-security, access-control, observability]
description: "Runta presents an execution layer for governing AI agents at the operating-system and network boundaries, covering resource use, access, credentials, and audit records."
---

# Runta: the execution layer for agents

For most of my career, I built the systems that keep software in line.

As an early tech lead on Cloudflare’s edge team, I worked on the edge proxy, caching, and WAF, the front door every request passes through before it reaches an application. At Kong I built the gateway primitives companies still use to govern their services: authentication, authorization, rate limiting, and circuit breaking. All of it rests on one assumption: software decides what it will do before it runs. It follows the paths someone wrote, so you can stand at the front door, check what comes and goes, and trust that what you allowed is all that can happen.

![Software Era](https://runta.com/blog/runta-the-execution-layer-for-agents/software-era.png)

An agent doesn’t follow paths written in advance; it decides what to do as it runs. A hidden instruction in the data it just read can turn a model call, a tool call, or a credential into a real, legitimate-looking action. Every system I built watched who came and went, while assuming the decisions inside were already settled. But an agent makes those decisions inside, as it runs, and there is no front door for them. The only place to govern an agent is underneath it, where its actions become real.

## What is Runta

That realization is what led us to build Runta. Runta is the execution layer that controls what agents can do as they run.

![Agentic Era](https://runta.com/blog/runta-the-execution-layer-for-agents/agentic-era.png)

You don’t rewrite your agents or swap your framework. You run them inside an execution environment Runta controls down to the operating system and network. Your agent still chooses the next step, but every file it touches, every call it makes, every credential it uses, and every destination it reaches now passes through a boundary Runta can govern.

Software is constrained when you write it. Agents have to be constrained while they run. Runta does not trust the agent’s explanation of what it needs. It enforces predefined policy at the moment an action becomes real.

**Consume.** Token and compute costs are becoming one of the first hard limits on putting agents into production. Runta sits across both. At the OS level, it watches what each process is actually doing and suspends idle agents until work resumes. At the network boundary, it sits in the path of model calls, giving teams a place to observe and govern token spend as it leaves the agent, not after the invoice arrives.

**Reach.** Every execution gets only the access its current task needs. The framework may tell Runta which task is running, but it cannot expand what that task can reach; that comes from policy defined before the agent runs. Even if a hidden instruction makes the agent name the wrong task, the most it can reach is what that task was already allowed. Credentials are issued just in time against that task’s policy and revoked when the work is done. Network access is governed the same way: each task declares its destinations, and connections to anywhere else fail at the boundary, whatever the agent’s reasoning says.

**Record.** Framework logs tell you what the agent meant to do; Runta records what actually happened: system calls, network calls, filesystem writes, credentials used, and the task policy each action ran under. Because the record is built as the agent acts, the same layer that enforces execution becomes the basis for audit, debugging, and recovery.

![With Runta](https://runta.com/blog/runta-the-execution-layer-for-agents/with-runta.png)

The execution environment starts in milliseconds and sizes itself to what the agent is actually doing, so the boundary that governs every action stays light enough that the control is worth what it costs. Control here isn’t a cage. It’s what lets you hand an agent real work instead of keeping it boxed into small, safe tasks.

## What’s next

We’re building Runta because we believe every production agent will need an execution layer. Today we’re announcing $20M in seed funding led by Martin Casado at Andreessen Horowitz, with participation from Jeff Dean, Fei-Fei Li, Ali Ghodsi, Ram Shriram, and Thomas Wolf.

Every company wants agents doing real work, but real work requires real access. What holds them back is the fear of giving an agent access it can use in ways they can’t see, can’t stop, or can’t reverse. So the work they’re trusted with stays far smaller than what they could handle.

If you’re trying to give agents real work and the control problem is what’s stopping you, [apply for early access](https://dashboard.runta.com/).
