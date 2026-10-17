# Claude Code 接入第三方模型完整配置教程

官方 Claude 模型好用，但有人卡在地区限制，有人嫌贵，也有人就是想用 DeepSeek、Kimi 或本地跑的开源模型。好消息是，Claude Code 从设计上就给你留了口子——它不绑定 Anthropic 的服务器，只绑定 Anthropic 的接口协议。

这篇教程不堆概念，直接带你把五种常见厂商一个个接通：DeepSeek、Kimi、智谱 GLM、OpenRouter、本地 Ollama。每一种都给出能复制粘贴的配置、验证方法和踩坑提示。你用的是 fish shell，所有命令都按 fish 写。

---

## 一、先搞懂一件事：为什么能换

Claude Code 跟模型之间只说一种「语言」——Anthropic 的 `/v1/messages` 协议。它发出去的每个请求长什么样、期待收回来什么格式，都由这套协议规定。

所以接入第三方模型，本质就是回答一个问题：

**你要接的厂商，是已经兼容了 Anthropic 协议，还是只有 OpenAI 格式的接口？**

- **兼容 Anthropic 协议**（DeepSeek、Kimi、智谱 GLM 都已经做了）：改两个环境变量，指过去就能用。
- **只有 OpenAI 格式**（部分小厂、本地 Ollama 原生接口）：中间要加一层转换。

记住这条分叉，后面的配置就都是它的具体展开。

---

## 二、四个你必须认识的环境变量

不管接哪家，核心就这几个变量。先认识它们，后面就是填空：

| 变量 | 作用 |
|------|------|
| `ANTHROPIC_BASE_URL` | API 地址，换成厂商的兼容端点 |
| `ANTHROPIC_AUTH_TOKEN` | 厂商给你的 API Key |
| `ANTHROPIC_MODEL` | 默认主模型 ID |
| `ANTHROPIC_SMALL_FAST_MODEL` | 后台小任务（如生成会话标题）用的轻量模型 |

还有几个进阶变量，用来精细控制 Claude Code 内部对不同档位模型的映射，接 DeepSeek 那节会用到：

| 变量 | 作用 |
|------|------|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Opus 档位映射到哪个模型 |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Sonnet 档位映射到哪个模型 |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Haiku 档位映射到哪个模型 |
| `CLAUDE_CODE_SUBAGENT_MODEL` | 子任务 / subagent 用哪个模型 |

---

## 三、两种配置载体：环境变量 vs settings.json

填这些变量有两个地方可以放，先说清楚区别，后面每个厂商任选其一即可。

**第一种，写进 shell 配置（全局生效）。** 编辑 `~/.config/fish/config.fish`，用 `set -gx` 导出。优点是任何目录启动 Claude Code 都生效，适合你长期就用某一家。

**第二种，写进 settings.json（推荐，可隔离）。** 编辑 `~/.claude/settings.json`，把变量放进 `env` 对象。如果放在某个项目目录下的 `.claude/settings.json`，就只对该项目生效——这样你能 A 项目用官方 Claude、B 项目用 DeepSeek，互不干扰。

settings.json 的通用骨架长这样：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "厂商端点",
    "ANTHROPIC_AUTH_TOKEN": "你的key",
    "ANTHROPIC_MODEL": "主模型ID",
    "ANTHROPIC_SMALL_FAST_MODEL": "小模型ID"
  }
}
```

下面每家厂商，我都给 fish 和 settings.json 两种写法的关键值，你挑顺手的那种。

---

## 四、实操：五种厂商逐个接通

### 路线 1：DeepSeek

DeepSeek 官方已提供 Anthropic 兼容端点，还做了 Claude 三档模型到自家模型的自动映射，是目前最省心的国产选择之一。

写进 `~/.config/fish/config.fish`：

```fish
set -gx ANTHROPIC_BASE_URL "https://api.deepseek.com/anthropic"
set -gx ANTHROPIC_AUTH_TOKEN "你的-deepseek-api-key"
set -gx ANTHROPIC_MODEL "deepseek-chat"
set -gx ANTHROPIC_SMALL_FAST_MODEL "deepseek-chat"
```

DeepSeek 接入时一个贴心的细节：它会把 `claude-opus-*` 映射到自家的高配模型、把 `claude-haiku-*` / `claude-sonnet-*` 映射到轻量模型。如果你想手动指定档位映射，可以补上：

```fish
set -gx ANTHROPIC_DEFAULT_OPUS_MODEL "deepseek-chat"
set -gx ANTHROPIC_DEFAULT_HAIKU_MODEL "deepseek-chat"
```

> 提示：DeepSeek 的具体模型 ID（如 `deepseek-chat`、`deepseek-reasoner` 及最新版本号）以官方文档为准，新版本发布时记得同步更新这一行。

---

### 路线 2：Kimi（Moonshot）

Moonshot 同样暴露了与 Anthropic Messages API 完全一致的端点，注意国内站和国际站地址不同。

国际站：

```fish
set -gx ANTHROPIC_BASE_URL "https://api.moonshot.ai/anthropic"
set -gx ANTHROPIC_AUTH_TOKEN "你的-moonshot-api-key"
set -gx ANTHROPIC_MODEL "kimi-k2-turbo-preview"
```

国内站只需把域名换成 `.cn`：

```fish
set -gx ANTHROPIC_BASE_URL "https://api.moonshot.cn/anthropic"
```

**选错国内 / 国际站点是最常见的报错来源**——你的 API Key 在哪个站点注册，`BASE_URL` 就得用对应的域名，两边的 key 不通用。

---

### 路线 3：智谱 GLM

智谱专门为 Claude Code 用户做了「搬家」方案，端点是 `open.bigmodel.cn/api/anthropic`。

```fish
set -gx ANTHROPIC_BASE_URL "https://open.bigmodel.cn/api/anthropic"
set -gx ANTHROPIC_AUTH_TOKEN "你的-bigmodel-api-key"
set -gx ANTHROPIC_MODEL "glm-4.6"
```

对应的 settings.json 写法：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "你的-bigmodel-api-key",
    "ANTHROPIC_MODEL": "glm-4.6"
  }
}
```

