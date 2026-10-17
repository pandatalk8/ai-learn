# 第五章：从 Skill 到 Plugin——打包多个技能

上一章解决了”是什么”和”要不要”——Plugin 的定位、能力边界、与 Skill 的差异、什么场景下值得动手。这一章假设你已经决定要做一个 Plugin，把重心整体放到”怎么做”上：文件怎么组织、plugin.json 怎么写、Skill 之间如何协作、版本怎么管、坑长什么样。

---

## 一、Plugin 的文件结构

理解了何时用 Plugin，来看它的具体文件组织方式。一个典型的 Plugin 目录结构如下：

```
product-research-toolkit/
├── .claude-plugin/
│   └── plugin.json                # Plugin 元数据
├── skills/
│   ├── competitor-analysis/       # Skill 1：竞品分析
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   │   └── fetch_pricing.py
│   │   └── references/
│   │       └── report-template.md
│   ├── market-sizing/             # Skill 2：市场规模估算
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── sizing-methods.md
│   └── user-persona/              # Skill 3：用户画像
│       ├── SKILL.md
│       └── references/
│           └── persona-template.md
├── shared/                        # 跨 Skill 共享资源
│   ├── scripts/
│   │   └── common_utils.py        # 公共工具函数
│   └── references/
│       └── industry-data.md       # 行业通用数据
├── README.md
└── LICENSE
```

每个目录的职责：

| 目录 | 职责 | 关键规则 |
|------|------|----------|
| `.claude-plugin/` | Plugin 级别的元数据 | 只放 plugin.json |
| `skills/` | 每个子目录是一个独立 Skill | 每个子目录都有自己的 SKILL.md |
| `shared/` | 被多个 Skill 共同引用的资源 | 不要放只有一个 Skill 用的东西 |
| 根目录 | README、LICENSE 等项目级文件 | 面向安装者和贡献者 |

**shared/ 目录的设计原则**

shared/ 是 Plugin 相比多个独立 Skill 的核心优势之一。它的设计有两条原则：

第一，只放真正被多个 Skill 共用的资源。如果一份参考文档只有 competitor-analysis 在用，它应该留在 `skills/competitor-analysis/references/` 里，而不是搬到 shared/。shared/ 里的东西越少越好——少意味着每一份都是真正的公共资产。

第二，路径引用要从各 Skill 的视角出发。比如 competitor-analysis 的 SKILL.md 里引用共享资源时，写相对路径：

```markdown
## References
- references/report-template.md — 本 Skill 专用的报告模板
- ../../shared/references/industry-data.md — 行业通用数据（共享）
- ../../shared/scripts/common_utils.py — 公共工具函数（共享）
```

这样每个 Skill 的 SKILL.md 都能自解释——读者一看就知道哪些是自己的，哪些是共享的。

---

## 二、plugin.json 的编写

`.claude-plugin/plugin.json` 是 Plugin 的身份证，告诉 Claude Code 这个目录是一个 Plugin、包含哪些 Skill。

```json
{
  "name": "product-research-toolkit",
  "description": "产品研究和分析工具集，面向产品经理和创业者",
  "author": "your-github-username",
  "version": "1.0.0",
  "skills": [
    "competitor-analysis",
    "market-sizing",
    "user-persona"
  ]
}
```

各字段说明：

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | Plugin 的唯一标识，小写加连字符 |
| `description` | string | Plugin 整体的功能描述，不需要写触发词（触发词在各 Skill 的 SKILL.md 里） |
| `author` | string | 作者标识，通常用 GitHub 用户名 |
| `version` | string | 语义化版本号 |
| `skills` | array | 包含的 Skill 名称列表，对应 skills/ 目录下的子目录名 |

**版本号策略**

Plugin 的版本号独立于各 Skill 的版本号。什么时候该升哪一位？

| 变更类型 | 版本号升级 | 示例 |
|----------|-----------|------|
| 修复某个 Skill 的 bug | Patch（1.0.0 → 1.0.1） | 修了 competitor-analysis 的触发词遗漏 |
| 新增一个 Skill | Minor（1.0.0 → 1.1.0） | 加入 swot-analysis Skill |
| 删除或重构已有 Skill | Major（1.0.0 → 2.0.0） | 把 market-sizing 拆成两个 Skill |
| 调整 shared/ 中的公共资源 | Minor 或 Patch，视影响范围 | 更新了行业分类标准 |

