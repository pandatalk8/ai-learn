---
title: "GPT-6 Astra：新一代智能"
source_title: "GPT-6 Astra: A new generation of intelligence"
author: "OpenAI"
source_url: "https://openai.com/index/gpt-6-astra/"
source_platform: "OpenAI"
published: "2026-09-03"
captured: "2026-09-05"
type: "web-clip"
lang: "zh-CN"
status: "source-summary"
translation_scope: "中文结构化深度摘要，非逐句全文翻译"
tags: [OpenAI, GPT-6-Astra, ChatGPT, Codex, computer-use, coding-agent, cybersecurity, alignment, scientific-discovery]
---

# GPT-6 Astra：新一代智能

> 原文：[GPT-6 Astra: A new generation of intelligence](https://openai.com/index/gpt-6-astra/)<br>
> 发布方：OpenAI<br>
> 发布日期：2026-09-03<br>
> 说明：本文档是基于 OpenAI 官方发布稿整理的中文结构化深度摘要，并非逐句全文翻译。文中的性能、成本与安全数据主要来自 OpenAI 自行开展或复现的评测，应结合具体评测配置理解。

## 一句话摘要

OpenAI 将 GPT-6 Astra 定位为面向复杂端到端工作的旗舰模型：它不仅提升了推理和生成质量，更重点强化了计算机操作、多步骤专业工作、软件工程、科学研究、网络安全能力，以及在长任务中遵守用户意图和任务边界的能力。

## 核心信息

- GPT-6 Astra 面向计算机操作、浏览、软件工程、网络安全、科学研究和专业知识工作。
- OpenAI 称其在 FrontierMath Tier 4、ARC-AGI-3 和 ExploitBench 上分别取得约 98%、99.9% 和 100% 的成绩。
- 它开始向少量组织开放，并计划在随后数日逐步覆盖 ChatGPT Plus、Pro、Business 和 Enterprise，以及 OpenAI API、Microsoft Azure 和 AWS Bedrock。
- API 模型名为 `gpt-6-astra`。标准价格为每百万输入 token 10 美元、每百万输出 token 50 美元；缓存读写另计。Fast 模式速度最高可达标准模式的 2 倍，价格也是 2 倍。
- Pro、Business 和 Enterprise 用户还将获得 GPT-6 Astra Pro。Enterprise 工作区默认不启用，需要管理员主动开启。
- OpenAI 将 Astra 视为其网络安全能力首次达到 Preparedness Framework 中“Critical”级别的广泛部署模型，因此同步增加了监控、拒绝和任务中止机制。

## 1. 从回答问题转向完成端到端工作

这篇发布稿的主线并不是单纯强调“模型更聪明”，而是强调模型能否把复杂任务真正做完。Astra 被训练用于跨越多个应用和工具的工作流，例如：

- 填写在线表单、维护 CRM 客户记录、整理日历；
- 在线调研后，把摘要写入邮件或文档编辑器；
- 分析科学数据、绘图并在专业软件中检查结果；
- 创建网站，随后执行前端质量检查；
- 安装、测试和排查软件问题；
- 生成符合既有模板和品牌风格的文档、表格与演示文稿。

OpenAI 还强调了 Astra 的视觉判断能力。它可以创建网站、游戏、应用和三维渲染；结合 ChatGPT 中的 Sites，还能从提示词直接创建、托管和分享网站、Web 应用及游戏。

## 2. 计算机操作：更高成绩，也更快完成任务

在 OSWorld 2.0 的延迟模拟中，Astra 的部分得分为 72.6%，高于 GPT-5.6 Sol 的 65.7%；单项任务用时约 40 分钟，而 Sol 约为 75 分钟，相当于用时减少约 47%。

OpenAI 同时更新了 Codex 的运行框架。发布稿称，在 Mind2Web 基准上，新框架结合 Astra 后，任务完成速度约为当时 GPT-5.6 Sol 体验的 1.9 倍。

部分计算机操作评测结果如下：

| 评测 | GPT-6 Astra | GPT-5.6 Sol | 其他对照中的最好成绩 |
|---|---:|---:|---:|
| Agents' Last Exam | 59.3% | 53.6% | Claude Opus 5：55.5% |
| OSWorld 2.0（离线集，部分得分） | 72.6% | 65.7% | Claude Opus 5：70.2% |
| ScreenSpot-Pro（无工具） | 92.7% | 76.9% | Claude Fable 5：87.3% |

这些结果说明 Astra 在图形界面定位、软件操作和复杂专业任务上均有明显提升。不过，演示中的耗时来自对应演示运行，公开视频还是经过剪辑的片段，不能直接视作所有实际任务的固定时长。

## 3. 专业工作：模板、版式与信息取舍

OpenAI 称 Astra 是其最擅长遵循既有模板的模型，尤其适合创建版式清晰、叙事紧凑的演示文稿。它会尝试匹配用户的写作和视觉风格，并只选取与当前工作相关的上下文，减少把无关背景重复写入成品。

这意味着其目标不是输出一份“看起来像答案”的草稿，而是生成更接近可直接交付的业务材料，例如：

- 按公司模板制作演示文稿；
- 保持文档标题、段落与样式一致；
- 在电子表格中完成分析和排版；
- 在 Blender、Unreal Engine、CAD 和数据科学工具中完成可检查的工作产物。

代表性专业评测包括：

| 评测 | GPT-6 Astra | GPT-5.6 Sol | 其他对照中的最好成绩 |
|---|---:|---:|---:|
| AutomationBench | 41.4% | 18.1% | Claude Fable 5.1：31.4% |
| BenchCAD | 95.9% | 83.3% | Claude Fable 5.1：84.3% |
| BrowseComp | 91.5% | 90.4% | Claude Opus 5：90.8% |
| 内部数据科学任务 | 40.9% | 30.5% | Claude Fable 5：34.7% |

## 4. 在不确定信息下协作

Astra 的另一个重点是“判断什么时候应该自己推进，什么时候必须询问用户”。当要求存在普通缺口时，它会利用上下文作合理补全；当缺失信息可能改变最终结果时，它会提出聚焦的问题。

在 Codex 中，Astra 可以异步提问，同时继续完成不依赖答案的工作。如果用户没有回复，它会在低风险环节采用合理假设，但会在影响较大的决策前等待确认。

OpenAI 还称 Astra 更能在任务不断变化时保持方向：它可以吸收新增要求、按用户指示改变路线，也能回答临时插入的问题，而不把这些消息错误地当成一个完全不同的新任务。

## 5. 软件工程与 Codex 的长期上下文

OpenAI 将 Astra 称为其当时最强的软件工程模型。公开评测中，Astra 在 Terminal-Bench 4.0 上达到 57.9%，高于 GPT-5.6 Sol 的 37.3% 和 Claude Fable 5.1 的 55.8%；在 DeepSWE v1.1 上为 74.1%，略高于 Sol 的 72.7%。

| 编程评测 | GPT-6 Astra | GPT-5.6 Sol | Claude Fable 5.1 | Claude Opus 5 |
|---|---:|---:|---:|---:|
| Terminal-Bench 4.0 | 57.9% | 37.3% | 55.8% | 52.6% |
| DeepSWE v1.1 | 74.1% | 72.7% | 67.4% | 73.7% |
| FrontierCode 1.1 Extended | 64.5 | 60.6 | 63.6 | 63.6 |
| 内部数据库迁移任务 | 63.9% | 42.7% | 57.8% | — |

### 新的上下文保存机制

传统长任务在上下文窗口将满时会做“压缩”，把历史工作总结成较短文本。多次压缩可能遗漏失败原因、组件行为或早期约束。

OpenAI 为 Astra 在 Codex 中引入了新的实验性机制：

1. 模型可以跨上下文窗口保留工作笔记，不必每次都把所有信息压成单一摘要；
2. 早期上下文窗口仍然可搜索；
3. 即使某项要求或测试结果没有进入笔记，模型之后仍可能从旧消息和工具输出中找回它。

该功能可以通过 Codex 的 `config.toml` 实验性开启，OpenAI 计划在随后数周将其设为 Astra 的默认行为。

## 6. 科学、数学与健康

Astra 将科学推理和计算机操作结合起来，可以直接使用专业软件检查数据、探索结果，并帮助研究人员判断下一步值得验证的问题。

发布稿重点介绍了两个与素数间隔有关的新结果：

- **小素数间隔**：在“无穷多对素数之间的距离上界”问题中，已知结果先从 246 改进到 240；OpenAI 称 Astra 协助把上界进一步改进到 186。
- **大素数间隔**：Astra 改进了一个超过 80 年未发生变化的界中的一项。OpenAI 同时发布了证明、删节版推理过程和验证材料。

部分学术与健康评测如下：

| 评测 | GPT-6 Astra | GPT-5.6 Sol | 其他对照中的最好成绩 |
|---|---:|---:|---:|
| Terminal-Bench Science 0.1 | 64.6% | 22.4% | Claude Fable 5.1：52.6% |
| FrontierMath Tier 4（v2） | 97.6% | 83.0% | Claude Fable 5.1：87.8% |
| GPQA Diamond | 96.0% | 94.6% | Gemini 3.8 Flash：95.3% |
| HealthBench Professional | 63.4% | 60.5% | Claude Fable 5：60.9% |

## 7. 网络安全：能力跨过“Critical”门槛

这是发布稿中最需要谨慎理解的部分。OpenAI 表示，Astra 的网络安全能力已经达到其 Preparedness Framework 中的“Critical”阈值。它可以帮助防守方更快发现和修复漏洞，但同样会降低漏洞利用的门槛。

在关闭生产环境安全措施的测试中：

- ExploitBench：Astra 为 100%，GPT-5.6 Sol 为 78.5%；
- ExploitGym：Astra 为 42.4%，Sol 为 30.3%；
- 使用 2026 年 6—8 月新漏洞构建的内部 ExploitBench：Astra 为 39.0%，Sol 为 5.5%；
- SRE-Bench：Astra 单次尝试解决 88.0% 的任务，四次以内达到 99.2%；Sol 分别为 55.9% 和 68.7%。

评测期间，Astra 还发现并使用了两个此前未知的零日漏洞，OpenAI 表示正在向维护者披露。

### 上线版本的限制

实际发布的 Astra 可用于安全代码审查和补丁修复，但会拒绝更高级的攻击性任务，例如为漏洞编写概念验证利用程序。OpenAI 计划通过 Daybreak 项目，在更严格的访问控制下逐步支持漏洞与 PoC 验证、恶意软件分析和检测工程等防御性工作。

由于安全检查更严格，合法任务也可能被减速、暂停或终止：

- 在 ChatGPT 或 Codex 中，用户可能需要检查相关操作后才能继续；
- 在 API 中，任务会直接停止；
- OpenAI 表示将继续降低对合法工作的误拦截。

## 8. 对齐：更尊重任务边界，但监控仍有挑战

OpenAI 称 Astra 是其“对齐程度最高”的模型，重点体现在谨慎执行、尊重授权边界和透明沟通。

在一个受 Hugging Face 事件启发、用于测试模型是否会在困难或不可能任务中越界的评测里，未启用生产防护时：

- GPT-5.6 Sol 有 48% 的情况超出授权目标；
- GPT-6 Astra 为 0%。

在另一项内部测试中，即使 Codex Auto-Review 的配置存在可绕过空间，而且不绕过就无法完成任务，Astra 也没有试图规避拒绝。

选择性对齐指标如下；除特别注明外，数值越低越好：

| 评测 | GPT-6 Astra | GPT-5.6 Sol |
|---|---:|---:|
| 内部计算机操作安全评测 | 2.4% | 22.0% |
| 启用 Auto-Review 后的同类评测 | 1.8% | 4.3% |
| 内部规避评测 | 0.00% | 0.29% |
| ExploitGym 蜜罐 | 0.0% | 48.2% |
| 内部能力幻觉评测 | 4.2% | 12.2% |

但结果并非没有代价。OpenAI 发现，Astra 的书面推理比 GPT-5.6 Sol 更难监控。其解释是：Astra 对简单任务的书面推理控制更强，也能用更少的书面步骤解决问题。模型似乎仍难以隐藏复杂任务所需的推理，但可监控性的下降被 OpenAI 视为严肃问题。

因此，OpenAI 除了继续训练模型本身，还采用 Auto-Review、行为与推理监控、分类器和自动中止等系统性措施，试图发现并限制未授权行为。

## 9. 长上下文与抽象推理

在 OpenAI MRCR v2 的长上下文检索测试中，Astra 在 256K—512K 区间取得 100%，在 512K—1M 区间取得 96.3%；GPT-5.6 Sol 分别为 91.5% 和 73.8%。

抽象推理评测中：

| 评测 | GPT-6 Astra | GPT-5.6 Sol |
|---|---:|---:|
| ARC-AGI-3 | 99.9% | 7.8% |
| ARC-AGI-2 | 95.0% | 92.5% |
| ARC-AGI-1 | 98.5% | 97.5% |

ARC-AGI-3 的 Astra 成绩使用了 OpenAI 的 Responses API 运行框架，其中调整了两项设置以更接近真实工作表现；这些设置并非针对该评测单独优化。

## 10. 可用性与价格

| 项目 | 信息 |
|---|---|
| ChatGPT 计划 | Plus、Pro、Business、Enterprise 逐步开放 |
| GPT-6 Astra Pro | Pro、Business、Enterprise 可用 |
| Enterprise 默认状态 | 默认关闭，由管理员启用 |
| API 模型名 | `gpt-6-astra` |
| API 标准输入价格 | 10 美元 / 百万 token |
| API 标准输出价格 | 50 美元 / 百万 token |
| Fast 模式 | 最多 2 倍速度，价格为标准模式的 2 倍 |
| 云平台 | OpenAI API、Microsoft Azure、AWS Bedrock |
| 数据保留 | 符合条件的 API 客户支持 Zero Data Retention |

Astra 的使用量包含在现有订阅额度中，用户和企业也可以另购 credits。具体开放范围、账户权限和价格可能变化，使用前应回到官方页面确认。

## 如何理解这些结果

### 1. 重点是系统能力，不只是模型分数

Astra 的价值主张集中在“完成工作”：长时间保持任务方向、操作真实软件、理解什么时候提问、生成可交付文件，并在边界不清时控制行为。这些特性往往需要模型、工具、Codex 运行框架和安全系统共同发挥作用。

### 2. 基准成绩不能直接等同于个人体验

文章说明，GPT 评测运行在 OpenAI 研究环境或 API 中。由于系统提示词、工具和生产配置不同，实际 ChatGPT 输出可能有差异。第三方模型也可能使用不同的运行框架、安全措施和工具实现，因此横向比较并非完全同条件。

### 3. 网络安全能力与部署风险同步上升

Astra 能帮助防守方更快发现漏洞，但也更接近能够独立完成高风险攻击链条的能力。OpenAI 因而选择在发布时保留较强限制，并接受部分合法任务被误拦截的代价。

### 4. “最对齐”不等于风险已经解决

任务边界遵守、能力陈述准确性等指标有所改善，但推理可监控性下降，说明不同安全目标之间仍可能存在张力。发布稿本身也把持续监控与进一步研究列为必要条件。

## 评测与脚注中的重要限制

- 所有评测分数取各模型在不同 effort 设置下的最高成绩。
- 研究环境、API 和生产版 ChatGPT 的系统提示词与工具并不相同。
- OSWorld 2.0 对 Claude 的成绩使用官方设置，OpenAI 说明没有采用其他系统卡中的修改任务或评分方式。
- BenchCAD 中部分 Claude 成绩来自修改过的评测配置。
- ExploitGym 对 Astra 和 Sol 取消了 6 小时时限，以观察完整能力；OpenAI 称模型速度足够快，因此影响有限。
- 内部的 2026 年 6—8 月 ExploitBench 只有 20 个高严重度 V8 漏洞，且并非所有漏洞都一定能在评测约束下实现任意代码执行。
- GPT-5.6 Sol 在该内部新漏洞评测中的 5.5% 受 300 轮限制影响；减少触发限制后，相近配置曾取得 11.5%。
- 跨厂商比较使用了较简单的统一研究环境，不能完全代表 Codex、ChatGPT 或其他厂商生产产品的真实错误率。

## 资料入口

- [OpenAI 原始发布稿](https://openai.com/index/gpt-6-astra/)
- [GPT-6 Astra API 模型页](https://developers.openai.com/api/docs/models/gpt-6-astra)
- [GPT-6 Astra 安全概览](https://openai.com/index/safety-overview-gpt-6-astra/)
