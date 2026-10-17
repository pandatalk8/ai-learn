# 深入理解 Claude Code 的默认文件夹结构

> 当你第一次运行 `claude` 命令时，一个隐藏的世界在你的 Home 目录下悄然诞生。理解 `~/.claude/` 的结构，就是理解 Claude Code 的记忆、权限和行为机制。

## 为什么要了解这些文件夹？

大多数人使用 Claude Code 的方式是：打开终端、输入指令、等结果。但当你想要：

- 调试"为什么 Claude 不听话"
- 迁移到新电脑时保留所有配置
- 在团队中共享编码规范
- 理解 Claude 的记忆系统到底存了什么

你就必须搞懂 `~/.claude/` 这个文件夹。

---

## 全局鸟瞰：两棵树

Claude Code 的文件组织分为**两棵独立的树**：

| 位置 | 作用 | 是否提交到 Git |
|------|------|---------------|
| `~/.claude/` | 用户级全局配置（你的个人偏好） | 否 |
| `<project>/.claude/` | 项目级配置（团队共享规范） | 是 |

这个设计哲学很清晰：**个人的归个人，项目的归项目**。

---

## 第一棵树：`~/.claude/` — 你的大脑

这是 Claude Code 的"全局大脑"，存放在你的 Home 目录下。我们从实际的目录结构入手：

```
~/.claude/
├── settings.json              # 全局设置（hooks、插件、模型偏好等）
├── settings.local.json        # 本机私有设置（权限、API 密钥等）
├── settings.json.default      # 默认设置备份
├── history.jsonl              # 全局命令历史
├── statusline-command.sh      # 状态栏脚本
├── stats-cache.json           # 使用统计缓存
│
├── projects/                  # 🔑 核心：按项目隔离的会话和记忆
├── sessions/                  # 活跃进程注册表
├── session-env/               # 会话环境变量快照
├── file-history/              # 文件编辑历史（时光机）
├── plans/                     # 计划文档
├── tasks/                     # 任务跟踪
├── todos/                     # 待办事项
│
├── skills/                    # 已安装的 Skills
├── plugins/                   # 插件管理
├── cache/                     # 通用缓存
├── debug/                     # 调试日志
├── telemetry/                 # 遥测数据
├── statsig/                   # A/B 测试框架数据
├── shell-snapshots/           # Shell 环境快照
├── paste-cache/               # 粘贴板缓存
├── backups/                   # 配置备份
├── ide/                       # IDE 集成数据
└── mcp-needs-auth-cache.json  # MCP 认证缓存
```

下面逐一解析核心部分。

### 1. `settings.json` — 全局控制中心

这是 Claude Code 最重要的配置文件。一个真实的示例：

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "osascript -e 'display notification \"Claude Code 任务完成\" with title \"Claude Code\" sound name \"Glass\"'"
      }]
    }],
    "Notification": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "osascript -e 'display notification \"Claude Code 需要你的输入\" with title \"Claude Code\" sound name \"Basso\"'"
      }]
    }]
  },
  "statusLine": {
    "type": "command",
    "command": "bash /Users/xxx/.claude/statusline-command.sh"
  },
  "enabledPlugins": {
    "document-skills@anthropic-agent-skills": true
  },
  "effortLevel": "high",
  "voiceEnabled": true
}
```

关键字段说明：

| 字段 | 作用 |
|------|------|
| `hooks` | 事件钩子：任务完成时弹通知、提交前自动 lint 等 |
| `statusLine` | 终端状态栏显示内容 |
| `enabledPlugins` | 启用的插件列表 |
| `effortLevel` | Claude 的"努力程度"：low / medium / high |
| `voiceEnabled` | 是否启用语音输入 |

### 2. `settings.local.json` — 不可公开的私密设置

这个文件不会被共享，适合存放个人权限规则：

```json
{
  "permissions": {
    "allow": [
      "WebSearch",
      "WebFetch(domain:platform.openai.com)",
      "Bash(grep:*)"
    ]
  }
}
```

**设计原则**：`settings.json` 定义"行为"，`settings.local.json` 定义"权限"。

### 3. `projects/` — Claude 的项目记忆

这是最精巧的设计。Claude Code 会把你的**项目路径转换为文件夹名**，用连字符替代路径分隔符：

```
~/.claude/projects/
├── -Users-xxx-workspace-Articles/        # 当前项目
├── -Users-xxx-workspace-Projects-xlearnity/
├── -Users-xxx-workspace-Projects-gstack/
├── -Users-xxx-src-imgen/
└── ...
```

路径映射规则：`/Users/xxx/workspace/Articles` → `-Users-xxx-workspace-Articles`

每个项目文件夹内部结构：

```
-Users-xxx-workspace-Articles/
├── <session-id>.jsonl              # 会话记录（JSONL 格式）
├── <session-id>/                   # 会话的子 agent 记录
│   └── subagents/
│       └── agent-<id>.jsonl        # 子 agent 的完整对话
└── memory/                         # 🧠 项目级自动记忆
    └── MEMORY.md                   # 记忆索引（前 200 行自动加载）
