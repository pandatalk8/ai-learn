# AI 驱动的个人内容知识系统：v1.1 方案

> 基于 v1.0 审查报告重写  
> 日期：2026-06-15  
> 目标：把现有 3525 篇文章、19 个课程目录、视频笔记、调研素材，升级为可追溯、可编译、可复用的个人内容知识系统。

---

## 0. v1.1 相比 v1.0 的变化

v1.0 的重点是审查原方案，指出风险；v1.1 的重点是形成正式执行方案。

主要变化：

1. 把“`wiki/` 是唯一知识中枢”改为 **source-first 知识系统**。
2. 明确 `raw/`、`sources/`、`products/`、`wiki/` 之间不是简单上下游，而是一张知识图谱。
3. 增加 `.kb/links/` 作为知识图谱第一版存储，避免只靠 Obsidian `[[wikilink]]`。
4. 增加 `.kb/manifest.sqlite`，让文件扫描、hash、增量 ingest、lint 可重建。
5. 明确发布目录不被污染：不批量往文章正文写 `[[wikilink]]`。
6. 增加 staging review：AI 批量生成内容先进入 `.kb/staging/`，人确认后再合并。
7. 把 Backfill 从“读前 500 字”升级为结构化抽样。
8. 把课程、媒体、文章统一建模为发布产品层，而不是散落目录。

---

## 1. 核心判断

你的现有内容已经超过“笔记库”范畴，更接近一个个人内容资产仓库：

| 类型 | 现状 |
|------|------|
| 文章 | `/Users/wanghe/workspace/Articles` 下约 3525 篇 Markdown |
| 课程 | `/Users/wanghe/workspace/Courses` 下 19 个一级课程目录，约 233 篇 Markdown |
| 混在 Articles 的课程 | 财富的数学课、YouTube 成长方法论、X 增长、iOS 上架指南、户外钓鱼等 |
| 视频笔记 | 已有转写、分节、文章化产物，但结构不统一 |
| 调研材料 | 分散在课程、文章和临时目录中 |
| 发布流程 | `Articles/build.py` 仍是现有文章发布链路的核心 |

当前真正的问题不是“没有知识库”，而是：

```text
内容很多，但缺少统一的关系层。
素材、文章、课程、视频之间没有稳定连接。
AI 可以读文件，但不知道哪些是事实源、哪些是产物、哪些是索引。
```

v1.1 的目标不是做一个漂亮的 Obsidian vault，而是做一个 **AI 可编译的个人内容操作系统**。

---

## 2. 设计原则

### 2.1 Source-first

先区分三类事实源：你的原创输入、外部来源材料、你的发布成品。

```text
raw/                    你的原创输入：手写想法、口述转写、判断、构思
sources/                外部来源材料：网页、论文、书摘、报告、外部视频转写
products/               你的发布/交付成品：文章、课程、视频脚本、小册子
wiki/                   二手索引和综合，不是事实源
```

任何 wiki 里的判断，都必须能追溯到 `raw/`、`sources/` 或 `products/`。

### 2.2 Wiki 是人类界面，不是唯一数据库

`wiki/` 的职责是让人类看懂概念、实体、领域地图。

机器查询不依赖 wiki 正文，而依赖 `.kb/manifest` 和 `.kb/links`。

```text
wiki/       给人读
.kb/links   给机器查
raw/        回到个人原创输入
sources/    回到外部来源材料
products/   回到发布成品
```

### 2.3 发布隔离

1.1 阶段不批量修改 `Articles/` 和 `Courses/` 的正文。它们属于你的发布/交付成品，语义上应归入 `products/`，而不是外部来源 `sources/`。

尤其不批量插入：

```text
[[wikilink]]
Obsidian-only frontmatter
Dataview 查询
```

文章和概念的关系先记录在 `.kb/links/`，不污染发布系统。

### 2.4 Staging-first

AI 批量生成的内容默认不直接进入正式 wiki。

```text
AI 生成 -> .kb/staging/ -> 人 review -> 合并到 wiki 或 .kb/links
```

直接覆盖已 review 的 wiki 页面，需要明确指令。

### 2.5 可重建

`.kb/manifest.sqlite`、`.kb/links/`、`.kb/reports/` 都应可从源文件重新生成。

