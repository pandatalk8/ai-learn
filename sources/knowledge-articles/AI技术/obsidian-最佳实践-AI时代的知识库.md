# Obsidian 最佳实践：当你的笔记变成 AI 的代码库

2024 年 2 月，Andrej Karpathy 在 X 上发了一条帖子，说他把个人笔记全部迁到了 Obsidian。但他说的话很奇怪——"My primary interest in Obsidian is not even for note taking specifically, it is that Obsidian is around the state of the art of a philosophy of software and what it could be."

他感兴趣的不是记笔记这件事，而是 Obsidian 背后的软件哲学。

两年后，2026 年 4 月，Karpathy 放出了一个 GitHub Gist，标题叫"LLM Wiki"。1600 万次浏览，5000 颗星。核心思想用他自己的一句话概括：

**"Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase."**

Obsidian 是编辑器，LLM 是程序员，你的知识库是代码仓库。

这篇文章，就是围绕这个思路展开的——在 Claude Code 和 Codex 的时代，怎么用 Obsidian 搭建一个真正被 AI 驱动的个人知识系统。

---

## 一、Obsidian 的哲学：为什么 Karpathy 选了它

市面上的笔记工具很多。Notion 好看，Logseq 极客，Roam Research 先锋，Apple Notes 省心。但 Karpathy 选 Obsidian，不是因为功能，而是因为三条设计原则——这三条恰好是 Obsidian 官方写在文档第一页的东西：

| 原则 | 含义 | 对 AI 协作的价值 |
|------|------|----------------|
| **数据归你所有** | 纯 Markdown 文件，存在本地硬盘 | Claude Code 可以直接 `Read`、`grep`、`find`，零 API 开销 |
| **链接是一等公民** | `[[wikilink]]` 是核心交互，不是附属功能 | LLM 天然理解 wikilink 语法，能自动维护交叉引用 |
| **可组合的工具包** | 不试图什么都做，而是提供积木让用户自由组合 | 和 CLI 工具、Git、VS Code 无缝配合 |

Karpathy 在那条推文里特别提到："No attempts to lock you in"——没有任何试图锁住你的设计。完全没有用户敌对的暗模式。

这不是情怀。在 AI 时代，这是一个硬性的技术优势。

Notion 的数据是私有 JSON，藏在它的服务器上，API 有速率限制。你想让 Claude 读你的 Notion？先写个 API 适配器，再处理分页，再把 Block 结构转成 Markdown。而 Obsidian vault 里的文件？`cat notes/xxx.md`，完事了。

**你的知识库的价值 = 内容质量 × AI 可访问性。** Obsidian 把可访问性这一项直接拉满。

---

## 二、Karpathy 的 LLM Wiki：一个改变范式的架构

Karpathy 的 LLM Wiki 不是一个插件，不是一个 App，甚至不是一段代码。它是一个**文件夹结构 + 一份给 AI 的说明书**。

架构只有三层：

```
vault/
├── raw/          # 原始素材，人写入，LLM 只读
├── wiki/         # LLM 生成并维护的知识页面
│   ├── sources/      # 每篇原始素材的摘要页
│   ├── concepts/     # 概念页（如"注意力机制""满意化决策"）
│   ├── entities/     # 实体页（人物、公司、产品）
│   ├── index.md      # 导航索引
│   └── overview.md   # 总览页
└── CLAUDE.md     # Schema 文件——告诉 LLM 怎么维护这个 wiki
```

**`raw/` 是你的输入层。** 往里扔任何东西——文章剪藏、PDF、会议记录、读书笔记、随手想法。格式随意，不需要整理。Obsidian 的 Web Clipper 可以一键把网页存成 Markdown 扔进来。这个目录的规则是：**人写入，AI 只读，文件不可变。**

**`wiki/` 是 AI 的输出层。** 这里的每个文件都是 LLM 生成的。你读，但不手动编辑。LLM 负责从 `raw/` 的素材中提取实体、概念、摘要，写成结构化的 wiki 页面，并用 `[[wikilink]]` 建立交叉引用。

