# 用 Codex 从零搭建全栈应用：Next.js + Supabase + Cloudflare + Stripe 实战

> 上一篇讲了独立开发绕不过去的四件套，很多人留言问：具体怎么搭？这篇就是那个"具体怎么搭"。用 Codex 当你的编程搭档，一步步把一个能注册、能用、能收钱的 SaaS 应用跑起来。

---

## 这篇文章要做什么

我们要从零开始，搭建一个完整的 SaaS 应用。不是 demo，不是 todo-list，而是一个真正能上线运营的产品骨架。

搭完之后你会拥有：

- 一个用 Next.js + TypeScript 写的全栈应用，前后端一体
- 用 Drizzle ORM 管理数据库，类型安全，不写原始 SQL
- Supabase 提供数据库和用户认证
- Vercel 一键部署，Git push 即上线
- Cloudflare 管域名、CDN 和静态资源存储
- Stripe 处理支付和订阅
- 整套代码由 Codex 辅助生成，你负责方向，它负责干活

**重要说明：这篇文章几乎不贴代码。** 因为代码这件事，Codex 比你写得快也写得好。你需要掌握的是架构思路、每一步该让 AI 做什么、以及哪些坑要提前绕开。代码交给 AI，判断力留给自己。

先看全景图：

```
用户浏览器
    │
    ▼
Cloudflare（DNS 解析 + CDN 加速 + 安全防护）
    │
    ▼
Vercel（托管 Next.js 应用）
    │
    ├──→ Next.js 前端页面（React Server Components）
    │
    ├──→ Next.js API Routes（后端逻辑）
    │         │
    │         ├──→ Drizzle ORM ──→ Supabase PostgreSQL（数据）
    │         ├──→ Supabase Auth（用户认证）
    │         └──→ Stripe API（支付 & 订阅）
    │
    └──→ Cloudflare R2（图片、文件等静态资源存储）
```

和上一篇四件套文章里的架构对比，变化在于：**Vercel 取代了 Cloudflare Workers 承担计算层，Cloudflare 回归基础设施角色**（DNS + CDN + 存储）。Next.js 天然是前后端一体的，部署在 Vercel 上是最佳组合。

---

## 为什么选这套技术栈

| 技术 | 角色 | 为什么选它 |
|------|------|-----------|
| **Next.js** | 全栈框架 | 前后端一体，App Router + Server Components 是当前最主流的 React 架构 |
| **TypeScript** | 编程语言 | 类型系统让 AI 生成的代码更可靠，错误在编辑器里就能发现 |
| **Drizzle ORM** | 数据库操作 | 轻量、类型安全、查询语法贴近 SQL，AI 生成质量高 |
| **Supabase** | 数据库 + 认证 | 托管 PostgreSQL，免运维，Auth 开箱即用 |
| **Vercel** | 部署平台 | Next.js 的亲爹，Git push 即部署，零配置 |
| **Cloudflare** | 基础设施 | DNS 托管、CDN 加速、R2 对象存储（不收出流量费） |
| **Stripe** | 支付 | 全球支付标准，API 设计业界标杆 |
| **Codex** | AI 编程助手 | 理解上下文，能处理多文件协作，适合搭建项目骨架 |

### 为什么用 Drizzle 而不是 Prisma？

两个都能用，但 Drizzle 有几个优势：

1. **更轻量。** Prisma 的查询引擎是一个 Rust 编译的二进制文件，会增加部署包体积。Drizzle 是纯 TypeScript，零二进制依赖。
2. **查询语法更贴近 SQL。** 如果你懂 SQL，Drizzle 几乎没有学习成本。Prisma 有自己的一套查询语言。
3. **在 Vercel 的 Serverless Functions 里冷启动更快。** 没有二进制文件需要加载。

当然，Prisma 在 Vercel 上也完全能跑（不像 Cloudflare Workers 那样有兼容性问题）。如果你团队已经在用 Prisma，没必要换。

### 为什么用 Vercel 而不是 Cloudflare Workers？

Cloudflare Workers 适合纯后端 API 服务。但如果你用 Next.js 做全栈应用，Vercel 是更自然的选择：

- Next.js 是 Vercel 的亲儿子，所有新特性（Server Components、Server Actions、ISR）在 Vercel 上都是一等公民
- Git push 自动部署，每个 PR 自动生成预览链接
- 不需要折腾 `wrangler.toml`，零配置

简单说：**用 Next.js 就选 Vercel，用 Hono/纯 API 就选 Cloudflare Workers。**

