# XCrawl 实战：10 分钟抓取 Karpathy 全部 AI 观点



> Andrej Karpathy——前 Tesla AI 总监、OpenAI 创始团队成员、Stanford PhD——可能是 X 上最值得关注的 AI 思想家。他的每一条推文都能引发行业讨论。问题是：他发了几百条推文，你不可能一条条翻。这篇教程，教你用 XCrawl 一次性把他所有的 AI 观点抓下来，自动分类整理。

---

## 准备工作：安装 XCrawl 并配置为 Claude Code Skill

### XCrawl

XCrawl 最近在X上开发者圈子里比较流行一个工具，可以快速将搜索结果和网站内容转换为 LLM 友好的格式。 可以非常友好的与 AI Agent 协同工作，我自己用了几天，使用起来体验比较好，帮我养龙虾还是成为我的Claude Code 中的Skill 工作流，都非常的方便。  



### 安装 XCrawl CLI

XCrawl CLI 需要 Node.js >= 18。两种安装方式：

```bash
# 方式一：全局安装（推荐）
npm install -g @xcrawl/cli

# 方式二：免安装直接用
npx -y @xcrawl/cli@0.2.7 --help
```

### 登录认证

```bash
# 浏览器登录（推荐，自动弹出授权页面）
xcrawl login --browser

# 或者用 API Key 登录
xcrawl login --api-key <YOUR_API_KEY>
```

确认登录成功：

```bash
xcrawl status
```

看到 Credits 余额就说明一切就绪。新账户送 1,000 个免费 credits，不需要绑卡。

### 把 XCrawl 包装成 Claude Code Skill（可选）

装好 CLI 之后，你可以把它包装成 Claude Code 的 Skill，这样直接在对话里就能调用，不用手动敲命令。

打开 Claude Code，直接说一句话：

> "帮我把 xcrawl 包装成一个 Claude Code Skill"

Claude Code 会自动帮你创建 `~/.claude/skills/xcrawl/SKILL.md` 配置文件，把 scrape、search、map、crawl 等核心命令全部注册进去。装好之后，你在对话里说"帮我抓取某个网页"或者输入 `/xcrawl`，它就会自动调用 XCrawl 来执行。

---

## 第一步：搜索目标博主的内容

打开 Claude Code，直接说：

> "用 xcrawl 搜索 Karpathy 在 X 上关于 AI 的推文，搜 30 条，保存为 markdown"

![image-20260403100857949](../../../Library/Application Support/typora-user-images/image-20260403100857949.png)

Claude Code 会自动调用 XCrawl Skill 执行搜索。几秒钟后，你会拿到这样的结构化数据：

```json
{
  "query": "site:x.com from:karpathy AI",
  "results": [
    {
      "snippet": "It is hard to communicate how much programming has changed due to AI in the last 2 months: not gradually and...",
      "title": "Andrej Karpathy",
      "url": "https://x.com/karpathy/status/2026731645169185220"
    },
    {
      "snippet": "We've raised $180M from GV, Sequoia, and Index to assemble a new guard in AI...",
      "title": "Andrej Karpathy",
      "url": "https://x.com/karpathy/status/2016590919143952466"
    }
  ]
}
```

每条结果包含三个字段：**推文摘要（snippet）、标题（title）、原始链接（url）**。30 条推文的核心内容，一次全到手。



![image-20260403103248562](../../../Library/Application Support/typora-user-images/image-20260403103248562.png)

---

## 第二步：按话题细化搜索

一个通用关键词 "AI" 拿到的内容太泛。继续跟 Claude Code 说：

> "用 xcrawl 分别搜索 Karpathy 关于以下话题的推文，每个话题 10 条，保存为 JSON：AI 编程、AI Agent、AI 教育与创业、LLM 思维模型"

Claude Code 会自动做四轮搜索，分主题采集完毕。

---

## 第三步：抓取重点推文全文

搜索返回的是摘要（snippet），通常只有一两句话。想看推文的完整内容，跟 Claude Code 说：

> "刚才搜到的 Karpathy 推文里，把最有价值的几条全文抓下来"

Claude Code 会自动调用 XCrawl 的 scrape 功能，返回推文完整正文、互动数据（浏览量、转发、点赞），甚至回复区的内容。

---

## 第四步：批量采集多个博主

Karpathy 只是一个人。继续跟 Claude Code 说：

> "用同样的方法，帮我采集以下博主关于 AI 的推文，每人 20 条：@dotey（中文 AI 圈意见领袖）、@AndrewYNg（教育向）、@levie（企业 AI 应用）、@MatthewBerman（AI 工具评测）"

一句话，四个头部博主的内容全部落地。

---

## 第五步：整理分析，生成报告

数据采集完了，接下来是分析。继续说：

> "把刚才采集的所有博主推文数据整理一下：
> 1. 按话题分类（AI 编程、AI Agent、创业、教育、思维模型）
> 2. 每个话题提取 top 5 最有价值的观点
> 3. 标注每条观点的出处博主和原文链接
> 4. 生成一份《AI 行业观点周报》保存到 ai-weekly.md"

