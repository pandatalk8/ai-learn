
# 第 6 章 HTTP(S) 与 API 调用原理

### 开场

到了第 8 章实战，你就要让产品调用 OpenAI API、把数据存进 Supabase。之后在支付、部署、Webhook 里，你还会反复看到「请求」「响应」「状态码」「API Key」这些词。

你不需要成为网络协议专家，但需要能看懂最小的一层：**浏览器和服务器到底是怎么通信的。**

这一章的目标很简单：让你能看懂浏览器开发者工具里的 Network 面板，遇到 API 报错时知道该把什么信息交给 AI。

### HTTP 是什么

HTTP 是浏览器和服务器之间通信的规则。HTTPS 是加密版的 HTTP。今天所有正式网站和 API 调用都应该使用 HTTPS。

一次 HTTP 通信只有两件事：

1. **请求（Request）**：浏览器或你的代码告诉服务器「我要什么」
2. **响应（Response）**：服务器告诉你「结果是什么」

比如：

```text
GET /api/articles?page=1
```

意思是：获取文章列表的第一页。

### 四个常见方法

Web 产品里的大部分操作都可以理解成 CRUD：

| 操作 | HTTP 方法 | 例子 |
|------|----------|------|
| 创建 | `POST` | 注册用户、创建订单、保存摘要 |
| 读取 | `GET` | 获取文章列表、读取用户资料 |
| 更新 | `PUT` / `PATCH` | 修改昵称、更新订阅状态 |
| 删除 | `DELETE` | 删除历史记录、取消收藏 |

当你让 AI 写 API 或 Server Action 时，可以用这套语言描述需求：

> 创建一个保存摘要的服务端逻辑，本质是一次创建操作。用户提交原文后，把摘要结果作为一条新记录保存到 Supabase。

### 状态码怎么读

状态码是 API 调试里最重要的信息。

| 状态码 | 含义 | 你应该怎么理解 |
|--------|------|----------------|
| `200` | 成功 | 请求正常返回 |
| `201` | 创建成功 | 新数据已经创建 |
| `400` | 请求有误 | 参数格式不对 |
| `401` | 未登录 | 缺少身份凭证或登录过期 |
| `403` | 没权限 | 登录了，但没有权限访问 |
| `404` | 找不到 | URL 或资源不存在 |
| `429` | 请求太频繁 | 被限流了 |
| `500` | 服务器错误 | 后端代码或第三方服务出问题 |

以后报错时，不要只告诉 AI「坏了」。要这样说：

> 我点击按钮后接口返回 403。Network 面板里请求 URL 是 `/api/summarize`，方法是 POST，响应内容是 `[粘贴错误信息]`。请帮我判断是权限问题、环境变量问题还是 RLS 策略问题。

### API 是什么

API 是软件之间的调用入口。Stripe、Supabase、OpenAI 都通过 API 给你的产品提供能力。

你写：

```ts
const { data } = await supabase.from("summaries").select("*")
```

看起来像是在调用一个 JavaScript 方法，但底层其实是一次 HTTPS 请求。Supabase 客户端只是把 HTTP 请求包装得更好用。

Stripe Checkout、OpenAI 摘要、Creem 支付也是一样：你调用 SDK，SDK 在背后发 API 请求。

### JSON 是 API 的通用格式

API 之间传数据，最常见的格式是 JSON。

```json
{
  "title": "AI Coding Guide",
  "status": "published",
  "price": 19
}
```

你不需要手写复杂 JSON，但要能看懂：它就是一组 key/value。API 报错时，响应内容通常也是 JSON。

### Server Actions 是 Next.js 的隐形 API

后面的实战章节里，我们会主要让 AI 使用 Server Actions，而不是手写很多 `/api/...` 路由。

Server Action 看起来像普通函数：

```ts
export async function createSummary(input: string) {
  "use server"
  // 调用 OpenAI，保存到 Supabase
}
```

但它本质上仍然是一次前端到服务端的请求。Next.js 帮你隐藏了手写 `fetch`、序列化、路由定义这些细节。

所以当 Server Action 报错时，你仍然可以打开 Network 面板，看请求有没有发出去、状态码是什么、响应内容是什么。

