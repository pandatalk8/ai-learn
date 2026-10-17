- # Codex 高效工作指南：给小白用户的实用入门课

  如果你刚开始接触 Codex，最容易踩的坑是把它当成一个“更会写代码的聊天机器人”。这种理解不算错，但不够准确。

  ChatGPT 更像一个陪你讨论问题、解释概念、生成草稿的助手；Codex 则更像一个可以被委派任务的工作搭档。它不只是回答你，还能读文件、改文件、运行命令、查看错误、补测试、生成文档、审查代码，甚至把任务放到云端后台运行。

  OpenAI 官方对 Codex 的定位是 coding agent：一个能够读取、编辑和运行代码的代理。对于小白用户来说，真正重要的不是一开始掌握所有高级功能，而是学会三件事：

  1. 把任务描述清楚。
  2. 给 Codex 足够的上下文和边界。
  3. 学会检查它的结果，而不是盲目接受。

  这篇文章会按基础教程、高频功能、最佳实践、常用设置四个部分，帮助你建立一套稳定可复用的 Codex 工作方法。

  ## 一、先理解 Codex 适合做什么

  Codex 适合处理那些“不是一句话能解决”的任务。

  比如：

  - 阅读一个陌生项目，解释目录结构和核心流程。
  - 根据报错和复现步骤修复 Bug。
  - 增加一个小功能，并补充测试。
  - 审查当前代码改动，找潜在问题。
  - 把重复操作整理成脚本、文档或自动化任务。
  - 在云端后台处理多个 GitHub 仓库任务。
  - 定期检查 CI、总结 commits、草拟 release notes。

  你可以把它理解成一个初级但很勤奋的同事。它速度快、能跑工具、能读大量文件，但仍然需要你告诉它目标、规则和完成标准。

  一个简单判断标准是：

  - 只想问概念、要建议、写一段文案：用 ChatGPT 就够。
  - 想让 AI 真的改文件、跑命令、生成可验证结果：用 Codex 更合适。

  ## 二、选择合适的入口

  Codex 有多个使用入口。小白不用纠结哪个“最好”，按场景选就行。

  ### 1. Codex App

  适合日常综合使用。

  它可以管理多个任务线程、查看 diff、使用 worktree、设置自动化任务，也更适合同时监督多个 agent 工作。如果你希望有一个图形化工作台，Codex App 是最直观的入口。

  ### 2. Codex CLI

  适合在终端里工作。

  安装后进入项目目录，运行：

  ```bash
  codex
  ```

  你就可以在终端里和 Codex 对话。CLI 适合开发者，也适合需要频繁运行测试、构建、脚本的场景。

  ### 3. IDE 插件

  适合局部修改。

  比如你正在编辑某几个文件，IDE 插件能自动把打开的文件和选中的代码作为上下文。你可以直接问：

  ```text
  解释这段代码的作用，并指出是否有潜在 bug。
  ```

  或者：

  ```text
  请给这个函数补充单元测试。
  ```

  ### 4. Codex Web / Cloud

  适合把任务丢到云端后台跑。

  Cloud task 会在云端创建隔离环境，拉取你的仓库，运行配置好的 setup，然后让 Codex 在后台完成任务。它适合：

  - 长任务
  - 多任务并行
  - 从 GitHub issue 或 PR 发起任务
  - 不想占用本地电脑的任务

  简单建议：

  | 使用场景             | 推荐入口          |
  | -------------------- | ----------------- |
  | 刚入门、想看清过程   | Codex App         |
  | 在终端里开发         | Codex CLI         |
  | 改当前文件或当前函数 | IDE 插件          |
  | 后台跑任务、生成 PR  | Codex Web / Cloud |
  | 同时处理多个方向     | App 或 Cloud      |

  ## 三、小白最稳的提示词模板

  Codex 的效果很大程度取决于你给它的任务说明。不要只说：

  ```text
  帮我优化一下这个项目。
  ```

  这太模糊。Codex 不知道你要优化性能、结构、UI、测试、依赖，还是文档。

  更推荐使用四段式：

  ```text
  目标：
  我要修复设置页面保存失败的问题。
  
  上下文：
  - 相关文件可能是 @src/pages/settings.tsx 和 @src/api/settings.ts
  - 当前现象：点击保存后显示成功，但刷新后设置没有保留
  
  复现步骤：
  1. 启动项目：npm run dev
  2. 打开 /settings
  3. 修改 Enable alerts
  4. 点击 Save
  5. 刷新页面，发现设置恢复原样
  
  限制：
  - 不要重构整个设置模块
  - 不要新增依赖
  - 保持现有代码风格
  
  完成标准：
  - 修复后刷新页面仍能保留设置
  - 运行相关测试
  - 最后总结改了哪些文件、如何验证
  ```

  你可以把这个模板记成：

  目标 + 上下文 + 限制 + 完成标准。

  这是小白用户最值得掌握的 Codex 使用方法。

  ## 四、最常用的工作流

  ### 1. 解释项目

  第一次打开一个项目时，不要急着让 Codex 改代码。先让它读项目。

  ```text
  请先不要修改代码。帮我阅读这个项目，说明：
  1. 主要目录分别做什么
  2. 项目如何启动
  3. 常用测试命令是什么
  4. 核心业务流程是什么
  5. 如果我要修改登录功能，应该先看哪些文件
  ```

  这个任务风险低，却能帮你快速建立全局理解。

  ### 2. 修复 Bug

  修 Bug 时，最重要的是给复现步骤。

  ```text
  请根据下面的报错定位并修复问题。
  
  报错信息：
  [粘贴完整报错]
  
  复现步骤：
  [写清楚 1、2、3]
  
  要求：
  - 先解释可能原因
  - 再修改代码
  - 最后运行测试并总结验证结果
  ```

  如果你不知道相关文件在哪里，可以这样问：

  ```text
  请先帮我定位这个报错可能涉及哪些文件，不要马上修改。
  ```

  ### 3. 增加小功能

  功能越小，Codex 越容易做好。

  ```text
  请给登录页增加“记住我”复选框。
  
  要求：
  - UI 风格和现有表单一致
  - 勾选后把 rememberMe 传给登录接口
  - 不影响现有登录逻辑
  - 补充必要测试
  - 完成后说明改动文件和验证方式
  ```

  不要一次性说“帮我做一个完整后台系统”。应该拆成登录、列表、详情、权限、测试等小任务。

  ### 4. 审查代码

  提交代码前，可以让 Codex 先帮你审一遍。

  ```text
  请审查当前未提交改动，重点关注：
  1. 是否有明显 bug
  2. 是否破坏兼容性
  3. 是否缺少测试
  4. 是否有安全风险
  5. 是否有可以简化的地方
  
  请按严重程度排序，并引用具体文件。
  ```

  审查类任务适合在合并前使用，尤其适合小白用户避免低级错误。

  ### 5. 生成文档

  Codex 很适合把代码转成文档。

  ```text
  请根据当前代码，为这个模块写一份 README。
  
  内容包括：
  - 模块用途
  - 如何运行
  - 主要配置项
  - 常见问题
  - 修改这个模块时要注意什么
  ```

  ### 6. 把重复工作自动化

  当你发现自己总在重复问同一类问题，就可以考虑沉淀。

  比如你经常说：

  ```text
  请按我们的 PR checklist 审查这次改动。
  ```

  那就可以把这套 checklist 写进 `AGENTS.md`，或者做成 Skill。

  ## 五、AGENTS.md：让 Codex 记住项目规则

  `AGENTS.md` 可以理解成“写给 Codex 的项目说明书”。

  它会告诉 Codex：

  - 项目结构是什么。
  - 如何启动项目。
  - 如何运行测试和 lint。
  - 哪些目录不能乱改。
  - 新增依赖是否需要确认。
  - PR 前需要满足什么标准。

  在 CLI 里可以用：

  ```bash
  /init
  ```

  让 Codex 生成初始版本。

  一个简单的 `AGENTS.md` 示例：

  ```markdown
  # AGENTS.md
  
  ## 项目说明
  这是一个 Next.js 项目，主要代码在 src/ 下。
  
  ## 常用命令
  - 安装依赖：npm install
  - 本地开发：npm run dev
  - 类型检查：npm run typecheck
  - 测试：npm test
  - 构建：npm run build
  
  ## 工作要求
  - 修改代码后优先运行相关测试
  - 不要随意新增依赖
  - 不要修改 .env 文件
  - 不要重写无关模块
  - 完成后总结修改内容和验证结果
  ```

  `AGENTS.md` 不要写成长篇大论。短、准、可执行，比“请写高质量代码”这种泛泛要求有用得多。

  ## 六、MCP、Skills、Automations 分别是什么

  ### 1. MCP：连接外部工具

  MCP 可以让 Codex 连接外部文档和工具，例如官方文档、GitHub、Linear、Slack、数据库等。

  OpenAI 提供了官方 Docs MCP，可以让 Codex 查询 OpenAI 官方开发者文档：

  ```bash
  codex mcp add openaiDeveloperDocs --url https://developers.openai.com/mcp
  ```

  小白建议：不要一开始装很多 MCP。先连接一两个真正能减少你复制粘贴的工具。

  ### 2. Skills：把重复流程做成技能

  Skill 是可复用工作流。

  适合这些场景：

  - 按固定格式审查 PR
  - 生成 release notes
  - 排查日志
  - 生成周报
  - 根据文章生成配图提示词
  - 按公司规范写文档

  一句话：如果你总在重复同一段 prompt，就应该考虑做成 Skill。

  ### 3. Automations：让 Codex 定时做事

  Automations 适合稳定、重复、低风险的后台任务。

  例如：

  - 每天总结最近 commits。
  - 定时检查 CI。
  - 每周草拟 release notes。
  - 定期扫描可能的 Bug。
  - 生成站会摘要。

  可以这样理解：

  - Skills 定义“怎么做”。
  - Automations 定义“什么时候做”。

  ## 七、常用设置怎么理解

  ### 1. model：选择模型

  模型决定 Codex 的能力、速度和成本。

  官方 Codex 模型页建议，大多数任务可以优先从强模型开始；轻量任务或子代理可以使用更快的 mini 模型。小白不需要频繁切模型。默认能解决大多数问题，只有在任务明显复杂或明显太慢时再调整。

  ### 2. reasoning effort：思考深度

  可以理解成 Codex 花多少力气思考。

  | 设置   | 适合场景                   |
  | ------ | -------------------------- |
  | low    | 简单修改、快速解释         |
  | medium | 常规开发任务               |
  | high   | 复杂 Bug、跨文件修改       |
  | xhigh  | 长任务、架构分析、困难迁移 |

  新手建议：一般任务用默认；复杂任务再提高。

  ### 3. approval policy：什么时候需要你批准

  这个设置决定 Codex 在执行命令或越过权限边界时，是否需要先问你。

  新手建议保守一点。关键命令、联网、写入敏感位置、安装依赖，都应该先让 Codex 请求确认。

  ### 4. sandbox：安全边界

  sandbox 是 Codex 的工作边界。它限制 Codex 能改哪些文件、能不能访问网络、能不能执行高风险命令。

  官方解释里，sandbox 和 approval 是配合使用的：

  - sandbox 决定技术边界。
  - approval 决定什么时候停下来问你。

  新手建议：

  - 不要一开始给全部权限。
  - 不要随便开启无限制网络访问。
  - 不要把 secrets 暴露给 Codex。
  - 重要修改一定看 diff。

  ### 5. config.toml：个人和项目配置

  Codex 的个人配置通常在：

  ```text
  ~/.codex/config.toml
  ```

  项目配置可以放在：

  ```text
  .codex/config.toml
  ```

  个人配置适合放默认模型、默认审批策略、MCP 配置。项目配置适合放这个项目特有的规则。

  ## 八、安全使用 Codex 的原则

  Codex 很强，但你仍然是最终负责人。

  尤其注意：

  - 不要让 Codex 运行你看不懂的外部脚本。
  - 不要把密码、私钥、token 写进 prompt。
  - 不要轻易允许无限制联网。
  - 不要在没看 diff 的情况下合并代码。
  - 不要让多个任务同时修改同一批文件。
  - 重要任务先建分支或使用 worktree。
  - 看到 Codex 要安装新依赖时，先问清理由。

  OpenAI 官方特别提醒，agent 联网读取网页、issue、README 等不可信内容时，可能遇到 prompt injection。也就是说，外部内容里可能藏有诱导 agent 执行危险操作的指令。因此，联网权限应该按需开启，并限制域名和请求方法。

  ## 九、推荐的新手上手路线

  第一阶段：只读理解

  ```text
  请解释这个项目的结构、启动方式和测试命令，不要修改代码。
  ```

  第二阶段：小改动

  ```text
  请修复这个明确可复现的小问题，完成后运行测试并总结。
  ```

  第三阶段：提交前审查

  ```text
  请审查当前 diff，找 bug、测试缺口和潜在风险。
  ```

  第四阶段：沉淀规则

  把重复要求写进 `AGENTS.md`。

  第五阶段：复用流程

  把固定流程做成 Skill。

  第六阶段：后台自动化

  把稳定重复任务做成 Automation。

  ## 十、最值得记住的 10 条实践

  1. 先让 Codex 读项目，再让它改项目。
  2. 任务越小，结果越稳定。
  3. 给出复现步骤，比只贴报错更有效。
  4. 明确告诉它哪些文件不能改。
  5. 要求它跑测试，而不是只相信它说“完成了”。
  6. 所有重要改动都要看 diff。
  7. 重复说三次的规则，写进 `AGENTS.md`。
  8. 重复执行的流程，做成 Skill。
  9. 稳定重复的任务，做成 Automation。
  10. 安全权限从保守开始，按需放开。

  ## 结语

  Codex 的核心价值，不是“替你写几行代码”，而是让你把一部分可描述、可执行、可验证的工作交给 AI 完成。

  对小白用户来说，最重要的不是记住所有命令，而是建立一种工作习惯：

  先讲清目标，再提供上下文；先设定边界，再让它行动；先要求验证，再接受结果；最后把有效流程沉淀下来。

  你越会定义任务，Codex 就越像一个可靠的工作搭档。

  ## 参考资料

  - OpenAI Codex CLI: https://developers.openai.com/codex/cli
  - Codex Web / Cloud: https://developers.openai.com/codex/cloud
  - Codex Best Practices: https://developers.openai.com/codex/learn/best-practices
  - Codex Prompting: https://developers.openai.com/codex/prompting
  - AGENTS.md Guide: https://developers.openai.com/codex/guides/agents-md
  - Sandbox: https://developers.openai.com/codex/concepts/sandboxing
  - Codex Models: https://developers.openai.com/codex/models
  - Agent Skills: https://developers.openai.com/codex/skills
  - Automations: https://developers.openai.com/codex/app/automations
  - Introducing the Codex app: https://openai.com/index/introducing-the-codex-app/
