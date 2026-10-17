# 写给小白看的：AI 时代你要懂 CLI

> 你可能听过一句话："未来人人都是程序员。"
>
> 这句话的前提，是你至少要学会跟电脑用文字对话。这个对话窗口，就是 CLI。

---

## 为什么突然要聊 CLI？

过去十年，普通人跟电脑交互的方式就是点鼠标、划屏幕。你不需要知道文件存在哪，不需要理解系统怎么运转，所有操作都藏在图形界面背后。

但 AI 改变了这件事。

2024 年以来，最强大的 AI 工具——Claude Code、Cursor、GitHub Copilot、各类 Agent 框架——几乎全部运行在命令行里。图形界面的 ChatGPT 当然也能用，但它的能力天花板很明显：只能对话，不能直接操作你的文件、运行你的程序、管理你的项目。

**命令行是 AI 工具释放全部能力的入口。** 你不学 CLI，就像买了一辆跑车却只在停车场里坐着听歌。

---

## CLI 到底是什么？

CLI，全称 Command Line Interface，中文叫"命令行界面"。

你可以把它理解为：**一个只接受文字输入的电脑操控台。**

你打字给它一条指令，它执行完毕后把结果用文字返回给你。没有按钮，没有图标，没有花哨的界面。就是一问一答，干净利落。

它长这样：

```
$ ls
Desktop  Documents  Downloads  Music  Pictures
```

你输入 `ls`（列出当前目录的文件），它告诉你这里有哪些文件夹。

再比如：

```
$ cd Documents
$ pwd
/Users/yourname/Documents
```

你输入 `cd Documents`（进入 Documents 文件夹），然后输入 `pwd`（显示当前位置），它告诉你你现在在哪。

这就是 CLI 的全部逻辑：**你下达指令，电脑执行。**

---

## GUI vs CLI：两种操控电脑的方式

你日常使用的桌面、窗口、图标，统称 GUI（Graphical User Interface，图形用户界面）。GUI 和 CLI 是操控电脑的两条路径，各有所长：

| | GUI（图形界面） | CLI（命令行） |
|--|----------------|-------------|
| **操作方式** | 鼠标点击、拖拽 | 键盘输入指令 |
| **学习门槛** | 低，所见即所得 | 略高，需要记命令 |
| **效率** | 单次操作简单，批量操作吃力 | 批量操作和自动化极强 |
| **精确度** | 受界面设计限制 | 精确到每一个参数 |
| **适合场景** | 日常浏览、办公 | 开发、运维、AI 工具 |

一个直观的对比：

- **GUI 方式改文件名**：右键 → 重命名 → 输入新名字 → 回车。一个文件还好，100 个文件你就崩溃了。
- **CLI 方式批量改文件名**：一行命令，100 个文件同时改完。

CLI 的核心优势在于：**可编程、可自动化、可组合。** 这三个特性，恰好是 AI 工具需要的。

---

## 在开始之前：推荐使用 macOS 或 Linux

本文的所有命令和示例都基于 macOS / Linux 环境。这两个系统的命令行体验几乎一致，底层都是 Unix 风格的 Shell，绝大多数 AI 工具和开发教程也默认以它们为基础。

