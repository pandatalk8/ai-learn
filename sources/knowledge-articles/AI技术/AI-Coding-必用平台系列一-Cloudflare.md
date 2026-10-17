# AI Coding 必须要用的平台系列一：Cloudflare

> 系列说明：这个系列专门介绍独立开发者做 AI 产品时，不可绕开的基础平台。Cloudflare 是第一篇，因为它几乎是每个小开发者都会遇到的"第一堵墙"——早点搞懂，省很多时间。

---

## 为什么 AI 编程要用 Cloudflare？

你用 AI 写完了一个小应用，现在需要部署上线、存储文件、管理数据库、调用 AI 模型……这些需求背后都需要基础设施。

大公司有自己的服务器，小开发者有什么？

**Cloudflare。**

Cloudflare 本质上是一个"互联网基础设施公司"，原本以 CDN 和安全防护起家，但这几年它悄悄变成了小开发者最喜欢的全栈基础设施平台。原因只有一个：**免费额度慷慨，产品设计极简，全球边缘部署。**

---

## 一、先搞清楚 Cloudflare 能干什么

Cloudflare 的产品线很长，对初学者来说不需要全学，先记住这张地图：

```
Cloudflare 对小开发者有用的产品

├── 域名 & 网络层
│   ├── DNS 管理（免费，全球最快之一）
│   └── CDN（静态资源加速，免费）
│
├── 部署 & 运行
│   ├── Pages（前端静态托管，类似 Vercel）
│   └── Workers（后端逻辑，Serverless 函数）
│
├── 存储
│   ├── R2（对象存储，S3 兼容，无出流量费）
│   ├── KV（键值存储，适合配置/缓存）
│   └── D1（SQLite 数据库，Serverless）
│
└── AI 专属
    ├── AI Gateway（AI API 代理，限速/缓存/监控）
    ├── Workers AI（边缘运行 AI 模型）
    └── Vectorize（向量数据库，RAG 必备）
```

接下来逐个讲解。

---

## 二、DNS 管理：把你的域名交给 Cloudflare

### 它是什么？

DNS 就是"域名系统"，把 `yourapp.com` 翻译成服务器 IP 地址。Cloudflare 提供免费的 DNS 托管，是目前全球响应速度最快的 DNS 之一。

### 为什么用？

1. **速度快**：全球 300+ 节点，解析延迟极低
2. **免费**：完全免费，无限流量
3. **自动开启 CDN 保护**：一键开启橙色云朵，流量经过 Cloudflare 节点，隐藏源站 IP
4. **后续产品打通**：用了 Cloudflare DNS，Pages/Workers/R2 的域名绑定都更方便

### 怎么用？

1. 在 Cloudflare 注册账号
2. 点击"添加站点"，输入你的域名
3. Cloudflare 会扫描现有 DNS 记录并导入
4. 到你的域名注册商（比如 Namecheap、GoDaddy）把 Nameserver 改成 Cloudflare 提供的两个地址
5. 等待生效（通常几分钟到 24 小时）

**注意**：改 Nameserver 是把 DNS 控制权转移给 Cloudflare，域名本身还在原来的注册商，不影响续费。

---

## 三、Cloudflare Pages：免费的前端部署平台

![image-20260408103339788](../../../Library/Application Support/typora-user-images/image-20260408103339788.png)

### 它是什么？

Pages 是 Cloudflare 的静态网站托管服务，类似于 Vercel 或 Netlify。你把代码推到 GitHub，它自动构建并部署到全球 CDN。

### 适合什么场景？

- React / Vue / Next.js（静态导出）/ Astro 项目
- 文档站、博客、落地页、工具站
- 任何"前端为主"的项目

### 免费额度

| 功能 | 免费额度 |
|------|---------|
| 站点数量 | 无限 |
| 每月构建次数 | 500 次 |
| 带宽 | 无限 |
| 自定义域名 | 支持 |
| HTTPS | 自动 |

**无限带宽**是关键——很多竞品按流量收费，Cloudflare Pages 不收。

### 怎么部署？

```bash
# 方法一：连接 GitHub（推荐）
# 在 Cloudflare Dashboard → Pages → 创建项目 → 连接 GitHub 仓库
# 选择构建命令和输出目录，完成。

# 方法二：用 Wrangler CLI（本地工具）
npm install -g wrangler
wrangler pages deploy ./dist
```

### 与 Vercel 怎么选？

