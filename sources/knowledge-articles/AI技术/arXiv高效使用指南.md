# arXiv 高效使用指南：从信息洪流中精准捞出你要的论文

去年我跟一个做 NLP 的朋友聊天，他说自己每天早上花 40 分钟刷 arXiv，一年下来读了大概 200 篇论文的摘要，真正精读的不到 20 篇。我问他："你觉得自己漏掉了多少重要论文？"他沉默了一会儿说："不知道，这才是最让我焦虑的。"

这个场景太典型了。arXiv 上每天新增超过 1000 篇论文，仅 cs.AI 一个子分类，2024 年全年就收录了超过 5 万篇。靠"每天刷一刷"来跟踪前沿，就像用渔网在太平洋里捞特定的鱼——效率极低，还让人心累。

但问题不在 arXiv 本身。arXiv 其实提供了一套相当强大的工具体系，只是大多数人只会用最基础的搜索框。**真正的差距在于：你是把 arXiv 当搜索引擎用，还是当信息系统用。**

---

## 一、先搞清楚 arXiv 的底层结构

很多人用了几年 arXiv，连它的分类体系都没仔细看过。这就像你天天逛一个商场，但从来没看过楼层指南。

arXiv 的内容按学科分成若干大类，每个大类下有细分子类。以计算机科学为例：

| 子类代码    | 领域     | 典型内容           |
| ------- | ------ | -------------- |
| cs.AI   | 人工智能   | Agent、推理、规划    |
| cs.CL   | 计算语言学  | NLP、大语言模型、对话系统 |
| cs.CV   | 计算机视觉  | 图像识别、生成模型、视频理解 |
| cs.LG   | 机器学习   | 训练方法、优化、理论分析   |
| cs.IR   | 信息检索   | 搜索、推荐系统、RAG    |
| cs.SE   | 软件工程   | 代码生成、测试、开发工具   |
| cs.CR   | 密码学与安全 | 对抗攻击、隐私计算、安全评估 |
| stat.ML | 统计机器学习 | 贝叶斯方法、因果推断     |

**第一步，圈定你的"主战场"。** 选 2-3 个与你工作最相关的子类，作为你的核心关注区。不要贪多，5 个以上就会淹没在信息里。

每篇论文的 arXiv ID 里其实藏着有用信息。比如 `2401.12345`，前四位 `2401` 是提交年月（2024年1月），后面是序号。知道这个，你扫一眼 ID 就能判断论文的新旧。

---

## 二、搜索：别只会在框里敲关键词

arXiv 的搜索界面（arxiv.org/search）看起来朴素，但它支持一套相当灵活的高级语法。大多数人只用默认的"All fields"搜索，效果当然差。

### 基础字段筛选

在搜索框里，你可以用前缀指定搜索范围：

- `ti:` —— 只搜标题。比如 `ti:chain of thought` 只匹配标题里包含"chain of thought"的论文
- `au:` —— 搜作者。比如 `au:Yann LeCun`
- `abs:` —— 搜摘要。比如 `abs:reinforcement learning from human feedback`
- `cat:` —— 限定分类。比如 `cat:cs.CL`
- `all:` —— 搜所有字段（默认行为）

### 组合搜索

用 `AND`、`OR`、`ANDNOT` 组合多个条件：

```
ti:retrieval augmented generation AND cat:cs.CL
```

这条搜索的意思是：标题包含"retrieval augmented generation"，并且分类是计算语言学。比你直接搜"RAG"精准十倍。

再比如，你想找 Ilya Sutskever 关于 scaling 的论文：

```
au:Sutskever AND ti:scaling
```

### 排除噪音

`ANDNOT` 是被低估的利器。假设你研究多模态模型，但不想看医学影像方向的：

```
ti:multimodal AND cat:cs.CV ANDNOT abs:medical
```

### 时间范围

arXiv 搜索界面的"Advanced Search"里可以设置日期范围。如果你只关心最近半年的工作，务必设置起止日期——这能砍掉 80% 的噪音。

---

## 三、用好 arXiv 的 Daily Listings 和 RSS

搜索解决的是"我要找某个东西"的需求。但做研究还有另一个需求：**持续跟踪一个方向的最新进展。**

### Daily Listings（每日新论文列表）

访问 `arxiv.org/list/cs.CL/new` 就能看到计算语言学当天的新提交和更新。把 `cs.CL` 换成你关注的子类代码即可。

这个页面分三个区：

