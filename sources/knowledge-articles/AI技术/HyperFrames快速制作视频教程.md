# 用 HyperFrames 快速制作视频：从零到第一个作品

作者：Mr. Panda

## 前言

过去做视频，要么打开 After Effects 拖时间轴，要么写 Remotion 的 React 代码，要么剪 Premiere——门槛和等待都不低。

HyperFrames 走了另一条路：**用 HTML 写视频**。一个 HTML 文件就是一段视频的源文件，CSS 控制外观，GSAP 控制动画，框架负责把它渲染成 MP4。

如果你写过网页，你已经会做视频了。

这篇教程带你从安装到产出第一支视频，覆盖最实用的几个场景。

---

## 一、HyperFrames 是什么

一句话：**HTML 即视频源文件**。

它的核心心智模型只有三件事：

1. **Composition（组合）**：一个 HTML 文件，定义画布尺寸、片段、时间。
2. **Clip（片段）**：HTML 元素加上 `data-start`、`data-duration` 等属性，告诉框架什么时候出现、持续多久。
3. **Timeline（时间线）**：用 GSAP 写的动画时间线，注册到 `window.__timelines` 上，框架会按时间播放。

剩下的——视频静音、音频独立播放、片段可见性切换、子组合嵌套——框架全包了。

---

## 二、安装与初始化

### 第一步：安装 CLI

```bash
npm install -g hyperframes
# 或者直接用 npx，不安装到全局
npx hyperframes --help
```

### 第二步：初始化项目

```bash
npx hyperframes init my-first-video
cd my-first-video
```

会得到一个最小骨架：

```
my-first-video/
├── index.html          # 主组合
├── compositions/       # 子组合（可选）
├── assets/             # 视频、音频、图片
└── hyperframes.json    # 项目配置
```

### 第三步：环境自检

```bash
npx hyperframes doctor
```

确认 Node、Chrome、ffmpeg 都就位。出问题时，doctor 会告诉你缺什么。

---

## 三、第一支视频：标题卡片

打开 `index.html`，写下这段最小可运行的组合：

```html
<!DOCTYPE html>
<html>
<body>
  <div data-composition-id="root" data-width="1920" data-height="1080">
    <div id="title-card"
         data-start="0"
         data-duration="3"
         data-track-index="0">
      <h1 class="title">Hello, HyperFrames</h1>
      <p class="subtitle">用 HTML 写视频</p>
    </div>

    <style>
      [data-composition-id="root"] {
        background: #0a0a0a;
        color: #f5f5f5;
        font-family: "Inter", sans-serif;
      }
      #title-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        gap: 24px;
      }
      .title { font-size: 140px; font-weight: 800; }
      .subtitle { font-size: 42px; opacity: 0.7; }
    </style>

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });

      tl.from(".title",    { y: 60, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.2);
      tl.from(".subtitle", { y: 30, opacity: 0, duration: 0.5, ease: "power2.out" }, 0.5);

      window.__timelines["root"] = tl;
    </script>
  </div>
</body>
</html>
```

预览：

```bash
npx hyperframes preview
```

浏览器会打开一个 studio 界面，能拖时间轴、逐帧检查。

渲染成 MP4：

```bash
npx hyperframes render
```

输出文件在 `out/` 目录下。

恭喜，第一支视频完成。

---

## 四、读懂关键概念

### 4.1 data-* 属性是时间合约

每个 clip 都需要：

| 属性 | 含义 |
|------|------|
| `data-start` | 何时出现（秒，或引用其他 clip 的 id） |
| `data-duration` | 持续多久 |
| `data-track-index` | 轨道索引（同轨不可重叠） |

注意：`data-track-index` **不影响视觉层级**，那是 CSS `z-index` 的活。

### 4.2 视频和音频分两个元素

视频必须 `muted playsinline`，音频用独立的 `<audio>`：

