# 精通 Claude Code 动态工作流：从原理到实战的高效使用指南

上周我做了一次代码安全审计。200 多个 API 端点，每个要检查认证、授权、输入校验、SQL 注入、XSS 五个维度。如果一个一个问 Claude，按每个端点 3 分钟算，大概要 17 个小时。

我写了一个 Workflow 脚本，18 分钟跑完。找到 47 个问题，其中 31 个经过对抗性验证后确认为真实漏洞。

这不是什么黑魔法。这是 Claude Code 里一个叫"动态工作流"（Workflow）的功能——它让你从"一个人问 Claude"变成"指挥一支 AI 团队并行作战"。但大多数人要么不知道这个功能，要么用错了场景，要么写出了低效甚至跑不起来的脚本。

这篇文章从底层原理讲起，到实战模式，到避坑指南，帮你真正用好这个工具。

---

## 一、Workflow 到底是什么

一句话：**Workflow 是一个 JavaScript 编排引擎，让你用代码控制多个 AI 子代理的调度、并发、数据流和质量验证。**

它和你平时用 Claude Code 聊天的区别，不是"功能更多"，而是"架构完全不同"。

普通对话是单线程的——你说一句，Claude 做一步，你再说一句，Claude 再做一步。哪怕你用 `/goal` 让 Claude 自动循环，本质上还是一个代理在串行工作。

Workflow 是多线程的。你写一个编排脚本，Claude 按照脚本的逻辑同时派出多个子代理，每个子代理独立执行任务、返回结果。脚本控制它们之间的依赖关系、数据传递和最终汇总。

用一张 ASCII 图来理解：

```
普通对话：
  你 → Claude → 你 → Claude → 你 → Claude → 结果
                                              （串行）

Workflow：
  脚本 → ┌ Agent 1 → 结果1 ┐
         ├ Agent 2 → 结果2 ├→ 汇总 → ┌ Verify 1 ┐→ 最终结果
         ├ Agent 3 → 结果3 ┤         └ Verify 2 ┘
         └ Agent 4 → 结果4 ┘        （并行验证）
                （并行执行）
```

**关键限制：**

- 最多同时运行 `min(16, CPU核心数 - 2)` 个代理——超出的自动排队
- 单个 Workflow 生命周期内最多创建 1000 个代理
- 脚本是纯 JavaScript，不是 TypeScript，不能用类型注解
- 脚本内不能直接读写文件，文件操作由子代理完成

---

## 二、五个核心原语：你的工具箱

整个 Workflow 系统只有五个核心 API。全部掌握，你就能编排任意复杂的任务。

### `agent(prompt, opts)` —— 派出一个子代理

```javascript
const result = await agent('检查 src/auth.ts 中是否存在未处理的认证绕过', {
  label: 'auth-check',
  phase: 'Review',
  schema: FINDINGS_SCHEMA
})
```

每次调用就是派出一个独立的 AI 代理。它有自己的上下文窗口，能读文件、写文件、跑命令。

`opts` 参数的几个关键选项：

| 选项 | 作用 | 什么时候用 |
|------|------|-----------|
| `label` | 在监控面板中显示的名称 | 永远都写，方便调试 |
| `phase` | 归属到哪个进度分组 | 在 pipeline/parallel 内部必须显式指定 |
| `schema` | JSON Schema，强制结构化输出 | 需要程序化处理返回值时 |
| `model` | 指定模型 | 轻量任务用 Haiku 省钱，默认继承主会话模型 |
| `isolation: 'worktree'` | 在独立 Git worktree 中执行 | 多个代理要同时改文件时 |
| `agentType` | 使用特定类型的子代理 | 需要特殊能力（如 Explore）时 |

**没有 `schema` 时，返回值是子代理最后一条文本消息（字符串）。有 `schema` 时，返回值是经过验证的 JSON 对象。** 后者在编排中更可靠，因为你可以直接 `.findings.map(...)` 而不用担心格式问题。

### `pipeline(items, stage1, stage2, ...)` —— 流水线，默认选择