系统允许局部损坏，但不能丢失原文。

---

## 3. 总体架构

### 3.1 目录结构

```text
~/obsidian-kb/
├── raw/                         # 你的原创输入：人写入，AI ingest
│   ├── notes/                   # 手写想法、判断、构思
│   ├── voice/                   # 口述转写
│   ├── research/                # 你的调研判断和研究笔记
│   └── drafts/                  # 尚未成为产品的草稿
│
├── sources/                     # 外部来源材料
│   ├── clips/                   # 网页剪藏
│   ├── papers/                  # 论文
│   ├── books/                   # 书摘
│   ├── reports/                 # 第三方报告
│   └── media/                   # 外部音视频转写
│
├── wiki/                        # 人类可读知识层
│   ├── concepts/                # 概念页
│   ├── entities/                # 人物、公司、产品、工具、论文
│   ├── maps/                    # 领域地图
│   ├── sources/                 # 高价值 source 摘要页
│   ├── index.md
│   └── changelog.md
│
├── products/                    # 你的发布/交付成品
│   ├── articles.md              # 文章索引
│   ├── courses.md               # 课程索引
│   ├── media.md                 # 媒体项目索引
│   └── mounts/                  # 只读挂载入口
│       ├── articles -> /Users/wanghe/workspace/Articles
│       └── courses -> /Users/wanghe/workspace/Courses
│
├── .kb/                         # 机器层，可重建
│   ├── manifest.sqlite          # 文件清单、hash、mtime、标题、类型
│   ├── fts.sqlite               # 全文搜索索引，可选
│   ├── links/                   # 知识图谱边，sidecar YAML
│   ├── metadata/                # 产品/课程/媒体补充元数据
│   ├── staging/                 # AI 待审核输出
│   ├── reports/                 # lint/backfill/review 报告
│   └── logs/                    # ingest 日志
│
└── CLAUDE.md                    # AI 操作规范
```

### 3.2 分层职责

| 层 | 职责 | 是否事实源 | 谁写 |
|----|------|------------|------|
| `raw/` | 你的原创输入 | 是 | 人为主，AI 可整理副本 |
| `sources/` | 外部来源材料 | 是 | 外部资料转存或转写 |
| `products/` | 你的文章、课程、媒体成品 | 是 | 人和 AI 协作，但发布流程保持隔离 |
| `wiki/` | 概念、实体、地图、摘要 | 否，必须引用来源 | AI 草拟，人 review |
| `.kb/` | 机器索引、图谱边、报告 | 可重建 | 脚本和 AI |

---

## 4. raw、sources、products、wiki 的关系

### 4.1 三者不是单向流水线

原方案容易被理解成：

```text
raw/sources -> wiki -> products
```

这不完整。真实关系应该是闭环：

```text
raw 原创输入 + sources 外部材料
  -> ingest
  -> wiki 概念/实体/地图
  -> 支撑 products 文章、课程、视频创作
  -> products 产生新观点
  -> backfill 回 wiki 和 .kb/links
  -> 支撑下一次创作
```

### 4.2 四类核心对象

v1.1 先把知识图谱收敛为四类核心对象：

| 对象 | 说明 | 示例 |
|------|------|------|
| Source | 外部来源或可引用事实材料 | 网页剪藏、论文、书摘、外部视频转写、第三方报告 |
| Concept | 可复用概念 | RAG、上下文工程、复利、梯度下降 |
| Entity | 具体实体 | OpenAI、Anthropic、Claude Code、Karpathy |
| Product | 你的发布/交付产物 | 文章、课程、小册子、视频、脚本 |

后续可扩展 `Claim`、`Example`、`Case`，但 1.1 不强制。

### 4.3 最小知识图谱

1.1 必须支持这些关系：

| 边 | 含义 |
|----|------|
| `mentions` | 某来源提到某概念/实体 |
| `explains` | 某文章/章节系统解释某概念 |
| `uses` | 某发布内容使用某概念 |
| `derived_from` | 某内容改编自另一个来源 |
| `part_of` | 章节属于课程 |
| `related_to` | 概念之间相关 |
| `alias_of` | 别名指向规范概念 |

能回答这些问题就算 1.1 成功：

