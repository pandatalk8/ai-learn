# 基于 LLM 驱动的 AI 智能体 — Manim 动画

这是一支面向非技术、零基础观众的中文科普视频，使用生活化的“周末旅行”例子解释：

- LLM 是什么；
- 聊天机器人和 AI 智能体的区别；
- 目标、LLM、工具、记忆四个组成部分；
- 理解、计划、行动、检查的反馈循环；
- 适用场景与安全边界。

## 生成方式

```bash
cd llm_agent_manim
.venv/bin/python build_audio.py
.venv/bin/manim -pqh agent_explainer.py AgentExplainer
```

旁白文本和字幕位于 `narration.json`。修改后重新运行上述两条命令即可。

旁白生成默认采用 `auto` 模式：优先使用项目内安装的 IndexTTS2，模型或参考音频不可用时回退到 macOS `say`。也可以显式选择：

```bash
# 强制使用 IndexTTS2；--voice 是 3–15 秒的干净参考人声
.venv/bin/python build_audio.py --engine indextts --voice /path/to/reference.wav

# 只生成第 01 段进行试听
.venv/bin/python build_audio.py --engine indextts --ids 01 --voice /path/to/reference.wav

# 强制使用系统 Tingting 声音
.venv/bin/python build_audio.py --engine say
```

在 Apple Silicon 上，`--device auto` 会优先选择 MPS；也可以通过 `--device cpu` 强制使用 CPU。

## 已渲染成片

最终成片位于：`output/LLM_AI智能体_零基础讲解_1080p.mp4`

优化样式后的 V2 成片位于：`output/LLM_AI智能体_零基础讲解_V2_1080p.mp4`

- 画面：1920 × 1080，30 fps
- 音频：中文旁白，AAC 48 kHz
- 字幕：画面内嵌关键句字幕