---

## 第零步：把 Codex 用对

在动手之前，先说说怎么用 Codex 最高效。

Codex 有两种用法，效果天差地别：

**低效用法：** 一句话丢给它——"帮我写一个 SaaS"，然后等着它给你一个大而全但跑不起来的东西。

**高效用法：** 你把任务拆成明确的小步骤，每一步给 Codex 清晰的上下文和约束条件，让它在你的框架里干活。

和 Codex 协作的四个原则：

1. **一次只做一件事。** 不要同时让它建数据库又写 API 又接支付。
2. **给上下文。** 把相关文件的内容贴给它，让它知道现有代码长什么样。
3. **给约束。** 明确告诉它用什么技术、什么风格、什么命名规范。
4. **验证再继续。** 每一步生成的代码，先跑通再做下一步。

接下来的每一步，我都会给出你应该给 Codex 的 prompt 示例。**你不需要背代码，你需要学会怎么提需求。**

---

## 第一步：初始化 Next.js 项目

> **给 Codex 的 Prompt：**
> 
> 帮我初始化一个 Next.js 项目，要求：
> - 使用 App Router（不要 Pages Router）
> - TypeScript
> - 包管理器用 pnpm
> - 集成 Tailwind CSS
> - 目录结构包含：app/api/（后端路由）、lib/（工具函数）、db/（数据库相关）、components/（组件）
> - 给我完整的命令和初始文件

Codex 会帮你跑 `npx create-next-app@latest` 并配置好一切。关键是要让它用 **App Router**——这是 Next.js 的现代架构，Server Components 和 Server Actions 都依赖它。

初始化完成后，你的项目结构大概长这样：

```
my-saas-app/
├── app/
│   ├── layout.tsx            # 全局布局
│   ├── page.tsx              # 首页
│   ├── auth/
│   │   ├── login/page.tsx    # 登录页
│   │   └── callback/route.ts # OAuth 回调
│   ├── dashboard/
│   │   └── page.tsx          # 用户仪表盘
│   ├── billing/
│   │   └── page.tsx          # 订阅管理页
│   └── api/
│       ├── auth/
│       │   └── me/route.ts   # 获取当前用户
│       ├── billing/
│       │   ├── checkout/route.ts  # 创建支付会话
│       │   ├── portal/route.ts    # 客户管理门户
│       │   └── webhook/route.ts   # Stripe 回调
│       └── health/route.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # 浏览器端 Supabase 客户端
│   │   └── server.ts         # 服务端 Supabase 客户端
│   ├── stripe.ts             # Stripe 客户端
│   └── db.ts                 # 数据库连接
├── db/
│   └── schema.ts             # Drizzle 表定义
├── middleware.ts              # Next.js 中间件（认证守卫）
├── drizzle.config.ts
├── next.config.ts
├── .env.local                # 本地环境变量
└── package.json
```

**Next.js 的路由设计是文件即路由。** `app/api/billing/checkout/route.ts` 自动变成 `POST /api/billing/checkout` 接口。不需要额外的路由配置，也不需要 Express 或 Hono。

安装核心依赖：

```bash
pnpm add drizzle-orm postgres @supabase/supabase-js @supabase/ssr stripe
pnpm add -D drizzle-kit
```

---

## 第二步：用 Drizzle ORM 定义数据模型

这一步是整个应用的地基。数据模型定义清楚了，后面的 API、认证、支付逻辑都能围绕它展开。

> **给 Codex 的 Prompt：**
> 
> 我在用 Drizzle ORM + Supabase PostgreSQL 搭建一个 SaaS 应用。帮我定义数据库 schema，需要以下表：
> 1. users - 用户表，关联 Supabase Auth 的 user id，包含 email、name、stripeCustomerId
> 2. subscriptions - 订阅表，关联 Stripe 的 subscription id，包含 status、计费周期时间
> 3. 使用 Drizzle 的 pgTable 语法
> 4. 包含创建时间、更新时间字段
> 5. 定义好表之间的关系（一个用户对应一个订阅）
> 6. 同时给我 drizzle.config.ts 和数据库连接文件

Codex 会生成完整的 schema 文件。你需要检查的核心点：

- `users` 表有一个 `authId` 字段，用来关联 Supabase Auth 的 user id
- `users` 表有一个 `stripeCustomerId` 字段，后面接支付会用到
- `subscriptions` 表有 `status` 字段（active、canceled、past_due 等）
- `subscriptions` 表有 `currentPeriodEnd` 字段，这是判断用户是否还在有效期内的关键
- 两张表通过 `userId` 外键关联

