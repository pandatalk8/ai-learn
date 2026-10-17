---
title: "LLM 到底是怎么工作的"
original_title: "How LLMs Actually Work"
author: 0xkato
translator: AI
source_url: https://www.0xkato.xyz/how-llms-actually-work
original_html: html/2026-06-06-0xkato-how-llms-actually-work.html
published: 2026-06-01
captured: 2026-06-17
type: clip
lang: zh-CN
tags: [machine-learning, transformers, llm, neural-networks, ai]
---

# LLM 到底是怎么工作的

**作者：0xkato**  
**发布日期：2026-06-01**  
**预计阅读时间：26 分钟**

> 说明：本文为 AI 辅助中文翻译稿，用于个人知识库阅读与复核。正式引用和技术细节核对请以英文原文为准：<https://www.0xkato.xyz/how-llms-actually-work>。

这篇文章会带你走一遍 LLM 的工作方式。现代 LLM 大多是把 transformer block 一层又一层地堆叠起来，所以只要理解 transformer 的内部机制，就已经理解了大部分关键内容。

我会介绍现代基于 Transformer 的 LLM 内部的核心机制，但不会陷入那些黏糊糊的数学细节。别误会，你应该学数学，但这篇文章可以作为入门。

多数现代 LLM 共享同一种 Transformer 家族的骨架。差异来自训练数据、规模和配置选择，以及在基础模型之上的后训练。读完之后，你应该能看懂许多现代 LLM 论文或模型卡，并知道每一节说的是架构里的哪一部分。

路线如下：

1. Token：一串文本如何变成一串整数
2. Embedding：这些整数如何获得意义
3. 位置编码：模型如何知道 token 的顺序
4. Attention：token 如何彼此交换信息
5. 多头注意力：模型如何同时追踪多种关系
6. 前馈网络：模型中很大一部分已存储结构所在的位置
7. 残差流和层归一化：深层堆叠为何能够训练
8. 预测下一个 token：模型实际输出什么，以及生成循环如何工作
9. 架构与训练后的权重：现代 LLM 有哪些部分大体相同，哪些部分不同

![从 tokenization 到 next-token prediction 的 Transformer 流程](imgs/2026-06-01-0xkato-how-llms-actually-work-transformer-pipeline.png)

文中会穿插一些“小解释”，让不同背景的读者都能跟上。

---

## Tokenization

模型并不直接阅读文本。它们读取的是整数 ID。把你的 prompt 转换成这些整数序列的步骤，就是模型处理文本的入口。

这个转换步骤叫做 tokenization。Tokenizer 会接收一个字符串，并输出一串整数，其中每个整数都指向固定词表中的一个条目。现代 LLM 的词表通常包含数万到数十万个条目。

> **小解释：token ID**  
> Token ID 是模型用来表示某个词表条目的整数。模型处理的是这个数字，而不是书写出来的词本身。

Token 通常不是完整单词，而是子词片段。比如 “tokenization” 可能会被拆成 `["token", "ization"]`，“running” 可能会被拆成 `["run", "ning"]`。原因是效率。整词词表太大，也很难泛化到新词。字符级词表又太小，会迫使模型从头学习最简单的模式。子词 tokenization 处在二者之间。最常见的片段会成为单个 token，罕见词或新词则由更小的片段组合而成。

> **小解释：词表**  
> 词表是 tokenizer 的固定片段列表。每个片段都有一个 ID，模型只能直接接收来自这个列表的 ID。

这种取舍会在很多意想不到的地方表现出来。经典例子是：问 LLM “strawberry” 里有几个 R。过去 LLM 经常答错。这并不是模型不会数数，而是模型并不直接在字母上工作。它看到的只是恰好拼出了一个人类会按字母拆分的单词的 token ID。

![Tokenization 将文本转换为 token ID](imgs/2026-06-01-0xkato-how-llms-actually-work-transformer-tokenization.png)

不同模型家族使用不同的 tokenizer。GPT 模型使用 Byte Pair Encoding 的变体。SentencePiece 常见于 LLaMA 风格的模型。选择哪种 tokenizer 会影响计算量，也就是更少的 token 意味着更少的工作，也会影响多语言覆盖等问题。但基本形态相同：文本输入，整数输出。

