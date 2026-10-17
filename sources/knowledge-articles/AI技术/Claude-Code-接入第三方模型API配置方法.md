# Claude Code 接入第三方模型 API 配置方法

Claude Code 默认走 Anthropic 官方接口，但它的底层只认一件事——Anthropic 的 `/v1/messages` 协议。这意味着，只要某个网关或厂商兼容这套协议，你就能把 Claude Code 指过去。下面把接入方式分成几类讲清楚，每段都附可直接复制的配置（以 fish shell 为例）。

---

## 一、最通用的方式：环境变量

Claude Code 启动时读取下面这几个关键环境变量：

| 变量 | 作用 |
|------|------|
| `ANTHROPIC_BASE_URL` | API 服务地址，换成第三方网关地址 |
| `ANTHROPIC_AUTH_TOKEN` | 认证 token，第三方厂商给的 key |
| `ANTHROPIC_API_KEY` | 同上，部分网关用这个变量名 |
| `ANTHROPIC_MODEL` | 默认主模型 ID |
| `ANTHROPIC_SMALL_FAST_MODEL` | 后台小任务用的模型 ID |

写到 `~/.config/fish/config.fish`，永久生效：

```fish
set -gx ANTHROPIC_BASE_URL "https://你的网关地址"
set -gx ANTHROPIC_AUTH_TOKEN "你的-api-key"
set -gx ANTHROPIC_MODEL "模型ID"
```

只想临时测试一次，不污染全局配置，就在当前会话里设：

```fish
env ANTHROPIC_BASE_URL=... ANTHROPIC_AUTH_TOKEN=... claude
```

---

## 二、按厂商分三类

**第一类，官方原生支持的云平台。** Anthropic 模型托管在主流云上，Claude Code 内置了专门的开关：

```fish
# Amazon Bedrock
set -gx CLAUDE_CODE_USE_BEDROCK 1

# Google Vertex AI
set -gx CLAUDE_CODE_USE_VERTEX 1
```

这两个走各自云的认证体系（AWS credentials / GCP ADC），不需要上面的 token 变量。

**第二类，兼容 Anthropic 协议的网关或中转。** 像 OpenRouter、各类聚合网关、自建中转，它们模拟了 Anthropic 的接口，所以直接改 `BASE_URL` 加 `AUTH_TOKEN` 就能用。以 OpenRouter 为例：

```fish
set -gx ANTHROPIC_BASE_URL "https://openrouter.ai/api/v1"
set -gx ANTHROPIC_AUTH_TOKEN "sk-or-..."
```

**第三类，只有 OpenAI 格式接口的厂商。** DeepSeek、通义、Kimi、GLM、本地 Ollama 等大多只提供 OpenAI 格式接口，不直接兼容 Anthropic 协议，需要一个协议转换层。两种主流做法：

- **claude-code-router**（社区项目，最常用）：本地起一个代理，把 Anthropic 请求转成各家 OpenAI 格式，还支持按场景路由到不同模型。
- **厂商自带的 Anthropic 兼容端点**：现在很多国产厂商（如智谱 GLM、Kimi、MiniMax）已经直接提供 `anthropic` 兼容地址，填进 `BASE_URL` 即可，无需转换层。

---

## 三、用 settings.json 管理（推荐）

比起全局环境变量，更干净的做法是写进 Claude Code 的配置文件，可以针对项目隔离。全局配置放 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://你的网关地址",
    "ANTHROPIC_AUTH_TOKEN": "你的-key",
    "ANTHROPIC_MODEL": "模型ID",
    "ANTHROPIC_SMALL_FAST_MODEL": "小模型ID"
  }
}
```

放在项目目录的 `.claude/settings.json` 则只对该项目生效，方便不同项目用不同厂商。

---

## 写在最后

接入第三方模型的本质，就是回答一个问题：你的目标厂商，是兼容 Anthropic 协议，还是只有 OpenAI 格式？前者改两个环境变量就通，后者需要加一层转换。先想清楚这一点，再去查它的 `BASE_URL` 和模型 ID，剩下的就只是复制粘贴。 