- **Vercel**：对 Next.js 支持最好，SSR 功能更完整，免费额度有带宽限制
- **Cloudflare Pages**：带宽无限，和 Workers / R2 集成更顺滑，适合做 AI 应用全栈

---

## 四、Cloudflare Workers：边缘 Serverless 后端

### 它是什么？

Workers 是 Cloudflare 的 Serverless 计算平台。你写一段 JavaScript（或 TypeScript、Python、Rust），它运行在全球 300+ 个节点上，而不是某个固定的服务器。

这意味着：**用户在哪里，代码就在哪里运行，延迟极低。**

### 适合什么场景？

- API 接口（对接 AI 服务、数据库查询）
- 请求转发、鉴权中间件
- 定时任务（Cron Triggers）
- Webhook 处理

### 免费额度

| 功能 | 免费额度 |
|------|---------|
| 每日请求数 | 10 万次 |
| CPU 时间 | 每次请求 10ms（免费）/ 30s（付费） |
| 内存 | 128MB |
| 脚本数量 | 100 个 |

对于初期项目，10万次/天基本够用。

### 一个最简单的 Worker

```javascript
// src/index.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/hello') {
      return Response.json({ message: 'Hello from Cloudflare Workers!' });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
```

```toml
# wrangler.toml
name = "my-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"
```

```bash
# 部署
wrangler deploy
```

就这样，你的 API 上线了，跑在全球边缘节点上。

### Workers 的局限

- **不是长时运行的服务**：一次请求最多 30 秒（免费版 10ms CPU 时间）
- **没有文件系统**：需要配合 R2 存文件
- **内存有限**：不适合跑重型任务

---

## 五、Cloudflare R2：没有出流量费的对象存储

### 它是什么？

R2 是 Cloudflare 的对象存储服务，完全兼容 Amazon S3 的 API。也就是说，你原来写的 S3 代码，改几行配置就能用 R2。

### 为什么特别值得关注？

AWS S3 的一大"隐形成本"是**出流量费（Egress Fee）**——每次用户下载文件，你都要按流量付钱。如果你的应用有大量图片、视频或文件下载，这个费用会很高。

**R2 的出流量完全免费。** 这对有文件存储需求的 AI 应用来说意义重大。

### 免费额度

| 功能 | 免费额度 |
|------|---------|
| 存储空间 | 10 GB / 月 |
| A 类操作（写） | 100 万次 / 月 |
| B 类操作（读） | 1000 万次 / 月 |
| 出流量 | **永久免费** |

### 适合存什么？

- 用户上传的图片、文档
- AI 生成的图片（Stable Diffusion 等）
- 应用的静态资源（大文件）
- 数据库备份

### 用代码访问 R2

```javascript
// 在 Worker 中直接访问 R2 Bucket
export default {
  async fetch(request, env) {
    const key = 'my-image.png';
    
    // 上传文件
    await env.MY_BUCKET.put(key, request.body);
    
    // 读取文件
    const object = await env.MY_BUCKET.get(key);
    
    return new Response(object.body);
  }
};
```

```toml
# wrangler.toml 中绑定 R2
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-app-files"
```

也可以用标准的 AWS SDK（改 endpoint 指向 R2）：

```javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://<ACCOUNT_ID>.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
```

---

## 六、Cloudflare D1：Serverless SQLite 数据库

### 它是什么？

D1 是 Cloudflare 的 Serverless SQL 数据库，底层是 SQLite。它可以直接在 Workers 里查询，不需要单独的数据库连接池管理。

### 适合什么场景？

- 小型 Web 应用的数据存储
- 用户数据、配置、内容管理
- 原型开发和 MVP 阶段

### 免费额度

| 功能 | 免费额度 |
|------|---------|
| 存储 | 5 GB |
| 读取行数 | 50 亿行 / 月 |
| 写入行数 | 5000 万行 / 月 |

### 怎么用？

```bash
# 创建数据库
wrangler d1 create my-database

# 运行 SQL 迁移
wrangler d1 execute my-database --file ./schema.sql
```