**`CLAUDE.md` 是 schema。** 它告诉 LLM 这个 wiki 的结构规范、命名约定、处理流程。相当于代码仓库的 README + 贡献指南 + 代码规范，合成了一份文件。

这就是那句话的含义——Obsidian 是 IDE（你在里面浏览和阅读），LLM 是 programmer（它负责写入和维护），wiki 是 codebase（结构化的、有规范的、持续演进的知识体）。

---

## 三、为什么不用 RAG？一个反直觉的判断

你可能会问：这不就是一个简陋版的 RAG 吗？

恰恰相反。Karpathy 的 LLM Wiki **故意跳过了向量数据库**，用一种完全不同的策略处理知识检索。

传统 RAG 的工作方式是：

```
[查询] → 向量化 → 在向量库里找相似片段 → 拼成 prompt → LLM 回答
```

每次查询都要重新检索、重新拼接、重新理解。LLM 看到的永远是碎片化的 chunk。

LLM Wiki 的方式是：

```
[新素材进入] → LLM 完整阅读 → 写摘要页 → 更新概念页 → 更新实体页 → 补充交叉引用
[查询] → 打开相关 wiki 页 → 直接回答
```

**重活儿在写入时干完了，查询时几乎没有开销。**

这就是 Karpathy 说的"compilation step"——编译步骤。就像代码写完要编译一样，知识进来也要先"编译"成结构化的 wiki 页面。编译一次，查询无数次。

为什么这个方法在今天可行？因为**上下文窗口够大了**。Claude 的上下文窗口已经到了 200K token，足够把一个中等规模 vault 里的相关页面全部加载进来。不需要向量检索来"找最相关的 chunk"——直接把相关文件读进去就行。

而且 wiki 页面本身已经是结构化的、有交叉引用的、去重过的。LLM 读一篇 wiki 概念页，比读十段 RAG 检索出来的原始文本碎片，理解效率高得多。

---

## 四、CLAUDE.md——你的知识库的操作系统

整个 LLM Wiki 模式里，最关键的一个文件不是任何一篇笔记，而是 `CLAUDE.md`。

这个文件是给 AI 看的——当你在 vault 目录下启动 Claude Code，或者把 vault 交给 Codex，它们第一时间读的就是这个文件。它定义了整个知识库的"操作系统"：

```markdown
# Knowledge Base Schema

## 目录规范
- raw/: 原始素材，不可修改。新素材放这里
- wiki/sources/: 每篇原始素材的一页摘要
- wiki/concepts/: 概念页，一个概念一个文件
- wiki/entities/: 实体页（人物/公司/产品）

## Wiki 页面格式
每个 wiki 页面必须包含：
- frontmatter: title, type, created, updated, tags
- 正文第一段: 一句话定义
- Related: 相关页面的 [[wikilink]] 列表
- Sources: 引用了哪些 raw/ 文件

## 三个核心操作

### Ingest（写入）
当 raw/ 里出现新文件时：
1. 完整阅读原文
2. 在 wiki/sources/ 创建摘要页
3. 提取概念和实体
4. 更新或创建对应的 concepts/ 和 entities/ 页面
5. 为所有受影响的页面补充 [[wikilink]] 交叉引用
6. 更新 index.md

### Query（查询）
回答问题时：
1. 搜索 wiki/ 下的相关页面
2. 加载相关页面作为上下文
3. 回答时引用具体的 wiki 页面
4. 如果对话产生了有价值的新洞察，写入 wiki/

### Lint（维护）
定期执行健康检查：
- 找出矛盾的信息
- 找出过时的内容
- 找出孤儿页面（没有任何链接指向的页面）
- 找出缺失的交叉引用
- 找出数据缺口（某个实体被多次提到但没有自己的页面）
```