API Key 在智谱开放平台（bigmodel.cn）后台获取，模型 ID 用你账号有权限的最新 GLM 版本。

---

### 路线 4：OpenRouter（一个 key 接几百个模型）

如果你不想为每家厂商单独注册，OpenRouter 是个聚合网关——一个 key 背后接了几百个模型，按调用量计费。它兼容 Anthropic 协议：

```fish
set -gx ANTHROPIC_BASE_URL "https://openrouter.ai/api/v1"
set -gx ANTHROPIC_AUTH_TOKEN "sk-or-你的-key"
set -gx ANTHROPIC_MODEL "anthropic/claude-sonnet-4"
```

OpenRouter 的模型 ID 带厂商前缀（如 `anthropic/...`、`deepseek/...`、`google/...`），换模型只改 `ANTHROPIC_MODEL` 这一行就行，不用动地址和 key。**它适合「想随时横向比较不同模型」的场景**，代价是多过一道网关、延迟略高。

---

### 路线 5：本地 Ollama（只有 OpenAI 格式，需转换层）

本地跑的开源模型走的是 OpenAI 格式接口，不直接兼容 Anthropic 协议，所以要在中间加一层转换。最常用的是社区项目 **claude-code-router**。

大致三步：

**第一步，本地准备好 Ollama。** 拉一个模型并确认服务在跑：

```fish
ollama pull qwen2.5-coder
ollama serve
```

**第二步，装并配置 claude-code-router。** 它会在本地起一个代理，把 Claude Code 发来的 Anthropic 请求翻译成 Ollama 的 OpenAI 格式，再把结果翻译回去。在它的配置里指定 Ollama 地址（默认 `http://localhost:11434`）和要用的模型。

**第三步，让 Claude Code 指向这个本地代理：**

```fish
set -gx ANTHROPIC_BASE_URL "http://localhost:你的router端口"
set -gx ANTHROPIC_AUTH_TOKEN "任意非空字符串"
```

本地模型 token 不要钱，但**别指望开源小模型在复杂工程任务上达到旗舰模型的水平**——它适合离线、隐私敏感或纯练手的场景。

---

## 五、验证：怎么确认接通了

配完别急着干活，先做一次冒烟测试。重开一个终端（让环境变量重新加载），然后：

```fish
echo $ANTHROPIC_BASE_URL   # 确认变量已生效，不是空的
claude                      # 启动后随便问一句「你好，你是什么模型」
```

如果模型正常回话，就通了。在 Claude Code 里输入 `/status` 也能看到当前连的接口地址，确认它指向的是你配置的第三方端点而不是官方地址。

---

## 六、踩坑排查清单

接不通时，照这张表逐条排查，命中率很高：

| 现象 | 大概率原因 |
|------|-----------|
| 401 / 认证失败 | key 填错，或国内 / 国际站点的 key 用混了 |
| 404 / 地址错误 | `BASE_URL` 漏了 `/anthropic` 等路径后缀 |
| 改了配置没生效 | 没重开终端，旧的环境变量还在；或 settings.json 和环境变量冲突 |
| 模型不存在 | 模型 ID 写错或版本过期，对照官方最新文档 |
| 回答质量明显变差 | 接的不是同档位模型，调高模型档位或换更强的型号 |

一个高频隐形坑：`ANTHROPIC_AUTH_TOKEN` 和 `ANTHROPIC_API_KEY` 同时存在时可能打架。**只保留厂商要求的那一个，把另一个删掉**，能省掉很多莫名其妙的认证错误。

---

## 写在最后

整套配置说穿了就两步：判断厂商是不是兼容 Anthropic 协议，然后把地址、key、模型 ID 三个值填对。兼容的直接指过去，不兼容的加一层 claude-code-router。

真正该花心思的不是怎么配，而是配完之后——**你到底需要旗舰模型的能力，还是只需要一个够用又便宜的替代品？** 想清楚这个，你才知道该把 `ANTHROPIC_MODEL` 那一行填成什么。

---

*参考来源：[DeepSeek 官方文档 - Claude Code 集成](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code)、[Kimi API 平台 - Agent 支持](https://platform.kimi.ai/docs/guide/agent-support)、[智谱 AI - Claude API 兼容文档](https://docs.bigmodel.cn/cn/guide/develop/claude/introduction)*
