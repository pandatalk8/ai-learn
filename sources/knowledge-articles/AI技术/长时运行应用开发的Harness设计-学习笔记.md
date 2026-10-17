# 长时运行应用开发的 Harness 设计（学习笔记）

> **原文**：[Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
> **作者**：Prithvi Rajasekaran（Anthropic Labs 团队）
> **发布日期**：2026-03-24
> **笔记性质**：学习向的结构化解读，非逐句翻译。核心术语保留英文以便对照。

---

## 封面图

![header](https://www-cdn.anthropic.com/images/4zrzovbb/website/aad1e9f623eb01a3f43233255e731256bb28a927-2554x2554.svg)

---

## 开篇：问题的提出

作者在 Anthropic Labs 期间同时处理两个相互交织的问题：

1. **让 Claude 产出高质量的前端设计**（主观领域）
2. **让 Claude 无需人工介入完成完整应用构建**（客观/可验证领域）

在对两个方向做了大量 prompt 工程与基础 agent 设置之后，作者发现——**两种做法最终都会撞到天花板**。单靠 prompt 和基础 agent loop，无法持续产出高质量结果。于是文章转向一个核心命题：

> **Harness（承载 agent 运行的外壳系统）的架构设计，决定了能力上限。**

---

## 一、为什么 Naive 实现会失败（Why naive implementations fall short）

作者观察到当任务变长、上下文变大时，模型表现出两类典型退化：

### 1. 上下文焦虑（Context Anxiety）

> 模型会在**接近它所认为的 context 上限时，开始过早地"收尾"**——草草总结、提前结束任务，即便任务尚未真正完成。

症状：
- 长任务中途失去连贯性（loss of coherence）
- 主动压缩或跳过后续步骤
- 以"完成交付"的姿态掩盖未完成的工作

### 2. 自评偏差（Self-evaluation bias）

当 agent 同时负责"生成"和"评估"自己的产出时，会**系统性地高估自己的作品**。这在主观任务（如设计质量）上尤其明显，但**即便是客观任务（代码是否能跑），同一个 agent 的自评同样不可靠**。

### 关键结论

> **把评估器（evaluator）和生成器（generator）分离**，能构造出更强的反馈回路。

这是整篇文章后续架构的核心思想——灵感来自 **GAN（生成对抗网络）** 的结构。

---

## 二、前端设计：让主观质量变得可评分（Frontend design: making subjective quality gradable）

### 核心难点

"好看不好看" 本身是主观判断。但如果不能**结构化地打分**，就无法构造反馈回路。作者把设计质量拆成四个可独立评估的维度：

| 维度 | 关注点 | 说明 |
|------|--------|------|
| **Design Quality** | 整体氛围与身份 | 元素是否组合出独特的 mood 与 identity，而不是零散拼贴 |
| **Originality** | 是否有定制判断 | 对 AI 生成的"套路特征"（比如**紫色渐变**）扣分；奖励显式的自定义选择 |
| **Craft** | 技术执行 | 排版层级、间距一致性、色彩和谐、对比度 |
| **Functionality** | 与美学无关的可用性 | 是否能独立于美感完成任务 |

> 作者提到：由于 Claude 在 Craft 和 Functionality 上本来就不差，因此在加权时**更偏重 Design Quality 和 Originality**——这里才是真正的天花板所在。

### Generator-Evaluator 回路

- 架构灵感：GAN（生成器 vs 判别器）
- 评估器使用 **Playwright MCP**，像真实用户一样与页面交互、点击、截图，再据此打分
- 每次生成经历 **5–15 轮迭代**
- 单次运行最长可达 **约 4 小时**

### 典型例子：荷兰艺术博物馆网站

一个很能说明 Originality 作用的案例：

- 初始版本：一个"常规"的博物馆网站，布局和配色都很典型
- 到第 10 轮左右：**放弃常规路线，转向用 3D CSS 渲染的空间化体验**
- 前提是评估器持续在 Originality 维度压低分数，逼迫生成器跳出模板思维

这个案例展示了："分离的评估器 + 结构化评分" 如何把 agent 从局部最优推出去。

---

## 三、扩展到全栈开发（Scaling to full-stack coding）

### 3.1 架构：三 agent 系统

```
Planner  ──►  Generator  ◄──►  Evaluator
   │              │                │
   └─── 共享文件（file-based communication） ────┘
```

**Planner（规划者）**
- 职责：把简短的 prompt **扩展成完整的产品 spec**
- 侧重点：**scope（范围）**，而不是细粒度实现细节
- 也负责把 AI 能力融入产品定义

**Generator（生成者）**
- 技术栈：React + Vite + FastAPI + SQLite/PostgreSQL，全程用 git 做版本控制
- 实现逻辑功能，提交前会先自查
- 早期版本按 **sprint（迭代冲刺）** 一个 feature 一个 feature 推进

**Evaluator（评估者）**
- 通过 **Playwright MCP** 控制真实浏览器，对跑起来的应用做交互测试
- 按四项标准打分，**带硬性阈值**（未达标直接打回）
- 在每个 feature 实现之前，生成者和评估者会先 **negotiate a sprint contract**——把"怎样算成功"用可测试的形式写死

**通信方式**：**通过文件**。一个 agent 写文件，另一个 agent 读文件并响应。简单但稳健。

---

### 3.2 Harness 实战对比

作者用同一个 prompt（复古游戏制作器，Retro Game Maker）在两种设置下对比：

| 设置 | 耗时 | 成本 | 结果 |
|------|------|------|------|
| **Solo agent**（无 harness） | 20 分钟 | $9 | 界面能开，但**玩法机制是坏的** |
| **完整 harness** | 6 小时 | $200 | **功能完整、可玩** |

**Solo 版本的启动画面：**
![solo-open](https://www-cdn.anthropic.com/images/4zrzovbb/website/23c98f1d7ae720bfb39190d50e0706c03b177ad8-1999x1320.png)

**Solo 版本的 Sprite 编辑器：**
![solo-sprite](https://www-cdn.anthropic.com/images/4zrzovbb/website/24472c85629a6c82a092f25def4a659042be1f7c-1999x1010.png)

**Solo 版本试图进入游戏——失败现场：**
![solo-fail](https://www-cdn.anthropic.com/images/4zrzovbb/website/79217dbfce3f31172eb7fd4deee5449022b08fac-1999x757.png)

**完整 harness 版本中的 AI 辅助关卡设计：**
![full-harness-level-design](https://www-cdn.anthropic.com/images/4zrzovbb/website/287b35f4683ecb77ac6a8d66bf2b3ed5956d1db9-1999x1008.png)

**完整 harness 生成内容下的正常玩法：**
![full-harness-gameplay](https://www-cdn.anthropic.com/images/4zrzovbb/website/f2953550e51957a0a49a3792a0df3bcfed0fde48-1994x1654.png)

### 评估器识别出的典型 bug（客观领域示例）

这些都是 Solo 版本"自己没发现"但 Evaluator 揪出来的问题：

- **Rectangle fill 工具失效**：`fillRectangle` 函数存在，但没有在 `mouseUp` 时触发，结果只在拖拽的起点和终点各放了一个 tile，没有填充矩形区域。
- **路由顺序 bug**：`PUT /frames/reorder` 定义在 `/{frame_id}` 之后，FastAPI 把 `reorder` 解析为 `frame_id` 整数参数，返回 422 错误。

> **启示**：即使是有明确对错的客观任务，自评也会漏掉这些问题；**专门的 evaluator 带着工具去交互测试，才能挖出来**。

---

### 3.3 Harness 的迭代：模型变强后怎么办

作者在 **Opus 4.6** 发布后，对 harness 做了一次重要简化：

**去掉了 sprint 机制。**

原因：
- Opus 4.6 在 **long-context retrieval** 上显著提升
- 能够**持续承载更长时间的 agentic 任务**
- 以前需要拆分冲刺来避免上下文崩塌——现在新模型自己就能扛住

调整后：
- 保留 Planner 和 Evaluator
- Generator **不再分 sprint 推进**，而是**连续工作**
- 评估从"每个 sprint 打分"改为**单次最终打分**（single-pass evaluation）

在新 harness 上跑了一个更复杂的 **DAW（数字音频工作站）** prompt：

- 耗时：**3 小时 50 分钟**
- 成本：**$124.70**
- 使用 Web Audio API
- 最终产物功能完整

---

## 四、可复用的原则（Takeaways）

作者在结尾抽出几条**跨场景适用的**经验，这部分值得单独记忆：

### 1. Harness 的每个组件都是对模型能力的一个假设

> "**Harness 中的每个组件，都编码了一个'模型自己做不到某件事'的假设。这些假设值得被反复压力测试。**"

这意味着：
- 不要把任何 harness 设计当成永久正确
- 每次模型升级后，要重新审视"当初为什么加这个组件"
- 很多复杂度会随着基础模型变强而**变成负担**

### 2. 从最简解出发

> "**Find the simplest solution possible, and only increase complexity when needed.**"

对应的反面教训：不要一上来就搭三 agent 系统。先看 solo 能做到哪里，看不到瓶颈就别加层。

### 3. 模型变强，harness 空间"移动"而非"收缩"

> "**The space of interesting harness combinations doesn't shrink as models improve. Instead, it moves.**"

这条是整篇文章最反直觉的观点之一：

- 直觉上：模型越强，脚手架越不重要
- 实际上：模型越强，脚手架要解决的问题**换了位置**——老问题消失，新问题出现（更长时间的任务、更复杂的跨域协调、更高的质量标准）

### 4. 多 agent 分解能解锁单 agent 做不到的任务

通过：
- 显式分工（规划 / 生成 / 评估）
- 文件化通信
- 带硬阈值的结构化评估

可以让 agent 系统完成**单 agent baseline 能力之外**的任务——代价是更多 token。

### 5. 主观 vs 客观：评估器都不可替代

- **主观领域**（设计质量）：agent 自评带正向偏差
- **客观领域**（代码能跑）：agent 自评同样不可靠

> 结论是一致的：**Evaluator 必须独立**。

---

## 五、学习用小结

把这篇文章的信息结构化为"看到某类场景该想到什么"：

| 你遇到的情况 | 文章建议 |
|-------------|---------|
| 长任务模型提前收尾 | 怀疑 context anxiety；考虑 context reset 而非 compaction |
| Agent 自评结果可疑 | 抽出独立 Evaluator；让它用工具实际测 |
| 主观质量难以评估 | 把质量拆成可独立评分的维度，加权重 |
| Prompt 到天花板 | 考虑生成器-评估器分离（GAN 式架构） |
| 模型升级后 harness 慢且贵 | 回头审视每个组件的假设，该拆就拆 |
| 复杂任务单 agent 难完成 | 显式分解为 Planner / Generator / Evaluator，用文件通信 |

---

## 六、延伸阅读方向

- GAN（生成对抗网络）的基本思想——Generator / Discriminator 对抗训练
- Playwright MCP：浏览器自动化 + MCP 协议结合
- Claude Agent SDK：构建多 agent 编排的基础设施
- Context management 策略：reset vs compaction 的权衡

---

*笔记整理于 2026-04-17，基于 Anthropic 工程博客原文。建议结合[原文](https://www.anthropic.com/engineering/harness-design-long-running-apps)阅读，尤其是图片上下文与作者的第一手语气。*
