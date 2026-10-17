---
url: "https://x.com/trq212/status/2052809885763747935"
title: "使用 Claude Code：HTML 的不合理有效性"
requestedUrl: "https://x.com/trq212/status/2052809885763747935"
author: "Thariq (@trq212)"
authorName: "Thariq"
authorUsername: "trq212"
authorUrl: "https://x.com/trq212"
tweetCount: 1
coverImage: "imgs/img-010-HHz_ftzaIAAwkQs.jpg"
translation: "zh-CN"
sourceFile: "using-claude-code-the-unreasonable-effectiveness-of-html.md"
---

# 使用 Claude Code：HTML 的不合理有效性

> 本文翻译自 Thariq（[@trq212](https://x.com/trq212)）的推文，原文链接：[https://x.com/trq212/status/2052809885763747935](https://x.com/trq212/status/2052809885763747935)

![The Unreasonable Effectiveness of HTML](imgs/img-010-HHz_ftzaIAAwkQs.jpg)

Markdown 已经成了智能体与我们沟通时最常用的文件格式。它简单、可移植，有一定的富文本能力，也很容易由人手动编辑。Claude 甚至已经很擅长在 Markdown 文件里用 ASCII 画图。

但随着智能体变得越来越强，我越来越觉得 Markdown 成了一种限制。超过一百行的 Markdown 文件，我读起来就很费劲。我想要更丰富的可视化、颜色和图表，也想更轻松地分享这些内容。

我也越来越少亲自编辑这些文件，而是把它们当成规格文档、参考资料、头脑风暴输出等内容来使用。即使真的要改，我通常也是提示 Claude 去改，这就削弱了 Markdown 最大的优势之一。

我已经开始更偏好让 Claude 输出 HTML，而不是 Markdown。我也越来越常看到 Claude Code 团队里的其他人这么做。下面就是原因。

（如果你想先看一些例子，可以在 [这里](https://thariqs.github.io/html-effectiveness) 看到很多。只是记得回来继续读读为什么。）

# 为什么是 HTML？

## 信息密度

![](imgs/img-006-HHz_q48aAAAaCfW.jpg)

相比 Markdown，HTML 能承载丰富得多的信息。它当然可以表达标题、格式这类简单的文档结构，但也能表达各种其他信息，比如：

- 用表格表示表格数据
- 用 CSS 表示设计数据
- 用 SVG 表示插图
- 用 script 标签表示代码片段
- 用 JavaScript 和 CSS 配合 HTML 元素实现交互
- 用 SVG 和 HTML 表示工作流
- 用绝对定位和 canvas 表示空间数据
- 用 image 标签表示图片

我甚至会说，Claude 能读取的几乎任何一组信息，都可以相当高效地用 HTML 表达出来。这让 HTML 成为模型向你传递深入信息、也让你复查这些信息的一种高效方式。

如果做不到这一点，模型就可能在 Markdown 里用一些低效方式表达信息，比如 ASCII 图，或者我最喜欢的，用 Unicode 字符来估算颜色。下面这张 Claude Code 截图就是例子。

![Claude Code trying to show color in markdown](imgs/img-007-HH0CDc6a8AAy1bv.png)

## 视觉清晰度和阅读体验

![](imgs/img-009-HH0AgqJbcAAaEcZ.jpg)

随着 Claude 能完成越来越复杂的工作，它写出的规格文档和计划也越来越长。实践中我发现，超过 100 行的 Markdown 文件，我往往并不会真的读完；我也几乎不可能让组织里的其他人认真读完。

但 HTML 文档读起来容易得多。Claude 可以用标签页、插图、链接等方式，把结构组织成更适合浏览的视觉形式。它甚至可以做成移动端响应式，这样你在不同设备上可以用不同方式阅读。

## 易于分享

Markdown 文件其实不太好分享，因为大多数浏览器并不能很好地原生渲染它们。你经常不得不把它们作为邮件或消息附件发送。

而 HTML 只要上传文件，比如上传到 S3，就可以很方便地分享链接。你的同事可以在任何地方打开它，也能很容易地引用它。

如果你的规格文档、报告或 PR 说明是 HTML，别人真正读它的概率会高很多。

## 双向交互

![](imgs/img-002-HH0Ao0tbYAAOF9e.jpg)

HTML 可以让你与文档交互。例如，你可能想让它添加滑块或旋钮，用来调整设计；或者让你微调算法里的不同选项，看看会发生什么。你也可以让它提供一个复制按钮，把这些修改复制成提示词，再粘回 Claude Code。

想看这种双向交互的例子，可以阅读我关于 [playgrounds 的帖子](https://x.com/trq212/status/2017024445244924382)。

数据摄取

为什么要用 Claude Code 来生成 HTML 文件，而不是用 ClaudeAI 或 Claude Design？一个重要原因是 Claude Code 能摄取大量上下文。

比如写这篇文章时，我让 Claude Code 读取我的代码文件夹，找出我生成过的所有 HTML 文件，对它们进行分组和分类，然后生成一个 HTML 文件，用图表展示每一种类型。你在这篇文章里看到的图表，就是这次过程的直接结果。

除了文件系统，Claude Code 还能通过你的 MCP 获取更多上下文，比如 Slack、Linear 等；也能利用你的网页浏览器、git 历史等信息。

## 它很有乐趣

用 Claude 制作 HTML 文档就是更有趣，也让我更有参与感和投入感。光是这一点就足够了。

## 如何开始

我有点担心人们读完这篇文章后，会把它做成某个 `/html` skill 之类的东西。那也许有一定价值，但我想强调的是，你并不需要做太多事情就能让 Claude 这样工作。你只要直接要求它“做一个 HTML 文件”或“做一个 HTML artifact”就可以。

关键是你要知道你希望这个 artifact 做什么，以及你可能会怎样使用它。随着时间推移，你也许会做一个 skill，但现在我建议你先从零开始提示，在不同场景里摸索它的用法。

# 使用场景

为了让这个想法更具体，我已经为不同场景做过许多 HTML 文件。你可以在 [这里](https://thariqs.github.io/html-effectiveness/) 查看全部示例。下面是一个概览。

## 规格、规划和探索

HTML 是 Claude 深入问题的丰富画布。当我开始处理一个问题时，相比让它写一个简单的 Markdown 计划，我现在更期待它生成一组互相关联的 HTML 文件。比如，我可能先让 Claude Code 头脑风暴，并生成几个不同方向的探索。然后我会让它沿着其中一个方向继续展开，可能加入 mockup 或代码片段。最后，当我感觉方向不错时，我会让它写实现计划。等我满意这个计划后，我会开启一个新会话，把所有这些文件传进去让它实现。

做验证时，我也会让验证 agent 读入这些文件，这样它能获得更完整的上下文，知道需要验证什么。

![](imgs/img-008-HH0BFWLbMAEk_7T.jpg)

示例提示词：

- 我不确定 onboarding 页面该走哪个方向。生成 6 种明显不同的方案，布局、语气和信息密度都要有差异，然后把它们放在一个 HTML 文件的网格里，方便我并排比较。给每个方案标注它做出的取舍。
- 创建一份完整的 HTML 实现计划，记得加入一些 mockup，展示数据流，并加入我可能需要审查的重要代码片段。让它易读、易消化。

使用场景：

- 探索某个代码实现的其他方案
- 探索多种视觉设计

## 代码审查和理解

代码在 Markdown 文件里可能很难阅读。但用 HTML，我们可以渲染 diff、注释、流程图、模块结构等。你可以用它来理解 agent 写出的代码、做代码审查，或向审查你 PR 的人解释 PR。我发现这通常比 GitHub 默认的 diff 视图更好用。现在我给每个 PR 都会附上一份 HTML 代码解释文档。

![](imgs/img-001-HH0BRSQbMAAuuof.png)

示例提示词：

帮我审查这个 PR，创建一个 HTML artifact 来说明它。我对 streaming/backpressure 逻辑不太熟，所以重点解释这一块。渲染实际 diff，并在行边加入内联注释，按严重程度给问题着色，同时加入任何有助于理解这个概念的内容。

使用场景：

- 创建 PR
- 审查 PR
- 理解代码中的某个主题

## 设计和原型

Claude Design 基于 HTML，因为 HTML 在设计表达上极其强大，即使你的最终交付界面并不是 HTML。Claude 可以用 HTML 画出设计草图，然后再用你需要的语言实现，比如 React、Swift 等。

你也可以用它来做交互原型，比如动画、动作等。可以考虑让 Claude 制作滑块、旋钮等控件，帮你精确调出想要的效果。

![](imgs/img-004-HH0BXqjboAAHGsw.jpg)

示例提示词：

我想做一个新的 checkout 按钮原型。点击时它要播放一个动画，然后快速变成紫色。创建一个 HTML 文件，里面有多个滑块和选项，让我尝试不同的动画参数，并提供一个复制按钮，用来复制效果好的参数。

适用场景：

- 创建设计系统 artifact
- 调整组件
- 可视化组件库
- 原型化有趣的动画

## 报告、研究和学习

Claude Code 非常擅长综合多个数据源的信息，并把它们转换成便于阅读的报告。你可以提示 Claude 搜索你的 Slack、代码库、git 历史、互联网等，然后让它为你自己、领导或团队生成极易阅读的报告。

你可以把这些内容组织成长篇 HTML 文档、交互式解释器，甚至幻灯片或 deck。可以要求 Claude 使用 SVG 绘图，帮助可视化内容。

例如，在我关于 prompt caching 的帖子中，我让 Claude 读取 git 历史后，为我准备了一份深入研究 prompt caching 相关改动的 HTML 文件。

![](imgs/img-005-HH0Bp86bUAAJDyZ.jpg)

示例提示词：

我不理解我们的 rate limiter 到底是怎么工作的。阅读相关代码，生成一个单页 HTML 解释文档：包含 token bucket 流程图、3 到 4 段带注释的关键代码片段，以及底部的“注意事项”部分。请针对只读一遍的人优化阅读体验。

适用场景：

- 总结某个功能如何工作
- 向我解释一个概念
- 给老板的周报
- 给领导层的事故报告
- SVG 插图、流程图、技术图解等

# 自定义编辑界面

有时候，只靠文本框很难描述你想要什么。这种情况下，我会让 Claude 为我正在处理的这份具体数据，构建一个一次性的编辑器。它不是产品，也不是可复用工具，而是一个为当前这份数据专门制作的单个 HTML 文件。

关键是最后一定要有导出功能：比如“复制为 JSON”或“复制为提示词”按钮，把你在 UI 里做过的操作转回可以粘贴进 Claude Code 的内容。

![](imgs/img-003-HH0FbKebUAAsRPr.jpg)

示例提示词：

- 我需要重新排序这 30 个 Linear tickets。给我做一个 HTML 文件，把每个 ticket 做成可拖拽卡片，放在 Now / Next / Later / Cut 四列里。先按你的最佳判断预排序。加一个“复制为 Markdown”按钮，导出最终排序，并为每个桶附上一句理由。
- 这是我们的 feature flag 配置。为它构建一个表单式编辑器，按领域分组 flags，展示它们之间的依赖关系。如果我启用了某个前置条件未开启的 flag，要给出警告。加一个“复制 diff”按钮，只输出发生变化的 key。
- 我正在调整这个 system prompt。做一个左右分栏编辑器：左边是可编辑 prompt，并高亮变量槽位；右边是三个样例输入，可以实时重新渲染填充后的模板。加上字符/token 计数器和复制按钮。

适用场景：

- 对任何东西重新排序、分诊或分桶，比如 tickets、测试用例、反馈
- 编辑结构化配置，比如 feature flags、环境变量、带约束的 JSON/YAML
- 调整 prompt、模板或文案，并提供实时预览
- 筛选数据集、批准/拒绝行、标注样例，并导出选择结果
- 标注文档、转录稿或 diff，并导出这些标注
- 选择那些很难用文字表达的值，比如颜色、缓动曲线、裁剪区域、cron 调度、正则表达式

## 常见问题

我已经向很多人介绍过我为什么转向 HTML，也看到了一些反复出现的问题。

这不是更浪费 token 吗？

Markdown 往往确实使用更少 token，但我发现 HTML 增加的表达能力，以及它让我更可能真正阅读内容，整体上会带来更好的输出。在 Opus 4.7 的 1MM 上下文窗口里，增加的 token 用量在上下文窗口中并不明显。

那你现在什么时候还用 Markdown？

老实说，我几乎已经不再用 Markdown 做任何事情了，但我可能已经相当接近 HTML 极大主义者。

我该如何查看 HTML 文件？

我通常直接在本地浏览器里打开它，你也可以让 Claude 帮你打开；如果想分享链接，也可以上传到 S3。

这不会比生成 Markdown 更慢吗？

确实会更慢。HTML 可能比 Markdown 慢 2 到 4 倍，但我发现结果值得。

版本控制怎么办？

这确实是 HTML 最大的缺点之一。相比 Markdown，HTML diff 很嘈杂，也很难审查。

我怎么让 Claude 符合我的审美，或者不要把页面做得难看？

frontend design plugin 能帮助 Claude 做出不错的 HTML 文件。但如果要匹配你们公司自己的风格，可以让 Claude 读取你的代码库，创建一个单独的设计系统 HTML 文件。之后你就可以把这个设计系统文件作为其他 HTML 文件的参考。

## 保持在回路中

上面说了这么多，其实我认为，我使用 HTML 的真正原因是：它让我在使用 Claude 时更有参与感，更能跟上它的思路和进展。

我之前开始有些担心，因为我已经不再深入阅读那些计划了，这可能意味着我只能放任 Claude 自己做决定。

但让我高兴的是，实际情况恰恰相反：在使用 HTML 的时候，我比以往任何时候都更有参与感，也更能掌握整个过程。