现在 prompt 已经变成一串整数，下一步就是给这些整数赋予意义。

---

## Embeddings

像 `1024` 这样的 token ID 只是一个行号。它本身没有任何意义。真正赋予它意义的是一张巨大的表，叫做 embedding matrix。

每个模型都有这样一张表。词表中的每个条目对应一行，每一行都是一个很长的数字向量。每一行的长度就是模型的 hidden size。在很多 7B 级别的模型中，这意味着每个 token 有 4,096 个数字。更大的模型通常使用更宽的向量。

> **小解释：向量**  
> 向量是一串数字。在 Transformer 中，每个 token 都会变成一个向量，这样模型才能对它做数学运算。

当 tokenizer 把一个整数交给模型时，模型会查找对应的行，并改用这行向量。这个向量就是该 token 的 embedding。它是模型对这个 token “含义”的表示，是在训练过程中学出来的。

> **小解释：embedding matrix**  
> Embedding matrix 是一张查找表。输入 token ID，输出学习得到的向量。

这些 embedding 有一个有趣的性质：语义相近的 token 最终会拥有相近的向量。“king”的向量在空间中会接近“queen”的向量，“Paris”的向量会接近“France”。这些都不是硬编码的。它们是在大量文本训练中涌现出来的。模型之所以学到这些位置，是因为这样有助于更好地预测文本。

你可以对 embedding 做算术，而且有时真的有效。著名例子是 `king - man + woman ≈ queen`。Embedding 空间的几何结构承载了真实的语义结构，虽然没有人明确告诉模型应该这样构建它。

![带有语义关系的 embedding 空间类比](imgs/2026-06-01-0xkato-how-llms-actually-work-transformer-embedding-analogy.png)

这里需要说清楚：到这个阶段，每个 token 都已经被替换成了它的 embedding，但 embedding 本身并不说明这个 token 在序列中的位置。“dog”的向量无论出现在 prompt 的第一个词还是第五个词，都是同一个向量。这就是问题所在。

位置编码填补的正是这个缺口。

---

## 位置编码

普通的 self-attention 并不内置词序表示。如果没有某种位置信号，它无法直接知道 “dog” 是出现在 “bites” 之前还是之后。

词序会改变含义。所以模型需要另一个组件。它需要一种方式，把每个 token 的位置注入到数学计算里。

> **小解释：位置编码**  
> 位置编码是模型获得顺序信息的方式。它告诉模型每个 token 位于序列中的什么位置。

原始 Transformer 论文，也就是 Vaswani 等人在 2017 年的论文，是通过给每个位置分配一组数字模式，并在任何其他处理之前，把它直接加到每个 token 的 embedding 上来实现这一点的。位置 1 有一种模式，位置 5 有另一种模式，位置 100 又有另一种模式。这些模式来自不同频率的正弦和余弦波。这样一来，位置 1 的 “dog” 的 embedding 就不同于位置 5 的 “dog”，只是因为加进去的位置模式不同。

这确实有效。选择正弦位置编码的部分原因，是它可以外推到训练期间没有见过的序列长度之外。但随着模型规模变大，加法式位置方案出现了两个重要问题。

第一，embedding 必须在同一组数字中同时承载含义和位置。能塞进去的信息毕竟有限。

第二，尤其是学习式的绝对位置 embedding，泛化并不干净。如果模型训练时最多只见过 2,048 个 token 的 prompt，那么它在训练中从未见过位置 5,000，那个位置的 embedding 也就没有以同样方式学到。

现代模型大多使用另一种方案，叫做 Rotary Position Embeddings，也就是 RoPE。它由 Su 等人在 2021 年提出，现在被 LLaMA、Mistral、Gemma、Qwen 以及大多数其他开源权重模型家族使用。直觉是：不要把位置信息加到每个 token 的向量上，而是根据 token 的位置，以不同角度旋转 Query 和 Key 向量。位置 1 的 token 转一个小角度，位置 100 的 token 转一个更大的角度。当两个 token 后续在 attention 中进行比较时，关键是它们的 Query 和 Key 旋转之间的差异，这个差异编码了二者相距多远。

