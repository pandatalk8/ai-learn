# 用 Claude Code 实现 Markdown 自动排版与微信公众号发布

用 Markdown 写完文章后，一句话就能完成排版、图片上传、封面生成、发布到公众号草稿箱——整个流程不需要打开任何网页编辑器。

本文记录我目前在用的方案，基于 Claude Code + 三个自定义 Skill + 一个 MCP 服务器。

## 整体架构

```
Markdown 文章
    │
    ├── 1. doocs-md MCP ──→ 渲染为带样式的 HTML
    │
    ├── 2. R2 Upload Skill ──→ 图片上传到 Cloudflare R2 CDN
    │
    ├── 3. WeChat Cover Skill ──→ 生成公众号封面图
    │
    └── 4. WeChat Publisher Skill ──→ 发布到公众号草稿箱
```

四个组件各司其职，由 Claude Code 在对话中自动编排调用。

---

## 一、Markdown 排版：doocs-md MCP 服务器

### 它做什么

[doocs/md](https://github.com/doocs/md) 是一个开源的微信公众号 Markdown 编辑器。我们用的是它的 MCP Server 版本，可以直接在 Claude Code 中调用 Markdown 渲染能力，将 Markdown 转换为带样式的 HTML。

### 安装

```bash
# 克隆仓库
git clone https://github.com/doocs/md.git ~/tools/doocs-md

# 安装依赖
cd ~/tools/doocs-md
pnpm install
```

### 注册 MCP 服务器

在 Claude Code 中注册 doocs-md 为 MCP 服务器：

```bash
claude mcp add doocs-md \
  npx --prefix ~/tools/doocs-md/packages/mcp-server \
  tsx ~/tools/doocs-md/packages/mcp-server/src/index.ts
```

注册后可以验证连接状态：

```bash
claude mcp list
# 输出：doocs-md: npx --prefix ... ✓ Connected
```

### 提供的工具

注册成功后，Claude Code 中会多出以下 MCP 工具：

| 工具 | 功能 |
|------|------|
| `render_markdown` | 将 Markdown 渲染为带样式的 HTML |
| `list_themes` | 列出可用主题 |
| `get_renderer_options` | 查看所有渲染配置项 |

### 可用主题

| 主题 ID | 名称 | 作者 |
|---------|------|------|
| `default` | 经典 | 官方 |
| `grace` | 优雅 | @brzhang |
| `simple` | 简洁 | @okooo5km |

### 可用字体

| 名称 | 类型 |
|------|------|
| 无衬线 | -apple-system-font, Helvetica Neue, PingFang SC, Arial, sans-serif |
| 衬线 | Optima, PingFang SC light, Georgia, Times New Roman, serif |
| 等宽 | Menlo, Monaco, Courier New, monospace |

### 修改默认配置

主题、字体、主题色的默认值在源码中配置：

```
~/tools/doocs-md/packages/shared/src/configs/style.ts
```

关键配置项：

```typescript
export const defaultStyleConfig = {
  theme: themeOptions[2].value,        // simple（简洁）
  fontFamily: fontFamilyOptions[1].value, // 衬线字体
  primaryColor: colorOptions[8].value,    // 石墨黑 #333333
  fontSize: fontSizeOptions[2].value,     // 16px
  // ...
}
```

主题色选项：

| 名称 | 色值 |
|------|------|
| 经典蓝 | `#0F4C81` |
| 翡翠绿 | `#009874` |
| 活力橘 | `#FA5151` |
| 薰衣紫 | `#92617E` |
| 天空蓝 | `#55C9EA` |
| 玫瑰金 | `#B76E79` |
| 橄榄绿 | `#556B2F` |
| 石墨黑 | `#333333` |
| 樱花粉 | `#FFB7C5` |

### 渲染参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | string | simple | 主题 |
| `isMacCodeBlock` | boolean | false | 代码块 macOS 风格标题栏 |
| `isShowLineNumber` | boolean | false | 代码块显示行号 |
| `citeStatus` | boolean | false | 链接转脚注引用 |
| `countStatus` | boolean | false | 文首显示阅读时长 |

### 关于微信兼容性的重要说明

doocs-md 渲染出的 HTML 使用 CSS 类名 + `<style>` 标签定义样式。但微信公众号编辑器会**剥离 `<style>` 标签和 `class` 属性**，只保留内联的 `style="..."` 属性。

因此，发布到公众号时需要将所有样式内联到每个 HTML 元素上。Claude Code 在实际发布流程中会自动处理这个转换。

---

## 二、图片上传：R2 Upload Skill

### 它做什么

将本地图片上传到 Cloudflare R2 对象存储，返回 CDN URL，用于替换 Markdown 中的本地图片路径。

### 为什么需要它

微信公众号无法加载本地图片路径（如 `../images/xxx.png`）。虽然发布脚本会自动将外部 URL 图片下载后上传到微信图床，但先传到自己的 CDN 有两个好处：

1. 文章的 Markdown 源文件中保留的是永久可访问的 CDN 链接
2. 同一张图可以复用于博客、社交媒体等其他渠道

### Skill 文件结构

```
~/.claude/skills/r2-image-upload/
├── SKILL.md              # Skill 描述文件
├── config/
│   └── .env              # R2 凭证配置
└── scripts/
    ├── package.json      # 依赖声明（@aws-sdk/client-s3）
    └── upload.mjs        # 上传脚本
```

### 配置 R2 凭证

编辑 `~/.claude/skills/r2-image-upload/config/.env`：

```env
R2_ACCOUNT_ID=你的AccountID
R2_ACCESS_KEY_ID=你的AccessKeyID
R2_SECRET_ACCESS_KEY=你的SecretAccessKey
R2_BUCKET=你的bucket名称
R2_PUBLIC_URL=https://你的CDN域名
```

凭证在 Cloudflare Dashboard → R2 → Manage R2 API Tokens 中创建。

### 安装依赖

```bash
cd ~/.claude/skills/r2-image-upload/scripts
npm install
```

### 使用方式

**手动命令行调用：**

```bash
node ~/.claude/skills/r2-image-upload/scripts/upload.mjs \
  <图片路径> \
  [article-slug] \
  [自定义文件名]
```

示例：

```bash
node upload.mjs ./images/architecture.png advisor-strategy architecture.png
# 输出: https://article-images.xlearnity.ai/advisor-strategy/architecture.png
```

**在 Claude Code 中使用：**

直接告诉 Claude Code 上传图片即可，它会自动调用这个 Skill：

```
把 images/advisor-strategy/ 目录下的图片上传到 R2
```

### Article Slug 规则

上传时的 `article-slug` 作为 R2 key 的前缀目录，建议用英文短横线格式：

- `李一舟商业分析` → `li-yizhou-business-analysis`
- `Claude Code 教程` → `claude-code-tutorial`

---

## 三、微信公众号发布：WeChat Publisher Skill

### 它做什么

将 HTML 文章内容通过微信公众号 API 发布到草稿箱。自动处理封面图上传、文章内图片上传和 URL 替换。

### Skill 文件结构

```
~/.claude/skills/wechat-publisher/
├── SKILL.md
├── .env                  # 微信公众号凭证
├── references/
│   └── api_reference.md  # API 文档参考
└── scripts/
    └── publish_to_wechat.py  # 发布脚本（纯 Python，无额外依赖）
```

### 配置微信凭证

编辑 `~/.claude/skills/wechat-publisher/.env`：

```env
WECHAT_APPID=你的AppID
WECHAT_APPSECRET=你的AppSecret
```

在微信公众平台 → 开发 → 基本配置中获取。

**注意**：需要将你的服务器 IP 加入微信公众平台的 IP 白名单（开发 → 基本配置 → IP 白名单）。

### 使用方式

**命令行调用：**

```bash
python3 ~/.claude/skills/wechat-publisher/scripts/publish_to_wechat.py \
  --html article.html \
  --title "文章标题" \
  --author "作者名" \
  --digest "文章摘要" \
  --thumb cover.jpg \
  --source-url "https://原文链接"
```

**参数说明：**

| 参数 | 必填 | 说明 |
|------|------|------|
| `--html` | 是 | HTML 文件路径 |
| `--title` | 是 | 标题，最多 32 字符 |
| `--author` | 否 | 作者名，最多 16 字符 |
| `--digest` | 否 | 摘要，最多 128 字符 |
| `--thumb` | 否 | 封面图路径（强烈建议提供） |
| `--source-url` | 否 | "阅读原文"链接 |
| `--open-comment` | 否 | 是否开启评论（0/1） |

### 发布脚本工作流程

1. **获取 access_token** — 用 AppID + AppSecret 换取临时令牌
2. **上传封面图** — 作为永久素材上传，获取 `thumb_media_id`
3. **处理文章内图片** — 扫描 HTML 中所有 `<img>` 标签：
   - 外部 URL → 下载 → 上传到微信图床 → 替换为微信 URL
   - 本地路径 → 直接上传 → 替换
   - 微信图床 URL（`mmbiz.qpic.cn`）→ 跳过
4. **清理 HTML** — 移除 `class`、`id` 属性（保留 `style`）
5. **创建草稿** — 调用 `draft/add` 接口

### 封面图生成（附赠）

项目还包含一个封面图生成 Skill：

```
~/.claude/skills/wechat-cover/
└── scripts/
    └── generate_cover.py  # 基于 Playwright 截图
```

生成 1600×640px 的封面图，黑底 + 渐变色文字：

```bash
python3 ~/.claude/skills/wechat-cover/scripts/generate_cover.py \
  --title "大标题" \
  --subtitle "小标题" \
  --output cover.jpg
```

依赖 Playwright：

```bash
pip install playwright
python3 -m playwright install chromium
```

---

## 完整发布流程示例

以下是在 Claude Code 中发布一篇文章的典型对话：

### 第一步：写好 Markdown 文章

文章保存在仓库中，图片放在 `images/` 目录下。

### 第二步：一句话发布

```
把 AI技术/Advisor策略.md 排版后发布到微信公众号草稿箱
```

Claude Code 会自动执行以下步骤：

1. 读取 Markdown 文件
2. 将本地图片上传到 R2，获取 CDN URL
3. 调用 doocs-md 渲染为带样式的 HTML
4. 将 CSS 样式内联到每个 HTML 元素（微信兼容）
5. 生成封面图
6. 调用微信 API 发布到草稿箱

```
[UPLOAD] 4 张图片上传到 R2 ✓
[RENDER] doocs-md 渲染完成 ✓
[COVER] 封面图生成 ✓
[DRAFT] 草稿创建成功 media_id: ACTAkw... ✓
```

### 第三步：去公众号后台预览

登录微信公众平台 → 草稿箱，检查排版效果，确认无误后发布。

---

## 环境依赖汇总

| 组件 | 依赖 |
|------|------|
| doocs-md MCP | Node.js, pnpm, tsx |
| R2 Upload | Node.js, @aws-sdk/client-s3 |
| WeChat Publisher | Python 3（标准库，无额外依赖） |
| WeChat Cover | Python 3, Playwright + Chromium |
| Claude Code | Anthropic 订阅 |

## 常见问题

**Q: 发布后公众号文章没有样式？**
A: 微信会剥离 `<style>` 标签和 class 属性。确保所有样式以内联 `style="..."` 写在元素上。

**Q: 图片上传失败？**
A: 检查 R2 凭证是否正确，或微信内联图片是否超过 1MB（微信限制）。

**Q: 报错 40164 IP not in whitelist？**
A: 将你的公网 IP 加入微信公众平台 → 开发 → 基本配置 → IP 白名单。

**Q: 报错 40001 invalid credential？**
A: AppSecret 错误或 access_token 已过期（有效期 2 小时）。
