# Harness 详细介绍

## 一、公司概况

**Harness** 是一家总部位于美国旧金山的 AI 驱动软件交付平台公司，由 **Jyoti Bansal** 和 **Rishi Singh** 于 **2017 年**联合创立。

- **Jyoti Bansal** 此前创办了著名的应用性能监控公司 AppDynamics（2008 年创立），该公司在 2017 年 IPO 前一天被 Cisco 以 **37 亿美元**收购。离开 Cisco 后，Bansal 发现每 10-12 个工程师就需要额外一个人专门负责部署脚本、工具和故障排除，这催生了 Harness 的创建。
- **Rishi Singh**（CTO）此前在 Apple 担任了五年的 DevOps 平台架构师。

## 二、融资与估值

| 轮次 | 时间 | 金额 | 估值 |
|------|------|------|------|
| Series A | 2017.10 | $20M | — |
| Series C | 2021.01 | — | $17 亿 |
| Series D | 2022.04 | $230M | $37 亿 |
| Series E | 2025.12 | $240M | **$55 亿** |

Series E 由 Goldman Sachs 领投，总融资超过 **6.14 亿美元**。

## 三、核心产品矩阵

Harness 平台涵盖软件交付生命周期的各个环节：

### 1. Continuous Integration (CI) — 持续集成

- 利用 AI 驱动的 **Test Intelligence™** 技术，将测试周期加速 **80%**
- 智能缓存（Gradle、Bazel、Maven、Docker layers）
- 支持 Linux、Windows、macOS 多平台构建
- 集成任意 Git SCM（GitHub、GitLab、Bitbucket 等）

### 2. Continuous Delivery (CD) — 持续交付

- 预置部署模板：蓝绿（Blue/Green）、金丝雀（Canary）、滚动（Rolling）部署
- 支持 YAML 自定义 Pipeline 模板
- 可视化 Pipeline 控制和审批门（Approval Gates）

### 3. Feature Flags — 特性开关

- AI 辅助自动化特性标记
- 降低人为错误风险，提高运维效率

### 4. Cloud Cost Management (CCM) — 云成本管理

- 自动化成本优化与治理，最高可节省 **70%** 云费用
- 支持自然语言定义成本管控策略
- 实时云支出变化监控

### 5. Chaos Engineering — 混沌工程

- AI 根据系统约束自动推荐混沌实验
- 测试和提升系统弹性

### 6. Security Testing Orchestration (STO) — 安全测试编排

- 集成容器扫描、SAST、SCA、DAST 安全扫描器
- **软件供应链保障（SSCA）**：自动生成 SBOM 和认证，达到 SLSA L3 合规

### 7. Software Engineering Insights (SEI) — 软件工程洞察

- 对接 **40+** DevOps 工具，计算 **100+** 指标
- 完整的 **DORA 指标**支持：
  - Lead Time for Changes（变更前置时间）
  - Deployment Frequency（部署频率）
  - Mean Time to Restore（平均恢复时间）
  - Change Failure Rate（变更失败率）
- 支持 SPACE 等北极星指标框架

### 8. 其他模块

- **Service Reliability Management (SRM)** — 服务可靠性管理
- **Continuous Error Tracking** — 持续错误追踪
- **Code Repository** — 代码仓库
- **Internal Developer Portal (IDP)** — 内部开发者门户
- **Infrastructure as Code Management (IaCM)** — 基础设施即代码管理

## 四、AI 能力 — AIDA™

**AIDA（AI Development Assistant）** 是 Harness 的 AI 助手，贯穿整个软件交付生命周期：

- **Pipeline 生成**：用自然语言描述需求，自动生成 CI/CD Pipeline
- **错误诊断**：自动分析构建/部署失败原因并给出修复建议
- **安全修复**：识别漏洞并推荐补救方案
- **成本策略**：自然语言定义云成本管控策略
- **混沌实验**：AI 辅助设计混沌工程实验
- **对所有 Harness 客户免费开放**

2025 年底，Harness 进一步推出 **Agentic AI Software Delivery** 能力，被 Workday 等企业级客户选用。

## 五、开源项目

Harness 在开源方面有重要布局：

- **2020 年收购了 Drone.io**（知名开源 CI 工具），并承诺持续投入开源
- **Gitness**（原 Harness Open Source）：新一代开源开发平台，统一了代码托管、CI/CD Pipeline、托管开发环境和制品仓库
- 技术栈：**Go + Node.js**，支持所有 Go 支持的操作系统和架构
- GitHub 地址：[harness/harness](https://github.com/harness/harness)

## 六、行业地位

- Gartner Peer Insights 有评分和评价
- 2026 年报告显示：AI 编码加速了开发，但 DevOps 成熟度未能跟上，正是 Harness 解决的核心痛点
- 客户包括 Workday 等全球大型企业

---

## 参考来源

- [Harness 官网](https://www.harness.io)
- [Harness Platform 产品页](https://www.harness.io/products/platform)
- [Harness CI 概览 - Developer Hub](https://developer.harness.io/docs/continuous-integration/get-started/overview/)
- [Harness SEI 文档](https://developer.harness.io/docs/software-engineering-insights/)
- [Harness AIDA 介绍](https://www.harness.io/blog/introducing-harness-aidatm-ai-development-assistant-for-ai-infused-software-delivery)
- [Harness $5.5B 估值融资 - TechCrunch](https://techcrunch.com/2025/12/11/harness-hits-5-5b-valuation-with-240m-to-automate-ais-after-code-gap/)
- [Goldman Sachs 领投报道 - CNBC](https://www.cnbc.com/2025/12/11/harness-is-worth-5point5-billion-in-round-led-by-goldman-sachs.html)
- [Harness 创始故事 - Contrary Research](https://research.contrary.com/company/harness)
- [Harness Open Source - GitHub](https://github.com/harness/harness)
- [Harness 收购 Drone.io](https://www.harness.io/blog/harness-acquires-ci-pioneer-drone-io-and-commits-to-open-source)