```text
RAG 在哪些文章里出现过？
哪门课系统讲过梯度下降？
某篇文章用了哪些概念和实体？
某个视频转写支撑了哪些观点？
财富的数学课和哪些旧文章重叠？
某个概念有哪些别名？
```

### 4.4 `.kb/links/` 是图谱第一版存储

不要一上来上 Neo4j 或复杂 RAG。先用 sidecar YAML 表达图谱边。

示例：

```yaml
source: "products/mounts/articles/AI技术/RAG实战指南.md"
source_type: article
source_hash: "sha256:..."
title: "RAG 实战指南"
edges:
  - type: mentions
    target: "[[检索增强生成]]"
    target_type: concept
    confidence: high
    evidence: "全文多次讨论 RAG 的架构和适用场景"

  - type: explains
    target: "[[向量数据库]]"
    target_type: concept
    confidence: medium
    evidence: "第 3 节解释 embedding 检索"

  - type: mentions
    target: "[[OpenAI]]"
    target_type: entity
    confidence: high
    evidence: "示例代码使用 OpenAI embedding API"
```

路径建议：

```text
.kb/links/articles/AI技术/RAG实战指南.md.yaml
.kb/links/courses/深度学习课程/01-神经网络基础.md.yaml
.kb/links/sources/clips/xxx.md.yaml
.kb/links/media/HGFyIgyW3cM.yaml
```

这样图谱既能被机器查询，也不会改动原文。

---

## 5. 文件规范

### 5.1 概念页

```yaml
---
title: "检索增强生成"
aliases: ["RAG", "Retrieval-Augmented Generation"]
type: concept
canonical_id: concept:rag
status: draft              # draft | reviewed | deprecated
created: 2026-06-15
updated: 2026-06-15
reviewed_at:
tags: [AI, LLM, 检索]
sources:
  - "products/mounts/articles/AI技术/xxx.md"
  - "sources/clips/xxx.md"
related:
  - "[[向量数据库]]"
  - "[[上下文工程]]"
confidence: medium
merge_into:
---
```

正文结构：

```markdown
# 检索增强生成

## 定义

一句话定义。

## 我的理解

综合解释，必须能追溯到 Sources。

## 已发布内容

- `products/mounts/articles/AI技术/xxx.md`

## 原始素材

- `sources/clips/xxx.md`

## Related

- [[向量数据库]]
- [[上下文工程]]
```

### 5.2 实体页

```yaml
---
title: "Anthropic"
aliases: ["Claude", "Anthropic AI"]
type: entity
entity_type: company       # person | company | product | tool | paper | project
canonical_id: entity:anthropic
status: draft
created: 2026-06-15
updated: 2026-06-15
tags: [AI, LLM]
sources: []
related: []
confidence: medium
---
```

### 5.3 课程 COURSE.md

`COURSE.md` 是课程控制面板，不要求先迁移课程目录。

```yaml
---
title: "财富的数学课"
type: course
status: 写作中              # 调研 | 大纲 | 写作中 | 已完结 | 待更新
source_root: "products/mounts/articles/财富的数学课"
created: 2026-05-14
updated: 2026-06-15
tags: [财富, 数学, 投资]
concepts:
  - "[[复利]]"
  - "[[凯利公式]]"
research:
  - "raw/research/财富数学-调研判断.md"
review_status: draft
---

## 课程定位

这门课解决什么问题，面向谁，不面向谁。

## 大纲

- [x] 01-财富数学的底层逻辑
- [x] 02-复利与现金流数学
- [ ] 03-概率风险与不确定性

## 章节依赖

- 03 依赖 [[概率]]、[[期望值]]

## 缺口

- 需要补充更多现实投资案例。
```

### 5.4 媒体 SOURCE.md

外部音视频只保存转写和时间锚点，不保存二进制。

```text
sources/media/<media-id>/
├── SOURCE.md
├── transcript-zh.md
├── transcript-en.md
└── notes.md
```

```yaml
---
title: "视频标题"
type: media_source
media_kind: youtube
url: "https://youtube.com/watch?v=xxxx"
binary:
channel:
duration:
published:
transcribed_with:
created: 2026-06-15
tags: []
concepts: []
---

## 时间索引

- 00:00 开场
- 12:30 关键概念

## 摘要

一段摘要。
```