```javascript
const results = await pipeline(
  files,
  file => agent(`审查 ${file} 的安全性`, { schema: REVIEW_SCHEMA }),
  (review, file) => agent(`验证 ${file} 中发现的问题: ${JSON.stringify(review.findings)}`, { schema: VERIFY_SCHEMA })
)
```

这是最重要的 API，也是最容易用错的。

`pipeline` 的核心特性：**阶段之间没有屏障（no barrier）。** 文件 A 在第二阶段验证时，文件 B 可能还在第一阶段审查。快的先走，慢的不影响。

每个阶段的回调函数签名是 `(prevResult, originalItem, index)`。第二个参数是原始输入项，第三个是索引——在后续阶段中用它来标记工作，不需要把原始数据通过第一阶段的返回值传递。

### `parallel(thunks)` —— 并发屏障，谨慎使用

```javascript
const [bugs, perf, security] = await parallel([
  () => agent('查找 bug...', { schema: BUGS_SCHEMA }),
  () => agent('查找性能问题...', { schema: PERF_SCHEMA }),
  () => agent('查找安全漏洞...', { schema: SECURITY_SCHEMA }),
])
```

`parallel` 是一个**屏障（barrier）**——它等所有任务完成后才返回。如果 5 个任务中 4 个 30 秒跑完，1 个要 3 分钟，你就白等了 2 分半。

**任何一个 thunk 抛错，对应位置返回 `null`，不会中断其他任务。** 所以后续处理一定要 `.filter(Boolean)`。

### `phase(title)` 和 `log(message)` —— 进度追踪

```javascript
phase('Review')
log('开始审查 47 个文件...')
// ... agent 调用 ...
phase('Verify')
log('发现 23 个问题，开始对抗性验证...')
```

`phase` 在 `/workflows` 监控面板中创建分组，`log` 发送进度消息。不影响逻辑，但对调试和监控至关重要。

---

## 三、pipeline vs parallel：90% 的人用错了

这是 Workflow 中最关键的设计决策，值得单独拉出来讲。

**默认用 `pipeline`。只有当你确实需要"拿到所有结果后才能做下一步"时，才用 `parallel` 做屏障。**

什么情况下需要屏障？三种：

1. **去重**——你必须拿到所有审查结果，才能判断哪些发现是重复的
2. **全量统计**——"如果 bug 总数为 0，跳过验证阶段"
3. **交叉引用**——验证阶段的 prompt 需要引用"其他代理的发现"做比较

什么情况下**不需要**屏障？

- "我想先 map 一下再传给下一个阶段"——在 pipeline 的 stage 内部做
- "两个阶段逻辑上是分开的"——逻辑分开不等于需要同步
- "看起来代码更整齐"——屏障的延迟代价是真实的

一个反面教材：

```javascript
// ❌ 错误：不必要的屏障
const reviews = await parallel(
  files.map(f => () => agent(`审查 ${f}`))
)
const verified = await parallel(
  reviews.filter(Boolean).map(r => () => agent(`验证 ${r}`))
)
```

这段代码的问题是：第一个 `parallel` 会等所有文件审查完毕，然后才开始第二轮验证。如果有 50 个文件，最快的 10 秒完成，最慢的 2 分钟——那 10 秒完成的那个白等了近 2 分钟。

正确写法：

```javascript
// ✅ 正确：pipeline，快的先走
const results = await pipeline(
  files,
  f => agent(`审查 ${f}`, { schema: REVIEW_SCHEMA }),
  (review, f) => parallel(
    review.findings.map(finding => () =>
      agent(`验证: ${finding.title}`, { schema: VERDICT_SCHEMA })
    )
  )
)
```

审查完一个文件就立刻开始验证它的发现，不等其他文件。墙钟时间（wall-clock time）等于最慢的那条链路，而不是所有链路之和。

---

## 四、结构化输出：让数据在代理之间可靠流动

子代理的默认返回值是一段自由文本。在简单场景下够用，但在多阶段编排中，你需要的是可编程的数据结构。

这就是 `schema` 选项的用途。

```javascript
const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          line: { type: 'number' },
          severity: { enum: ['low', 'medium', 'high', 'critical'] },
          title: { type: 'string' },
          description: { type: 'string' }
        },
        required: ['file', 'line', 'severity', 'title']
      }
    }
  },
  required: ['findings']
}

const result = await agent('审查 src/api/ 目录的安全性', {
  schema: FINDINGS_SCHEMA
})

// result.findings 是一个数组，可以直接 .map() .filter()
console.log(result.findings.length) // 数字，不是"我发现了 5 个问题"这样的文本
```