> **小解释：RoPE**  
> RoPE 是 Rotary Position Embeddings 的缩写。它不是添加一个位置向量，而是旋转 Query 和 Key 向量，让相对距离在 attention 中显现出来。

![Rotary position embeddings 根据位置旋转向量](imgs/2026-06-01-0xkato-how-llms-actually-work-transformer-rope.png)

实际优势很明显。RoPE 能自然地编码相对位置，而这更接近 attention 真正需要的东西。它对更长上下文的泛化更好，而且不会给模型增加新参数。

即使有很好的位置编码，现代 LLM 仍然存在一个有文献记录的 “lost in the middle” 问题，Liu 等人在 2023 年对此做过研究。模型更可靠地使用长 prompt 开头和结尾的信息，而不那么可靠地使用埋在中间的信息。这就是为什么“把重要上下文放在前面”或“在结尾重复关键信息”这类 prompt engineering 建议真的有帮助。模型并不是同等有效地使用 prompt 的每一部分。

当 token 的含义和位置都被编码之后，下一问题就是：token 之间到底如何交换信息？

---

## Attention

这就是给整个架构命名的机制。Attention。

在每一个 Transformer layer 里，attention 只做一件事：让每个 token 查看它被允许查看的其他 token，并决定哪些 token 对接下来要发生的事情重要。

它通过让每个 token 同时扮演三种角色来做到这一点。每个 token 会被转换成三个新向量，分别叫做 Query、Key 和 Value，也就是 Q、K、V。

> **小解释：Q、K、V**  
> Query 表示“我在寻找什么”，Key 表示“我能匹配什么”，Value 是在匹配强烈时被复制过去的信息。

- Query 问：“我想从其他 token 那里找什么？”
- Key 说：“这是我提供给查看我的 token 的东西。”
- Value 携带：“当匹配发生时，这就是被传递过去的信息。”

同一个 token 同时扮演这三种角色。Q、K、V 转换都是学习得到的矩阵，所以模型会在训练中弄清楚每个 token 应该寻找什么、应该提供什么。

匹配通过相似度分数发生。每个 token 的 Query 会与它允许看到的每个 token 的 Key 进行比较，使用的是缩放点积。直觉上，这衡量两个向量有多对齐。缩放操作则是在 softmax 之前让数值保持稳定。

> **小解释：点积**  
> 点积是一种给两个向量对齐程度打分的简单方式。对齐程度越高，匹配越强。

然后，匹配分数会通过 softmax 变成权重。Softmax 会把任意一组数字转换成类似概率的分布，总和为 1。匹配分数更高的 token 会得到更高权重，然后这些权重会用于对 value 向量做加权平均。

> **小解释：softmax**  
> Softmax 会把原始分数转换成总和为 1 的权重。大分数得到大权重，小分数得到小权重。

举个例子。考虑句子 “The cat that I saw yesterday was sleeping.” 当模型处理 “was” 时，它需要弄清楚是谁在 sleeping。“was”的 Query 向量会与它允许看到的 token 的 Key 向量进行比较。它与 “cat” 的点积很高，因为模型学到过像 “was” 这样的动词需要主语，而像 “cat” 这样的主语会产生能与之很好对齐的 Key 向量。它与 “yesterday” 的点积较低。Softmax 把这些分数变成权重，“cat” 获得高权重，“yesterday” 获得低权重。然后模型对相应的 value 向量做加权求和，因此 “cat” 的 value 主导了结果。“was”的新表示现在主要由 “cat” 的 value 塑造。这就是多个位置之前的 token 如何成为指代对象。

GPT 风格语言模型还有一个特定约束：它们从左到右生成文本。位置 5 的 token 只允许 attend 到位置 1 到 5。它不能 attend 到位置 6、7、8，因为那些 token 还没有生成。这叫做 causal masking。实现很简单：未来 token 的匹配分数会被设得极低，以至于经过 softmax 后权重实际上为零。

> **小解释：causal masking**  
> Causal masking 会隐藏未来 token。它防止 decoder-only 语言模型在预测下一个 token 时偷看后文。

