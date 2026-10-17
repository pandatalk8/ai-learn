---
title: "Factory 2.0：从 coding agents 到 software factories"
original_title: "Factory 2.0: From coding agents to software factories"
author: Matan Grinberg
translator: AI
source_url: https://x.com/matanSF/status/2066578088184680920
original_file: 2026-06-15-matan-grinberg-factory-2-0-from-coding-agents-to-software-factories.md
source_platform: X
tweet_id: "2066578088184680920"
article_id: "2066394250074599424"
published: 2026-06-15
captured: 2026-06-16
type: clip
lang: zh-CN
cover_image: imgs/2026-06-15-matansf-factory-2-0-cover.jpg
tags: [ai-coding, coding-agents, software-factory, factory-ai, enterprise-ai, autonomous-agents, software-engineering]
---

# Factory 2.0：从 coding agents 到 software factories

**作者：Matan Grinberg**  
**发布于 X：2026-06-15**

![封面](imgs/2026-06-15-matansf-factory-2-0-cover.jpg)

> 说明：这是对 X Article 的中文剪藏与结构化整理，不是全文转载。正式引用请回到原文：<https://x.com/matanSF/status/2066578088184680920>。

## 一句话总结

Matan Grinberg 认为，AI 软件工程的下一阶段不是“让单个工程师的 coding agent 更快”，而是构建组织级的 **software factory**：一个端到端、agent-native、能观测自身并持续学习的软件生产系统。

## 核心论点

文章把 software factory 描述为一个持续反馈循环：

1. 外部信号进入系统，例如 bug report、内部对话、客户反馈和业务需求。
2. 信号被分诊，转化为计划中的软件变更。
3. 变更被构建、测试、review、安全检查、发布和监控。
4. 监控到的线上软件行为又产生新的信号。
5. 整个系统通过 AI agents 和组织上下文不断改进。

作者的关键判断是：提升单个工程师生产力已经不够了。真正的组织级生产力来自一个互联的、端到端的 agent 系统。

## 一个稳健的 software factory 需要什么

### 1. 模型独立性

企业内部不同任务对成本、性能、速度的要求不同，不可能一个模型打天下。软件工厂应该允许组织有意识地选择不同模型，或者通过 Router 自动/规则化地为每个任务选择合适模型。随着模型商品化，成本会下降，速度和性能会提升。

### 2. 主权智能

组织必须拥有自己的软件工厂，而不是把学习能力完全交给外部系统。主权不仅指部署方式，可以是云端、BYOK、自托管 data plane、欧盟区部署，甚至完全 air-gapped；更重要的是，组织要拥有一个能从 agent session、code review、已解决 incident 中学习的系统。投入越多，能力越强，而且能力留在组织内部。

### 3. 持续学习和自我改进

软件开发生命周期的每个阶段都应该被 instrumentation 覆盖。代码审查、安全分析、文档、QA、incident response 如果运行在同一平台上，就能共享同一个 agent core、model router 和组织上下文。安全发现可以影响 code review，部署可以触发文档更新，incident 可以关联到引发它的 PR。

## Factory 提出的自治层次

文章强调，组织不会一开始就拥有完全自治的软件工厂。自治是逐步成熟的过程，需要根据组织准备度和舒适度演进。

Factory 提到的几个层次包括：

- **Droid agents / skills**：用于定义清晰、可衡量的任务。
- **Automations**：用于有共享目标和记忆的重复工作流。
- **Droid Computers**：用于长时间运行或本地执行的 agent。
- **Missions**：用于多 agent 自治执行，把复杂任务拆成并行轨道，持续数小时或数天。
- **Agent Readiness**：根据人工指导程度、信息敏感性和任务准备度来决定适合的自治程度。

## 企业落地信号

Factory 称，他们已经和客户构建 software factories，并且这些系统已在多个大型组织生产环境中运行。文中点名的组织包括 NVIDIA、EY、Adobe、Palo Alto Networks、Adyen、Blackstone、Wipro、Comarch 等。

## 对工程师角色的判断

作者不是说工程师会被软件工厂替代，而是说工程师职责会扩大：

- 工程师不再只是写软件的人。
- 工程师会负责构建“生产软件的工厂”。
- 工程师需要承担治理、安全、流程标准化、自治边界和业务结果责任。
- 下一个软件开发时代仍然是 engineering-led，但工程责任会延伸到更广的业务层面。

## 可复用观点

- “软件工厂”比“coding agent”更接近组织级 AI 落地的核心单位。
- AI 编程工具的壁垒不只在模型能力，还在组织上下文、流程闭环、模型路由、权限治理和自学习系统。
- 长期价值来自反馈循环：每次代码审查、incident、自动化和集成都会让整个组织的系统变强。
- 组织需要拥有自己的 agent 记忆和学习系统，否则软件开发能力会被外部平台吸走。

## 相关链接

- Factory Router: https://factory.ai/news/factory-router
- Droid Computers: https://factory.ai/news/droid-computers
- Missions: https://factory.ai/news/missions
- Agent Readiness: https://factory.ai/news/agent-readiness
- Factory Desktop App: https://factory.ai/product/desktop

## 本地图片素材

![封面](imgs/2026-06-15-matansf-factory-2-0-cover.jpg)

![Software factory 图](imgs/2026-06-15-matansf-factory-2-0-software-factory.jpg)