定义好 schema 后，执行迁移：

```bash
# 推送 schema 到 Supabase 数据库
pnpm drizzle-kit push
```

### 为什么要用 ORM 而不是直接写 SQL

你可能会想：AI 生成 SQL 也很快，为什么还要加一层 ORM？

核心原因是**类型安全**。用原始 SQL 查数据，返回的是 `any` 类型——字段名拼错了、类型搞混了，都要等到运行时才会发现。用 Drizzle 查数据，返回类型是自动推导的，IDE 会自动补全字段名，写错了编辑器直接报红。

这对 AI 生成代码的场景特别有价值：Codex 生成的代码如果有类型错误，你的编辑器会立刻告诉你，不用等到部署才发现问题。

---

## 第三步：接入 Supabase 认证

Supabase Auth 开箱即用，你不需要自己实现注册、登录、密码重置、OAuth 这些东西。

### 3.1 Supabase Dashboard 配置

先在 Supabase Dashboard 里做三件事：

1. **开启你需要的登录方式。** Authentication → Providers，打开 Google、GitHub 等 OAuth Provider。每个 Provider 需要到对应平台申请 Client ID 和 Secret。
2. **配置回调 URL。** Authentication → URL Configuration，把你的域名加到 Redirect URLs 里（比如 `http://localhost:3000/auth/callback` 和 `https://yourdomain.com/auth/callback`）。
3. **拿到连接信息。** Settings → API，复制 Project URL 和 anon key。

### 3.2 让 Codex 写认证代码

> **给 Codex 的 Prompt：**
> 
> 我在用 Next.js App Router + Supabase Auth 做用户认证。帮我写以下代码：
> 1. 两个 Supabase 客户端：一个给浏览器端用（lib/supabase/client.ts），一个给服务端用（lib/supabase/server.ts），使用 @supabase/ssr 包
> 2. Next.js middleware.ts，用来保护需要登录才能访问的页面（比如 /dashboard、/billing），未登录重定向到 /auth/login
> 3. 登录页面 app/auth/login/page.tsx，包含 Google 登录按钮
> 4. OAuth 回调处理 app/auth/callback/route.ts
> 5. API 路由 app/api/auth/me/route.ts，验证 JWT token 后返回用户信息，如果用户在 users 表中不存在就自动创建
> 6. 使用之前定义的 Drizzle schema

### 3.3 认证流程详解

整个登录流程是这样的：

```
用户点击「用 Google 登录」
  │
  ▼
前端调用 supabase.auth.signInWithOAuth({ provider: 'google' })
  │
  ▼
浏览器跳转到 Google 授权页面
  │
  ▼
用户授权后，Google 重定向回 /auth/callback
  │
  ▼
回调路由用 Supabase SDK 交换 code → 拿到 session（包含 JWT token）
  │
  ▼
Supabase 客户端自动将 session 存入 cookie
  │
  ▼
后续请求自动带上 cookie → Next.js middleware 验证 → 放行或重定向
```

**关键点：用 `@supabase/ssr` 包而不是 `@supabase/supabase-js` 的直接浏览器客户端。** `@supabase/ssr` 专门为服务端渲染框架（Next.js、SvelteKit 等）设计，它把 session 存在 HTTP-only cookie 里而不是 localStorage，更安全，也能在 Server Components 中访问用户状态。

### 3.4 容易踩的坑

- **Supabase Auth 的 JWT token 默认有效期 1 小时。** `@supabase/ssr` 的 middleware 会自动处理刷新，但你必须在 middleware 中调用 `supabase.auth.getUser()`，否则 token 不会被刷新。
- **Server Components 和 Route Handlers 里要用不同的方式创建 Supabase 客户端。** Server Components 用 `cookies()` 创建只读客户端，Route Handlers 可以用读写客户端。让 Codex 按照 `@supabase/ssr` 的官方文档来写，别自己发明。
- **middleware.ts 的 matcher 配置。** 不要拦截静态资源和 API 路由中的 webhook 端点（Stripe webhook 不带用户 token）。

---

## 第四步：集成 Stripe 支付

这是商业化的核心。我们要实现完整的订阅付费流程。

### 4.1 Stripe Dashboard 配置

在 Stripe Dashboard 里先做好准备：

