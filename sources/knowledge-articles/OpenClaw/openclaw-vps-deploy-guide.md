# 手把手教你在 VPS 上部署 OpenClaw：打造 24/7 在线的私人 AI 助理

## 为什么要把 OpenClaw 丢到 VPS 上？

OpenClaw 跑在你的笔记本上，合盖就断、断网就停。

而一个真正的"个人 AI 助理"应该：
- **24/7 在线**——你凌晨 3 点发条消息，它也在
- **主动联系你**——晨报、提醒、告警，不需要你先开口
- **记忆永不丢失**——对话、偏好、跟踪事项全在服务器上

一台 **$5/月的 VPS** 就能搞定这一切。

本文会带你从零开始，在一台全新的 Linux VPS 上把 OpenClaw 跑起来，连上 Telegram，让你拥有一个住在聊天软件里的私人 AI 助理。

---

## 你需要准备什么

| 项目 | 说明 |
|------|------|
| 一台 VPS | 最低 2GB RAM，推荐 4GB。Ubuntu 22.04/24.04 |
| SSH 工具 | Mac/Linux 自带终端，Windows 用 PowerShell 或 PuTTY |
| Telegram 账号 | 用来连接 OpenClaw（也可以选 WhatsApp/Slack/Discord） |
| LLM API Key | Anthropic / OpenAI / OpenRouter 任选一个 |
| 约 30 分钟 | 跟着做就行 |

### VPS 怎么选？

| 服务商 | 最低配置 | 月费 | 特点 |
|--------|---------|------|------|
| Hetzner | 2C/4GB | ~€4.5 | 欧洲节点，性价比之王 |
| DigitalOcean | 1C/2GB | $6 | 一键部署，新手友好 |
| Vultr | 1C/2GB | $6 | 全球节点多 |
| Oracle Cloud | 4C/24GB ARM | 免费 | 永久免费层，但抢机器靠运气 |
| Racknerd | 2C/2GB | ~$3 | 便宜，黑五常有特价 |

**推荐**：Hetzner 的 4GB 方案，或者 Oracle Cloud 免费 ARM 实例（如果你能抢到的话）。

---

## 第一步：初始化 VPS

拿到 VPS 的公网 IP 和密码后，SSH 登录：

```bash
ssh root@你的VPS公网IP
```

### 1.1 更新系统

```bash
apt update && apt upgrade -y
```

如果提示内核更新，重启一下：

```bash
reboot
```

等 30 秒后重新 SSH 登录。

### 1.2 创建专用用户（不要用 root 跑 OpenClaw）

```bash
# 创建用户
adduser openclaw
# 给 sudo 权限
usermod -aG sudo openclaw
# 切换到新用户
su - openclaw
```

为什么不用 root？
- 安全性：最小权限原则
- 兼容性：有些工具在 root 下表现异常
- OpenClaw 官方也建议用普通用户

### 1.3 配置 SSH 密钥登录（推荐）

在你的**本地电脑**上操作：

```bash
# 如果你还没有 SSH 密钥
ssh-keygen -t ed25519

# 把公钥复制到 VPS
ssh-copy-id openclaw@你的VPS公网IP
```

然后在 VPS 上禁用密码登录：

```bash
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

---

## 第二步：安全加固

这一步很多教程会跳过，但 OpenClaw 是一个能执行命令的 AI Agent——**安全不是可选项**。

### 2.1 配置防火墙

```bash
sudo apt install -y ufw

sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw --force enable

sudo ufw status
```

只开 SSH 端口就够了。OpenClaw 不需要对外暴露任何端口——它通过 Telegram Bot API 主动连接 Telegram 服务器，不需要入站流量。

### 2.2 安装 Fail2Ban（防暴力破解）

```bash
sudo apt install -y fail2ban

sudo tee /etc/fail2ban/jail.local > /dev/null << 'EOF'
[sshd]
enabled = true
port = ssh
maxretry = 3
bantime = 3600
findtime = 600
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2.3 开启自动安全更新

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 第三步：安装依赖

### 3.1 安装 Node.js 22+

OpenClaw 需要 Node.js 22 或更高版本：

```bash
# 使用 NodeSource 安装
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# 验证
node -v   # 应该显示 v22.x.x
npm -v
```

### 3.2 安装 pnpm

```bash
npm install -g pnpm

# 验证
pnpm -v
```

### 3.3 安装其他常用工具

```bash
sudo apt install -y git curl wget build-essential
```

---

## 第四步：安装 OpenClaw

有两种安装方式，任选其一。

### 方式一：一键安装（推荐新手）

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

安装完成后运行引导向导：

```bash
openclaw onboard --install-daemon
```

### 方式二：从源码安装（推荐折腾党）

