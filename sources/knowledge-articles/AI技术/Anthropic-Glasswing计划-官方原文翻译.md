# Project Glasswing：为 AI 时代守护关键软件安全

> 原文来源：https://www.anthropic.com/glasswing
> 翻译日期：2026-04-08

## 开篇

今天，我们宣布启动 **Project Glasswing（玻璃翅膀计划）**——一项全新倡议，联合 Amazon Web Services、Anthropic、Apple、Broadcom、Cisco、CrowdStrike、Google、JPMorganChase、Linux 基金会、Microsoft、NVIDIA 和 Palo Alto Networks，共同保护全球最关键的软件基础设施。

## 项目命名

"Glasswing"取自玻璃翅蝶（*Greta oto*）。这个比喻有双重含义：玻璃翅蝶透明的翅膀让它能够隐匿于环境中——正如那些隐藏在代码深处的漏洞；同时，"透明"也象征着 Anthropic 在发现与披露漏洞时所秉持的公开态度。

## Claude Mythos Preview 模型

Anthropic 开发了 **Claude Mythos Preview**——一个前沿 AI 模型，展现出前所未有的代码能力。该模型在识别软件漏洞方面的水平已接近甚至超越顶级人类安全研究员。

### 已发现的重大漏洞

该模型已自主发现了数千个高严重性零日漏洞，涵盖主流操作系统和浏览器，包括：

- **OpenBSD 27 年老漏洞**：可被远程利用导致系统崩溃
- **FFmpeg 16 年老漏洞**：自动化测试工具对其执行了 500 万次测试均未发现
- **Linux 内核多漏洞链**：可被串联利用实现权限提升

### 性能指标

在 CyberGym 漏洞复现基准测试中，Mythos Preview 达到 **83.1%** 的准确率，大幅超越 Claude Opus 4.6 的 66.6%。

Microsoft 的 EVP 网络安全负责人 Igor Tsyganskiy 表示："在我们的开源安全基准 CTI-REALM 上测试时，Claude Mythos Preview 展现出了显著的提升。"

## 合作伙伴与参与方

### 12 家核心启动合作伙伴

Amazon Web Services、Anthropic、Apple、Broadcom、Cisco、CrowdStrike、Google、JPMorganChase、Linux 基金会、Microsoft、NVIDIA、Palo Alto Networks。

此外，还有超过 **40 家**维护关键软件基础设施的组织获得了访问权限。

### 合作伙伴反馈

**Cisco（高级副总裁兼首席安全与信任官 Anthony Grieco）：**

> "AI 的能力已经跨越了一个门槛，从根本上改变了保护关键基础设施免受网络威胁所需的紧迫性——这是不可逆的。"

**AWS（副总裁兼 CISO Amy Herzog）：**

> "安全对我们来说不是一个阶段，而是持续嵌入到一切工作中的。"

**CrowdStrike（CTO Elia Zaitsev）：**

> "从漏洞被发现到被攻击者利用之间的窗口已经坍塌——过去需要几个月，现在借助 AI 只需几分钟。"

**Linux 基金会（CEO Jim Zemlin）：**

> "Project Glasswing 为改变这一格局提供了一条可信的路径。"

## 资金投入

Anthropic 提供以下资源支持：

| 项目 | 金额 |
|------|------|
| 模型使用额度（面向参与组织） | 最高 **1 亿美元** |
| Alpha-Omega 和 OpenSSF（通过 Linux 基金会） | **250 万美元** |
| Apache 软件基金会 | **150 万美元** |

## 模型定价与可用性

Claude Mythos Preview 定价：

- 输入：**$25** / 百万 token
- 输出：**$125** / 百万 token

可通过 Claude API、Amazon Bedrock、Google Cloud Vertex AI 和 Microsoft Foundry 访问。

## 应用场景

合作伙伴将利用该模型进行：

- 漏洞检测与发现
- 二进制测试
- 端点安全防护
- 渗透测试

## 90 天公开报告承诺

在启动后 90 天内，Anthropic 将公开报告：

1. 项目期间的发现与学习成果
2. 已修复的漏洞和可披露的安全改进
3. 与安全组织合作制定的 AI 时代网络安全实践建议

这些建议将涵盖漏洞披露流程、软件更新机制、供应链安全和补丁自动化等方面。

## 安全保障措施

- Mythos Preview 将**不会**面向公众开放，保持为研究预览版本
- 未来的 Claude Opus 版本将内置安全防护机制，检测并阻止模型最危险的输出
- 已发现的许多漏洞已被修补；尚未修复的漏洞通过加密哈希方式进行了负责任披露
- 受模型安全措施影响的安全专业人员可申请加入 **Cyber Verification Program（网络验证计划）**

## 国家安全与政府合作

Anthropic 明确表示：

- 保护关键基础设施是民主国家的**首要国家安全优先事项**
- 美国及其盟友必须保持决定性的 AI 技术领先优势
- Anthropic 愿意与地方、州和联邦层面的代表合作，评估和缓解国家安全风险

## 行业号召

Anthropic 邀请其他 AI 行业成员共同参与，帮助制定行业标准，并建议最终可由一个**独立的第三方机构**来协调大规模网络安全项目。

## 时间线

- **2026 年 4 月**：正式宣布
- 合作伙伴已提前数周获得早期访问权限
- 90 天公开报告窗口自宣布之日起计算
