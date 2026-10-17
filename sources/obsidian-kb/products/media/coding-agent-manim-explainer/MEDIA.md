---
title: "驾驭编程智能体：Manim 动画素材"
created: 2026-09-08
updated: 2026-09-11
type: outbound-media
status: narrated-final
platform: YouTube
format: "MP4, H.264, 1920x1080, 60fps"
duration_total: "2 分 04 秒"
---

# 驾驭编程智能体：Manim 动画素材

基于视频讲解稿《真正拉开 AI 工程师差距的，是驾驭编程智能体的能力》制作的 8 个独立 Manim 动画片段，可作为 YouTube 正片中的解释性 B-roll 使用。

## 来源

- 视频讲解稿：`.kb/staging/drafts/2026-09-08-coding-agent-skill-youtube-script.md`
- 正式文章：`products/mounts/articles/AI技术/AI工程师的关键能力-驾驭编程智能体而不只是让它写代码.md`
- 中文来源：`sources/clips/2026-09-08-coding-agent-skill.zh-CN.md`

## 外部工程与代码

- 工程目录：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer`
- Manim 源码：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/scenes.py`
- 批量渲染脚本：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/render_all.sh`
- 配音与合成代码：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/compose.py`
- IndexTTS 配音代码：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/generate_indextts.py`
- IndexTTS 官方工程：`/Users/wanghe/workspace/Projects/index-tts-official`
- 精华版配音稿：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/voiceover_script.md`
- 项目说明：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/README.md`
- 完整制作方法：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/PRODUCTION_GUIDE.md`
- YouTube 发布简介：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/YOUTUBE_DESCRIPTION.md`
- 动画工程 Git commit：`df7cdd9`
- 配音与合成 Git commit：`e6c5350`
- IndexTTS 工作流 Git commit：`6043df3`
- 本人音色工作流 Git commit：`d06146c`
- 制作方法文档 Git commit：`efe52f7`
- YouTube 简介 Git commit：`b3a60bd`

## 视频产物

视频二进制保存在 vault 外部：

`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/media/videos/`

| 文件 | 内容 | 时长 |
| --- | --- | ---: |
| `S01_HookShift.mp4` | 从亲手写代码转向驾驭智能体 | 7.75 秒 |
| `S02_RapidEvolution.mp4` | 闭源与开源智能体快速演进 | 8.87 秒 |
| `S03_WorkflowLoop.mp4` | 规划、执行、部署监控的迭代循环 | 9.60 秒 |
| `S04_AutonomyDial.mp4` | 根据风险校准智能体自主权 | 9.70 秒 |
| `S05_ContextRelay.mp4` | 经验、反馈与变化假设的上下文传递 | 7.17 秒 |
| `S06_ParallelSafety.mp4` | 多智能体并行、编排与安全关卡 | 8.05 秒 |
| `S07_VerificationStack.mp4` | 多层验证将不确定输出变成可信结果 | 8.38 秒 |
| `S08_MythToBuilder.mp4` | 超长自治误区与构建者角色 | 7.48 秒 |

## 合并配音成片

- 最终视频：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/media/final/coding-agent-explainer-zh-user-voice.mp4`
- 中文字幕：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/media/final/coding-agent-explainer-zh-user-voice.srt`
- 合成清单：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/media/final/coding-agent-explainer-zh-user-voice-manifest.json`
- 分场旁白 WAV：`/Users/wanghe/workspace/Projects/coding-agent-manim-explainer/voiceover/user_voice/full/scene_01.wav` 至 `scene_08.wav`
- 中文声音：IndexTTS 2.5，使用所有者本人录音处理得到的 11.3 秒参考音色
- 推理设备：Apple MPS
- 场景转场：`0.4 秒`交叉淡化
- 最终时长：`124.200 秒`
- 音频响度：`-17.31 LUFS`
- 真峰值：`-1.29 dBTP`

官方 IndexTTS 音色版本仍保留在 `media/final/coding-agent-explainer-zh-indextts.mp4`，原 Kokoro-82M `zf_xiaobei` 版本仍保留在 `media/final/coding-agent-explainer-zh.mp4`，均没有被覆盖。本人录音、参考 WAV 与生成的分场 WAV 不进入知识库或 Git。

## 渲染与验证

- Manim Community：`0.20.1`
- Python：`3.13.9`
- FFmpeg：`8.0.1`
- 中文字体：`Sarasa UI SC`
- 全部片段已通过 Python 编译检查与 Manim 实际渲染。
- 已抽取中间帧和结束帧做视觉检查，并修正第 1 段的文字重叠。
- 最终输出均已使用 `ffprobe` 确认为 `1920×1080`、`60fps`。
- 合并成片已确认包含 H.264 视频和 48kHz AAC 单声道音轨。
- 最终音轨经过 FFmpeg 两遍响度标准化，并复测响度和真峰值。
- 8 段本人音色的 IndexTTS 旁白以 Whisper `small` 中文模型分场和整片复核，语音从 `00:00.000` 持续到 `02:04.100`，没有转场吞字或结尾截断。
- 中文字幕以独立 SRT 交付，没有烧入画面。

成片尚未上传到 YouTube。