注意 Query 操作的最后一步：**如果对话产生了有价值的新洞察，写入 wiki/**。这意味着你和 AI 的每一次对话，都可能让知识库变得更丰富。知识在复利式增长。

这就是为什么 Karpathy 说"人类会放弃维护 wiki，因为维护负担增长得比价值快。LLM 不会无聊，不会忘记更新交叉引用，一次能改 15 个文件。"

---

## 五、从零搭建：实操指南

理论讲够了。动手。

### 第一步，创建 vault 结构

打开终端，用 Claude Code：

> "帮我在 ~/obsidian-wiki 创建一个 LLM Wiki 结构的 vault。包括 raw/、wiki/sources、wiki/concepts、wiki/entities，以及 CLAUDE.md schema 文件。"

Claude 会帮你创建目录、写好 CLAUDE.md 模板、生成 wiki/index.md 骨架。然后用 Obsidian 打开这个文件夹作为 vault。

### 第二步，喂入原始素材

把你已有的笔记、文章剪藏、读书摘要扔进 `raw/` 目录。不用整理格式，文件名随意。

装一个 Obsidian Web Clipper 插件，以后看到好文章直接剪藏到 `raw/`。

### 第三步，执行第一次 Ingest

在 vault 目录下启动 Claude Code：

> "读 raw/ 目录下的所有文件，按照 CLAUDE.md 里定义的 Ingest 流程，为每篇素材创建 wiki 页面，提取概念和实体，建立交叉引用。"

这一步可能需要几分钟。Claude 会逐个读完原始文件，创建 sources 摘要页，识别出概念和实体，创建对应页面，然后用 `[[wikilink]]` 把它们串起来。

跑完之后，打开 Obsidian 的 Graph View——你会看到一个蛛网状的知识图谱已经自动生成了。节点越大，说明被引用越多，那就是你知识体系的核心概念。

### 第四步，日常使用

**读到好文章？** Web Clipper 扔进 `raw/`，回头让 Claude ingest。

**有新想法？** 在 Obsidian 里随手写一个 `raw/2026-06-15-想法.md`，内容写几句话就行。

**要写文章？** 让 Claude 搜索 `wiki/concepts/` 和 `wiki/entities/`，把相关知识点汇总成大纲。

**月底维护？** 让 Claude 跑一次 Lint，清理矛盾、补充链接、标记过时内容。

---

## 六、Codex 的角色：后台编译器

Claude Code 是实时交互——你问一句，它答一句。但 Ingest 操作经常是批量的：你攒了一周的 20 篇剪藏文章，需要一次性编译进 wiki。

这是 Codex 的最佳场景：**异步、批量、深度处理。**

几个典型用法：

**批量 Ingest。** "读 raw/ 下所有还没有对应 wiki/sources/ 页面的文件，全部执行 Ingest 流程。" Codex 在后台跑，跑完你 review 结果。

**全局 Lint。** "对整个 wiki/ 执行 Lint。生成一份报告：矛盾信息、孤儿页面、缺失实体、过时内容。" 这种需要扫描几百个文件再做交叉分析的任务，交给 Codex 比实时对话更合适。

**知识图谱重构。** Vault 用了半年，你的理解深化了，分类需要调整。"根据 wiki/ 里所有页面的实际内容和链接关系，重新设计 concepts/ 的分类体系，执行重构。" 这种"读完全部 → 思考 → 批量改"的任务，是 Codex 的甜区。

---

## 七、Obsidian 在这个体系里的独特价值

你可能会想：如果知识都靠 LLM 维护，那 Obsidian 的作用是什么？换成 VS Code 不也一样？

不一样。Obsidian 有三个能力是纯文本编辑器给不了的：

**Graph View。** 当 LLM 帮你建了上百个 wiki 页面和上千条 `[[wikilink]]` 之后，Graph View 能让你一眼看到知识的全局结构——哪些概念是枢纽节点，哪些领域之间存在意想不到的连接，哪些角落是孤岛。这是人类的空间直觉，AI 无法替代。

**Canvas。** Obsidian Canvas 提供无限画布，你可以把多个 wiki 页面拖进来并排阅读、用线条标注关系、加文字卡片做批注。这是在做"思考"而不是"检索"——用 Canvas 把 AI 编译好的知识摆出来，用人类的直觉发现新的关联。Canvas 保存为开放的 JSON Canvas 格式，AI 也能读写。

**实时渲染。** Markdown 里的 `[[wikilink]]`、frontmatter、Dataview 查询、嵌入的图片和 PDF——Obsidian 把它们渲染成可交互的界面。AI 负责写，你在 Obsidian 里舒服地读。

**插件做 UI，AI 做智能。** 这是最佳分工。

---

## 八、Properties：让 AI 和 Dataview 都能结构化查询

Obsidian 的 Properties 系统（也就是 YAML frontmatter）在 LLM Wiki 模式下变得格外重要。因为它是唯一一层同时被 AI 和 Obsidian 原生支持的结构化数据。

wiki 页面的 frontmatter 模板：

```yaml
---
title: "注意力机制"
type: concept          # source / concept / entity
created: 2026-06-15
updated: 2026-06-15
tags: [深度学习, transformer, NLP]
sources: ["raw/attention-is-all-you-need.md"]
related: ["[[Transformer]]", "[[Self-Attention]]"]
---
```

Obsidian 原生支持的 Property 类型包括：Text、List、Number、Checkbox、Date、Date & time、Tags。这套类型系统够用了。

有了结构化的 frontmatter，你可以做两件事：

**AI 侧：** 让 Claude 用 `grep` 批量查询。"找出所有 type 为 entity、tags 包含 AI 的页面，按 updated 排序。" 一行命令搞定。

**Obsidian 侧：** 用 Dataview 插件写查询，在 Obsidian 界面里实时渲染结果表格：

```dataview
TABLE title, updated, tags
FROM "wiki/concepts"
WHERE contains(tags, "深度学习")
SORT updated DESC
```

两侧共享同一份 frontmatter 数据，不需要维护两套系统。

---

## 九、三条经验法则

跑了几个月之后，我总结了三条反直觉但极其实用的经验。

**第一，raw/ 里宁多勿精。** 不要筛选"值得存的才存"。存的成本接近于零——Web Clipper 一键剪藏，随手想法三句话扔进去。值不值得，让 AI 在 Ingest 时判断。那些你觉得没什么用的素材，AI 可能在三个月后发现它和另一个概念有意想不到的关联。

**第二，wiki/ 里不要手动改。** 人一旦开始手动编辑 wiki 页面，就会和 AI 的自动更新产生冲突。想补充信息？写一条新的 `raw/` 笔记，让 AI ingest 进去。想纠正错误？在 CLAUDE.md 里加一条规则。保持"人写 raw，AI 写 wiki"的边界清晰。

**第三，CLAUDE.md 要迭代。** 第一版 CLAUDE.md 一定不完美。当你发现 AI 的 Ingest 结果不符合预期——比如概念拆分太细、实体页缺少某个字段、交叉引用漏了某个方向——就去更新 CLAUDE.md。把它当成代码仓库的 lint 规则来维护：发现问题，修规则，下次自动修正。

---

## 最后

Karpathy 的 LLM Wiki 模式之所以引发 1600 万次浏览，不是因为它复杂，恰恰是因为它简单到了极致——一个文件夹结构，一份 schema 文件，剩下的交给 LLM。

这套东西的底层逻辑和 Obsidian 官方的设计哲学完全一致：数据是你的，格式是开放的，工具是可组合的。Obsidian 不试图内置 AI，而是让自己成为 AI 最容易操作的载体。

**人类负责输入和判断，AI 负责编译和维护，Obsidian 负责呈现和连接。** 三者各守其位，这就是 AI 时代个人知识管理的最终形态——至少在下一个范式出现之前。
