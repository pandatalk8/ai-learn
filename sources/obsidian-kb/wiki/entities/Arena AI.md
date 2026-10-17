---
title: "Arena AI"
type: entity
status: draft
created: 2026-07-17
updated: 2026-07-17
tags: [AI, model-evaluation, leaderboard, human-preference, benchmarking]
aliases: [Arena.ai, Arena, LMArena, Chatbot Arena, LMSYS Chatbot Arena]
sources:
  - sources/clips/2026-07-17-arena-ai-official-site.md
related:
  - 评估器设计
  - AI 模型评测
  - 人类偏好评测
confidence: high
---

# Arena AI

一句话定位：Arena AI 是一个让两个匿名 AI 模型回答同一问题、由用户投票选出更好回答，并据此生成公开排行榜的众包模型评测平台。

## 它解决什么问题

普通模型榜单往往依赖固定测试集，容易和真实使用体验脱节。Arena 把评测放进实际交互：用户提出自己的问题，比较两个匿名模型的结果，再投票表达偏好。

这一机制主要降低了投票时的品牌先入为主，并持续收集开放式真实任务中的人类偏好。不过，它仍然测量“用户更喜欢哪个回答”，不能直接等同于模型的绝对智能、事实准确率或专业可靠性。

## 主要功能

1. **Battle Mode**：两个匿名模型回答同一提示，用户投票后显示模型身份。
2. **直接体验模型**：在平台中使用或选择不同 AI 模型完成文本、编程、图片、文档、搜索等任务。
3. **公开排行榜**：按文本、代码、视觉、文档、图片和 Agent 等领域查看相对表现。
4. **社区评测数据**：把大量用户投票汇总为模型比较和公开研究数据。

## 使用建议

Arena 最适合回答：**针对我的真实任务，我更喜欢哪个模型的结果？**

可将同一个有代表性的写作、研究或编程任务连续测试多次，再结合价格、速度、上下文长度、隐私政策和稳定性决定是否选用某个模型。单看总榜名次不足以完成业务选型。

## 局限与风险

- 排名受参与用户、提示词分布、回答风格和投票偏好影响；
- 榜单会随新投票、新模型及统计方法变化，不是静态结论；
- 高排名不保证具体回答正确；
- 官网提示对话会交给第三方 AI 提供商处理，且部分信息可能用于公开研究，因此不应上传隐私或机密材料。

## 名称沿革

- 早期研究项目：Chatbot Arena / LMSYS Chatbot Arena；
- 后续品牌：LMArena；
- 当前官网品牌：Arena / Arena.ai。

这些名称在旧论文、报道和链接中可能同时出现，检索时应视为同一平台的不同阶段。

## Sources

- [官网资料摘要](../../sources/clips/2026-07-17-arena-ai-official-site.md)
- https://arena.ai/about
- https://arena.ai/how-it-works
- https://arena.ai/leaderboard

