# 记忆

记忆功能可以让 ChatGPT 和 Codex 将早期工作中的有用上下文延续到后续工作中。ChatGPT 网页版使用 ChatGPT 记忆，而本地 Codex 客户端使用独立的本地记忆存储和控制方式。

团队必须遵循的指导应保存在 `AGENTS.md` 或纳入版本管理的文档中。记忆应被视为辅助回忆层，而不能作为那些必须始终遵守的规则的唯一来源。

在 ChatGPT 桌面应用中，使用 `/memories` 可以选择当前对话是否能够使用本地记忆，以及是否可以作为生成未来记忆的素材。如需开启或关闭此功能，请前往 **设置 > 个性化** 进行管理。

[Chronicle](https://learn.chatgpt.com/docs/customization/chronicle) 是一项仅限桌面端使用的功能，可以帮助 Codex 从你的屏幕中恢复近期工作上下文，以逐步积累记忆。



## 本地 Codex 记忆如何运作

启用记忆后，Codex 可以从符合条件的历史对话中提取有用的上下文，并将其转化为本地记忆文件。Codex 会跳过仍在进行或持续时间较短的会话，对生成的记忆字段中的敏感信息进行脱敏，并在后台更新记忆，而不是在每次对话结束后立即更新。

对话结束后，记忆不一定会立即更新。Codex 会等待对话闲置足够长的时间，以免对仍在进行的工作进行总结。

如果 Codex 的剩余速率限制百分比低于设定阈值，系统也可能跳过一次后台记忆生成，以免在接近限额时消耗配额。

## 本地记忆的存储位置

Codex 将记忆存储在 Codex 主目录下，默认路径为 `~/.codex`。如需了解 Codex 如何使用 `CODEX_HOME`，请参阅[配置和状态文件的位置](https://learn.chatgpt.com/docs/config-file/config-advanced#config-and-state-locations)。

主要的记忆文件位于 `~/.codex/memories/` 目录下，其中包括摘要、长期保留的条目、近期输入，以及来自历史对话的佐证信息。

请将这些文件视为自动生成的状态数据。你可以在排查问题或分享 Codex 主目录之前检查这些文件，但不要将手动编辑这些文件作为管理记忆的主要方式。



## 按对话控制本地记忆

在 ChatGPT 桌面应用和 Codex TUI 中，使用 `/memories` 可以控制当前对话的记忆行为。对话级选项允许你决定当前对话能否使用现有记忆，以及 Codex 能否使用该对话生成未来的记忆。

对话级选项不会改变全局记忆设置。

## 检查本地记忆

不要在记忆中存储敏感信息。虽然 Codex 会对生成的记忆字段中的敏感信息进行脱敏，但在分享 Codex 主目录或生成的记忆资料之前，你仍应检查相关记忆文件。



## 配置本地记忆

本地 Codex 记忆默认处于关闭状态。在 ChatGPT 桌面应用中，打开 **设置 > 个性化**，然后开启 **启用记忆**。

如果希望通过配置文件启用，请在 `config.toml` 中添加以下功能开关：

```
[features]
memories = true
```

有关配置文件的位置以及记忆相关设置的完整列表，请参阅[基础配置](https://learn.chatgpt.com/docs/config-file/config-basic)和[配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)。

常用的记忆专用设置包括：

- `memories.generate_memories`：控制是否可以将新创建的对话保存为生成记忆的输入素材。
- `memories.use_memories`：控制 Codex 是否将现有记忆注入后续会话。
- `memories.disable_on_external_context`：设为 `true` 时，使用过 MCP 工具调用、网页搜索或工具搜索等外部上下文的对话不会参与记忆生成。旧配置项 `memories.no_memories_if_mcp_or_web_search` 仍可作为别名使用。
- `memories.min_rate_limit_remaining_percent`：设置开始生成记忆前，Codex 速率限制所需的最低剩余百分比。
- `memories.extract_model`：覆盖用于从单次对话中提取记忆的模型。
- `memories.consolidation_model`：覆盖用于全局记忆整合的模型。