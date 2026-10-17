# 让 Claude Code 长出"眼睛"——browser-use 完整配置指南

上周我让 Claude Code 帮我注册一个网站账号——填用户名、输邮箱、点同意条款、提交表单。它用 WebFetch 抓回了一堆 HTML 源码，然后跟我说："我可以看到注册页面的结构，但我无法与页面交互。"

Claude Code 能读网页，但它读到的是"死的"。它拿到的是一份静态快照——看得见文字，点不了按钮，填不了表单，更处理不了 JavaScript 动态渲染的内容。对于需要登录才能看到的页面、需要滚动才能加载的列表、需要点击才能展开的详情，WebFetch 无能为力。

**browser-use 补上的就是这块。** 它是一个开源的浏览器自动化框架（GitHub 上 97k+ Star），通过 MCP 协议接入 Claude Code 之后，Claude 能像人一样操控一个真实的 Chrome 浏览器——导航、点击、输入、滚动、切标签页，所有你能用鼠标和键盘做的事情，它都能做。背后有一个独立的 AI Agent 在驱动浏览器，能处理动态页面、JavaScript 渲染、甚至多步骤的复杂流程。

这篇文章手把手带你完成配置。十分钟，让你的 Claude Code 从"能看"升级到"能操作"。

---

## 一、先搞清楚原理：为什么需要一个"中间人"？

Claude Code 本身不能直接操控浏览器。MCP（Model Context Protocol）是 Anthropic 设计的一套标准协议，允许外部工具以"插件"形式接入 Claude。

整个架构长这样：

```
┌─────────────┐     MCP 协议      ┌───────────────┐     Playwright     ┌─────────┐
│ Claude Code  │ ◄──────────────► │  browser-use   │ ◄───────────────► │ Chrome  │
│  (MCP 客户端) │    stdio 通信     │  (MCP 服务器)   │    浏览器自动化     │ 浏览器   │
└─────────────┘                   └───────────────┘                    └─────────┘
                                        │
                                        │ 调用 LLM 决策
                                        ▼
                                  ┌───────────────┐
                                  │  OpenAI/Claude │
                                  │  (Agent 大脑)   │
                                  └───────────────┘
```

注意中间那个箭头——browser-use 内部有一个独立的 AI Agent，它需要调用 LLM 来决定"下一步点哪里、输入什么"。**这意味着你需要额外提供一个 LLM 的 API Key，Claude Code 自身的模型不会被传递给 MCP 服务器。**

这是很多人踩的第一个坑。

---

## 二、安装前的准备

你需要三样东西：

| 依赖项 | 最低版本 | 检查命令 | 说明 |
|--------|---------|---------|------|
| Python | 3.11+ | `python3 --version` | browser-use 依赖 Python 3.11 的新特性 |
| uv | 最新版 | `uv --version` | Rust 写的 Python 包管理器，比 pip 快 10 倍 |
| Claude Code | 最新版 | `claude --version` | 确保支持 MCP 协议 |

如果你还没装 `uv`：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

一行搞定。装完之后重启终端，确认 `uv` 命令可用。

---

## 三、两种接入方案，选哪个？

browser-use 的 MCP 接入有两条路径：

| 方案 | 包名 | 维护方 | 特点 |
|------|------|--------|------|
| A：官方 CLI 模式 | `browser-use[cli]` | browser-use 官方 | 工具丰富，支持细粒度浏览器操作（点击、输入、滚动、切标签页等） |
| B：社区 MCP 封装 | `mcp-server-browser-use` | Saik0s（社区） | 接口更简单，只暴露两个工具：`run_browser_agent` 和 `run_deep_research` |

**如果你想让 Claude Code 精确控制浏览器的每一步操作，选方案 A。如果你只想扔给它一个任务让它自己搞定，选方案 B。**

大多数场景下，我推荐方案 A——工具越细粒度，Claude 的可控性越强。

---

## 四、方案 A：官方 browser-use MCP 配置（推荐）

### 第一步，用 CLI 命令一键添加。