![显示 causal masking 以及对 cat 高 attention 的 attention heatmap](imgs/2026-06-01-0xkato-how-llms-actually-work-transformer-attention-heatmap.png)

可解释性研究中一个很有意思的发现，是一种叫做 induction heads 的专门化 attention head。Anthropic 在 2022 年发现了它们。这些 head 会学习识别 prompt 中形如 “A B ... A” 的模式，并预测接下来应该是 B。当模型第二次看到 “A” 时，induction head 会回看 “A” 第一次出现的位置，查看它后面跟着什么，然后复制那个内容。它们是目前已知最清楚的 in-context learning 机制之一，也就是 LLM 从你的 prompt 中捕捉模式并继续下去的能力。

> **小解释：induction head**  
> Induction head 是一种注意力头，它会注意到 prompt 中重复出现的模式，并帮助继续这些模式。

Attention 有一个很大的成本。在 full attention 中，每个 token 都会与它允许看到的所有 token 比较，所以 prompt 长度翻倍，工作量大约会变成四倍。这就是为什么长 prompt 运行成本很高，也解释了为什么很多近期研究都在关注如何让 attention 更高效，比如 FlashAttention、sparse attention 和 linear attention。

但一个 attention head 只给了模型一种学习得到的关系视角。

---

## 多头注意力

一次 attention pass 只给模型一种方式，用来判断哪些 token 对其他 token 重要。这还不够。语言中有很多关系同时发生。主谓一致。代词和它指代的名字。句子之间的长程引用。词序和局部短语。

多头注意力通过并行运行多次 attention 来解决这个问题，每个并行 pass 都在自己的较小空间里运行。每个并行 pass 称为一个 head。

> **小解释：attention head**  
> Attention head 是一次独立的 attention pass，拥有自己学习得到的投影。

这里有一个经常被讲错的地方，很多教程也会讲错。每个 head 并不是拿到原始 token 向量的一个字面切片。每个 head 都有自己学习得到的投影矩阵，把完整 token 向量映射成自己更小的 Q、K、V 向量。所以如果一个模型每个 token 有 4,096 个数字、32 个 head，那么每个 head 通常在 128 维空间里工作，但这 128 个数字是从完整 4,096 维学习投影出来的，不是固定切片。它们是同一个 token 的不同“视角”，不是它的不同块。

每个 head 独立运行自己的 attention pass。然后所有 head 的输出会被拼接起来，再经过最后一个线性层，把它们混合回一个完整大小的向量。这个最终混合也是模型学出来的。

![多头注意力组合专门化的 attention heads](imgs/2026-06-01-0xkato-how-llms-actually-work-transformer-multi-head-attention.png)

有意思的是，不同 head 往往会部分专门化。模型从未被告知每个 head 应该做什么。专门化是在训练中自然涌现的。研究者发现过追踪语法的 head，比如把动词连接到宾语、把冠词连接到名词；也发现过判断代词指向哪个名字的 head、追踪位置模式的 head、induction heads，以及许多其他类型。单个 Transformer layer 可能有 32 个 head。现代 frontier model 有几十层。所以一个典型 LLM 总共会有数千个 attention head，每个都加入自己的学习视角。

一个实际的成本问题推动了近年的架构变化。每个 head 都需要把已经生成的所有 token 的 Key 和 Value 向量保存在内存中，这样生成新 token 时模型就不必从头重新计算一切。这叫做 KV cache，也是长上下文运行 LLM 时主要的内存成本。

> **小解释：KV cache**  
> KV cache 会在生成过程中保存旧的 Key 和 Value 向量。它让模型不必每增加一个 token 就重新计算整个 prompt。

现代 decoder-only LLM 大多使用一种叫做 Grouped-Query Attention，也就是 GQA 的变体。它不是让每个 head 都有自己的 key 和 value，而是让多组 head 共享同一组 key/value heads。LLaMA-2 70B 有 64 个 query heads，但只有 8 个 key/value heads。Mistral 7B 有 32 个 query heads 和 8 个 key/value heads。结果是准确率几乎接近完整多头注意力，但内存压力和推理成本低得多。

