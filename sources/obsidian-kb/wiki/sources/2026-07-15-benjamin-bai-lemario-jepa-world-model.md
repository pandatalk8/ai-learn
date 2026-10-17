---
title: "LeMario：预测状态不等于控制状态"
type: source-summary
status: draft
created: 2026-07-15
updated: 2026-07-15
source: "sources/clips/2026-07-15-benjamin-bai-lemario-jepa-world-model.md"
source_type: web-clip
source_url: "https://www.benjamin-bai.com/projects/lemario"
author: "Benjamin Bai"
published: "2026-07"
tags: [world-model, jepa, representation-learning, model-based-planning, reward-free-planning, evaluation]
confidence: medium
graph:
  - ".kb/staging/links/clips/2026-07-15-benjamin-bai-lemario-jepa-world-model.yaml"
---

# LeMario：预测状态不等于控制状态

> Review 状态：本文是 AI 根据 Benjamin Bai 项目复盘生成的 Wiki 草稿。模型结构、实验数字和作者结论以本地来源记录 [`sources/clips/2026-07-15-benjamin-bai-lemario-jepa-world-model.md`](../../sources/clips/2026-07-15-benjamin-bai-lemario-jepa-world-model.md) 及原文为准，本文的归纳和延伸不作为独立事实源。

## 核心判断

LeMario 最重要的结果不是“JEPA 没有学会玩马里奥”，而是它把三个经常被混为一谈的能力拆开了：

1. latent 中是否包含角色状态；
2. 世界模型能否根据动作预测短期未来；
3. latent 距离能否作为控制器的目标函数。

实验表明，前两项可以成立，第三项仍然可能失败。**预测未来所需的状态，不一定是规划行动所需的状态。**

## 证据链

```text
五步预测优于基线
        ↓
模型确实使用动作信息
        ↓
probe 几乎能完整恢复水平位置
        ↓
latent 中确实存在可控制状态
        ↓
原始 latent 距离规划仍失败
        ↓
失败集中在目标度量、垂直表征和环境假设
```

关键数字：

- LeMario 五步预测误差为 `0.077717`，低于画面不变基线的 `0.142473`；
- 打乱动作后的五步误差为 `0.114648`，说明模型确实利用了操作；
- 水平位置 probe 的 `R² = 0.997`，垂直位置只有 `R² = 0.188`；
- 原始 CEM 近距离规划只把马里奥从 `x=40` 移到 `x=44`；
- 改用 probe 预测的水平位置评分后，马里奥可从 `x=40` 到达 `x=71`；
- 一个仍距目标 1,442 个世界像素的场景，在编码器看来 latent 距离只有 `0.164`。

这些结果共同排除了“模型什么也没有学到”这一简单解释，把问题定位到“学习到什么表征，以及如何度量它”。

## 为什么图片目标不是中性的

所谓 reward-free planning 并没有消除目标设计，只是把显式奖励函数换成了目标图片与 latent 距离。这个距离仍然包含强假设：

- 视觉相似应当对应任务进展；
- latent 的各维信息应当以适合距离计算的方式组织；
- 优化器不应利用模型预测和表征中的漏洞；
- 目标图片中的 HUD、动画、敌人状态和背景不应压过角色位置。

在固定摄像机、平滑运动和局部目标的 Push-T 中，这些假设更接近现实；在滚屏、有跳跃与死亡机制的马里奥中，它们同时被破坏。

因此，“不用手工写奖励”不等于“不用定义任务”。表征、距离函数、目标采样方式和成功判据共同构成了一个隐式奖励系统。

## 与优化器找漏洞的关系

CEM 会搜索模型认为最优的动作，而不会验证模型是否正确。世界模型一旦把两个不同地点编码得过于接近，优化器就会主动找到通往这个“伪目标”的路径。

这与 [[Reward hacking]] 的结构相似：优化对象严格遵循给定指标，却偏离设计者真正关心的行为。LeMario 的案例中，问题不在传统意义上的环境奖励，而在 latent 距离这一代理指标。

它也直接关联 [[评估器设计]]：训练损失、预测误差、probe 指标、实际世界坐标和最终任务成功率分别回答不同问题，任何一个指标都不能替代完整行为评估。

## 对世界模型研究的启发

### 分层验证

世界模型系统至少应分别验证：

| 层 | 应回答的问题 |
|---|---|
| 表征 | 控制所需变量是否存在，是否对干扰因素稳定？ |
| 动态 | 给定动作后，短期与长期状态预测是否准确？ |
| 规划 | 搜索方法是否能在模型内找到合理动作？ |
| 目标 | 距离或奖励是否对应真实任务进展？ |
| 闭环行为 | 在真实环境执行时能否持续纠错并完成目标？ |

### 尽早验证核心假设

作者最初重视架构复现和预测误差，较晚才验证“视觉相似是否能代表关卡进展”。更高效的顺序应当是：先用简单基线和 probe 检查目标变量，再做局部控制，最后扩大规划距离与环境复杂度。

### 不要把环境差异当成实现细节

把 Push-T 换成马里奥，不只是换了一套训练画面，而是改变了摄像机、运动规律、目标跨度、危险机制、数据规模和视觉相似度的意义。架构能迁移，不代表方法成立的条件也会自动迁移。

## 适用边界

- 这是作者对单个项目的技术复盘，不足以证明所有 JEPA 都不适合控制。
- 训练数据只有 280 个 episode、32 个关卡和 1 个 epoch，不能把失败全部归因于架构。
- probe 证明信息可以被读取，不证明该信息以线性、稳健或适合长时规划的形式存在。
- 文中比较集中在模型内部误差和少量 rollout，不是完整的多种子、跨关卡控制 benchmark。

## 可复用的研究问题

1. 目标变量是否存在于 latent 中？
2. latent 距离是否与真实任务距离单调相关？
3. 哪些视觉干扰会改变距离，却不改变任务进展？
4. 优化器是否在利用模型误差而非完成任务？
5. 局部目标有效时，失败来自规划跨度还是目标度量？
6. 原论文中的哪些环境条件其实是方法成立的隐含假设？

## Sources

- 本地来源记录：[sources/clips/2026-07-15-benjamin-bai-lemario-jepa-world-model.md](../../sources/clips/2026-07-15-benjamin-bai-lemario-jepa-world-model.md)
- 原文：https://www.benjamin-bai.com/projects/lemario
- LeWorldModel 论文：https://arxiv.org/abs/2603.19312
- LeMario 代码：https://github.com/benyebai/LeMario

