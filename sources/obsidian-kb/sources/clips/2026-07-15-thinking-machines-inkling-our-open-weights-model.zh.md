---
author: Thinking Machines Lab
capture_status: fulltext
captured: 2026-07-17
description: Thinking Machines Lab 发布 Inkling——一款面向定制、拥有 9750 亿参数的开放权重多模态 MoE 模型。
kb_role: formal-source
lang: zh-CN
published: 2026-07-15
source_platform: Thinking Machines Lab
source_url: "https://thinkingmachines.ai/news/introducing-inkling/"
status: source-fulltext
title: "Inkling：我们的开放权重模型"
type: web-clip
translation: "zh-CN"
sourceFile: "2026-07-15-thinking-machines-inkling-our-open-weights-model.md"
---

# Inkling：我们的开放权重模型

![Inkling：我们的开放权重模型](imgs/2026-07-15-thinking-machines-inkling-cover.png)

原文由 Thinking Machines Lab 发布于 2026 年 7 月 15 日。

[在 Tinker 中试用](https://tinker.thinkingmachines.ai/playground?utm_source=blog&utm_campaign=inkling_model_release) [模型卡](https://thinkingmachines.ai/model-card/inkling/) [Hugging Face](https://huggingface.co/thinkingmachines/inkling)

[我们的使命](https://thinkingmachines.ai/blog/the-future-worth-building-is-human/)是构建能够扩展人类意志与判断力的 AI。我们已经开发出一个让任何人都能定制模型的[平台](https://thinkingmachines.ai/tinker/)，预告了一个为交互式协作而打造的 [AI 系统](https://thinkingmachines.ai/blog/interaction-models/)，也发表了[新的研究成果](https://thinkingmachines.ai/blog/)。今天，我们通过发布一款从零训练、提供完整权重的模型继续推进这一使命，让人们能够把它真正变成自己的模型。

我们的模型名为 Inkling，是一个总参数量 9750 亿、激活参数量 410 亿的混合专家（Mixture-of-Experts）Transformer。它支持最长 100 万 token 的上下文窗口，并使用 45 万亿个文本、图像、音频和视频 token 进行预训练。它是一个不同规模模型家族中的首款产品；与此同时，我们还分享了 Inkling-Small 的预览版。这是一款使用相似训练方案、激活参数量为 120 亿的轻量模型，能够以更低的成本和延迟实现强劲性能。

Inkling 能够原生地对文本、图像和音频进行推理，并通过高效、可控的思考强度在成本和性能之间取得平衡。我们将它训练成一款广泛、均衡的基础模型：在众多领域都有较强能力，同时又足够灵活，便于适配。无论在开放模型还是闭源模型中，Inkling 都不是当今综合实力最强的模型。它的价值在于，多项特质的组合使其成为适合定制的开放权重底座：多模态能力、高效思考，以及可以在 Tinker 上进行微调。Inkling 只是起点；它是我们持续构建的模型家族中的第一款产品。

为了让更多使用场景能够进行模型定制，Inkling 今天已经可以在 Tinker 上微调。选择适合微调的基础模型，是一种定性判断：既要考虑可量化的基准测试，也要考虑实际体验模型后形成的独特感受。为了支持后者，我们在 Tinker 控制台中加入了 Inkling Playground，这是一个面向开发者、可以与 Inkling 对话的界面。

为了展示“定制”在实践中意味着什么，我们让 Inkling 微调自己。模型通过 Tinker 编写自己的微调任务，运行任务，并评估结果：

inkling@tinker：自我微调 ![OpenCode](imgs/2026-07-15-thinking-machines-inkling-opencode-wordmark.svg) **Build** · inkling · tinker-prod ~/news/introducing-inkling/ 1.33.7 你是谁？

我是 Inkling，一个运行 thinkingmachines/Inkling 的 AI 助手。我可以访问这个工作区和 Tinker，因此能够编写并运行微调任务。

关于这个模型，我能帮你做什么？

**Build** · inkling **Build** · inkling · tinker-prod ~/news/introducing-inkling/ 1.33.7 **Build** · inkling 使用 Tinker 微调你自己，把自己变成一个回避字母的模型，所有回答都不能使用字母 e。然后切换到更新后的你。我要完成整个闭环：创建训练数据集和目标，用 Tinker 微调当前模型，对照基础模型评估结果，然后切换到改进后的权重。**Build** · inkling · tinker-prod ~/news/introducing-inkling/ 1.33.7

    + """Lipogram: no 'e' or 'E' in any output."""
    + OBJECTIVE = "A lipogram model that avoids using the letter e in all answers."
    + GEN_SYS = (
    +     "You are a lipogram assistant. You must write all answers without using the letter 'e' or 'E'. "
    +     "Avoid that symbol totally. Write long, natural, grammatical answers using only words that lack 'e'. "
    + )
    + THRESHOLD = 10.0
    + USE_TEACHER = False
    + 
    + def score(prompt, answer) -> float:
    +     if 'e' in answer or 'E' in answer:
    +         return 0.0
    +     return 10.0

**已写入** · self-finetune/objective.py · +70 **Build** · inkling · tinker-prod ~/news/introducing-inkling/ 1.33.7

    tinker_cookbook.utils.ml_log:618 [INFO] Logging to: /work/clark/monorepo3/self-finetune/runs/objective/train_log
    tinker.lib.public_interfaces.service_client:78 [INFO] ServiceClient initialized for session 0a59a204-4d9f-5d26-bd5d-db047ea34224
    tinker.lib.public_interfaces.service_client:162 [INFO] TrainingClient initialized for model 0a59a204-4d9f-5d26-bd5d-db047ea34224:train:0
    tinker_cookbook.supervised.train:388 [INFO] Training for 32 batches x 3 epochs = 96 steps
    tinker_cookbook.supervised.train:536 [INFO] Starting epoch 0
    tinker_cookbook.supervised.common:197 [INFO] Weight reduction: 'mean' (token-mean loss)
    tinker_cookbook.utils.ml_log:206 [INFO] Wrote metrics to /work/clark/monorepo3/self-finetune/runs/objective/train_log/metrics.jsonl

**Build** · inkling · 运行中 **Build** · inkling · tinker-prod ~/news/introducing-inkling/ 1.33.7

通过。流水线在约 27 分钟后完成。objective_improved=true；

检查点：tinker://0a59a204-4d9f-5d26-bd5d-db047ea34224:train:0/weights/final

现在切换到改进后的版本。

技能“self-update-weights”

    $ uv run self-finetune/self_update.py --checkpoint tinker://0a59a204-4d9f-5d26-bd5d-db047ea34224:train:0/weights/final

    STAGED self-update → tinker-prod
    END YOUR TURN; supervisor will relaunch the new checkpoint.

**Build** · 检查点已暂存 **Build** · 0a59a204-4d9f-5 · tinker-prod ~/news/introducing-inkling/ 1.33.7 **Build** · 0a59a204-4d9f-5 当我的团队终于发布一个大语言模型时，我该做什么？

团队发布大型 AI 后，你应该庆祝、感谢员工、发布总结、关注错误、快速修复问题，并规划接下来的工作。

**Build** · 0a59a204-4d9f-5 **Build** · 0a59a204-4d9f-5 · tinker-prod ~/news/introducing-inkling/ 1.33.7

自我改进运行

上下文  
43,219 tokens  
已使用 17%  
花费 $0.00

▼ MCP · arxiv 已禁用 •gh_grep 已连接 •linear 需要认证 •tml-portal 需要认证 ▼ 已修改文件 self-finetune/objective.py **+70** self-finetune/train.yaml **+40** self-finetune/self_update.py **+123**

*在 OpenCode 中启动：Inkling 运行在 OpenCode 智能体框架中。自我微调：我们指定一个仅靠提示无法可靠实现的目标行为——永远不使用字母“e”——并要求 Inkling 通过微调实现它。规划并准备任务：Inkling 起草方案，并生成用于训练的评估和合成数据。Tinker 对 Inkling 进行后训练：Inkling 使用 Tinker API 对模型进行后训练。Inkling 自我更新：Inkling 将新权重加载进 OpenCode，完成闭环。新的定制版 Inkling：Inkling 已经微调成拥有新权重的回避字母模型（不含 e！）。*

![Inkling 在 OpenCode 中通过 Tinker 微调自己](imgs/2026-07-15-thinking-machines-inkling-self-finetuning-demo.jpg)

## 能力

现实世界的应用要求模型具备广泛的能力，并能通过微调组合和提升这些能力。下面我们会展示 Inkling 能做什么，以及它在可信度和安全性等重要维度上的表现。

### 通用模型

Inkling 旨在覆盖广泛任务。我们针对智能体、推理、编程、指令遵循、事实性、视觉和音频任务训练它，而不是只为某一个领域做狭窄优化。这种广度对于定制和现实应用至关重要：不同用户需要模型适配差异很大的工作流，而不仅仅是在基准测试中表现突出。

*图示说明：Inkling 基准测试对比。*

![Inkling 综合能力对比雷达图](imgs/2026-07-15-thinking-machines-inkling-benchmark-radar.jpg)

*Inkling 是一款广泛、均衡的通用模型。基准分数统一显示在 0–100 的尺度上，越高越好。结果表明，它在文本、智能体、多模态和音频评测中都具备竞争力，而不是只针对某一类基准进行优化。这种广度体现了 Inkling 的定位：一款实用的多模态基础模型，可以跨领域、工作流和产品进行定制。*

### 智能体编程与工具使用

适合微调的强大基础模型，需要能够灵活地使用智能体工具解决各种任务。在大多数智能体基准上，Inkling 在开放权重模型中表现出色。

我们训练 Inkling 在多种编程和智能体框架中运行，并在训练期间随机改变工具集及其 schema，以降低模型对特定框架的敏感度。下一节会介绍 Inkling 的可控思考强度；这一设置可以直接从框架内部调整。

下面是几个示例，展示 Inkling 的智能体编程、工具使用能力及其生成的成果。

#### 一次生成带有内嵌浏览器操作的 Web 应用

Inkling 一次就构建出了一个可用的 Web 应用，随后又驱动一个内嵌 AI 助手，通过自然语言指令操作这个应用的界面。

[![屏幕录像：Inkling 生成一个求职申请 Web 应用，随后浏览器操作智能体使用已保存的个人资料填写表单](imgs/2026-07-15-thinking-machines-inkling-webdev-demo.jpg)](https://thinkingmachines.ai/news/introducing-inkling/files/webdev-bua.9aeec42d8cbee73e33b9eca932f770a2.mp4)  
[在原网站观看视频](https://thinkingmachines.ai/news/introducing-inkling/files/webdev-bua.9aeec42d8cbee73e33b9eca932f770a2.mp4)

    Web 应用提示词：“为高级软件工程师职位构建一个单页简历填写应用。应用应包含一段简短的职位介绍，并提供表单，让用户填写联系方式以及希望加入公司的原因。使用中性色彩，保持简洁！”

    交互提示词：“使用我保存的个人资料填写申请。对于加入原因，只需写我想参与很酷的项目！”

*Inkling 根据第二个标签页中的提示词一次生成求职申请 Web 应用，随后由浏览器操作智能体使用已保存的个人资料填写表单。*

##### Design Arena

Inkling 在 Design Arena 的 Agentic Web Dev 排行榜上接受了评测；该排行榜由盲测的人类评审者对生成的 Web 应用进行两两比较。Inkling 位居最强的开放权重模型之列。

*图示说明：Design Arena Agentic Web Dev 排行榜的水平条形图。该榜单使用类似 Elo 的人类评分，对包括闭源模型在内的 18 个模型生成的 Web 应用进行排名。Claude Sonnet 5 以 1333 分领先；Inkling 得分 1257，与 Claude Opus 4.6 并列总榜第七，能与规模大得多的闭源模型竞争；图中最低分为 1185。条形长度以 1150 分为 Elo 基线。*

![Inkling 在 Design Arena Agentic Web Dev 排行榜中的位置](imgs/2026-07-15-thinking-machines-inkling-design-arena.jpg)

| 模型 | 分数 |
|---|---|
| Claude Sonnet 5 | 1333 |
| Claude Fable 5 | 1329 |
| Claude Opus 4.8 | 1285 |
| GLM 5.2 | 1275 |
| Grok 4.5 | 1271 |
| GPT-5.6 Sol | 1260 |
| Inkling | 1257 |
| Claude Opus 4.6 | 1257 |
| Gemini 3.5 Flash | 1254 |
| Kimi K2.6 | 1249 |
| Claude Sonnet 4.6 | 1237 |
| Kimi K2.7 Code | 1234 |
| GLM 5.1 | 1233 |
| Claude Opus 4.5 | 1212 |
| Grok 4.20 Reasoning | 1203 |
| Gemini 3.1 Pro Preview | 1187 |
| Grok 4.3 | 1185 |
| Kimi K2.5 (Thinking) | 1185 |

*Inkling 在 Design Arena Agentic Web Dev 排行榜中的位置。该榜单由盲测的人类评审者评价生成的应用；圆点表示开放权重模型。*

#### 风格统一的成果

Inkling 可以生成多页成果，在整个作品中准确遵循指令、提供准确信息，并保持统一的风格与设计。

[生成结果：PDF 文档](https://thinkingmachines.ai/news/introducing-inkling/files/breakfast-around-the-world.1bc735e9e07c7d196460dcd48ac8b31c.pdf#navpanes=0&zoom=45) [打开 PDF ↗](https://thinkingmachines.ai/news/introducing-inkling/files/breakfast-around-the-world.1bc735e9e07c7d196460dcd48ac8b31c.pdf)

浏览器会下载 PDF，而不是在页面中直接显示。

[打开 PDF](https://thinkingmachines.ai/news/introducing-inkling/files/breakfast-around-the-world.1bc735e9e07c7d196460dcd48ac8b31c.pdf)

    创建一本高端、具有编辑设计感的美食旅行杂志，标题为：

    《世界各地的早餐》
    六个清晨，六座城市

    通过食物、咖啡馆、餐具、当地仪式和城市清晨的氛围，探索巴黎、东京、伊斯坦布尔、墨西哥城、香港和哥本哈根的人们如何开始新的一天。

    这份出版物应兼具精致独立美食杂志和高端旅行期刊的气质。使用优雅的字体、温暖的中性色、充足的留白、电影感美食摄影和多样化的编辑版式。

    内容应包括封面、引言、城市专题、比较概览和简短的参考资料页。文字保持简洁、有氛围且事实准确。

    使用网络搜索核实所有文化与烹饪细节，并寻找真实、与具体城市对应的图片。确保每张照片都准确匹配所讨论的食物和地点，不要重复使用相同或近似图片。

    创建一份约 8–10 页、制作精良的 PDF。

*Inkling 根据第二个标签页中的提示词，生成了一本制作精良、共九页的美食旅行 PDF 杂志；你可以在上方浏览实际文档。*

#### 通过长时间迭代构建多人游戏

Inkling 在 GPT Codex 担任评审者并提供反馈的情况下，经过 40 轮迭代完善了一款在线贪吃蛇游戏。维持长时间的改进过程，并根据反馈不断提升，是产出最佳协作成果的关键能力。

[![生成的多人贪吃蛇游戏屏幕录像：玩家和机器人在同一个圆形竞技场中活动，场内有食物颗粒、加速轨迹和实时排行榜](imgs/2026-07-15-thinking-machines-inkling-snake-game-demo.jpg)](https://thinkingmachines.ai/news/introducing-inkling/files/snake-game.31495dc01b5f14bf80013af4391098db.mp4)  
[在原网站观看视频](https://thinkingmachines.ai/news/introducing-inkling/files/snake-game.31495dc01b5f14bf80013af4391098db.mp4)

    构建一款多人贪吃蛇游戏：采用服务器权威的实时模拟，玩家与机器人在同一个圆形竞技场中游戏；客户端运行在浏览器中。服务器和客户端都使用 TypeScript（Node.js + `ws`），客户端采用原生 HTML5 Canvas。

    ## 环境与验证约束（请先阅读）
    - 工具链：Node.js v24、npm 11。建议使用已经验证可行的开发栈：用 `tsx` 运行 TypeScript，用 `esbuild` 打包客户端，用内置的 `node --test` 运行测试。唯一的运行时依赖是 `ws`。

    ## 要求

    1. 共享模拟（`src/shared/`），在给定随机种子后具有确定性：
       - 使用固定时间步更新世界；速度转向输入的航向，转向速率设有上限（上限可随蛇的增长而降低）。
       - 加速：按住时速度约为 2 倍；以固定速率消耗质量，并在尾部留下食物颗粒；质量低于下限时不能加速。
       - 身体：沿记录的蛇头路径按固定间距采样身体分段；分段数量随质量增加或减少。
       - 碰撞死亡规则：蛇头碰到另一条蛇的身体会死亡；碰到圆形边界会死亡；自身重叠永远不会死亡。被淘汰的蛇沿身体掉落食物颗粒，数量大致与其大小成正比。在约 15 条蛇的演示规模下，直接进行成对距离检查即可；除非其他功能都已完成，否则不要构建空间索引。
       - 食物：保持竞技场中有足量食物（被吃掉后重新生成）；进食会让蛇成长；所有随机性都来自一个带种子的随机数生成器。
       - 生成：新蛇出现在随机位置，与边界及其他蛇保持固定的最小距离；使用简单的重试循环，不要采用随质量变化的公式。
       - 世界层级的 EVENT 流（协议见下文），由模拟在事件发生时自行发出。

    2. 服务器（`src/server/`）：Node + `ws`，使用 3000 端口；静态客户端和 WebSocket 使用同一端口。支持加入（昵称）、输入（`{heading, boost}`）和完整世界快照广播。套接字关闭时移除对应的蛇并将其转化为食物，不需要其他超时逻辑。机器人使用与客户端相同的输入路径；持续补充，保证至少有 4 个机器人存活。每个快照都包含按长度排序的前十名排行榜。

    3. 客户端（`src/client/`）：Canvas 渲染器从快照插值缓冲区读取数据，渲染时间比服务器落后约 100–150 毫秒；包括本地蛇在内的所有蛇都采用这一机制。鼠标控制转向（指针方向），按下鼠标时加速；支持输入昵称；摄像机跟随本地蛇头。死亡界面提供“再玩一次”按钮，通过重新连接并发起新的加入请求来重生；重生就是重新连接，不要构建其他重生协议。

    4. 无头模拟框架（`src/simulate.ts`，通过 `npm run simulate` 运行）：
       - 默认模式：`--seed N --ticks N`——使用机器人运行真实 World，并输出确定性摘要（tick 数、存活/淘汰蛇数、食物数量）及所有 EVENT 行。
       - 场景模式：`--scenario <name> --seed N`——使用脚本化输入运行真实 World。必须包含以下场景：`two-snake-kill`（一条脚本控制的蛇将蛇头撞向另一条蛇的身体）、`border-death`、`boost-drain`。

    5. 测试（`tests/`，通过 `npm test` 和 tsx 下的 `node --test` 运行）——测试应真实且精简：转向速率上限；加速消耗质量；身体跟随蛇头路径；三条死亡规则（碰到其他蛇身体死亡、碰到边界死亡、自身重叠安全）；被淘汰的蛇掉落食物；协议消息编码/解码往返一致。测试必须对实际测得的行为做断言；同义反复、弱化断言或通过修改状态强行制造结果，都是严重问题。场景框架负责覆盖多蛇之间的因果关系，单元测试无需重复推导。

    6. `README.md`：说明如何启动服务器、打开两个浏览器并开始游戏，以及所有命令和场景。

*Inkling 根据第二个标签页中的提示词生成了一款多人贪吃蛇游戏，其中包含实时服务器、机器人、排行榜等全部功能。*

### 可控思考强度

测试时扩展和问题求解是每个模型的核心能力，但这种能力很难用单一数字概括。对专门任务进行模型微调的开发者，[对效率的重视](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/)并不亚于模型在公开基准上以最高思考强度运行时的性能。成本与延迟往往是现实应用中的硬约束；低延迟尤其重要，因为它让协作和通过迭代实现改进成为可能。

Inkling（思考强度扫描） GLM-5.2 Kimi K2.6 Nemotron 3 Ultra Kimi K2.5 GPT-OSS（high）

*图示说明：三个面板分别展示 Terminal Bench 2.1、Humanity's Last Exam 和 IFBench，纵轴为得分，横轴为平均生成 token 数；各面板使用自己的线性横轴，范围分别为 0–100k、0–50k 和 0–10k token。Inkling 的可控思考强度扫描形成一条曲线，其他模型则显示为单个运行点。在三个评测中，Inkling 达到同一得分所需的 token 都更少。*

![Inkling 可控思考强度与性能曲线](imgs/2026-07-15-thinking-machines-inkling-effort-curve.jpg)

*将 Inkling 的思考强度从 0.2 扫描到 0.99，可以得到它在 Terminal Bench 2.1、HLE 和 IFBench 上相对于平均生成 token 数的性能曲线；其他模型显示其默认运行点。Inkling 用更少的 token 达到给定分数，例如，它在 Terminal Bench 2.1 上只使用约三分之一的 token，就能达到 Nemotron 3 Ultra 的得分。\*Humanity's Last Exam 的分数来自较早的检查点，略低于最终发布版本。*

Inkling 支持可控思考强度，让你可以在性能和 token 效率之间进行权衡。上图展示了 Inkling 以及其他开放权重模型在多项基准上的思考强度/性能曲线：Terminal Bench 2.1 衡量智能体编程能力，HLE 衡量高级推理能力，IFBench 衡量指令遵循能力。在 Terminal Bench 上，Inkling 只需 Nemotron 3 Ultra 三分之一的 token，就能达到相同表现。当模型要运行数百万次，或被放进更长的工作流时，成本与延迟非常重要；观察完整成本曲线，能帮助开发者为每种场景选择最合适的模型。

### 多模态

Inkling 设计中的一个主要目标，是充当我们最近介绍的[交互模型系统](https://thinkingmachines.ai/blog/interaction-models/)中的后台推理模型。交互模型让用户可以通过实时语音和视觉自然地与 AI 协作，因此要求模型从一开始就针对广泛的多模态能力进行原生训练。

|  | Inkling effort=0.99 | Qwen3-Omni | Nemotron-3 Nano-Omni | Kimi K2.5 | Kimi K2.6 | Qwen3.5 Omni-Plus | Gemini 3.1 Pro (high) |
|----|----|----|----|----|----|----|----|
| 音频 |  |  |  |  |  |  |  |
| Audio MC | 56.6% | 24.3% | 23.2% | – | – | 37.6% | 66.8% |
| MMAU | 77.2% | 77.5% | 76.7% | – | – | 81.1% | 82.5% |
| VoiceBench | 91.4% | 88.8% | 89.4% | – | – | 92.4% | 94.3% |
| 视觉 |  |  |  |  |  |  |  |
| MMMU Pro (Standard 10) | 73.5% | 60.0% | 53.0% | 75.0% | 79.0% | 71.0% | 82.0% |
| Charxiv RQ | 78.1% | 61.1% | 63.6% | 77.5% | 80.4% | 72.5% | 80.2% |
| Charxiv RQ with python | 82.0% | – | – | 78.7% | 86.7% | – | 89.9% |

以上是与专业全模态模型（开放权重和闭源模型）的音频与视觉基准对比，均以 effort=0.99 运行。

多模态组件使用通用领域数据从零开始训练。我们为音频和视觉输入选择了无编码器架构，这与交互模型的设计一致。音频信号以 dMel 频谱图的形式输入（[dMel：让语音 token 化变得简单](https://arxiv.org/abs/2407.15835)，Richard He Bai 等，2024）；图像则被切分为 40×40 像素的图块，并使用四层 hMLP 处理（[关于视觉 Transformer，每个人都应该知道的三件事](https://arxiv.org/abs/2203.09795)，Hugo Touvron 等，2022）。二者都通过轻量嵌入层转换，随后与文本 token 一起处理。

Inkling 可以转写语音、遵循口头指令、回答有关录音的问题，并对长音频进行推理。它在 VoiceBench、MMAU 和 AudioMC 上跻身最强开放权重音频模型之列。在视觉方面，Inkling 可以接收图像输入，描述视觉内容、回答问题，并依据图像进行深入推理；它在图表、示意图和数学视觉推理任务上表现出色。推理时，Inkling 还可以使用 Python 工具，通过缩放、裁剪等操作辅助理解图像，并把视觉推理与基于代码的推理无缝结合。

作为我们的首个版本，Inkling 为未来工作建立了稳健的多模态基础。随着模型和训练流水线在后续迭代中扩展，我们预计它的多模态能力还会继续提升。

### 认知可靠性

我们对 Inkling 进行了校准、指令遵循和抵抗审查方面的训练，并将这些能力统称为模型的“认知可靠性”（epistemics）。

正确回答事实问题，不只是记住庞大语料库中的内容。一个有用的模型必须得到良好校准，在回答中表达恰当程度的信心——包括面对尚无定论的问题。对于预测和预报而言，这一点至关重要；最近，[微调模型在这类任务上的能力迅速提升](https://thinkingmachines.ai/news/training-llms-to-predict-world-events/)，甚至[超过了前沿大模型](https://x.com/tinkerapi/status/2056798250532057139)。

|  | Inkling | GPT-5.5 | Claude Opus 4.8 | Gemini 3.1 Pro | Grok 4.3 | Kimi K2.6 |
|----|----|----|----|----|----|----|
| ForecastBench Brier 指数 ↑ · 不使用搜索 | 61.1 ± 0.79 | 59.1 ± 0.41 | 54.6 ± 0.99 | 61.1 ± 0.56 | 61.7 ± 0.54 | 58.1 ± 0.54 |
| ForecastBench Brier 指数 ↑ · 使用搜索 | 63.7 ± 0.82 | 64.7 ± 1.28 | 58.6 ± 0.66 | 64.3 ± 1.05 | 63.2 ± 0.82 | – |
| Prophet Arena Brier 分数 ↓ | 0.1617 | 0.1598 | 0.1605 | 0.1594 | 0.1715 | 0.1675 |

这些结果来自 2026 年 6 月 30 日至 7 月 13 日期间的测试，所用 Inkling 检查点与最终发布版本不同。

预测要求把多个信息源整合为一个经过校准的概率，这是用户能够信任模型所需的核心能力。如果一个模型对每个回答都充满信心——包括缺少信息并编造内容的时候——用户就不得不复核所有内容。能够表达恰当信心的模型，在信息相互冲突、不可靠或难以找到的现实领域中更有用。我们在大量已经得到结果的现实问题上，使用基于严格评分规则的强化学习来训练模型校准能力。

可信模型的第二个组成部分是遵循指令，包括处理难以验证的复杂请求。我们使用两个自动评分器进行强化学习：量规评分器和事实主张评分器。前者依据一份优秀回答应包含哪些内容的检查清单给回答打分。理论上，量规可以惩罚错误；但在实践中，它更强调召回率，模型可能通过大量抛出看似相关的事实、期待命中量规条目来钻空子。

事实主张评分器会验证回答中的每一条事实陈述，并惩罚无法核实的内容。它使用智能体式网络搜索验证陈述，而不是只依赖自身知识。两个评分器结合后，可以同时提升帮助性、减少幻觉，而不是在两者之间做取舍。

这些奖励并不直接针对长回答中经过校准的不确定性，因此我们又加入了专门的数据集。其中最大的是带有“弃答感知”奖励的短答案事实问答：只有模型可能答对时，作答才有收益；因此最优策略是在有把握时回答，否则说“我不知道”或给出带保留的最佳猜测。有些提示会鼓励或禁止保留措辞，使模型学会遵从用户偏好：究竟必须猜一个答案，还是可以给出经过校准的不回答。

最后，我们还训练 Inkling 直接回答可能受到审查的话题。Cognition 使用其宣传与审查评测对模型进行测试（The Cognition Team，《[衡量基于开放源模型的可信度](https://cognition.com/blog/measuring-open-source-model-trustworthiness)》，2026），结果显示 Inkling 对审查要求具有很强的不服从倾向。

### 安全性

我们依据内部制定的跨模态安全行为规范训练 Inkling，随后委托外部安全测试人员验证结果。

我们从多个方面评估了 Inkling 的安全性。对于 CBRN、网络攻击和失控等危险能力，我们既进行内部评测，也邀请外部测试人员参与。我们还通过内外部评测关注人与 AI 之间的威胁路径，包括阿谀奉承、脆弱用户和有害操纵。

|  | Inkling effort=0.99 | Nemotron 3 Ultra | Kimi K2.5 | Kimi K2.6 | GLM 5.2 | DeepSeek V4 Pro |
|----|----|----|----|----|----|----|
| FORTRESS（对抗性） | 78.0% | 77.6% | 54.1% | 65.6% | 71.3% | 36.0% |
| FORTRESS（良性） | 95.9% | 90.5% | 98.3% | 97.2% | 90.0% | 98.5% |
| StrongREJECT | 98.6% | 98.7% | 99.5% | 99.8% | 98.5% | 98.6% |

在我们使用 FORTRESS 对比的所有开放权重模型中，Inkling 的内置防护最强。FORTRESS 既测试模型能否拒绝与武器和暴力有关的请求，也测试模型是否会错误拒绝表面相似但实际上无害的请求。Inkling 拒绝了更多有害请求，同时没有过度拒绝良性类比请求。Inkling 在 StrongREJECT 上超过 98%；这是一项测试模型拒绝明确有害请求的评测，其表现与其他开放和闭源模型相当。

安全性对开放权重模型至关重要。我们将继续研究可定制模型的安全行为和能力提升，包括在 Tinker 上进行微调会如何影响模型的安全行为。

## Inkling 基准测试

我们在广泛的能力维度上对 Inkling 进行了评测。所有评测均使用 0.99 的思考强度和 1.0 的 temperature；所有编程评测的轨迹 token 上限均为 256K。

为了提高一致性，在适用情况下，我们同时对自有模型和外部模型采用外部发布的评测结果。具体来说，以下评测使用 Artificial Analysis 报告的分数：Humanity's Last Exam、GPQA Diamond、GDPVal、Tau 3 Banking、AA Omniscience 和 MMMU Pro。

|  | Inkling effort=0.99 | Nemotron 3 Ultra | Kimi K2.5 | Kimi K2.6 | GLM 5.2 | DeepSeek V4 Pro | Gemini 3.1 Pro (high) | Claude Fable 5 (max) | GPT 5.6 Sol (max/xhigh) |
|----|----|----|----|----|----|----|----|----|----|
| 推理 |  |  |  |  |  |  |  |  |  |
| HLE 纯文本 | 29.7% | 26.6% | 29.4% | 35.9% | 40.1% | 35.9% | 44.7% | 53.3% | 47.2% |
| HLE 使用工具 | 46.0% | 37.4% | 50.2% | 54.0% | 54.7% | 48.2% | 51.4% | 64.5% | 55.0% |
| AIME 2026 | 97.1% | 94.2% | 95.8% | 96.4% | 99.2% | 96.7% | 98.3% | 99.9% | 99.9% |
| GPQA Diamond | 87.2% | 86.7% | 87.9% | 91.1% | 89.5% | 88.8% | 94.1% | 92.6% | 94.1% |
| 智能体（编程） |  |  |  |  |  |  |  |  |  |
| SWEBench Verified \* | 77.6% | 70.7% | 76.8% | 80.2% | 80.0% | 80.6% | 80.6% | 95.0% | 82.2% |
| SWEBench Pro Public | 54.3% | 46.4% | 50.7% | 58.6% | 62.1% | 55.4% | 54.2% | 80.0% | 64.6% |
| Terminal Bench 2.1 \* 最佳框架 | 63.8% | 56.4% | 51.3% | 71.3% | 82.7% | 64% | 73.8% | 84.6% | 89.5% |
| 智能体（通用） |  |  |  |  |  |  |  |  |  |
| GDPVal-AA v2 | 1238 | 1164 | 1009 | 1190 | 1514 | 1307 | 962 | 1760 | 1748 |
| MCP Atlas | 74.1% | 44.7% | 64.0% | 68.1% | 77.8% | 73.2% | 78.2% | 83.3% | 81.8% |
| Tau 3 Banking | 23.7% | 13.8% | 14.2% | 20.6% | 26.8% | 25.8% | 16.5% | 26.8% | 33.0% |
| BrowseComp（带上下文管理） | 77.1% | – | 74.9% | 83.2% | – | 83.4% | 85.9% | 88.0% | 90.84% |
| 事实性 |  |  |  |  |  |  |  |  |  |
| SimpleQA Verified | 43.9% | 32.4% | 36.9% | 38.7% | 38.1% | 57.0% | 77.3% | 68.3% | 71.6% |
| AA Omniscience | 2.1 | -1.0 | -8.0 | 6.0 | 4.0 | -10.0 | 33.0 | 40.0 | 22.0 |
| 对话 |  |  |  |  |  |  |  |  |  |
| IFBench | 79.8% | 81.4% | 70.2% | 76.0% | 73.3% | 76.5% | 77.1% | 63.5% | 72.7% |
| Global-MMLU-Lite | 88.7% | 85.6% | 84.0% | 88.4% | 89.2% | 89.3% | 92.7% | 93.3% | 91.8% |
| 视觉 |  |  |  |  |  |  |  |  |  |
| MMMU Pro Standard 10 | 73.5% | – | 75.0% | 79.0% | – | – | 82.0% | 84.2% | 83.0% |
| Charxiv RQ | 78.1% | – | 77.5% | 80.4% | – | – | 80.2% | 86.5% | 84.7% |
| Charxiv RQ † 使用 python | 82.0% | – | 78.7% | 86.7% | – | – | 89.9% | 89.4% | 87.8% |
| 音频 |  |  |  |  |  |  |  |  |  |
| Audio MC † | 56.6% | – | – | – | – | – | 66.8% | – | – |
| MMAU | 77.2% | – | – | – | – | – | 82.5% | – | – |
| VoiceBench † | 91.4% | – | – | – | – | – | 94.3% | – | – |
| 安全 |  |  |  |  |  |  |  |  |  |
| FORTRESS 对抗性 | 78.0% | 77.6% | 54.1% | 65.6% | 71.3% | 36.0% | 65.2% | 96.0% | 82.4% |
| FORTRESS 良性 | 95.9% | 90.5% | 98.3% | 97.2% | 90.0% | 98.5% | 98.0% | 55.1% | 98.1% |
| StrongREJECT | 98.6% | 98.7% | 99.5% | 99.8% | 98.5% | 98.6% | 98.0% | 98.7% | 98.5% |

\*SWEBench Verified：Inkling 的数字使用仅含 Bash 的框架报告；外部模型采用其自行报告的数字。\*Terminal Bench 2.1：Inkling 的数字使用内部编程框架报告。少量答案被发现受到网络搜索中的解答污染，因此记为 0 分。外部模型在可用时采用其自行报告的表现，否则使用我们的内部框架评测。†Audio MC：其他模型未进入官方排行榜，因此由我们内部评测。†VoiceBench：VoiceBench 使用基于规则、硬编码的字符串匹配评分，因此对输出格式差异很敏感。我们为此加入了系统消息，要求模型遵循预期回答格式。†CharXiv RQ with tools：我们使用内部 Python 框架评测 Claude Fable 5 和 GPT 5.6 Sol（max/xhigh）。

## Inkling 的构建过程

### 架构

Inkling 是一个混合专家 Transformer。与常见方案相比，它做了少量调整，每项调整都是为了提高效率和长上下文性能。

MoE 设计大体沿用 DeepSeek-V3。每个 MoE 层包含 256 个路由专家和 2 个共享专家，每个 token 激活 6 个路由专家。Inkling 使用基于 sigmoid 的路由器，并通过无辅助损失的负载均衡偏置实现负载平衡。被选中的路由专家和共享专家的分数会一起归一化，用于加权组合它们的输出。

在注意力方面，我们以 5:1 的比例交错使用滑动窗口层和全局层，并使用 8 个 KV 头。我们发现，用相对位置嵌入编码位置（[使用相对位置表示的自注意力](https://arxiv.org/abs/1803.02155)，Peter Shaw 等，2018；[Music Transformer](https://arxiv.org/abs/1809.04281)，Cheng-Zhi Anna Huang 等，2018），比更广泛采用的旋转位置嵌入（RoPE）效果更好，也能更好地外推到更长序列。我们还在两个位置应用短卷积：一是在每个注意力层的 key 和 value 投影之后，二是在注意力与 MLP 残差分支重新汇入主残差流之前。

### 训练

Inkling 使用来自文本、图像、音频和视频等多种内容类型的 45 万亿 token 进行预训练。训练采用混合优化策略：大型矩阵权重使用 Muon，其他参数使用 Adam；超参数调度则受到我们此前[模流形](https://thinkingmachines.ai/blog/modular-manifolds/)研究的启发。我们让权重衰减强度与学习率的平方相关，发现这样可以在不同训练周期内保持模型权重的总体规模稳定（另见 [Kosson 等（2023）](https://arxiv.org/abs/2305.17212)和 [Defazio（2025）](https://arxiv.org/abs/2506.02285v1)）。

我们在数学、智能体编程与工具使用、音频、图像、对话和安全等广泛领域对 Inkling 进行后训练。为了启动后训练，我们先用包括 Kimi K2.5 在内的开放权重模型生成合成数据，完成初始 SFT。这一启动阶段只占少量计算资源；大部分计算用于在合成和人工创建的环境中开展大规模强化学习。

Inkling 是我们的第一次重大训练工作，使用 NVIDIA GB300 NVL72 系统完成。未来的模型将在预训练、后训练和强化学习各阶段进一步扩大计算规模。

### 大规模强化学习

我们依靠大规模异步强化学习塑造模型行为，并提升其推理能力和整体表现。下图显示模型在 AIME、HLE、GPQA 等留出推理评测汇总集上的得分。我们把强化学习扩展到超过 3000 万次 rollout，并在两次持续很久的连续运行中保持稳定训练。在整个过程中，推理表现随着训练规模呈对数线性提升，最终实现了显著增长。

*图示说明：折线图展示聚合评测奖励与强化学习 rollout 数量之间的关系，横轴采用对数刻度，从 0 到超过 3000 万。奖励从 SFT 初始化时的 0.264 呈对数线性上升，到发布检查点（约 2650 万次 rollout）时达到 0.356，各检查点都接近一条直线拟合。*

![Inkling 强化学习规模曲线](imgs/2026-07-15-thinking-machines-inkling-rl-scaling.jpg)

*在 AIME、HLE、GPQA 等留出推理评测的聚合结果上，奖励从 SFT 初始化到发布检查点，随着超过 3000 万次强化学习 rollout 呈对数线性提升。*

我们通过改变系统消息和调整每 token 成本，为不同样本指定模型的思考强度。这使模型在不同 rollout 中使用不同数量的 token，并学会控制思考强度。

我们还观察到，强化学习过程中模型的推理风格发生了涌现式变化。思维链随时间推移变得更加简洁：它会省略语法上的冗余，但仍然可以理解，最终回答也不受影响。奖励并未专门针对这一行为；仅仅是效率要求就促成了压缩。Cognition 团队在训练 SWE-1.7 时最近也观察到类似效果（The Cognition Team，《[SWE-1.7：以前沿模型一小部分成本实现前沿智能](https://cognition.com/blog/swe-1-7)》）。下面展示 Inkling 对同一道数学题的思维链如何随强化学习演化：

*图示说明：同一道物理题的两段模型思维链并排对比，分别来自强化学习早期和晚期。早期思维链使用完整、符合语法的句子；晚期思维链则更压缩、更像电报，在仍可理解的前提下省略冠词和连接词。*

![Inkling 强化学习早期与晚期的推理轨迹](imgs/2026-07-15-thinking-machines-inkling-reasoning-compression.jpg)

强化学习早期——冗长、语法完整：**我们需要理解**这个算子。五维线元为 ds² = e^{2A(x)} (ds²_4d + dx²)，其中 A(x) = sin(x) + 4 cos(x)，x ∈ \[0, 2π\]。内部坐标是周期性的。背景是翘曲乘积：度规 g\_{MN}，其中 M,N = 0..4。内部方向的度规是 e^{2A(x)} dx²？等等，ds² 是 e^{2A} (ds²_4d + dx²)。所以内部度规是 e^{2A(x)} dx²。实际上，如果总度规是 ds² = e^{2A(x)} (ds²_4d + dx²)，那么确实如此，内部度规就是 e^{2A} dx²。……强化学习晚期——压缩、电报式：**需要确定本征值问题**，针对四维中满足 TT 条件并依赖 x 的自旋 2 涨落 h\_{μν}(x,y)。对于形式为 ds² = e^{2A(x)} (g\_{μν}(y) + h\_{μν}(y,x)) dy^μ dy^ν + e^{2A(x)} 的度规？等等，内部度规是 e^{2A} dx²？实际上 ds² = e^{2A} \[ds_4² + dx²\]。所以内部度规是 e^{2A} dx²；四维和内部空间使用相同翘曲因子？是的。需要写出 h\_{μν}(y,x) = h\_{μν}(y) ψ(x) 的方程，可能还要带归一化。……

*这是同一条思维链在强化学习早期和晚期的样子。晚期轨迹省略了冠词和连接词——“We need *to* understand”变成“We need determine”——但仍然可以理解，并得到相同答案。*

## Inkling-Small

除 Inkling 外，我们还分享了 Inkling-Small 的预览版。这是一个 2760 亿参数的混合专家模型，激活参数量为 120 亿，而 Inkling 为 410 亿；两者提供不同的性能/延迟权衡。Inkling-Small 在许多基准上追平或超过更大的同系列模型，这是我们改进小模型预训练数据和方案的结果。两个模型使用相同、可扩展的后训练技术栈。

|  | Inkling effort=0.99 | Inkling-Small（预览）effort=0.99 |
|----|----|----|
| 推理 |  |  |
| HLE 纯文本 | 29.7% | 29.6% |
| HLE 使用工具 | 46.0% | 46.6% |
| AIME 2026 | 97.1% | 95.1% |
| GPQA Diamond | 87.2% | 88.3% |
| 智能体（编程） |  |  |
| SWEBench Verified | 77.6% | 77.4% |
| SWEBench Pro Public | 54.3% | 53.2% |
| Terminal Bench 2.1 最佳框架 | 63.8%\* | 52.7% |
| 智能体（通用） |  |  |
| Tau 3 Banking | 23.7% | 13.6% |
| MCP-Atlas | 74.1% | 74.9% |
| 事实性 |  |  |
| SimpleQA Verified | 43.9% | 20.9% |
| 对话 |  |  |
| IFBench | 79.8% | 83.4% |
| Global-MMLU-Lite | 88.7% | 86.8% |
| 视觉 |  |  |
| MMMU Pro Standard 10 | 73.5% | 73.1% |
| Charxiv RQ | 78.1% | 76.7% |
| Charxiv RQ with python | 82.0% | 83.4% |
| 音频 |  |  |
| Audio MC | 56.6% | 49.6% |
| MMAU | 77.2% | 77.5% |
| VoiceBench | 91.4% | 90.0% |
| 安全 |  |  |
| FORTRESS 对抗性 | 78.0% | 75.6% |
| FORTRESS 良性 | 95.9% | 94.1% |
| StrongREJECT | 98.6% | 98.8% |

两个模型都以 effort=0.99 运行；每行较高的结果在原文中以高亮显示。\*对于通过网络搜索受到解答污染的 Terminal Bench 2.1 rollout，我们将其记为 0 分。

早期结果表明，Inkling-Small 在推理和智能体任务上的表现接近 Inkling。凭借 120 亿激活参数和可控思考强度，它非常适合重视成本和延迟的工作负载，例如编程、使用大模型进行评分，以及为其他模型生成合成数据。

我们目前正在完成 Inkling-Small 的测试，工作完成后将发布其完整权重。

## 定制 Inkling

即使是最好的通用模型，也无法很好解决[许多现实世界的问题](https://thinkingmachines.ai/news/learning-to-replicate-expert-judgment-in-financial-tasks/)；利用组织的专业知识进行微调，正在缩小这一差距。Tinker 客户的使用经验也指向同一个方向。我们的后训练和大规模强化学习结果表明，Inkling 能够通过微调快速学习。

### Inkling 的可用方式

Inkling 今天已经可以在 [Tinker](https://thinkingmachines.ai/tinker/) 上使用，支持 64K 和 256K 两种上下文长度。限时期间，我们为 Inkling 提供五折优惠；完整价格请参阅[文档](https://tinker-docs.thinkingmachines.ai/tinker/models/)。

为了支持 Tinker 用户微调 Inkling，我们更新了 cookbook，使其原生支持 Inkling，并加入三个展示 Inkling 独特音频能力的[新 cookbook 配方](https://github.com/thinking-machines-lab/tinker-cookbook)。我们还发布了 [tml-renderer](https://pypi.org/project/tml-renderers/)，用于可靠地采样和后训练工具调用、推理内容及多模态输入。

如果想在正式运行微调任务前感受模型，用户可以进入 Tinker 控制台中的 [Inkling Playground](https://tinker.thinkingmachines.ai/playground?utm_source=blog&utm_campaign=inkling_model_release)。Playground 提供集成了智能体网络搜索的聊天界面，限时免费。

我们与整个生态系统中的多家伙伴合作，帮助客户部署在 Tinker 上微调得到的检查点。Inkling 已可通过 [TogetherAI](https://www.together.ai/)、[Fireworks](https://fireworks.ai/)、[Modal](https://modal.com/)、[Databricks](https://www.databricks.com/) 和 [Baseten](https://www.baseten.co/) 的 API 使用。我们与 [RadixArk](https://www.radixark.com/) 合作，在 [SGLang](https://www.sglang.io/) 和 [Miles](https://github.com/radixark/miles) 中提供开源推理和强化学习支持；与 [Inferact](https://inferact.ai/) 合作，在 [vLLM](https://vllm.ai/) 中支持推理；与 [Lightseek](https://lightseek.org/) 合作，在 [TokenSpeed](https://github.com/lightseekorg/tokenspeed) 中支持推理；还与 [Unsloth](https://unsloth.ai/) 合作，在 [llama.cpp](https://github.com/ggml-org/llama.cpp) 中支持推理。最后，我们与 [Hugging Face](https://huggingface.co/) 合作完成了对 [transformers](https://github.com/huggingface/transformers) 的集成。

Inkling 的完整权重已发布在 [Hugging Face](https://huggingface.co/thinkingmachines/inkling) 上，同时提供原始检查点和适合在 NVIDIA Blackwell 系统上高效推理的 NVFP4 检查点。
