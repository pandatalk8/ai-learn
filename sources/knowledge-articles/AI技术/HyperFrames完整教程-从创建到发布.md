# HyperFrames 完整教程：创建视频、配音、剪辑、合成与发布

作者：Mr. Panda

---

## 前言

HeyGen 推出的 HyperFrames 是一个开源框架，核心理念极其简单：**用 HTML 写视频**。你定义一个 HTML 文件，用 CSS 控制外观，用 GSAP 控制动画，用 `data-*` 属性标记时间轴——框架负责把它渲染成 MP4。

这不是一个视频剪辑软件，而是一套面向开发者和 AI 智能体的视频生产管线。它的设计哲学是：

- **开发者友好**：你已经会的技术栈（HTML、CSS、JavaScript），就是你的视频编辑器
- **AI 原生**：CLI 全部基于命令行标志驱动，没有交互式提示，LLM 可以直接生成组合
- **确定性渲染**：相同的输入永远产出相同的输出，基于 Chrome 的 `beginFrame` API 逐帧捕获

本教程基于 [HyperFrames 官方文档](https://hyperframes.heygen.com/introduction)，覆盖从零开始创建项目到最终渲染发布的完整流程。

---

## 目录

1. [环境准备与安装](#一环境准备与安装)
2. [核心概念速览](#二核心概念速览)
3. [创建视频项目](#三创建视频项目)
4. [编写 Composition（组合）](#四编写-composition组合)
5. [添加动画效果](#五添加动画效果)
6. [配音与语音合成](#六配音与语音合成)
7. [添加字幕与同步](#七添加字幕与同步)
8. [多场景剪辑与转场](#八多场景剪辑与转场)
9. [合成与渲染](#九合成与渲染)
10. [发布与交付](#十发布与交付)
11. [完整案例：从网站到宣传视频](#十一完整案例从网站到宣传视频)
12. [AI 智能体辅助工作流](#十二ai-智能体辅助工作流)
13. [常见问题与排错](#十三常见问题与排错)

---

## 一、环境准备与安装

### 1.1 前置条件

| 工具 | 最低版本 | 用途 | 安装验证 |
|------|---------|------|---------|
| Node.js | 22+ | 运行框架 | `node --version` |
| FFmpeg | 最新稳定版 | 视频编码 | `ffmpeg -version` |
| npm 或 bun | 随 Node 附带 | 包管理 | `npm --version` |
| Chrome | 自动下载 | 帧捕获引擎 | 框架内置 Puppeteer |
| Docker（可选） | 最新版 | 跨平台一致渲染 | `docker --version` |

### 1.2 安装 CLI

```bash
# 全局安装
npm install -g hyperframes

# 或者按需使用 npx（推荐）
npx hyperframes --help
```

### 1.3 环境诊断

安装完成后，运行内置诊断命令检查依赖是否就绪：

```bash
npx hyperframes doctor
```

该命令会检查 Node.js、FFmpeg、FFprobe、Chrome 和 Docker 的可用状态，给出明确的通过/失败报告。

### 1.4 安装 AI 技能包（可选但推荐）

如果你使用 Claude Code、Cursor 或 Codex 等 AI 编码工具，安装技能包可以让 AI 理解 HyperFrames 的规则：

```bash
npx skills add heygen-com/hyperframes
```

安装后会注册以下 slash 命令：

| 命令 | 用途 |
|------|------|
| `/hyperframes` | 组合创作（HTML、时间、字幕、TTS、转场） |
| `/hyperframes-cli` | 开发工具（init、lint、preview、render） |
| `/hyperframes-media` | 资源预处理（TTS、转录、背景移除） |
| `/hyperframes-registry` | 组件/区块安装 |
| `/website-to-hyperframes` | 网站转视频自动化 |
| `/gsap` | GSAP 动画 API |

---

## 二、核心概念速览

开始动手之前，理解三个核心概念：

### 2.1 Composition（组合）

一个 HTML 文件就是一个视频的源文件。根元素必须包含以下属性：

```html
<div id="root" 
     data-composition-id="my-video"
     data-start="0" 
     data-width="1920" 
     data-height="1080">
  <!-- 视频内容在这里 -->
</div>
```

- `data-composition-id`：唯一标识符（必填）
- `data-width` / `data-height`：画布尺寸（像素）
- `data-start`：起始时间（秒）

### 2.2 Clip（片段）

每个带时间信息的 HTML 元素就是一个 Clip。通过 `data-*` 属性控制它的时间行为：

```html
<h1 id="title" class="clip"
    data-start="0" 
    data-duration="5" 
    data-track-index="0">
  Hello World
</h1>
```

- `data-start`：开始时间（秒）
- `data-duration`：持续时长（秒，图片和文本必填，视频可选）
- `data-track-index`：轨道编号，控制 z 轴层叠顺序（数字越大越靠前）
- `class="clip"`：标记为定时元素（必须添加）

### 2.3 Timeline（时间线）

用 GSAP 创建的动画时间线，注册到 `window.__timelines` 上。框架在渲染时通过 seek 精确定位到每一帧：

```javascript
const tl = gsap.timeline({ paused: true });
tl.from("#title", { opacity: 0, y: -50, duration: 1 }, 0);

window.__timelines = window.__timelines || {};
window.__timelines["my-video"] = tl;
```

**关键规则**：时间线必须以 `{ paused: true }` 创建——框架控制播放，你只负责定义动画。

### 2.4 支持的片段类型

| 类型 | HTML 元素 | 说明 |
|------|----------|------|
| 视频 | `<video>` | 素材片段，必须加 `muted` 属性 |
| 图片 | `<img>` | 静态内容，必须设置 `data-duration` |
| 音频 | `<audio>` | 背景音乐、音效、旁白 |
| 文本 | `<h1>`、`<p>` 等 | 标题、字幕、文案 |
| 嵌套组合 | `<div>` + `data-composition-id` | 引用其他组合 |

---

## 三、创建视频项目

### 3.1 初始化项目

```bash
npx hyperframes init my-video
cd my-video
```

非交互模式（适合脚本或 CI）：

```bash
npx hyperframes init my-video --non-interactive --example blank
```

使用内置模板初始化：

```bash
# 使用 warm-grain 模板（暖色调带颗粒质感）
npx hyperframes init my-video --example warm-grain

# 带视频素材初始化（自动转录和字幕）
npx hyperframes init my-video --example warm-grain --video ./intro.mp4
```

### 3.2 项目结构

```
my-video/
├── meta.json              # 项目元数据
├── index.html             # 根组合入口（时间线编排）
├── compositions/          # 子组合目录（每个场景一个 HTML）
├── assets/                # 媒体资源（图片、视频、音频、字体）
├── narration.wav          # 旁白音频（第 5 步生成）
├── narration.txt          # 旁白文本
├── transcript.json        # 逐字时间戳
├── DESIGN.md              # 视觉设计规范
├── SCRIPT.md              # 脚本/旁白文案
├── STORYBOARD.md          # 分镜脚本
├── snapshots/             # 验证截图
└── renders/               # 渲染输出
```

### 3.3 内置模板一览

**横版模板（1920×1080）：**

| 模板名 | 风格 |
|--------|------|
| `warm-grain` | 奶油色调 + 胶片颗粒质感 |
| `play-mode` | 活力弹性动画 |
| `swiss-grid` | 瑞士风格网格布局 |
| `kinetic-type` | 戏剧性文字动画 |
| `decision-tree` | 动画流程图（适合讲解） |
| `product-promo` | 多场景产品展示 |
| `nyt-graph` | 纽约时报风格数据可视化 |
| `blank` | 最小骨架 |

**竖版模板（1080×1920）：**

| 模板名 | 风格 |
|--------|------|
| `vignelli` | 粗体排版 + 红色点缀 |

### 3.4 启动预览

```bash
npx hyperframes preview
```

这会启动 HyperFrames Studio，在浏览器中打开可视化编辑器，支持热重载——你修改 `index.html`，浏览器自动刷新。

---

## 四、编写 Composition（组合）

### 4.1 最小可运行组合

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: #1a1a2e; }
    #title {
      font-size: 72px;
      color: white;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Inter', sans-serif;
    }
  </style>
</head>
<body>
  <div id="root" data-composition-id="hello"
       data-start="0" data-width="1920" data-height="1080">

    <h1 id="title" class="clip"
        data-start="0" data-duration="5" data-track-index="0">
      Hello, HyperFrames!
    </h1>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#title", { opacity: 0, y: -50, duration: 1 }, 0);
    window.__timelines = window.__timelines || {};
    window.__timelines["hello"] = tl;
  </script>
</body>
</html>
```

### 4.2 添加视频素材

```html
<video id="bg-video" class="clip"
       data-start="0" data-duration="10" data-track-index="0"
       src="assets/background.mp4" muted
       style="width: 1920px; height: 1080px; object-fit: cover;">
</video>
```

**注意**：视频元素必须加 `muted` 属性。音频通过独立的 `<audio>` 元素播放，让渲染器能独立混音。

### 4.3 添加图片

```html
<img id="logo" class="clip"
     data-start="1" data-duration="4" data-track-index="1"
     src="assets/logo.png"
     style="position: absolute; top: 40px; right: 40px; width: 120px;">
```

图片必须显式设置 `data-duration`。

### 4.4 添加背景音乐

```html
<audio id="bgm" class="clip"
       data-start="0" data-duration="30" data-track-index="0"
       data-volume="0.3"
       src="assets/music.mp3">
</audio>
```

`data-volume` 取值 0 到 1，控制音量大小。

### 4.5 相对时间定位

除了用绝对秒数，你还可以用片段 ID 做相对定位：

```html
<!-- 片段 A 播完后立即开始 -->
<div id="scene-2" class="clip"
     data-start="scene-1" data-duration="5" data-track-index="0">
</div>

<!-- 片段 A 播完后 2 秒开始 -->
<div id="scene-3" class="clip"
     data-start="scene-1 + 2" data-duration="5" data-track-index="0">
</div>

<!-- 片段 A 结束前 0.5 秒开始（叠加效果，需不同轨道） -->
<div id="overlay" class="clip"
     data-start="scene-1 - 0.5" data-duration="3" data-track-index="1">
</div>
```

### 4.6 媒体裁剪

使用 `data-media-start` 控制媒体的播放起点：

```html
<!-- 从视频的第 10 秒开始播放，持续 5 秒 -->
<video id="clip" class="clip"
       data-start="0" data-duration="5" data-track-index="0"
       data-media-start="10"
       src="assets/footage.mp4" muted>
</video>
```

### 4.7 嵌套子组合

将复杂场景拆分为独立的 HTML 文件，通过 `data-composition-src` 引用：

```html
<div id="intro-scene" class="clip"
     data-composition-id="intro"
     data-composition-src="compositions/intro.html"
     data-start="0" data-duration="10" data-track-index="0">
</div>
```

---

## 五、添加动画效果

### 5.1 GSAP 动画基础（推荐方案）

HyperFrames 推荐使用 GSAP 做动画，因为它支持精确的 seek 操作，完美匹配逐帧渲染的需求。

**加载 GSAP：**

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
```

**创建时间线的三条铁律：**

1. 必须使用 `{ paused: true }` 创建——框架控制播放
2. 必须注册到 `window.__timelines["compositionId"]`——框架通过它找到时间线
3. 必须用位置参数（第三个参数）指定绝对时间——`tl.to(el, vars, 1.5)` 表示在 1.5 秒处开始

### 5.2 四种动画方法

```javascript
const tl = gsap.timeline({ paused: true });

// to：从当前状态过渡到目标状态
tl.to("#title", { opacity: 1, x: 0, duration: 0.8 }, 0);

// from：从指定状态过渡到当前状态
tl.from("#subtitle", { opacity: 0, y: 30, duration: 0.6 }, 0.5);

// fromTo：完全控制起始和结束状态
tl.fromTo("#logo", 
  { scale: 0, rotation: -180 }, 
  { scale: 1, rotation: 0, duration: 1 }, 
  1);

// set：瞬间设置属性（无过渡）
tl.set("#cta", { visibility: "visible" }, 3);
```

### 5.3 常用动画属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `opacity` | 透明度 | `{ opacity: 0 }` |
| `x` / `y` | 水平/垂直位移 | `{ x: 100, y: -50 }` |
| `scale` | 缩放 | `{ scale: 0.5 }` |
| `rotation` | 旋转角度 | `{ rotation: 360 }` |
| `color` | 文字颜色 | `{ color: "#ff6b6b" }` |
| `backgroundColor` | 背景色 | `{ backgroundColor: "#000" }` |
| `width` / `height` | 尺寸 | `{ width: "200px" }` |
| `visibility` | 可见性 | `{ visibility: "hidden" }` |

### 5.4 缓动函数速查

自然语言描述和对应的 GSAP 缓动函数：

| 效果 | GSAP 缓动 | 适用场景 |
|------|----------|---------|
| 平滑 | `power2.out` | 自然减速，通用 |
| 干脆利落 | `power4.out` | 快速精准 |
| 弹跳 | `back.out` | 超调后回弹 |
| 弹簧 | `elastic.out` | 振荡入位 |
| 戏剧化 | `expo.out` | 快速加速、缓慢滑行 |
| 梦幻 | `sine.inOut` | 缓慢对称运动 |

### 5.5 时间线时长管理

组合的实际时长取决于时间线的总时长。如果你的视频素材是 30 秒，但最后一个 GSAP 动画在第 8 秒结束，那组合只有 8 秒。

**解决方法**：用一个空的 `set` 将时间线延长到目标时长：

```javascript
// 确保时间线总时长为 30 秒
tl.set({}, {}, 30);
```

### 5.6 其他支持的动画运行时

除了 GSAP，HyperFrames 还支持：

| 运行时 | 集成方式 |
|--------|---------|
| **Anime.js** | 使用 `instance.seek(timeMs)` |
| **CSS Keyframes** | 通过 `Animation.currentTime` |
| **Lottie / dotLottie** | 使用 `goToAndStop()` |
| **Three.js / WebGL** | 监听 `hf-seek` 事件 |
| **Web Animations API** | 通过 `document.getAnimations()` |

### 5.7 动画注意事项

- 不要在脚本中控制媒体播放——框架自动处理
- 不要直接在 `<video>` 元素上动画 `width`/`height`/`top`/`left`——包一层 `<div>` 再动画
- 不要创建非暂停的时间线
- 不要使用 `async`/`await` 或 `fetch()` 构建时间线——必须同步完成
- 不要使用 `Math.random()`——会破坏确定性渲染，需要随机效果请用带种子的伪随机函数

---

## 六、配音与语音合成

配音是七步生产管线的第五步，但它直接决定了整个视频的节奏和时长。

### 6.1 准备旁白文本

创建 `narration.txt`，写下旁白文案。注意发音替换——对于缩写和专业术语，写出希望 TTS 朗读的形式：

```
欢迎使用 HyperFrames。
它能让你用 H T M L 写视频，用 C S S 控制外观。
从今天开始，你的网页就是你的视频编辑器。
```

> 「API」写成「A P I」，「CSS」写成「C S S」——这样 TTS 会逐字母朗读而不是把它当成一个词。

### 6.2 TTS 语音合成

HyperFrames 支持多种 TTS 提供商：

| 提供商 | 是否需要 API Key | 特点 |
|--------|----------------|------|
| Kokoro | 不需要 | 本地运行，免费，开箱即用 |
| ElevenLabs | 需要 | 高品质，多语言，音色丰富 |
| HeyGen | 需要 | 与 HeyGen 生态集成 |

**使用 Kokoro（本地 TTS）生成旁白：**

如果通过 AI 技能包工作，可以在 AI 编码工具中使用 `/hyperframes-media` 命令请求生成 TTS。

**推荐的 TTS 声音选择：**

| 内容类型 | 推荐声音 |
|---------|---------|
| 产品演示 | `af_heart`、`af_nova` |
| 教程讲解 | `am_adam`、`bf_emma` |
| 营销推广 | `af_sky`、`am_michael` |

### 6.3 生成逐字时间戳

TTS 完成后，需要生成 `transcript.json`——包含每个词的精确起止时间：

```json
[
  { "text": "欢迎", "start": 0.0, "end": 0.35 },
  { "text": "使用", "start": 0.35, "end": 0.62 },
  { "text": "HyperFrames", "start": 0.65, "end": 1.28 },
  { "text": "它", "start": 1.50, "end": 1.58 },
  { "text": "能", "start": 1.58, "end": 1.72 },
  { "text": "让", "start": 1.72, "end": 1.85 },
  { "text": "你", "start": 1.85, "end": 1.98 }
]
```

这个文件是字幕同步和场景切换的时间基准。

### 6.4 将旁白添加到组合

```html
<audio id="narration" class="clip"
       data-start="0" data-track-index="0"
       data-volume="1"
       src="narration.wav">
</audio>
```

### 6.5 配音工作流的三个产出物

| 文件 | 用途 |
|------|------|
| `narration.wav`（或 `.mp3`） | 可交付的音频文件 |
| `narration.txt` | 带发音替换的文本 |
| `transcript.json` | 逐词时间戳数组 |

完成配音后，回过头用 `transcript.json` 中的实际时间戳更新分镜脚本（`STORYBOARD.md`）中每个场景的起止时间——用真实数据替代估算值。

---

## 七、添加字幕与同步

### 7.1 基于时间戳的逐词字幕

利用 `transcript.json` 中的逐词时间戳，为每个词创建精确同步的字幕元素：

```html
<span id="word-1" class="clip caption-word"
      data-start="0.0" data-duration="0.35" data-track-index="2"
      style="position: absolute; bottom: 100px; left: 50%;
             transform: translateX(-50%);
             font-size: 48px; color: white;">
  欢迎
</span>

<span id="word-2" class="clip caption-word"
      data-start="0.35" data-duration="0.27" data-track-index="2">
  使用
</span>
```

### 7.2 卡拉 OK 高亮效果

用 GSAP 实现当前朗读词的高亮：

```javascript
const tl = gsap.timeline({ paused: true });

// 每个词在朗读时变亮、放大
tl.fromTo("#word-1", 
  { color: "rgba(255,255,255,0.5)", scale: 1 },
  { color: "#ffffff", scale: 1.1, duration: 0.1 }, 
  0.0);

tl.fromTo("#word-2", 
  { color: "rgba(255,255,255,0.5)", scale: 1 },
  { color: "#ffffff", scale: 1.1, duration: 0.1 }, 
  0.35);

window.__timelines["my-video"] = tl;
```

### 7.3 字幕风格速查

| 风格 | 字体处理 | 动画方式 | 字号范围 |
|------|---------|---------|---------|
| 亢奋型（Hype） | 粗黑体 | 缩放弹出 | 72–96px |
| 商务型（Corporate） | 简洁无衬线 | 淡入 + 滑动 | 56–72px |
| 教程型（Tutorial） | 等宽字体 | 打字机效果 | 48–64px |
| 叙事型（Storytelling） | 衬线体 | 慢速淡入 | 44–56px |
| 社交型（Social） | 圆润、活泼 | 弹跳 | 56–80px |

### 7.4 手绘标注效果

HyperFrames 支持多种手绘风格的文字强调效果：

| 模式 | 视觉效果 | 适用场景 |
|------|---------|---------|
| `highlight` | 荧光笔划过 | 关键短语 |
| `circle` | 手绘圆圈 | 单个词 |
| `burst` | 放射线条 | 高能量时刻 |
| `scribble` | 涂鸦划线 | 划掉内容 |
| `sketchout` | 矩形边框 | 标注和强调 |

---

## 八、多场景剪辑与转场

### 8.1 场景组织方式

对于多场景视频，建议将每个场景拆分为独立的 HTML 文件，放在 `compositions/` 目录下：

```
compositions/
├── beat-1-hook.html         # 开场钩子
├── beat-2-problem.html      # 问题阐述
├── beat-3-solution.html     # 解决方案
├── beat-4-proof.html        # 证据/数据
└── beat-5-cta.html          # 行动号召
```

在 `index.html` 中按时间编排：

```html
<div id="root" data-composition-id="full-video"
     data-start="0" data-width="1920" data-height="1080">

  <div id="scene-1" class="clip"
       data-composition-id="hook"
       data-composition-src="compositions/beat-1-hook.html"
       data-start="0" data-duration="5" data-track-index="0">
  </div>

  <div id="scene-2" class="clip"
       data-composition-id="problem"
       data-composition-src="compositions/beat-2-problem.html"
       data-start="scene-1" data-duration="8" data-track-index="0">
  </div>

  <div id="scene-3" class="clip"
       data-composition-id="solution"
       data-composition-src="compositions/beat-3-solution.html"
       data-start="scene-2" data-duration="10" data-track-index="0">
  </div>

  <audio id="narration" class="clip"
         data-start="0" data-track-index="1"
         data-volume="1"
         src="narration.wav">
  </audio>

  <audio id="bgm" class="clip"
         data-start="0" data-track-index="2"
         data-volume="0.15"
         src="assets/background-music.mp3">
  </audio>
</div>
```

### 8.2 转场效果

HyperFrames 内置了多种转场效果，通过组件目录安装。按能量级别分类：

| 能量级别 | CSS 转场 | Shader 转场 |
|---------|---------|------------|
| 平静 | 模糊交叉淡化 | 交叉变形 |
| 中等 | 推入滑动 | 甩镜头 |
| 高能量 | 缩放穿越 | 故障、脊状燃烧 |

**按场景情绪选择转场：**

- 温暖品牌 → 柔和过渡
- 科技产品 → 冷调、干净的过渡
- 社交内容 → 活泼弹跳过渡
- 产品发布 → 戏剧性缩放揭示

### 8.3 叠加层与画中画

利用 `data-track-index` 实现多层叠加：

```html
<!-- 轨道 0：背景视频 -->
<video id="bg" class="clip"
       data-start="0" data-duration="15" data-track-index="0"
       src="assets/bg.mp4" muted
       style="width: 1920px; height: 1080px;">
</video>

<!-- 轨道 1：下三分之一标题条 -->
<div id="lower-third" class="clip"
     data-start="3" data-duration="5" data-track-index="1"
     style="position: absolute; bottom: 60px; left: 60px;
            background: rgba(0,0,0,0.7); padding: 16px 32px;
            border-radius: 8px;">
  <p style="color: white; font-size: 24px; margin: 0;">Mr. Panda</p>
  <p style="color: #aaa; font-size: 16px; margin: 4px 0 0 0;">AI 内容创作者</p>
</div>

<!-- 轨道 2：Logo 水印 -->
<img id="watermark" class="clip"
     data-start="0" data-duration="15" data-track-index="2"
     src="assets/logo.png"
     style="position: absolute; top: 30px; right: 30px; width: 80px; opacity: 0.7;">
```

---

## 九、合成与渲染

### 9.1 预览检查

渲染之前，先在浏览器中预览确认效果：

```bash
npx hyperframes preview
```

### 9.2 结构验证

运行 lint 检查 HTML 结构是否合规：

```bash
npx hyperframes lint
```

常见检查项：

- 是否所有定时元素都有 `class="clip"`
- 是否有时间轴重叠冲突
- GSAP 时间线是否正确注册
- `data-*` 属性语义是否正确

### 9.3 运行时验证

检查运行时错误（JS 异常、缺失资源、网络失败）：

```bash
npx hyperframes validate
```

### 9.4 快照抽帧

不做完整渲染，只抽取关键帧截图确认视觉效果：

```bash
# 抽取 5 帧等间距快照
npx hyperframes snapshot my-project --frames 5

# 抽取指定时间点的帧
npx hyperframes snapshot my-project --at 2.9,10.4,18.7
```

### 9.5 渲染输出

```bash
# 标准渲染
npx hyperframes render --output output.mp4

# 指定质量
npx hyperframes render --output output.mp4 --quality high

# 指定帧率
npx hyperframes render --output output.mp4 --fps 60

# 使用 GPU 加速
npx hyperframes render --output output.mp4 --gpu

# 使用 Docker 确保跨平台一致性
npx hyperframes render --output output.mp4 --docker
```

### 9.6 质量预设

| 预设 | CRF 值 | x264 设置 | 适用场景 |
|------|--------|----------|---------|
| `draft` | 28 | ultrafast | 快速迭代、粗略预览 |
| `standard` | 18 | medium | 通用，1080p 下视觉无损 |
| `high` | 15 | slow | 最终交付，接近无损 |

自定义压缩比：

```bash
# 更高质量（CRF 越低质量越高，文件越大）
npx hyperframes render --output output.mp4 --crf 15

# 按目标码率输出
npx hyperframes render --output output.mp4 --video-bitrate 10M
```

### 9.7 输出格式对比

| 格式 | 编解码器 | 透明通道 | 编辑器支持 | 浏览器支持 | 文件大小 |
|------|---------|---------|-----------|-----------|---------|
| **MP4** | H.264 | 不支持 | 全部 | 全部 | 小 |
| **MOV** | ProRes 4444 | 支持 | 全部主流编辑器 | 不支持 | 大 |
| **WebM** | VP9 | 支持 | 编辑器不识别透明 | Chrome, Firefox | 小 |
| **PNG 序列** | RGBA PNG | 支持（无损） | AE, Nuke, Fusion | 不支持 | 最大 |

```bash
# 输出透明背景视频（推荐用 MOV）
npx hyperframes render --format mov --output overlay.mov

# 输出 PNG 序列（用于自定义编码管线）
npx hyperframes render --format png-sequence --output frames/

# 输出 WebM（用于浏览器内嵌）
npx hyperframes render --format webm --output video.webm
```

### 9.8 制作透明背景视频

在 CSS 中不要设置 `html` 和 `body` 的背景色，只保留可见元素：

```html
<style>
  /* html 和 body 不设背景 = 透明 */
  [data-composition-id="my-overlay"] {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
  }
</style>
```

然后用 MOV 格式渲染：

```bash
npx hyperframes render --format mov --output transparent-overlay.mov
```

### 9.9 Worker 与并发配置

渲染器会启动多个 Chrome 进程并行捕获帧：

| 机器规格 | 默认 Workers | 建议调整 |
|---------|-------------|---------|
| 8 核笔记本 | 4 | 默认即可 |
| 12 核+ 工作站 | 4（上限） | 默认即可 |
| 4 核笔记本 | 2 | 默认即可 |
| 2 核虚拟机 | 1 | `--workers 1` |

短视频（< 60 帧）建议用 `--workers 1`，启动开销大于并行收益。

### 9.10 性能优化建议

渲染速度受 CSS 复杂度影响。高消耗模式排序：

1. **`backdrop-filter: blur()`** —— 最昂贵，叠加层控制在 2–3 层以内
2. **元素滤镜和阴影** —— 规模化后性能下降明显
3. **高分辨率图片** —— 源图片尺寸不超过画布的 2 倍

开发阶段用 `draft` 质量快速迭代，交付阶段再切到 `standard` 或 `high`。

---

## 十、发布与交付

### 10.1 本地导出

渲染完成后，MP4 文件在 `renders/` 目录或 `--output` 指定的路径：

```bash
# 渲染到指定路径
npx hyperframes render --output ~/Desktop/final-video.mp4 --quality high
```

### 10.2 适配不同平台的参数

| 平台 | 分辨率 | 宽高比 | 建议时长 |
|------|--------|--------|---------|
| YouTube | 1920×1080 | 16:9 | 不限 |
| TikTok | 1080×1920 | 9:16 | 15–60 秒 |
| Instagram Reels | 1080×1920 | 9:16 | 15–90 秒 |
| Twitter/X | 1920×1080 或 1080×1080 | 16:9 或 1:1 | < 140 秒 |
| LinkedIn | 1920×1080 | 16:9 | 30–120 秒 |
| 微信视频号 | 1080×1920 | 9:16 | 60 秒以内 |

调整画布尺寸只需修改根元素的 `data-width` 和 `data-height`：

```html
<!-- 竖版 9:16 -->
<div id="root" data-composition-id="tiktok-video"
     data-start="0" data-width="1080" data-height="1920">
```

### 10.3 批量渲染（模板化发布）

使用变量系统，一套模板生成多个版本的视频。

**声明变量：**

```html
<div id="root" data-composition-id="ad"
     data-start="0" data-width="1920" data-height="1080"
     data-composition-variables='[
       {"id": "title", "type": "string", "label": "标题", "default": "产品名称"},
       {"id": "price", "type": "number", "label": "价格", "default": 99},
       {"id": "accentColor", "type": "color", "label": "强调色", "default": "#ff6b6b"},
       {"id": "showBadge", "type": "boolean", "label": "显示徽章", "default": true}
     ]'>
```

**在脚本中读取变量：**

```javascript
const vars = window.__hyperframes.getVariables();
document.querySelector("#title").textContent = vars.title;
document.querySelector("#price").textContent = `¥${vars.price}`;
```

**通过 CLI 传入不同值渲染多个版本：**

```bash
# 版本 A
npx hyperframes render --output ad-a.mp4 \
  --variables '{"title":"智能手表","price":299,"accentColor":"#3498db"}'

# 版本 B
npx hyperframes render --output ad-b.mp4 \
  --variables '{"title":"无线耳机","price":199,"accentColor":"#e74c3c"}'

# 从文件读取变量
npx hyperframes render --output ad-c.mp4 --variables-file vars.json
```

### 10.4 AWS Lambda 云端渲染

对于大批量或持续集成场景，可以部署到 AWS Lambda：

```bash
# 部署渲染服务
hyperframes lambda deploy --stack-name=hyperframes-prod --concurrency=8

# 远程渲染
hyperframes lambda render ./my-project --width 1920 --height 1080 --wait

# 监控进度
hyperframes lambda progress <renderId>

# 销毁部署
hyperframes lambda destroy
```

默认并发为 8，最坏情况下每次渲染约 $1.20 的 AWS 费用。

---

## 十一、完整案例：从网站到宣传视频

这是 HyperFrames 最强大的场景之一——把一个网站自动转化为宣传视频。完整流程遵循七步生产管线。

### 步骤 1：捕获网站资源

```bash
npx hyperframes capture https://your-product.com
```

自动提取的内容：

- 多个滚动深度的截图
- 主色调（oklch/lab 色彩空间转换）
- CSS 字体和 woff2 文件
- 图片、SVG、Lottie 动画
- 所有可见文本（按阅读顺序）
- 按钮和 CTA 元素
- 页面语义结构

**增强选项**——添加 Gemini AI 图片描述（约 $0.04/次捕获）：

```bash
echo "GEMINI_API_KEY=your-key" > .env
npx hyperframes capture https://your-product.com
```

### 步骤 2：生成设计规范

捕获完成后，基于提取的素材生成 `DESIGN.md`，包含：

- 总览：布局模式、色彩策略、排版特征
- 色彩：5–10 个 hex 色值及语义角色
- 排版：字体族、字重、使用角色
- 组件：复用的视觉模式（如 bento 布局、渐变效果）
- 图像：资源分类和使用方式
- 设计规范：严格的可做/不可做规则

### 步骤 3：撰写脚本

创建 `SCRIPT.md`，推荐结构：

```markdown
# 脚本

## 钩子（Hook）
一句话抓住注意力。

## 故事（Story）
产品做什么，解决什么问题。

## 证据（Proof）
数据支撑——用户数、增长率、客户背书。

## 行动号召（CTA）
清晰的单一行动指令。
```

### 步骤 4：创建分镜

生成 `STORYBOARD.md`，每个镜头包含：

- 时间范围（源自 transcript.json）
- 旁白文本
- 情绪和镜头描述
- 引用的资源路径
- 动画技术选择（SVG 路径绘制、Canvas 2D、CSS 3D、逐词排版、Lottie）
- 入场/出场转场
- 音效描述

### 步骤 5：生成配音和时间戳

```
narration.wav  →  可交付音频
narration.txt  →  带发音替换的文本
transcript.json → 逐词时间戳
```

用实际时间戳回过头更新 `STORYBOARD.md` 中的镜头时间。

### 步骤 6：构建组合

将分镜规格转化为 `compositions/` 下的 HTML 文件。每个文件：

- 引用捕获阶段的资源
- 使用 `DESIGN.md` 中的颜色和字体
- 实现分镜指定的动画技术

### 步骤 7：验证与交付

```bash
# 结构检查
npx hyperframes lint

# 运行时检查
npx hyperframes validate

# 关键帧快照
npx hyperframes snapshot . --at 2.9,10.4,18.7

# 最终渲染
npx hyperframes render --output product-launch.mp4 --quality high
```

### 用 AI 一步到位

如果安装了技能包，整个七步流程可以一句话触发：

```
使用 /hyperframes，基于 https://your-product.com 
创建一个 25 秒的产品发布视频。风格大胆、现代、深色主题。
```

AI 会自动执行捕获 → 设计 → 脚本 → 分镜 → 配音 → 构建 → 验证的完整管线。

---

## 十二、AI 智能体辅助工作流

### 12.1 冷启动（从零创作）

没有现成素材时，描述你想要的视频：

```
使用 /hyperframes，创建一个 10 秒的产品介绍，
标题淡入，深色背景，配轻柔的背景音乐。
```

关键要素：

- **时长**：「10 秒」「30s」「5 个场景各 3 秒」
- **比例**：「16:9」「9:16 竖版」「1:1 方形」
- **风格**：「极简瑞士风格」「暖色胶片质感」「高能量社交」
- **元素**：标题、下三分之一条、字幕、背景视频、音乐

### 12.2 暖启动（基于素材）

提供源素材，让 AI 自动分析并生成视频：

```
分析这个 GitHub 仓库 [URL]，用 /hyperframes 做一个架构讲解视频。
```

```
把这个 CSV 文件转成动画柱状图竞赛，用 /hyperframes。
```

```
读这份更新日志，把前三个变更做成 30 秒的发布公告视频，
用 /hyperframes。
```

### 12.3 迭代修改

初次渲染后，像和剪辑师协作一样提修改意见：

- 「标题放大两倍」
- 「换成暗色模式」
- 「在第 3 秒加一个下三分之一条，显示我的名字和头衔」
- 「字幕太小了，和下三分之一条重叠，往上挪并缩小」
- 「把背景音乐换成 `assets/track.mp3`」
- 「结尾加一个淡出」

### 12.4 Claude Design 替代路径

如果使用 Claude Design，可以从 GitHub 下载技能文件 `claude-design-hyperframes.md`，附加到对话中：

```
使用附加的技能文件。25 秒 LinkedIn 视频，关于我的创业公司。
问题：销售团队每天浪费 3 小时手动更新 CRM。
方案：AutoCRM——AI 自动记录每通电话、邮件和会议。
成绩：200+ 团队，120 万美元 ARR，月增 18%。
CTA：autocrmhq.com
```

Claude Design 会生成包含品牌识别、场景内容、动画和转场的完整初稿。下载 ZIP，在本地用 `npx hyperframes preview` 继续优化。

---

## 十三、常见问题与排错

### 13.1 诊断命令速查

| 命令 | 用途 |
|------|------|
| `npx hyperframes doctor` | 检查环境依赖 |
| `npx hyperframes lint` | 验证 HTML 结构 |
| `npx hyperframes validate` | 运行时错误检查 |
| `npx hyperframes info` | 收集环境信息 |
| `npx hyperframes benchmark` | 测试最佳系统配置 |

### 13.2 常见问题

**Q：渲染报「No composition found」**
检查 `index.html` 的根元素是否有 `data-composition-id` 属性。

**Q：渲染报「FFmpeg not found」**
安装 FFmpeg：
```bash
# macOS
brew install ffmpeg

# Ubuntu
sudo apt install ffmpeg
```
或者使用 Docker 模式绕过本地依赖：`--docker`。

**Q：预览卡顿**
大概率是 CSS 性能问题。`backdrop-filter: blur()` 是最大的性能杀手，叠加超过 2–3 层就会明显卡顿。用 Chrome DevTools 的 Performance 面板定位瓶颈。

**Q：渲染结果和预览不一致**
使用 Docker 模式确保跨平台一致性：
```bash
npx hyperframes render --output output.mp4 --docker
```
差异通常来自不同平台的字体渲染和 Chrome 版本差异。

**Q：Docker 渲染失败**
确认 Docker 正在运行、用户有权限、网络可达：
```bash
docker info
```

**Q：动画没有效果**
三个排查步骤：
1. 时间线是否用 `{ paused: true }` 创建？
2. 是否注册到 `window.__timelines["你的compositionId"]`？
3. 动画的位置参数（第三个参数）是否正确？

**Q：视频没有声音**
确认 `<video>` 元素加了 `muted` 属性，音频通过独立的 `<audio>` 元素播放。如果视频自带音频需要保留，使用 `data-has-audio` 属性。

### 13.3 开发工作流建议

1. **初始化** → `npx hyperframes init my-video`
2. **预览** → `npx hyperframes preview`（保持运行，热重载）
3. **编辑** → 修改 HTML，浏览器自动刷新
4. **验证** → `npx hyperframes lint` + `npx hyperframes validate`
5. **快照** → `npx hyperframes snapshot . --frames 5`（不做完整渲染，快速确认关键帧）
6. **草稿渲染** → `npx hyperframes render --output draft.mp4 --quality draft`
7. **最终渲染** → `npx hyperframes render --output final.mp4 --quality high`

---

## 附录 A：CLI 完整参数速查

### render 命令

| 参数 | 可选值 | 默认值 | 说明 |
|------|--------|--------|------|
| `--output` | 文件路径 | `renders/<name>.mp4` | 输出路径 |
| `--format` | mp4, mov, webm, png-sequence | mp4 | 视频格式 |
| `--fps` | 24, 30, 60 | 30 | 帧率 |
| `--quality` | draft, standard, high | standard | 质量预设 |
| `--crf` | 0–51 | — | 自定义压缩比 |
| `--video-bitrate` | 如 `10M`、`5000k` | — | 目标码率 |
| `--workers` | 1–8 或 auto | auto | 并行渲染进程 |
| `--max-concurrent-renders` | 1–10 | 2 | 同时渲染数 |
| `--gpu` | — | 关 | GPU 编码加速 |
| `--browser-gpu` / `--no-browser-gpu` | — | 本地开/Docker 关 | Chrome GPU 渲染 |
| `--hdr` | — | 关 | 强制 HDR 输出 |
| `--docker` | — | 关 | Docker 确定性渲染 |
| `--quiet` | — | 关 | 静默输出 |
| `--variables` | JSON 字符串 | — | 模板变量 |
| `--variables-file` | 文件路径 | — | 从文件读取变量 |

### 其他常用命令

```bash
npx hyperframes init <name>          # 初始化项目
npx hyperframes preview              # 启动预览服务器
npx hyperframes lint                 # 结构验证
npx hyperframes validate             # 运行时验证
npx hyperframes snapshot <dir>       # 关键帧快照
npx hyperframes doctor               # 环境诊断
npx hyperframes info                 # 环境信息
npx hyperframes benchmark            # 性能基准测试
npx hyperframes capture <url>        # 网站资源捕获
```

---

## 附录 B：七步生产管线速查

| 步骤 | 产出物 | 核心工作 |
|------|--------|---------|
| 1. 捕获 | `capture/` | 提取截图、设计令牌、字体、资源 |
| 2. 设计 | `DESIGN.md` | 品牌参考——颜色、排版、组件规范 |
| 3. 脚本 | `SCRIPT.md` | 旁白文案——钩子、故事、证据、CTA |
| 4. 分镜 | `STORYBOARD.md` | 逐镜头创意指导和资源审计 |
| 5. 配音 | `narration.wav` + `transcript.json` | TTS 生成 + 逐词时间戳 |
| 6. 构建 | `compositions/*.html` | 每个镜头一个动画 HTML 组合 |
| 7. 验证 | 快照 PNG + lint 报告 | 结构检查 + 运行时检查 + 视觉确认 |

---

## 附录 C：视频类型参考

| 视频类型 | 建议时长 | 典型结构 |
|---------|---------|---------|
| 社交广告 | 10–15 秒 | 高能量快切 |
| 产品发布 | 20–30 秒 | 主题演讲风格 |
| 产品巡览 | 30–60 秒 | 核心功能展示 |
| 品牌宣传 | 15–30 秒 | 设计庆典 |
| 功能公告 | 15–25 秒 | 更新亮点 |
| 预告片 | 8–15 秒 | 极简钩子 |

---

## 结语

HyperFrames 重新定义了视频制作的方式——不是用时间轴拖拽，而是用代码声明。你写的每一行 HTML 都是视频的一帧画面，每一段 GSAP 时间线都是一段动画指令。

这套体系对开发者极度友好：你已有的 Web 技术栈就是你的视频编辑器。对 AI 智能体同样友好：一句自然语言就能触发完整的视频生产管线。

开始动手吧。从一个 `npx hyperframes init` 开始，五分钟后你就能看到自己的第一个 MP4。
