# 第七课：使用 Skills

## 模块三：组织你的工作与知识

## 什么是 Skills

Skill 是一个给 Claude 的专业操作手册。它用一个 SKILL.md 文件定义，包含一套指令、模板和上下文，让 Claude 能按照特定的方法论完成特定类型的任务。

打个比方：如果 Claude 本身是一个聪明的通才，那 Skill 就是给这个通才一本"做这件事的标准操作手册"。装备了 Skill 的 Claude 不只是知道怎么做，而是知道按什么最佳实践做。

## Skill 与普通提示词的区别

| | 普通提示词 | Skill |
|---|----------|-------|
| 持久性 | 一次性使用 | 持久化存储，反复调用 |
| 结构化 | 自由文本 | 标准化的 YAML 前言 + Markdown 指令 |
| 可共享 | 复制粘贴 | 安装即用，可发布到社区 |
| 触发方式 | 手动输入 | 自动匹配或斜杠命令调用 |
| 复杂度 | 通常较短 | 可以包含详细的多步骤流程和示例 |

## Skill 怎么工作

Skill 采用两层渐进式加载机制：

1. **启动时**：Claude 只加载 Skill 的名称和描述（元数据），不加载完整内容，避免占用过多上下文
2. **需要时**：当 Claude 判断某个任务与某个 Skill 相关时，才加载该 Skill 的完整指令

这意味着你可以安装很多 Skill，它们不会在不需要时拖慢 Claude。

## 如何使用 Skill

**自动触发：**

Claude 会根据你的任务描述自动判断是否需要调用某个 Skill。比如，如果你安装了一个"PDF 生成"Skill，当你说"帮我把这份报告导出为 PDF"时，Claude 会自动使用它。

**手动调用：**

在 Claude Code 中，你可以用斜杠命令直接调用：
```
/pdf 把这份报告生成为 PDF 文件
```

在 claude.ai 中，也可以通过提到 Skill 的名称来触发。

## 去哪里找 Skill

**官方 Skill 仓库：**

Anthropic 在 GitHub 上维护了一个官方 Skill 仓库（github.com/anthropics/skills），包含经过验证的高质量 Skill。

**社区 Skill：**

社区贡献了大量 Skill，涵盖：
- 文档创建（PDF、Word、Excel、PPT）
- 前端设计
- 数据分析
- 内容写作
- 代码审查
- 项目管理

**合作伙伴 Skill：**

Asana、Atlassian、Canva、Figma、Sentry、Zapier 等公司都提供了官方 Skill。

## 安装 Skill

**在 claude.ai 中：**
通过 Plugins 功能安装，在设置中浏览和启用可用的 Skill。

**在 Claude Code 中：**
Skill 存储在两个位置：
- `~/.claude/skills/` —— 你的个人 Skill，所有项目可用
- `.claude/skills/` —— 项目级 Skill，仅在该项目中生效

将 Skill 的 SKILL.md 文件放到对应目录即可。

## Skill 能做什么——几个实际案例

**文档生成 Skill：**
告诉 Claude 如何创建格式规范的 PDF、Word、Excel 文件，包含正确的页眉页脚、目录、样式。

**前端设计 Skill：**
给 Claude 一套设计系统——排版、配色、动画规范，让它生成的 UI 不再看起来像"AI 生成的紫色渐变卡片"。

**代码审查 Skill：**
定义代码审查的检查清单、关注点和输出格式，让 Claude 按照团队标准进行代码审查。

**内容写作 Skill：**
包含你的品牌语气、术语规范、目标受众描述，让 Claude 的写作输出符合你的品牌调性。

## Skill 的跨平台特性

Skill 是一个开放标准，可以在 claude.ai、Claude Code 和 API 之间移植。这意味着你在一个平台上创建的 Skill，可以在其他平台上使用。

开放标准的规范发布在 agentskills.io，目标是让 Skill 成为跨 AI 平台的通用能力扩展格式。

## 本课要点

- Skill 是给 Claude 的标准化操作手册，让它按最佳实践完成特定任务
- 采用渐进式加载：平时只加载元数据，用到时才加载完整内容
- 可以通过自动匹配或手动斜杠命令调用
- 可从官方仓库、社区和合作伙伴处获取
- Skill 是开放标准，可跨平台使用

---

> 下一课：[连接你的工具](08-连接你的工具.md)
