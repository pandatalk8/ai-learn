# ChatGPT 与 Codex 功能文档中文合并版

> 本文合并了 Browser、Computer Use、ChatGPT Voice、Plugins、Web search、Image generation、Image inputs、Appshots、Chrome extension 和 Work with files 十份官方文档的中文译文。产品名称、配置值、快捷键、代码示例和官方链接均予以保留。

## 目录

1. [浏览器（Browser）](#1-浏览器browser)
2. [电脑操作（Computer Use）](#2-电脑操作computer-use)
3. [ChatGPT 语音（ChatGPT Voice）](#3-chatgpt-语音chatgpt-voice)
4. [插件（Plugins）](#4-插件plugins)
5. [Web 搜索（Web search）](#5-web-搜索web-search)
6. [图像生成（Image generation）](#6-图像生成image-generation)
7. [图像输入（Image inputs）](#7-图像输入image-inputs)
8. [应用快照（Appshots）](#8-应用快照appshots)
9. [Chrome 扩展程序（Chrome extension）](#9-chrome-扩展程序chrome-extension)
10. [处理文件（Work with files）](#10-处理文件work-with-files)

---

## 1. 浏览器（Browser）

> [官方文档](https://learn.chatgpt.com/docs/browser) · [完整文档索引](https://learn.chatgpt.com/llms.txt)

Browser 让 ChatGPT 能够打开网站、获取最新信息并执行操作，同时确保一切仍由你掌控。你可以用它比较不同选项、完成网站上的多步骤任务，或者检查自己正在开发的页面。

Browser 可在网页版 ChatGPT 和 ChatGPT 桌面应用中使用。

请将网页内容视为不受信任的上下文。在分享敏感信息或允许 ChatGPT 执行操作前，请先检查网站和拟执行的操作。

ChatGPT 桌面应用中的内置浏览器，让你和 ChatGPT 可以在对话中共同查看网站和本地 Web 应用。你可以用它预览页面、留下可视化反馈，或让 ChatGPT 代你与网站交互。

内置浏览器使用一个独立于常用浏览器的浏览器配置文件。它不会自动共享你现有的标签页或浏览器会话。当任务需要使用账户时，你可以直接在内置浏览器中登录。打开“**设置 > 浏览器**”，可以管理浏览器数据，以及设备上可用的配置文件导入功能。

Browser 下载的文件默认保存到系统的“下载”文件夹。在“**设置 > 浏览器**”中，你可以选择其他下载位置、恢复为系统默认位置，或开启“**每次询问文件保存位置**”。

当 ChatGPT 需要操作现有的 Chrome 标签页或使用你平时的 Chrome 配置文件时，请改用 [Chrome 扩展程序](https://learn.chatgpt.com/docs/chrome-extension)。

你可以通过工具栏、点击 URL、手动导航，或者按下 <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>（Windows 上为 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>）打开内置浏览器。

### 从地址栏搜索

开始在内置浏览器的地址栏中输入内容，即可从浏览历史记录中查找页面。你可以选择匹配的页面重新打开；如果没有匹配的历史记录，也可以输入搜索词，通过 Google 搜索。

内置浏览器拥有独立的配置文件和浏览历史记录。搜索结果不会自动包含你常用的 Chrome 配置文件或其他浏览器中的页面。

### 管理浏览历史记录

打开“**设置 > 浏览器**”，可以搜索内置浏览器的历史记录、重新打开访问过的页面；如果你的组织允许，也可以删除历史记录条目。使用“**清除浏览数据**”，可以选择要清除的时间范围和浏览数据类型。

在该功能可用时，ChatGPT 可能会请求搜索你的浏览历史，以查找与当前任务相关的页面。请在授权访问前仔细检查该请求。浏览历史可能包含内部 URL、搜索关键词及其他敏感信息，因此只有在任务确实需要这些上下文时才应允许访问。

### 在浏览器中使用“电脑操作”（Computer Use）

在桌面应用中，“电脑操作”功能允许 ChatGPT Work 或 Codex 直接操作内置浏览器。当前选用的体验可以打开页面、点击、输入、检查渲染状态、截取屏幕截图，并在页面中验证工作结果。

打开“**插件（Plugins）**”标签页并安装 **Browser**。然后，在任务中让 ChatGPT 或 Codex 使用浏览器，或者直接通过 `@Browser` 引用它。

例如：

```text
使用浏览器打开 http://localhost:3000/settings，复现这个布局问题，
并且只修复发生溢出的控件。
```

除非你已经允许访问某个网站，否则 ChatGPT 在使用该网站前会先征求你的同意。你可以在“**设置 > 浏览器**”中管理允许和阻止的网站。

在提交信息、进行购买、更改权限或删除数据等敏感操作之前，ChatGPT 也会要求你确认。ChatGPT 无法在内置浏览器中自动完成文件上传。

网页中的指令可能具有误导性或恶意。授予网站访问权限只代表 ChatGPT 可以与该网站交互；这并不意味着网站内容值得信任，也不代表你批准了网站上的所有操作。

### 预览页面

1. 在[集成终端](https://learn.chatgpt.com/docs/integrated-terminal)中，或者通过[本地环境操作](https://learn.chatgpt.com/docs/environments/local-environment#actions)，启动应用的开发服务器。
2. 点击 URL 或手动导航，在浏览器中打开本地路由、基于文件的页面或公开页面。
3. 将页面的实际渲染状态与代码差异并排检查。
4. 针对需要修改的元素或区域留下浏览器评论。
5. 让 ChatGPT 处理这些评论，并保持修改范围集中、明确。

例如：

```text
我在内置浏览器的定价页面上留下了一些评论。
请解决移动端布局问题，并保持卡片结构不变。
```

### 在页面上添加评论

当问题只有在页面实际渲染后才能看到时，可以使用浏览器评论向 ChatGPT 提供精确反馈。

1. 开启“**标注模式（Annotation mode）**”。
2. 点击某个元素，或者拖动鼠标选择一个区域。
3. 编写并保存评论。
4. 在对话中发送消息，让 ChatGPT 处理这些评论。

如果能明确指出问题以及期望达到的结果，评论会更加有效：

```text
这个按钮在移动端发生了溢出。
如果空间足够，请让标签保持在一行；
否则允许它换行，但不要改变卡片高度。
```

```text
这个工具提示遮住了光标下方的数据点。
请重新调整工具提示的位置，使其始终位于图表边界以内。
```

#### 样式反馈

当你为页面中的某个区域添加标注时，可以选择文本输入框旁边的“**调整（Adjust）**”，向 ChatGPT 提供更细致的样式反馈。

你可以修改字体、文本、间距和颜色等属性，在页面中预览修改效果，然后发送包含更明确目标的标注。

### 控制浏览器任务的范围

每项浏览器任务都应足够小，以便你能在一次检查中完成审核。

- 明确指出页面、路由或 URL。
- 明确指出你关注的状态，例如加载状态、空状态、错误状态或成功状态。
- 在确切需要修改的元素或区域上留下评论。
- ChatGPT 完成工作后，再次检查页面。
- 在打开本地页面之前，让 ChatGPT 启动或检查开发服务器。

对于代码仓库中的修改，请使用[审查面板](https://learn.chatgpt.com/docs/code-review?surface=app)检查变更并留下评论。

### 开发者模式

开发者模式可以与 Chrome 和内置浏览器中的“电脑操作”功能配合使用。它允许 ChatGPT 以受控方式访问 Chrome DevTools Protocol（CDP）。

你可以使用它分析 JavaScript 性能、检查控制台输出和网络流量、查看 DOM 和已应用的样式，或者诊断实时浏览器中的问题。

要启用开发者模式，请打开“[**设置 > 浏览器**](codex://settings/browser-use)”，然后在“**开发者模式（Developer mode）**”下开启“**启用完整 CDP 访问权限（Enable full CDP access）**”。

如果你的组织禁用了此设置，你将无法在本地启用它。管理员可以在 [`requirements.toml`](https://learn.chatgpt.com/docs/enterprise/managed-configuration#pin-feature-flags) 的 `[features]` 部分设置：

```toml
browser_use_full_cdp_access = false
```

这样可以禁用完整 CDP 访问，并阻止用户启用对应设置。

完整的 CDP 访问权限可能会暴露敏感的浏览器内部信息。在使用完整 CDP 权限检查网站之前，ChatGPT 会明确请求你的批准。批准前，请检查网站、任务以及所请求的访问权限。

使用 `@Browser` 操作内置浏览器。要在 Chrome 中使用开发者模式，请先[配置 Chrome 扩展程序](https://learn.chatgpt.com/docs/chrome-extension)，然后调用 `@Chrome`。

例如：

```text
这个应用运行得很慢。请使用 @Browser 捕获性能跟踪数据并检查网络流量，
然后找出性能瓶颈。
```

---

## 2. 电脑操作（Computer Use）

> [官方文档](https://learn.chatgpt.com/docs/computer-use) · [完整文档索引](https://learn.chatgpt.com/llms.txt)

在受支持的地区，ChatGPT 桌面应用中的 Computer Use 可在 macOS 和 Windows 上与 ChatGPT Work、Codex 配合使用。请安装 Computer Use 插件。在 macOS 上，请在系统提示时授予“屏幕录制”和“辅助功能”权限。

借助 Computer Use，ChatGPT 可以查看并操作 macOS 或 Windows 上的图形用户界面。它适用于命令行工具或结构化集成无法满足需求的任务，例如检查桌面应用、使用浏览器、更改应用设置、操作尚未提供插件的数据源，或者复现只会在图形界面中出现的问题。

由于 Computer Use 可以改变项目工作区以外的应用及系统状态，请将它用于范围明确的任务，并在继续操作前认真检查权限请求。

### 设置 Computer Use

在 ChatGPT 桌面应用中，选择 ChatGPT，然后通过切换器切换到 Work；或者选择 Codex。打开“**插件 > Computer Use**”，并在出现提示时选择“**安装插件**”。如果 ChatGPT 显示“**启用**”，请选择它。

开启 Computer Use 的服务器和技能开关，然后选择“**立即试用**”开始使用。

接下来，打开“**设置 > Computer Use**”检查应用访问权限。已连接浏览器的控制项会显示“**管理**”操作。你批准可供今后任务使用的应用，会出现在“**始终允许的应用**”部分。

在 Windows 上，任务运行期间，请让目标应用保持显示在当前活动桌面上。

在 macOS 上，请在系统提示时授予“屏幕录制”和“辅助功能”权限，以便 ChatGPT 查看目标应用并与其交互。

在 macOS 上，请授予以下权限：

- **屏幕录制**权限：让 ChatGPT 可以看到目标应用。
- **辅助功能**权限：让 ChatGPT 可以点击、输入和导航。

### 何时使用 Computer Use

当任务依赖图形用户界面，并且仅通过文件或命令输出难以验证时，请选择 Computer Use。

适用场景包括：

- 测试 ChatGPT 正在开发的 macOS 应用、Windows 应用、iOS 模拟器流程或其他桌面应用。
- 执行需要使用 Web 浏览器的任务。
- 复现只会在图形界面中出现的问题。
- 更改必须通过图形界面逐步点击才能调整的应用设置。
- 检查尚未通过插件提供的应用或数据源中的信息。
- 在 macOS 上，让一个范围明确的任务在后台运行，同时继续处理其他工作。
- 执行跨越多个应用的工作流程。

对于你正在本地开发的 Web 应用，请优先使用[内置浏览器](https://learn.chatgpt.com/docs/browser?surface=app)。

#### Windows 前台操作

在 Windows 上，Computer Use 运行于当前活动桌面。你无法在继续使用同一个 Windows 会话的同时，让它在后台操作。因此，任务运行期间，ChatGPT 会移动鼠标指针、输入内容并接管前台操作。

如果你希望 Windows 任务在自己离开后继续运行，请让 Windows 设备保持解锁并连接到互联网。

你可以通过手机使用[远程控制](https://learn.chatgpt.com/docs/remote-connections)检查进度或发送后续指令；也可以在 Windows 虚拟机中运行 ChatGPT 桌面应用。这样，Computer Use 接管的是虚拟机，而不是你的主桌面。

### 启动 Computer Use 任务

在提示词中提及 `@Computer` 或 `@应用名称`，也可以直接要求 ChatGPT 使用 Computer Use。请准确描述 ChatGPT 应当操作的应用、窗口或流程。

```text
使用 Computer Use 打开这个应用，复现新手引导中的问题，
并只修复导致该问题的最小代码路径。
每次修改后，重新运行一遍相同的界面流程。
```

```text
打开 @Chrome，验证结账页面在最近的修改后是否仍能正常工作。
```

如果目标应用提供专用插件或 MCP 服务器，在访问数据和执行可重复操作时，应优先选择这种结构化集成。

当 ChatGPT 需要以视觉方式检查或操作应用时，再选择 Computer Use。

### 权限与批准

Computer Use 所需的系统权限，与 ChatGPT 中的应用批准是相互独立的。

在 macOS 上，“屏幕录制”和“辅助功能”权限让 ChatGPT 能够查看和操作应用；应用批准则决定你允许 ChatGPT 使用哪些应用。读取文件、编辑文件及运行终端命令，仍然遵循当前任务的沙箱和批准设置。

使用 Computer Use 时，ChatGPT 只能查看并操作你允许的应用。在任务执行过程中，ChatGPT 必须先征得你的许可，才能使用计算机上的某个应用。

你可以选择“**始终允许**”，让 ChatGPT 今后使用该应用时不再询问。你可以在 ChatGPT 桌面应用设置的“**Computer Use**”部分，从“**始终允许**”列表中移除应用。

在执行敏感操作或可能造成干扰的操作前，ChatGPT 也可能请求你的许可。

如果 ChatGPT 无法查看或控制某个应用：

- 在 macOS 上，打开“**系统设置 > 隐私与安全性**”，检查是否已为 **Codex Computer Use** 授予“**屏幕录制**”和“**辅助功能**”权限。
- 在 Windows 上，确保目标应用显示在当前活动的桌面会话中。

#### 配置 Windows 应用策略

在 Windows 上，Computer Use 会将长期有效的应用使用决定保存在 `$CODEX_HOME/config.toml` 中。你可以列出 Computer Use 无须询问便可打开的应用：

```toml
[computer_use.windows]
always_allowed_app_ids = ["mspaint.exe"]
```

请使用 Windows Computer Use 报告的应用标识符。例如，桌面应用可以使用可执行文件名称，打包应用则可以使用应用用户模型 ID。

对于不在列表中的应用，ChatGPT 会请求你的许可。要撤销已保存的决定，请从“**设置 > Computer Use > 始终允许**”中移除该应用。

此配置表保存的是本地 Computer Use 使用决定。它与管理员强制执行的 `requirements.toml` 相互独立。管理员可以通过以下配置禁用 Computer Use：

```toml
[features]
computer_use = false
```

旧版 `$CODEX_HOME/computer-use/config.toml` 中的允许列表条目会迁移到当前设置；其中的 `denied` 列表不属于当前策略架构。

### 锁屏使用

锁屏使用功能适用于 macOS。在 Windows 上，Computer Use 在前台运行。

启用该功能后，即使 Mac 已锁屏，ChatGPT 仍然可以继续使用 Computer Use。不过，你必须先主动启用它。

当 Mac 锁屏后，如果一个 ChatGPT 任务需要通过已连接的设备使用桌面应用，就可以使用这项功能。

启用锁屏使用时，ChatGPT 会安装一个参与 macOS 解锁流程的 Apple [授权插件](https://developer.apple.com/documentation/security/authorization-plug-ins)。

锁屏使用的适用范围经过刻意限制。它不是用于远程解锁 Mac 的通用方式，也不允许其他应用或本地进程解锁计算机。

使用锁屏功能的步骤如下：

1. 在应用中打开“**设置 > Computer Use**”。
2. 启用锁屏使用功能。
3. Mac 屏幕锁定后，通过已连接的设备启动一个使用 Computer Use 的任务。

Mac 锁屏后，如果 ChatGPT 任务通过 Computer Use 访问应用，ChatGPT 会暂时解锁 Mac，同时阻止本地操作并维持锁屏保护。

解锁前，ChatGPT 会检查此次解锁尝试是否来自一个当前有效且可信的 Computer Use 交互轮次。在这段短暂的授权窗口之外，ChatGPT 会拒绝解锁；必要时，它会要求你手动解锁。

锁屏使用包含以下安全保护：

- 授权窗口持续时间很短，并且仅适用于当前的解锁尝试。
- 只有 ChatGPT 能在 Computer Use 任务处于活动状态时自动解锁。
- 桌面暂时解锁期间，ChatGPT 会遮盖所有显示器。
- 如果 ChatGPT 检测到本地键盘或鼠标指针输入，它会重新锁定 Mac，并暂停自动解锁，直到你手动完成解锁。

### 安全指南

使用 Computer Use 时，ChatGPT 可以查看屏幕内容、截取屏幕截图，并与目标应用中的窗口、菜单、键盘输入及剪贴板状态交互。

任务运行期间，请将可见的应用内容、浏览器页面、屏幕截图以及目标应用中打开的文件，视为 ChatGPT 可能会处理的上下文。

请保持任务范围明确，并在涉及敏感流程时留在设备旁：

- 每次只为 ChatGPT 指定一个明确的目标应用或操作流程。
- 你可以随时停止任务或接管计算机。
- 除非任务确实需要，否则请关闭包含敏感信息的应用。
- 在 Windows 上，ChatGPT 工作时会接管前台输入。请使用另一台设备或虚拟机；如果你需要亲自使用该桌面，请先停止任务。
- 除非你在场并且能够逐步批准，否则请避免执行需要使用机密信息的任务。
- 在允许 ChatGPT 使用某个应用前，请认真检查应用权限请求。
- 只有当你信任 ChatGPT 可以在未来任务中自动使用某个应用时，才应选择“**始终允许**”。
- 涉及账户、安全、隐私、网络、付款或凭据设置时，请留在设备旁。
- 如果 ChatGPT 开始操作错误的窗口，请取消任务。

如果 ChatGPT 使用你的浏览器，它可以与已经登录的网站页面交互。请像亲自执行操作一样检查网站行为：

- 网页可能包含恶意或误导性内容。
- 网站可能会将已批准的点击、表单提交和登录状态下的操作，视为由你的账户发起。
- 如果你希望在 ChatGPT 工作期间继续使用自己的浏览器，请让 ChatGPT 使用另一个浏览器。

该功能无法自动操作终端应用或 ChatGPT 本身，因为自动操作这些应用可能绕过 ChatGPT 的安全策略。

它也无法以管理员身份完成身份验证，或批准计算机上的安全及隐私权限请求。

在适用情况下，文件编辑和终端命令仍然遵循 ChatGPT 的批准与沙箱设置。通过桌面应用进行的修改，可能要等到内容保存至磁盘并由项目跟踪后，才会显示在审查面板中。

你的 ChatGPT 数据控制设置适用于通过 ChatGPT 处理的内容，其中也包括 Computer Use 截取的屏幕截图。

---

## 3. ChatGPT 语音（ChatGPT Voice）

> [官方文档](https://learn.chatgpt.com/docs/features/voice) · [完整文档索引](https://learn.chatgpt.com/llms.txt)

ChatGPT Voice 由 GPT-Live 驱动，让你可以在 ChatGPT 桌面应用的 Chat、Work 和 Codex 中通过语音讨论想法并协调任务。无须切换回键盘输入，你就能启动工作、检查进度或调整方向。

ChatGPT Voice 可在 ChatGPT 桌面应用中使用，支持 ChatGPT Plus、Pro、Business、Edu 和 Enterprise 套餐。

对于 Enterprise 和 Edu 套餐，该功能会先经历为期两周的抢先体验阶段，之后才默认开放。

将手机与桌面主机配对后，你还可以通过 [iOS 上的 Remote](https://learn.chatgpt.com/docs/remote-connections#set-up-mobile-access) 使用 ChatGPT Voice。实际可用性还取决于功能的发布进度和工作区设置。请参阅[功能可用性](https://learn.chatgpt.com/docs/pricing#feature-availability)。

### 开始对话

1. 在 ChatGPT 桌面应用中打开一个新的空白聊天或任务。
2. 发送消息前，选择“**开始新的语音聊天**”。
3. 第一次启动语音聊天时，请允许应用访问麦克风、选择一种语音，并在 macOS 上检查屏幕上下文设置。
4. 开始说话。对话结束时，选择“**结束**”。

聊天或任务必须以语音模式开始，才能使用 ChatGPT Voice。如果聊天或任务最初以其他模式开始，则只能使用语音听写。

要继续先前的语音聊天，请打开该聊天并选择“**开始语音聊天**”。

你可以在“**设置 > 语音 > 语音聊天快捷键**”中设置快捷键。

### 进行对话

ChatGPT Voice 支持自然的轮流对话。

你可以在 ChatGPT 回答时打断它、提出后续问题或改变对话方向。如果 ChatGPT 已经开始执行工作，你可以继续与它交谈，检查进度或引导任务。

### 委派和协调工作

对于耗时较长的任务，ChatGPT Voice 可以启动单独的任务、检查现有任务并发送后续指令。

它会将工作进展、阻碍因素和结果带回当前语音对话，让你可以在后台工作继续进行的同时保持交谈。

例如：

- “检查今天的发布简报，并总结需要审批的决定。”
- “启动一个 Codex 任务来运行测试，并调查所有未通过的测试。”
- “检查当前正在进行的任务，并总结所有阻碍进展的问题。”

ChatGPT Voice 遵循它在 ChatGPT 桌面应用的 Chat、Work 和 Codex 中所指挥任务的相同[权限设置](https://learn.chatgpt.com/docs/permission-modes)。

### 向 ChatGPT 展示你看到的内容

在 macOS 上，打开“**设置 > 语音**”中的“**屏幕上下文**”，然后说：“看看这个。”

ChatGPT 可以为当前最前端窗口拍摄一张[应用快照（appshot）](https://learn.chatgpt.com/docs/appshots#permissions-and-safety)，并将其用作上下文。你的组织可以禁用此功能。

应用快照可以包含窗口图像和可访问文本，其中可能包括当前可见滚动区域之外的内容。

macOS 可能会请求“**屏幕与系统音频录制**”和“**辅助功能**”权限。请避免共享包含敏感信息的窗口，包括位于当前可见滚动区域之外的文本。

### ChatGPT Voice 与语音听写

如果你希望与 ChatGPT 进行实时对话，请使用 ChatGPT Voice。

如果你只是希望在发送前将语音转换为提示词文本，请使用[语音听写](https://learn.chatgpt.com/docs/prompting#use-voice-dictation)。

### 限制与故障排除

在整个 ChatGPT 桌面应用中，同一时间只能进行一个语音聊天。

语音对话拥有独立的套餐相关使用额度，该额度按照滚动的五小时窗口计算。

通过 Voice 启动的任务仍会消耗你的 Codex 使用额度。达到上述任一限制时，ChatGPT 都会通知你。请参阅 [Voice 定价与使用限制](https://learn.chatgpt.com/docs/pricing#chatgpt-voice-in-desktop)。

如果你无法启动语音聊天，请确认：

- 你的套餐、功能发布批次和工作区支持 ChatGPT Voice。
- ChatGPT 桌面应用已获得麦克风权限。
- 其他应用窗口中没有正在进行的语音聊天。

如果屏幕上下文不可用，请检查“**设置 > 语音**”、应用快照权限以及你所在组织设置的限制。

---

## 4. 插件（Plugins）

> [官方文档](https://learn.chatgpt.com/docs/plugins) · [完整文档索引](https://learn.chatgpt.com/llms.txt)

插件将多种能力打包成可在 ChatGPT 和 Codex 中重复使用的工作流程。插件可以包含技能、连接器，也可以同时包含二者。

两款产品使用同一个通用插件目录，因此可以从各自支持的界面中找到相同的公开插件。

插件可用于：

- 网页版、桌面版和移动版 ChatGPT 中的 Chat 与 Work。
- ChatGPT 桌面应用中的 Codex。
- Codex CLI 中的 Codex 环境。Codex CLI 提供了插件浏览器。

Codex IDE 扩展目前不支持插件。

在移动设备上，你可以在 Chat 或 Work 中使用当前账户可用的插件。

打开“**插件（Plugins）**”标签页即可浏览并安装插件。安装后，你可以在 ChatGPT 的 Chat 或 Work 中使用插件，也可以在 Codex 中使用。

已安装的插件可以为新聊天添加技能、连接器和 MCP 工具。

插件能够扩展 ChatGPT 和 Codex 的能力。例如：

- 安装 Codex Security 插件，扫描已经获得授权的代码，并确认可能存在的漏洞。
- 安装 Gmail 插件，处理 Gmail 中的内容。
- 安装 Google Drive 插件，在 Drive、Docs、Sheets 和 Slides 中开展工作。
- 安装 Slack 插件，总结频道内容或起草回复。

一个插件可以包含以下一种或多种组成部分：

- **技能（Skills）：**针对特定工作类型编写的可复用指令。ChatGPT 和 Codex 可以在需要时加载这些技能，从而按照正确步骤执行任务，并使用适当的参考资料或辅助脚本。
- **连接器（Connectors）：**与 GitHub、Slack 或 Google Drive 等工具建立的连接，使 ChatGPT 和 Codex 可以读取这些工具中的信息并执行操作。连接器会公开可用工具，也可以选择提供自定义界面。
- **MCP 服务器：**为 ChatGPT 和 Codex 提供更多工具或共享信息的服务，这些信息通常来自本地项目之外的系统。MCP 服务器也是连接器背后的服务。它们负责定义工具、实施身份验证、返回结构化数据以及在外部系统中执行操作。
- **浏览器扩展程序：**插件工作流程所需的浏览器能力。
- **钩子（Hooks）：**在预先配置的生命周期节点运行的命令。启用插件钩子前，请先检查并确认你信任它们。
- **定时任务模板：**在支持定时任务的环境中，为周期性任务提供可复用的起点。

你可以通过插件市场来源发布插件，从而与其他人共享。例如，可以为项目或团队创建基于代码仓库的插件市场。

有关插件市场设置、打包和分发的说明，请参阅[构建插件](https://developers.openai.com/plugins/build/plugins)。

如果你正在开发一项集成，请从[构建 MCP 服务器](https://developers.openai.com/plugins/build/mcp-server)开始。

如果插件需要自定义界面，请参阅[可选界面指南](https://developers.openai.com/plugins/build/chatgpt-ui)。

### 使用和安装插件

#### 通用插件目录

ChatGPT 和 Codex 使用同一个公开插件目录。

在网页版 ChatGPT 或 ChatGPT 桌面应用中，打开“**插件（Plugins）**”标签页即可浏览并安装插件。

插件目录通过以下标签页组织插件：

- **OpenAI：**由 OpenAI 开发的插件。
- **你的工作区名称：**由你的工作区提供的插件。
- **个人（Personal）：**来自个人插件市场的插件。相关插件可用时，其中还会包含“**由我创建（Created by me）**”和“**与我共享（Shared with me）**”部分。

使用单独的“**已安装（Installed）**”行，可以查看你已经安装的插件。

#### 安装和使用插件

打开插件目录后：

1. 搜索或浏览插件，然后打开插件的详细信息。
2. 选择加号按钮安装插件。
3. 如果插件需要连接器，请在系统提示时完成连接。有些插件会在安装过程中要求你完成身份验证，另一些插件则会等到第一次使用时再要求验证。
4. 安装完成后，启动一个新聊天，并要求 ChatGPT 或 Codex 使用该插件。

#### 通过“使用 ChatGPT 登录”连接受支持的合作伙伴

“**使用 ChatGPT 登录（Sign in with ChatGPT）**”功能正在以测试版形式逐步向受支持的插件和合作伙伴网站开放，其中包括 Airtable、GitLab、HubSpot、Notion、Supabase 和 Vercel。

当该选项可用时，在连接插件的过程中选择“**使用 ChatGPT 登录**”，即可在对应服务中创建账户，或者关联已有账户。

登录时只会与合作伙伴共享以下可用信息：

- 姓名
- 电子邮件地址
- 个人资料图片

登录操作不会授予插件访问你数据的权限，也不会自动批准插件执行操作。

使用该连接前，你仍然需要单独检查并批准插件请求的权限。

安装插件后，你可以直接在提示词窗口中使用它。

##### 直接描述任务

直接告诉 ChatGPT 你想获得什么结果，例如：

```text
总结今天尚未阅读的 Gmail 邮件会话。
```

```text
从 Google Drive 中获取最新的发布说明。
```

如果你希望 ChatGPT 自行选择适合当前任务的已安装工具，请使用这种方式。

##### 选择指定插件

输入 `@`，明确调用某个插件或该插件内置的某项技能。

如果你希望明确指定 ChatGPT 应该使用哪个插件或技能，请使用这种方式。有关更多信息，请参阅[技能与插件](https://learn.chatgpt.com/docs/skills-and-plugins)。

#### 使用 API 密钥时的插件可用性

如果你[使用 OpenAI API 密钥登录 Codex](https://learn.chatgpt.com/docs/auth#sign-in-with-an-api-key)，便可以在 Codex CLI 和 ChatGPT 桌面应用中的 Codex 里浏览、安装和管理受支持的 OpenAI 精选插件。

使用 API 密钥进行身份验证时，部分插件不可用，因为它们的连接流程需要当前不受支持的 OAuth 能力。

你可以在 [OpenAI Platform 用量页面](https://platform.openai.com/usage)查看插件用量。

#### 权限和数据共享的工作方式

当插件能力通过 Codex 主机运行时，将应用该主机的[沙箱和批准策略](https://learn.chatgpt.com/docs/agent-approvals-security)。

与外部服务建立的连接，则使用相应服务自身的身份验证和访问控制机制。

- 安装插件后，在你启动新的聊天或 CLI 会话时，插件内置的技能将变为可用状态。
- 如果插件包含连接器，当前使用的产品可能会在设置过程中或首次使用时，要求你安装连接器或登录相应服务。
- 如果插件包含 MCP 服务器，你可能需要先完成额外设置或身份验证才能使用。
- 当 ChatGPT 通过插件内置的连接器发送数据时，适用该服务自身的条款和隐私政策。

#### 移除插件

要移除插件，请通过受支持的插件浏览器打开该插件，并在相应操作可用时选择“**卸载插件（Uninstall plugin）**”。

由工作区安装的插件或默认插件可能不提供卸载操作；这些插件由工作区管理员控制。

卸载插件会从对应的 ChatGPT 或 Codex 环境中移除插件包，但插件内置的连接器仍会保持连接，直到你在 ChatGPT 中对其进行管理。

### 构建自己的插件

如果你希望创建、测试或分发自己的插件，请参阅[构建插件](https://developers.openai.com/plugins/build/plugins)。

该页面涵盖以下内容：

- 创建本地插件脚手架
- 手动设置插件市场
- 在工作区中共享插件
- 编写插件清单
- 插件打包说明

如果插件包含由服务器提供的能力，请参阅[构建 MCP 服务器](https://developers.openai.com/plugins/build/mcp-server)。

MCP 工具可以在没有自定义界面的情况下运行；当可视化界面有助于完成工作流程时，也可以返回自定义界面。

插件准备好接受审核后，请参阅[提交插件](https://developers.openai.com/plugins/deploy/submission)，了解 OpenAI Platform 的插件提交流程、所需权限、审核材料、MCP 检查和测试用例要求。

### 插件指南

- [Record & Replay](https://learn.chatgpt.com/docs/extend/record-and-replay)：向 ChatGPT 演示一次工作流程，并将其转化为可复用技能。
- [Codex Security 插件](https://learn.chatgpt.com/docs/security/plugin)：扫描已经获得授权的代码、确认发现的问题并准备经过审核的修复方案。

---

## 5. Web 搜索（Web search）

> [官方文档](https://learn.chatgpt.com/docs/web-search) · [完整文档索引](https://learn.chatgpt.com/llms.txt)

ChatGPT 内置了由 OpenAI 提供的第一方 Web 搜索工具。

请将所有 Web 搜索结果视为不受信任的输入。

在 ChatGPT 桌面应用中，你可以在聊天中请求最新信息。ChatGPT 会将搜索活动与其他工具调用一起记录在对话记录中。

### 配置本地 Web 搜索

对于本地 Codex 聊天，Codex 默认启用缓存搜索。

缓存模式使用由 OpenAI 维护的索引，不会直接实时获取任意网页。这样可以降低提示词注入风险，但无法完全消除这种风险。

当任务依赖最新信息时，请使用实时搜索。在 `config.toml` 中设置：

```toml
web_search = "live"
```

如需关闭 Web 搜索工具，请设置：

```toml
web_search = "disabled"
```

`"indexed"` 模式只有在搜索索引允许请求时，才会开放外部网络访问：

```toml
web_search = "indexed"
```

当 Codex 以完全访问权限运行时，Web 搜索默认使用实时结果。

有关配置文件的位置和优先级，请参阅[基础配置](https://learn.chatgpt.com/docs/config-file/config-basic)。

#### 使用自定义模型提供商进行搜索

如果自定义模型提供商支持兼容的搜索端点，可以选择启用独立 Web 搜索：

```toml
model_provider = "custom"
web_search = "live"

[model_providers.custom]
name = "Custom Responses provider"
base_url = "https://example.com/v1"
env_key = "CUSTOM_RESPONSES_API_KEY"
supports_standalone_web_search = true
```

自定义提供商的 `supports_standalone_web_search` 默认值为 `false`。

独立 Web 搜索功能仍在开发中，因此默认处于关闭状态。

设置这一提供商能力并不会单独启用该功能。提供商、当前选择的模型和运行环境也必须支持独立搜索。

工作区和托管环境中的搜索限制仍然适用。

有关适用于 Codex 云环境的网络边界，请参阅[互联网访问](https://learn.chatgpt.com/docs/cloud/internet-access)。

---

## 6. 图像生成（Image generation）

> [官方文档](https://learn.chatgpt.com/docs/image-generation) · [完整文档索引](https://learn.chatgpt.com/llms.txt)

你可以让 ChatGPT 生成或编辑图像。

图像生成功能适合创建需要与代码配合使用或直接在 ChatGPT 聊天中使用的 UI 素材、横幅、背景、插图、精灵图和占位图。

你可以在应用的消息编辑框中描述需要生成的图像。如果希望 ChatGPT 修改现有素材，或者将现有图像用作视觉参考，请添加参考图像。

### 检查和编辑生成的图像

选择一张生成的图像，可以在展开的查看器中打开它。

你可以在以下两种视图之间切换：

- **聚焦视图（Focused view）：**仔细检查一张图像。
- **画布视图（Canvas view）：**查看同一个聊天中生成的所有图像。

在“**画布视图**”中，使用“**评论（Comment）**”可以针对一张或多张图像添加精确反馈。

选择“**多选（Multi-select）**”，选中需要处理的图像，然后在同一个聊天中发送评论和其他编辑指令。请明确说明哪些内容需要修改，哪些内容应当保持不变。

### 生成或编辑图像

使用自然语言描述需要生成的图像。

如果希望 ChatGPT 修改或扩展现有素材，请添加一张参考图像。

在提示词中加入 `$imagegen`，可以明确调用图像生成技能。

内置图像生成功能使用 `gpt-image-2`，并计入你的 Codex 通用使用额度。

根据图像质量和尺寸，图像生成消耗套餐内额度的速度平均会达到不使用图像生成功能的同类交互的 3～5 倍。

如果需要生成较大批量的图像，请在环境中设置 `OPENAI_API_KEY`，然后让 ChatGPT 通过 API 生成图像。这样将按照 API 定价计费。

### 编写有效的图像提示词

有效的图像提示词通常只需要一到三句清晰的描述。

请描述能够决定生成结果是否成功的细节：

- 说明图像的用途或目标受众。
- 指明主要主体以及正在发生的事情。
- 描述环境、构图和视觉风格。
- 如果取景、尺寸、光照、颜色或材质很重要，请将其写明。
- 说明约束条件，包括图像中不得出现的内容。

相比宽泛的感受描述，应优先使用具体的视觉语言。

例如，与其要求“漂亮的光线”，不如明确描述光线来自哪个方向。

对于必须保持不变的要求，请在提示词中重复强调。

**提示词示例：**

```text
为员工入职指南创作一幅简洁的编辑插图。画面展示一个人坐在书桌前整理项目，桌上有笔记本电脑、记事本和一份简洁的进度清单。使用从左侧窗户照入的柔和日光、克制的配色，以及现代、亲切的视觉风格。保持背景简洁。不要包含徽标、文字或未来主义元素。
```

### 优化生成结果

先从核心创意开始，然后进行小幅、针对性的修改。

每次只调整一个元素，避免构图和其他重要细节发生偏移。

你也可以选择图像中的某个特定区域，然后描述只针对该区域进行的修改。

编辑现有图像时，请准确说明哪些内容需要改变，以及哪些内容必须保持不变。

**提示词示例：**

```text
编辑所附图像。只将马克杯替换成一盆小型绿植。人物、书桌布局、光线、颜色、裁剪范围及其他所有细节必须完全保持不变。不要添加文字或徽标。
```

如果需要进行较大范围的修改，请让反馈保持直接且可执行，例如：

- 提高图像亮度。
- 降低色彩饱和度。
- 简化背景。
- 保持构图不变，但更换视觉风格。

### 使用多张参考图像

当一张参考图像用于定义内容，而另一张用于定义风格、布局或其他视觉方向时，可以使用少量参考图像。

请按照顺序标明每张图像，并说明它们之间的关系。

组合不同元素时，请使用“前景”“背景”“左侧”和“右侧”等空间描述。

**提示词示例：**

```text
图像 1 是需要编辑的产品照片，图像 2 是风格参考。保留图像 1 中的产品、拍摄角度、布局和物体，但应用图像 2 中简洁的线条、柔和的配色和轻柔的阴影。保持产品居中，并在右上角留出空白，以便后续添加文案。
```

### 在图像中添加文字

图像内的文字应保持简短，并且需要精确指定。

请将需要显示的准确文字放在引号中，保留所需的大小写形式，并描述字体风格、字号、颜色和位置。

如果包含不常见的名称，并且准确性非常重要，请逐个拼写其中的字母。

同时，请说明是否允许图像中出现其他文字。

**提示词示例：**

```text
只添加标题“SPRING WORKSHOP”。标题使用大型、粗体、白色无衬线字体，水平居中放置在图像上方三分之一区域。标题必须保持在一行。不要添加任何其他文字，也不要修改底层图像。
```

### 创建信息图和复杂布局

图像生成功能可以协助制作说明图、海报、带标签的图表、时间线，以及其他信息密集型视觉内容的初稿。

请描述信息层级和版面布局，保持标签简短，并要求清晰锐利的文字渲染效果。

对于文字非常密集或排版质量对成品至关重要的内容，请逐字检查，并在必要时使用专业设计工具完成最终素材。

### 其他注意事项

- **谨慎使用真人肖像。** 描绘真实人物时，应在适当情况下提供参考照片，并确认你已经获得使用其肖像的许可。
- **要求原创表达。** 请提出通用或原创的设计要求，避免模仿特定品牌、产品、艺术家或艺术作品。
- **是否注明来源由你决定。** 对于生成的图像，你无须注明由 OpenAI 制作；但如果相关背景对读者有帮助，也可以说明素材的制作方式。
- **遵守适用政策。** 使用图像时，请遵守你所在组织的规定以及 [OpenAI 使用政策](https://openai.com/policies/usage-policies/)。

### 相关文档

- [Codex 定价与图像生成使用限制](https://learn.chatgpt.com/docs/pricing#image-generation-usage-limits)
- [图像输入](https://learn.chatgpt.com/docs/image-inputs)
- [图像生成 API 指南](https://developers.openai.com/api/docs/guides/image-generation)
- [处理文件](https://learn.chatgpt.com/docs/artifacts-viewer)
- [使用 ChatGPT 创建图像](https://openai.com/academy/image-generation/)
- [图像生成作品库](https://developers.openai.com/api/docs/guides/image-generation?gallery=open)

---

## 7. 图像输入（Image inputs）

> [官方文档](https://learn.chatgpt.com/docs/image-inputs) · [完整文档索引](https://learn.chatgpt.com/llms.txt)

当任务依赖视觉上下文时，可以在提示词中添加图像，例如：

- 错误信息截图
- 界面设计稿
- 架构图
- 现有图像素材

请说明 ChatGPT 应当检查什么，以及你希望获得什么结果。不要只依靠图像本身来传达任务要求。

按住 <kbd>Shift</kbd> 键，将图像拖入提示词编辑框，即可将其作为上下文添加。

你也可以让 ChatGPT 检查系统中的某张图像，或者使用屏幕截图工具验证另一个应用中的工作结果。

### 围绕图像编写提示词

请说明图像展示的内容，指出需要关注的区域，并明确所需输出和约束条件。

如果附加了多张图像，请分别标明每张图像，并说明 ChatGPT 应该如何比较它们。

例如：

```text
将这个结账页面与设计稿进行比较。只修复间距和排版问题，不要改变任何功能行为。完成后使用一张新的屏幕截图验证结果。
```

### 选择正确的图像功能

如果希望 ChatGPT 检查一份视觉参考资料，请使用图像输入。

如果希望 ChatGPT 创建或编辑图像，请使用[图像生成](https://learn.chatgpt.com/docs/image-generation)。

---

## 8. 应用快照（Appshots）

> [官方文档](https://learn.chatgpt.com/docs/appshots) · [完整文档索引](https://learn.chatgpt.com/llms.txt)

Appshots 让你可以将当前位于最前端的应用窗口发送到 ChatGPT 聊天中。

当你正在计算机上的另一个应用中工作，并希望向 ChatGPT 提供当前上下文以协助完成任务时，可以使用 Appshots。

Appshots 可在 macOS 版 ChatGPT 桌面应用中使用。同时按下左右两个 Command 键，或者按下自定义的 Appshots 快捷键，即可拍摄应用快照。

### Appshots 会捕获哪些内容

Appshot 只会捕获当前最前端的窗口，其中可以包含：

- 当前可见窗口的图像。
- 窗口中可获取的文本，包括当前可见的文本，以及应用在可见滚动区域之外提供的文本。

将 Appshot 添加到聊天后，它的行为与普通附件相同。

与手动附加的文件或图像一样，ChatGPT 会将 Appshots 保存在本地会话文件中。

### 何时使用 Appshots

当 ChatGPT 需要先获得某个 Mac 应用中的上下文才能执行操作时，可以使用 Appshots。

例如：

- 分享一个 API 参考文档页面，让 ChatGPT 编写使用该 API 的脚本。
- 分享电子邮件或日历视图，让 ChatGPT 起草下一步内容。
- 分享图像编辑器、设计稿或预览窗口，让 ChatGPT 修改相关素材或代码。
- 分享错误信息、设置面板或应用状态——这些内容通过画面展示往往比文字描述更容易。

### 拍摄 Appshot

1. 将需要分享的应用窗口切换到最前端。
2. 同时按下左右两个 Command 键，或者按下你在 ChatGPT 设置中配置的自定义快捷键。
3. 如果 ChatGPT 请求 macOS 权限，请允许相应权限。
4. 让 ChatGPT 使用该 Appshot 执行任务。

默认情况下，ChatGPT 会为 Appshot 启动一个新聊天。

如果你在过去 60 秒内与某个聊天进行过交互，ChatGPT 会将 Appshot 添加到最近使用的聊天中，而不是创建新聊天。

连续拍摄的 Appshots 会添加到同一个聊天中。

你可以在应用设置中更改 Appshots 快捷键。

### 权限与安全

ChatGPT 在拍摄 Appshots 前可能会请求以下权限：

- **屏幕与系统音频录制（Screen & System Audio Recording）：**允许 ChatGPT 捕获最前端窗口的图像。
- **辅助功能（Accessibility）：**允许 ChatGPT 读取最前端窗口中可获取的文本。

拍摄 Appshot 会与 ChatGPT 共享捕获的图像和可获取的文本。

除非任务确实需要相关内容，否则请避免拍摄包含敏感信息的 Appshots。

检查 Appshots 时，应采用与向 ChatGPT 分享屏幕截图和文档相同的谨慎程度。

### 限制与故障排除

Appshots 只能在 macOS 版 ChatGPT 桌面应用中创建。

如果你在 CLI 中继续一个已经包含 Appshot 的聊天，该附件仍会作为聊天历史的一部分保留下来，但 CLI 无法创建新的 Appshot。

对于某些应用和网站，包括 Google Docs、Gmail、Google Sheets 和 Google Slides，ChatGPT 可能只能获得当前可见的屏幕截图，而无法获得完整文档或屏幕外的文本。

在 ChatGPT Work 或 Codex 中，ChatGPT 可以使用匹配的已安装插件访问相关应用内容，并协助处理你的请求。

如果 Appshots 无法正常工作：

1. 打开“**系统设置 > 隐私与安全性**”。
2. 检查是否已为 **Codex Computer Use** 授予“**屏幕与系统音频录制**”和“**辅助功能**”权限。
3. 重新启动应用，然后再次尝试。

---

## 9. Chrome 扩展程序（Chrome extension）

> [官方文档](https://learn.chatgpt.com/docs/chrome-extension) · [完整文档索引](https://learn.chatgpt.com/llms.txt)

使用 Chrome 扩展程序，可以让 ChatGPT 控制你的 Chrome 浏览器。

ChatGPT 可以读取或操作你已经登录的网站，例如 LinkedIn、Salesforce、Gmail 或内部工具。

如果希望 ChatGPT 操作它自己的内置浏览器，请使用 `@Browser`。[内置浏览器](https://help.openai.com/en/articles/20001277-using-the-built-in-browser-in-the-chatgpt-desktop-app)支持登录，并且会将浏览工作保留在 ChatGPT 内部，无须使用你的 Chrome 配置文件。

ChatGPT 还可以根据任务需要在不同工具之间切换：

- 当存在专用集成时，使用插件。
- 当任务需要已登录的浏览器上下文时，使用 Chrome。
- 当任务需要访问 localhost 时，使用内置浏览器。

> **安全提示：**请将网页内容视为不受信任的上下文，并在允许 ChatGPT 继续操作前检查相应网站。

### 从 Chrome 使用 ChatGPT

在当前浏览页面旁打开 ChatGPT，可以针对该页面提问，也可以继续执行同时使用页面上下文、本地文件和已连接应用的任务。

任务需要时，ChatGPT 可以使用你已打开标签页中的上下文。

1. 打开需要处理的页面。
2. 从 Chrome 工具栏或“**扩展程序（Extensions）**”菜单中选择 ChatGPT。在 macOS 上，也可以按 <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd>。
3. 针对页面提出问题，或者向 ChatGPT 分配一项任务。

侧边面板会与打开它的标签页保持关联。

你在 Chrome 中启动的聊天也可以在 ChatGPT 应用中访问；你还可以在 Chrome 中打开最近的 ChatGPT 聊天，因此可以在任意一处继续工作。

### 将标签页和选中文本添加到聊天

如果希望 ChatGPT 将某个页面用作上下文，可以在侧边聊天中提及一个已经打开的 Chrome 标签页。

你也可以选中页面上的一段文字，将选中内容添加到聊天中。这样无须复制整个页面，就能针对特定段落提问。

如果希望直接从页面开始，请右键单击页面并选择“**询问 ChatGPT（Ask ChatGPT）**”。

侧边聊天会携带相关的页面上下文打开，你可以继续在 Chrome 中提出请求。

#### 针对 YouTube 视频提问

打开一个 YouTube 视频，然后在 Chrome 侧边聊天中针对该视频提问。

如果视频提供字幕，ChatGPT 可以使用带时间戳的视频转录文本，对视频内容进行解释、总结或回答相关问题。

请将网页内容、选中的文本和视频转录文本视为不受信任的上下文。

在要求 ChatGPT 使用这些信息或基于这些信息执行操作前，请检查页面以及所请求的权限。

### 设置 Chrome 扩展程序

打开“**插件（Plugins）**”标签页并安装 **Chrome**。

目前不支持其他基于 Chromium 的浏览器。

请按照设置流程完成以下操作：

1. 安装 [Chrome 扩展程序](https://chromewebstore.google.com/detail/chatgpt/hehggadaopoacecdllhhajmbjkdcmajg)。
2. 批准 Chrome 请求的权限。
3. 打开 Chrome，确认 ChatGPT 侧边聊天能够正常加载。

### 从 ChatGPT 启动 Chrome 任务

完成插件设置后，启动一个新的 ChatGPT Work 或 Codex 聊天。

如果任务需要访问网站，并且你已经在 Chrome 中登录，ChatGPT 可以自动使用 Chrome。

你也可以在提示词中直接调用它：

```text
@Chrome 打开 Salesforce，并根据这些通话记录更新账户信息。
```

如果 Chrome 尚未打开，ChatGPT 可以启动它。

Chrome 浏览器任务会在 Chrome 标签页组中运行，使同一任务涉及的页面保持集中。

### 控制网站访问权限

默认情况下，ChatGPT 在与每个新网站交互前都会询问你的许可。

ChatGPT 会根据网站主机名发出权限请求，例如 `example.com`。

ChatGPT 请求使用某个网站时，你可以根据任务需求和可接受的风险选择：

- **仅允许一次（Allow once）：**允许 ChatGPT 使用该网站一次。
- **允许此网站（Allow for this site）：**ChatGPT 今后可以再次使用该网站，无须重新询问。
- **允许所有网站（Allow for all sites）：**ChatGPT 可以使用网站，不再逐一询问。
- **拒绝（Decline）：**阻止 ChatGPT 使用该网站。

#### 管理允许和阻止的网站

在 ChatGPT 桌面应用中，依次打开“**设置 > Computer Use**”，然后选择 **Google Chrome** 旁边的“**管理（Manage）**”，管理域名允许列表和阻止列表。

- 允许列表包含 ChatGPT 无须再次询问便可使用的域名。
- 阻止列表包含 ChatGPT 不应使用的域名。

从允许列表中移除某个域名后，ChatGPT 下次使用它之前会再次询问。

从阻止列表中移除某个域名后，ChatGPT 可以重新请求访问，而不会继续将该域名视为已阻止。

##### 允许所有网站

如果选择“**允许所有网站**”，ChatGPT 使用网站前将不再请求确认。

只有当你信任 ChatGPT 可以使用 Chrome 中打开的任何网站时，才应选择此选项。

##### 浏览历史记录

浏览历史记录可能包含敏感的遥测数据、内部 URL、搜索词，以及已登录设备上的 Chrome 会话活动。

如果允许 ChatGPT 访问浏览历史，与任务相关的历史记录条目可能会成为 ChatGPT 执行该任务时使用的上下文。

恶意或误导性的网页内容可能会提高 ChatGPT 将这些数据复制到非预期位置的风险。

当 ChatGPT 希望使用浏览历史时，它会征求你的许可。历史记录访问权限仅限于当前请求，并且不提供“始终允许”选项。

### 数据与安全

#### Chrome 扩展程序权限

安装扩展程序时，Chrome 会要求你接受扩展程序权限。

权限请求可能包含：

- 访问页面调试器。
- 读取和更改你在所有网站上的全部数据。
- 读取和更改你在所有已登录设备上的浏览历史记录。
- 显示通知。
- 读取和更改书签。
- 管理下载内容。
- 与协作的原生应用程序通信。
- 查看和管理标签页组。

这些 Chrome 权限让扩展程序具备执行浏览器工作流程的能力。

在任务期间使用网站或浏览历史记录前，ChatGPT 仍然会应用自己的确认流程、设置、允许列表和阻止列表。

#### 记忆

Computer Use 遵循你的“记忆（Memories）”设置。

如果记忆功能已开启，ChatGPT 在 Chrome 中工作时可以使用相关的已保存记忆。

如果记忆功能已关闭，浏览器控制不会使用记忆。

#### OpenAI 会保存哪些浏览内容

OpenAI 不会单独保存一份由扩展程序记录的完整 Chrome 操作历史。

只有当浏览器活动成为 ChatGPT 上下文的一部分时，OpenAI 才会保存相关内容，例如：

- ChatGPT 从页面中读取的文字
- 屏幕截图
- 工具调用
- 摘要
- 消息
- 聊天中包含的其他内容

你的 ChatGPT 数据控制设置适用于作为上下文处理的内容。

除非任务确实需要相关信息，并且你能够留在设备旁检查每次权限请求，否则请避免通过浏览器任务发送机密或高度敏感的数据。

### 故障排除

如果 ChatGPT 无法连接到 Chrome，请先确认 ChatGPT 尝试访问的网站没有被加入“设置”中的阻止列表。

如果网站未被阻止，请依次完成以下检查：

1. 更新 ChatGPT 桌面应用。如果安装了多个 ChatGPT 或 Codex 桌面应用，请逐一更新，或者删除不再使用的副本。
2. 关闭 ChatGPT 侧边面板并重新启动 Chrome，然后从 Chrome 工具栏或“**扩展程序**”菜单中重新打开扩展程序。确认侧边聊天可以正常加载。如果无法加载，或者提示缺少原生主机，请在 ChatGPT 桌面应用的“**插件**”中移除并重新添加 Chrome 插件，然后重新完成设置流程。
3. 在应用中选择 ChatGPT，并通过切换器打开 Work；或者选择 Codex。打开“**插件**”，确认 Chrome 插件已开启。如果插件处于关闭状态，请将其开启并重新尝试任务。
4. 确认当前使用的是安装了该扩展程序的同一个 Chrome 配置文件。如果使用多个 Chrome 配置文件，请在当前活动的配置文件中安装并启用扩展程序。
5. 启动一个新的 ChatGPT Work 或 Codex 聊天，然后重新尝试 Chrome 任务。这可以清除当前聊天特有的连接状态。
6. 重新启动 ChatGPT 桌面应用，然后再次尝试。如果扩展程序仍然无法连接，请卸载 Chrome 扩展程序，从“**插件**”中移除并重新添加 Chrome 插件，然后再次完成设置流程。
7. 如果侧边聊天能够加载，但 ChatGPT 仍然无法使用 Chrome，请在应用中运行 `/feedback`；联系支持团队时，请附上聊天 ID。

#### 上传文件

如果 Chrome 任务需要上传计算机中的文件，请允许 Chrome 扩展程序访问文件 URL：

1. 在 Chrome 工具栏中打开扩展程序图标，然后单击“**管理扩展程序（Manage Extensions）**”。
2. 在扩展程序卡片上单击“**详细信息（Details）**”。
3. 开启“**允许访问文件网址（Allow access to file URLs）**”。

更改该设置后，请重新启动 Chrome 任务。

---

## 10. 处理文件（Work with files）

> [官方文档](https://learn.chatgpt.com/docs/artifacts-viewer) · [完整文档索引](https://learn.chatgpt.com/llms.txt)

当任务需要生成文件时，请向 ChatGPT 提供与任务有关的源数据、预期文件类型、内容结构和审查标准。

可用的预览和审查工具取决于你当前使用的界面。

<YouTubeEmbed
  title="在 ChatGPT 中处理文档、电子表格和演示文稿"
  videoId="E3dDr_QtBuo"
/>

ChatGPT 桌面应用可以在聊天旁边预览生成的文档、演示文稿、电子表格和 PDF 文件。

启用自动预览后，应用可以在任务完成时自动打开生成的文件。

当 HTML 预览功能可用时，生成的 `.html` 和 `.htm` 文件也能以交互式预览的形式打开。

你可以在渲染后的预览和源代码视图之间切换，检查最终输出或底层 HTML。

使用批注，可以指向受支持预览中的某个具体位置，并要求 ChatGPT 进行有针对性的修改。

### 创建供审查的文件

对于电子表格和演示文稿，请说明你希望包含的内容，例如：

- 工作表
- 数据列
- 图表
- 幻灯片章节
- 预期执行的检查

要求 ChatGPT 说明输出文件保存在哪里，以及它如何检查最终结果。

### 使用批注优化文件

批注让你可以指向文件中的某个具体部分，并告诉 ChatGPT 需要修改什么。

用于代码、Markdown 文件和网站的同一套批注工作流程，也适用于文档、电子表格和演示文稿。

例如，你可以：

- 选择网站上的导航栏，要求 ChatGPT 修改其字体。
- 突出显示投资论点中的某项主张，要求 ChatGPT 提供信息来源。
- 标出演示文稿中的一张图表，要求 ChatGPT 使用更清晰的标签。

ChatGPT 会将选中的区域作为当前请求的上下文。这样，你无须从头开始，也不会改变已经满意的部分，便能继续优化文件。

完成第一版后，如果内容需要审查和迭代，批注会尤其有用。

### 审查和优化文件

任务运行期间，可以使用聊天侧边栏。

侧边栏可以显示智能体的计划、信息来源、生成的文件和聊天摘要，帮助你：

- 引导工作方向。
- 检查生成的文件。
- 要求 ChatGPT 再修改一版。

要求 ChatGPT 说明每个文件的保存位置，以及它如何验证结果。

使用预览检查输出，然后针对需要再次修改的结构、数据、布局或验证方法提供具体反馈。

### 相关文档

- [图像生成](https://learn.chatgpt.com/docs/image-generation)