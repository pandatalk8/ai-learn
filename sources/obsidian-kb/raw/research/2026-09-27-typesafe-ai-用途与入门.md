---
title: "TypeSafe AI 是做什么的：把 AI 判断接进软件和自动化流程"
date: 2026-09-27
tags: [AI, TypeSafe, Jev, 自动化, 结构化输出]
review: unreviewed
verification: official-docs-reviewed-not-runtime-tested
source: https://console.typesafe.ai/home
---

# TypeSafe AI 是做什么的：把 AI 判断接进软件和自动化流程

假设你的知识库每天收到几十篇文章。你希望系统判断主题、识别教程、筛出值得细读的材料，再把结果写进索引。手工整理很费时间，关键词规则又很容易漏掉换了一种说法的内容。

这类工作需要 AI 理解文本，也需要程序拿到明确、可处理的判断。TypeSafe AI 正是在解决两者之间的衔接问题。

**它提供的核心能力，是把一段材料转换成分类、评分或是非判断，让软件据此执行下一步。** 你给出的地址是它的控制台入口；真正承载这些判断的是名为 Jev 的模型，官方将其归入 System One Models。开发者可以通过网页试验，再通过 API 接入自己的应用。[官方介绍](https://docs.typesafe.ai/introduction)

本文依据 2026 年 9 月 27 日可访问的官方资料整理。控制台首页访问遇到安全验证，Playground 链接在未登录时进入登录页；以下操作依据官方文档，未完成登录后的界面实测，也未使用 API 密钥执行请求。知识库案例为本文设计的应用示例。

## 先理解它返回什么

使用 TypeSafe 时，你需要准备两样东西：待判断的材料，以及明确的问题。材料放在 `state` 中，可以是一段文本，也可以是包含标题、正文、业务记录的 JSON 对象。问题放在 `questions` 中，告诉模型要根据材料判断什么。[State 文档](https://docs.typesafe.ai/concepts/state)

官方提供三种基本问题类型：

| 类型 | 用来做什么 | 知识库中的示例 |
| --- | --- | --- |
| Choice | 从预先列出的选项中选择 | 这篇文章属于编程、产品、商业还是其他？ |
| Score | 按有顺序的标准评分 | 教程的可操作性处于哪个等级？ |
| Noul | 返回一个命题成立的概率 | 正文是否提供了具体操作步骤？ |

Choice 返回选项、概率分布和置信度；Score 返回分值、等级说明、概率分布和置信度；Noul 返回 0 到 1 之间的数值，没有单独的 `confidence` 字段。Noul 接近 0.5 表示判断不确定，不表示被评价对象“水平中等”。[问题类型说明](https://docs.typesafe.ai/primitives)

这些区别决定了提问方式。判断“属于哪一类”适合 Choice；判断“程度有多高”适合 Score；判断“有没有某种特征”适合 Noul。先确定程序需要什么答案，问题通常就容易设计了。

## 可以用它做什么

TypeSafe 适合嵌入已有流程中的判断环节。官方展示的工作流包括客服、安全事件、发票处理和 Agent 执行记录检查；这些流程把模型判断与程序规则结合起来，产出后续动作。[官方工作流评测](https://evals.typesafe.ai/)

从这些能力出发，可以设计以下应用。表中的具体方案是本文的应用推演，并非现成的一键功能。

| 场景 | 交给模型的判断 | 程序负责的下一步 |
| --- | --- | --- |
| 知识库整理 | 主题分类、是否包含教程、内容相关性 | 写入候选标签，生成待审核清单 |
| 客服分流 | 问题类型、紧急程度、是否请求退款 | 分配队列，展示给对应客服 |
| 内容筛选 | 是否与关注领域有关、信息是否具体 | 排序并挑选值得阅读的材料 |
| Agent 质量检查 | 是否完成用户要求、是否出现可疑操作 | 标记执行记录，安排人工复核 |

以知识库为例，你可以分别判断“与 AI 开发的相关性”“操作步骤的完整性”“是否包含可复用案例”，再在代码里按照自己的偏好加权。这样，调整选文标准时，可以直接修改权重。官方将类似做法称为 Composite Scoring，即组合评分。[架构模式](https://docs.typesafe.ai/patterns)

这里要分清服务边界：TypeSafe 负责判断；读取 Obsidian 文件、下载网页、写标签和更新索引，仍需要你的程序或其他工具完成。本文的方案也不会因为模型打了高分，就自动把材料视为可信来源。

## 怎么开始：先在网页里验证一个小问题

最合适的第一步，是拿一段自己熟悉的材料试验。官方的入门路径是：登录 Playground，填入 `state`，添加问题，然后查看结果；同一请求可以混合多种问题类型。[Quick start](https://docs.typesafe.ai/introduction/quickstart)

可以从这个小实验开始：

1. 打开 [TypeSafe 控制台](https://console.typesafe.ai/home)，进入 [Playground](https://console.typesafe.ai/playground)。账号能否立即使用，以实际开通状态为准。
2. 在 `state` 中填入一篇短文的正文。优先用你已经读过、能够自己判断的材料。
3. 添加 Noul 问题：“这篇文章是否包含读者可以照着执行的具体步骤？”
4. 换一篇只有观点、没有操作步骤的文章，比较两次结果。
5. 再加入 Choice 问题，设置编程、产品、商业、其他四个选项，观察分类是否符合预期。

这个实验的目的，是检查你的标准能不能被模型稳定理解。比如“好文章”太宽泛，而“是否提供明确步骤、工具名称或配置示例”就更容易核对。

## 怎么接进程序：一个最小 API 示例

官方 HTTP 接口是 `POST https://api.typesafe.ai/v1/systemone`，使用 Bearer API Key 认证。请求包含 `state`、`model` 和 `questions`；响应的 `answers` 按你设置的问题 ID 返回结果。[API 文档](https://docs.typesafe.ai/api)

从控制台取得 API Key，在本地环境中配置 `TYPESAFE_API_KEY` 后，可以运行下面的示例。它判断一段英文内容是否包含操作步骤；示例请求按官方接口编写，未实际调用，运行会使用账号额度。

```bash
curl --fail-with-body https://api.typesafe.ai/v1/systemone \
  -H "Authorization: Bearer $TYPESAFE_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @- <<'JSON'
{
  "model": "jev-latest",
  "state": {
    "title": "Exporting notes",
    "body": "Open Settings, choose Export, select Markdown, and save the files to a local folder."
  },
  "questions": {
    "has_steps": {
      "type": "noul",
      "instructions": "Does `body` contain concrete steps a reader can follow to complete a task?"
    }
  }
}
JSON
```

程序需要读取的是 `answers.has_steps.noul`。接下来可以写一条自己的规则：超过经过验证的阈值，就加入“教程候选”列表；不确定时留给人工判断。阈值由你的数据和容错要求决定，不能凭一个演示结果直接定下来。

如果不熟悉编程，可以把上面的目标交给编程助手：

> 请做一个本地 Markdown 分类脚本，使用 TypeSafe 官方 API。读取指定目录中的文章，判断主题和是否包含操作步骤，将结果保存为独立的 JSON 文件，保留原文。密钥从环境变量读取。先提供单文件试运行方式，再支持批量处理。

这样得到的是一个范围明确、方便检查的小工具。待分类结果稳定之后，再考虑将候选标签接入知识库索引。

## 概率和置信度应该怎么用

Choice 和 Score 的 `confidence` 来自概率分布的形状：结果越集中，通常越有把握；分布越分散，就越不确定。因此，`confidence = 0.9` 不能直接理解成“这个结果有 90% 的正确率”。[Confidence 文档](https://docs.typesafe.ai/confidence)

实际接入时，可以设计三条路径：把握较高时自动添加候选标签；把握一般时保留建议；把握较低时进入人工队列。不同动作应有不同门槛。给文章加一个可撤销标签，与删除文章或对外发布内容，不能使用同一套容错标准。

建议先准备 30—50 篇人工看过的材料，覆盖正常样本、模糊样本和明显不符合要求的样本。记录模型判断、人工判断和错误类型，再决定哪些结果可以自动采用。这是本文建议的起步测试方式，不是官方承诺的准确率验证规模。

## 使用前需要知道的边界

第一，Jev 当前只接受文本。图片、音频、视频需要先经过 OCR 或转写等处理。第二，官方说明其主要训练语言是英文，中文等其他语言目前准确率较低。做中文知识库时，必须用中文材料验证；英文示例跑通不代表中文效果相同。[输入与语言限制](https://docs.typesafe.ai/concepts/state)

第三，类型安全不能保证判断正确。官网使用了“Zero Hallucinations”的宣传表述，理解时应结合其输出受约束的设计：不生成自由文本、只在预设范围内作答，仍然可能选错类别或评错分数。不能据此认定它不会犯错。[官网产品说明](https://typesafe.ai/)

第四，价格和速度要结合任务看。截至本文整理时，官方模型页列出的输入价格为每百万 token 0.042 美元，输出 token 免费。按这个单价，累计一亿输入 token 的模型费用约为 4.20 美元；这只是用量乘单价的估算，不包含其他服务或账号条款。[模型与价格](https://docs.typesafe.ai/models)

官方发布文章给出了低延迟和较低成本的表现，但也说明演示使用了短而密集的输入，测试地点主要在美国西海岸。实际中文长文、网络距离和业务流程都可能改变结果，不能把宣传中的倍数视为每个应用都能获得的收益。[发布说明](https://typesafe.ai/blog/introducing-system-one-models-and-jev)

最后，Jev 不生成文章、回复正文或任意字符串。需要撰写摘要、解释原因或生成内容时，应为流程另外配置相应能力。它的价值集中在已经能够定义答案形状、可以拆成小问题的判断任务上。[官方介绍](https://docs.typesafe.ai/introduction)

回到开头的知识库问题，最值得先做的是一个有限实验：挑选几十篇材料，让 TypeSafe 判断主题和是否包含操作步骤，再与自己的判断比较。只有当这些小判断足够稳定，自动整理才有可靠的起点。