1. **New submissions** —— 全新提交的论文
2. **Cross-lists** —— 主分类不是这个子类，但作者觉得相关所以交叉列出
3. **Replacements** —— 已有论文的更新版本

**重点看 New submissions 和 Cross-lists。** Replacements 除非你在追踪某篇特定论文，否则可以跳过。

### RSS 订阅

arXiv 为每个子类提供 RSS feed。地址格式：

```
https://rss.arxiv.org/rss/cs.CL
```

把它扔进你的 RSS 阅读器（Feedly、Inoreader、NetNewsWire 都行），每天自动推送新论文。

**进阶技巧：** arXiv 的 RSS 支持用 `+` 号合并多个子类。比如你同时关注 NLP 和机器学习：

```
https://rss.arxiv.org/rss/cs.CL+cs.LG
```

一个 feed 搞定两个方向。

---

## 四、arXiv API：给程序员的终极武器

如果你会写代码，arXiv 的 API 能把你的信息获取效率提升一个量级。

### 基本用法

arXiv API 的端点是 `http://export.arxiv.org/api/query`，用 GET 请求传参：

```bash
curl "http://export.arxiv.org/api/query?search_query=ti:large+language+model&start=0&max_results=10&sortBy=submittedDate&sortOrder=descending"
```

返回 Atom XML 格式，包含标题、摘要、作者、分类、PDF 链接等完整元数据。

### 实用脚本示例

用 Python 写一个每日论文筛选器，核心逻辑不到 50 行：

```python
import arxiv
from datetime import datetime, timedelta

client = arxiv.Client()

search = arxiv.Search(
    query="cat:cs.CL AND (ti:agent OR ti:reasoning OR ti:planning)",
    max_results=50,
    sort_by=arxiv.SortCriterion.SubmittedDate,
    sort_order=arxiv.SortOrder.Descending,
)

yesterday = datetime.now() - timedelta(days=2)

for result in client.results(search):
    if result.published.replace(tzinfo=None) < yesterday:
        break
    print(f"[{result.published.strftime('%m-%d')}] {result.title}")
    print(f"  Authors: {', '.join(a.name for a in result.authors[:3])}")
    print(f"  {result.entry_id}")
    print()
```

这段代码做了三件事：只看 cs.CL 分类、只匹配标题含 agent/reasoning/planning 的论文、只显示最近两天的。每天早上跑一次，30 秒搞定别人 40 分钟的活。

`arxiv` 这个 Python 包（`pip install arxiv`）封装了官方 API，省去了手动解析 XML 的麻烦。

---

## 五、第三方工具：站在别人的肩膀上

arXiv 生态系统里有一批非常好用的第三方工具，每个解决一个特定痛点。

### Semantic Scholar

地址：semanticscholar.org

Semantic Scholar 对 arXiv 论文做了语义索引，它的"Related Papers"功能比 arXiv 原生的好用得多。输入一篇你觉得重要的论文，它能找到内容真正相关（而不只是关键词匹配）的其他论文。

它还提供影响力指标——"Highly Influential Citations"只统计那些实质性引用了这篇论文的后续工作，过滤掉了"Related Work 里随手一提"的水引用。

### Connected Papers

地址：connectedpapers.com

输入一篇论文，它会生成一张可视化的关联图谱。节点是论文，边表示相似度。你能一眼看出一个研究方向的脉络——哪些是开创性工作，哪些是最新进展，哪些是连接不同方向的桥梁论文。

**最适合的场景：** 你刚进入一个新领域，需要快速建立全景认知。

### Papers With Code

地址：paperswithcode.com

这个工具的核心价值是把论文和代码实现对应起来。看到一篇论文，直接跳到它的 GitHub 仓库看实现。它还维护了各个 benchmark 的排行榜（State-of-the-Art），你能看到每个任务上当前最好的方法是什么。

### ar5iv

地址：ar5iv.labs.arxiv.org

把 arXiv 论文的 LaTeX 源码渲染成 HTML 页面。阅读体验比 PDF 好很多，尤其在手机上。用法很简单——把论文 URL 里的 `arxiv.org` 换成 `ar5iv.labs.arxiv.org` 就行。

### Hugging Face Daily Papers

地址：huggingface.co/papers

Hugging Face 社区每天投票选出最值得关注的 AI 论文。如果你不想自己筛选，这是一个高质量的"人肉过滤器"。

---

## 六、构建你自己的论文跟踪系统