1. **创建产品和价格。** Products → Add product，比如创建一个 "Pro Plan"，月费 $9.99。Stripe 会生成一个 `price_xxx` ID，后面要用。
2. **配置 Customer Portal。** Settings → Billing → Customer portal，打开允许用户自助管理订阅（升级、降级、取消、更新支付方式）。
3. **拿到密钥。** Developers → API keys，复制 Secret key。注意：测试环境用 `sk_test_xxx`，生产环境用 `sk_live_xxx`。

### 4.2 让 Codex 写支付代码

> **给 Codex 的 Prompt：**
> 
> 我在用 Next.js App Router + Stripe 做订阅支付。帮我写以下代码：
> 1. Stripe 客户端初始化 lib/stripe.ts
> 2. 创建 Checkout Session 的 API 路由 app/api/billing/checkout/route.ts
>    - 需要验证用户身份（从 Supabase Auth 获取当前用户）
>    - 如果用户没有 Stripe Customer，先创建一个
>    - 创建 subscription 模式的 checkout session
>    - 在 metadata 里带上 userId
> 3. 创建 Customer Portal 的 API 路由 app/api/billing/portal/route.ts
> 4. Stripe Webhook 处理 app/api/billing/webhook/route.ts
>    - 验证 webhook 签名
>    - 处理 checkout.session.completed 事件（创建订阅记录）
>    - 处理 customer.subscription.updated 事件（更新订阅状态）
>    - 处理 customer.subscription.deleted 事件（取消订阅）
>    - 使用 Drizzle ORM 操作 subscriptions 表
> 5. 前端订阅管理页面 app/billing/page.tsx，展示当前订阅状态、升级按钮、管理订阅按钮
> 
> 使用之前定义的 Drizzle schema，环境变量从 process.env 读取。

### 4.3 支付流程详解

完整的支付链路：

```
前端：用户点击 "升级到 Pro"
  │
  ▼
前端 → POST /api/billing/checkout { priceId: "price_xxx" }
  │
  ▼
后端：创建 Stripe Customer（如果没有）→ 创建 Checkout Session → 返回 URL
  │
  ▼
前端：跳转到 Stripe 托管的支付页面
  │
  ▼
用户在 Stripe 页面完成支付
  │
  ├──→ Stripe 重定向用户回你的网站（前端展示成功页面）
  │
  └──→ Stripe 发送 Webhook → POST /api/billing/webhook
         │
         ▼
       后端验证签名 → 更新 subscriptions 表 → 用户获得 Pro 权限
```

两条线是独立的：一条给用户看结果（重定向），一条给系统更新数据（Webhook）。**永远不要依赖重定向来判断支付是否成功**——用户可能关掉浏览器，但 Webhook 一定会到。

### 4.4 必须注意的三件事

1. **Webhook 签名验证不能省。** 没有签名验证，任何人都可以伪造"支付成功"的请求，白嫖你的 Pro 功能。
2. **Webhook 端点不能加认证中间件。** Webhook 是 Stripe 服务器发来的，不带你的用户 cookie。在 `middleware.ts` 的 matcher 里排除 `/api/billing/webhook`。
3. **处理好幂等性。** Stripe 可能重复发送同一个事件。让 Codex 在写入数据库时用 `onConflictDoUpdate`（Drizzle）或 `upsert` 逻辑，同一个 subscription 重复处理也不会出问题。

### 4.5 Next.js 中 Webhook 的特殊处理

Next.js App Router 默认会解析请求体为 JSON。但 Stripe webhook 签名验证需要原始的请求体（raw body）。你需要在 webhook 路由中用 `request.text()` 而不是 `request.json()` 来读取请求体，然后再传给 Stripe 的 `constructEvent` 方法。

这个细节很容易被忽略。如果你发现 webhook 签名一直验证失败，99% 是这个原因。让 Codex 写代码时明确提醒它这一点。

---

## 第五步：权限控制

有了订阅数据，就可以做功能权限控制了。思路很简单：

```
请求进来
  │
  ▼
检查用户是否登录（Supabase Auth）
  │
  ├── 未登录 → 401
  │
  ▼
查询 subscriptions 表，看 status 是否为 active
  │
  ├── 非 active → 403（返回"需要升级"）
  │
  ▼
放行，执行 Pro 功能逻辑
```

> **给 Codex 的 Prompt：**
> 
> 帮我写一个权限控制的工具函数 lib/requirePro.ts：
> - 接收 Next.js 的 Request 对象
> - 从 cookie 中验证 Supabase Auth 身份
> - 查询 subscriptions 表判断是否为活跃订阅
> - 返回 { userId, isPro } 或抛出相应错误
> - 同时写一个 React 组件 components/ProGate.tsx，用于前端条件渲染（Pro 用户看 Pro 内容，免费用户看升级提示）