```sql
-- schema.sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

```javascript
// 在 Worker 中查询
export default {
  async fetch(request, env) {
    const { results } = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind('user@example.com').all();
    
    return Response.json(results);
  }
};
```

### D1 vs 其他数据库

| | D1 | PlanetScale | Supabase |
|--|--|--|--|
| 类型 | SQLite | MySQL | PostgreSQL |
| 冷启动 | 无 | 有 | 有 |
| Workers 集成 | 原生 | 需配置 | 需配置 |
| 免费额度 | 充足 | 充足 | 充足 |
| 适合场景 | 中小应用 | 高并发写入 | 复杂关系型 |

---

## 七、Cloudflare KV：全局键值存储

### 它是什么？

KV 是一个分布式键值数据库，数据写入后会同步到全球所有边缘节点，读取极快。

### 适合存什么？

- 用户 Session Token
- 应用配置（Feature Flags）
- API 响应缓存
- 限流计数器

### 不适合什么？

- 需要强一致性的数据（KV 是最终一致性）
- 频繁更新的数据（写入传播有延迟）
- 复杂查询

### 免费额度

| 操作 | 免费额度 |
|------|---------|
| 读取 | 1000 万次 / 天 |
| 写入/删除/列表 | 10 万次 / 天 |
| 存储 | 1 GB |

```javascript
// 读写 KV
export default {
  async fetch(request, env) {
    // 写入
    await env.MY_KV.put('user:123:session', 'token-xyz', {
      expirationTtl: 3600  // 1小时后过期
    });
    
    // 读取
    const session = await env.MY_KV.get('user:123:session');
    
    return new Response(session);
  }
};
```

---

## 八、Cloudflare AI Gateway：AI 项目必装的"中间层"

### 它是什么？

AI Gateway 是专门为 AI 应用设计的 API 代理层。你不直接调用 OpenAI / Anthropic / Gemini，而是通过 Cloudflare 的网关转发——它帮你记录日志、统计费用、缓存相同请求、设置限流。

### 为什么 AI 项目需要它？

做 AI 应用最头疼的几个问题：

1. **花了多少钱？** 各家 API 费用不透明，很难汇总
2. **哪个 Prompt 效果好？** 没有统一日志，难以对比
3. **相同请求重复付费**：同样的问题用户问了 100 次，你付了 100 次 API 费
4. **限流保护**：防止某些用户滥用你的应用

AI Gateway 一次性解决这四个问题。

### 支持哪些 AI 服务？

OpenAI、Anthropic Claude、Google Gemini、Azure OpenAI、Mistral、Cohere、Hugging Face、Replicate……几乎覆盖所有主流 AI 服务。

### 怎么接入？

只需要改一个 URL，其他代码完全不变：

```javascript
// 原来直接调用 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // baseURL 默认是 https://api.openai.com/v1
});

// 改为通过 AI Gateway 代理
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_name}/openai',
});

// 调用方式完全一样
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

改完之后，所有请求都会经过 Cloudflare 的节点，你在 Dashboard 就能看到：
- 每次请求的 Token 用量和费用
- 响应时间和成功率
- 缓存命中情况

### 缓存功能

```javascript
// 开启语义缓存——相似的问题复用之前的答案
const response = await fetch(gatewayUrl, {
  method: 'POST',
  headers: {
    'cf-aig-cache-ttl': '3600',  // 缓存 1 小时
  },
  body: JSON.stringify({ messages: [...] }),
});
```

### 免费额度

AI Gateway 目前**完全免费**，不限请求次数（Cloudflare 把它作为吸引开发者的入口）。

---

## 九、Workers AI：在边缘运行 AI 模型

### 它是什么？

Workers AI 是 Cloudflare 提供的"边缘推理"服务，你可以直接在 Workers 里调用各种 AI 模型，不需要自己部署 GPU 服务器。

### 支持哪些模型？

- **文本生成**：Llama 3、Mistral、Gemma 等开源模型
- **图像生成**：Stable Diffusion XL
- **文本嵌入**：BGE、多语言嵌入模型
- **语音识别**：Whisper
- **图像分类**：ResNet 等
- **文本分类**：多种分类模型

### 适合什么场景？

- **原型阶段**：不想付 OpenAI 费用，用免费开源模型测试想法
- **辅助任务**：分类、摘要、嵌入等对质量要求不极致的任务
- **隐私敏感场景**：数据不出边缘节点

### 代码示例

```javascript
export default {
  async fetch(request, env) {
    // 文本生成
    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: 'user', content: '用一句话解释什么是 Cloudflare Workers' }
      ],
    });
    
    return Response.json(response);
  }
};
```

```javascript
// 生成文本嵌入（用于 RAG）
const embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
  text: ['这是要转换成向量的文本'],
});

// embeddings.data[0] 就是向量数组
```