```bash
# 克隆仓库
git clone https://github.com/nicepkg/openclaw.git
cd openclaw

# 安装依赖
pnpm install

# 构建
pnpm run build

# 安装 Web UI
pnpm run ui:install
```

从源码安装的好处：
- 能拿到最新功能
- 更新就是 `git pull && pnpm install && pnpm run build`
- 方便你改代码、贡献社区

---

## 第五步：引导配置（Onboarding）

运行引导向导：

```bash
openclaw onboard
```

向导会引导你完成以下配置：

### 5.1 选择 AI 模型提供商

向导会问你用哪个 LLM。常见选择：

| Provider | 推荐模型 | 说明 |
|----------|---------|------|
| Anthropic | Claude Sonnet 4.5 | 综合能力最强，推荐首选 |
| OpenAI | GPT-4o | 速度快，性价比高 |
| OpenRouter | 多模型切换 | 一个 Key 用多家模型 |
| Ollama | Llama 3.1 8B | 本地运行，零 API 费用（但需要更大内存） |

输入你的 API Key 即可。

> **省钱提示**：如果你有 Claude Code 订阅（$20/月），可以直接用它作为 Agent 后端，不需要额外的 API Key。在 VPS 上登录时，它会给你一个链接和授权码——在本地浏览器打开链接，拿到 code，回 VPS 粘贴即可。

### 5.2 选择聊天平台

向导会问你要连接哪个平台。本文以 **Telegram** 为例（最简单）。

### 5.3 设置工作区

向导会初始化 `~/.openclaw/workspace/`，这是 OpenClaw 的"大脑目录"：

```
~/.openclaw/workspace/
├── AGENTS.md      # Agent 的角色定义
├── SOUL.md        # 性格和沟通风格
├── TOOLS.md       # 可用工具策略
├── IDENTITY.md    # 身份信息
├── USER.md        # 关于你的信息
├── MEMORY.md      # 长期记忆
└── memory/        # 每日对话日志
```

---

## 第六步：连接 Telegram

### 6.1 创建 Telegram Bot

1. 在 Telegram 里搜索 **@BotFather**
2. 发送 `/newbot`
3. 给 Bot 起个名字（随便取）
4. 给 Bot 起个用户名（必须以 `bot` 结尾，比如 `my_openclaw_bot`）
5. BotFather 会给你一个 **Bot Token**，类似：`7123456789:AAHxxxxxxxxxxxxxxxxxxxxx`

### 6.2 把 Token 填入 OpenClaw

在引导向导里粘贴 Token，或者直接编辑配置文件：

```bash
nano ~/.openclaw/openclaw.json
```

在 channels 部分添加：

```json
{
  "channels": [
    {
      "type": "telegram",
      "token": "你的Bot_Token"
    }
  ]
}
```

### 6.3 启动并配对

启动 OpenClaw：

```bash
openclaw gateway start
```

然后在 Telegram 里给你的 Bot 发一条消息。它会回复一个**配对请求**。

回到 VPS 终端，批准配对：

```bash
openclaw pairing approve <配对码>
```

**这一步非常重要**：配对机制确保只有你能控制这个 Bot。即使别人找到你的 Bot 发消息，也会被拒绝。

配对成功后，试试发一条消息——如果它回复了，恭喜，你的 AI 助理上线了。

---

## 第七步：让 OpenClaw 常驻后台

SSH 断开后 OpenClaw 不能停。我们需要把它注册为系统服务。

### 方式一：用 OpenClaw 自带的 daemon 模式

```bash
openclaw gateway start --daemon
```

### 方式二：用 systemd（更可靠）

创建 service 文件：

```bash
sudo tee /etc/systemd/system/openclaw.service > /dev/null << 'EOF'
[Unit]
Description=OpenClaw AI Gateway
After=network.target

[Service]
Type=simple
User=openclaw
WorkingDirectory=/home/openclaw
ExecStart=/usr/local/bin/openclaw gateway start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
```

启用并启动：

```bash
sudo systemctl daemon-reload
sudo systemctl enable openclaw
sudo systemctl start openclaw

# 查看状态
sudo systemctl status openclaw

# 查看日志
journalctl -u openclaw -f
```

现在即使你关掉 SSH，OpenClaw 也会持续运行。VPS 重启后也会自动启动。

---

## 第八步：安装实用技能（Skills）

OpenClaw 的真正威力在于技能系统。以下是最值得装的几个：

### 高优先级

| 技能 | 功能 | 为什么值得装 |
|------|------|------------|
| web-research | 网页搜索和研究 | 让助理能联网查信息 |
| browser | 浏览器自动化 | 自动填表、抓取数据 |
| whisper | 语音转文字 | 在路上直接发语音给它 |
| summarize | 内容摘要 | 丢 URL/PDF/YouTube 链接，秒出总结 |

### 按需安装

