# 第九章：让自己的项目支持 Skill

前面几章讲的都是“你作为用户怎么用 Skill”“你作为开发者怎么做 Skill”。这一章换一个视角：如果你有自己的开源项目、CLI 工具、API 服务或 SDK，怎么让它“被 Skill 化”——让用户通过 Claude Code 和自然语言来使用你的项目。

这件事的价值远超你的想象。

---

## 为什么要让项目支持 Skill

**降低用户的上手门槛**

一个 CLI 工具，用户需要读完 README、记住命令格式、理解参数含义才能使用。一个配套 Skill，用户只需要对 Claude Code 说“用 XXX 工具帮我处理这个文件”，Claude 自动调用正确的命令、传入正确的参数。

学习成本从“读十页文档”降到“说一句话”。对于那些功能强大但命令行参数复杂的工具，这个降幅是质变级别的。

**扩展项目的使用场景**

很多工具被设计为自动化流程中的一个环节——被脚本调用、被 CI/CD 触发。但有了 Skill，它可以成为交互式对话中的一个能力。用户不需要写脚本就能把你的工具接入更大的工作流。

比如一个图片压缩工具，有了 Skill 之后可以被嵌入“发布公众号文章”的流水线中：Claude 先排版，然后调用你的工具压缩图片，再上传到 CDN，最后推送——用户全程只需要说一句话。

**构建生态壁垒**

当你的项目有了配套的 Skill，甚至有了社区贡献的 Skill 生态，用户的迁移成本会大幅上升。他们不仅在用你的工具，还在用围绕你的工具建立起来的整套工作流。

---

## 为项目编写官方 Skill

**第一步：找出核心操作**

打开你的项目文档，列出用户最常用的 5-10 个操作。比如一个静态站点生成器，核心操作可能是：

1. 初始化新项目
2. 添加新文章
3. 本地预览
4. 构建并部署
5. 修改主题配置

这些就是你的 Skill 应该覆盖的操作。

**第二步：把常用操作封装为 Skill**

每个核心操作对应一个 Skill（或者一个 Skill 中的一个流程阶段）。以“构建并部署”为例：

```yaml
---
name: my-ssg-deploy
description: >
  Build and deploy a static site using MySiteGen. Handles build process,
  asset optimization, and deployment to configured hosting. Use when user
  mentions "部署", "发布网站", "deploy site", "build and publish".
allowed-tools: [Bash, Read, Write]
---

## 工作流程

1. 读取项目根目录的 config.yaml，确认部署目标
2. 执行 mysitegen build 命令，等待构建完成
3. 检查 build 目录下的输出是否正常（至少包含 index.html）
4. 执行 mysitegen deploy 命令
5. 输出部署结果和访问 URL
```

