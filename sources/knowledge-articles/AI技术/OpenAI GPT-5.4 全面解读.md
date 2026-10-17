# OpenAI GPT-5.4 全面解读：最强前沿模型的能力、特性与使用指南

OpenAI 发布了其最新的旗舰模型 GPT-5.4，这是目前最强大的前沿模型，在 ChatGPT、API 和 Codex 中均能以更少的迭代次数交付更优质的输出。它在分析复杂信息、构建生产级软件和自动化多步骤工作流方面表现尤为出色。

## 相比 GPT-5.2 的关键提升

GPT-5.4 在多个关键领域实现了显著增强：

- **开发能力**：改进了编码、文档理解、工具调用和指令遵循能力
- **多模态性能**：更强的图像感知和多模态任务处理
- **智能体工作流**：更优的长时间运行任务执行和多步骤智能体协调
- **效率提升**：在工具密集型工作负载中 Token 使用效率更高
- **信息检索**：更强的智能体网络搜索和多来源信息综合能力
- **商业应用**：在文档密集型和电子表格密集型工作流中表现更好

值得注意的是，GPT-5.4 将 GPT-5.3-Codex 的编码能力直接整合进了旗舰模型，使得生产级代码生成只需更少的重试次数。

## GPT-5.4 的四大新特性

### 1. 工具搜索（Tool Search）

GPT-5.4 通过**延迟工具加载**（Deferred Tool Loading）改进了大型工具生态系统的工具搜索能力，在管理大量工具集时减少 Token 消耗，并提升工具选择的准确性。

### 2. 100 万 Token 上下文窗口

支持高达 **100 万 Token** 的上下文窗口，可以在单次请求中完成对整个代码库的全面分析、处理大规模文档集合，以及支持更长的智能体执行轨迹。

### 3. 计算机使用工具（Computer Use Tool）

GPT-5.4 内置了计算机操作能力，允许智能体通过截图检查和结构化动作执行来直接与软件界面交互。

### 4. 原生压缩支持（Native Compaction）

模型原生支持上下文压缩，可以在保留关键上下文的同时支持更长的智能体执行轨迹。

## 模型变体与选择指南

| 模型 | 最佳用途 |
|------|----------|
| **gpt-5.4** | 通用工作、推理、世界知识、代码密集型任务 |
| **gpt-5.4-pro** | 需要深度推理的复杂问题 |
| **gpt-5-mini** | 平衡速度和能力的成本优化任务 |
| **gpt-5-nano** | 高吞吐量的指令遵循和分类任务 |

## 推理与输出控制

### 推理力度参数（Reasoning Effort）

通过 `reasoning.effort` 设置控制模型在生成响应前的思考深度：

| 级别 | 说明 |
|------|------|
| `none` | 低延迟交互（**默认值**） |
| `low` | 均衡方式 |
| `medium` | 增强推理 |
| `high` | 深入分析 |
| `xhigh` | 最深度推理 |

建议从 `none` 开始，根据需要逐步增加推理力度，并结合精心设计的提示词来提升输出质量。

### 输出详细度（Verbosity）

输出长度可通过三个级别控制：

- **high**：详尽的解释和全面的重构
- **medium**：平衡方式（默认）
- **low**：简洁响应，适合 SQL 查询或简单生成任务

## 工具使用

### 自定义工具（Custom Tools）

自定义工具支持自由文本输入，允许模型直接向工具发送代码、SQL 查询、Shell 命令、配置文件或文本内容，而不局限于结构化 JSON：

```json
{
    "type": "custom",
    "name": "code_exec",
    "description": "Executes arbitrary python code"
}
```

### 上下文无关文法约束

GPT-5.4 支持使用 Lark 文法对自定义工具进行约束，将输出限制为特定语法或领域特定语言，确保严格的语法合规性。

### 允许工具参数（Allowed Tools）

`allowed_tools` 参数可以限制模型只访问大型工具集中的特定函数，支持 `auto` 模式（可选使用）和 `required` 模式（强制调用）。

### 工具前言（Tool Preambles）

模型可以在调用工具之前生成简短的用户可见解释，说明意图或推理计划。这增强了透明度和调试能力，且不会带来显著的推理开销。

## API 集成与上下文管理

### 100 万上下文窗口定价

- 272K Token 以下的请求按标准价格计费
- 超过 272K Token 的请求有单独定价
- 优先处理自动适用于超过 272K Token 的请求

### Phase 参数

对于扩展的 Responses API 流程，`phase` 字段可防止过早停止：

- `"commentary"`：中间更新，如工具调用前言
- `"final_answer"`：完成的响应

在多步骤任务中保留 phase 值可维持正确的模型行为。

## 参数兼容性注意事项

`temperature`、`top_p` 和 `logprobs` 参数**仅在** `reasoning.effort: "none"` 时支持。使用其他推理力度设置时传入这些参数会引发错误。

更高推理力度下的替代方案包括：
- 通过 effort 设置控制推理深度
- 通过 verbosity 配置输出详细度
- 使用 `max_output_tokens` 控制输出长度

## 代码示例

### 基础请求

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.4",
    input="用1毫米厚的黄金涂满自由女神像需要多少黄金？",
    reasoning={
        "effort": "none"
    }
)

print(response.output_text)
```

### 使用自定义工具

```python
response = client.responses.create(
    model="gpt-5.4",
    input="计算半径等于 'blueberry' 中 'r' 字母数量的圆面积",
    tools=[
        {
            "type": "custom",
            "name": "code_exec",
            "description": "Executes arbitrary python code"
        }
    ]
)
```

### 使用 Phase 参数

```python
response = client.responses.create(
    model="gpt-5.4",
    input=[
        {
            "role": "assistant",
            "phase": "commentary",
            "content": "我将检查日志并总结根本原因和修复方案。"
        },
        {
            "role": "assistant",
            "phase": "final_answer",
            "content": "根本原因：缓存失效竞态条件。"
        },
        {
            "role": "user",
            "content": "提供一个安全的发布修复计划。"
        }
    ]
)
```

## 迁移指南

| 来源模型 | 迁移建议 |
|----------|----------|
| GPT-5.2 | 可直接替换 |
| o3 | 使用 `medium` 或 `high` 推理力度，并调优提示词 |
| GPT-4.1 | 从 `none` 推理力度开始，逐步调优提示词 |
| gpt-4.1-mini | 考虑使用 gpt-5-mini |
| gpt-4.1-nano | 考虑使用 gpt-5-nano |

### 从 Chat Completions 迁移到 Responses API

主要优势：思维链（CoT）传递仅在 Responses API 中可用，已观察到更高的智能水平、更少的推理 Token 生成、更高的缓存命中率和更低的延迟。

## 最佳实践总结

1. **提示词工程**：利用 OpenAI 的提示词优化器进行自动化改进；即使在 `reasoning.effort: "none"` 时，也可以通过提示词鼓励显式推理
2. **工具使用**：编写简洁明确的工具描述以提高模型选择准确性；对自由文本输出进行服务端验证以确保安全
3. **长上下文利用**：充分利用 100 万 Token 窗口进行完整代码库分析和长时间智能体轨迹
4. **安全性**：使用 `allowed_tools` 提升安全性、可预测性和提示词缓存效果

---

> 来源：[OpenAI GPT-5.4 官方文档](https://developers.openai.com/api/docs/guides/latest-model)