Claude Code 会自动读取所有采集结果、分类整理、生成报告。全程你只需要说话，不用敲一行命令。

---

## 实际采集结果展示

用上面的方法，我从 Karpathy 的 30 条推文中整理出了以下核心观点：

### AI 编程变革

- **"过去两个月 AI 编程发生了质变，不是渐进的"** —— AI 编程的变化是断崖式的，不是线性的 [[原文]](https://x.com/karpathy/status/2026731645169185220)
- **"作为程序员，我从未感到如此落后"** —— 形容 AI 工具像"外星人递过来的工具，没有说明书" [[原文]](https://x.com/karpathy/status/2004607146781278521)
- **"2025 年 AI 跨过了用英语写程序的能力门槛"** —— 从"会编程"到"会说话就能编程" [[原文]](https://x.com/karpathy/status/2002118205729562949)
- **支持 "context engineering" 取代 "prompt engineering"** —— Prompt 太窄，真正重要的是整个上下文的工程化 [[原文]](https://x.com/karpathy/status/1937902205765607626)

### AI Agent

- **让 AI Agent 连续跑两天，改了 700 处代码，发现 20 个改进** —— 实测 AI 已经能做持续自主迭代 [[原文]](https://x.com/minchoi/status/2031580645718143054)
- **目标：让 Agent 无限期自主推进研究** —— 人类的角色是设计 Agent 系统，而不是手动做研究 [[原文]](https://x.com/karpathy/status/2030371219518931079)
- **"Agent 失败源于用户指令差，不是模型能力"** —— 建议用 20 分钟的"宏任务"来委派 [[原文]](https://x.com/rohanpaul_ai/status/2035307167096672567)
- **称 AI Agent 目前是 "slop"** —— 但同时认为问题 10 年内可解 [[原文]](https://x.com/scaling01/status/1979253569309041033)

### 创业与教育

- **Eureka Labs 融资 $180M** —— 目标打造 human-level AI，投资方包括 GV、Sequoia、Index [[原文]](https://x.com/karpathy/status/2016590919143952466)
- **对学校教育委员会："你永远无法检测 AI 做作业"** —— 教育需要适应 AI，而不是对抗它 [[原文]](https://x.com/karpathy/status/1993010584175141038)
- **发布 AI 职业影响评分工具** —— 基于 342 个职业数据，评估 AI 对每个工种的替代程度 [[原文]](https://x.com/rohanpaul_ai/status/2033124688470409321)

### 思维模型

- **"别把 LLM 当实体，把它当模拟器"** —— 探索话题时不要问"你怎么看"，要用模拟思维 [[原文]](https://x.com/karpathy/status/1997731268969304070)
- **"Software 2.0：能自动化你能验证的一切"** —— 用目标函数代替手写规则 [[原文]](https://x.com/karpathy/status/1990116666194456651)
- **"Intelligence brownouts"** —— 当前沿 AI 宕机时，地球会"掉 IQ 点数" [[原文]](https://x.com/karpathy/status/2031792523187040643)

---

## 进阶：搜索语法速查

XCrawl 的搜索走的是 Google 搜索引擎，你在跟 Claude Code 对话时可以直接用这些高级语法让搜索更精准：

| 语法 | 作用 | 提示词示例 |
|------|------|-----------|
| `site:x.com` | 限定 X 平台 | "搜索 X 上关于 AI 的内容" |
| `from:username` | 限定作者 | "搜索 Karpathy 发的推文" |
| `-"RT @"` | 排除转发 | "只搜原创，不要转发" |
| `"A" OR "B"` | 组合关键词 | "搜 vibe coding 或 AI agent 相关的" |
| `after:2026-01-01` | 时间范围 | "只搜 2026 年以后的" |
| `-hiring -job` | 排除关键词 | "排除招聘相关的内容" |

你不需要记住这些语法——直接用自然语言告诉 Claude Code 你想搜什么，它会自动组合正确的搜索语法。

---

## 完整流程回顾

```
在 Claude Code 里说你想了解谁、什么话题
       ↓
Claude Code 自动调用 XCrawl 搜索采集
       ↓
继续说"抓取重点推文全文"（可选）
       ↓
继续说"整理分析，生成报告"
       ↓
一份结构化的观点报告自动保存到本地
```

五步下来，从"我想知道 Karpathy 最近在聊什么"到"一份按话题分类的观点报告"，全程 10 分钟——你只需要说话，不需要打开终端、不需要敲命令、不需要手动整理。

如果你每周跑一次，一个月就能积累起一个高质量的 AI 行业观点数据库——不用刷信息流，不用手动整理，Claude Code + XCrawl，全自动。

---

> 注册 XCrawl 送 1,000 免费 credits，不绑卡 → [xcrawl.com](https://www.xcrawl.com/)