**底层原理：** 当你传入 `schema`，子代理的系统提示会被追加一条 `StructuredOutput` 指令，强制它通过一个特殊的工具调用来返回结果。返回值在工具层做 JSON Schema 验证——不匹配时模型会自动重试，而不是悄悄返回错误格式。

**什么时候用 schema，什么时候不用？**

| 场景 | 是否用 schema |
|------|--------------|
| 结果要传给下一阶段处理 | 用 |
| 结果要做统计、过滤、去重 | 用 |
| 最终结果直接展示给人看 | 不用 |
| 探索性任务，不确定会返回什么 | 不用 |

---

## 五、六种质量保障模式

Workflow 的真正威力不在于"快"，而在于"准"。通过编排多个独立代理交叉验证，你可以大幅降低 AI 幻觉和误判的概率。

### 模式一：对抗性验证（Adversarial Verify）

最常用。每个发现派 3 个独立的"怀疑者"去尝试反驳。多数反驳成功就淘汰。

```javascript
const votes = await parallel(
  Array.from({ length: 3 }, () => () =>
    agent(`尝试反驳这个发现: ${claim}。如果你无法确认它是真实的，默认为 refuted=true`, {
      schema: { type: 'object', properties: { refuted: { type: 'boolean' }, reason: { type: 'string' } }, required: ['refuted'] }
    })
  )
)
const survives = votes.filter(Boolean).filter(v => !v.refuted).length >= 2
```

**适用场景：** 代码审计、bug 搜索、安全扫描——任何"宁可漏报不可误报"的场景。

### 模式二：多视角验证（Perspective-diverse Verify）

和对抗性验证的区别是，每个验证者关注不同维度，而不是做同一件事。

```javascript
const lenses = ['correctness', 'security', 'performance', 'reproducibility']
const verdicts = await parallel(
  lenses.map(lens => () =>
    agent(`从 ${lens} 角度验证这个发现: ${finding.title}`, { schema: VERDICT_SCHEMA })
  )
)
```

**适用场景：** 发现可能从多个角度失败时。比如一个 API 变更，可能在正确性上没问题，但在性能或安全性上有隐患。

### 模式三：评审团（Judge Panel）

N 个代理从不同角度独立设计方案，再用评审打分，取最优。

```javascript
const proposals = await parallel([
  () => agent('用最简方案设计这个功能...'),
  () => agent('用最安全的方案设计这个功能...'),
  () => agent('用性能最优的方案设计这个功能...'),
])

const winner = await agent(
  `评估以下三个方案，选出最优并综合其他方案的优点: ${JSON.stringify(proposals.filter(Boolean))}`,
  { schema: FINAL_DESIGN_SCHEMA }
)
```

**适用场景：** 设计决策、方案选型——解空间大、没有标准答案的问题。

### 模式四：穷尽搜索（Loop-until-dry）

持续派代理搜索，直到连续 K 轮没有新发现为止。

```javascript
const seen = new Set()
const allBugs = []
let dryRounds = 0

while (dryRounds < 2) {
  const result = await agent('查找代码库中的 bug，重点关注之前没发现的边界情况', {
    schema: BUGS_SCHEMA
  })
  const fresh = result.bugs.filter(b => !seen.has(`${b.file}:${b.line}`))
  if (!fresh.length) { dryRounds++; continue }
  dryRounds = 0
  fresh.forEach(b => seen.add(`${b.file}:${b.line}`))
  allBugs.push(...fresh)
  log(`已发现 ${allBugs.length} 个 bug，继续搜索...`)
}
```

**适用场景：** 你不知道问题有多少个，需要尽可能全覆盖。

### 模式五：多模态扫描（Multi-modal Sweep）

不同代理用不同搜索策略并行扫描，覆盖单一策略的盲区。