> **小解释：GQA**  
> Grouped-Query Attention 让多个 query heads 共享更少的 key/value heads。这样能降低 KV-cache 内存，同时保留许多 query 视角。

---

## 前馈网络

Attention 完成 token 之间的信息混合之后，每一层还有第二步。这个部分很少被同样多地讨论，它就是前馈网络。

如果说 attention 关心的是 token 之间彼此交谈，那么前馈网络关心的是每个 token 单独做更多处理。它独立运行在每个 token 的向量上，不发生跨 token 混合。

前馈网络按顺序做三件事：

1. 把 token 的向量扩展到更大的尺寸，原始 Transformer 使用 4 倍扩展，而现代 SwiGLU 模型常常使用不同的扩展尺寸。
2. 应用一个非线性函数。
3. 把向量压缩回原始尺寸。

![前馈网络扩展、转换并压缩每个 token 向量](imgs/2026-06-01-0xkato-how-llms-actually-work-transformer-ffn.png)

中间那个非线性步骤在做一件很值得理解的事情。非线性是一个会弯曲输入的函数。最简单的 ReLU 会对任何负数输出 0，对正数则原样通过。

> **小解释：非线性**  
> 非线性函数会防止网络坍缩成一个巨大的线性变换。

如果没有它，FFN 就只是两个线性层叠在一起，而纯线性数学的堆叠会坍缩。连续两个线性层在数学上等价于一个线性层，连续一百个线性层仍然等价于一个线性层。非线性阻止了这种坍缩，也是 FFN 能做出比单次矩阵乘法更丰富事情的原因。

原始 Transformer 使用 ReLU。GPT 和 BERT 转向 GELU。LLaMA、Mistral、PaLM 等现代模型使用 SwiGLU。扩展再压缩的结构保留了下来，被持续迭代的是非线性本身。

在 dense Transformer 模型中，大多数参数位于 FFN，而不是 attention。很大一部分权重都在前馈层里。

而且这些参数并不是泛泛而谈的。模型所存储的事实和语义结构，有很大一部分就在这里。研究者发现，FFN 内部的一些 neuron 与特定概念或事实强相关。一个 neuron 可能会在埃菲尔铁塔相关文本上强烈激活。另一个可能会在编程语言上激活。另一个可能会在过去式动词上激活。当一个模型“知道”巴黎是法国首都时，这个事实会跨 FFN 权重和特定层中的 activation 被表示出来。

这种存储记忆的性质带来了一个有趣结果。研究者已经找到方法，可以不重新训练模型，而直接编辑训练后模型中的某些事实。ROME，也就是 Rank-One Model Editing 这类方法，可以通过对特定 FFN 权重矩阵做有针对性的低秩编辑，把“埃菲尔铁塔在巴黎”改成“埃菲尔铁塔在罗马”。之后模型往往会生成与被编辑关联一致的文本。

一些现代 frontier model 已经开始用 Mixture of Experts，也就是 MoE，替换 dense FFN。它不是每层只有一个前馈网络，而是有许多并行 FFN，也就是 experts，以及一个很小的 router network，用来选择哪些 experts 处理每个 token。Mixtral 8x7B 每层有 8 个 experts；任意一个 token 只激活其中 2 个。总参数量显著上升，但每个 token 的计算量增长慢得多，因为只有少数 experts 会运行。这就是在不按比例提高推理成本的情况下扩展参数量的方法。

> **小解释：MoE**  
> Mixture of Experts 表示模型拥有多个前馈网络，并且每个 token 只被路由到其中少数几个网络。

Mixtral 8x7B 总参数量是 46.7B，但每个 token 大约只使用 12.9B 参数。这已经成为超大模型的常见选择，因为它让你可以继续提高参数量，而不让推理成本按同样比例增长。

---

## 残差流和层归一化

残差流让模型变成“累加式”，而不是“替换式”。Attention 运行之后，或者前馈网络运行之后，结果通常不会替换 token 的向量。它会被加回去。逐位置相加。新向量等于旧向量加上这个子块的输出。

