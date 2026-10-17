---
title: "自动生成连贯的长篇视频"
source_title: "Automating coherent long-form video generation"
author: "Yale Song and Yiwen Song"
source_platform: "Google Research"
source_url: "https://research.google/blog/coherent-long-form-video-generation/"
source_file: "/Users/wanghe/Downloads/Automating coherent long-form video generation.pdf"
published: "2026-09-24"
translated: "2026-09-25"
type: "web-clip"
lang: "zh-CN"
status: "full-translation"
review: "unreviewed"
verification: "已对照用户提供的 PDF 校核内容与图表；未独立复核研究结论"
tags: [google-research, video-generation, multi-agent, visual-memory]
---

# 自动生成连贯的长篇视频

**发布日期：**2026 年 9 月 24 日

**作者：**Yale Song、Yiwen Song，Google 研究科学家

**原文：**[Automating coherent long-form video generation](https://research.google/blog/coherent-long-form-video-generation/)

> 翻译说明：本文完整翻译用户提供的 PDF 中的文章正文、图注与结果表格，保留配图原图，并附主要图中文字的中文对照。网页导航、推荐文章、网站页脚及重复打印页眉页脚未收入。PDF 中的视频仅保留静态画面，未包含可播放视频或视频直链。下文的“我们”指原文作者；研究结论与数值均按原文呈现。

![文章封面](assets/2026-09-24-google-coherent-long-form-video-generation/cover.jpg)

我们介绍一个统一的多智能体框架，它能够自主生成在时间维度上保持一致的长篇视频叙事，克服现有线性 AI 流水线中的身份漂移与级联故障。

## 快速链接

- [AI 视频联合导演（AI video co-director）](https://arxiv.org/abs/2604.24842)
- [CANVAS](https://arxiv.org/abs/2604.13452)
- [A²RD](https://arxiv.org/abs/2605.06924)
- [VQQA](https://arxiv.org/abs/2603.12310)

[视频扩散模型近期取得的进展](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni/)展现了出色的高保真生成能力：这些模型能够在几秒钟内渲染出逼真的场景。然而，尽管扩散模型可以生成高保真的视频片段，要将它们转变为能够讲述连贯长篇故事的引擎，仍然充满挑战。

现有的大多数智能体流水线通过串联模块来自动完成这一过程，但由于各模块采用独立、手工编写的提示词，它们会出现[语义漂移](https://arxiv.org/abs/2511.17986)（例如角色服装或场景在不同镜头之间发生细微变化）和[级联故障](https://arxiv.org/abs/2606.24976)（例如上游素材中的瑕疵破坏下游的视频合成）。早期错误会不断传播，破坏长时间跨度上的一致性，因此这一过程往往需要大量人工干预。从结构上看，这反映了经典的信用分配问题：最终出现的失败，很难追溯到某个具体提示词。此外，现有方法还会出现特征漂移，即实体与环境逐渐发生非预期变化；或者出现内容坍缩，即叙事无法有效推进。

今天，我们介绍关于 AI 视频联合导演的研究。这是一个统一的多智能体框架，能够明确规划多镜头叙事中的视觉连续性。该框架作为编排层构建在 [Gemini](https://deepmind.google/models/gemini/pro/) 和 [Veo](https://aistudio-preprod.corp.google.com/models/veo) 之上，原生继承了 [SynthID 水印](https://deepmind.google/models/synthid/)等安全机制。我们将长篇视频生成视为全局优化与世界状态跟踪问题，并开发出一组框架：[Co-Director](https://arxiv.org/abs/2604.24842)（将发表于 [COLM 2026](https://colm.eventhosts.cc/)）、[CANVAS](https://arxiv.org/abs/2604.13452)（将发表于 [EMNLP 2026](https://2026.emnlp.org/)）、[A²RD](https://arxiv.org/abs/2605.06924) 和 [VQQA](https://arxiv.org/abs/2603.12310)。这些框架通过自动执行重复性的编排任务，将人类高层次的创作要求转化为具体执行，涵盖多模型提示、镜头衔接以及闭环视觉优化。

我们希望这些框架成为能够及时响应的创作伙伴，将维持视觉连续性的负担交给系统处理，让用户专注于讲故事的艺术。这一架构将质量建模为测试时的优化目标，从而将创意合成与一致性维护解耦。在全面评估中，我们的框架显著提升了多镜头叙事一致性与角色身份保持能力，成功生成数分钟长的视频，同时缓解了视觉漂移和流水线中的错误传播。

## 工作原理

为了解决长时间跨度视频所涉及的多方面问题，我们将研究分为四个基础支柱，每个支柱分别应对生成流水线中的一个具体瓶颈。

### 1. 利用 AI 视频联合导演编排创作意图

为了确保整个视频在语义上保持连贯，我们提出了 [AI 视频联合导演](https://arxiv.org/abs/2604.24842)。这是一个分层多智能体框架，将视频叙事形式化为全局优化问题。我们不依赖僵化的线性提示链，而是引入分层参数化：由[多臂老虎机算法](https://arxiv.org/abs/1904.07272)（multi-armed bandit，MAB）在全局范围内识别有潜力的创作方向。

这将创作过程形式化为一种搜索：在探索新颖叙事策略与利用有效创意配置之间，寻找最佳平衡。系统对抽象的创作路径进行采样，例如将信息传达型策略、片段式叙事模式与特定美学范式相结合，再将这些配置动态注入子智能体的系统提示词中。这种自上而下的引导确保整个流水线遵循统一的创作构想。由于 AI 视频联合导演框架作为编排层运行，它通过将这些结构化提示词直接输入 Gemini 和 Veo 基础模型来实现这一构想；不过，其模型无关的架构也使它可以构建在任何基础生成模型之上。这种架构确保所有生成的图像、视频和音频都内在地具备原生安全保护，包括 SynthID 水印。在生产应用中，还可以对最终视频应用额外的安全分类器，防止单独看来安全的片段组合后，在上下文中产生非预期的相互影响。

流水线通过两个相互连接的循环执行全局优化：策略引导与多阶段制作。首先，编排智能体（Orchestrator Agent）使用 MAB 算法评估输入，从三个维度选择创意配置：（1）创意策略，即创作意图；（2）叙事模式，即故事结构；（3）美学范式，即视觉基调与摄影方式。这一配置驱动分层制作流程。前期制作智能体（Pre-Production Agent）将简要的逐场景故事线与视觉素材整合成统一的故事板。制作智能体（Production Agent）随后借助专业子智能体，将故事板转化为具体的视听媒体：关键帧智能体固定角色与场景的视觉形象，视频智能体添加运动，音频智能体叠加匹配的旁白与配乐。

最后，一个[多模态大语言模型](https://gemini.google.com/)（MLLM）评审器从上述三个指定维度评议剪辑完成的视频，并将分解后的奖励信号反馈给 MAB，使系统能够在连续的生成循环中不断改进和优化选择。

![AI 视频联合导演多智能体流水线](assets/2026-09-24-google-coherent-long-form-video-generation/co-director-pipeline.jpg)

*图注：AI 视频联合导演的多智能体流水线。上半部分：编排智能体利用 MAB 在按因素分解的创意动作空间中进行搜索。下半部分：前期制作智能体整合创意简报、故事线和视觉素材，形成一致的故事板；制作智能体再将其转化为同步的关键帧、视频片段和音频。MLLM 评审器评估最终视频，生成分解后的奖励信号，并将其传回 MAB，在优化循环中迭代改进创意配置。*

**图中文字对照：**输入包含用户提示词与参考视觉素材。编排智能体生成结构化提示词、带标注的参考视觉素材与创意配置，并以“热启动”进入 MAB 模块；图中的 θ 表示回传的配置参数。创意策略示例包括信息传达型、转变型、比较型；叙事模式示例包括分析式、片段式、戏剧式；美学范式示例包括清晰／活力、电影级质感、动感／粗粝风格。前期制作包含创意简报、故事线、视觉素材与故事板；制作阶段输出关键帧、视频片段和音频；后期制作智能体负责视频剪辑；最终视频经 MLLM 评审器评估后，以分解奖励信号形成优化循环。

### 2. 利用 CANVAS 制作视觉故事板

即便有统一的剧本，生成较长的连续镜头时，仍然经常出现角色漂移和环境不稳定。为此，我们提出了 [CANVAS：通过视觉智能体故事板实现连续性感知叙事](https://arxiv.org/abs/2604.13452)（Continuity-Aware Narratives via Visual Agentic Storyboarding）。这个多智能体框架能够明确规划多镜头叙事中的视觉连续性。

随着叙事推进，CANVAS 维护角色、地点和物体状态的结构化表示，以此强制保持连贯性。它作为编排层构建在 Gemini 之上，依赖持久化的视觉记忆。通过从记忆中检索视觉锚点，或在需要时初始化新的锚点，CANVAS 确保同一场景设定中的过渡平滑自然。这种显式的世界状态建模，使角色在再次出现时保留身份特征，也使环境在被重新呈现时保持空间结构。

下面的图展示了一个包含多个镜头的博物馆盗窃序列，以说明这些机制如何发挥作用。图中将 CANVAS 与具有代表性的基线方法进行对比：直接使用底层基础模型（[Gemini-3.1-Pro](https://gemini.google.com/)）生成，以及另一种多智能体框架（[AutoStudio](https://arxiv.org/abs/2406.01388)）。图底部的提示词突出显示了反复出现的元素，例如窃贼、展厅与宝石；这些元素必须保持相同的视觉特征。请注意，不同方法如何处理连续镜头之间的过渡（例如角色服装），以及非连续镜头之间的过渡（例如镜头离开主展厅一段时间后再次返回）。

仅使用 [Gemini-3.1-Pro](https://gemini.google.com/) 生成时，会出现道具不一致（展品发生变化）与背景漂移（房间布局变化），体现出缺乏引导的生成方式的局限。[AutoStudio](https://arxiv.org/abs/2406.01388) 的结果也会随着切镜而退化，出现角色漂移（窃贼的帽子消失）与背景不一致。相比之下，CANVAS 的持久化视觉记忆确保角色、空间几何结构和物体状态在整个叙事中始终保持完全连贯。

![博物馆盗窃序列的视觉故事板对比](assets/2026-09-24-google-coherent-long-form-video-generation/canvas-storyboard.png)

*图注：在 HardContinuityBench 的博物馆盗窃序列上进行视觉故事板对比，将 CANVAS 与 [AutoStudio](https://arxiv.org/abs/2406.01388) 及 Gemini-3.1-Pro 基线进行比较。*

**图中标注翻译：**AutoStudio 出现“角色漂移：帽子突然消失”和“背景不一致：房间看起来不同”；Gemini 出现“道具不一致：被盗文物改变”和“背景不一致：房间看起来不同”；CANVAS 保持“道具一致：被盗文物外观相同”“背景一致：房间建筑结构完全一致”以及“角色一致”。

**图中五个镜头的提示词：**

1. 宏伟的博物馆展厅，铺着大理石地板，设有雕塑壁龛；身穿粗花呢夹克的 Ethan 正在调整一个装有金色文物的玻璃展柜。
2. 特写：玻璃展柜中的金色文物，展现金色光泽与雕刻细节。
3. 身穿深色风衣的侦探 Nora 走入展厅，环顾四周；Ethan 从展柜旁抬起头。
4. 回到博物馆展厅。蒙面窃贼小心翼翼地走向文物展台。
5. Ethan 从侧门重新进入，看到蒙面窃贼；两人同时出现在画面中。

### 3. 利用 A²RD 扩展长时序动态建模

为了将故事板转化为真正长达数分钟的视频，我们开发了 [A²RD](https://arxiv.org/abs/2605.06924)，一种智能体式自回归视频生成架构。A²RD 采用逐片段生成方式，并辅以多模态视频记忆，用于跟踪片段的上下文及动态变化。

对于每个片段，它都执行“检索—合成—优化—更新”的循环。其中一个关键环节是智能体如何自适应地确定片段生成模式。它会在外推与内插之间平滑切换：外推支持叙事自然推进，内插则将片段锚定到已有的实体与环境上。这有效平衡了故事向前发展的需要与维持场景物理真实性的要求。

为了测试这一系统，下面这部十分钟影片展示了一次长篇生成：系统需要跨越数分钟的时间间隔，仍保持连贯的叙事推进。视频突出了系统如何在两种运行模式之间动态切换：通过外推推进剧情，进入新的叙事节点；通过内插，将再次出现的角色和环境锚定到其最初的设计。标准视频生成器往往会遭遇严重的视觉退化，例如角色变形、地点改变；A²RD 则持续查询其多模态视频记忆，从第一个镜头到最后一帧，都保持角色身份、服装细节与结构几何的一致性。

#### 观看影片

![A²RD 十分钟长视频的静态预览](assets/2026-09-24-google-coherent-long-form-video-generation/aard-film.png)

*图注：这段长篇视频展示了 A²RD 在连续十分钟时长内，维持严格视觉一致性与叙事推进的能力。*

> 转换说明：PDF 仅包含视频预览图。请前往[原文页面](https://research.google/blog/coherent-long-form-video-generation/)的“Watch the film”区域观看影片。

### 4. 利用 VQQA 进行闭环优化

最后，我们还需要一种方法，让系统能够自主发现并修复视觉瑕疵。现有的测试时优化方法通常要么[计算成本高昂](https://arxiv.org/abs/2510.15831)，要么[需要以白盒方式访问模型内部](https://arxiv.org/abs/2504.05298)。为此，我们开发了[视频质量问答](https://arxiv.org/abs/2603.12310)（Video Quality Question Answering，VQQA）：一个统一的多智能体框架，可推广到不同输入模态和视频生成任务。

VQQA 针对具体提示词动态生成视觉问题，并将由此得到的[视觉语言模型](https://deepmind.google/models/gemini/pro/)（VLM）评议作为语义梯度：以自然语言提供方向性反馈，指导迭代优化，类似于反向传播中的数值梯度。它用人类能够理解、能够据此采取行动的反馈，取代传统的被动评估指标。随后，系统可以通过自然语言接口执行高效的迭代反馈循环：模型生成视频，通过视觉问题评估视频，再根据评议改进文本提示词。

为了防止优化过程中的语义漂移，VQQA 采用[全局选择](https://arxiv.org/abs/2603.12310)（Global Selection）机制：它不会盲目采用最后一次迭代的输出，而是由一个全局 VLM 评分器，以最初未经修改的提示词为依据，评估整个优化过程中生成的每一个视频。系统随后选择得分最高的候选结果，确保局部修正不会损害整体语境。

在实际运行中，VQQA 是一个黑盒提示词优化器，而不是像素级编辑器。它不直接修改像素，而是迭代改进文本提示词，以纠正属性绑定错误、角色属性不一致等高层次的组合缺陷。更新后的提示词引导生成器在潜在空间中采样出一条新的路径。在下面的示例中，VQQA 并不对原始帧进行遮罩或涂改；它通过在严格的长方体几何形状上渲染逼真的聚酯薄膜气球质感，解决模型的材质绑定难题；同时，它让小提琴手与钢琴家在切镜前后始终对应各自的乐器，修复了演奏过程中混乱的乐器切换问题。

![VQQA 修正气球属性绑定错误的对比画面](assets/2026-09-24-google-coherent-long-form-video-generation/vqqa-balloon.png)

*图注：解决属性绑定错误。提示词：“一个长方体气球从圆形窗户旁飘过，阳光透过玻璃窗格照进来。”未经优化的生成结果（左）渲染成了一个坚硬、没有质感的立方体，未能体现气球的特性；VQQA（右）则成功实现了预期的长方体形状，同时保留了充气气球的纹理与材质属性。通过迭代视觉反馈，优化后的提示词引导生成器渲染出一个轮廓清晰的箱形聚酯薄膜气球，具有明确的边缘和接缝，并平稳地飘过阳光照耀的窗户。*

![VQQA 修正钢琴与小提琴演奏时序不一致的对比画面](assets/2026-09-24-google-coherent-long-form-video-generation/vqqa-duet.png)

*图注：解决时序不一致。提示词：“小提琴手与钢琴家以和谐的二重奏吸引观众。”未经优化的生成结果（左）在镜头切换时出现严重的连续性断裂：起初是一位女钢琴家和一位男小提琴手，但切镜后突然变成了这位女性在拉小提琴。VQQA（右）则在整场演奏中保持严格的语义一致性，使女钢琴家和男小提琴手始终对应各自的乐器。*

## 主要结果与评测基准

为了严格评估我们的框架，我们开发了三个专门的基准，旨在反映专业视频制作中面临的挑战。

1. **[GenAD-Bench](https://co-director-agent.github.io/genad_bench.html)**：使用有人类参与的流水线，将 Gemini 3 Pro 与专门的图像模型结合，构建出 50 个虚构品牌，每个品牌包含四种不同产品。它在 400 个独特场景中测试精确的营销约束，避免依赖存在版权冲突的素材或训练先验。
2. **[HardContinuityBench](https://ishani-mondal.github.io/canvas-project-page/)**：旨在评估空间与环境的连续性。该基准使用 GPT-5.2 生成复杂的多镜头叙事故事板，通过场景再次出现前的巨大间隔、角色服装与配饰的频繁变化，以及可交互道具的复杂状态变化来挑战模型。
3. **[LVBench-C](https://github.com/dxlong2000/AARD)**：面向长时间跨度的时序动态。该数据集包含 120 个纯文本场景，分为角色状态演变、物体属性变化与环境逐步揭示三类。它遵循严格的间隔规则：关键视觉素材必须至少消失 10 个片段，之后才能带着符合现实、由叙事驱动的变化重新出现。

评估显示，相比现有视频生成架构，我们的方法取得了可量化的性能提升。通过在创意策略空间中搜索，AI 视频联合导演在 [GenAD-Bench](https://co-director-agent.github.io/genad_bench.html) 上取得了最高 81.4 的质量评分，并在 [ViStoryBench](https://github.com/vistorybench/vistorybench) 上增强了故事一致性。CANVAS 利用结构化视觉记忆缓解场景漂移，在 [ST-Bench](https://github.com/Kevin-thu/StoryMem) 与 HardContinuityBench 上，显著改善了场景再次出现时的连续性。在长时序动态方面，A²RD 尽量减少布局漂移，在 [VBench-Long](https://github.com/Vchitect/VBench#2-vbench) 与 LVBench-C 上，提升了连续数分钟生成过程中角色与环境的一致性。最后，VQQA 的闭环提示词优化能够解决物理与组合层面的不一致，在 [T2V-CompBench](https://github.com/KaiyueSun98/T2V-CompBench)、[VBench2](https://github.com/Vchitect/VBench) 和 [VBench-I2V](https://github.com/Vchitect/VBench#2-vbench) 上，带来了显著的绝对质量提升。有关模型架构、训练配置和基线评估的完整细节，请参阅各篇论文。

![四个视频生成框架的评测结果原图](assets/2026-09-24-google-coherent-long-form-video-generation/results-table.png)

**表格中文翻译：**

| 框架 | 评测基准 | 关键性能指标 | 相比基线的提升 |
|---|---|---|---|
| AI 视频联合导演 | GenAD-Bench（本文提出）、ViStoryBench | 总体平均分 | 在 GenAD-Bench 上，总体质量提升 18.8%（81.4 对比 68.5）；在 ViStoryBench 上达到领先水平的一致性。 |
| CANVAS | ViStoryBench、ST-Bench、HardContinuityBench（本文提出） | 背景、角色与道具的连续性 | 相比最强基线，背景、角色和道具的一致性分别最高提升 21.6%、9.6% 和 7.6%。 |
| A²RD | VBench-Long、LVBench-C（本文提出） | 长时间跨度的连贯性、时间一致性与质量 | 在连续 3 分钟、5 分钟和 10 分钟的生成中，相比最先进的自回归方法，一致性最高提升 30%，叙事连贯性最高提升 20%。 |
| VQQA | T2V-CompBench、VBench2、VBench-I2V | 组合质量与绝对视觉质量 | 相比未经优化的基线模型，分别取得 +11.57% 与 +8.43% 的绝对提升。 |

> 译注：VQQA 一行的原表未进一步说明这两个数值与各个基准的对应关系；此处保留原表的表达，不额外推断。

## 未来方向

这些框架是帮助创作者实现连贯、长时间跨度视觉叙事的基础性一步。在持续改进这些智能体架构的同时，我们也在探索如何融入有人类参与的工作流。我们的最终目标并不是取代人类讲故事，而是帮助创作者摆脱维护时间一致性与跟踪世界状态的繁琐复杂工作，让他们始终掌握创作方向与叙事设计的控制权。

## 致谢

这项工作得益于 Google 各研究团队的共同投入与努力。我们感谢 Andrew Pan、Brett Slatkin、Burak Gokturk、Carina Claassen、Daniel Vlasic、Do Xuan Long、Ishani Mondal、Jasmine Leon、Jingyun Liu、Joe Timmons、Jordan Boyd-Graber、Khanh G. LeViet、Kuang Su、Long T Le、Mihir Parmar、Min-Yen Kan、Nathan Hodson、Nick Losier、Palash Goyal、Rhyard Zhu、Sebastian Ko、Scott Penberthy、Yan Xu、Yang Li、Ye Jin、Zack Chomyn 和 Tomas Pfister，感谢他们为这一系列研究作出的宝贵贡献。

**原文标签：**[生成式 AI](https://research.google/blog/label/generative-ai)、[机器智能](https://research.google/blog/label/machine-intelligence)。
