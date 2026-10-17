---
title: "更好的模型，更糟的工具"
original_title: "Better Models: Worse Tools"
author: Armin Ronacher
source_url: https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools/
source_markdown_url: https://lucumr.pocoo.org/2026/7/4/better-models-worse-tools.md
source_platform: personal blog
published: 2026-07-04
captured: 2026-07-05
type: web-clip
lang: zh-CN
status: full-text-translation
translation_of: sources/clips/2026-07-04-armin-ronacher-better-models-worse-tools.md
description: "关于新版 Claude 模型中一个令人恼火的工具调用退化问题。"
license: "CC BY-NC 4.0"
tags: [ai, llm, tool-calling, coding-agents, claude-code, constrained-decoding, pi]
---

# 更好的模型，更糟的工具

过去两天，一个非常奇怪的 [Pi issue](https://github.com/earendil-works/pi/issues/6278) 让我一路钻进了兔子洞。简短来说，新版 Claude 模型有时会在调用 Pi 的编辑工具时，在嵌套的 `edits[]` 数组里带上额外的、凭空编造出来的字段。而且这不是 Haiku 或某个小模型的问题，而是 Opus 4.8。编辑内容本身通常是正确的，但参数不符合 schema，因为模型编出了不存在的键，于是 Pi 拒绝这次工具调用，并要求模型重试。

模型偶尔输出格式错误的工具调用，这件事本身并不太意外。尤其是小模型。让我惊讶的是，这个问题在新版 Anthropic 模型上变得更严重了：Opus 4.8 和 Sonnet 5 都会出现，但旧模型没有。换句话说，这个模型家族里当前 SOTA 的模型，在这个特定工具 schema 上反而比它们的旧兄弟更差。

如果你好奇 Fable：我有意没有测试它，因为我不确定他们正在运行的分类器会不会悄悄把我降级到 Opus。

## 工具调用就是文本

如果你没有花太多时间研究 LLM 工具调用的内部机制，需要理解的关键点是：工具调用并不神奇，它使用的是相当粗糙的带内信号。模型收到一段对话记录、一个系统提示词，以及一组可用工具。服务器把这些内容揉成一个带特殊标记 token 的大提示词。因为模型在这种格式的样例上训练并强化过，所以在生成过程中的某个时刻，它会输出某种 API 或客户端解释为“用这些参数调用这个工具”的东西。

对于一个文件编辑工具，预期的调用 payload 可能大致像这样：

```json
{
  "path": "some/file.py",
  "edits": [
    {
      "oldText": "text to replace",
      "newText": "replacement text"
    }
  ]
}
```

然后，一个 harness 会验证参数、执行编辑，并把结果反馈给模型。如果验证失败，模型会看到错误，通常会再试一次。

Anthropic 模型具体如何格式化这类调用，我们并不知道。不过有人曾经弄出过 “ANTML” 标记，而且它们有时也会泄漏到公开通信中。据我所知，上面的调用从模型那里序列化出来大概会是这样：

```xml
<antml:function_calls>
  <antml:invoke name="edit">
    <antml:parameter name="path">some/file.py</antml:parameter>
    <antml:parameter name="edits">
[
  {
    "oldText": "text to replace",
    "newText": "replacement text"
  }
]
    </antml:parameter>
  </antml:invoke>
</antml:function_calls>
```

这里有一点很重要：这个东西虽然看起来像 XML，但其实并不是真正的 XML。它只是他们觉得方便 tokenize 和训练的一种格式。另一点也很重要：一个基本的顶层字符串参数以内联形式出现，而对象数组则通过 JSON 序列化实现。我并不是 *完全确定* 它就是这样工作的，但有一些迹象表明这和真实情况相差不远。后面会用到这一点。

让模型生成这种结构，大体有两种非常不同的方法：

1. 你可以*要求*模型生成匹配某个 schema 的合法 JSON，然后事后验证。
2. 你可以约束采样器，让非法 JSON，甚至非法的 schema 形状，一开始就不可能被采样出来。

第二种方法通常被称为 grammar-aware decoding 或 constrained decoding。采样器会屏蔽违反语法的 token。如果模型当前位于一个 JSON 对象内部，而 schema 说只允许 `oldText` 和 `newText`，采样器就可以阻止它输出 `"in_file"` 或 `"type"`。Grammar-aware decoding 既可以用来把输出约束为语法合法的 JSON，也可以用来强制特定的枚举值或键。

如果没有任何形式的约束，模型只是在遵循一种学到的惯例。

## 失败模式

Pi 的编辑工具支持在一次调用里执行多个精确字符串替换。这就是为什么参数里有一个 `edits` 数组。在失败案例中，模型会生成这样的条目：

```json
{
  "oldText": "...",
  "newText": "...",
  "requireUnique": true
}
```

或者这样：

```json
{
  "oldText": "...",
  "newText": "...",
  "oldText2": "",
  "newText2": ""
}
```

在反复试验中，我看到了整整一园子编造出来的尾部键：`type`、`id`、`kind`、`unique`、`requireUnique`、`matchCase`、`in_file`、`forceMatchCount`、`children`、`notes`、`cost`、`oldText2`、`newText2`、`oldText_2`、`newText_2`，甚至还有一个出现在编辑对象内部的 `event.0.additionalProperties` 键。

最烦人的是，在我检查过的无效调用里，实际的 `oldText` 和 `newText` payload 在字节层面是正确的。模型实际上已经生成了正确的调用，但随后在对象末尾加上了胡言乱语。

这个失败还高度依赖上下文。像“edit this file”这样的全新单轮提示，在我这里完全无法复现它。但在一段 agentic 历史中，如果模型已经读过文件、诊断过问题，然后组合了一个多行编辑，就可能复现它。更烦的是，并不是所有 transcript 都会表现出这种行为。事实上，我需要 [Petr Baudis](https://github.com/pasky) 的 transcript 才能在我这里复现！在那位用户的 session 中，继续这个 session 会让 Opus 4.8 大约 20% 的时间失败。从历史中剥离 thinking blocks 后，失败率降低了一半。开启严格工具调用后，在我的运行中这个问题消失了。

## 为什么它变得更糟

我最强的假设是：这不是随机退化，而是训练产物。

旧版 Anthropic 模型训练时，它们确实是在一些工具上训练过的，其中有些工具还有文档。但那时的训练还没有一个像 Claude Code 这样由用户实际使用的 harness 作为显然的目标。现代 Anthropic 模型很可能不同，因为它们的后训练包含 Claude Code，或者某个看起来非常相似的 harness。模型学会了在那个环境里，成功的工具调用长什么样。它也学会了那个环境会容忍哪些错误。

Claude Code 自己的工具相对扁平。普通编辑工具不是 Pi 这种嵌套的 `edits[]` 形状，而更接近 `file_path`、`old_string`、`new_string`，再加一个可选标志（`replace_all`）。看看 Claude Code 的客户端很有启发：它包含针对格式错误工具使用的重试路径、参数别名、类型强制转换、Unicode 修复，以及未知键过滤。换句话说，Anthropic 自己的客户端似乎预期并接受相当多的松散输入，而且大多会静默修复。

如果强化学习发生在这样的 harness 中，或者发生在它的模拟环境中，那么轻微格式错误的工具调用仍然可以完成任务并获得奖励。harness 完全吸收了错误，于是几乎没有梯度去反对模型编造别名、添加游离字段，或者使用相近的参数名。

更糟的是，模型可能会非常强地适应 canonical 的 Claude Code 编辑工具形状。另一个 harness 可以提供一个语义意图相同、但 schema 不同的工具。这样的工具可能越来越偏离分布。训练得更好的模型反而可能更强烈地和你对抗，因为它的先验更强。

这并不太令人意外，但和几个月前相比是一个变化。Opus 4.5 刚发布时，它对其他编辑工具的适应非常好。事实上，我当时相当确信我们正走在一条不错的路上：只要指令写得好，模型更有可能适应任何碰到的工具形状。

现在我有点担心我们正在走的方向。替代性的工具 schema 可能不只是陌生。它们可能会被针对某个特定、宽容的工具生态优化的后训练隐式惩罚。而这个生态没有文档。虽然有一个有文档的 [text editor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool)，但你会看到 Claude Code 实际上并不遵循这种格式。Claude Code 内部做了什么，也就是这个闭源 harness 做了什么，对你是隐藏的。

## 松散的 harness

Claude Code 显然是闭源的，但我们可以查看压缩后的代码，对它做了什么有一些了解。老实说，它对输入数据非常宽容。

首先，Claude Code 会检查模型可见文本中是否泄漏了 `<invoke` 标记。发生这种情况时，它还会发出一些 telemetry，然后用自己的状态机把错误推回给模型，让模型重试这类坏调用。

它有明确的 Unicode escape 修复逻辑，可以修复字符串值中损坏的 `\uXXXX` 序列和孤立 surrogate。它还为参数提供每个工具自己的别名。例如，`Edit` 接受 `old_str`（大概来自模型曾经在官方文档里的 text editor tool 上训练过的时期）、schema 中较新的 `old_string`、`new_str`/`new_string`、作为 `file_path` 别名的 `path`，以及更多别名。

它还会静默过滤意外的键，而且它也不使用 `strict` 模式。`strict` 模式的问题是，Anthropic 会对工具定义施加复杂度限制，导致 API 请求失败，所以这大概就是 Claude Code 没有尝试使用它的原因。

## 严格性

这个问题也会出现在其他 harness 里吗？Anthropic 的一个巨大问题是，模型完全闭源，harness 也是闭源。Codex 模型也是闭源的，但至少 harness 不是。我们还有 [gpt-oss](https://github.com/openai/gpt-oss)，它至少有点意思。这些模型被明确训练为使用 OpenAI 的 [harmony](https://github.com/openai/harmony) 响应格式，而且有大量文档至少告诉我们 OpenAI 的人如何思考这件事。

Harmony 把 channel 和工具调用内容类型变成 prompt format 的一部分。一个函数调用可以像这样：

```text
<|start|>assistant<|channel|>commentary to=functions.get_weather
<|constrain|>json<|message|>{"location":"San Francisco"}<|call|>
```

关键部分是 `<|constrain|>json`。模型可以在带内表达这个消息体是 JSON，而推理栈可以利用这个边界，为工具调用的消息体切换到 JSON-constrained sampling。我猜 Anthropic 的模型里也有一点类似的东西，至少在 `strict` 模式下我会这么想。

harmony 里的这个标记帮助采样器检测什么时候需要按特定语法采样；因为它是 transcript 的一部分，这件事就相当容易做。对于托管的 GPT 模型，还有一个选项，可以为需要遵循类似格式的自定义工具提供 [LARK](https://lark-parser.readthedocs.io/en/latest/grammar.html) grammar。

Anthropic 看起来和这不一样，不过也许不是完全不同。如果对象数组像看起来那样被表示为 JSON，那么模型就必须在工具参数内部写 JSON。很可能确实存在基础的 grammar-constrained sampling，而这也可能部分解释了那些额外的键。对于一个嵌套数组参数，这段 JSON 在一个 tag 内部包含字符串字面量中的转义多行文件内容。那些意外的、编造出来的键，恰好出现在这个任务熵最高的位置：关闭一个长达数百 token、经过转义的 `newText` 字符串之后，模型必须决定接下来是 `}` 还是 `, "..."`。

Opus 4.8 和 Sonnet 5 似乎对编辑工具调用应该是什么样子有强得多的先验，而这个先验看起来就是 Claude Code 的编辑 schema：一个扁平的 old/new 字符串对，再加上可选的 `replace_all` 标志。我的猜测是，Opus 学会了“编辑操作可能有一个额外的可选字段”，但在 Pi 的嵌套 `oldText`/`newText` 形状下，它没有为那个字段训练出一个名字。所以它每次都会现场采样一个看起来合理的名字，这就是为什么失败会产生几十个随机键，而不是一个稳定别名。

既然 Anthropic 的 `strict` 模式看起来能修复这个问题，我推测服务器端会拒绝采样 JSON schema 结构不允许的键。这也能解释为什么开启 strict mode 时，他们会对工具定义复杂度设置限制。

到目前为止，我测试过的 Codex 模型没有表现出这种退化。我测试了所有可用模型，除了我还没有权限访问的 5.6。

## 这对 harness 意味着什么

令人不舒服的教训是：至少在 Anthropic 模型上，工具 schema 并不是中性的。我们喜欢假装 schema 是一个抽象契约，而模型是一个会遵守契约的通用推理器；但对于某些工具来说，情况可能已经不再是这样。

工具 schema 位于某个分布之中。有些形状接近模型在后训练中见过的东西，有些则相距很远。有些形状对提供商隐藏的编码方式来说很容易，比如 ANTML 中的顶层属性；而有些形状要求模型在嵌套数组内部、长多行字符串之后，写出大型转义 JSON 对象。模型可能足够聪明，能够理解 schema，但在压力下仍然不擅长精确采样出那个形状。

如果这种模型行为继续下去，我会想知道这对 harness 有什么影响。显然，你可以在 Anthropic 上开启 `strict` sampling，问题应该就会消失。另一方面，模型有这种行为本身表明了强化学习对它们的影响。如果你想获得最佳模型性能，和那个先验对抗很可能是徒劳的。

眼下的现实是，Claude Code 不是开源的，我们也无法真正知道他们在 RL 环境里做了什么。我们不能假设 Claude-Code 训练出来的行为会干净地迁移到你的工具上，除非你的工具和它非常接近。后训练越是在一个占主导地位的 harness 内发生，其他所有 harness 就越不得不继承它的怪癖。

我过去更怀疑严格 grammar-constrained tool invocation，因为 constrained decoding 可能带来质量折衷。总体上我仍然认为这可能是真的，但这个 bug 显著改变了我的先验。如果最新模型在解决任务方面变得更好，同时在忠实输出另一套工具 schema 方面变得更差，那么 harness 就需要在某个地方提供更强的保证。

如果你想了解更多，或者想讨论这件事，可以阅读 [Pi tracker 上的 issue](https://github.com/earendil-works/pi/issues/6278)。