这是最简单的方式：

```bash
claude mcp add browser-use -- uvx --from 'browser-use[cli]' browser-use --mcp
```

如果你需要同时传入 API Key（以 OpenAI 为例）：

```bash
claude mcp add \
  --env OPENAI_API_KEY=sk-your-key-here \
  --transport stdio \
  browser-use \
  -- uvx --from 'browser-use[cli]' browser-use --mcp
```

想要所有项目都能用？加 `--scope user`：

```bash
claude mcp add \
  --scope user \
  --env OPENAI_API_KEY=sk-your-key-here \
  browser-use \
  -- uvx --from 'browser-use[cli]' browser-use --mcp
```

### 第二步，验证连接状态。

进入 Claude Code，输入：

```
/mcp
```

你应该看到 `browser-use` 显示为 `connected` 状态。如果显示 `disconnected`，往下看排错部分。

### 第三步，测试一下。

直接跟 Claude Code 说：

> "用 browser-use 打开 Hacker News，告诉我现在排名前五的帖子标题。"

如果一切正常，你会看到 Claude 调用浏览器工具，一个 Chrome 窗口弹出来，自动导航到 Hacker News 并提取内容。

---

## 五、方案 A 的手动配置（.mcp.json）

如果你更喜欢配置文件方式，在项目根目录创建 `.mcp.json`：

```json
{
  "mcpServers": {
    "browser-use": {
      "command": "uvx",
      "args": ["--from", "browser-use[cli]", "browser-use", "--mcp"],
      "env": {
        "OPENAI_API_KEY": "sk-your-key-here"
      }
    }
  }
}
```

**关键细节：macOS 上 `uvx` 的路径问题。** Claude Code 启动 MCP 服务器时，不一定能找到你 shell 里的 `uvx`。最稳妥的办法是用绝对路径：

```bash
which uvx
# 输出类似：/Users/yourname/.local/bin/uvx
```

然后把 `command` 字段改成完整路径：

```json
{
  "mcpServers": {
    "browser-use": {
      "command": "/Users/yourname/.local/bin/uvx",
      "args": ["--from", "browser-use[cli]", "browser-use", "--mcp"],
      "env": {
        "OPENAI_API_KEY": "sk-your-key-here"
      }
    }
  }
}
```

---

## 六、方案 B：社区版 mcp-server-browser-use

如果你选择方案 B，配置方式如下。

### CLI 方式：

```bash
claude mcp add browser-use -- uvx mcp-server-browser-use@latest
```

### 配置文件方式（.mcp.json）：

```json
{
  "mcpServers": {
    "browser-use": {
      "command": "uvx",
      "args": ["mcp-server-browser-use@latest"],
      "env": {
        "MCP_LLM_PROVIDER": "anthropic",
        "MCP_LLM_ANTHROPIC_API_KEY": "sk-ant-your-key-here",
        "MCP_LLM_MODEL_NAME": "claude-sonnet-4-20250514",
        "MCP_BROWSER_HEADLESS": "false",
        "MCP_AGENT_TOOL_USE_VISION": "true"
      }
    }
  }
}
```

社区版的配置项更多，用 `MCP_` 前缀的环境变量控制：

| 变量 | 作用 | 默认值 |
|------|------|--------|
| `MCP_LLM_PROVIDER` | LLM 提供商（openai/anthropic） | openai |
| `MCP_LLM_MODEL_NAME` | 模型名称 | gpt-4o |
| `MCP_BROWSER_HEADLESS` | 是否无头模式 | true |
| `MCP_AGENT_TOOL_USE_VISION` | 是否启用视觉能力 | true |
| `MCP_AGENT_TOOL_MAX_STEPS` | Agent 最大操作步数 | 100 |
| `MCP_BROWSER_KEEP_OPEN` | 调用结束后保持浏览器打开 | false |
| `MCP_BROWSER_CDP_URL` | 连接已有浏览器实例的地址 | — |

---

## 七、官方方案的完整工具清单