**第三步：把项目文档转化为 references/**

项目的完整文档往往有数十页，全部放进 SKILL.md 会撑爆上下文。正确的做法是把文档拆成模块，放进 references/ 目录，在 SKILL.md 中按需引用：

```
my-ssg-skill/
├── SKILL.md
├── references/
│   ├── cli-commands.md         # 所有 CLI 命令的参数说明
│   ├── config-options.md       # 配置文件的所有选项
│   ├── theme-customization.md  # 主题定制指南
│   └── deployment-targets.md   # 各部署目标的配置方式
```

在 SKILL.md 中这样引用：

```markdown
如果用户询问配置选项，参考 references/config-options.md。
如果涉及主题修改，参考 references/theme-customization.md。
```

Claude 只在需要时才加载对应的参考文档，既保证了信息完整性，又不浪费 Token。

---

## 把 Skill 作为项目文档的补充

传统文档和 Skill 文档服务于不同的读者：

| 维度 | 传统文档 | Skill 文档 |
|------|----------|-----------|
| 读者 | 人 | AI（Claude） |
| 目的 | 教会人理解和操作 | 告诉 AI 在什么场景执行什么命令 |
| 风格 | 解释性、教学性 | 指令性、流程性 |
| 组织方式 | 按概念分章 | 按场景分 Skill |

两者不是替代关系，而是互补关系。传统文档帮用户理解你的项目；Skill 文档让 AI 帮用户操作你的项目。

维护策略：当项目的命令、参数或流程发生变更时，同时更新传统文档和 Skill。把 Skill 文件纳入项目的 CI 检查——如果 CLI 命令改了但 Skill 里的命令没跟着改，应该在构建阶段就报警。

---

## 项目级 Skill 的部署方式

**方式一：放在项目仓库的 .claude/skills/ 目录**

最直接的方式。用户 clone 你的项目后，Skill 就在本地了。

```
my-project/
├── .claude/
│   └── skills/
│       └── my-project-helper/
│           ├── SKILL.md
│           └── references/
├── src/
├── README.md
└── CLAUDE.md
```

优点：版本与项目同步，不会出现 Skill 和项目版本不匹配的问题。
缺点：只对 clone 了仓库的用户生效。

**方式二：通过 CLAUDE.md 引用**

在项目的 CLAUDE.md 中引用 Skill 的安装说明，让用户按需安装：

```markdown
## 推荐 Skill

本项目提供了官方 Skill 以简化常见操作：

    npx skills add my-org/my-project-skills

安装后可以直接说"部署网站""添加新文章"等指令。
```

**方式三：独立 Skill 仓库**

把 Skill 放在独立的 GitHub 仓库里，和项目仓库分开维护。适合 Skill 的更新频率与项目不同的情况。

三种方式可以组合使用：项目仓库内放基础 Skill，独立仓库放扩展 Skill。

---

## 为 API 或 SDK 项目提供 Skill 集成

如果你的项目是一个 API 服务或 SDK，Skill 可以极大降低用户的集成成本。

**把 API 文档放进 references/**

API 的接口定义、认证方式、请求/响应格式、错误码——这些信息 Claude 需要但不应该每次都加载。放进 references/ 目录，在 SKILL.md 中按需引用。

**把常见用法封装为 Skill 步骤**

用户最常见的 API 操作，比如“注册用户”“创建订单”“查询数据”，每个都可以封装为 Skill 中的一个流程：

```markdown
## 当用户要集成用户注册 API 时

1. 读取 references/auth-api.md 获取认证方式
2. 在用户项目中创建 API 调用代码
3. 使用 references/error-codes.md 添加错误处理
4. 提供测试用的 curl 命令
```

用户只需要说“帮我接入用户注册 API”，Claude 就能自动查阅你的 API 文档、生成正确的集成代码、添加错误处理。

这种体验对 API 产品的推广有巨大价值——集成越容易，用户越愿意选你的 API。

---

## Skill 生态运营

当你的项目有了官方 Skill，下一步是鼓励社区围绕它贡献更多 Skill。

**提供贡献指南**

在项目仓库中放一份 CONTRIBUTING.md，说明怎么为项目贡献 Skill：

- Skill 的命名规范
- 触发词的协调机制（避免和官方 Skill 冲突）
- 代码审查标准
- 提交流程

**建立质量标准**

社区贡献的 Skill 质量参差不齐。建立明确的准入标准：

- SKILL.md 必须通过格式验证
- description 必须包含具体的触发词和排除条件
- 必须提供至少三个使用场景的测试结果
- 不能包含硬编码的敏感信息

**从 Skill 生态反哺项目**

社区围绕你的项目写的 Skill，暴露了用户真实的使用模式和痛点。如果大量 Skill 都在包装同一个复杂操作，说明这个操作的原生接口需要简化。如果多个 Skill 都在引用同一份参考文档的同一段内容，说明这段内容应该放进项目的核心文档。

Skill 生态是产品改进的信号源，认真对待它。

---

## 本章小结

让项目支持 Skill，本质是为你的产品增加一个“AI 原生接口”。用户可以用自然语言操作你的项目，AI 帮他们查文档、写代码、调命令。

核心操作封装为 Skill、项目文档转化为 references/、按需选择部署方式——三步就能让你的项目进入 Claude Code 生态。而 Skill 生态的运营，会反过来推动项目本身的改进。