> **小解释：残差连接**  
> 残差连接会把一个 block 的输出加回它起始时的向量。它为信息和梯度提供了一条穿过网络的捷径。

经过三十层、五十层或一百层之后，每一层的贡献是在累积，而不是简单覆盖前一个向量。这个运行中的总和叫做残差流，而且它有一个奇特性质：原始输入 embedding 仍然有一条直接的加法路径通向后期层，同时一路上又与每个子块的贡献混合在一起。

![残差流累积 attention 和前馈输出](imgs/2026-06-01-0xkato-how-llms-actually-work-transformer-residual-stream.png)

残差连接并不是为 Transformer 发明的。它来自 He 等人在 2015 年提出的 ResNet，最初用于图像识别。动机是深层网络很难训练。训练信号在反向穿过很多层时会变得太弱，有时也会变得太强。模型实际上无法从自己的错误中学习。加入捷径路径之后，信号可以从输出直接流回输入。突然之间，几百层的网络也能训练了。Transformer 继承了这个技巧。

在现代可解释性研究中，残差流已经成为中心对象。每个组件、每个 attention head、每个前馈网络，甚至最后的 unembedding 步骤，都会从残差流中读取，并写回残差流。

第二个组件是层归一化，它存在的原因更实际。如果没有它，残差流就无法保持稳定。数字经过几十次加法后，往往会向上爆炸，或者向零坍缩。不管哪种情况，训练都会失败。层归一化会在子块之间把每个 token 的向量重新缩放回受控范围。

> **小解释：层归一化**  
> 层归一化会重新缩放 token 向量，让它的数字在模型训练时保持在稳定范围内。

原始 2017 Transformer 在每个子块之后应用归一化，也就是 post-norm。这对浅层模型有效，但随着深度增加，可靠训练会变得更困难。现代 Transformer，从 GPT-2 往后，以及 LLaMA、Mistral，通常在每个子块之前应用归一化，也就是 pre-norm。这是让很深的 Transformer 更容易训练的变化之一。

函数本身也发生了变化。许多现代开源模型，比如 LLaMA、Mistral、Gemma、Phi，使用一种更简单的变体，叫做 RMSNorm。原始层归一化同时做两件事：先把每个向量平移到接近零，再重新缩放数字的大小。RMSNorm 去掉了平移步骤，只保留重新缩放。经验上，重新缩放提供了大部分收益，同时计算更便宜。

> **小解释：RMSNorm**  
> RMSNorm 是一种更便宜的归一化方法。它会重新缩放向量大小，但不会先减去均值。

这就是那些不太光鲜的机械结构。没有残差连接，很深的模型会更难训练。没有层归一化，运行中的总和可能爆炸或坍缩。有了二者，就能得到几百层深的模型。

---

## 下一个 token 预测

当所有 attention 和前馈处理层都完成后，模型会为序列中的每个 token 得到一个向量。在生成过程中，为了预测下一个词，它只取最后一个 token 的最终向量。

这个最后向量会被转换成每个可能的下一个 token 对应的一个数字。如果词表有 100,000 个 token，那就是 100,000 个数字。这些数字叫做 logits。它们还不是概率。它们可以是任意大小，可以为正，也可以为负。

> **小解释：logits**  
> Logits 是每个可能下一个 token 的原始分数。只有经过 softmax 之后，它们才会变成概率。

Softmax 会把这些 logits 转换成模型对可能下一个 token 的概率分布。这和前面是同一个操作，只是发生在模型中的不同位置。

模型通常不会每次都直接选择概率最高的 token。解码设置会控制输出有多确定或多多样。Temperature 会改变分布的尖锐程度。Top-k 和 top-p 会把选择限制在最可信的下一个 token 范围内。这就是为什么同一个模型在一种设置下感觉很精确，在另一种设置下感觉更有创造力。

> **小解释：temperature**  
> Temperature 控制采样过程中的随机性。低 temperature 让模型更保守；高 temperature 让模型更多样。

一旦选中一个 token，它就会被加入输入。模型在更长的序列上运行下一步，通常会复用 KV cache，这样就不必从头重新计算整个前缀。新 token 的新 attention。新的前馈。新的最终向量。新的预测。循环持续进行，直到模型输出 end-of-sequence token，或者达到长度限制。整段文字只是这个循环一次一个 token 运行出来的结果。