```

**核心机制**：

- **会话记录**（`.jsonl`）：每次对话的完整 transcript，支持 `claude --continue` 恢复
- **子 agent 记录**：当 Claude 启动子 agent（如 Explore、Plan）时，子 agent 的对话也会保存
- **自动记忆**（`memory/`）：Claude 自动积累的项目认知，在未来的对话中自动加载

### 4. `sessions/` — 进程注册表

这个目录存放当前活跃的 Claude Code 进程信息：

```json
{
  "pid": 58819,
  "sessionId": "777909ff-0cd3-42d8-9f92-9980a70807f2",
  "cwd": "/Users/xxx/workspace/Articles",
  "startedAt": 1774352944582
}
```

文件名就是进程 PID。如果 Claude Code 异常退出，残留的 session 文件可以帮助诊断。

### 5. `file-history/` — 文件编辑时光机

每当 Claude 编辑文件时，编辑前的版本会被保存到这里：

```
file-history/
└── <session-id>/
    └── <file-hash>@v2    # 文件的历史版本快照
```

这就是为什么你可以按两次 `Esc` 来撤销 Claude 的修改——背后就是这个快照机制。

### 6. `plans/` — 计划文档

当你在 Claude Code 中使用 Plan 模式（`/plan`）时，生成的计划存在这里。文件名是随机生成的可爱名字：

```
plans/
├── bright-jingling-wirth.md
├── cheerful-nibbling-wand.md
├── elegant-skipping-graham.md
└── fizzy-brewing-owl.md
```

每个文件是一个完整的实施计划，包含上下文、修改文件列表和步骤。

### 7. `skills/` — 技能扩展

Skills 是 Claude Code 的"插件式能力扩展"。`~/.claude/skills/` 存放全局安装的 skills：

```
skills/
├── algorithmic-art/          # 本地 skill
├── baoyu-image-gen -> ../../.agents/skills/baoyu-image-gen  # 符号链接
├── browse -> gstack/browse   # 来自 gstack 插件的 skill
├── code/
└── ...
```

注意两种存在形式：
- **本地文件夹**：直接存放的 skill
- **符号链接**：指向插件提供的 skill

### 8. `plugins/` — 插件管理

```
plugins/
├── blocklist.json              # 被屏蔽的插件
├── installed_plugins.json      # 已安装插件清单
├── known_marketplaces.json     # 已知的插件市场
├── cache/                      # 插件缓存
└── marketplaces/               # 市场源数据
```

### 9. 其他辅助目录

| 目录 | 说明 |
|------|------|
| `debug/` | 调试日志，每个会话一个 `.txt` 文件 |
| `todos/` | 任务管理系统的持久化数据 |
| `tasks/` | 更结构化的任务跟踪 |
| `telemetry/` | 匿名遥测数据 |
| `statsig/` | A/B 测试框架（Statsig）的本地数据 |
| `shell-snapshots/` | Shell 环境快照，用于在沙盒中复现你的 shell 配置 |
| `paste-cache/` | 粘贴板内容缓存 |
| `cache/` | 通用缓存（如 changelog） |
| `backups/` | 配置文件备份 |
| `ide/` | IDE 集成（VS Code / Cursor 等）相关数据 |

---

## 第二棵树：`<project>/.claude/` — 团队的共识

项目级 `.claude/` 目录是**团队共享的**，会提交到 Git 仓库中。

```
<project>/
├── CLAUDE.md                      # 项目级指令（也可放在 .claude/CLAUDE.md）
└── .claude/
    ├── settings.json              # 团队共享的项目配置
    ├── settings.local.json        # 本机项目配置（gitignored）
    ├── rules/                     # 项目规则
    │   ├── code-style.md          # 代码风格
    │   └── testing.md             # 测试规范
    ├── skills/                    # 项目级 skills
    │   └── deploy/
    │       └── SKILL.md
    ├── agents/                    # 自定义子 agent
    └── commands/                  # 自定义命令（旧版，与 skills 合并）
```

### CLAUDE.md 加载层级

Claude Code 的指令加载遵循一个严格的层级：

```
                    ┌──────────────────┐
                    │   企业管理策略    │ ← /Library/Application Support/ClaudeCode/CLAUDE.md
                    │  (最高优先级)     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ 用户个人偏好      │ ← ~/.claude/CLAUDE.md
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  项目级指令       │ ← <project>/CLAUDE.md 或 <project>/.claude/CLAUDE.md
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  子目录指令       │ ← <project>/src/CLAUDE.md（按需加载）
                    └──────────────────┘