大版本升级意味着不向后兼容——已经在用这个 Plugin 的人可能需要调整自己的使用方式。小版本升级只增不减，补丁版本只修不改。

---

## 三、Skill 之间的协作设计

Plugin 内的 Skill 不是各自为政的孤岛。好的 Plugin 设计会让 Skill 之间形成协作关系——有的通过互相调用，有的通过共享资源，有的通过串联成流水线。

**子 Skill 调用**

一个 Skill 可以在自己的流程中调用另一个 Skill。做法很直接——在 SKILL.md 的 Workflow 里明确写出来：

```markdown
## Workflow
1. 撰写文章正文
2. 调用 cover-generator Skill 生成封面图
3. 调用 r2-image-upload Skill 上传所有图片到 CDN
4. 调用 wechat-formatter Skill 排版并推送
```

Claude 读到“调用 xxx Skill”时，会识别并触发对应的 Skill。这里的关键是**用 Skill 的 name 字段来引用**，不要用描述性的说法——“帮我上传图片”可能触发也可能不触发，但“调用 r2-image-upload Skill”是明确的指令。

**共享资源的引用**

多个 Skill 读取同一份参考文件或调用同一个脚本，这是最常见的协作方式。

前面讲过 shared/ 目录的设计。这里补充一个实践要点：在 shared/ 的共享脚本里，保持**无状态**。共享脚本不应该依赖某个特定 Skill 的上下文——它应该接收参数、返回结果，中间不假设“当前正在执行哪个 Skill”。

```python
# shared/scripts/common_utils.py

def format_currency(amount, currency="USD"):
    """格式化货币金额，不依赖任何 Skill 的上下文"""
    symbols = {"USD": "$", "CNY": "¥", "EUR": "€"}
    symbol = symbols.get(currency, currency)
    return f"{symbol}{amount:,.2f}"

def validate_url(url):
    """验证 URL 格式，通用工具"""
    import re
    pattern = r'^https?://[^\s/$.?#].[^\s]*$'
    return bool(re.match(pattern, url))
```

这样任何 Skill 调用这些函数都不会有副作用。

**避免触发词冲突**

Plugin 内部最容易出的问题就是触发词冲突——两个 Skill 的 description 覆盖了同样的关键词，用户说一句话，两个 Skill 同时想响应。

一个真实的例子：如果 competitor-analysis 和 market-sizing 的 description 里都写了“分析市场”这个触发词，用户说“帮我分析一下这个市场”，哪个 Skill 会被触发是不确定的——取决于 Claude 当时的理解，本质上是随机的。这就是设计缺陷。

解决方式是**在 Plugin 内统一协调各 Skill 的触发词域**：

| Skill | 负责的触发词域 | 明确排除 |
|-------|---------------|----------|
| competitor-analysis | 竞品、竞争对手、对标、comp | 不响应“市场规模”“用户画像” |
| market-sizing | 市场规模、TAM、市场空间、市场有多大 | 不响应“竞品”“用户是谁” |
| user-persona | 用户画像、目标用户、用户特征、persona | 不响应“竞品”“市场规模” |

每个 Skill 的 description 里不仅要写自己的触发词，还要写明“不要在 xxx 场景下触发”——这个排除条件在 Plugin 内尤其重要，因为 Plugin 内的 Skill 天然覆盖相近的领域。

**测试方法**：安装 Plugin 后，故意说一些模糊的话，看哪个 Skill 被触发。“帮我分析一下这个产品”——应该触发 competitor-analysis 还是 user-persona？如果触发了你不期望的那个，回去调整 description 的措辞。

**流水线模式**

当 Skill A 的输出是 Skill B 的输入时，就形成了流水线。

```
数据清洗 → 趋势分析 → 报告生成
   ↓           ↓           ↓
清洗后的CSV   分析结果JSON   Markdown报告
```

流水线模式的设计要点：

第一，每个 Skill 要在 SKILL.md 里明确声明**输入格式**和**输出格式**。不能含糊——“输出一份报告”不够，要写“输出 Markdown 文件，保存到用户指定路径，文件名格式为 {product-name}-analysis-{date}.md”。

第二，流水线的编排权交给用户。用户说“先帮我清洗数据，然后分析趋势，最后生成报告”，Claude 会按顺序触发三个 Skill。不要试图在 Skill 里自动触发下一步——那样会让 Skill 之间耦合太紧，单独使用某个 Skill 时反而出问题。

