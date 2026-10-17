---
title: X 时间线 · AI 精选摘要（2026-06-16 ~ 06-17）
source: x-ai-timeline-archive-2026-06-17_2105.md（共 200 条）
filter: 专业度 / 有特色 / AI 关键人物相关
curated: 2026-06-17
---

# X 时间线 · AI 精选摘要

从归档的 200 条高印象量推文中,按"专业度、有特色、AI 关键人物相关"三条标准筛出约 55 条,分类整理。原始全量见 `x-ai-timeline-archive-2026-06-17_2105.md`。

> **背景提示**:本期时间线被一轮快速发酵的叙事主导——Anthropic 的 Mythos 级模型(商用名 Fable 5)被美国政府叫停出口、随后围绕"中国是否获取""越狱""集体诉讼"展开拉锯;与此同时 GLM-5.2、Kimi-K2.7、Mistral 等开源/竞品借势上位,Cursor 被 SpaceX 收购。其中**夹杂大量传闻与玩梗**(如"Le Chaton Fat""Rio 3.5 由里约市政 IT 部门开发"),已在最后一节单列、标注存疑,不当作事实源。

---

## 一、AI 关键人物发声

- **Yann LeCun** @ylecun — 以"当年对 1 GFLOPS 以上计算机做出口管制、结果 PS2 一上市就超标"类比当下 AI 出口管制的荒诞。🔗 https://x.com/ylecun/status/1719485821407941085
- **Jim Fan** @DrJimFan — 发布 ENPIRE:首次把 AutoResearch 搬进物理世界,给 8 个 Codex agent 配机器人集群、GPU 与 token 预算,自主完成任务。具身 + 多智能体的标志性方向。🔗 https://x.com/DrJimFan/status/2066921736369766762
- **Greg Brockman** @gdb — "GPT-Realtime-2 is something new",OpenAI 实时语音/多模态新进展。🔗 https://x.com/gdb/status/2067100786098831681
- **Satya Nadella** @satyanadella — Copilot Cowork 全球 GA,支持多模型、面向长时任务的企业级 agent。🔗 https://x.com/satyanadella/status/2066911399494963335
- **Mitchell Hashimoto** @mitchellh — "12 个月内本地模型从'垃圾'到'其实不错',但还不够,需要 Opus 4.5 级别的本地模型,届时世界会变。"对本地模型拐点的判断。🔗 https://x.com/mitchellh/status/2066960258304782598
- **Simon Willison** @simonw — 对"导致 Fable 被封的越狱"表示"深感不以为然",资深从业者视角的冷静判断。🔗 https://x.com/simonw/status/2066722034491789720
- **roon** @tszzl — 若超智能模型只能在实验室边界内交易,实验室的科斯边界(Coasean boundary)将吞并所有有趣的产业,形成赛博朋克格局。🔗 https://x.com/tszzl/status/2065939227167392147
- **Andrew Trask** @iamtrask — "前沿 AI 公司将永远无法再独占前沿"——模型组合(combinations of models)总会胜过单一模型。🔗 https://x.com/iamtrask/status/2066022745972826558
- **Ethan Mollick** @emollick — Fable 中断前的最后一个 one-shot prompt:生成可演示多种 FTL 超光速旅行方式的交互模拟。🔗 https://x.com/emollick/status/2066162715031224664
- **Ross Taylor** @rosstaylor90 — 以"在 Meta 与英国创业期间构建多个 LLM"的经历,谈主权 AI(Sovereign AI)辩论与英国 AI 创业环境。🔗 https://x.com/rosstaylor90/status/2066067747738431504
- **Mahesh Sathiamoorthy** @madiator — 我们已过度依赖 LLM、把思考外包出去了;长文写作逼你认真而清晰地思考。🔗 https://x.com/madiator/status/2066212104781361175
- **Garry Tan** @garrytan — 精英选拔只筛"比别人更快得到已知答案"这一项;AI 让答案免费,被训练得最会应试的孩子反而最受冲击。🔗 https://x.com/garrytan/status/2066153523868467702
- **Michael Truell**(Cursor CEO)@mntruell — 宣布与 SpaceX 联手构建有用的 AI;a16z 访谈中提出"发明一种新的编程方式,软件逻辑的表示更像英语"。🔗 https://x.com/a16z/status/2066932717871301046
- **Boris Cherny**(Claude Code 作者)via @rileywestreel — "我的整个 CLAUDE.md 只有两行;模型每代越强,需要的指令越少,多数人把本该极简的东西过度工程化了。"🔗 https://x.com/rileywestreel/status/2066948460709109835