```

**关键行为**：
- 祖先目录的 CLAUDE.md 在启动时**全量加载**
- 子目录的 CLAUDE.md **按需加载**（只有当 Claude 读取该目录的文件时才会加载）
- 自动记忆 `MEMORY.md` 的前 200 行在启动时加载

### Rules 目录：模块化指令

`rules/` 目录是 CLAUDE.md 的"解耦版本"。每个 `.md` 文件可以通过 frontmatter 限定作用范围：

```markdown
---
paths:
  - "src/frontend/**"
  - "*.tsx"
---

使用 React 函数组件，禁止 class 组件。
所有组件必须有 TypeScript 类型定义。
```

**好处**：只有当 Claude 操作匹配路径的文件时，这条规则才会加载，节省上下文窗口。

---

## 设置的四级作用域

Claude Code 的设置系统有四个级别，优先级从高到低：

```
1. Managed (企业管理)     → 不可覆盖
2. User    (~/.claude/)   → 个人全局
3. Project (.claude/)     → 团队共享
4. Local   (settings.local.json) → 本机覆盖
```

实际应用场景：

| 场景 | 放在哪里 |
|------|---------|
| "任务完成弹通知" | `~/.claude/settings.json`（个人习惯） |
| "项目用 ESLint + Prettier" | `.claude/settings.json`（团队共享） |
| "允许 WebSearch 权限" | `~/.claude/settings.local.json`（个人权限） |
| "本机的 API key" | `.claude/settings.local.json`（项目私密） |

---

## 自动记忆系统：Claude 如何"记住"你

自动记忆是 Claude Code 最独特的功能之一。它的存储位置在：

```
~/.claude/projects/<project-path>/memory/
└── MEMORY.md        # 记忆索引
```

### 记忆的工作流程

```
你和 Claude 对话
       │
       ▼
Claude 发现值得记住的信息
（用户偏好、项目背景、反馈修正）
       │
       ▼
写入 memory/ 下的独立文件
（如 user_role.md, feedback_testing.md）
       │
       ▼
更新 MEMORY.md 索引
       │
       ▼
下次启动时自动加载前 200 行
```

### 记忆的类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `user` | 关于你的身份和偏好 | "用户是数据科学家，目前关注可观测性" |
| `feedback` | 你的行为修正 | "不要在回复末尾总结，用户能看 diff" |
| `project` | 项目动态 | "3月5日后合并冻结，移动端在切分支" |
| `reference` | 外部资源指针 | "pipeline bug 在 Linear 的 INGEST 项目里跟踪" |

**设计哲学**：Claude 不会记录代码模式或架构——那些可以从代码本身推导出来。它只记录**不可推导的隐性知识**。

---

## 实用技巧

### 1. 迁移到新电脑

最值得保留的：
```bash
# 必须迁移
cp ~/.claude/settings.json      new-machine:~/.claude/
cp ~/.claude/settings.local.json new-machine:~/.claude/

# 强烈推荐
cp -r ~/.claude/projects/*/memory/ new-machine-memory/  # 所有项目记忆
cp -r ~/.claude/skills/            new-machine:~/.claude/skills/
```

不需要迁移的：`sessions/`、`debug/`、`telemetry/`、`shell-snapshots/`

### 2. 调试 Claude 的行为

```bash
# 查看 Claude 记住了什么
cat ~/.claude/projects/-Users-你的路径/memory/MEMORY.md

# 查看上次对话做了什么
ls -lt ~/.claude/projects/-Users-你的路径/*.jsonl | head -3

# 查看 Claude 有哪些权限
cat ~/.claude/settings.local.json
```

### 3. 重置 Claude 的记忆

```bash
# 清除某个项目的记忆（谨慎操作）
rm -rf ~/.claude/projects/-Users-你的路径/memory/*

# 清除全部会话（不影响记忆和配置）
rm ~/.claude/projects/-Users-你的路径/*.jsonl
```

### 4. 环境变量覆盖

```bash
# 自定义配置目录位置
export CLAUDE_CONFIG_DIR=/path/to/custom/.claude

# 禁用自动记忆
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1
```

---

## 总结

`~/.claude/` 不只是一个配置文件夹——它是 Claude Code 的**操作系统**。

理解它，你就理解了：
- **为什么 Claude 能"记住"你上次说过的话** → `projects/<path>/memory/`
- **为什么按两次 Esc 能撤销** → `file-history/`
- **为什么新项目里 Claude 不知道老项目的约定** → 项目隔离的 `projects/` 结构
- **为什么团队成员的 Claude 行为一致** → `.claude/settings.json` + `rules/`
- **为什么有些操作需要确认有些不需要** → `settings.local.json` 里的权限规则

把 `~/.claude/` 想象成一个微型数据库：`settings` 是配置表，`projects` 是按主键（路径）分区的数据表，`memory` 是 Claude 的学习笔记本，`file-history` 是 undo log。

掌握了这些，你就从 Claude Code 的使用者变成了它的掌控者。