第三，中间产物要持久化。Skill A 的输出必须写成文件（而不是只存在 Claude 的上下文里），Skill B 才能可靠地读取。依赖上下文传递中间数据是脆弱的——上下文一长，Claude 可能会遗忘细节。

---

## 四、一个完整的 Plugin 实例

抽象讲了很多，来看一个真实 Plugin 的结构设计。以内容创作领域为例，假设你是一个经常在公众号和小红书发内容的创作者，手上已经积累了以下 Skill：

- **wechat-article**：Markdown 文章排版并推送到微信公众号
- **cover-generator**：生成文章封面图
- **r2-image-upload**：上传图片到 Cloudflare R2 作为 CDN

这三个 Skill 服务于同一个大流程——“把一篇文章发布出去”。把它们打包成 Plugin。

**文件结构**

```
content-publishing-toolkit/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── wechat-article/
│   │   ├── SKILL.md
│   │   ├── scripts/
│   │   │   └── format_html.py
│   │   └── references/
│   │       └── wechat-api-docs.md
│   ├── cover-generator/
│   │   ├── SKILL.md
│   │   └── scripts/
│   │       └── generate_cover.py
│   └── r2-image-upload/
│       ├── SKILL.md
│       └── scripts/
│           └── upload_to_r2.py
├── shared/
│   ├── config/
│   │   └── .env.example          # 环境变量模板
│   └── references/
│       └── brand-colors.md       # 品牌色值和字体规范
├── README.md
└── LICENSE
```

**plugin.json**

```json
{
  "name": "content-publishing-toolkit",
  "description": "内容发布工具集：封面图生成、图片 CDN 上传、公众号排版推送",
  "author": "wanghe",
  "version": "1.2.0",
  "skills": [
    "wechat-article",
    "cover-generator",
    "r2-image-upload"
  ]
}
```

**协作关系设计**

这三个 Skill 之间的协作是流水线式的：

```
cover-generator
      ↓ 生成封面图文件
r2-image-upload
      ↓ 返回 CDN URL，替换 Markdown 中的本地路径
wechat-article
      ↓ 排版并推送到草稿箱
```

但它们也可以独立使用——你可能只想生成封面图而不发布文章，也可能文章里没有图片不需要上传。独立使用能力不能因为 Plugin 打包而丢失。

在 wechat-article 的 SKILL.md 里，流程是这样写的：

```markdown
## Workflow
1. 检查文章 Markdown 中是否有本地图片路径
2. 如有本地图片，调用 r2-image-upload Skill 上传并替换链接
3. 询问用户是否需要生成封面图
4. 如需封面图，调用 cover-generator Skill 生成
5. 使用 scripts/format_html.py 将 Markdown 转为公众号格式 HTML
6. 通过微信公众号 API 推送到草稿箱
```

注意第 2 步和第 4 步都是条件调用——不是每次都执行。这样 wechat-article 既可以作为完整流水线的最后一环，也可以在只有纯文字文章时独立运行。

**共享配置的处理**

三个 Skill 都需要用到的配置（R2 的 API key、公众号的 AppID 和 Secret、品牌色值）放在 shared/ 里，通过环境变量注入：

```bash
# shared/config/.env.example
R2_ACCESS_KEY_ID=your_key_here
R2_SECRET_ACCESS_KEY=your_secret_here
R2_BUCKET_NAME=your_bucket
WECHAT_APP_ID=your_app_id
WECHAT_APP_SECRET=your_secret
```

每个 Skill 的脚本通过 `os.environ.get()` 读取这些值，不在任何文件里硬编码。换机器时只需要配一次 `.env`，所有 Skill 自动生效。

**这个 Plugin 设计好在哪里？**

1. **职责清晰**：每个 Skill 只做一件事，名字就是功能说明
2. **可独立可组合**：三个 Skill 可以单独用，也可以串联成流水线
3. **配置集中**：敏感信息和易变配置通过环境变量统一管理
4. **共享资源精简**：shared/ 里只有真正被多个 Skill 共用的内容

---

## 五、Plugin 开发的常见问题

在从 Skill 升级到 Plugin 的过程中，有几个问题经常出现。

**问题一：Plugin 太大，什么都想往里塞**

一个 Plugin 里装了 15 个 Skill，从竞品分析到视频剪辑到税务申报无所不包。这不是 Plugin，这是杂货铺。