---

## 二、技术深度 / 研究

- **Susan Zhang** @suchenzang — 拆解当代 LLM 的四大组成(输入层/latent 表示等),从业者写给从业者的结构化讲解。🔗 https://x.com/suchenzang/status/2066010626846232831
- **Gabriele Berton** @gabriberton — 解读斯坦福论文《Pre-training under infinite compute》:"完美 LLM 需 10.5 千万亿参数"这一数字从何而来(1/6 串)。🔗 https://x.com/gabriberton/status/2066294934387450138
- **Lucas Beyer** @giffmana — LLM 社区正在慢慢重新发现 vision 领域五年多前就明白的事(S4L 论文),半监督/小样本 ImageNet 基线。🔗 https://x.com/giffmana/status/2066435889522196984
- **Zhengyao Jiang** @zhengyaojiang — 在 ML 工程/prompt 工程/算法发现三类 autoresearch 任务上对 7 个前沿模型做基准:总分 Fable-5 最优,但 ML 工程上开源 Kimi-K2.7-Code 反超前沿模型(1/5)。🔗 https://x.com/zhengyaojiang/status/2066213302921802194
- **Unsloth AI** @UnslothAI — 把 1T 的 Kimi K2.7 Code 通过 Dynamic 2-bit(关键层 upcast)压到 325GB(-48%),330GB 显存/内存即可 >40 tok/s。含 GGUF 与教程。🔗 https://x.com/UnslothAI/status/2066492839450800427
- **Alexander Whedon** @alex_whedon — SubQ 1.1 Small 技术报告:Subquadratic Sparse Attention(SSA)第二代,首个交付给设计合作方的版本。🔗 https://x.com/alex_whedon/status/2066894707259515124
- **Rahul** @sairahul1 — Anthropic 给"能从零构建 LLM(而非 prompt/微调/RAG)"的工程师开 75 万美元+;配 2 小时斯坦福讲座(scaling laws、数据等)。🔗 https://x.com/sairahul1/status/2066079766378405922
- **Rahul** @sairahul1 — 推荐 0xkato.xyz:免费、系统讲解 LLM 实际工作原理的站点。🔗 https://x.com/sairahul1/status/2066145067337937029
- **Tom Kelly** @TomkeyKong — "通用模型 vs 专用医疗 AI"是错问题,关键在如何度量;不需前沿规模也能达到前沿质量。🔗 https://x.com/TomkeyKong/status/2066470926749962714
- **Suraj Sharma** @suraj_sharma14 — "若给我 6 个月成为 Agentic AI 工程师":Python/async → LLM 基础(上下文管理、模型路由、token 经济)→ … 的分阶段路线图。🔗 https://x.com/suraj_sharma14/status/2066128527989113123
- **Matt Pocock** @mattpocockuk — AI 驱动开发的 7 个阶段;强调 pre-PRD 阶段需先确定"设计树"的形状再逐层细化。🔗 https://x.com/mattpocockuk/status/2066451514672009337
- **TimesFM**(via @nicos_ai)— 谷歌低调发布的时序预测模型:1000 亿真实数据训练、零样本预测无需微调、可本地运行、开源。🔗 https://x.com/nicos_ai/status/2066850851688247576
- **NVIDIA MotionBricks**(via @VaibhavSisinty)— 单一神经网络替代数十年动画技术:15000 帧/秒、2ms 延迟,35 万段动作训练,面向机器人与游戏。🔗 https://x.com/VaibhavSisinty/status/2066906214794220026

---

## 三、模型与产品发布

- **GLM-5.2** @Zai_org — 开源权重前沿模型:编码/agentic 显著提升、1M 上下文、两档推理强度。多个榜单(Design Arena、Code Arena)逼近/超过不可用的 Fable 5。🔗 https://x.com/Zai_org/status/2066938937344495629
- **Cartesia**(Karan Goel @krandiash)— 发布 Sonic-3.5 与 Ink-2,流式 TTS/STT 双料第一,面向语音 agent。🔗 https://x.com/krandiash/status/2066559212533190917
- **Sakana AI** @SakanaAILabs — 首个商用产品 Sakana Marlin:面向企业的自主研究助手。🔗 https://x.com/SakanaAILabs/status/2066352122183168004
- **ByteDance Seedance 2.0 Mini**(@BytePlusGlobal)— 更快、约为 2.0 半价的图/视频/音频参考生视频模型。🔗 https://x.com/BytePlusGlobal/status/2066531645138833586
- **xAI Grok Imagine Video 1.5** @xai — 图生视频:更锐利真实、更好物理、更快生成。🔗 https://x.com/xai/status/2067092897951109427
- **Exa Agent** @ExaAILabs — 前沿网页研究,成本不到 GPT-5.5/Opus 的一半,编排多个高性价比模型。🔗 https://x.com/ExaAILabs/status/2066946215250690228
- **Anthropic** @AnthropicAI — 经济研究新框架:追踪 Claude Code 规模化中谁在用、用于什么、任务价值如何变化、领域专长如何影响成败。🔗 https://x.com/AnthropicAI/status/2066969532380721386
- **OpenAI** @OpenAI — 发布"发布前预测模型真实行为"的方法:用近期去标识用户请求模拟部署、研究候选回复。🔗 https://x.com/OpenAI/status/2066969635099144682

