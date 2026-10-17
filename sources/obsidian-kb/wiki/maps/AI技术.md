---
title: "AI 技术"
type: map
status: active
created: 2026-06-15
updated: 2026-09-02
tags: [AI]
sources:
  - "wiki/sources/2026-01-23-openai-unrolling-the-codex-agent-loop.md"
  - "wiki/sources/2026-07-04-lilian-weng-harness-engineering-for-self-improvement.md"
  - "wiki/sources/2026-07-10-agentic-context-engineering-authors.md"
  - "wiki/sources/2026-07-11-polymathic-ai-the-well.md"
  - "wiki/sources/2026-07-15-benjamin-bai-lemario-jepa-world-model.md"
  - "wiki/sources/2026-07-22-elsewhere-liang-wenfeng-investor-meeting.md"
  - "sources/clips/2026-07-17-arena-ai-official-site.md"
  - "sources/clips/2026-07-24-us-doe-genesis-mission.md"
  - "sources/clips/2026-08-07-ai-gdp-share-benchmarks.md"
  - "sources/clips/2026-09-02-mobile-ocr-official-sources.md"
  - "products/mounts/articles/AI技术/哪些网站的文章在Google-SEO和ChatGPT-GEO中权重更高.md"
  - "products/mounts/articles/AI技术/GEO从入门到精通-生成式引擎优化完整指南.md"
related:
  - "[[Harness Engineering]]"
  - "[[递归自我改进]]"
  - "[[Loop Engineering]]"
  - "[[Context Engineering]]"
  - "[[自动化研究]]"
  - "[[生成式引擎优化]]"
  - "[[Arena AI]]"
  - "[[Genesis Mission]]"
  - "[[AI 占 GDP 10%的参照尺度]]"
  - "[[图像文字识别（OCR）]]"
confidence: medium
---

# AI 技术

领域地图：从已 formalize 的概念与来源出发，逐步扩展。

## 核心概念

- [[生成式引擎优化]]：让内容更容易被生成式搜索发现、理解、选作来源并用于组织答案
- [[Harness Engineering]]：模型外围的部署/运行时系统；近端 RSI 的关键工程层
- [[递归自我改进]] / [[RSI]]：用当前智能改进产生智能的机制
- [[Loop Engineering]]：可迭代 agent 循环；进化取决于 harness
- [[Agent Loop]]：Codex 式 prompt→inference→tool 循环
- [[Prompt Caching]] · [[Context Compaction]] · [[Responses API]]
- [[Context Engineering]]：构造/压缩/演化上下文
- [[文件系统作为持久记忆]]：窗口外状态落盘
- [[Agent 子任务委派]]：并行子 agent 与进程管理
- [[自动化研究]]：科研工作流 harness
- [[AI 占 GDP 10%的参照尺度]]：区分 AI 直接增加值、GDP 增量、受影响经济活动和企业利润，并用数字经济、制造业、医疗、军费及历史通用技术校准 10% 的量级
- [[图像文字识别（OCR）]]：图片文字检测、识别、文档解析、模型微调，以及 Android/iOS 离线部署的开源技术路线
- [[评估器设计]] · [[Reward hacking]] · [[多样性坍塌]]：自改进瓶颈

## 方法节点

- [[Agentic Context Engineering]] · [[Meta Context Engineering]] · [[Meta-Harness]]
- [[Self-Taught Optimizer]] · [[Self-Harness]]
- [[ADAS]] · [[AFlow]] · [[SIA]]

## 实体

- [[Genesis Mission]]：美国能源部主导的国家级 AI for Science 基础设施与项目体系
- [[Arena AI]]：匿名比较两个模型回答，以真实用户偏好投票生成公开 AI 模型排行榜
- [[Lilian Weng]]
- [[ACE 论文作者团队]]：ACE 论文 13 位作者的机构、履历、研究方向与团队结构
- [[AI Scientist]] · [[AlphaEvolve]] · [[Darwin Gödel Machine]]
- [[Claude Code]] · [[Codex]] · [[Cursor]] · [[OpenAI]] · [[Michael Bolin]]

## 知识图谱子图

```text
raw/loop-harness note ──► Loop Engineering ──► Harness Engineering ──► 递归自我改进
                              │                      │
                              │                      ├── Context Engineering
                              │                      │     ├── ACE · MCE · Meta-Harness
                              │                      ├── 文件系统记忆 · 子任务委派
                              │                      └── 自动化研究
                              │                            ├── AI Scientist · ADAS · AFlow
                              │                            └── AlphaEvolve · DGM · Self-Harness
                              └── 评估器设计 · Reward hacking · 多样性坍塌
```

机器边：`.kb/links/clips|concepts|entities|raw/`
报告：`.kb/reports/graph-harness-rsi-2026-07-10.md`

## Source Notes

- [移动端 OCR 开源项目与模型官方资料汇编](../../sources/clips/2026-09-02-mobile-ocr-official-sources.md)：PP-OCRv6、PaddleOCR-VL、Android/iOS 官方 Demo、ncnn、RapidOCR 与 Tesseract 的能力和选型边界
- [Arena.ai 官网资料摘要](../../sources/clips/2026-07-17-arena-ai-official-site.md)：Arena 的平台定位、Battle Mode、排行榜机制和敏感信息使用边界
- [AI 占全球 GDP 10%：多来源统计参照底稿](../../sources/clips/2026-08-07-ai-gdp-share-benchmarks.md)：数字经济、制造业、农业、医疗、军费、移动经济以及蒸汽、电气化、铁路和 ICT 的可比口径
- [[sources/2026-01-23-openai-unrolling-the-codex-agent-loop]]：OpenAI 对 Codex harness / agent loop、prompt 构造、caching 与 compaction 的工程拆解
- [[sources/2026-07-04-lilian-weng-harness-engineering-for-self-improvement]]
- [[sources/2026-07-10-agentic-context-engineering-authors]]：ACE 全部作者公开信息调研
- [[sources/2026-07-11-polymathic-ai-the-well|The Well]]：15TB、16 类物理仿真数据；统一 HDF5/PyTorch 接口，用于 PDE 代理模型、神经算子和跨物理预训练研究
- [[sources/2026-07-15-benjamin-bai-lemario-jepa-world-model|LeMario]]：JEPA 世界模型能够学习动作条件预测，但预测状态与可用于规划的控制状态并不等价
- [[sources/2026-07-22-elsewhere-liang-wenfeng-investor-meeting|梁文锋投资人会议言语汇编]]：DeepSeek 的 AGI 路线、持续学习优先级、低成本与开源战略、团队稳定和愿景驱动组织；来源为媒体汇编，不是官方逐字稿

## 产品文章

- `products/mounts/articles/AI技术/哪些网站的文章在Google-SEO和ChatGPT-GEO中权重更高.md`：Google SEO 与 ChatGPT GEO 的平台选择、内容分发、抓取和衡量策略
- `products/mounts/articles/AI技术/GEO从入门到精通-生成式引擎优化完整指南.md`：GEO 全面方法论与执行清单

## Seed Areas（待充实）

- LLM · Agent · RAG · AI Coding
- Model Evaluation：已有 [[Arena AI]] 作为人类偏好型评测平台案例，仍待补充固定基准、LLM-as-a-Judge 与业务内部评测方法