```html
<video id="v1" data-start="0" data-duration="10" data-track-index="0"
       src="assets/clip.mp4" muted playsinline></video>

<audio id="a1" data-start="0" data-duration="10" data-track-index="1"
       src="assets/clip.mp4" data-volume="1"></audio>
```

为什么？因为浏览器自动播放策略——静音视频可以自动播，带声视频不行。HyperFrames 用这个组合规避了限制。

### 4.3 时间线必须 paused

```js
const tl = gsap.timeline({ paused: true });
// ... tweens ...
window.__timelines["root"] = tl;
```

播放控制权属于框架，你只负责描述动画。

---

## 五、做一支多场景视频

单场景太单调，做一个三场景的产品宣传片。

### 5.1 先想清楚

- **场景 1**：品牌标题（0-3s）
- **场景 2**：核心卖点（3-7s）
- **场景 3**：行动召唤 + 淡出（7-10s）

### 5.2 三条铁律

1. **场景之间必须有转场**，不允许硬切。
2. **每个场景的元素必须用入场动画**——所有元素从 `gsap.from()` 进入。
3. **不要写出场动画**，转场就是出场（最后一个场景可以淡出收尾）。

### 5.3 代码骨架

```html
<div data-composition-id="root" data-width="1920" data-height="1080">

  <!-- 场景 1 -->
  <div id="scene-1" data-start="0" data-duration="3" data-track-index="0">
    <h1 class="s1-title">OpenClaw</h1>
    <p class="s1-tag">让 AI 帮你写 SaaS</p>
  </div>

  <!-- 场景 2 -->
  <div id="scene-2" data-start="3" data-duration="4" data-track-index="0">
    <div class="card">10 倍开发效率</div>
    <div class="card">零代码部署</div>
    <div class="card">永久买断</div>
  </div>

  <!-- 场景 3 -->
  <div id="scene-3" data-start="7" data-duration="3" data-track-index="0">
    <p class="cta">立即体验</p>
    <p class="url">openclaw.com</p>
  </div>

  <script>
    const tl = gsap.timeline({ paused: true });

    // 场景 1 入场
    tl.from(".s1-title", { y: 50, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.3);
    tl.from(".s1-tag",   { y: 30, opacity: 0, duration: 0.5, ease: "power2.out" }, 0.6);

    // 场景 2 入场（卡片错峰登场）
    tl.from(".card", { y: 60, opacity: 0, duration: 0.6, stagger: 0.15, ease: "expo.out" }, 3.3);

    // 场景 3 入场
    tl.from(".cta", { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(1.6)" }, 7.3);
    tl.from(".url", { y: 20, opacity: 0, duration: 0.4, ease: "power2.out" }, 7.6);

    // 最后一个场景才允许淡出
    tl.to(".cta, .url", { opacity: 0, duration: 0.5 }, 9.5);

    window.__timelines["root"] = tl;
  </script>
</div>
```

### 5.4 加转场

转场推荐用现成的 shader 转场或 CSS 淡入淡出。最简单的做法是在两个场景的衔接处加一个全屏 overlay：

```html
<div id="trans-1" class="transition-overlay"
     data-start="2.7" data-duration="0.6" data-track-index="9"></div>
```

CSS 让它从 0 透明度变成 100% 再回 0，盖住硬切瞬间。

完整的转场方案见 `references/transitions.md`。

---

## 六、加配音和字幕

最常见的需求：把一段文字变成有配音、有字幕的视频。

### 6.1 生成配音（TTS）

HyperFrames 内置了 Kokoro-82M：

```bash
npx hyperframes tts \
  --text "今天我们聊聊用 HTML 做视频" \
  --voice af_bella \
  --speed 1.0 \
  --out assets/narration.wav
```

### 6.2 生成对齐字幕

```bash
npx hyperframes transcribe assets/narration.wav --out assets/captions.json
```

得到逐词时间戳的 JSON。

### 6.3 在组合里挂上