### Webhook 是反过来的 API 调用

普通 API 是你主动问第三方服务要结果：

```text
你的产品 → Stripe：这个订单状态是什么？
```

Webhook 是第三方服务主动通知你：

```text
Stripe → 你的产品：这个用户已经付款成功。
```

支付一定会用到 Webhook。因为你不知道用户什么时候完成付款，不能每秒去问 Stripe。正确做法是：Stripe 付款成功后，主动调用你的 `/api/stripe/webhook`，你的服务器再更新 Supabase 里的订阅状态。

### 用 Network 面板调试 API

浏览器开发者工具的 Network 面板是排查 API 问题的第一现场。

操作步骤：

1. 打开页面
2. 按 F12 或右键 Inspect
3. 进入 Network
4. 执行出问题的操作，比如点击 `Summarize`
5. 找到对应请求，查看 URL、Method、Status、Request Payload、Response

把这些信息交给 AI，AI 才能准确判断问题。

你可以这样问：

> 我在 Network 面板看到 `/api/stripe/webhook` 返回 500。请求方法是 POST，响应内容是 `[粘贴内容]`。请根据这个错误帮我定位问题，并说明需要检查哪些环境变量。

### 三个高频问题：超时、403、Webhook 收不到

有三类问题你几乎一定会遇到。提前知道它们长什么样，遇到时就不会慌。

**第一，请求超时（Timeout）。** 请求发出去了，迟迟等不到响应，最后浏览器或平台直接掐断。常见原因：

- AI API 处理长文本本来就慢——生成一次摘要可能要十几秒，而 serverless 函数的默认超时时间可能更短
- 第三方服务响应慢或临时宕机
- 服务端代码在等一个永远不会返回的调用

排查思路：把「哪个请求、等了多久、报什么错」告诉 AI。常见解法是加超时控制、把响应改成流式（streaming），或者把长任务拆成异步处理。

**第二，403 没权限。** 登录了但被拒绝。在这套技术栈里，403 十有八九是 Supabase 的 RLS 策略拦的——比如表开了 RLS 却没写「用户可以读自己的数据」的策略，所有查询都会被拒。把表名、操作类型和现有 RLS 策略发给 AI，让它检查缺了哪条规则。

**第三，Webhook 收不到数据。** 支付明明成功了，你的数据库却没更新。三个最常见的原因：

- 本地开发环境收不到——Stripe 在云端，你的 `localhost` 它够不着，本地测试要用 Stripe CLI 把事件转发到本地
- Webhook URL 没配或配错了——去 Stripe 后台核对回调地址
- 签名校验失败——`STRIPE_WEBHOOK_SECRET` 环境变量不对，服务器直接拒收

这三类问题的共同排查起点都是 Network 面板（或服务端日志）：拿到状态码和响应内容，再喂给 AI。

### API Key 安全

API Key 分两类：

- **Public / Publishable Key**：可以放到前端，例如 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Secret Key**：只能放服务端，例如 `OPENAI_API_KEY`、`STRIPE_SECRET_KEY`

绝对不要把 Secret Key 写进前端代码，也不要提交到 GitHub。

本课程的规则是：

- 本地开发密钥放 `.env.local`
- 生产环境密钥在 Vercel / Cloudflare 后台手动配置
- 让 AI 检查代码里有没有硬编码密钥
- 但 API Key 的复制、粘贴、授权确认由开发者自己完成

### 本章小结

- HTTP/HTTPS 是浏览器和服务器通信的规则
- API 是软件之间的调用入口，SDK 底层也是 API 请求
- 常见状态码里，`401` 是未登录，`403` 是没权限，`500` 是服务器错误
- JSON 是 API 传输数据的通用格式
- Server Actions 是 Next.js 帮你封装过的服务端请求
- Webhook 是第三方服务主动调用你的服务器，支付业务一定会用到
- 三个高频问题：超时看耗时和任务长度、403 先查 RLS、Webhook 收不到先查转发和 Secret
- Network 面板是调试 API 问题的核心工具
- Secret Key 只能放服务端和部署平台环境变量里，不能暴露到前端或 GitHub