在 API 路由中使用时，Pro 功能的接口调用这个工具函数校验权限，通用接口直接校验登录状态就行。

---

## 第六步：部署到 Vercel

代码写完了，推上线。这是整个流程中最简单的一步。

### 6.1 连接 GitHub

1. 把代码推到 GitHub
2. 去 Vercel Dashboard → New Project → Import 你的仓库
3. Vercel 自动检测 Next.js 项目，构建配置零修改

### 6.2 配置环境变量

在 Vercel Dashboard → Settings → Environment Variables 中添加：

| 变量名 | 值 | 说明 |
|--------|---|------|
| `DATABASE_URL` | `postgresql://...` | Supabase 数据库连接字符串 |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase 匿名密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase 服务端密钥 |
| `STRIPE_SECRET_KEY` | `sk_live_xxx` | Stripe 密钥 |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | Stripe Webhook 密钥 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` | Stripe 公钥（前端用） |

以 `NEXT_PUBLIC_` 开头的变量会暴露给浏览器端，所以只有真正需要在前端用的变量才加这个前缀。**绝对不要把 `STRIPE_SECRET_KEY` 或 `SUPABASE_SERVICE_ROLE_KEY` 加上 `NEXT_PUBLIC_` 前缀。**

### 6.3 部署

```bash
git push origin main
```

推完代码，Vercel 自动构建、部署。大概一两分钟后，你的应用就在线了。

每次 push 到 main 自动部署到生产环境。每个 Pull Request 自动生成一个预览链接——改了什么，打开链接就能看。

### 6.4 配置 Stripe Webhook

部署成功后，拿到你的域名（比如 `my-saas-app.vercel.app` 或绑定的自定义域名）。

去 Stripe Dashboard → Developers → Webhooks → Add endpoint：

- **Endpoint URL：** `https://yourdomain.com/api/billing/webhook`
- **Events to listen：**
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

Stripe 会生成一个 Webhook Secret（`whsec_xxx`），填到 Vercel 的环境变量里。

### 6.5 Cloudflare 配域名

1. 在你的域名注册商那里，把 DNS 托管切到 Cloudflare
2. 在 Cloudflare Dashboard 添加一条 CNAME 记录，指向 Vercel 给你的域名（`cname.vercel-dns.com`）
3. 在 Vercel Dashboard 添加自定义域名
4. Cloudflare 自动提供 CDN 加速和 DDoS 防护，Vercel 自动签发 SSL 证书

这样你的流量链路就变成：用户 → Cloudflare CDN → Vercel → 你的应用。

---

## 第七步：本地开发流程

日常开发的工作流：

```bash
# 启动 Next.js 开发服务器
pnpm dev

# Stripe Webhook 本地测试（需要先安装 Stripe CLI）
stripe listen --forward-to http://localhost:3000/api/billing/webhook

# 数据库变更
# 1. 修改 db/schema.ts
# 2. 推送到 Supabase
pnpm drizzle-kit push
```

`pnpm dev` 启动后，访问 `http://localhost:3000` 就能看到你的应用。

Stripe CLI 的 `listen` 命令会把 Stripe 的 Webhook 事件转发到你的本地服务器。在另一个终端窗口跑 `stripe trigger checkout.session.completed`，可以模拟一次完整的支付流程，不需要真的掏钱。

### .env.local 示例