---

## 四、智能体 / 开发工具

- **Vercel eve** @vercel — 新 agent 框架,目录约定(agent/instructions.md/tools/skills/sandbox/schedules),口号"Like Next.js, for agents"。🔗 https://x.com/vercel/status/2067180054979936413
- **Qwen-Robot Suite** @Alibaba_Qwen — RobotNav/RobotManip/RobotWorld 三个基础模型,具身智能全栈。🔗 https://x.com/Alibaba_Qwen/status/2066870197122899980
- **Factory 2.0** @FactoryAI — 从编码 agent 到"软件工厂"。🔗 https://x.com/FactoryAI/status/2066588050617249904
- **Cursor Origin** @cursor_ai / @swyx — Cursor 推出代码托管 + Git 竞品,面向 agent 工作负载、内置合并冲突与协同失败的 agent 解决。🔗 https://x.com/cursor_ai/status/2067012220832329782
- **Cursor Mobile**(@morganlinton / @NickADobos)— 移动端 beta,含远程控制 Mac 主机。🔗 https://x.com/NickADobos/status/2066927660291498484
- **Grok in PowerPoint** @grok — prompt 直出 PPT,接入实时数据、应用与 MCP、图表/图像生成。🔗 https://x.com/grok/status/2066916559289974831
- **Charles Rollet** @CharlesRollet1 — 起底 Cursor 崛起内幕:曾占 Anthropic 营收 40–50%、Anthropic 称 Claude Code 只是"研究项目"等。🔗 https://x.com/CharlesRollet1/status/2066571743163228218
- **Codez** @0xCodez — Claude Code 创建者 Boris:Anthropic 100% PR、80–90% 代码评审由 Claude Code 跑;最常用 /loops——"不再 prompt,而是搭建循环"。🔗 https://x.com/0xCodez/status/2066261118239347017

---

## 五、机器人 / 具身智能

- **AheadForm**(via @spaceandtech_)— 上海初创的人形机器人 Origin F1/M1,可做眨眼、微笑、微表情等 AI 驱动情感表达。🔗 https://x.com/spaceandtech_/status/2066184580588282353
- **Carbon Robotics 激光除草**(@bernsteind / @itsolelehmann)— 边缘端实时 AI 决策,夜间在草莓/西兰花田用 UV 光除螨除霉,无化学药剂。🔗 https://x.com/bernsteind/status/2066316922292257011
- **NUDT 蚊型无人机**(@TheAIColonyRD)— 国防科大研制的隐蔽侦察微型 UAV,<0.3 克、每秒振翅 500 次。🔗 https://x.com/TheAIColonyRD/status/2066544883188252838
- **らふろぼ** @roughrobotics — 双边遥操作控制(bilateral control)实测。🔗 https://x.com/roughrobotics/status/2066107674769654248

---

## 六、有特色 / 创意应用