判断标准很简单：**你能不能用一个短语概括这个 Plugin 的主题？** “产品研究工具集”“内容发布流水线”“财务分析套件”——这些都是好的主题。如果你只能说“各种有用的工具”，说明它该拆了。

建议一个 Plugin 包含 3-7 个 Skill。超过 7 个就要考虑是否应该拆分成两个 Plugin。

**问题二：shared/ 变成了垃圾桶**

什么文件都往 shared/ 里扔，结果 shared/ 比任何单个 Skill 的目录都大。shared/ 应该是精简的公共资产库，只放那些被两个以上 Skill 真正引用的资源。

一个检查方法：遍历 shared/ 里的每个文件，看它被几个 Skill 的 SKILL.md 引用。如果只被一个 Skill 引用，搬回那个 Skill 自己的目录里。

**问题三：触发词在 Plugin 内部打架**

前面讲过触发词冲突的问题。在 Plugin 开发完成后，建议做一轮“触发词审计”——列出所有 Skill 的触发词，检查有没有交叉：

| 用户可能说的话 | 应该触发哪个 Skill | 实际触发了哪个 |
|----------------|-------------------|---------------|
| “分析竞品” | competitor-analysis | 待测试 |
| “市场有多大” | market-sizing | 待测试 |
| “目标用户是谁” | user-persona | 待测试 |
| “分析一下这个产品” | ? (歧义) | 待测试 |
| “做个调研” | ? (歧义) | 待测试 |

对于最后两行这种有歧义的表达，要么在某个 Skill 的 description 里抢占这个触发词，要么接受它触发任意一个——但你得知道会发生什么。

**问题四：版本管理混乱**

Plugin 有版本号，每个 Skill 也可以有版本号。两套版本号独立还是联动？

建议的做法是：**Plugin 的版本号是对外的，Skill 的版本号是对内的**。用户看到的是 Plugin 版本——“我装的是 content-publishing-toolkit v1.2.0”。你自己维护时关注的是各 Skill 的版本——“cover-generator 从 v1.0 升到了 v1.1，加了圆角参数”。Plugin 的版本号在每次发布时统一升级，不需要每个 Skill 改一次就升一次 Plugin 版本。

---

## 六、从 Plugin 到生态

当你的 Plugin 稳定运行、解决了一个明确领域的问题之后，它有可能从个人工具变成社区资源。

**接受社区贡献**

如果你把 Plugin 开源，别人可能会想往里面加新的 Skill。这时候需要建立贡献标准：

- 新 Skill 必须符合 Plugin 的主题范围
- 必须提供完整的 SKILL.md，description 写清触发词和排除条件
- 触发词不能和现有 Skill 冲突
- 必须有至少一个测试场景的说明

把这些标准写在 README 或 CONTRIBUTING.md 里，省得每个 PR 都要口头沟通一遍。

**质量维护**

Plugin 里的 Skill 数量增长后，质量的一致性会成为挑战。定期做一轮全面审查：

- 每个 Skill 的 description 是否还准确？有没有过时的触发词？
- 共享资源有没有被正确引用？有没有引用了但实际不存在的文件？
- 各 Skill 的代码风格是否一致？变量命名、错误处理、输出格式是否统一？

**适时拆分**

当一个 Plugin 膨胀到 10 个以上 Skill 时，通常意味着它覆盖的领域太宽了。这时候考虑拆分成多个聚焦的子 Plugin。

比如一个“内容运营全家桶”可能拆成：
- content-writing-toolkit（写作相关：文章生成、大纲规划、风格校验）
- content-publishing-toolkit（发布相关：排版、上传、推送）
- content-analytics-toolkit（分析相关：阅读数据、粉丝画像、内容复盘）

每个子 Plugin 主题清晰、体量可控、触发词空间互不干扰。

---

## 结语

从单个 Skill 到 Plugin，本质上是一次从“工具”到“工具箱”的升级。

Skill 解决的是单点问题——一个任务、一套流程、一次触发。Plugin 解决的是系统问题——多个任务之间如何协作、资源如何共享、体验如何统一。

并不是每个人都需要 Plugin。如果你的 Skill 之间没有关联，各自独立运行得很好，那就保持原样。但当你发现自己在 Skill 之间手动传递数据、反复配置相同的参数、或者想把一整套能力分享给别人时——Plugin 就是下一步。

关键原则只有一条：**Plugin 是 Skill 自然聚合的结果，而不是预先规划的产物**。先有好用的 Skill，再有好用的 Plugin。顺序不能反。
