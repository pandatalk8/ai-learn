# Pi Mono 中文使用教程

> 本教程基于 `packages/` 目录下各子包的 README 文档整理而成。

---

## 目录

1. [项目概览](#1-项目概览)
2. [pi-ai — 统一 LLM API 库](#2-pi-ai--统一-llm-api-库)
3. [pi-agent-core — 有状态 Agent 框架](#3-pi-agent-core--有状态-agent-框架)
4. [pi-coding-agent — 终端编码助手](#4-pi-coding-agent--终端编码助手)
5. [pi-mom — Slack 机器人](#5-pi-mom--slack-机器人)
6. [pods — GPU Pod 管理工具](#6-pods--gpu-pod-管理工具)
7. [pi-tui — 终端 UI 框架](#7-pi-tui--终端-ui-框架)
8. [pi-web-ui — Web 聊天 UI 组件](#8-pi-web-ui--web-聊天-ui-组件)

---

## 1. 项目概览

Pi Mono 是一个 monorepo，包含一套围绕 LLM（大语言模型）构建的工具链，各包职责如下：

| 包名             | npm 包                           | 功能                                 |
| -------------- | ------------------------------- | ---------------------------------- |
| `ai`           | `@mariozechner/pi-ai`           | 统一多厂商 LLM API，支持流式输出、工具调用、Token 计费 |
| `agent`        | `@mariozechner/pi-agent-core`   | 有状态 Agent，管理消息历史、工具执行、事件流          |
| `coding-agent` | `@mariozechner/pi-coding-agent` | 终端编码助手（`pi` 命令），可扩展、支持多种模式         |
| `mom`          | `@mariozechner/pi-mom`          | 基于 Slack 的 LLM 机器人，自管理工具和技能        |
| `pods`         | `@mariozechner/pi`              | GPU Pod 管理，自动配置 vLLM 运行大模型         |
| `tui`          | `@mariozechner/pi-tui`          | 终端 UI 框架，差异化渲染、无闪烁                 |
| `web-ui`       | `@mariozechner/pi-web-ui`       | Web 聊天界面组件，支持附件、Artifacts、存储       |

---

## 2. pi-ai — 统一 LLM API 库

### 安装

```bash
npm install @mariozechner/pi-ai
```

### 支持的提供商

- OpenAI / Azure OpenAI / OpenAI Codex
- Anthropic（Claude）
- Google（Gemini）/ Vertex AI / Gemini CLI
- Mistral、Groq、Cerebras、xAI、OpenRouter
- Amazon Bedrock、MiniMax、Kimi For Coding
- GitHub Copilot（需 OAuth）
- 任何 OpenAI 兼容 API（Ollama、vLLM、LM Studio 等）

### 快速开始

```typescript
import { getModel, stream, complete } from '@mariozechner/pi-ai';

// 获取模型（IDE 中有自动补全）
const model = getModel('openai', 'gpt-4o-mini');

// 方式一：流式输出
const s = stream(model, {
  systemPrompt: '你是一个助手',
  messages: [{ role: 'user', content: '你好！' }]
});

for await (const event of s) {
  if (event.type === 'text_delta') {
    process.stdout.write(event.delta);
  }
}

// 方式二：一次性获取完整回复
const response = await complete(model, {
  messages: [{ role: 'user', content: '你好！' }]
});
console.log(response.content);
```

### 工具调用（Function Calling）

```typescript
import { Type, Tool } from '@mariozechner/pi-ai';

const weatherTool: Tool = {
  name: 'get_weather',
  description: '获取指定城市的天气',
  parameters: Type.Object({
    city: Type.String({ description: '城市名' }),
  })
};

const response = await complete(model, {
  messages: [{ role: 'user', content: '北京今天天气怎么样？' }],
  tools: [weatherTool]
});

// 处理工具调用
for (const block of response.content) {
  if (block.type === 'toolCall') {
    const result = await callWeatherAPI(block.arguments.city);
    // 把结果加入消息历史继续对话
  }
}
```

### 思维链 / Reasoning（推理模式）

```typescript
import { completeSimple } from '@mariozechner/pi-ai';

const model = getModel('anthropic', 'claude-sonnet-4-20250514');

const response = await completeSimple(model, {
  messages: [{ role: 'user', content: '解方程：2x + 5 = 13' }]
}, {
  reasoning: 'medium' // 可选: 'minimal' | 'low' | 'medium' | 'high' | 'xhigh'
});

for (const block of response.content) {
  if (block.type === 'thinking') console.log('思考过程：', block.thinking);
  if (block.type === 'text')    console.log('答案：', block.text);
}
```

### 图像输入

```typescript
import { readFileSync } from 'fs';

const imageBase64 = readFileSync('image.png').toString('base64');

const response = await complete(model, {
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: '这张图片里有什么？' },
      { type: 'image', data: imageBase64, mimeType: 'image/png' }
    ]
  }]
});
```

### 环境变量（Node.js）

| 提供商       | 环境变量                |
| --------- | ------------------- |
| Anthropic | `ANTHROPIC_API_KEY` |
| OpenAI    | `OPENAI_API_KEY`    |
| Google    | `GEMINI_API_KEY`    |
| Groq      | `GROQ_API_KEY`      |
| xAI       | `XAI_API_KEY`       |

### OAuth 登录（订阅用户）

```bash
npx @mariozechner/pi-ai login           # 交互选择提供商
npx @mariozechner/pi-ai login anthropic # 登录 Anthropic
```

凭证保存到当前目录的 `auth.json`。

### 跨提供商切换上下文

```typescript
// 先用 Claude 对话，再无缝切换到 GPT
const claude = getModel('anthropic', 'claude-sonnet-4-20250514');
const context = { messages: [] };

context.messages.push({ role: 'user', content: '25 × 18 等于多少？' });
const claudeResp = await complete(claude, context, { thinkingEnabled: true });
context.messages.push(claudeResp);

// 切换到 GPT-5
const gpt = getModel('openai', 'gpt-5-mini');
context.messages.push({ role: 'user', content: '这个计算对吗？' });
const gptResp = await complete(gpt, context);
```

---

## 3. pi-agent-core — 有状态 Agent 框架

### 安装

```bash
npm install @mariozechner/pi-agent-core
```

### 快速开始

```typescript
import { Agent } from '@mariozechner/pi-agent-core';
import { getModel } from '@mariozechner/pi-ai';

const agent = new Agent({
  initialState: {
    systemPrompt: '你是一个有帮助的助手。',
    model: getModel('anthropic', 'claude-sonnet-4-20250514'),
  },
});

// 监听流式输出
agent.subscribe((event) => {
  if (event.type === 'message_update' &&
      event.assistantMessageEvent.type === 'text_delta') {
    process.stdout.write(event.assistantMessageEvent.delta);
  }
});

await agent.prompt('你好！');
```

### 事件流说明

调用 `agent.prompt("Hello")` 时，事件顺序如下：

```
agent_start
turn_start
message_start   ← 用户消息
message_end
message_start   ← 助手开始回复
message_update  ← 流式文本块（多次）
message_end     ← 完整回复
turn_end
agent_end
```

如果助手调用了工具，还会出现：

```
tool_execution_start   ← 工具开始执行
tool_execution_update  ← 工具流式进度（可选）
tool_execution_end     ← 工具执行完毕
```

### 定义工具

```typescript
import { Type } from '@sinclair/typebox';

const readFileTool = {
  name: 'read_file',
  label: '读取文件',
  description: '读取文件内容',
  parameters: Type.Object({
    path: Type.String({ description: '文件路径' }),
  }),
  execute: async (toolCallId, params, signal) => {
    const content = await fs.readFile(params.path, 'utf-8');
    return {
      content: [{ type: 'text', text: content }],
      details: { path: params.path }
    };
  },
};

agent.setTools([readFileTool]);
```

> **提示**：工具失败时请抛出异常，不要把错误信息作为正常内容返回。

### 状态管理

```typescript
agent.setSystemPrompt('新的系统提示');
agent.setModel(getModel('openai', 'gpt-4o'));
agent.setThinkingLevel('medium');   // off | minimal | low | medium | high | xhigh
agent.setTools([myTool]);
agent.clearMessages();
agent.reset();                       // 清除所有状态
```

### 中断与跟进消息

```typescript
// 工具执行过程中发送"转向"消息（会跳过剩余工具）
agent.steer({ role: 'user', content: '停！换个方向', timestamp: Date.now() });

// 当前工作完成后再执行的"跟进"消息
agent.followUp({ role: 'user', content: '还有，总结一下结果', timestamp: Date.now() });
```

### 错误恢复

```typescript
// 出错后从当前状态继续（不添加新消息）
await agent.continue();
```

---

## 4. pi-coding-agent — 终端编码助手

### 安装

```bash
npm install -g @mariozechner/pi-coding-agent
```

### 快速启动

```bash
# 使用 API Key
export ANTHROPIC_API_KEY=sk-ant-...
pi

# 使用订阅账号
pi
/login   # 然后选择提供商
```

默认提供四个工具：`read`、`write`、`edit`、`bash`。

### 交互界面功能

| 功能 | 操作方式 |
|------|---------|
| 引用文件 | 输入 `@` 后模糊搜索项目文件 |
| 路径补全 | 按 `Tab` |
| 多行输入 | `Shift+Enter`（Windows Terminal 用 `Ctrl+Enter`）|
| 粘贴图片 | `Ctrl+V` 或拖拽到终端 |
| 执行命令 | `!命令` 执行并发给模型；`!!命令` 只执行不发送 |

### 常用命令

| 命令 | 说明 |
|------|------|
| `/login` / `/logout` | OAuth 认证 |
| `/model` | 切换模型（也可用 `Ctrl+L`）|
| `/settings` | 调整思维级别、主题等 |
| `/resume` | 恢复之前的会话 |
| `/new` | 开始新会话 |
| `/tree` | 可视化会话历史，任意跳转 |
| `/fork` | 从当前分支创建新会话 |
| `/compact` | 压缩上下文（释放 Token）|
| `/export` | 导出会话为 HTML |
| `/share` | 上传为私有 GitHub Gist |
| `/hotkeys` | 显示所有快捷键 |

### 常用快捷键

| 按键 | 功能 |
|------|------|
| `Ctrl+C` | 清空编辑器（按两次退出）|
| `Escape` | 取消/中止当前操作 |
| `Escape` ×2 | 打开 `/tree` |
| `Ctrl+L` | 打开模型选择器 |
| `Shift+Tab` | 循环切换思维级别 |
| `Ctrl+O` | 折叠/展开工具输出 |
| `Ctrl+T` | 折叠/展开思维块 |

### 会话管理

```bash
pi -c                  # 继续最近的会话
pi -r                  # 浏览并选择历史会话
pi --no-session        # 临时模式（不保存）
pi --session <path>    # 使用指定会话文件
```

会话以 JSONL 树结构保存在 `~/.pi/agent/sessions/`，支持无损分支。

### 上下文文件

Pi 启动时自动加载 `AGENTS.md`（或 `CLAUDE.md`），从以下位置读取：
- `~/.pi/agent/AGENTS.md`（全局）
- 工作目录往上的所有父目录
- 当前目录

### 自定义扩展

#### 提示模板（Prompt Templates）

```markdown
<!-- ~/.pi/agent/prompts/review.md -->
审查以下代码的 Bug、安全问题和性能问题。
关注点：{{focus}}
```

使用方式：在编辑器中输入 `/review`。

#### 技能（Skills）

```markdown
<!-- ~/.pi/agent/skills/my-skill/SKILL.md -->
# 我的技能
当用户询问 X 时使用本技能。

## 步骤
1. 执行这个
2. 然后那个
```

#### TypeScript 扩展（Extensions）

```typescript
export default function (pi: ExtensionAPI) {
  pi.registerTool({ name: "deploy", ... });
  pi.registerCommand("stats", { ... });
  pi.on("tool_call", async (event, ctx) => { ... });
}
```

扩展可实现：自定义工具、子 Agent、权限控制、自定义 UI、Git 检查点等。

#### Pi 包安装

```bash
pi install npm:@foo/pi-tools          # 从 npm 安装
pi install git:github.com/user/repo   # 从 git 安装
pi remove npm:@foo/pi-tools
pi list
pi update
```

### CLI 参考（常用选项）

```bash
pi [选项] [@文件...] [消息...]

# 模型选项
--provider anthropic
--model claude-sonnet-4    # 或 "openai/gpt-4o"，或 "sonnet:high"（带思维级别）
--thinking high            # off | minimal | low | medium | high | xhigh

# 工具选项
--tools read,bash,edit,write   # 默认工具
--no-tools                     # 禁用所有内置工具

# 输出模式
-p, --print          # 打印回复后退出（非交互）
--mode json          # 输出事件流为 JSON Lines
--mode rpc           # RPC 模式，用于跨语言集成

# 文件引用
pi @prompt.md "回答这个问题"
pi -p @screenshot.png "图片里有什么？"
```

### 编程 SDK 使用

```typescript
import { createAgentSession, SessionManager, AuthStorage, ModelRegistry } from '@mariozechner/pi-coding-agent';

const { session } = await createAgentSession({
  sessionManager: SessionManager.inMemory(),
  authStorage: new AuthStorage(),
  modelRegistry: new ModelRegistry(authStorage),
});

await session.prompt('当前目录有哪些文件？');
```

---

## 5. pi-mom — Slack 机器人

### 安装

```bash
npm install @mariozechner/pi-mom
```

### Slack App 配置（简要）

1. 在 https://api.slack.com/apps 创建新 App
2. 开启 **Socket Mode**，生成 `App-Level Token`（即 `MOM_SLACK_APP_TOKEN`）
3. 添加 Bot Token Scopes：`app_mentions:read`、`chat:write`、`files:read/write`、`im:*` 等
4. 订阅事件：`app_mention`、`message.channels`、`message.im`
5. 安装到工作区，获得 `Bot User OAuth Token`（即 `MOM_SLACK_BOT_TOKEN`）

### 快速启动

```bash
export MOM_SLACK_APP_TOKEN=xapp-...
export MOM_SLACK_BOT_TOKEN=xoxb-...
export ANTHROPIC_API_KEY=sk-ant-...

# 创建 Docker 沙箱（推荐）
docker run -d --name mom-sandbox -v $(pwd)/data:/workspace \
  alpine:latest tail -f /dev/null

# 在 Docker 模式下运行
mom --sandbox=docker:mom-sandbox ./data
```

### 目录结构

```
./data/
  ├── MEMORY.md           # 全局记忆（跨频道共享）
  ├── settings.json       # 全局设置
  ├── skills/             # 全局自定义 CLI 工具
  ├── C123ABC/            # 每个 Slack 频道一个目录
  │   ├── MEMORY.md       # 频道专属记忆
  │   ├── log.jsonl       # 完整消息历史（真实来源）
  │   ├── context.jsonl   # 发送给 LLM 的上下文
  │   ├── attachments/    # 用户分享的文件
  │   └── skills/         # 频道专属 CLI 工具
  └── events/             # 定时事件文件
```

### 核心功能

**自管理**：Mom 会自行安装所需工具（`apk add git`、`npm install` 等），配置凭证，并在会话间持久保存。

**记忆系统**：通过 `MEMORY.md` 记住编码规范、团队成员职责、工作流偏好等。

**技能（Skills）**：Mom 可以为你创建自定义 CLI 工具。例如：

> "@mom 帮我创建一个管理笔记的技能，支持添加、查看、清除"

**定时事件**：

```json
// 立即触发
{"type": "immediate", "channelId": "C123ABC", "text": "新 GitHub Issue 已创建"}

// 单次定时
{"type": "one-shot", "channelId": "C123ABC", "text": "提醒开会", "at": "2026-03-01T09:00:00+08:00"}

// 周期执行（Cron）
{"type": "periodic", "channelId": "C123ABC", "text": "检查邮件", "schedule": "0 9 * * 1-5", "timezone": "Asia/Shanghai"}
```

### 安全注意事项

- **推荐使用 Docker 模式**：限制 Mom 只能访问挂载的数据目录
- **谨防提示词注入**：恶意用户或内容可能诱导 Mom 泄露凭证
- 为不同安全级别的频道运行独立的 Mom 实例
- 使用最小权限原则，避免使用生产凭证

---

## 6. pods — GPU Pod 管理工具

### 安装

```bash
npm install -g @mariozechner/pi
```

### 前置条件

- HuggingFace Token（用于下载模型）
- GPU Pod：Ubuntu 22.04/24.04、SSH root 访问、NVIDIA 驱动

### 快速开始

```bash
export HF_TOKEN=your_hf_token
export PI_API_KEY=your_api_key

# 配置 Pod（以 DataCrunch + NFS 为例）
pi pods setup dc1 "ssh root@1.2.3.4" \
  --mount "sudo mount -t nfs -o nconnect=16 nfs.fin-02.datacrunch.io:/models /mnt/models"

# 启动模型
pi start Qwen/Qwen2.5-Coder-32B-Instruct --name qwen

# 单次对话
pi agent qwen "什么是斐波那契数列？"

# 交互模式
pi agent qwen -i
```

### Pod 管理命令

```bash
pi pods                          # 列出所有 Pod
pi pods active <name>            # 切换活跃 Pod
pi pods remove <name>            # 删除 Pod 配置
pi shell [<name>]                # SSH 连接到 Pod
pi ssh [<name>] "<命令>"         # 在 Pod 上执行命令
```

### 模型管理命令

```bash
pi start <模型> --name <名称>    # 启动模型
  --memory 50%                   # GPU 显存占比（默认 90%）
  --context 32k                  # 上下文窗口大小
  --gpus 2                       # 使用 GPU 数量
  --vllm <参数...>               # 直接传给 vLLM 的参数

pi stop [<名称>]                 # 停止模型（不填则停止全部）
pi list                          # 列出运行中的模型
pi logs <名称>                   # 流式查看模型日志
```

### 预定义模型（开箱即用）

```bash
# Qwen 系列
pi start Qwen/Qwen2.5-Coder-32B-Instruct --name qwen
pi start Qwen/Qwen3-Coder-30B-A3B-Instruct --name qwen3

# GPT-OSS 系列（需要特殊 vLLM 构建）
pi pods setup gpt-pod "ssh root@1.2.3.4" --models-path /workspace --vllm gpt-oss
pi start openai/gpt-oss-20b --name gpt20

# GLM 系列
pi start zai-org/GLM-4.5 --name glm
pi start zai-org/GLM-4.5-Air --name glm-air
```

### 使用 OpenAI 兼容 API 接入

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://your-pod-ip:8001/v1",
    api_key="your-pi-api-key"
)

response = client.chat.completions.create(
    model="Qwen/Qwen2.5-Coder-32B-Instruct",
    messages=[{"role": "user", "content": "写一个冒泡排序"}]
)
```

### 常见故障排查

| 问题 | 解决方法 |
|------|---------|
| OOM 内存不足 | 降低 `--memory`，使用量化版本（FP8），缩小 `--context` |
| 模型启动失败 | 运行 `pi ssh "nvidia-smi"` 检查 GPU 状态，`pi list` 查看端口占用 |
| 工具调用失效 | 尝试 `--vllm --tool-call-parser mistral` 或 `--disable-tool-call-parser` |
| 模型访问被拒 | 前往 HuggingFace 模型页面申请访问权限 |

---

## 7. pi-tui — 终端 UI 框架

### 安装

```bash
npm install @mariozechner/pi-tui
```

### 核心特性

- **差异化渲染**：三策略渲染，只更新变化的部分
- **同步输出**：使用 CSI 2026 原子刷新，无闪烁
- **内置组件**：Text、Input、Editor、Markdown、Loader、SelectList、SettingsList 等
- **内联图片**：支持 Kitty / iTerm2 图片协议

### 快速开始

```typescript
import { TUI, Text, Editor, ProcessTerminal } from '@mariozechner/pi-tui';

const terminal = new ProcessTerminal();
const tui = new TUI(terminal);

tui.addChild(new Text('欢迎使用！'));

const editor = new Editor(tui, editorTheme);
editor.onSubmit = (text) => {
  tui.addChild(new Text(`你输入了：${text}`));
};
tui.addChild(editor);

tui.start();
```

### 主要组件

#### Text — 多行文本显示

```typescript
const text = new Text('Hello World', 1, 1);
text.setText('更新后的内容');
```

#### Input — 单行输入框

```typescript
const input = new Input();
input.onSubmit = (value) => console.log(value);
```

#### Editor — 多行编辑器

```typescript
const editor = new Editor(tui, theme);
editor.onSubmit = (text) => { /* 提交处理 */ };
editor.onChange = (text) => { /* 内容变化 */ };
editor.setAutocompleteProvider(provider); // 设置自动补全
```

**快捷键：** `Enter` 提交，`Shift+Enter` / `Alt+Enter` 换行，`Tab` 自动补全，`Ctrl+K/U` 删除行。

#### SelectList — 可交互选择列表

```typescript
const list = new SelectList(
  [{ value: 'opt1', label: '选项一', description: '第一个选项' }],
  5,     // 最大可见数量
  theme
);
list.onSelect = (item) => console.log('选中：', item);
```

#### Loader — 加载动画

```typescript
const loader = new Loader(tui, chalk.cyan, chalk.gray, '加载中...');
loader.start();
// ... 异步操作
loader.stop();
```

#### Markdown — Markdown 渲染

```typescript
const md = new Markdown('# 标题\n\n**粗体**文字', 1, 1, theme);
md.setText('更新后的 Markdown');
```

### 弹层（Overlays）

```typescript
// 显示居中弹层
const handle = tui.showOverlay(myComponent, {
  width: '80%',
  maxHeight: '50%',
  anchor: 'center',
});

handle.hide();            // 永久移除
handle.setHidden(true);  // 临时隐藏
handle.setHidden(false); // 重新显示
```

### 键盘检测

```typescript
import { matchesKey, Key } from '@mariozechner/pi-tui';

handleInput(data: string): void {
  if (matchesKey(data, Key.ctrl('c')))  process.exit(0);
  if (matchesKey(data, Key.enter))      this.submit();
  if (matchesKey(data, Key.up))         this.moveUp();
  if (matchesKey(data, Key.escape))     this.cancel();
}
```

### 自定义组件规范

```typescript
import { truncateToWidth } from '@mariozechner/pi-tui';

class MyComponent implements Component {
  render(width: number): string[] {
    // 每行必须不超过 width！
    return [truncateToWidth('Hello World', width)];
  }
}
```

---

## 8. pi-web-ui — Web 聊天 UI 组件

### 安装

```bash
npm install @mariozechner/pi-web-ui @mariozechner/pi-agent-core @mariozechner/pi-ai
```

### 快速开始

```typescript
import { Agent } from '@mariozechner/pi-agent-core';
import { getModel } from '@mariozechner/pi-ai';
import {
  ChatPanel, AppStorage, IndexedDBStorageBackend,
  ProviderKeysStore, SessionsStore, SettingsStore,
  setAppStorage, defaultConvertToLlm, ApiKeyPromptDialog,
} from '@mariozechner/pi-web-ui';
import '@mariozechner/pi-web-ui/app.css';

// 1. 配置存储（IndexedDB）
const settings = new SettingsStore();
const providerKeys = new ProviderKeysStore();
const sessions = new SessionsStore();

const backend = new IndexedDBStorageBackend({
  dbName: 'my-chat-app',
  version: 1,
  stores: [
    settings.getConfig(),
    providerKeys.getConfig(),
    sessions.getConfig(),
    SessionsStore.getMetadataConfig(),
  ],
});

settings.setBackend(backend);
providerKeys.setBackend(backend);
sessions.setBackend(backend);
setAppStorage(new AppStorage(settings, providerKeys, sessions, undefined, backend));

// 2. 创建 Agent
const agent = new Agent({
  initialState: {
    systemPrompt: '你是一个有帮助的助手。',
    model: getModel('anthropic', 'claude-sonnet-4-5-20250929'),
    thinkingLevel: 'off',
    messages: [],
    tools: [],
  },
  convertToLlm: defaultConvertToLlm,
});

// 3. 创建并挂载聊天面板
const chatPanel = new ChatPanel();
await chatPanel.setAgent(agent, {
  onApiKeyRequired: (provider) => ApiKeyPromptDialog.prompt(provider),
});
document.body.appendChild(chatPanel);
```

### 主要组件

#### ChatPanel — 高级聊天界面

包含消息历史、流式响应、Artifacts 面板（HTML/SVG/Markdown 预览）。

#### AgentInterface — 低级聊天界面

```typescript
const chat = document.createElement('agent-interface') as AgentInterface;
chat.session = agent;
chat.enableAttachments = true;
chat.enableModelSelector = true;
chat.enableThinkingSelector = true;
```

### 内置工具

```typescript
import { createJavaScriptReplTool, createExtractDocumentTool } from '@mariozechner/pi-web-ui';

// JavaScript REPL（沙箱环境）
const replTool = createJavaScriptReplTool();

// 文档提取（从 URL 提取文本）
const extractTool = createExtractDocumentTool();
extractTool.corsProxyUrl = 'https://corsproxy.io/?';

agent.setTools([replTool, extractTool]);
```

### 存储 API

```typescript
// 保存 API Key
await storage.providerKeys.set('anthropic', 'sk-ant-...');
const key = await storage.providerKeys.get('anthropic');

// 会话管理
await storage.sessions.save(sessionData, metadata);
const session = await storage.sessions.get(sessionId);
const all = await storage.sessions.getAllMetadata();
await storage.sessions.delete(sessionId);

// 设置
await storage.settings.set('proxy.enabled', true);
```

### 附件处理

```typescript
import { loadAttachment } from '@mariozechner/pi-web-ui';

// 从 File 对象
const attachment = await loadAttachment(file);

// 从 URL
const attachment = await loadAttachment('https://example.com/doc.pdf');
```

支持格式：PDF、DOCX、XLSX、PPTX、图片、文本文件。

### 对话框组件

```typescript
import { SettingsDialog, SessionListDialog, ApiKeyPromptDialog, ModelSelector } from '@mariozechner/pi-web-ui';

// 设置面板
SettingsDialog.open([new ProvidersModelsTab(), new ProxyTab(), new ApiKeysTab()]);

// 会话列表
SessionListDialog.open((sessionId) => loadSession(sessionId), (id) => handleDelete(id));

// API Key 输入
const ok = await ApiKeyPromptDialog.prompt('anthropic');

// 模型选择器
ModelSelector.open(currentModel, (model) => agent.setModel(model));
```

### 国际化

```typescript
import { translations, setLanguage, i18n } from '@mariozechner/pi-web-ui';

translations.zh = {
  'Loading...': '加载中...',
  'No sessions yet': '暂无会话',
};
setLanguage('zh');
```

---

## 附录：常见环境变量汇总

| 变量 | 用途 |
|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API 密钥 |
| `OPENAI_API_KEY` | OpenAI API 密钥 |
| `GEMINI_API_KEY` | Google Gemini API 密钥 |
| `GROQ_API_KEY` | Groq API 密钥 |
| `HF_TOKEN` | HuggingFace Token（pods 用于下载模型）|
| `PI_API_KEY` | pods vLLM 端点的 API 密钥 |
| `PI_CODING_AGENT_DIR` | 覆盖 pi coding agent 配置目录（默认 `~/.pi/agent`）|
| `PI_CACHE_RETENTION` | 设为 `long` 以延长提示缓存时间 |
| `MOM_SLACK_APP_TOKEN` | Slack App-Level Token（mom 使用）|
| `MOM_SLACK_BOT_TOKEN` | Slack Bot Token（mom 使用）|

---

*本文档基于 pi-mono 各子包的官方 README 整理，如有出入请以源文档为准。*
