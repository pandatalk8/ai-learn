---
title: "2024 年初，大语言模型与编程"
original_title: "LLMs and Programming in the first days of 2024"
author: antirez
translator: AI
source_url: https://antirez.com/news/140
captured: 2026-07-14
translated: 2026-07-14
type: web-clip-translation
lang: zh-CN
status: full-text-translation
tags: [llm, programming, system-programming, gpt-4, code-generation, machine-learning]
---

# 2024 年初，大语言模型与编程

作者：[antirez](https://antirez.com/user/antirez)

原文：[LLMs and Programming in the first days of 2024](https://antirez.com/news/140)

先说明一下，这篇文章并不是要回顾大语言模型的发展。2023 年对人工智能来说是非同寻常的一年，这一点已经很清楚，再重复一遍也没什么意义。相反，我想从一个普通程序员的个人视角，留下这份亲历记录。自 ChatGPT 问世以来，后来又加上在本地运行的大语言模型，我一直在大量使用这项新技术。目的当然是提高写代码的速度，但不只是如此。我也不想把脑力浪费在那些不值得费神的编程细节上：花无数小时查找古怪又乏味的文档；费力学习一套毫无必要地复杂的 API；或者编写马上就能用、几小时后便会丢掉的程序。这些事我都不想做。尤其是如今的 Google 已经变成一片垃圾信息的海洋，想从中捞出几条有用的内容都很费劲。

当然，我并不是编程新手。我完全有能力不借助任何工具写代码，而且经常这样做。渐渐地，我越来越多地用大语言模型编写高层代码，尤其是 Python；写 C 时则用得少得多。回头看自己的使用经历，最让我印象深刻的是：我已经很清楚什么时候该用大语言模型，什么时候用了反而会拖慢速度。我也发现，大语言模型有点像 Wikipedia 和 YouTube 上随处可见的视频课程：它们能帮助那些有意愿、有能力、也有自律精神的人，但对已经掉队的人，帮助非常有限。我担心，至少在初期，它们只会让本来就有优势的人得到更多好处。

不过，我们还是一步一步来说。

## 无所不知，还是鹦鹉学舌？

在机器学习这轮新事物与新进展中，最令人担忧的现象之一，是许多 AI 专家不太愿意承认自己的认知边界。智人发明了神经网络，随后又发明了一个更关键的东西：自动优化神经网络参数的算法。硬件逐渐强大到足以训练越来越大的模型；人们利用待处理数据的统计知识（也就是先验），再经过大量试错、逐步逼近，发现了比其他方案更有效的架构。但说到底，神经网络依然像个黑箱。

既然人们无法解释大语言模型展现出的某些涌现能力，按理说科学家应该更加谨慎。可事实恰恰相反：许多人严重低估了大语言模型，声称它们不过是稍微高级一点的马尔可夫链，最多只能把训练集中见过的内容稍加变化，再吐出来而已。后来证据越来越多，这种“鹦鹉学舌论”几乎被所有人悄悄收了回去。

与此同时，狂热的人群又把现实中根本不存在的超自然能力安到了大语言模型头上。遗憾的是，大语言模型充其量只能在训练数据所表示的空间中做内插——当然，仅仅做到这一点就已经很了不起。现实中，它们的内插能力仍然有限，尽管依旧惊人，而且出乎意料。试想一下，如果今天最大的大语言模型真能在自己见过的全部代码所围成的空间里连续、自由地内插，那会怎样？即使它们无法创造真正的新事物，也足以取代 99% 的程序员。可现实通常没那么夸张。大语言模型确实能写出训练时没有以完全相同形式见过的程序，也表现出一定的组合能力，可以把训练集中以一定频率出现过的不同想法融合起来。但很明显，目前这种能力有着很深的边界：只要任务需要细腻、严密的推理，大语言模型往往就会一败涂地。即便如此，它们仍然是人工智能从诞生至今最伟大的成果。这一点似乎无可否认。

## 很蠢，但什么都知道

没错，大语言模型充其量只能做一些初级推理，而且经常出错，还常常夹杂着对不存在事实的幻觉。但它们掌握的知识极其广泛。在编程领域，以及其他拥有大量优质数据的领域，大语言模型就像一个知道很多事的笨蛋天才。让这样的搭档和你结对编程，体验一定糟透了——当然，对我来说，结对编程通常就已经够糟了。它会不断冒出莫名其妙的想法，你还得不停争执，才能让它照你的方案来。但如果这个博学的傻瓜随时听候差遣，只负责回答你提出的问题，情况就完全不同了。今天的大语言模型无法带我们走出既有知识的边界，但当我们要处理一个不熟悉的话题时，它们常常能把我们从一无所知带到足以独立继续前进的位置。

如果倒退二三十年，它们的编程能力可能没什么吸引力。那时候，你只需要掌握两三门编程语言、经典算法和十来个基础库。剩下的部分由你自己补上：智力、经验和设计能力。只要具备这些要素，你就是专家级程序员，几乎什么都能做。后来，框架、编程语言和各种库迎来了爆炸式增长。很多复杂性完全没有必要，也缺乏正当理由，但现实就是如此。在这样的环境里，一个什么都知道的笨蛋，反而成了极其珍贵的盟友。

举个例子。我做机器学习实验时，至少有一年一直用 Keras。后来因为种种原因，我转向了 PyTorch。我已经知道什么是嵌入、什么是残差网络，但实在不想从头到尾读一遍 PyTorch 文档——学 Keras 时我就是这么干的，那时 ChatGPT 还没出现。有了大语言模型，用 Torch 写 Python 代码就变得非常容易。我只需要想清楚自己要搭建什么模型，然后提出正确的问题。

## 来看几个例子

我说的不是“X 类里用来完成 Y 的方法叫什么？”这种简单问题。如果大语言模型只能做这些事，那些怀疑它的人确实很有道理。更复杂的模型能做到的事精细得多，放在几年前，简直就是魔法。我可以这样告诉 GPT-4：你看，这是我用 PyTorch 实现的神经网络模型，这是我的批次数据。我想调整张量的尺寸，让生成批次的函数与神经网络输入兼容，同时希望数据按这种特定方式表示。你能告诉我该怎样写 reshape 代码吗？GPT-4 会把代码写出来，而我只需要在 Python 命令行里测试张量的维度是不是我需要的、数据布局是否正确。

再举一个例子。前段时间，我需要为几台基于 ESP32 的设备实现一个 BLE 客户端。查了一圈以后，我发现跨平台的蓝牙编程接口基本都没法用。解决办法很简单：直接用 macOS 原生 API，以 Objective-C 编写。于是，我同时面对两个问题：一是学习 Objective-C 那套笨重的 BLE API，里面充满了我认为毫无道理的模式——我是一个极简主义者，这种 API 与我心目中的“优秀设计”完全背道而驰；二是重新想起 Objective-C 该怎么写。我上一次写 Objective-C 程序已经是十年前了，事件循环、内存管理以及许多其他细节早已记不清。

最后写出来的代码在这里。谈不上漂亮，但该做的事都能做，而且我只用了非常短的时间。没有大语言模型的话，这几乎不可能。

<https://github.com/antirez/freakwan/blob/main/osx-bte-cli/SerialBTE.m>

这段代码大多是这样写出来的：我把自己想做、但不完全知道该怎么做的部分贴给 ChatGPT；代码运行不正常时，再让大语言模型解释问题在哪里、该如何解决。诚然，这些代码并不是大语言模型写了多少，但它确实大幅加快了开发速度。没有 ChatGPT，我能不能写出来？当然能。但真正有意思的并不是它会多花我多少时间，而是我压根不会尝试，因为不值得。这一点至关重要。对整个项目来说，这个程序只是一个次要环节，投入与收益的比例并不划算。而且它还产生了一个比程序本身更有价值的副作用：为了这个项目，我修改了自己的行编辑库 linenoise，让它能够支持多路复用。

再举一个例子。这次与其说是写代码，不如说是解读数据。我想用网上找到的一个卷积神经网络搭一段 Python 脚本，但这个网络几乎没有文档。好在它采用 ONNX 格式，所以我可以轻松提取输入、输出及其名称。我对这个卷积网络只知道一件事：它会检测图像中的某些特征。我不知道输入图像该用什么格式、什么尺寸，更不知道网络的输出比想象中复杂得多。我原以为它只是一个二分类器：观察到的图像正常，还是有问题？应该只有两个输出，结果却有几百个。

我先把 ONNX 网络的元数据输出复制粘贴到 ChatGPT 里，再向助手说明自己仅有的那点信息。ChatGPT 推测了输入的组织方式，还猜测输出可能是经过归一化的框，用来标出图像中可能存在缺陷的区域；另一些输出则表示这些缺陷出现的概率。来回交流几分钟后，我就有了一段能够执行网络推理的 Python 脚本，还包括把原始图像转换成合适输入张量所需的代码等等。那次对话最让我惊讶的是：ChatGPT 在看到一张测试图像对应的原始输出值——基本上也就是 logits——之后，终于“理解”了这个网络的工作方式。一串浮点数提供了足够的上下文，让它判断出输出的具体含义、采用何种归一化方式、框是以中心点表示还是用左上角表示，等等。

## 一次性程序

像上面这样的案例，我还能再列几十个。但没有必要，因为故事总是以大同小异的方式重复：我遇到了一个问题，需要迅速弄清某件事，而且我有办法验证大语言模型是不是在胡说八道。遇到这种情况，我就会用它来加速获取知识。

不过，还有一些场景，我会干脆让大语言模型把全部代码写完。比如，需要编写一个差不多用过即弃的小程序时。像这个：

<https://github.com/antirez/simple-language-model/blob/main/plot.py>

我需要把一个小型神经网络训练过程中的损失曲线可视化。我把 PyTorch 程序在训练时生成的 CSV 文件格式展示给 GPT-4，然后提出：如果在命令行里指定多个 CSV 文件，我不想再看同一个实验的训练损失和验证损失曲线，而是要对比不同实验的验证损失曲线。上面的程序就是 GPT-4 生成的结果，前后总共用了 30 秒。

类似地，我还需要一个程序读取 Airbnb 的 CSV 报表，按月、按年汇总我的房源。然后结合清洁费和每笔订单的入住晚数，统计一年不同月份的平均每晚租金。这个程序对我极其有用，但写起来无聊得要命，毫无趣味可言。于是我从 CSV 文件里截了一大段，复制粘贴给 GPT-4，再告诉它要解决什么问题。程序第一次运行就成功了。完整代码如下：

```python
import pandas as pd
pd.set_option('display.max_rows', None)
df = pd.read_csv('listings.csv')
reservations = df[df['Type'] == 'Reservation']
reservations['Start Date'] = pd.to_datetime(reservations['Start Date'])
reservations['Year'] = reservations['Start Date'].dt.year
reservations['Month'] = reservations['Start Date'].dt.month
reservations['Nightly Rate'] = (reservations['Amount'] - reservations['Cleaning Fee']) / reservations['Nights']
all_listings = reservations['Listing'].unique()
all_years = reservations['Year'].unique()
all_months = range(1, 13)
index = pd.MultiIndex.from_product([all_listings, all_years, all_months], names=['Listing', 'Year', 'Month'])
all_data = pd.DataFrame(index=index).reset_index()
merged_data = pd.merge(all_data, reservations, on=['Listing', 'Year', 'Month'], how='left')
average_nightly_rates = merged_data.groupby(['Listing', 'Year', 'Month'])['Nightly Rate'].mean().fillna(0)
print(average_nightly_rates)
```

这些数据原本非常零散、混乱，要准确理解应该如何分组，仍然需要一些简单推理。这不是大语言模型仅靠复述或模仿训练中见过的语言就能解决的问题。GPT-4 在训练时肯定见过类似的程序，但几乎不可能见过一个程序，恰好需要按照我指定的方式，对这种特定格式的 CSV 文件做分组。在我看来，这说明大语言模型确实能够在训练集中不同程序共同勾勒出的空间里，进行一定程度的内插。

依我看，亲自花时间写这种程序并不明智。大语言模型替我完成它，无疑直接提升了我产出代码的速度，让我能把精力集中在真正重要的事情上。

## 不顺利的时候：系统编程

尽管我使用大语言模型编程的经历相当成功，但在写 C 程序时，我几乎总是只把它当作一种更方便的文档。我是系统编程专家；在这个领域里，只有当大语言模型具备复杂推理能力时，才会真正对我有用。而在这类场景下，它们几乎总是失败。

先来看这个实验的提示词：

> 请概述一个小巧、美观、但确实可用的 C 语言布隆过滤器实现需要满足哪些要求，重点说明哈希函数的关键之处，然后用高质量 C 代码实现它。
>
> 另外，示例实现需要能容纳 100,000 个元素，误报率不高于 5%。加入过滤器的元素是以 null 结尾的字符串。

下面是它的输出：

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#define N 100000  // Number of elements
#define P 0.05    // False positive probability
#define M (int)(-(N * log(P)) / (log(2) * log(2)))  // Size of bit array
#define K (int)(M / N * log(2))  // Number of hash functions

unsigned char bitArray[M / 8 + 1];

void setBit(int n) {
    bitArray[n / 8] |= 1 << (n % 8);
}

int getBit(int n) {
    return bitArray[n / 8] & (1 << (n % 8));
}

// Basic hash functions (for demonstration purposes)
int hash1(char *str) {
    int hash = 5381;
    int c;
    while ((c = *str++))
        hash = ((hash << 5) + hash) + c;
    return abs(hash % M);
}

int hash2(char *str) {
    unsigned long hash = 0;
    int c;
    while ((c = *str++))
        hash = c + (hash << 6) + (hash << 16) - hash;
    return abs(hash % M);
}

void add(char *str) {
    setBit(hash1(str));
    setBit(hash2(str));
    // Add more hash functions if needed
}

int is_in(char *str) {
    return getBit(hash1(str)) && getBit(hash2(str));
    // Check more hash functions if used
}

int main() {
    char *testStr = "testString";
    add(testStr);

    if (is_in(testStr)) {
        printf("%s is probably in the set.\n", testStr);
    } else {
        printf("%s is definitely not in the set.\n", testStr);
    }

    return 0;
}
```

GPT-4 给出的实现算不上高明。布隆过滤器应用很广，也不是什么冷门数据结构。但要写出一个像样的布隆过滤器，显然需要更强的抽象能力。比如，你需要找到一种有效方法，对同一个字符串做 N 次哈希，并确保这些哈希值之间足够不相关。

不过，如果明确要求 GPT-4 修改哈希函数，让它能够生成 N 个彼此不相关的输出，它提出的方案就合理多了：

```c
unsigned int hash(const char* str, unsigned int hash_id) {
    unsigned int hash = 5381;
    int c;
    while ((c = *str++)) {
        hash = ((hash << 5) + hash) + c + hash_id;
    }
    return hash % BF_SIZE;
}
```

如果一开始就能想到这个办法，它写布隆过滤器时就会采用完全不同的方式：只用一个哈希函数，每次设置 K 个比特位。

单独来看，GPT-4 能够完成“写一个更合适、更通用的哈希函数”这项任务。但放到“实现一个布隆过滤器”这个更大的项目里，它就没能展现出足够的推理能力，反而吐出了两个不同但相似的哈希函数——这正像一篇写得不怎么样的布隆过滤器教程会给出的示例。

大语言模型目前薄弱的推理能力，再加上这个主题的资料可能不多，或者更糟，低质量资料可能很多，最终共同导致了这种勉强的结果。而且这并不是孤例。我偶尔尝试在算法或系统编程领域使用大语言模型时，得到的结果都非常差，哪怕任务所需的推理能力并不比它们写 Python 时表现出的能力更高。

与此同时，GPT-4 却能够在另一次独立会话中反编译自己生成的函数，并准确理解它的用途：

<https://chat.openai.com/share/f54b64d7-d19a-4be4-8f10-08553aa812f1>

因此，要说它在系统编程中毫无用处，显然也不准确。

一个有趣、也完全在意料之中的现象是：遇到这类问题时，小模型和大模型之间的差距确实很明显。我们来看看两个本地模型的表现。

例如，Mistral 的混合专家模型 Mixtral 面对同一个问题，给出了这样的答案：

```c
unsigned int hash(const char* str, unsigned int hash_id) {
    unsigned int hash = 5381;
    int c;
    while ((c = *str++)) {
        hash = ((hash << 5) + hash) + c;
    }
    return hash + hash_id;
}
```

很明显，只在最后加上 `hash_id` 是一个极差的方案。Mixtral 在许多用途上都是很优秀的模型，但说到大语言模型本就薄弱的推理能力，目前的规律无疑还是：越大越好。

下面是我和本地大语言模型 deepseek-coder 的一次对话。我没有足够内存用更高精度运行它，因此把模型量化到了 4 bit。不过，它有 340 亿个参数，在这个问题上表现出的推理能力似乎相当不错。以下是对话记录，使用 llama.cpp 运行：

> 我有一个哈希函数，需要对同一份数据输出 N 个不同的哈希值。然而，随着 `hash_id` 的值改变，我发现生成的哈希值分布非常糟糕：
>
> ```c
> unsigned int hash(const char* str, unsigned int hash_id) {
>     unsigned int hash = 5381;
>     int c;
>     while ((c = *str++)) {
>         hash = ((hash << 5) + hash) + c;
>     }
>     return hash + hash_id;
> }
> ```
>
> 会不会是我使用的加盐策略有问题？应该怎样修改？

deepseek-coder 回答：

> 你的实现可能有一个问题：你只是在哈希值末尾简单加上了 `hash_id`。这可能造成很差的分布，尤其是当 `hash_id` 太大或本身分布不均匀时。
>
> 可以考虑用位运算把 `hash_id` 混合进去。下面是一个使用异或的例子：
>
> ```c
> unsigned int hash(const char* str, unsigned int hash_id) {
>     unsigned int hash = 5381;
>     int c;
>     while ((c = *str++)) {
>         hash = ((hash << 5) + hash) ^ c + hash_id; // Using XOR to mix in the hash_id
>      }
>     return (hash ^ hash_id); // Mixing the hash_id one more time at the end
> }
> ```
>
> 与仅仅把 `hash_id` 加到末尾相比，这种写法能让 `hash_id` 更充分地分散到哈希值中，从而让分布更加均匀。［此处有删节，原回复包含更多有用的信息。］

对于一个运行在我的 MacBook M1 Max 上的模型来说，这已经相当不错了。它还把加法和异或混合在了一起。当然，这一次模型确实从我给出的线索中得到了帮助，但真正识别出问题根源的仍然是模型，而且它提出的替代方案是有效的。上面这种结果，不是查书、翻文档或 Google 搜索能够直接得到的。无论你认为这种能力多么原始，认为它只是内插的产物，或者用其他方式理解它，模型确实完成了某种形式的推理——至少在这个具体例子里，如果我们承认“识别问题根源并提出潜在解决方案”算作推理的话。无论怎么看待大语言模型，断言它对程序员毫无帮助，都是极其草率的。

但另一方面，过去几个月的经历也告诉我：如果你已经是经验丰富的系统程序员，大语言模型几乎从来给不出可接受的方案。再看一个真实案例。我目前的项目 ggufflib，是一个读写 GGUF 格式文件的库；llama.cpp 就用这种格式加载量化模型。一开始，为了理解量化编码的工作方式——出于速度考虑，每个量化值的比特位都会以各种巧妙方式存储——我试过用 ChatGPT。后来我还是决定直接逆向阅读 llama.cpp 的代码，因为那样快得多。

一个能够像样地辅助系统程序员的大语言模型，在看到数据编码的 `struct` 声明和解码函数后，理应可以还原出数据格式文档。llama.cpp 的相关函数足够短，完全放得进 GPT-4 的上下文窗口，但它的输出毫无用处。遇到这种情况，事情还是得按过去的方式做：拿起纸笔，阅读代码，逐一确认解码器提取出来的每一组比特究竟被放到了哪里。

我再详细说明一下这个案例，你愿意的话也可以自己试试。llama.cpp 的实现中有这样一个结构体：

```c
// 6-bit quantization
// weight is represented as x = a * q
// 16 blocks of 16 elements each
// Effectively 6.5625 bits per weight
typedef struct {
    uint8_t ql[QK_K/2];      // quants, lower 4 bits
    uint8_t qh[QK_K/4];      // quants, upper 2 bits
    int8_t  scales[QK_K/16]; // scales, quantized with 8 bits
    ggml_fp16_t d;           // super-block scale
} block_q6_K;
```

然后是用于反量化的函数：

```c
void dequantize_row_q6_K(const block_q6_K * restrict x, float * restrict y, int k) {
    assert(k % QK_K == 0);
    const int nb = k / QK_K;

    for (int i = 0; i < nb; i++) {

        const float d = GGML_FP16_TO_FP32(x[i].d);

        const uint8_t * restrict ql = x[i].ql;
        const uint8_t * restrict qh = x[i].qh;
        const int8_t  * restrict sc = x[i].scales;
        for (int n = 0; n < QK_K; n += 128) {
            for (int l = 0; l < 32; ++l) {
                int is = l/16;
                const int8_t q1 = (int8_t)((ql[l +  0] & 0xF) | (((qh[l] >> 0) & 3) << 4)) - 32;
                const int8_t q2 = (int8_t)((ql[l + 32] & 0xF) | (((qh[l] >> 2) & 3) << 4)) - 32;
                const int8_t q3 = (int8_t)((ql[l +  0]  >> 4) | (((qh[l] >> 4) & 3) << 4)) - 32;
                const int8_t q4 = (int8_t)((ql[l + 32]  >> 4) | (((qh[l] >> 6) & 3) << 4)) - 32;
                y[l +  0] = d * sc[is + 0] * q1;
                y[l + 32] = d * sc[is + 2] * q2;
                y[l + 64] = d * sc[is + 4] * q3;
                y[l + 96] = d * sc[is + 6] * q4;
            }
            y  += 128;
            ql += 64;
            qh += 32;
            sc += 8;
        }
    }
}
```

如果我让 GPT-4 概述这里使用的数据格式，它很难解释清楚：根据权重的位置不同，各个数据块究竟怎样存储在 `ql` 的低 4 位或高 4 位中。为了写这篇博客，我还试着让它写一个更简单的函数来展示数据是怎样存储的——也许它无法用语言解释，但可以用代码说明。结果生成的函数到处都是错的：索引不对，6 bit 到 8 bit 的符号扩展不对——它只是简单地转换成 `uint8_t`——还有许多其他问题。

顺便说一下，下面是我最后自己写出的代码：

```c
    } else if (tensor->type == GGUF_TYPE_Q6_K) {
        uint8_t *block = (uint8_t*)tensor->weights_data;
        uint64_t i = 0; // i-th weight to dequantize.
        while(i < tensor->num_weights) {
            float super_scale = from_half(*((uint16_t*)(block+128+64+16)));
            uint8_t *L = block;
            uint8_t *H = block+128;
            int8_t *scales = (int8_t*)block+128+64;
            for (int cluster = 0; cluster < 2; cluster++) {
                for (uint64_t j = 0; j < 128; j++) {
                    f[i] = (super_scale * scales[j/16]) *
                           ((int8_t)
                            ((((L[j%64] >> (j/64*4)) & 0xF) |
                             (((H[j%32] >> (j/32*2)) & 3) << 4)))-32);
                    i++;
                    if (i == tensor->num_weights) return f;
                }
                L += 64;
                H += 32;
                scales += 8;
            }
            block += 128+64+16+2; // Go to the next block.
        }
   }
```

在上面的函数里，我删掉了这段代码真正有价值的部分：那些详细解释 llama.cpp Q6_K 编码格式的长注释。如果 GPT 能替我完成这件事，会非常有用。而且我敢说，这恐怕只是几个月的问题，因为这类任务不需要任何重大突破，只要模型再扩大一点就足以做到。

## 拉远一点看

我很遗憾不得不这么说，但事实就是：今天的大多数编程工作，不过是把同样的东西换个形式再写一遍，根本不需要多高的推理能力。大语言模型很擅长做这件事，尽管上下文窗口的最大长度仍然严重限制着它们。这一点确实值得程序员认真思考：继续写这类程序还有多大意义？当然，你能靠它挣钱，而且挣得相当不错；但既然大语言模型已经能完成其中一部分，那么五年或十年之后，这也许不是一个理想的位置。

那么，大语言模型究竟具不具备某种推理能力，还是一切都只是障眼法？或许有些时候，它们看起来像是在推理，只是因为借用符号学家的说法，“能指”制造出了一种意义存在的印象，而实际上并不存在真正的意义。可是，真正花过足够多时间使用大语言模型的人，在承认其局限的同时，也清楚事情不可能如此简单：它们组合既有内容的能力，远远超出了随机吐出词语的程度。尽管训练大多发生在预训练阶段，目标只是预测下一个 token，但恰恰是这个目标，迫使模型形成某种抽象模型。这个模型很弱、支离破碎、并不完善，但只要我们确实观察到了那些现象，它就必然以某种形式存在。当数学上的确定结论仍然可疑，顶尖专家也经常各执一词时，相信自己的亲眼所见，也许才是明智的做法。

最后，今天不用大语言模型来编程，又有什么道理呢？懂得向大语言模型提出正确的问题，已经是一项基本技能。练习得越少，就越难借助 AI 改进自己的工作。而且，培养清楚描述问题的能力，在与其他人交流时同样有用。有时候听不懂我们想说什么的，可不只有大语言模型。表达能力差是一项严重的短板，许多程序员在自己的专业领域非常能干，却极不擅长沟通。再说，如今 Google 已经几乎没法用了；哪怕只把大语言模型当成压缩过的文档来使用，也是个好主意。

至于我，我会继续大量使用它们。我从来不喜欢学习某个冷门通信协议的细枝末节，也不喜欢研究某些人为了炫耀自己有多厉害而写得极其繁琐的库方法。在我看来，这些都是“垃圾知识”。而大语言模型每天都在帮我越来越多地摆脱这些东西。

---

[RSS](https://antirez.com/rss)｜[Twitter](http://twitter.com/antirezdotcom)｜[Google Group](https://groups.google.com/forum/?fromgroups#!forum/redis-db)｜[旧站](http://oldblog.antirez.com/)
