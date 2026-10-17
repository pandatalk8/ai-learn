# baoyu-skills：让 Claude Code 拥有超能力的技能插件集合

> 作者：baoyu（JimLiu）开源项目介绍
> GitHub：https://github.com/JimLiu/baoyu-skills
> Stars：4.9k | Forks：540

---

## 什么是 baoyu-skills？

Claude Code 是 Anthropic 推出的 AI 编程助手，而 **baoyu-skills** 是一套专为 Claude Code 打造的技能插件集合，由 JimLiu（爆鱼）开源维护。这个项目通过扩展 Claude Code 的 Skills（技能）机制，让原本以编程为主的 AI 助手，获得了内容创作、图像生成、社交媒体发布等一系列强大的新能力。

项目目前在 GitHub 上已获得 **4.9k Stars**，是 Claude Code 生态中最受欢迎的第三方技能集之一。

---

## 核心功能模块

baoyu-skills 将所有技能分为三大类：

### 1. content-skills（内容创作技能）

这是整个集合的核心，涵盖从图文创作到社交媒体发布的完整工作流。

#### 小红书图片生成（baoyu-xhs-images）

采用「**风格 × 布局**」二维设计系统：

- **9 种视觉风格**：可爱、清新、温暖、大胆、极简、复古、波普、Notion、黑板
- **6 种信息密度布局**：从图文稀疏到内容密集，适配不同内容量
- 一次生成 1-10 张卡通风格的竖版图片，专为小红书平台优化
- 适合种草内容、知识科普、干货分享等场景

**使用示例：**
```
帮我把这篇关于"Python 学习路径"的文章生成为小红书图片系列，
风格选清新，布局用中等密度，共 5 张
```

---

#### 专业信息图（baoyu-infographic）

- **20 种布局类型**：金字塔、维恩图、流程图、时间轴、矩阵、雷达图等
- **17 种视觉风格**：商务简约、科技感、手绘、杂志等多元风格
- 自动分析内容，推荐最合适的布局与风格组合
- 生成可直接发布的高质量信息图

**使用示例：**
```
把这份产品对比数据做成信息图，帮我推荐合适的布局风格
```

---

#### 封面图生成（baoyu-cover-image）

采用「**五维系统**」精准控制封面风格：

| 维度 | 选项示例 |
|------|----------|
| 类型 | 文章封面、视频缩略图、公众号首图 |
| 色调 | 9 种调色板（暖色、冷色、莫兰迪等） |
| 渲染风格 | 6 种渲染方式（插画、写实、扁平等） |
| 文字处理 | 标题突出、留白、排版风格 |
| 情绪氛围 | 专业、活泼、神秘、温馨等 |

支持宽屏（16:9）、正方形（1:1）、电影比例（2.35:1）等多种尺寸。

---

#### 幻灯片生成（baoyu-slide-deck）

- 从 Markdown 内容自动生成专业 PPT 风格的幻灯片图片
- **四维风格系统**：纹理、情绪、字体、信息密度
- 提供 14+ 种预设组合，一键生成完整演示文稿
- 适合技术分享、产品介绍、课程教学等场景

---

#### 知识漫画（baoyu-comic）

- 将知识内容转化为分镜漫画
- 支持多种画风选择（写实、卡通、极简线条等）
- 支持多种叙事基调（幽默、严肃、科普等）
- 自动规划分镜，逐格生成图像，适合寓教于乐的内容创作

---

#### 文章配图（baoyu-article-illustrator）

- 分析文章结构，自动识别需要插图的位置
- 采用「**类型 × 风格**」二维系统生成配图
- 批量为长文添加合适的视觉辅助，提升可读性

---

#### 社交媒体发布

- **发布到 X（Twitter）**（baoyu-post-to-x）：支持普通推文和 X Article 长文，可附带图片/视频
- **发布到微信公众号**（baoyu-post-to-wechat）：支持文章（HTML/Markdown/纯文本）和图文贴图两种格式

---

### 2. ai-generation-skills（AI 生成后端）

提供图像和内容生成的底层能力，支持多个 API 平台：

- **OpenAI**（DALL-E 3）
- **Google Gemini**（含视觉输入）
- **阿里云 DashScope**

技能列表：
- **baoyu-image-gen**：文本生图，支持参考图、自定义比例、多服务商切换
- **baoyu-danger-gemini-web**：通过逆向 Gemini Web API 实现图文生成，支持多轮对话

---

### 3. utility-skills（实用工具技能）

一组内容处理工具，用于日常工作流提效：

| 技能 | 功能 |
|------|------|
| baoyu-url-to-markdown | 抓取任意网页并转换为 Markdown，支持需登录的页面 |
| baoyu-danger-x-to-markdown | 将 X/Twitter 推文转为带 YAML 元数据的 Markdown |
| baoyu-compress-image | 图片压缩，默认转 WebP，支持 PNG 输出 |
| baoyu-format-markdown | 自动为文章添加 frontmatter、标题、摘要、章节标题等格式 |

---

## 安装方法

### 方式一：一键安装全部技能（推荐）

```bash
npx skills add jimliu/baoyu-skills
```

### 方式二：通过 Claude Code 插件市场

在 Claude Code 中输入：

```
/plugin marketplace add jimliu/baoyu-skills
```

然后在界面中选择要安装的具体技能包（content-skills、ai-generation-skills、utility-skills）。

### 方式三：直接告诉 Claude Code

打开 Claude Code，直接说：

```
帮我从 jimliu/baoyu-skills 安装技能
```

Claude Code 会引导你完成安装流程。

---

## 配置 API Key

部分 AI 生成功能需要配置第三方 API 密钥。支持两种配置位置：

**用户级配置**（对所有项目生效）：
```
~/.baoyu-skills/.env
```

**项目级配置**（仅对当前项目生效）：
```
.baoyu-skills/.env
```

`.env` 文件示例：
```env
OPENAI_API_KEY=sk-xxxx
GOOGLE_API_KEY=AIzaxxxx
DASHSCOPE_API_KEY=sk-xxxx
```

命令行传入的变量优先级最高，可覆盖配置文件中的值。

---

## 自定义扩展

每个技能都支持通过 `EXTEND.md` 文件进行个性化覆盖：

- **项目级扩展**：在项目根目录创建 `.baoyu-skills/EXTEND.md`
- **用户级扩展**：在 `~/.baoyu-skills/EXTEND.md` 中定义个人偏好的预设

例如，你可以在 `EXTEND.md` 中定义专属的配色方案、字体风格，或特定品牌的设计规范，让所有生成内容自动遵循你的风格。

---

## 更新技能

在 Claude Code 的插件管理界面中选择「Update marketplace」，或开启自动更新功能，即可获取最新版本的技能。

---

## 适合谁用？

| 用户类型 | 推荐技能 |
|----------|----------|
| 内容创作者 / 博主 | xhs-images、infographic、cover-image |
| 技术写作者 | article-illustrator、format-markdown、url-to-markdown |
| 课程设计者 | slide-deck、comic、infographic |
| 社交媒体运营 | post-to-x、post-to-wechat、xhs-images |
| 开发者 / 效率极客 | 全套 utility-skills |

---

## 总结

baoyu-skills 把 Claude Code 从一个「编程助手」变成了一个「全能内容工作台」。无论是做小红书、写公众号、做 PPT、画漫画，还是批量处理图片、抓取网页，都能通过一句自然语言指令完成。

对于重度使用 Claude Code 的用户，这套技能集几乎是必装的生产力扩展。

---

**项目地址：** https://github.com/JimLiu/baoyu-skills

**安装命令：**
```bash
npx skills add jimliu/baoyu-skills
```