工具再好，如果没有系统来组织，最终还是会陷入"收藏了 500 篇论文但一篇没读"的困境。

**一个实用的论文跟踪系统只需要三层：**

**第一层，信息捕获。** 设置 2-3 个 RSS 订阅覆盖你的核心方向，再加一个每日脚本做关键词过滤。每天花 10 分钟扫一遍标题和摘要，把感兴趣的标记下来。工具不限——Zotero、Notion、Obsidian、甚至一个纯文本文件都行。

**第二层，快速分流。** 标记的论文分三档：

| 档位 | 标准 | 行动 |
|------|------|------|
| A 档 | 直接影响当前工作 | 当周精读，做笔记 |
| B 档 | 相关但不紧急 | 放入阅读队列，月末清理 |
| C 档 | 有意思但不相关 | 只存链接，不投入时间 |

**第三层，定期复盘。** 每月花 1 小时回顾：这个月你关注的方向有什么大的变化？你的关键词列表需要调整吗？有没有新的重要作者或团队冒出来？

**关键判断独立成段：当你没有系统的时候，每篇论文都是一个让你焦虑的信号。当你有系统的时候，每篇论文都只是一个待分流的条目。**

---

## 七、高级策略：从被动接收到主动狩猎

上面讲的都是"怎么高效接收信息"。但真正的高手还有一招——主动追踪关键节点。

### 追踪核心作者

每个方向都有几个"风向标"式的研究者。他们发的论文，往往预示着接下来半年到一年的研究热点。

在 Semantic Scholar 上，你可以关注特定作者，他们有新论文时自动通知你。Google Scholar 也有类似功能——在作者主页点"Follow"。

### 追踪核心团队和实验室

比 追踪个人更高效的是追踪团队。OpenAI、DeepMind、Meta AI（FAIR）、Google Research、Anthropic 这些实验室的论文，通常可以通过作者列表中的机构信息来过滤。

### 反向追踪引用链

当你发现一篇重要论文，做两件事：

1. **往回看**——它引用了哪些论文？这帮你理解这个方向的历史脉络
2. **往前看**——谁引用了它？这帮你发现最新进展。Semantic Scholar 的"Citations"按时间排序，最新的在前面

这个"引用链追踪"的效率远高于关键词搜索，因为引用关系本身就是最强的相关性信号。

### 关注 Workshop 和 Competition

顶会（NeurIPS、ICML、ICLR、ACL、CVPR）的 Workshop 论文通常比主会论文更前沿、更实验性。这些论文也会出现在 arXiv 上，但淹没在海量提交中。关注顶会官网的 Workshop 列表，找到你感兴趣的 Workshop，然后集中扫描其接收论文，比漫无目的刷 arXiv 高效得多。

---

## 八、读论文的效率倍增器

找到论文只是第一步。怎么读也很关键。

### 五分钟判断法

拿到一篇论文，按这个顺序读，每一步都是一个"要不要继续"的决策点：

1. **标题 + 摘要**（1分钟）—— 这篇论文解决什么问题？方法的核心思路是什么？
2. **图表**（2分钟）—— 直接翻到实验部分看图表。结果有没有显著提升？跟什么 baseline 比的？
3. **Introduction 最后一段**（1分钟）—— 通常是 contribution 总结，告诉你这篇论文的核心贡献
4. **Conclusion**（1分钟）—— 作者自己觉得最重要的发现是什么？局限性是什么？

五分钟之后，你应该能判断：这篇论文值不值得花一小时精读。

### 用 AI 辅助阅读

2024 年之后，用 AI 辅助读论文已经是标配。几个实用的方式：

- 把论文 PDF 扔给 Claude 或 ChatGPT，让它总结核心方法和实验结果
- 遇到不理解的公式或推导，截图发给 AI 让它逐步解释
- 读完一篇论文后，让 AI 帮你提三个批判性问题——"这个方法的假设合理吗？""实验设计有什么潜在问题？""结论的泛化性如何？"

**但要注意：AI 总结不能替代你自己的判断。** 它可以帮你加速理解，但关键的评估——这篇论文的方法到底好不好、结论可不可信——必须你自己来。

---

## 最后

arXiv 不缺论文，缺的是你的过滤系统。花半天时间设置好 RSS 订阅、写好一个过滤脚本、建立你的三层分流机制，之后每天只需要 15 分钟就能把一个方向的最新进展收入囊中。

**好的信息系统不是让你读更多论文，而是让你有底气不读大部分论文。**