```javascript
const findings = await parallel([
  () => agent('按文件类型搜索安全问题：重点 .ts/.tsx 文件'),
  () => agent('按数据流搜索安全问题：追踪用户输入到数据库的路径'),
  () => agent('按依赖搜索安全问题：检查第三方包的已知漏洞'),
  () => agent('按配置搜索安全问题：检查环境变量和密钥管理'),
])
```

**适用场景：** 搜索问题本身有多个维度，一种搜索方式不可能找到所有问题。

### 模式六：完备性批评（Completeness Critic）

最后一个代理专门问"还有什么遗漏"。

```javascript
const critic = await agent(
  `审查以下发现列表，指出: 1) 哪些搜索维度没有覆盖到 2) 哪些声明没有被验证 3) 哪些源文件没有被阅读。发现列表: ${JSON.stringify(confirmed)}`,
  { schema: GAPS_SCHEMA }
)

if (critic.gaps.length > 0) {
  // 用 gaps 驱动下一轮搜索
}
```

**适用场景：** 作为任何其他模式的收尾环节，防止"看起来全面，实际有盲区"。

---

## 六、预算控制：别让 Workflow 烧穿你的账单

一个没有预算意识的 Workflow 可以在几分钟内消耗掉你一天的 Token 额度。

Claude Code 提供了 `budget` 全局对象来控制消耗：

```javascript
// 动态循环：预算耗尽就停
while (budget.total && budget.remaining() > 50000) {
  const result = await agent('继续搜索 bug...', { schema: BUGS_SCHEMA })
  bugs.push(...result.bugs)
  log(`已发现 ${bugs.length} 个，剩余预算 ${Math.round(budget.remaining() / 1000)}k tokens`)
}

// 动态规模：根据预算决定并发数
const fleetSize = budget.total ? Math.floor(budget.total / 100000) : 5
```

几个关键数字：

| 指标 | 说明 |
|------|------|
| `budget.total` | 用户设定的 Token 预算上限，没设定时为 `null` |
| `budget.spent()` | 已消耗的输出 Token 数（主会话 + 所有 Workflow 共享） |
| `budget.remaining()` | 剩余预算，没设上限时返回 `Infinity` |

**重要：`budget.total` 为 `null` 时 `remaining()` 返回 `Infinity`。** 如果你写 `while (budget.remaining() > 50000)`，没设预算的情况下会一直跑到 1000 个代理的上限。一定要先判断 `budget.total` 是否存在。

---

## 七、脚本编写的十个避坑指南

### 1. `meta` 必须是纯字面量

```javascript
// ❌ 报错
const name = 'my-workflow'
export const meta = { name, description: '...' }

// ✅ 正确
export const meta = { name: 'my-workflow', description: '...' }
```

`meta` 对象不能用变量、函数调用、展开运算符或模板字符串。

### 2. 不能用 TypeScript 语法

```javascript
// ❌ 报错
const files: string[] = ['a.ts', 'b.ts']
interface Finding { file: string; line: number }

// ✅ 正确
const files = ['a.ts', 'b.ts']
// 用 JSON Schema 替代 interface
```

### 3. 不能用 `Date.now()`、`Math.random()`、`new Date()`

这三个 API 被禁用，因为它们会破坏 Workflow 的恢复机制（resume）。如果需要时间戳，通过 `args` 传入；如果需要随机性，用索引来区分代理。

### 4. `parallel` 中任何一个 thunk 失败不会中断其他任务

返回数组中对应位置是 `null`。**后续处理一定要 `.filter(Boolean)`。**

```javascript
const results = await parallel(tasks.map(t => () => agent(t)))
const valid = results.filter(Boolean) // 去掉失败的
```

### 5. `pipeline` 中某个 item 的某个 stage 抛错，该 item 整条链路终止

其他 item 不受影响，但该 item 在结果数组中是 `null`。

### 6. 在 `pipeline` / `parallel` 内部用 `phase` 会出现竞态

多个代理并发执行时，`phase()` 是全局状态。用 `opts.phase` 显式指定：

```javascript
// ❌ 竞态风险
phase('Review')
await pipeline(files, f => agent(`审查 ${f}`))

// ✅ 显式指定
await pipeline(files, f => agent(`审查 ${f}`, { phase: 'Review' }))
```

