# OpenClaw 多用户改造深度调研

> 调研时间：2026年2月
> 关键词：OpenClaw、多租户、多用户、SaaS 化、架构改造

---

## 一、OpenClaw 项目概览

[OpenClaw](https://github.com/openclaw/openclaw) 是 2026 年 GitHub 上最火爆的开源项目之一，由 PSPDFKit 创始人 Peter Steinberger 开发。项目经历了 Clawdbot → Moltbot → OpenClaw 的更名历程（因"Clawd"与"Claude"商标冲突），截至 2026 年 2 月已积累超过 **170k+ GitHub Stars**，成为 GitHub 历史上增长最快的开源项目之一。

### 核心定位

OpenClaw 是一个**开源的自托管个人 AI Agent 网关**，强调"本地优先、隐私自控"的设计理念。它不仅能回答问题，还能主动操作系统、访问网页、处理邮件、整理文件、发送提醒，甚至自动编写代码——是一个真正的**任务执行型 Agent**。

### 技术栈

| 组件 | 技术选型 |
|------|----------|
| 语言 | TypeScript |
| 构建 | Turborepo + pnpm monorepo |
| 后端框架 | Hono (Node.js) |
| 前端 | React 18 + Vite + shadcn/ui + Tailwind CSS |
| 默认存储 | 内存 + Markdown 文件 |
| 生产推荐 | Redis (会话缓存) + Bull Queue (消息队列) |
| 许可证 | MIT |

---

## 二、现有架构分析

### 2.1 四层核心架构

OpenClaw 的架构由四个关键模块构成：

```
┌─────────────────────────────────────────────────┐
│                  Channels 通道层                  │
│   WhatsApp / Telegram / Slack / 飞书 / Discord   │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│               Gateway 网关层（核心）               │
│   会话管理 · 消息路由 · 鉴权 · 工具执行协调         │
└──────────┬───────────────────────┬──────────────┘
           │                       │
┌──────────▼──────────┐ ┌─────────▼──────────────┐
│   Agent 智能体层     │ │    Skills 技能层        │
│  上下文理解 · 规划   │ │  网页调研 · 浏览器自动化 │
│  意图推理 · 决策     │ │  邮件 · 文件 · API调用  │
└──────────┬──────────┘ └────────────────────────┘
           │
┌──────────▼──────────┐
│   Memory 记忆层      │
│  JSONL 对话记录      │
│  Markdown 长期记忆   │
│  混合语义搜索        │
└─────────────────────┘
```

### 2.2 数据流

一条消息的完整处理路径：

1. **Channel 层**接收 Webhook，将平台消息标准化为 `StandardMessage`
2. **路由决策**检查权限规则（`dmPolicy`、`mentionGating`）
3. **Gateway** 查找/创建 Session，加入消息队列（默认最大 10 并发）
4. **Agent + LLM** 处理上下文，选择 Provider，调用技能
5. **响应回传**：LLM → Gateway → Channel → 用户

### 2.3 会话隔离现状

| 配置项 | 值 | 说明 |
|--------|----|------|
| `sandbox.scope` | `agent`（默认） | 按 Agent 隔离 |
| `sandbox.scope` | `session` | 更严格的按会话隔离 |
| `session.dmScope` | `main`（默认） | 所有 DM 路由到主会话 |
| `session.dmScope` | `per-channel-peer` | 每个 channel+sender 独立上下文 |

### 2.4 记忆系统

OpenClaw 的记忆系统是其最具特色的设计之一：

- **JSONL Transcripts**：逐行审计日志，记录对话事实
- **MEMORY.md**：Markdown 文件存储长期记忆、摘要、经验知识
- **纯文件方案**：透明、人类可读、可版本控制
- **混合语义搜索**：在纯文件基础上叠加语义检索能力

---

## 三、多用户改造的核心挑战

### 3.1 当前的单用户设计限制

根据 [GitHub Issue #8081](https://github.com/openclaw/openclaw/issues/8081) 和社区讨论，OpenClaw 目前存在以下多用户方面的关键缺陷：

| 问题领域 | 具体表现 |
|---------|---------|
| **权限管理缺失** | 所有接入系统的用户可查看和修改 API Key、凭证和配置 |
| **会话隔离脆弱** | 并发场景下可能出现跨会话/跨通道数据泄漏 |
| **配置全局生效** | 切换模型配置需要重启网关，且全局生效 |
| **记忆无隔离** | Markdown 文件形式的记忆系统无用户级别隔离 |
| **审计日志缺失** | 无法追踪哪个用户执行了什么操作 |
| **计费无法区分** | 无法按用户统计 Token 消耗和 API 调用成本 |

### 3.2 安全风险

[CSO Online](https://www.csoonline.com/article/4129867/what-cisos-need-to-know-about-clawdbot-i-mean-moltbot-i-mean-openclaw.html) 和 [Fortune](https://fortune.com/2026/02/12/openclaw-ai-agents-security-risks-beware/) 等主流安全媒体已对 OpenClaw 的安全问题发出警告。核心风险包括：

- **会话隔离失败**：多用户场景下的授权绕过和权限提升
- **共享可变状态**：路由器使用"当前活动上下文"作为身份代理，并发环境下身份绑定可能失效
- **高权限执行**：Agent 拥有系统级操作权限，一旦被滥用后果严重

---

## 四、多用户改造方案设计

### 4.1 改造目标

将 OpenClaw 从**单用户个人助手**改造为**多用户/多租户平台**，需要达成：

- 用户认证与授权（RBAC）
- 数据隔离（会话、记忆、配置）
- 资源计量与配额管理
- 审计与合规
- 水平扩展能力

### 4.2 方案一：应用层改造（渐进式）

在 OpenClaw 现有架构基础上，通过增加中间件和抽象层实现多用户支持。

#### 架构改造要点

```
┌─────────────────────────────────────────────────┐
│              Auth Gateway (新增)                  │
│   OAuth 2.0 / JWT / API Key 认证                 │
│   RBAC 权限校验 · 速率限制 · 租户路由             │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│            Tenant Context Layer (新增)            │
│   请求注入 tenant_id + user_id                    │
│   配置隔离 · 凭证隔离 · 记忆隔离                  │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│             OpenClaw Gateway (改造)               │
│   多租户会话管理 · 按租户路由 · 按用户计量         │
└─────────────────────────────────────────────────┘
```

#### 关键改造模块

**1. 认证系统**

```typescript
// 新增：认证中间件
interface AuthProvider {
  authenticate(request: Request): Promise<UserContext>;
  authorize(user: UserContext, resource: string, action: string): boolean;
}

interface UserContext {
  userId: string;
  tenantId: string;
  roles: Role[];
  permissions: Permission[];
  quotas: QuotaConfig;
}

// 角色定义
enum Role {
  ADMIN = 'admin',           // 完全控制
  MANAGER = 'manager',       // 管理用户和配置
  USER = 'user',             // 正常使用
  GUEST = 'guest',           // 只读/受限
}
```

**2. 数据隔离**

| 数据类型 | 隔离策略 | 实现方式 |
|---------|---------|---------|
| 会话数据 | 租户+用户级 | Redis key 加 `{tenantId}:{userId}:` 前缀 |
| 记忆文件 | 租户+用户级 | 按 `/{tenantId}/{userId}/MEMORY.md` 分目录 |
| 对话记录 | 用户级 | JSONL 文件按用户目录存放 |
| API 凭证 | 租户级 | 加密存储，按租户隔离 |
| 技能配置 | 租户级+用户覆盖 | 继承式配置，用户可覆盖租户默认值 |

**3. 资源计量**

```typescript
interface UsageTracker {
  trackTokenUsage(tenantId: string, userId: string, model: string, tokens: TokenUsage): void;
  trackSkillInvocation(tenantId: string, userId: string, skill: string): void;
  checkQuota(tenantId: string, userId: string): QuotaStatus;
}

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalCost: number;
  model: string;
  timestamp: Date;
}
```

#### 优缺点分析

| 维度 | 评价 |
|------|------|
| **开发成本** | 中等，可复用大量现有代码 |
| **侵入性** | 中等，需要修改 Gateway 核心逻辑 |
| **安全性** | 中等，应用层隔离，非 OS 级隔离 |
| **可维护性** | 需要跟随 OpenClaw 上游更新 |
| **扩展性** | 受限于单进程架构 |

### 4.3 方案二：容器化多实例（NanoClaw 思路）

借鉴 [NanoClaw](https://github.com/qwibitai/nanoclaw) 的容器隔离理念，为每个用户/租户运行独立的 OpenClaw 实例。

#### 架构设计

```
┌─────────────────────────────────────────┐
│          API Gateway / Load Balancer     │
│     Nginx / Traefik / Cloudflare        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Orchestration Layer (新增)         │
│   用户注册 · 实例生命周期管理            │
│   配置注入 · 健康检查 · 自动扩缩        │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│User A │ │User B │ │User C │
│OpenClaw│ │OpenClaw│ │OpenClaw│
│Container│ │Container│ │Container│
│独立文件系统│ │独立文件系统│ │独立文件系统│
└───────┘ └───────┘ └───────┘
```

#### 实现要点

```yaml
# docker-compose 模板（per-tenant）
version: '3.8'
services:
  openclaw-tenant:
    image: openclaw/openclaw:latest
    environment:
      - TENANT_ID=${TENANT_ID}
      - ANTHROPIC_API_KEY=${TENANT_API_KEY}
      - OPENCLAW_PORT=${ASSIGNED_PORT}
    volumes:
      - ./data/${TENANT_ID}:/root/.openclaw
    networks:
      - tenant-${TENANT_ID}
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

#### 优缺点分析

| 维度 | 评价 |
|------|------|
| **开发成本** | 低，几乎不改动 OpenClaw 代码 |
| **侵入性** | 极低，仅在外部编排层增加逻辑 |
| **安全性** | 高，OS 级容器隔离 |
| **可维护性** | 好，可直接跟随上游更新 |
| **资源开销** | 高，每用户一个实例 |
| **扩展性** | 好，天然支持水平扩展 |
| **适用场景** | 用户数 < 1000，企业内部部署 |

### 4.4 方案三：微服务化重构（深度改造）

对 OpenClaw 进行深度拆分，将其改造为原生多租户微服务架构。

#### 架构设计

```
┌────────────────────────────────────────────────────┐
│                   API Gateway                       │
│          认证 · 限流 · 路由 · CORS                   │
└──────────┬──────────────┬──────────────┬───────────┘
           │              │              │
┌──────────▼────┐ ┌───────▼──────┐ ┌────▼───────────┐
│  User Service │ │ Agent Service│ │ Channel Service│
│  注册/登录     │ │  LLM 调用    │ │  平台适配       │
│  角色/权限     │ │  技能路由    │ │  消息标准化     │
│  配额管理      │ │  上下文管理  │ │  Webhook 管理   │
└──────────┬────┘ └───────┬──────┘ └────┬───────────┘
           │              │              │
┌──────────▼──────────────▼──────────────▼───────────┐
│              Shared Infrastructure                   │
│  PostgreSQL · Redis · S3/MinIO · Message Queue      │
└────────────────────────────────────────────────────┘
```

#### 数据库设计（PostgreSQL）

```sql
-- 租户表
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 会话表
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    channel VARCHAR(50) NOT NULL,
    context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 消息表
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id),
    tenant_id UUID REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(20) NOT NULL,  -- user/assistant/system
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 记忆表
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    embedding VECTOR(1536),  -- pgvector
    category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用量统计表
CREATE TABLE usage_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    model VARCHAR(100) NOT NULL,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    cost DECIMAL(10, 6),
    skill_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 策略（行级安全）
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON sessions
    USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

#### 优缺点分析

| 维度 | 评价 |
|------|------|
| **开发成本** | 极高，近乎重写 |
| **侵入性** | 极高，完全脱离原项目 |
| **安全性** | 高，数据库级 RLS + 服务级隔离 |
| **可维护性** | 独立演进，不依赖上游 |
| **扩展性** | 极好，各服务独立扩展 |
| **适用场景** | 大规模 SaaS 平台，10000+ 用户 |

---

## 五、三种方案对比

| 评估维度 | 方案一：应用层改造 | 方案二：容器化多实例 | 方案三：微服务重构 |
|---------|------------------|-------------------|------------------|
| 开发周期 | 2-3 个月 | 2-4 周 | 6-12 个月 |
| 团队规模 | 2-3 人 | 1-2 人 | 5-8 人 |
| 单用户成本 | 低 | 高（每人一容器） | 低 |
| 安全隔离 | 应用级 | OS 级 | 数据库级 |
| 最大用户数 | ~5000 | ~500 | 100000+ |
| 运维复杂度 | 中 | 中 | 高 |
| 上游兼容性 | 中（需持续 merge） | 高（不改代码） | 低（独立演进） |
| 推荐场景 | 团队/中小企业 | 小型团队/家庭 | 商业 SaaS 平台 |

---

## 六、推荐实施路径

### 阶段一：快速验证（第 1-4 周）

采用**方案二（容器化多实例）**快速上线 MVP：

1. 基于 Docker Compose 搭建编排层
2. 实现用户注册和实例自动创建
3. 使用 Traefik 做反向代理和自动 HTTPS
4. 每个用户分配独立 OpenClaw 容器
5. 简单的 Web Dashboard 管理用户和实例

### 阶段二：功能完善（第 5-12 周）

在 MVP 基础上，引入**方案一（应用层改造）**的核心要素：

1. 实现统一认证网关（OAuth 2.0 + JWT）
2. 添加 RBAC 权限系统
3. 接入 PostgreSQL 存储用户和用量数据
4. 实现 Token 用量统计和配额管理
5. 开发管理后台（用户管理、用量分析、配置管理）

### 阶段三：规模化（第 13-24 周）

根据用户增长情况，逐步向**方案三（微服务化）**演进：

1. 将 Agent 调用抽取为独立服务（支持多模型路由）
2. 记忆系统迁移到 PostgreSQL + pgvector
3. 实现消息队列解耦（RabbitMQ / Redis Streams）
4. 引入 Kubernetes 进行容器编排
5. 实现自动扩缩容和资源调度

---

## 七、关键技术决策点

### 7.1 认证方案选择

| 方案 | 优势 | 劣势 | 推荐度 |
|------|------|------|--------|
| 自建 JWT | 完全可控 | 开发和维护成本高 | ★★★ |
| Auth0/Clerk | 功能丰富，快速集成 | 有外部依赖和成本 | ★★★★ |
| Supabase Auth | 开源，与 PostgreSQL 深度集成 | 功能相对有限 | ★★★★★ |

### 7.2 记忆系统迁移

OpenClaw 当前基于 Markdown 文件的记忆系统在多用户场景下需要改造：

- **短期**：按用户目录隔离 Markdown 文件（与容器隔离方案天然契合）
- **中期**：引入 pgvector 实现数据库级记忆存储和语义搜索
- **长期**：构建分层记忆系统（工作记忆 / 短期记忆 / 长期记忆）

### 7.3 API Key 管理

多用户场景下的 LLM API Key 管理策略：

- **平台统一 Key**：平台方提供 API Key，按用户计量计费（SaaS 模式）
- **用户自带 Key（BYOK）**：用户提供自己的 API Key，平台不承担调用成本
- **混合模式**：平台提供基础额度，用户可绑定自己的 Key 获取更高配额

---

## 八、安全加固清单

多用户改造必须同步强化安全：

- [ ] **输入验证**：所有用户输入严格过滤，防止 Prompt Injection
- [ ] **会话隔离**：确保用户 A 永远无法访问用户 B 的会话和记忆
- [ ] **凭证加密**：API Key 等敏感信息使用 AES-256-GCM 加密存储
- [ ] **速率限制**：按用户/租户实施请求频率限制
- [ ] **审计日志**：记录所有敏感操作（配置变更、技能调用、数据访问）
- [ ] **技能沙箱**：限制技能的文件系统和网络访问范围
- [ ] **RBAC 强制执行**：所有 API 端点都必须经过权限检查
- [ ] **定期安全扫描**：使用 [OpenClaw Scanner](https://www.helpnetsecurity.com/2026/02/12/openclaw-scanner-open-source-tool-detects-autonomous-ai-agents/) 等工具持续监控

---

## 九、社区动态与生态参考

### 已有的多用户探索

- **ClawHost**：基于 Firebase Auth + PostgreSQL 的一键部署方案
- **NanoClaw**：500 行 TypeScript 实现的容器隔离轻量替代
- **openclaw-cn**：国内版，集成飞书/钉钉/企微，有一定多账号管理能力
- **阿里云/腾讯云一键部署**：云厂商提供了便捷的部署方案，但本质是单用户

### 社区讨论热度

- [Issue #8081](https://github.com/openclaw/openclaw/issues/8081)：多用户权限管理的 Feature Request，获得大量社区关注
- [Issue #12824](https://github.com/openclaw/openclaw/issues/12824)：安全增强讨论
- [Issue #10969](https://github.com/openclaw/openclaw/issues/10969)：中间件 Hook 方案，可用于模型路由

---

## 十、总结

OpenClaw 是一个极具潜力的开源 AI Agent 框架，但其"个人助手"的设计定位决定了它在多用户场景下存在先天不足。将其改造为多用户平台，需要在**认证授权、数据隔离、资源计量、安全加固**四个维度同时发力。

**核心建议**：

1. **不要急于重写**——先用容器化方案快速验证市场需求
2. **安全是第一优先级**——多用户场景下，任何隔离失败都是灾难性的
3. **紧跟上游社区**——OpenClaw 发展极快，官方可能很快推出多用户支持
4. **考虑商业化路径**——BYOK 模式降低平台成本，按功能/额度收费更合理

OpenClaw 的 MIT 许可证为商业化改造提供了充分的法律基础，而其活跃的社区生态（700+ 技能插件）则为多用户平台提供了丰富的功能扩展空间。抓住这个窗口期，有机会构建出一个有竞争力的 AI Agent SaaS 平台。

---

## 参考资料

- [OpenClaw GitHub 仓库](https://github.com/openclaw/openclaw)
- [OpenClaw 官方文档 - 认证](https://docs.openclaw.ai/gateway/authentication)
- [OpenClaw 官方文档 - 安全](https://docs.openclaw.ai/gateway/security)
- [OpenClaw 三层架构深度解析](https://eastondev.com/blog/en/posts/ai/20260205-openclaw-architecture-guide/)
- [OpenClaw 架构概览 - Paolo Perazzo](https://ppaolo.substack.com/p/openclaw-system-architecture-overview)
- [NanoClaw - 容器隔离方案](https://github.com/qwibitai/nanoclaw)
- [GitHub Issue #8081 - 多用户权限管理](https://github.com/openclaw/openclaw/issues/8081)
- [NanoClaw 解决 OpenClaw 安全问题 - VentureBeat](https://venturebeat.com/orchestration/nanoclaw-solves-one-of-openclaws-biggest-security-issues-and-its-already)
- [CISO 视角下的 OpenClaw 安全问题 - CSO Online](https://www.csoonline.com/article/4129867/what-cisos-need-to-know-about-clawdbot-i-mean-moltbot-i-mean-openclaw.html)
- [OpenClaw 安全风险 - Fortune](https://fortune.com/2026/02/12/openclaw-ai-agents-security-risks-beware/)
- [OpenClaw 核心特性与原理解析 - 知乎](https://zhuanlan.zhihu.com/p/2002364598624466607)
- [OpenClaw 工作原理解析 - 知乎](https://zhuanlan.zhihu.com/p/2002719503394567324)