配置成功后，Claude Code 会获得以下浏览器操作能力：

| 工具名 | 功能 |
|--------|------|
| `browser_navigate` | 导航到指定 URL |
| `browser_click` | 点击页面元素 |
| `browser_type` | 在输入框中输入文字 |
| `browser_scroll` | 滚动页面 |
| `browser_get_state` | 获取当前页面状态（DOM + 截图） |
| `browser_go_back` | 浏览器后退 |
| `browser_list_tabs` | 列出所有标签页 |
| `browser_switch_tab` | 切换标签页 |
| `browser_close_tab` | 关闭标签页 |
| `browser_extract_content` | 提取页面内容 |
| `retry_with_browser_use_agent` | 全自动模式——给一个自然语言任务，Agent 自主完成 |

**`retry_with_browser_use_agent` 是最强大的工具。** 你不需要告诉 Claude 具体点哪里、输入什么——直接描述任务，browser-use 的内置 Agent 会自己规划和执行。其余工具适合需要精确控制每一步的场景。

---

## 八、进阶玩法：连接已有浏览器

默认情况下，browser-use 每次都会启动一个全新的 Chrome 实例。但很多网站需要登录——每次重新登录太麻烦了。

解决办法：让 browser-use 连接你已经登录好的浏览器。

### 第一步，用调试模式启动 Chrome。

macOS：

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222
```

Linux：

```bash
google-chrome --remote-debugging-port=9222
```

### 第二步，在这个浏览器里登录你需要的网站。

### 第三步，修改 MCP 配置，指向这个浏览器实例。

社区版配置：

```json
{
  "env": {
    "MCP_BROWSER_USE_OWN_BROWSER": "true",
    "MCP_BROWSER_CDP_URL": "http://localhost:9222"
  }
}
```

这样 browser-use 就会复用你已有的浏览器会话，包括所有的登录状态和 Cookie。

---

## 九、常见问题排错

### "uvx: command not found"

Claude Code 启动子进程时，PATH 环境变量可能和你的终端不一样。解决方案：

```bash
# 找到 uvx 的绝对路径
which uvx

# 在配置中使用绝对路径
# "command": "/Users/yourname/.local/bin/uvx"
```

### 浏览器无法启动

browser-use 底层用 Playwright 驱动浏览器，需要安装 Chromium：

```bash
# 官方方案
uvx --from 'browser-use[cli]' browser-use install

# 社区方案
uvx --from mcp-server-browser-use@latest python -m playwright install
```

### MCP 连接显示 disconnected

依次检查：

1. API Key 是否正确设置——没有 Key，browser-use 启动就会报错
2. Python 版本是否 >= 3.11——低版本会导致依赖安装失败
3. 手动跑一次看报错信息：

```bash
uvx --from 'browser-use[cli]' browser-use --mcp
```

如果终端里能正常启动，问题大概率出在路径上。

### 浏览器打开了但什么都不做

检查你传入的 LLM API Key 是否有效、额度是否充足。browser-use 的内部 Agent 需要调用 LLM 来做决策——如果 Key 无效或余额为零，Agent 就会卡住。

---

## 十、轻量替代：只需要看网页，不需要操作？

如果你的需求只是"让 Claude Code 能读取网页内容"，browser-use 可能杀鸡用牛刀了。有两个更轻量的选择：

**Chrome DevTools MCP**——只做页面检查和调试：

```bash
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

**Claude Code 内置的 WebFetch**——直接抓取网页文本：

```
使用 WebFetch 获取 https://example.com 的内容
```

这两个方案不需要额外的 LLM API Key，配置也更简单。根据你的实际需求选择。

---

## 最后

browser-use 给 Claude Code 补上了最关键的一块拼图——与真实网页世界的交互能力。配置过程不复杂，核心就三步：装 `uv`、加 MCP 服务器、传入 API Key。

**十分钟配置，换来的是一个能自己上网查资料、填表单、抓数据的 AI 编程助手。这笔账怎么算都值。**