```html
<audio id="narration"
       data-start="0"
       data-duration="12"
       data-track-index="2"
       src="assets/narration.wav"></audio>

<div id="captions-host"
     data-start="0"
     data-duration="12"
     data-track-index="3"></div>
```

字幕渲染逻辑参考 `references/captions.md`，框架支持卡拉 OK 高亮、逐词淡入、整句切换等多种风格。

---

## 七、布局先于动画——少踩坑的关键

新手最常犯的错：直接在 GSAP 里写 `from(offscreen, target)`，结果渲染出来发现两个标题挤在一起。

正确流程：

1. **先把所有元素摆到"最显眼那一帧"应该在的位置**，用静态 CSS。
2. **`.scene-content` 必须填满整个场景**：

```css
.scene-content {
  width: 100%;
  height: 100%;
  padding: 120px 160px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
}
```

不要用 `position: absolute; top: 200px` 这种写法定位主内容容器——内容一变多就会溢出画面。

3. **再用 `gsap.from()` 让它们从入场状态飞进来**。CSS 是真相，GSAP 是过场。

---

## 八、视觉风格不能省

HyperFrames 有一条硬规则：**不允许用默认色**。

新建组合前，必须有：

- 一份 `DESIGN.md`，写清楚色板、字体、动效原则；或
- 一份 `visual-style.md`，指定具体风格 prompt；或
- 用户明确说了风格名称（例如 "Swiss Pulse"、"Velvet Standard"）。

最快的方式：在项目根目录建一个 `DESIGN.md`：

```markdown
## Style Prompt
深色科技感，霓虹蓝点缀，几何感字体，节奏明快。

## Colors
- 背景：#0a0a0a
- 主文：#f5f5f5
- 强调：#3b82f6
- 警示：#ef4444

## Typography
- 标题：Inter 800
- 正文：Inter 400

## What NOT to Do
- 不用纯黑 #000
- 不用 Roboto 这种通用字体
- 不用 #333 这种灰
- 标题字号不低于 80px
```

---

## 九、质量检查三件套

写完一定要跑：

```bash
npx hyperframes lint       # 语法和数据合约
npx hyperframes validate   # 验证 + WCAG 对比度
npx hyperframes inspect    # 布局溢出检查
```

`inspect` 会在无头浏览器里跑一遍，告诉你哪里文字溢出了卡片、哪里溢出画面，附带时间戳和修复建议。

如果对比度不达标，警告会精确到哪一帧、哪个选择器：

```
⚠ WCAG AA contrast warnings (3):
  · .subtitle "副标题文字" — 2.67:1 (need 4.5:1, t=5.3s)
```

把对应颜色调亮或调暗即可。

---

## 十、何时用 HyperFrames，何时不用

**适合**：
- 程序化生成视频（数据驱动、批量产出）
- 信息密集的内容（教程、产品介绍、数据可视化）
- 需要精确控制每一帧的场景
- 想用代码版本控制视频的团队

**不适合**：
- 真人出镜的口播（拍剪还是更快）
- 复杂的 3D / 粒子模拟（专业 3D 工具更合适）
- 一次性、低复杂度的素材剪辑

---

## 十一、下一步

掌握了基础后，按这个顺序往下啃：

1. **音频反应动画**（`references/audio-reactive.md`）——视觉随节拍跳动。
2. **场景转场**（`references/transitions.md`）——CSS 转场 vs Shader 转场怎么选。
3. **运动设计原则**（`references/motion-principles.md`）——为什么有的动画看着舒服，有的不舒服。
4. **数据可视化**（`data-in-motion.md`）——做数字、图表、信息图的范式。

---

## 结语

视频本质是"随时间变化的画面"。

HyperFrames 的好处是把这件事还原成你熟悉的 web 三件套：HTML 描述结构，CSS 描述外观，JS 描述行为。

第一次跑通的时候你会想：原来视频可以这么做。

第十次跑通的时候你会想：以后还有什么不能这么做？

— Mr. Panda
