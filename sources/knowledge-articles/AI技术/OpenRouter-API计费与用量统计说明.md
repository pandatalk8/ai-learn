# OpenRouter API 计费与用量统计说明

> 来源：https://openrouter.ai/docs

---

## 一、计费方式

OpenRouter 采用**预充值积分（Credits）** 模式：

- 先充值购买 Credits（支持信用卡、加密货币 Coinbase）
- 每次 API 调用自动扣费，按模型的 token 单价计算
- 每个模型的价格不同，在模型列表页可以看到每百万 token 的输入/输出价格

### 费用构成

每次请求的 `usage` 对象中包含：

| 字段 | 含义 |
|------|------|
| `prompt_tokens` | 输入 token 数 |
| `completion_tokens` | 输出 token 数 |
| `cost` | 本次请求的总费用（从账户扣除的 Credits） |
| `completion_tokens_details.reasoning_tokens` | 推理 token（计入 completion 计费） |
| `prompt_tokens_details.cached_tokens` | 从缓存读取的 token |
| `prompt_tokens_details.cache_write_tokens` | 写入缓存的 token |
| `cost_details` | BYOK（自带密钥）请求的上游提供商成本 |

用量信息**自动包含在每个响应中**（流式返回时在最后一条 SSE 消息中），无需额外参数。

---

## 二、查询余额（API）

```
GET https://openrouter.ai/api/v1/credits
Authorization: Bearer <管理密钥>
```

返回：

```json
{
  "data": {
    "total_credits": 50.0,
    "total_usage": 12.35
  }
}
```

- `total_credits`：已购买的总积分
- `total_usage`：已使用的总积分
- 剩余余额 = `total_credits - total_usage`

> 注意：需要使用 **Management API Key**（非普通 API Key）。

### 代码示例

**Python：**

```python
import requests

url = "https://openrouter.ai/api/v1/credits"
headers = {"Authorization": "Bearer <token>"}
response = requests.get(url, headers=headers)
print(response.json())
```

**JavaScript：**

```javascript
const url = 'https://openrouter.ai/api/v1/credits';
const options = {
  method: 'GET',
  headers: { Authorization: 'Bearer <token>' },
};
const response = await fetch(url, options);
const data = await response.json();
console.log(data);
```

---

## 三、用量统计与导出

### Activity 页面（网页端）

在 OpenRouter 后台的 **Activity** 页面可以看到三个核心指标：

| 指标 | 说明 |
|------|------|
| **Spend** | 花费的 Credits（含 BYOK 估算费用） |
| **Tokens** | 输入 + 输出 token 总量 |
| **Requests** | 请求次数（含聊天室交互） |

支持的筛选维度：

- **时间范围**：1 小时 ~ 1 年
- **分组方式**：按模型、按 API Key、按组织成员

支持导出 **CSV** 或 **PDF** 报告。

### 通过 API 查询历史用量

可以通过 **Generation ID** 异步查询历史请求的详细用量，用于审计。

### BYOK 说明

BYOK（Bring Your Own Key）的花费估算基于市场价格，可能不反映你与提供商协商的折扣价。推理 token 计入 completion token 计费，导出报告中会显示多少 completion token 用于推理过程。

---

## 四、消费控制（Guardrails）

组织可以设置 **Guardrails** 来控制消费：

| 控制项 | 说明 |
|--------|------|
| **消费限额** | 按日/周/月设置 USD 上限，达到限额后拒绝请求 |
| **模型白名单** | 限制只能使用指定模型（留空则不限制） |
| **提供商白名单** | 限制只能用指定提供商（留空则不限制） |
| **零数据保留** | 强制不保留请求数据 |

### 分配层级

- **成员级别**：为组织成员设置基线，适用于其所有 API Key 和聊天室
- **API Key 级别**：在成员级别之上叠加更细粒度的控制

每人/每 Key 的预算独立计算，不共享额度。每个用户或 Key 只能直接分配一个 Guardrail。

### 多 Guardrail 叠加规则

- 提供商/模型白名单：取交集（最严格的生效）
- 零数据保留：OR 逻辑（任一 Guardrail 要求即生效）
- 预算：每个 Guardrail 独立检查

---

## 五、实用建议

- **实时监控费用**：每个 API 响应都自带 `cost` 字段，可以在代码中累加追踪
- **定期导出报表**：Activity 页面导出 CSV 做月度分析
- **设置消费上限**：用 Guardrails 防止意外超支
- **查余额脚本**：定时调用 `/api/v1/credits` 接口监控余额
- **零完成保险（Zero Completion Insurance）**：OpenRouter 提供保护，不会对失败或空响应收费
