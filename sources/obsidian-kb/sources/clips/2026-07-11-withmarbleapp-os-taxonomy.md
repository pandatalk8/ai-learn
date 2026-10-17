---
title: "Marble Skill Taxonomy：开放的基础教育先修知识图谱"
original_title: "Marble Skill Taxonomy"
author: "Marble / Generative Spark, Inc."
source_url: "https://github.com/withmarbleapp/os-taxonomy"
source_platform: GitHub
published: 2026-07-08
captured: 2026-07-11
type: open-source-dataset
lang: en
status: source-summary-with-independent-audit
repository_commit: "96a7933"
license: "ODbL-1.0（数据库）+ CC-BY-SA-4.0（Marble 文本）+ 上游课程标准各自许可"
tags: [education, curriculum, knowledge-graph, prerequisite-graph, mastery-learning, adaptive-learning, open-data]
---

# Marble Skill Taxonomy：开放的基础教育先修知识图谱

## 来源边界

本文是对 GitHub 仓库 `withmarbleapp/os-taxonomy` 在 2026-07-11 的来源记录与结构审计，不是 Marble 官方文档的全文转载。

- 仓库：https://github.com/withmarbleapp/os-taxonomy
- 在线图谱：https://withmarble.com/curriculum/
- 产品网站：https://withmarble.com/
- 来源与许可：https://github.com/withmarbleapp/os-taxonomy/blob/main/PROVENANCE.md
- 校验脚本：https://github.com/withmarbleapp/os-taxonomy/blob/main/scripts/validate.mjs
- 数据生成时间：2026-07-08T09:15:41.140Z
- 本次检查的 `main` 提交：`96a7933`

官方称该数据集由 AI agents 从 7 套课程框架中组装，经团队审核后开放。仓库只发布导出的 JSON、Schema、校验器和说明文件，没有公开从上游标准生成微主题及依赖边的完整流水线。

## 官方发布内容

| 数据 | 数量 | 文件 |
|---|---:|---|
| 微主题 | 1,590 | `data/topics.json` |
| 先修依赖 | 3,221 | `data/dependencies.json` |
| 学科 | 8 | `data/topics.json` |
| 课程框架 | 7 | `data/curriculum-standards.json` |
| 课程标准 | 3,261 | `data/curriculum-standards.json` |
| 主题—标准链接 | 1,859 | `data/topics.json` |
| 领域年龄摘要 | 183 | `data/clusters.json` |

学科分布：Science 547、Mathematics 503、English 286、History 90、Personal & Social Development 88、Life Skills 37、Computing 21、Learning to Learn 18。

主题节点包含稳定 ID、类型、学科、领域、名称、描述、年龄范围、中心性、掌握证据、自然语言评估提示和课程标准引用。依赖边表达 `topicId` 依赖 `prerequisiteId`，并带 `hard` / `soft` 强度与一行理由。

## 独立结构审计

本次下载仓库后，用仓库校验器和独立 Node.js 脚本复核当前 JSON，得到：

- 官方校验器通过：计数、端点引用、标准引用和 SHA-256 完整性均正常。
- 当前图确实无环，1,590 个节点均完成拓扑排序。
- 没有重复依赖边，没有孤立节点。
- 全图形成 1 个弱连通分量。
- 100 个根节点，327 个终点节点，最长先修链为 28 条边。
- 2,025 条 hard 边（62.9%），1,196 条 soft 边（37.1%）。
- 161 条跨学科边，约占 5.0%。
- 56 条边的先修主题起始年龄晚于被依赖主题，其中 5 条年龄区间完全不重叠；社区已在 Issue #5 提交复核。

## 覆盖与质量观察

### 标准映射不完整

1,590 个主题中有 772 个没有任何课程标准链接，占 48.6%。按学科计算：

| 学科 | 主题 | 有标准映射 | 覆盖率 |
|---|---:|---:|---:|
| English | 286 | 245 | 85.7% |
| Mathematics | 503 | 270 | 53.7% |
| Science | 547 | 253 | 46.3% |
| Personal & Social Development | 88 | 50 | 56.8% |
| History | 90 | 0 | 0% |
| Computing | 21 | 0 | 0% |
| Life Skills | 37 | 0 | 0% |
| Learning to Learn | 18 | 0 | 0% |

`curriculum-standards.json` 收录了 338 条 C3 Social Studies 标准，但当前没有主题链接到这些标准。因此“已支持课程标准对齐”和“每个主题都可追溯到课程标准”不是同一件事。

### 语义错误无法被结构校验发现

社区 Issue #11 列出 14 个名称与描述、证据、评估提示及标准不一致的主题。例如名称是角度，实际内容可能是矩形面积或运算优先级。这类问题不会破坏 JSON 或引用完整性，但会直接影响搜索、展示、教学路径和 embedding。

### 校验器的边界

仓库虽然提供 JSON Schema，但无依赖校验器没有实际加载 Schema，也没有检查：

- DAG 是否有环；
- 是否存在重复边；
- 年龄区间与依赖方向是否合理；
- 名称与描述是否语义一致；
- `centrality` 如何计算、能否复现；
- manifest 总计数是否逐项与数据重算一致。

### 生成过程不可复现

`PROVENANCE.md` 提到内部导出工具 `exportTaxonomy.mjs`，但该文件以及上游数据库、AI prompts、合并规则、边生成算法、节点级审核记录均未发布。当前仓库能验证“快照未损坏”，不能从原始课程框架重建同一份图谱。

## 许可摘要

- 数据库集合、结构、ID 和关系：ODbL 1.0，要求署名；分发衍生数据库通常触发 share-alike。
- Marble 编写的名称、描述、证据、评估提示、边理由和摘要：CC BY-SA 4.0。
- UK National Curriculum：OGL v3.0，可包含全文。
- Common Core：包含全文，但仍受 CCSS 自身用途限制。
- NGSS、C3、IB PYP PSPE：只发布代码与 key，不发布标准正文。

在商业系统中应分开存储原始开放数据库、自有扩展关系、用户掌握数据和生成内容，不能把所有字段简单视为统一的“开源可商用内容”。

## 相关社区反馈

- 名称错配：https://github.com/withmarbleapp/os-taxonomy/issues/11
- 年龄/边方向疑点：https://github.com/withmarbleapp/os-taxonomy/issues/5
- LLM 表征与先修顺序实验：https://github.com/withmarbleapp/os-taxonomy/issues/8
- 可复现 embedding 与图谱可视化 PR：https://github.com/withmarbleapp/os-taxonomy/pull/6

## 本知识库中的解读

- Wiki 深度解读：[[wiki/sources/2026-07-11-withmarbleapp-os-taxonomy]]
- 相关平台：[[wiki/entities/Math Academy]]
- 课程领域地图：[[wiki/maps/课程]]