---

## 6. 核心流程

### 6.1 Manifest：先建立文件清单

所有 ingest 和 backfill 之前，先生成 manifest。

字段：

```text
path
canonical_path
kind                 # raw | source | article | course | chapter | media
title
mtime
sha256
size
category
excluded_reason
last_ingested_at
```

排除目录：

```text
_site/
.git/
.obsidian/
.claude/
.gstack/
node_modules/
build/
latex/
数据/
二进制大文件目录
```

### 6.2 Ingest 新 raw / sources

```text
1. 读取 raw 或 sources 文件
2. 生成 source 摘要
3. 提取候选 concept/entity
4. 查 alias，避免重复创建概念
5. 生成 .kb/staging/links 候选
6. 高价值内容生成 wiki 草稿
7. 人 review 后合并
```

规则：

- 不修改 raw 原文或 sources 原文。
- 新概念默认 `status: draft`。
- 无来源判断不得进入 reviewed 页面。

### 6.3 Backfill 存量文章

不读全文暴力处理，先结构化抽样：

```text
路径
文件名标题
frontmatter
前 300-500 字
所有 H2/H3 标题
每个 H2 后第一段
结尾 300-500 字
内部链接、图片 alt
```

输出：

```text
.kb/links/...yaml
.kb/staging/wiki concept drafts
.kb/reports/backfill-batch-xxx.md
```

不输出：

```text
不改原文章正文
不批量插入 wikilink
不直接重排目录
```

存量文章属于 `products/mounts/articles` 语义，是你的发布成品，不属于外部来源 `sources/`。

### 6.4 Backfill 课程

课程优先级高于全量文章，因为课程最能体现知识复用。

流程：

```text
1. 扫描 Courses/ 和 Articles/ 中的课程目录
2. 生成课程清单
3. 为样板课程生成 COURSE.md 草稿
4. 提取章节、状态、前置依赖、覆盖概念
5. 生成课程与概念的 .kb/links
6. 人 review 后写入正式 COURSE.md
```

1.1 不强制把 Articles 中的课程搬到 Courses，只先统一索引。

### 6.5 媒体 ingest

入站媒体：

```text
外部视频/播客
  -> transcript
  -> sources/media/<id>/SOURCE.md
  -> .kb/links/media/<id>.yaml
  -> wiki concept/entity
```

出站媒体：

```text
文章/wiki
  -> script.md
  -> TTS/Remotion/HyperFrames/剪辑
  -> output.mp4
  -> MEDIA.md 记录来源、脚本、产物路径、平台
```

铁律：

```text
binary 不进 vault
transcript 进 sources/media
时间戳进入 evidence
```

### 6.6 Query 查询

查询优先级：

```text
1. wiki/：看人类整理后的概念和地图
2. .kb/links/：查哪些 source/product 连接到该概念
3. products/：回到你已经发布/交付的文章、课程、脚本
4. sources/：回到外部来源材料
5. raw/：回到你的原创输入和判断
```

回答必须引用路径。不能只引用 wiki 总结。

### 6.7 Compose 创作

写新文章、课程章节、视频脚本时：

```text
1. 查 wiki 和 .kb/links
2. 找已有文章、课程、素材、案例
3. 生成大纲
4. 标注可复用来源
5. 写作完成后生成 sidecar links
6. 高价值新观点再 ingest 回 wiki
```

---

## 7. Lint 和质量控制

### 7.1 确定性 Lint

这些可以自动检查：

```text
source 文件不存在
source hash 变化但未重新 ingest
wiki 页面缺 sources
概念缺 aliases
重复 alias
deprecated 页面仍被引用
sidecar target 不存在
COURSE.md 缺失
媒体 SOURCE.md 缺 transcript
发布目录出现 Obsidian 内部文件
```

### 7.2 语义 Lint

这些只生成报告，不自动修改：

```text
疑似矛盾观点
疑似过时页面
疑似重复概念
领域地图缺口
课程章节依赖不完整
某个概念只有文章提到但没有系统解释
```

---

## 8. 实施路线图

### 阶段 0：冻结边界

耗时：半天。

产出：