```
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

本地用 `sk_test_xxx`（测试密钥），Vercel 上用 `sk_live_xxx`（生产密钥）。Stripe 的测试模式和生产模式是完全隔离的，测试时不会产生真实扣款。

---

## 给 Codex 的进阶用法

项目骨架搭好之后，Codex 真正发挥价值的地方来了——在已有代码基础上快速迭代。

### 场景一：加一个新功能

> **Prompt：**
> 
> 这是我的 schema 文件 [贴 schema.ts 内容]。
> 我要加一个"项目"功能。每个用户可以创建多个项目，免费用户最多 3 个，Pro 用户无限制。
> 帮我：1. 在 schema 里加 projects 表  2. 写 CRUD 的 API 路由（app/api/projects/）  3. 加上数量限制检查  4. 写一个项目列表页面

### 场景二：排查问题

> **Prompt：**
> 
> 用户付款成功了但数据库里的 subscription 状态还是 inactive。
> 这是我的 webhook 处理代码 [贴代码]。
> 这是 Stripe 的事件日志 [贴日志]。
> 帮我排查可能的原因。

### 场景三：加前端页面

> **Prompt：**
> 
> 这是我的数据模型 [贴 schema]，这是我的 API 路由 [贴路由文件]。
> 帮我写一个 Dashboard 页面（app/dashboard/page.tsx），用 Server Components 实现：
> - 展示用户信息和当前订阅状态
> - 如果是免费用户，显示升级提示
> - 如果是 Pro 用户，显示使用量统计
> - 使用 Tailwind CSS 样式

关键思路：**把 Codex 当作一个熟悉你代码库的高级开发者，而不是一个代码生成器。** 你给它越多上下文，它给你越精准的结果。

---

## 完整的技术栈成本

把所有费用算一笔账：

| 项目 | 免费额度 | 超出后价格 |
|------|---------|-----------|
| Vercel | 无限项目、100GB带宽/月、Serverless 100万次/月 | $20/月（Pro） |
| Supabase | 500MB 数据库、5万月活、1GB 文件存储 | $25/月起 |
| Cloudflare | DNS 免费、CDN 免费、R2 10GB 存储 | 按量付费 |
| Stripe | 无月费 | 2.9% + $0.30/笔 |
| Codex（ChatGPT Plus） | - | $20/月 |
| 域名 | - | ~$10/年 |
| **Day 1 总成本** | | **$20/月**（仅 Codex） |

在你有收入之前，唯一的固定成本就是 Codex 的 $20/月。其余全是用量付费，没用量就不花钱。

---

## 常见问题

**Q：我没有境外公司，能用 Stripe 吗？**

不能直接注册。有两个选择：注册一个美国 LLC（通过 Firstbase、Stripe Atlas 等服务，费用约 $500），或者先用 LemonSqueezy 作为过渡，它接受个人注册且自带 Merchant of Record 服务。

**Q：Drizzle ORM 稳定吗？生产环境能用吗？**

可以。Drizzle 已经发布正式版，被大量生产项目使用。它的核心设计理念是"SQL in TypeScript"——不像 Prisma 那样引入新的查询语言，Drizzle 的查询 API 和 SQL 几乎一一对应，学习曲线很低。

**Q：Codex 和 Claude Code 怎么选？**

取决于你的使用场景。Codex 集成在 ChatGPT 中，适合通过对话式交互逐步构建代码。Claude Code 是命令行工具，可以直接读写你本地的文件系统，适合在现有项目中做修改。如果你是从零开始搭项目骨架，两者都可以；如果你在已有项目上迭代，Claude Code 的文件操作能力更强。

**Q：为什么 Cloudflare 只用来管 DNS，不用 Cloudflare Pages 部署？**

Cloudflare Pages 也能部署 Next.js，但对 Next.js 的一些高级功能（Server Components、Middleware、ISR）支持不如 Vercel 完整。Vercel 是 Next.js 的官方部署平台，功能兼容性最好。Cloudflare 做它最擅长的事——DNS、CDN、R2 存储——就足够了。

**Q：我想用 Prisma 而不是 Drizzle，可以吗？**

完全可以。在 Vercel 上部署，Prisma 没有兼容性问题（不像 Cloudflare Workers 那样）。两者的主要区别在于编码风格：Prisma 有自己的 schema 语言和查询语法，Drizzle 更贴近原生 SQL。让 Codex 写代码时，两个 ORM 它都很熟。

---

## 总结

这篇文章走了一遍完整流程：从项目初始化、数据模型定义、用户认证、支付集成，到部署上线。

核心要点回顾：

1. **Next.js App Router 前后端一体**，一个项目搞定所有事
2. **Drizzle ORM 提供类型安全**，AI 生成的代码有 TypeScript 兜底
3. **Supabase 管认证和数据**，你不需要自己实现登录系统
4. **Stripe Webhook 是支付的真正核心**，不是 Checkout 页面
5. **Vercel 部署 = Git push**，不碰服务器
6. **Cloudflare 管基础设施**，DNS + CDN + R2 是水电煤
7. **代码交给 Codex**，你的工作是定义需求和验证结果

这套东西搭完，你拥有的是一个标准的 SaaS 产品骨架。往上加功能——加 AI 能力、加团队协作、加数据分析——都可以在这个基础上长出来。

别等准备好了再开始。先跑起来，再慢慢完善。