### 7. `args` 参数要传 JSON 值，不是 JSON 字符串

在 Workflow 工具调用中：

```javascript
// ❌ args 是字符串，脚本里 args.map 会报错
args: "[\"a.ts\", \"b.ts\"]"

// ✅ args 是数组
args: ["a.ts", "b.ts"]
```

### 8. Worktree 隔离很贵，只在必要时用

每个 worktree 需要约 200-500ms 创建时间加磁盘开销。**只有当多个代理需要同时修改文件时才用。** 只读任务（审查、搜索）不需要。

### 9. 子 Workflow 只支持一层嵌套

`workflow()` 内部再调 `workflow()` 会抛错。如果你的编排逻辑需要更深的层次，把它拍平成一个脚本。

### 10. 不要在 log 中遗漏截断信息

如果你的 Workflow 做了采样（只取 Top N、跳过某些文件），用 `log()` 明确告诉用户跳过了什么。否则"发现 0 个问题"和"只看了 5% 的代码发现 0 个问题"是完全不同的含义。

---

## 八、什么场景该用 Workflow

### 适合的场景

**大规模代码审计。** 200 个文件的安全审查、权限检查、API 一致性验证——一个代理要跑几个小时，十几个代理并行可以在分钟级别完成。

**跨文件迁移。** 把 500 个文件从旧 API 迁移到新 API。用 pipeline 处理每个文件，每个文件独立走"分析→修改→验证"三个阶段。用 `isolation: 'worktree'` 避免多个代理同时写同一个文件冲突。

**深度研究。** 一个复杂问题从多个搜索角度并行调研，交叉验证信息源的可靠性，最后综合成一份报告。内置的 `/deep-research` 就是这个模式。

**方案评估。** 一个设计问题让多个代理从不同角度（性能优先、安全优先、简洁优先）独立出方案，再用评审团综合。

**回归测试分析。** CI 挂了 47 个测试？并行分析每个失败，分类（真实 bug vs 环境问题 vs 依赖更新），去重后给出修复建议。

### 不适合的场景

**简单的单文件修改。** 改一个函数、修一个 bug——直接和 Claude 对话就行，上 Workflow 是杀鸡用牛刀。

**需要人工介入的交互式任务。** Workflow 是批处理模式，中间不等你确认。如果每一步都需要你判断"往左还是往右"，它帮不了你。

**结果高度依赖上下文连贯性的任务。** 写一篇长文章、设计一个复杂的系统架构文档——这些需要一个代理从头到尾维持上下文连贯性。并行拆开写再拼接，几乎一定质量下降。

**数据量小于 5 个独立单元的任务。** 并行的收益来自规模。3 个文件的审查，串行也就多花一两分钟，但 Workflow 的脚本编写、审批、调度开销是固定的。

**你对结果没有验证手段的任务。** Workflow 可以做对抗性验证，但前提是问题本身是可验证的。"这段代码的设计是否优雅"——没有客观标准，验证代理和生成代理一样不可靠。

---

## 九、实战：一个完整的安全审计 Workflow

把前面讲的所有概念串起来，看一个完整的例子：