这个单一目标，也就是预测下一个 token，是基础 LLM 的核心训练信号。基础模型并不是直接针对事实准确性、对话能力、推理或代码能力训练的。它是在海量文本上被训练来预测下一个 token。后续 post-training 才会进一步调整模型，让它更会遵循指令、更符合偏好、更安全，也更像对话助手。

还有一个值得了解的重要效率创新，叫做 speculative decoding。一个小而快的模型先向前提出几个 token 的草稿。大模型并行验证这些 token。如果候选 token 在大模型概率下被接受，就接受它们。如果没有，就退回大模型。做得正确时，输出分布会与单独运行大模型相匹配，但循环可以快得多。

> **小解释：speculative decoding**  
> Speculative decoding 使用一个小的 draft model 向前猜测，然后让更大的模型一次验证多个猜测 token。

下一个 token 预测循环是整个架构里最简单的部分，但正是它让整体工作起来。

---

## 架构与训练后的权重

我们已经走过核心机制：token、embedding、位置编码、attention、多头注意力、前馈网络、残差流和归一化，以及输出侧的下一个 token 循环。这就是基本架构的一次总览。

那么 GPT、Claude、Gemini 和 LLaMA 之间到底有什么不同？公开细节各不相同，闭源模型也不会公布每一项架构选择。但在本文讨论的层级上，它们大体都位于同一个 Transformer 家族设计空间里。

多数现代基于 Transformer 的 LLM 使用同样的大结构：tokenization、embedding、位置编码、堆叠的 Transformer layers，每层包含多头注意力和前馈网络、残差流、层归一化，以及下一个 token 预测。

模型之间变化的是：

1. 训练后的权重本身，它们来自不同规模上的不同训练数据。
2. 配置：层数、词表大小、head 数量、参数量、MoE 或 dense。
3. 后训练：指令微调、从人类反馈中学习、施加在基础模型之上的安全控制。

> **小解释：权重**  
> 权重是模型内部学习得到的数字。训练会改变这些数字，直到模型能够很好地预测文本。

2023 到 2025 年的“现代 Transformer”栈，在许多严肃的 frontier model 和开源权重模型之间收敛到了一组常见选择，尽管不同团队是独立走到这些选择上的。Pre-norm 位置。RMSNorm。RoPE。SwiGLU。Grouped-Query Attention。某些最大模型中的 Mixture of Experts。这些不是一次性被发明出来的。它们是在 2017 年原始设计基础上，经过大约五年改进逐渐累积起来的。

---

## 接下来会怎样

围绕 Transformer 家族架构的这种收敛，在机器学习历史上并不寻常。在这个领域的大部分历史中，每类问题都有自己的专用网络。图像识别用一种。语言用另一种。音频用第三种。视觉团队和语言团队几乎不共享方法。

现在，Transformer 风格的模型出现在语言、视觉、音频和多模态系统中。Transformer 吸收了这个领域的很大一部分。

这种情况可能会改变。Mamba 和其他 state-space models 是可信的替代方案，尤其适合非常长的序列。混合架构正在被探索。Mixture-of-experts 已经改变了 frontier 上“架构”的含义，这种变化在五年前还会被认为很异类。

但本文中的核心机制，也就是 token、embedding、位置编码、attention、前馈网络、残差流和归一化，以及下一个 token 预测，是更持久的部分。即使架构发生变化，这些仍然是任何序列模型都必须以某种形式解决的问题。

如果你已经读到这里，你就可以阅读许多现代 Transformer 论文或模型卡，并知道每一节在讨论哪个组件。这就是目标。

作者非常欢迎反馈。如果你对这些内容感兴趣，可以在 X 上联系作者。作者很喜欢结交新朋友。

## 相关链接

- 原文：<https://www.0xkato.xyz/how-llms-actually-work>
- 作者 X：<https://x.com/0xkato>
- 站点上一篇文章：[The Next Jump](https://0xkato.xyz/the-next-jump/)