### 免费额度

| 功能 | 免费额度 |
|------|---------|
| 神经元（计算单位） | 每天 10,000 神经元 |

实际等价于每天可以免费跑几百次小模型推理，够用于开发测试。

---

## 十、Vectorize：向量数据库（做 RAG 必备）

### 它是什么？

Vectorize 是 Cloudflare 的向量数据库。向量数据库存储的不是普通数据，而是文本/图片被 AI 模型转换成的"语义向量"，用于做相似度搜索。

做 RAG（检索增强生成）应用必然用到向量数据库。

### 工作流程

```
1. 把你的文档喂给嵌入模型 → 得到向量
2. 把向量存到 Vectorize
3. 用户提问 → 把问题转成向量 → 在 Vectorize 里找最相近的文档片段
4. 把相关文档 + 用户问题一起发给 LLM → 得到有依据的回答
```

### 代码示例

```javascript
// 插入向量
await env.VECTORIZE.insert([
  {
    id: 'doc-001',
    values: [0.12, 0.55, 0.88, ...],  // 嵌入模型输出的向量
    metadata: { text: '文档原文内容', source: 'article-1.pdf' }
  }
]);

// 相似度搜索
const results = await env.VECTORIZE.query(queryVector, {
  topK: 5,           // 返回最相近的 5 条
  returnMetadata: true,
});
```

### 免费额度

| 功能 | 免费额度 |
|------|---------|
| 向量数量 | 30,000 个 |
| 每月查询 | 3000 万次 |
| 维度上限 | 1536 维（够用 OpenAI embedding） |

---

## 十一、一个完整 AI 应用的 Cloudflare 全家桶架构

把上面所有产品串起来，一个典型的小型 AI 应用架构长这样：

```
用户浏览器
    │
    ▼
Cloudflare Pages（前端，React/Next.js）
    │
    ▼
Cloudflare Workers（API 层，处理请求逻辑）
    │
    ├──▶ AI Gateway ──▶ OpenAI / Claude（外部 AI 服务）
    │
    ├──▶ Workers AI（边缘运行开源模型）
    │
    ├──▶ Vectorize（语义搜索，RAG）
    │
    ├──▶ D1（用户数据、内容存储）
    │
    ├──▶ KV（Session、缓存）
    │
    └──▶ R2（图片、文件存储）
```

**整套架构的月费用：**
- 初期流量下：**接近 $0**（全靠免费额度）
- 中等规模（日活几百人）：**约 $5-20/月**

这就是为什么独立开发者都爱 Cloudflare——几乎零成本就能跑一个生产级的 AI 应用架构。

---

## 十二、快速上手路线图

**第一步：注册账号，迁移域名 DNS**
- 注册 Cloudflare 账号（免费）
- 把域名的 Nameserver 改成 Cloudflare

**第二步：安装 Wrangler CLI**
```bash
npm install -g wrangler
wrangler login
```

**第三步：部署第一个 Worker**
```bash
npm create cloudflare@latest my-first-worker
cd my-first-worker
wrangler dev    # 本地开发
wrangler deploy # 上线
```

**第四步：按需添加存储**
```bash
# 创建 D1 数据库
wrangler d1 create my-db

# 创建 R2 Bucket
wrangler r2 bucket create my-files

# 创建 KV Namespace
wrangler kv namespace create my-cache
```

**第五步：接入 AI Gateway**
- Dashboard → AI Gateway → 创建 Gateway
- 复制 Gateway URL，替换你的 AI SDK 的 baseURL

---

## 总结：Cloudflare 的核心价值

对 AI 编程的初学者来说，Cloudflare 的价值可以用三句话概括：

**免费额度足够跑 MVP**——从想法到上线，不需要先花钱。

**产品线完整，减少第三方依赖**——前端、后端、数据库、存储、AI 都在一个平台，减少跨平台踩坑。

**全球边缘部署，性能开箱即用**——不用自己配 CDN，不用担心服务器地域问题。

下一篇我们会介绍 **Supabase**——另一个独立开发者必备平台，专注于数据库、认证和实时功能。

---

*参考资源：*
- *Cloudflare 官方文档：developers.cloudflare.com*
- *Wrangler CLI 文档：developers.cloudflare.com/workers/wrangler*
- *Cloudflare AI 产品总览：developers.cloudflare.com/ai*