| 技能 | 功能 |
|------|------|
| gmail | 读写邮件 |
| calendar | 管理日程 |
| obsidian | 连接你的知识库 |
| cron | 定时任务（晨报、提醒） |

安装方式：在 Web UI 里勾选，或者在对话中直接告诉 OpenClaw 你想启用什么技能。

---

## 第九步：设置主动推送（杀手级功能）

这是把 OpenClaw 从"被动问答"变成"主动助理"的关键。

### 9.1 每日晨报

在 Telegram 里告诉你的 OpenClaw：

> "每天早上 8 点给我发一条消息，总结过去 24 小时 AI 领域的重要新闻，以及我今天的日程安排。"

OpenClaw 会自动创建一个 cron 任务。第二天早上 8 点，你的 Telegram 就会收到一条精心整理的晨报。

### 9.2 其他推送场景

- **天气预警**："如果明天要下雨，今晚 10 点提醒我带伞"
- **价格监控**："每小时检查一次 XXX 的价格，低于 $100 就通知我"
- **项目跟踪**："每天下午 6 点给我总结 GitHub 仓库的新 issue 和 PR"

---

## 第十步：访问 Web UI（可选）

OpenClaw 自带一个 Web 管理界面。因为我们没有对外暴露端口，需要通过 SSH 隧道访问。

### 方式一：SSH 端口转发

在**本地电脑**上执行：

```bash
ssh -L 18789:127.0.0.1:18789 openclaw@你的VPS公网IP
```

然后浏览器打开 `http://localhost:18789`，就能看到控制台了。

### 方式二：Tailscale（更优雅）

在 VPS 上安装 Tailscale：

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

在 Tailscale 控制台授权后，用 Tailscale 分配的 IP 直接访问：

```
http://VPS的Tailscale_IP:18789
```

Tailscale 的好处：不需要每次都开 SSH 隧道，手机上也能直接访问。

---

## 日常运维速查

### 查看状态

```bash
openclaw gateway status
# 或
sudo systemctl status openclaw
```

### 查看日志

```bash
journalctl -u openclaw -f --no-pager -n 100
```

### 更新 OpenClaw

一键安装版：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
sudo systemctl restart openclaw
```

源码安装版：

```bash
cd ~/openclaw
git pull
pnpm install
pnpm run build
sudo systemctl restart openclaw
```

### 备份

最重要的数据在 `~/.openclaw/` 目录。定期备份：

```bash
tar -czf openclaw-backup-$(date +%Y%m%d).tar.gz ~/.openclaw/
```

### 切换模型

不想用 Claude 了？随时换：

```bash
nano ~/.openclaw/openclaw.json
```

修改 model provider 配置即可。**记忆不会丢**——记忆存在本地磁盘上，跟用哪个模型无关。

---

## 常见问题

### Q: OpenClaw 突然不回消息了

```bash
# 先看日志
journalctl -u openclaw -f --no-pager -n 50

# 常见原因：
# 1. API Key 余额用完了 → 充值或换 provider
# 2. 进程崩溃了 → sudo systemctl restart openclaw
# 3. 网络问题 → 检查 VPS 出站连接
```

### Q: 内存不够用

如果用 Ollama 跑本地模型，2GB RAM 肯定不够。建议：
- 加 swap：`sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`
- 或者别跑本地模型，用 API 调用云端模型（对 VPS 内存几乎无要求）

### Q: 怎么连 WhatsApp

WhatsApp 没有 Telegram 那种 Bot API，OpenClaw 使用 Baileys 协议连接：
- 引导向导会给你一个二维码
- 用 WhatsApp 扫码配对
- **强烈建议用独立手机号**，不要用主号

### Q: 多个聊天平台能同时连吗

可以。在配置文件里添加多个 channel 即可。所有平台共享同一个记忆和工作区。

---

## 成本估算

| 项目 | 月费 |
|------|------|
| VPS（Hetzner 4GB） | ~$5 |
| LLM API（中度使用） | $10-30 |
| **总计** | **$15-35/月** |

如果用 Oracle Cloud 免费层 + Claude Code 订阅（$20/月），总成本可以压到 **$20/月**。

如果用 Ollama 跑本地模型（需要更大 VPS），LLM 成本为零，但 VPS 成本会上升。

---

## 写在最后

把 OpenClaw 部署到 VPS 上，你得到的不只是一个聊天机器人，而是：

- 一个 **24/7 在线的私人助理**，住在你的 Telegram 里
- 一个 **有持久记忆的 AI**，知道你昨天说了什么、上周在忙什么
- 一个 **能主动推送的系统**，每天早上给你发晨报，有事主动提醒你
- 一个 **你完全拥有的系统**，数据在你的服务器上，模型随时能换

整个过程大约 30 分钟。$5/月的成本，换一个不睡觉的 AI 助理——这笔账怎么算都划算。