- **AMD Lisa Su 的"饭盒"**(多条,代表 @plutos_eth)— Ryzen AI Max+ 395(Strix Halo):首款 CPU/GPU 共享 128GB 统一内存的 x86 芯片,饭盒大小本地跑 235B 模型,无数据中心/云/独显。本期最大硬件话题。🔗 https://x.com/plutos_eth/status/2066572289835987453
- **Charles Curran** @charliebcurran — "我用 AI 配水果给女友解释 Anthropic 风波"——病毒式科普创意(后续又出 SpaceX 版)。🔗 https://x.com/charliebcurran/status/2066297562244751614
- **Om Patel** @om_patel5 — 有人 vibe code 了一个把 Claude 伪装成 Google Doc 的 Chrome 扩展,屏幕上看起来像在写文档而非聊 AI。🔗 https://x.com/om_patel5/status/2066011171967127643
- **Nav Toor** @heynavtoor — youraislopbores.me:2500 万人涌入"假装自己是 AI 聊天机器人"的网站。🔗 https://x.com/heynavtoor/status/2066355111329448051
- **Taste Labs**(@thaiscbranco_)— 出资 1850 万美元 seed,目标"终结 AI slop",为模型与 agent 构建"品味(taste)"的数据与基础设施层。🔗 https://x.com/thaiscbranco_/status/2066912871649574945
- **FarzaTV** @FarzaTV — 用 Claude Opus 做能在你屏幕上作画的 AI 私人导师,像素级精度画多边形、逐步讲解(勾股定理 / FL Studio 演示)。🔗 https://x.com/FarzaTV/status/2066983088035656086
- **Justine Moore** @venturetwins — World of Claudecraft:用 Fable 5 做的开源 MMO,可接任务、交易、决斗、与真人玩家互动,vibecoding 做真实游戏的预览。🔗 https://x.com/venturetwins/status/2066353114404565422
- **straws 像素屏**(@awkwardgoogle)— 上千根吸管聚合成低技术"像素屏",每根吸管作为独立光通道,类比数据通道。🔗 https://x.com/awkwardgoogle/status/2066357023957201068

---

## 七、产业与政策（Anthropic Fable / Mythos 风波 + 大事件）

- **David Sacks** @DavidSacks — 政府内外对 Anthropic 现状的判断:Mythos 级模型本周以商用名 Fable 公开发布(风波起点)。🔗 https://x.com/DavidSacks/status/2065853007619588171
- **Hugo Lowell**(WIRED)@hugolowell — Trump 政府与 Anthropic 谈判结束、未解除对 Fable 5 出口管制,下一步不明;双方就"是否可越狱触及 Mythos 能力"各执一词。🔗 https://x.com/hugolowell/status/2066686166884098244
- **Stratechery** @stratechery — "Anthropic 的安全超能力":对自身安全承诺的信念,给了它激进维护商业利益、甚至挑战美国政府的底气。🔗 https://x.com/stratechery/status/2066460709920342279
- **Chubby** @kimmonismus — Axios 报道重构叙事:Anthropic 聘网络安全专家复核 Amazon 的发现、反驳政府说法(并非最初以为的越狱问题)。🔗 https://x.com/kimmonismus/status/2066459604741997053
- **Polymarket** @Polymarket — 系列实时:白宫怀疑中国已接触 Claude Mythos;Anthropic 因 Claude Max 用量上限被诉误导消费者;五角大楼已将三分之二日常 AI 工作流迁出 Anthropic。🔗 https://x.com/Polymarket/status/2066504244111233427
- **SpaceX × Cursor** @SpaceX — SpaceX 行使期权全股票收购 Cursor,联合训练模型将在 Cursor 与 Grok Build 发布(1886 万次观看,本期最大产业事件之一)。🔗 https://x.com/SpaceX/status/2066873915717136548
- **Kalshi** @Kalshi — ChatGPT 市场份额跌破 50%。🔗 https://x.com/Kalshi/status/2066904161552056455
- **Whale Insider** @WhaleInsider — 中国为迎接 AI 时代裁撤 1.2 万个"过时"大学专业。🔗 https://x.com/WhaleInsider/status/2066050685863358596

---

## 附：梗 / 传闻（存疑，仅作话题参考，勿当事实源）

- **"Le Chaton Fat"**(Mistral)系列(@AlexanderKnigge / @scaling01 / @orcus108)— "30T MoE / 256 专家 / 全面超越 Fable 5""只输出法语代码""欧盟下令封禁"等,明显玩梗/夸张。🔗 https://x.com/AlexanderKnigge/status/2066267845546442762
- **"Rio 3.5 Open 397B"** 由里约热内卢市政 IT 部门开发、成为 SOTA 开源(@kimmonismus / @ZenMagnets / @NexEcosystem 称其实为模型合并产物)——真假掺杂的热门梗。🔗 https://x.com/kimmonismus/status/2065911865390063791
- **"Anthropic 因 Fable 被封是因为不会说 Trump 的语言"**(@ns123abc)等戏谑性"爆料"。🔗 https://x.com/ns123abc/status/2066519103322374162
- **各类"1000x 微调""3B 模型比肩 Opus 4.5"**(@teortaxesTex / @orcus108)— 标题党式惊叹,需原始证据佐证。🔗 https://x.com/orcus108/status/2066876960073281582