```javascript
export const meta = {
  name: 'security-audit',
  description: '多维度安全审计：扫描、验证、评估、报告',
  phases: [
    { title: 'Scan', detail: '多模态并行扫描' },
    { title: 'Dedup', detail: '跨维度去重' },
    { title: 'Verify', detail: '对抗性验证每个发现' },
    { title: 'Report', detail: '生成最终报告' },
  ],
}

const FINDING_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          line: { type: 'number' },
          category: { enum: ['injection', 'auth', 'xss', 'exposure', 'misc'] },
          severity: { enum: ['low', 'medium', 'high', 'critical'] },
          title: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['file', 'line', 'category', 'severity', 'title'],
      },
    },
  },
  required: ['findings'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    isReal: { type: 'boolean' },
    confidence: { enum: ['low', 'medium', 'high'] },
    reason: { type: 'string' },
  },
  required: ['isReal', 'reason'],
}

// ---- 阶段一：多模态扫描 ----
phase('Scan')
const scanDimensions = [
  { key: 'input', prompt: '追踪所有用户输入（URL参数、请求体、header），检查是否经过校验后才进入业务逻辑' },
  { key: 'auth', prompt: '检查每个 API 端点是否有正确的认证和授权中间件' },
  { key: 'deps', prompt: '检查 package.json 中的依赖是否有已知的安全漏洞（CVE）' },
  { key: 'config', prompt: '检查环境变量、密钥、配置文件中是否有敏感信息硬编码或泄露风险' },
]

const scanResults = await parallel(
  scanDimensions.map(d => () =>
    agent(d.prompt, { label: `scan:${d.key}`, phase: 'Scan', schema: FINDING_SCHEMA })
  )
)
// 这里用 parallel 是正确的——需要拿到全部结果才能去重

// ---- 阶段二：去重 ----
phase('Dedup')
const allFindings = scanResults.filter(Boolean).flatMap(r => r.findings)
const seen = new Set()
const unique = allFindings.filter(f => {
  const key = `${f.file}:${f.line}:${f.category}`
  if (seen.has(key)) return false
  seen.add(key)
  return true
})
log(`扫描完成：发现 ${allFindings.length} 个问题，去重后 ${unique.length} 个`)

// ---- 阶段三：对抗性验证（用 pipeline，快的先走）----
phase('Verify')
const verified = await pipeline(
  unique,
  (finding) => parallel(
    Array.from({ length: 3 }, (_, i) => () =>
      agent(
        `你是安全审计的怀疑者 #${i + 1}。尝试反驳以下发现——它可能是误报吗？有没有实际的防护措施已经处理了这个问题？\n\n发现：${JSON.stringify(finding)}`,
        { label: `verify:${finding.file}:L${finding.line}`, phase: 'Verify', schema: VERDICT_SCHEMA }
      )
    )
  ).then(votes => {
    const validVotes = votes.filter(Boolean)
    const realCount = validVotes.filter(v => v.isReal).length
    return realCount >= 2 ? { ...finding, verified: true, votes: validVotes } : null
  })
)

const confirmed = verified.filter(Boolean)
log(`验证完成：${unique.length} 个发现中 ${confirmed.length} 个确认为真实问题`)

// ---- 阶段四：生成报告 ----
phase('Report')
const report = await agent(
  `根据以下经过验证的安全发现，生成一份结构化的安全审计报告。按严重程度排序，给出修复建议。\n\n${JSON.stringify(confirmed)}`,
  { label: 'report', phase: 'Report' }
)

return { totalScanned: allFindings.length, confirmed: confirmed.length, report }
```

这个脚本的设计逻辑：

1. **扫描阶段用 `parallel`**——因为去重需要全部结果
2. **去重用纯 JavaScript**——不需要 AI，代码就能做
3. **验证阶段用 `pipeline`**——每个发现独立验证，快的先走
4. **每个发现用 3 个对抗性验证者**——2/3 多数通过才算确认
5. **最终报告用单个代理**——需要全局视角的汇总

---

## 十、触发 Workflow 的四种方式

你不需要手写脚本。大多数情况下，Claude 会自动生成。

**方式一：在提示词中加 `ultracode` 关键词。**

```
ultracode: 审计 src/ 下所有 API 的权限检查
```

Claude 自动判断需要 Workflow，生成脚本并展示给你审批。

**方式二：自然语言请求。**

```
用 workflow 并行审查这次 PR 的所有改动文件
```

只要你明确提到"workflow"或"多代理"，Claude 就会启动编排。

**方式三：开启 ultracode 模式。**

```
/effort ultracode
```

之后 Claude 对所有复杂任务自动启用 Workflow，不需要每次都说。

**方式四：调用已保存的 Workflow。**

在 `/workflows` 监控面板里按 `s` 保存后，就变成了一个斜杠命令，随时可以调用。

---

## 写在最后

Workflow 是 Claude Code 里最强大也最容易被误用的功能。它的价值不在于"可以同时跑很多代理"，而在于**你可以用代码精确控制 AI 的协作模式**——谁和谁并行，谁验证谁，什么条件下停止，什么数据在代理之间流动。

记住两条原则就够了：**默认用 pipeline，只在需要全量结果时用 parallel；永远对 AI 的输出做对抗性验证，而不是无条件信任。**