```text
确认不批量改写 Articles 正文
确认 binary 不进 vault
确认 sources/ 只读
确认 AI 批量结果先进 staging
```

### 阶段 1：搭建 v1.1 骨架

耗时：1 天。

产出：

```text
~/obsidian-kb/
raw/
wiki/
products/
sources/ symlink
.kb/
CLAUDE.md
```

并生成第一版 manifest。

### 阶段 2：课程样板

耗时：1-2 天。

样板：

```text
Articles/财富的数学课
Courses/深度学习课程
```

产出：

```text
COURSE.md 草稿
课程章节清单
课程概念覆盖表
课程缺口报告
.kb/links/course...
```

### 阶段 3：文章样板 backfill

耗时：1-2 天。

范围：

```text
Articles/AI技术 中 30-50 篇
```

产出：

```text
sidecar links
概念草稿
实体草稿
backfill review 报告
CLAUDE.md 规则修订
```

### 阶段 4：媒体样板

耗时：半天到 1 天。

范围：

```text
选 1 个已有视频笔记
整理为 sources/media/<id>/SOURCE.md
抽取时间锚点
链接到 3-5 个概念
```

### 阶段 5：扩大批量

进入条件：

```text
概念重复率可控
sidecar links 准确率可接受
人工 review 成本可接受
Articles/build.py 不受影响
```

再扩展到：

```text
AI技术 全目录
财富/创业/IP 相关目录
全部课程
最后全量 3525 篇文章
```

---

## 9. 成功指标

v1.1 完成后，系统至少应该能稳定回答：

1. 我写过哪些关于 RAG 的内容？分别是文章、课程还是视频？
2. 哪些课程系统讲过“梯度下降”？
3. 《财富的数学课》和哪些旧文章、旧素材存在重叠？
4. 某篇文章用了哪些概念和实体？
5. 某个视频转写支撑了哪些 wiki 概念？
6. 哪些概念只有零散提到，还没有系统解释？
7. 哪些概念有多个别名或疑似重复页面？
8. 任意 wiki 判断能否回到 source？
9. `Articles/build.py` 发布流程是否完全不受影响？

---

## 10. 建议的 CLAUDE.md 核心规则

```markdown
# Knowledge Base Operating Rules

## Source of Truth

- raw/, sources/, and products/ are source of truth in different roles.
- raw/ is original personal input.
- sources/ is external source material.
- products/ is published or delivered personal output.
- wiki/ is a human-readable index, not the final authority.
- Every non-trivial claim in wiki/ must cite raw/, sources/, or products/.

## Write Boundaries

- Do not modify mounted product files unless explicitly requested.
- Do not batch insert Obsidian wikilinks into Articles or Courses.
- Put AI-generated bulk changes into .kb/staging/ first.
- Preserve human-reviewed wiki content.

## Graph Model

- Represent source-to-concept/entity/product relations in .kb/links/.
- Use explicit edge types: mentions, explains, uses, derived_from, part_of, related_to, alias_of.
- Do not rely on natural language summaries as the only relationship record.

## Ingest

1. Read the source file.
2. Extract title, summary, concepts, entities, claims, examples.
3. Check existing aliases before creating new concept pages.
4. Create draft pages or sidecar link files in staging.
5. Update changelog after review.

## Backfill

- Use structural sampling: title, headings, first paragraphs, ending, links.
- Do not rely only on the first 500 words.
- Do not modify original article body.

## Query

1. Start from wiki/.
2. Use .kb/links/ to find covered raw/source/product files.
3. Return to raw/, sources/, or products/ for factual detail.
4. Cite paths.

## Lint

- Check broken raw/source/product paths.
- Check missing citations.
- Check duplicate aliases.
- Check deprecated pages still referenced.
- Check COURSE.md and SOURCE.md completeness.
```

---

## 11. 最终方案一句话

v1.1 的本质不是“用 AI 维护 Obsidian”，而是：

```text
用 Markdown 保存事实源，
用 .kb 建立可重建的知识图谱，
用 wiki 提供人类可读的概念界面，
用 AI 执行 ingest、backfill、lint、compose，
用人工 review 保证高价值知识不被污染。
```

先做小闭环，再做全量扩展。这是当前规模下最稳的路线。