Windows 的命令行体系比较特殊——PowerShell 和 CMD 的语法与 Mac/Linux 差异不小，很多命令写法不通用，遇到问题时搜到的解决方案也经常对不上。如果你手边实在没有 Mac 或 Linux 机器，Windows 也能用，但会多踩一些坑。一个折中方案是在 Windows 上安装 [WSL（Windows Subsystem for Linux）](https://learn.microsoft.com/en-us/windows/wsl/install)，这样你就能在 Windows 里跑一个完整的 Linux 命令行环境。

---

## 怎么打开命令行？

### Mac 用户

打开"启动台"（Launchpad），搜索 **Terminal**（终端），点击打开。

或者用快捷键：`Command + 空格` 打开 Spotlight，输入 Terminal，回车。

### Windows 用户

按 `Win` 键，搜索 **PowerShell** 或 **Windows Terminal**，点击打开。

> 建议 Windows 用户安装 [Windows Terminal](https://aka.ms/terminal)，体验远好于默认的命令提示符。

### Linux 用户

你大概率已经知道怎么打开了。`Ctrl + Alt + T` 通常就行。

---

## 终端工具推荐与选择

系统自带的终端能用，但体验比较基础。选一个趁手的终端工具，会让你在命令行里的效率和舒适度提升不少。

### macOS

| 工具 | 特点 | 推荐理由 | 下载地址 |
|------|------|---------|---------|
| **Terminal.app** | 系统自带 | 零配置，开箱即用，完全够入门使用 | 无需下载，系统自带 |
| **iTerm2** | 免费，功能丰富 | 分屏、搜索、自动补全、配色方案，macOS 上最主流的终端替代品 | [iterm2.com](https://iterm2.com/) |
| **Warp** | AI 原生终端 | 内置 AI 命令建议、命令历史智能搜索、现代化界面，对新手极其友好 | [warp.dev](https://www.warp.dev/) |
| **Ghostty** | 开源，GPU 加速 | 由 HashiCorp 联合创始人开发，速度极快，配置简洁，适合追求性能的用户 | [ghostty.org](https://ghostty.org/) |

**新手建议**：直接用系统自带的 Terminal.app 起步。等你用了一两周觉得有不顺手的地方，再换 iTerm2 或 Warp。工具不是越高级越好，够用就行。

### Windows

| 工具 | 特点 | 推荐理由 | 下载地址 |
|------|------|---------|---------|
| **Windows Terminal** | 微软官方出品 | 支持多标签、分屏、配色主题，比 CMD 和 PowerShell 默认界面强太多 | [aka.ms/terminal](https://aka.ms/terminal) |
| **WSL + Windows Terminal** | Linux 子系统 | 在 Windows 里获得完整的 Linux 命令行体验，前面已经提过，强烈建议 Windows 用户配置 | [WSL 安装指南](https://learn.microsoft.com/en-us/windows/wsl/install) |

### Linux

大部分 Linux 发行版自带的终端已经足够好用。如果想要更多功能，可以试试 [Tilix](https://gnunn1.github.io/tilix-web/)（分屏）或 [Alacritty](https://alacritty.org/)（GPU 加速，启动极快）。

### 关于 Shell：Bash vs Zsh vs Fish

终端是窗口，Shell 是在窗口里运行的"解释器"——你输入的每条命令，都由 Shell 来解析和执行。

- **Bash**：最经典的 Shell，几乎所有 Linux 系统的默认配置。网上大部分教程和脚本都基于 Bash。
- **Zsh**：macOS 从 2019 年开始的默认 Shell。兼容 Bash 语法，自动补全和插件生态更强。配合 [Oh My Zsh](https://ohmyz.sh/) 可以快速获得一套开箱即用的配置。
- **Fish**：对新手最友好的 Shell，自带语法高亮、智能建议、自动补全，无需任何配置。代价是语法和 Bash 不完全兼容，某些脚本需要调整。

**新手建议**：macOS 用户保持默认的 Zsh 即可；Linux 用户保持默认的 Bash 即可。等你在命令行里积累了一定经验，再根据需要切换。起步阶段，Shell 的选择远没有"动手练习"重要。

---

### 国内用户：让终端也能正常联网

你可能已经发现了一个问题：浏览器开了代理可以正常访问 GitHub、npm、PyPI 这些网站，但一到终端里执行 `npm install` 或 `git clone`，就卡住、超时、报错。

原因很简单：**大多数代理工具只接管了浏览器的流量，终端走的是另一条路。** 你需要手动告诉终端"也走代理"。

#### 方法一：临时设置环境变量（当前会话有效）

打开终端，执行以下命令：

```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

> `7890` 是常见的代理端口号（Clash、V2Ray 等工具的默认端口）。如果你的代理工具用的是其他端口，替换成对应的数字即可。在代理工具的设置界面一般都能找到。

设置完之后，可以用这条命令验证是否生效：

```bash
curl -I https://www.google.com
```

如果返回 `HTTP/1.1 200 OK` 或类似响应，说明终端已经能通过代理联网了。

#### 方法二：写入配置文件（永久生效）

每次开终端都手动设置一遍很麻烦。把上面的命令写入 Shell 配置文件，就能永久生效：

**Zsh 用户**（macOS 默认）：

```bash
echo 'export http_proxy=http://127.0.0.1:7890' >> ~/.zshrc
echo 'export https_proxy=http://127.0.0.1:7890' >> ~/.zshrc
echo 'export all_proxy=socks5://127.0.0.1:7890' >> ~/.zshrc
source ~/.zshrc
```

**Bash 用户**（大部分 Linux）：

```bash
echo 'export http_proxy=http://127.0.0.1:7890' >> ~/.bashrc
echo 'export https_proxy=http://127.0.0.1:7890' >> ~/.bashrc
echo 'export all_proxy=socks5://127.0.0.1:7890' >> ~/.bashrc
source ~/.bashrc
```

#### 方法三：代理工具开启"系统代理"或"TUN 模式"

部分代理工具支持 TUN 模式（虚拟网卡模式），开启后会接管系统全部流量，包括终端。这样你不需要手动设置任何环境变量。

- **Clash Verge / Clash Meta**：在设置里找到"TUN 模式"或"服务模式"，开启即可
- **Surge（macOS）**：开启"增强模式"（Enhanced Mode）
- **Quantumult X / Shadowrocket（iOS）**：这两个是手机端工具，电脑上不适用

TUN 模式的好处是一劳永逸，所有应用的流量都走代理，无需逐个配置。缺点是部分系统可能需要管理员权限，且偶尔会与 VPN 软件冲突。

#### 方法四：只给特定工具配置代理

有些工具有自己的代理配置方式，不依赖环境变量：

**Git：**

```bash
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

**npm：**

```bash
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890
```

如果哪天不需要代理了，记得清除：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
npm config delete proxy
npm config delete https-proxy
```

#### 怎么选？

| 场景 | 推荐方案 |
|------|---------|
| 偶尔用一下终端 | 方法一：临时设置环境变量 |
| 每天都用终端 | 方法二：写入配置文件，或方法三：TUN 模式 |
| 只有某个工具连不上 | 方法四：单独给该工具配代理 |

**一个提醒**：如果你不确定自己的代理端口号，打开代理工具的设置页面，找"本地监听端口"或"HTTP 端口"，那个数字就是。常见的端口有 7890、1080、8080、10809。

---

## 先学会读懂这一行提示符

打开终端后，你会看到类似这样的一行文字：

```
yourname@MacBook-Pro ~ %
```

或者：

```
yourname@ubuntu:~$
```

这就是**提示符（Prompt）**——它在等你输入命令。几个关键信息：

- **`$` 或 `%`**：提示符的结尾标记，表示"轮到你打字了"。**你不需要输入这个符号。** 本文示例中的 `$` 都是提示符，不是命令的一部分。
- **`~`**：代表你的用户主目录（Home），在 Mac 上就是 `/Users/yourname`，在 Linux 上是 `/home/yourname`。
- **当前路径**：提示符里通常会显示你所在的目录。当你 `cd` 到别的地方，它会跟着变。

```bash
~ % cd Documents
~/Documents %          # 提示符变了，说明你换了位置
```

很多新手在网上复制命令时，会把 `$` 也一起复制进去，然后报错。记住：**`$` 是提示符，不是命令。**

---

## 命令的基本语法

在开始学具体命令之前，先理解一个通用结构。CLI 里几乎所有命令都遵循同一个格式：

```
命令  [选项]  [参数]
```

举个例子：

```bash
$ ls -la /tmp
```

- **`ls`** — 命令本身（列出文件）
- **`-la`** — 选项（Option/Flag），用来修改命令的行为。`-l` 表示详细列表，`-a` 表示显示隐藏文件，合写成 `-la`
- **`/tmp`** — 参数（Argument），告诉命令"对谁操作"。这里是让 `ls` 列出 `/tmp` 目录的内容

选项通常以 `-` 或 `--` 开头：

- **短选项**：单个字母，如 `-l`、`-a`、`-r`，可以合并写成 `-lar`
- **长选项**：完整单词，如 `--help`、`--version`、`--recursive`

记住这个结构，后面遇到任何命令都能拆解出它在做什么。

---

## 你需要掌握的核心命令

不需要背几百个命令。以下这些覆盖了日常 80% 的使用场景：

### 导航类

#### `pwd` — 我在哪？

```bash
$ pwd
/Users/yourname/Documents
```

Print Working Directory。显示你当前所在的目录路径。CLI 世界里的"你在这里"标记。

#### `ls` — 这里有什么？

```bash
$ ls
project1  project2  notes.txt  todo.md
```

List。列出当前目录下的所有文件和文件夹。

加 `-la` 参数可以看到更多细节（文件大小、修改时间、隐藏文件）：

```bash
$ ls -la
```

#### `cd` — 去别的地方

```bash
$ cd Documents        # 进入 Documents 文件夹
$ cd ..               # 返回上一级
$ cd ~                # 回到用户主目录
$ cd ~/Desktop        # 直接跳到桌面
```

Change Directory。在目录之间移动。这是你在 CLI 里"导航"的基本动作。

### 文件操作类

#### `mkdir` — 创建新文件夹

```bash
$ mkdir my-project
```

Make Directory。就像在 Finder 或文件管理器里右键"新建文件夹"。

#### `touch` — 创建新文件

```bash
$ touch notes.txt
```

创建一个空文件。在 Mac/Linux 上用 `touch`，Windows PowerShell 上用 `New-Item notes.txt`。

#### `cp` — 复制

```bash
$ cp notes.txt backup.txt          # 复制文件
$ cp -r project1 project1-backup   # 复制整个文件夹（-r 表示递归）
```

Copy。把文件或文件夹复制一份。

#### `mv` — 移动 / 重命名

```bash
$ mv notes.txt archive/notes.txt   # 移动文件到 archive 文件夹
$ mv old-name.txt new-name.txt     # 重命名文件
```

Move。移动和重命名在 CLI 里是同一个操作。

#### `rm` — 删除

```bash
$ rm notes.txt           # 删除文件
$ rm -r old-project      # 删除文件夹及其内容
```

Remove。**注意：CLI 删除不进回收站，删了就没了。** 操作前确认好。

### 查看与求助类

#### `cat` — 查看文件内容

```bash
$ cat notes.txt
```

把文件内容直接输出到屏幕上。适合快速查看短文件。

#### `less` — 翻页查看长文件

```bash
$ less app.log
```

如果文件有几百行，`cat` 会一口气全部刷出来，根本看不过来。`less` 可以让你上下翻页阅读：

- `空格` 或 `f`：向下翻一页
- `b`：向上翻一页
- `/关键词`：搜索内容（按 `n` 跳到下一个匹配）
- `q`：退出

`less` 适合查看日志文件、配置文件、长输出等场景。

#### `grep` — 搜索内容

```bash
$ grep "error" app.log               # 从 app.log 中搜索包含 "error" 的行
$ grep -r "TODO" ./src/              # 在 src 目录下递归搜索所有包含 "TODO" 的文件
$ grep -i "warning" app.log          # -i 忽略大小写
```

`grep` 是 CLI 里的"搜索框"。配合管道使用更灵活：

```bash
$ ps aux | grep "node"               # 从进程列表中搜索 node 相关进程
```

#### `man` 和 `--help` — 自己查帮助

遇到不熟悉的命令，不用搜索引擎，直接在终端里查：

```bash
$ man ls                # 打开 ls 命令的完整手册（按 q 退出）
$ ls --help             # 查看 ls 的简要帮助信息
$ grep --help           # 查看 grep 的用法
```

`man`（manual）给出完整的使用手册，`--help` 给出精简版。养成"不会就查"的习惯，比死记硬背管用得多。

---

## 必须掌握的快捷操作

命令行效率的一大来源是键盘快捷键。以下四个是最常用的，建议第一天就记住：

| 快捷键 | 作用 | 说明 |
|--------|------|------|
| **`Tab`** | 自动补全 | 输入文件名或命令的前几个字母，按 Tab 自动补全。按两次 Tab 显示所有可能的匹配项。这是 CLI 里最省时间的操作 |
| **`↑` / `↓`** | 翻历史命令 | 按上箭头可以调出之前执行过的命令，不用重新输入。按下箭头回到更新的命令 |
| **`Ctrl + C`** | 中断当前命令 | 命令卡住了、运行太久了、打错了——按 `Ctrl + C` 立刻终止。这是新手最需要知道的"紧急刹车" |
| **`Ctrl + L`** | 清屏 | 等同于 `clear` 命令，清除屏幕上的内容，给你一个干净的界面 |

还有几个进阶但很实用的：

| 快捷键 | 作用 |
|--------|------|
| `Ctrl + A` | 光标跳到行首 |
| `Ctrl + E` | 光标跳到行尾 |
| `Ctrl + W` | 删除光标前的一个单词 |
| `Ctrl + R` | 搜索历史命令（输入关键词，它会自动匹配你之前用过的命令） |
| `Ctrl + D` | 退出当前终端会话（等同于输入 `exit`） |

---

## 空格、引号和通配符

这几个细节看起来很小，但却是新手踩坑最多的地方。

### 文件名有空格怎么办？

CLI 用空格来分隔命令、选项和参数。所以当文件名本身包含空格时，直接写会出错：

```bash
$ cd My Documents        # 错误！系统会把 My 和 Documents 当成两个参数
$ cd "My Documents"      # 正确：用引号包裹
$ cd My\ Documents       # 正确：用反斜杠转义空格
```

**建议**：给文件和文件夹命名时，避免使用空格。用 `-` 或 `_` 代替，比如 `my-project`、`my_notes.txt`。这会让你在 CLI 里的操作顺畅很多。

### 通配符：批量操作的利器

通配符可以让你一次匹配多个文件：

| 通配符 | 含义 | 示例 |
|--------|------|------|
| `*` | 匹配任意数量的任意字符 | `*.txt` 匹配所有 .txt 文件 |
| `?` | 匹配单个任意字符 | `file?.txt` 匹配 file1.txt、fileA.txt |

实际用法：

```bash
$ ls *.md                 # 列出所有 Markdown 文件
$ rm *.log                # 删除所有日志文件（谨慎使用！）
$ cp *.jpg ~/backup/      # 把所有 jpg 图片复制到 backup 目录
$ mv report_202*.pdf archive/   # 把 2020 年代的报告都移到 archive
```

通配符配合前面学的文件操作命令，就是"批量处理"能力的来源。GUI 里需要手动选中 100 个文件的操作，CLI 里一行命令搞定。

---

## 隐藏文件和 dotfile

你可能注意到了，很多配置文件的名字以 `.` 开头：`.zshrc`、`.bashrc`、`.gitconfig`、`.env`。

在 Unix 系统里，以 `.` 开头的文件和文件夹默认是**隐藏的**——普通的 `ls` 不会显示它们，Finder 里也看不到。要看到它们，需要加 `-a` 选项：

```bash
$ ls        # 只看到普通文件
$ ls -a     # 看到所有文件，包括以 . 开头的隐藏文件
```

这些隐藏文件通常是配置文件（也叫 dotfile），各种工具把自己的设置存在这里：

| 文件 | 谁的配置 |
|------|---------|
| `~/.zshrc` | Zsh Shell 的配置（环境变量、别名、插件） |
| `~/.bashrc` | Bash Shell 的配置 |
| `~/.gitconfig` | Git 的全局配置（用户名、邮箱、代理） |
| `~/.ssh/` | SSH 密钥和服务器别名配置 |
| `~/.env` 或项目里的 `.env` | 环境变量（API 密钥等敏感信息） |

理解 dotfile 的存在很重要——当教程让你"编辑 `~/.zshrc`"时，你就知道它在说什么了。

---

## 五个关键概念

掌握了上面的命令之后，还需要理解五个概念，它们是 CLI 世界的"地基"。

### 概念一：路径（Path）

路径就是文件在电脑上的地址。分两种：

- **绝对路径**：从根目录开始的完整地址。
  - Mac/Linux：`/Users/yourname/Documents/project/app.js`
  - Windows：`C:\Users\yourname\Documents\project\app.js`

- **相对路径**：从你当前位置出发的地址。
  - `./notes.txt` → 当前目录下的 notes.txt
  - `../images/logo.png` → 上一级目录的 images 文件夹里的 logo.png

你在 CLI 里打的每一个文件名，本质上都是路径。

### 概念二：重定向与管道（`>`、`>>`、`|`）

命令行里有三个符号你一定会反复遇到：`>`、`>>`、`|`。它们的作用都是控制数据的流向——把命令的输出送到你想要的地方去。

#### `>` 覆盖写入文件

把命令的输出结果写入一个文件。如果文件已存在，**原内容会被清空覆盖**。

```bash
# 把 ls 的结果保存到 filelist.txt
$ ls -la > filelist.txt

# 把 "hello world" 写入 greeting.txt
$ echo "hello world" > greeting.txt
```

一个常见用法是把命令输出保存下来，方便后续查阅：

```bash
# 把系统信息保存到文件
$ uname -a > system-info.txt
```

#### `>>` 追加写入文件

和 `>` 类似，但**不会覆盖原内容**，而是在文件末尾追加新内容。

```bash
# 往日志文件里追加一行
$ echo "2026-04-09 部署完成" >> deploy-log.txt

# 再追加一行
$ echo "2026-04-09 测试通过" >> deploy-log.txt
```

`>` 和 `>>` 的区别只有一个字：覆盖还是追加。搞混了就可能丢失数据，注意区分。

前面在配置终端代理时你已经用过了 `>>`：

```bash
echo 'export http_proxy=http://127.0.0.1:7890' >> ~/.zshrc
```

这就是往配置文件末尾追加一行，不影响文件里原有的内容。

#### `|` 管道

管道符号 `|` 的作用是：**把前一个命令的输出，直接传给后一个命令作为输入。**

```bash
$ ls -la | grep ".txt"
```

这行命令的意思是：先用 `ls -la` 列出所有文件，然后把结果传给 `grep`，从中筛选出名字包含 `.txt` 的行。

管道可以多级串联，像流水线一样处理数据：

```bash
# 列出所有文件 → 筛选 .log 文件 → 按文件大小排序 → 只看前 5 个
$ ls -la | grep ".log" | sort -k5 -n | head -5

# 查看系统进程 → 筛选包含 "node" 的 → 统计有几个
$ ps aux | grep "node" | wc -l
```

管道是 CLI 最强大的设计之一——**每个命令只做一件事，通过管道串联起来，就能完成极其复杂的操作。** 这个理念叫 Unix 哲学，是命令行世界的基石。

#### 三者的区别一览

| 符号 | 作用 | 数据流向 |
|------|------|---------|
| `>` | 覆盖写入文件 | 命令 → 文件（清空原内容） |
| `>>` | 追加写入文件 | 命令 → 文件（保留原内容） |
| `\|` | 管道传递 | 命令 → 另一个命令 |

一句话总结：`>` 和 `>>` 是把输出存到文件里，`|` 是把输出喂给下一个命令。

### 概念三：权限（Permission）

有时候你执行命令会看到"Permission denied"。这是系统的安全机制——某些操作需要管理员权限。

在 Mac/Linux 上，加 `sudo` 前缀可以临时获取管理员权限：

```bash
$ sudo npm install -g claude-code
```

系统会要求你输入密码。注意：`sudo` 是一把钥匙，不要随意用它执行你不理解的命令。

### 概念四：环境变量（Environment Variable）

前面在配置终端代理时，你已经见过这种写法：

```bash
export http_proxy=http://127.0.0.1:7890
```

这就是在设置一个"环境变量"。理解它，是掌握 CLI 的关键一步。

#### 什么是环境变量？

环境变量是**存储在系统中的一组键值对**，作用是告诉操作系统和各种程序一些全局的配置信息。

你可以把它想象成一张贴在电脑"控制室墙上"的便签纸——每张便签写着一个名字和一个值，所有程序进来都能看到这些便签，并根据上面的信息调整自己的行为。

比如：

| 环境变量 | 值 | 作用 |
|---------|---|------|
| `HOME` | `/Users/yourname` | 告诉所有程序你的主目录在哪 |
| `PATH` | `/usr/local/bin:/usr/bin:...` | 告诉系统去哪些目录里找可执行的命令 |
| `http_proxy` | `http://127.0.0.1:7890` | 告诉程序访问网络时走这个代理 |
| `OPENAI_API_KEY` | `sk-xxxxx` | 告诉 AI 工具你的 API 密钥是什么 |

#### 怎么查看当前的环境变量？

```bash
# 查看所有环境变量
$ env

# 查看某一个具体的环境变量
$ echo $HOME
/Users/yourname

$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

`$` 符号加上变量名，就是在读取这个变量的值。

#### 怎么设置环境变量？

**临时设置**（只在当前终端窗口有效，关掉就没了）：

```bash
export MY_NAME="hello"
echo $MY_NAME
# 输出：hello
```

**永久设置**（写入 Shell 配置文件，每次打开终端自动加载）：

```bash
# Zsh 用户（macOS 默认）
echo 'export MY_NAME="hello"' >> ~/.zshrc
source ~/.zshrc

# Bash 用户（大部分 Linux）
echo 'export MY_NAME="hello"' >> ~/.bashrc
source ~/.bashrc
```

`source` 命令的作用是让修改立即生效，不用重启终端。

#### 最重要的环境变量：PATH

`PATH` 是你在 CLI 里最常打交道的环境变量。当你在终端输入一个命令（比如 `node`、`git`、`claude`），系统会去 `PATH` 里列出的目录逐个查找，找到了就执行，找不到就报 `command not found`。

```bash
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

这串路径用冒号 `:` 分隔，表示系统会依次到 `/usr/local/bin`、`/usr/bin`、`/bin` 等目录里查找命令。

当你安装了一个新工具却提示 `command not found`，大概率就是这个工具的安装路径不在 `PATH` 里。解决方法是把它加进去：

```bash
export PATH="/新工具的路径:$PATH"
```

`$PATH` 放在后面，表示在原有路径列表的前面插入新路径。

#### 为什么 AI 时代必须理解环境变量？

几乎所有 AI 工具都依赖环境变量来获取配置：

```bash
# Claude Code 通过环境变量读取 API 密钥
export ANTHROPIC_API_KEY="sk-ant-xxxxx"

# OpenAI 的工具通过环境变量读取密钥
export OPENAI_API_KEY="sk-xxxxx"

# 很多 AI Agent 通过环境变量读取各种服务的凭证
export SUPABASE_URL="https://xxxxx.supabase.co"
export SUPABASE_KEY="eyJxxxxx"
```

你会发现，安装完一个 AI 工具之后，教程的下一步几乎总是"设置环境变量"。如果你不理解环境变量是什么，这一步就会成为卡点。现在你已经知道了——它就是给程序看的"配置便签"，用 `export` 贴上去，程序就能读到。

### 概念五：标准输出与标准错误（stdout 与 stderr）

当一个命令运行时，它会产生两种输出：

- **标准输出（stdout）**：正常的运行结果。比如 `ls` 列出的文件列表。
- **标准错误（stderr）**：报错信息。比如 `cat 不存在的文件.txt` 产生的错误提示。

为什么要区分？因为前面学的 `>` 和 `|` 默认只处理 stdout，不处理 stderr。这就是为什么有时候你用 `>` 把输出重定向到文件，屏幕上还是会出现报错信息——那些报错走的是另一条通道。

```bash
$ cat real.txt fake.txt > output.txt
# real.txt 的内容会写入 output.txt
# 但 "fake.txt: No such file or directory" 仍然显示在屏幕上（因为它走的是 stderr）
```

如果你想把错误信息也重定向，用 `2>`：

```bash
$ cat real.txt fake.txt > output.txt 2> errors.txt
# 正常输出写入 output.txt，错误信息写入 errors.txt
```

`2>` 里的 `2` 就是 stderr 的编号（stdout 是 `1`，通常省略不写）。

对于新手来说，不需要深入掌握这些，只需要知道一件事：**如果你重定向了输出却还是看到屏幕上有信息打印出来，那大概率是 stderr，不是 bug。**

---

## 安装软件：包管理器

在 GUI 里，安装软件是"下载 → 双击 → 下一步 → 完成"。

在 CLI 里，安装软件用的是**包管理器**（Package Manager）。一行命令就能完成下载、安装、配置。

包管理器分为两类，容易搞混：

| 类型 | 作用 | 代表 |
|------|------|------|
| **系统级包管理器** | 安装操作系统层面的软件（Git、Node.js、Python 等） | Homebrew（Mac）、winget（Windows）、apt（Ubuntu） |
| **语言级包管理器** | 安装某个编程语言生态下的库和工具 | npm（Node.js）、pip（Python） |

**先用系统级装好基础软件，再用语言级装具体工具。** 比如：先用 Homebrew 装 Node.js，然后才能用 npm 装 Claude Code。

### 系统级：Homebrew（Mac）

```bash
# 安装 Homebrew（只需要执行一次）
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 用 Homebrew 安装软件
$ brew install git
$ brew install node
```

### 系统级：winget（Windows）

```powershell
# Windows 11 自带 winget
$ winget install Git.Git
$ winget install OpenJS.NodeJS.LTS
```

### 语言级：npm（Node.js 生态）

很多 AI 工具基于 Node.js 构建，用 npm 安装：

```bash
$ npm install -g claude-code    # 安装 Claude Code
```

`-g` 表示全局安装，装完之后在任何目录都能使用。

### 语言级：pip（Python 生态）

AI 和数据科学领域大量工具用 Python 写：

```bash
$ pip install openai             # 安装 OpenAI 的 Python SDK
```

**一个原则：看到教程让你安装什么，先搞清楚用哪个包管理器，然后一行命令搞定。** 别再去网上找安装包下载了。

### 安装完怎么验证？

装完任何工具后，养成一个习惯——立刻验证：

```bash
$ node --version         # 验证 Node.js 是否安装成功
v22.12.0

$ git --version          # 验证 Git
git version 2.45.0

$ which claude           # 查看 claude 命令的实际路径
/usr/local/bin/claude

$ command -v python3     # 另一种检查命令是否存在的方式
/usr/bin/python3
```

如果返回了版本号或路径，说明安装成功。如果提示 `command not found`，大概率是安装路径不在 `PATH` 里，回到前面"环境变量"那一节排查。

---

## CLI 和 AI 工具的关系

现在回到正题：为什么 AI 时代必须掌握 CLI？

### 1. 最强的 AI 工具都运行在命令行

Claude Code、Codex CLI、Aider、Open Interpreter——这些能直接操作你电脑文件的 AI 工具，全部通过命令行交互。

```bash
$ claude                  # 启动 Claude Code
$ aider                   # 启动 Aider
$ interpreter             # 启动 Open Interpreter
```

启动之后，你就进入了一个对话界面——看起来和 ChatGPT 很像，但区别在于：它能直接执行操作、修改文件、运行程序。

### 2. CLI 是 AI Agent 的"手和脚"

AI Agent（智能体）需要执行具体任务：创建文件、安装依赖、启动服务、测试代码。这些操作全部通过命令行完成。

你不需要亲自打每一条命令——AI 会帮你生成和执行。但你需要能看懂它在做什么。

就像你把车交给代驾，你不用亲自开，但你至少得看懂他往哪个方向走。

### 3. 环境配置是你和 AI 协作的前提

AI 再强大，也需要一个配置好的工作环境。Node.js 要装好，Python 要装好，Git 要配好。这些环境配置，全部通过 CLI 完成。

这是一次性的投入：花一两个小时把环境搭好，之后你和 AI 的协作效率会高出一个量级。

---

## 实战：从零到用上 Claude Code

把前面学的串起来，走一遍完整流程：

```bash
# 第一步：打开终端

# 第二步：确认 Node.js 已安装
$ node --version
v22.12.0

# 如果没装，Mac 用户执行：
$ brew install node

# 第三步：安装 Claude Code
$ npm install -g @anthropic-ai/claude-code

# 第四步：创建一个工作目录
$ mkdir ~/my-ai-workspace
$ cd ~/my-ai-workspace

# 第五步：启动 Claude Code
$ claude
```

五步完成。你已经在命令行里启动了目前最强大的 AI 工具之一。

> **如果某一步失败了怎么办？**
>
> - **`node --version` 没反应** → Node.js 没装好。Mac 用户执行 `brew install node`，然后重新打开终端再试。
> - **`npm install` 报 `permission denied`** → 在命令前加 `sudo`，或者检查 Node.js 是否通过 Homebrew 安装（Homebrew 安装的通常不需要 sudo）。
> - **`claude` 提示 `command not found`** → npm 的全局安装路径可能不在 `PATH` 里。执行 `npm config get prefix` 查看路径，然后把它加到 `PATH` 中。
> - **网络超时或下载失败** → 回到前面"国内用户终端联网"章节，配置代理。

从这一刻起，你可以用自然语言告诉它任何任务：

- "帮我分析 Desktop 上那个 Excel 文件，列出销售额前十的产品"
- "把 Downloads 里所有的 PDF 合并成一个文件"
- "帮我写一个个人网站，部署到 Cloudflare"

它会直接在你的电脑上执行，结果就在你的文件夹里。

---

## SSH：用命令行连接远程服务器

到目前为止，你学的所有操作都发生在自己的电脑上。但很多时候，你需要操控的机器并不在你面前——它可能是一台云服务器、一台公司的开发机，或者一台远在另一个城市机房里的 GPU 机器。

SSH（Secure Shell）就是用来解决这个问题的：**通过命令行，安全地登录并操控远程机器。**

### 最基本的用法

```bash
$ ssh username@server-address
```

比如：

```bash
$ ssh root@192.168.1.100        # 用 IP 地址连接
$ ssh deploy@my-server.com      # 用域名连接
```

输入密码后，你的终端就"切换"到了远程机器上——接下来你敲的每一条命令，都在远程机器上执行。想退出远程连接，输入 `exit` 即可。

### 用 SSH 密钥替代密码（推荐）

每次连接都输密码很烦，而且密码在网络上传输存在安全风险。更好的做法是使用 **SSH 密钥对**——一把"私钥"存在你自己的电脑上，一把"公钥"放在远程服务器上。连接时系统自动验证，不需要输密码。

**第一步：生成密钥对**

```bash
$ ssh-keygen -t ed25519 -C "your-email@example.com"
```

一路按回车使用默认设置即可。完成后会在 `~/.ssh/` 目录下生成两个文件：

- `id_ed25519` — 私钥（绝对不能泄露给任何人）
- `id_ed25519.pub` — 公钥（可以安全地分享出去）

**第二步：把公钥复制到远程服务器**

```bash
$ ssh-copy-id username@server-address
```

输入一次密码，之后再连接这台服务器就不需要密码了。

**第三步：验证**

```bash
$ ssh username@server-address
# 直接登录，无需输入密码
```

### SSH 密钥的另一个重要用途：GitHub

当你用 Git 推送代码到 GitHub 时，GitHub 需要验证你的身份。除了用户名密码之外，SSH 密钥是更安全也更方便的方式。

把你的公钥添加到 GitHub：

```bash
# 复制公钥内容
$ cat ~/.ssh/id_ed25519.pub
```

把输出的内容复制下来，然后到 GitHub → Settings → SSH and GPG keys → New SSH key，粘贴进去保存。

之后克隆仓库时，使用 SSH 地址就可以免密操作：

```bash
$ git clone git@github.com:username/repo-name.git
```

### SSH Config：给服务器起别名

如果你经常连接多台服务器，每次都输 `ssh deploy@192.168.1.100 -p 2222` 太长了。可以在 `~/.ssh/config` 文件里配置别名：

```
Host myserver
    HostName 192.168.1.100
    User deploy
    Port 2222

Host gpu-box
    HostName gpu.mycompany.com
    User researcher
    IdentityFile ~/.ssh/id_ed25519
```

配置好之后，只需要：

```bash
$ ssh myserver      # 等同于 ssh deploy@192.168.1.100 -p 2222
$ ssh gpu-box       # 等同于完整的连接命令
```

简洁，高效，不用记一堆 IP 和端口。

### SCP：通过 SSH 传文件

SSH 不只能登录远程机器，还能传文件。`scp` 命令的用法和 `cp` 非常像，只是目标变成了远程路径：

```bash
# 把本地文件传到远程服务器
$ scp ./data.csv myserver:/home/deploy/data/

# 把远程服务器的文件下载到本地
$ scp myserver:/var/log/app.log ./

# 传整个文件夹（加 -r）
$ scp -r ./my-project myserver:/home/deploy/projects/
```

### 什么场景下会用到 SSH？

| 场景 | 说明 |
|------|------|
| 部署项目到云服务器 | 买了一台阿里云/AWS 的服务器，用 SSH 登录上去部署代码 |
| 使用远程 GPU 训练模型 | 连接到有 GPU 的机器，运行深度学习训练任务 |
| GitHub 免密推送 | 配置 SSH 密钥后，`git push` 不再需要每次输密码 |
| 管理多台机器 | 运维、批量部署、远程排查问题 |
| 远程使用 AI 工具 | 在远程服务器上运行 Claude Code 或其他 AI Agent |

SSH 是你从"本地操作"走向"远程协作"的桥梁。一旦掌握，你能操控的就不只是面前这一台电脑了。

---

## 常见的"劝退瞬间"和应对方法

### "command not found"

最常见的报错。意思是系统找不到你输入的这个命令——通常是因为对应的软件没安装。

**应对**：搜索"如何安装 [命令名]"，用包管理器安装即可。

### "Permission denied"

权限不够。

**应对**：在命令前加 `sudo`（Mac/Linux），或以管理员身份运行终端（Windows）。

### "No such file or directory"

文件路径写错了，或者你不在正确的目录下。

**应对**：用 `pwd` 确认当前位置，用 `ls` 确认文件是否存在。

### 看到一大堆看不懂的输出

不要慌。大部分是日志信息，只需要关注最后几行——如果有红色的 `error`，那才是问题所在。

**应对**：把报错信息复制给 AI，让它帮你分析。这本身就是 AI First 的做法。

---

## 进一步学习的建议

掌握了本文的内容，你已经具备在 AI 时代使用命令行的基本能力。如果想继续深入，以下几个方向值得投入：

1. **Git 基础**：版本管理是所有项目协作的基础。学会 `git init`、`git add`、`git commit`、`git push` 这几个命令，你就能管理自己的项目，也能把代码发布到 GitHub。

2. **Shell 脚本**：当你发现自己反复执行同一串命令时，可以把它们写成一个脚本文件，一键执行。这是从"使用 CLI"到"驾驭 CLI"的跨越。

3. **tmux 终端复用**：tmux 可以在一个终端窗口里分出多个面板和会话，同时运行多个任务。更关键的是，tmux 的会话在你断开连接后依然存活——用 SSH 连接远程服务器时，即使网络中断，tmux 里运行的任务（比如模型训练、AI Agent）也不会被终止，重新连上去就能接着用。

4. **dotfiles 管理**：随着你的终端配置越来越多（`.zshrc`、`.gitconfig`、`.env` 等），学会用 Git 管理这些配置文件，换电脑时可以一键恢复整套环境。

---

## 3 个动手练习

学完不练等于没学。以下三个练习从简到难，每个 5 分钟以内：

### 练习一：文件操作基本功

```bash
# 在主目录下创建一个练习文件夹
$ mkdir ~/cli-practice
$ cd ~/cli-practice

# 创建几个文件
$ touch note1.txt note2.txt note3.md readme.md

# 列出所有文件，确认创建成功
$ ls

# 只列出 .txt 文件
$ ls *.txt

# 创建一个子文件夹，把 .md 文件移进去
$ mkdir docs
$ mv *.md docs/

# 确认结果
$ ls
$ ls docs/

# 清理
$ rm -r ~/cli-practice
```

### 练习二：查看、搜索、管道组合

```bash
# 查看你的 Shell 配置文件（如果存在的话）
$ cat ~/.zshrc

# 太长了？用 less 翻页看
$ less ~/.zshrc

# 从中搜索包含 "export" 的行
$ grep "export" ~/.zshrc

# 统计有多少行包含 "export"
$ grep "export" ~/.zshrc | wc -l

# 查看当前系统运行了哪些进程，筛选出 Python 相关的
$ ps aux | grep python
```

### 练习三：环境变量和验证

```bash
# 查看当前的 HOME 和 PATH
$ echo $HOME
$ echo $PATH

# 设置一个临时变量
$ export MY_TEST="cli works"
$ echo $MY_TEST

# 验证你电脑上装了哪些工具
$ node --version 2>/dev/null || echo "Node.js 未安装"
$ git --version 2>/dev/null || echo "Git 未安装"
$ python3 --version 2>/dev/null || echo "Python3 未安装"
```

完成这三个练习，你就已经动手用过了本文大部分知识点。

---

## CLI 速查表

最后留一张速查表，随时查阅：

| 命令 | 作用 | 示例 |
|------|------|------|
| `pwd` | 显示当前目录 | `pwd` |
| `ls` | 列出文件 | `ls -la` |
| `cd` | 切换目录 | `cd ~/Documents` |
| `mkdir` | 创建目录 | `mkdir my-project` |
| `touch` | 创建空文件 | `touch index.html` |
| `cp` | 复制 | `cp -r src/ backup/` |
| `mv` | 移动/重命名 | `mv old.txt new.txt` |
| `rm` | 删除 | `rm -r old-project` |
| `cat` | 查看文件 | `cat config.json` |
| `less` | 翻页查看 | `less app.log` |
| `grep` | 搜索内容 | `grep "error" app.log` |
| `man` | 查看手册 | `man ls` |
| `echo` | 输出文本/变量 | `echo $PATH` |
| `which` | 查看命令路径 | `which node` |
| `>` | 覆盖写入文件 | `ls > files.txt` |
| `>>` | 追加写入文件 | `echo "done" >> log.txt` |
| `\|` | 管道传递 | `ps aux \| grep node` |

| 快捷键 | 作用 |
|--------|------|
| `Tab` | 自动补全 |
| `↑` / `↓` | 翻历史命令 |
| `Ctrl + C` | 中断命令 |
| `Ctrl + L` | 清屏 |
| `Ctrl + R` | 搜索历史 |
| `Ctrl + D` | 退出终端 |

---

## 最后

网上经常有人争论 GUI 和 CLI 哪个更好。这个问题其实没什么好争的——它们解决的是不同层面的问题。GUI 降低了使用门槛，CLI 提高了操作上限。对于日常使用，GUI 足够了；但当你想让 AI 真正帮你干活，CLI 是绕不开的一环。

很多人对命令行的恐惧，来自一个误解：觉得要"精通"才能用。事实上，你不需要记住几百个命令，不需要理解操作系统的底层原理，不需要变成一个运维工程师。这篇文章里的内容——十几个命令、几个核心概念、一套环境配置——已经足够你在 AI 时代把命令行用起来。

剩下的，交给实践。每天在终端里多待十分钟，遇到不会的命令问一下 AI，两周之后你会发现：命令行已经变成了你最自然的工作界面。

到那时候你会理解一件事——CLI 从来都不难，难的是迈出第一步。而你已经迈出来了。
