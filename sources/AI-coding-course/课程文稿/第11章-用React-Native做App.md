
## 11.1 为什么要做 App

你的 Web 产品上线了，用户在浏览器里用得挺好。为什么还要做 App？

**三个真实的原因：**

**第一，移动端流量占全球互联网流量的 60% 以上。** 很多用户习惯在手机上使用产品，如果你只有网页版，你流失了一半以上的潜在用户。

**第二，App 能做到网页做不到的事。** 推送通知（Push Notification）、离线使用、相机调用、本地存储、Widget——这些都是原生 App 的能力。如果你的产品需要这些功能，Web 版不够用。

**第三，App Store 和 Google Play 本身就是流量渠道。** 用户会在应用商店里搜索和发现产品。一个上了 App Store 的产品，多了一个被用户找到的入口。

但做 App 不意味着要从头学 Swift 和 Kotlin。你已经会 React 了（第 7、8 章用的就是 React），用 **React Native** 可以复用你的知识，一套代码同时生成 iOS 和 Android 应用。

---

## 11.2 React Native 是什么

### 一句话定义

React Native 是 Meta（Facebook）做的跨平台移动开发框架。你用 React 和 JavaScript/TypeScript 写代码，它帮你编译成真正的原生 App——不是网页套壳，是真正的 iOS 和 Android 应用。

### React Native vs 其他方案

| 方案 | 语言 | 优势 | 劣势 |
|------|------|------|------|
| **React Native** | TypeScript/JavaScript | 跟 Web 技术栈一致，学习成本最低 | 性能略逊于纯原生 |
| **Flutter** | Dart | 性能好、UI 一致性强 | 要学新语言 Dart |
| **Swift（iOS）+ Kotlin（Android）** | Swift / Kotlin | 性能最好 | 要写两套代码，两套语言 |
| **PWA（渐进式 Web 应用）** | HTML/CSS/JS | 最简单，就是你的网页 | 功能受限，iOS 支持差 |

**为什么推荐 React Native？**

你这门课学的是 React + TypeScript + Tailwind CSS。React Native 用的也是 React + TypeScript。**你的 Web 开发知识，大约 70% 可以直接迁移到 React Native 上。** 组件化思维、状态管理、Hooks 用法——全是一样的。

唯一的区别是：Web 里你用 `<div>` 和 `<span>`，React Native 里你用 `<View>` 和 `<Text>`。Web 里你用 CSS，React Native 里你用 StyleSheet（但如果用 NativeWind，还是 Tailwind 的写法）。

### 重要概念：Expo

**Expo** 是 React Native 的「全家桶」。它帮你处理了原生开发中最痛苦的部分——环境配置、原生模块编译、App 签名和打包。

不用 Expo 的 React Native 开发，你需要装 Xcode（Mac 才有）、Android Studio、各种 SDK、各种原生依赖。这个过程能折腾新手一整天。

用 Expo，你装一个 `npx create-expo-app`，直接就能开始写代码。手机上装一个 Expo Go App，扫码就能在真机上看到效果。

**这门课推荐用 Expo。** 现在的 Expo 已经非常成熟，绝大多数应用不需要「弹出」（eject）到原生代码。

---

## 11.3 环境搭建

### 你需要准备什么

| 项目 | 说明 |
|------|------|
| Node.js | 第 8 章已经装过了 |
| 一台 Mac（可选） | 如果要做 iOS App。不是 Mac 也能做 Android |
| 手机上装 Expo Go | 扫码就能在真机上预览你的 App |
| Apple Developer 账号 | 上架 App Store 需要，$99/年 |
| Google Play Developer 账号 | 上架 Google Play 需要，$25 一次性 |

### 创建项目

```bash
npx create-expo-app@latest my-app
cd my-app
npx expo start
```

终端会显示一个二维码。用手机上的 Expo Go 扫码，你的 App 就在手机上跑起来了。改代码、保存，手机上实时更新——跟 `npm run dev` 看网页一样的体验。

### 项目结构

Expo 用的是 **Expo Router**——文件系统路由，跟 Next.js 的 App Router 几乎一模一样：

```
my-app/
├── app/                    ← 页面路由（跟 Next.js 一样！）
│   ├── _layout.tsx         ← 根布局
│   ├── index.tsx           ← 首页（对应 Tab 的第一个）
│   ├── (tabs)/             ← Tab 导航
│   │   ├── _layout.tsx     ← Tab 导航配置
│   │   ├── home.tsx        ← 首页 Tab
│   │   ├── search.tsx      ← 搜索 Tab
│   │   └── profile.tsx     ← 个人资料 Tab
│   ├── summary/[id].tsx    ← 动态路由（跟 Next.js 的 [id] 一样！）
│   └── login.tsx           ← 登录页
├── components/             ← 可复用组件
├── lib/                    ← 工具函数
├── assets/                 ← 图片、字体等静态资源
└── package.json
```

**看到没？** `app/` 目录、动态路由 `[id]`、`_layout.tsx` 布局文件——你在 Next.js 里已经学过的概念，直接搬过来。

---

## 11.4 React Native 核心知识——跟 Web 的区别

### 基础组件对照表

React Native 没有 HTML 标签，但每个 HTML 标签都有一个对应的 React Native 组件：

| Web（HTML） | React Native | 说明 |
|-------------|-------------|------|
| `<div>` | `<View>` | 容器，用来布局 |
| `<p>` / `<span>` | `<Text>` | 文本，**所有文字必须包在 Text 里** |
| `<img>` | `<Image>` | 图片 |
| `<input>` | `<TextInput>` | 输入框 |
| `<button>` | `<Pressable>` / `<TouchableOpacity>` | 可点击的区域 |
| `<scroll>` | `<ScrollView>` / `<FlatList>` | 滚动容器 |
| `<a>` | `<Link>`（Expo Router） | 导航链接 |

**最重要的区别：所有文字必须放在 `<Text>` 组件里。** 在 Web 里你可以在 `<div>` 里直接写文字，React Native 不行——直接写文字会报错。

```tsx
// ❌ 报错
<View>Hello World</View>

// ✅ 正确
<View>
  <Text>Hello World</Text>
</View>
```

### 样式：用 NativeWind 写 Tailwind

React Native 原生的样式用 `StyleSheet.create`，写起来像 CSS 的 JavaScript 版：

```tsx
// 原生写法——啰嗦
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#000' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
})

<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
</View>
```

安装 **NativeWind** 之后，你可以直接用 Tailwind 的 `className` 写法——跟 Web 一样：

```tsx
// NativeWind 写法——跟 Web 一样的 Tailwind！
<View className="flex-1 p-4 bg-black">
  <Text className="text-2xl font-bold text-white">Hello</Text>
</View>
```

安装 NativeWind：

```bash
npx expo install nativewind tailwindcss
```

**这就是为什么我推荐 React Native + NativeWind 的组合——你在 Web 里用的 Tailwind class，App 里照搬。** `bg-black`、`text-white`、`p-4`、`rounded-lg`，全是一样的。

### 布局：默认 Flexbox

React Native 的布局默认就是 Flexbox，但有一个关键区别：**默认方向是纵向（column），不是横向（row）。**

```tsx
// Web 里 flexbox 默认是 row（横向排列）
// React Native 里默认是 column（纵向排列）

// 纵向排列（默认）
<View className="flex-1">
  <Text>第一行</Text>
  <Text>第二行</Text>
  <Text>第三行</Text>
</View>

// 横向排列（要手动指定）
<View className="flex-row">
  <Text>左边</Text>
  <Text>右边</Text>
</View>
```

### 导航：Tab 导航和 Stack 导航

移动 App 的导航模式跟 Web 不同。Web 是页面跳转（URL 变化），App 通常是两种导航：

**Tab 导航——** 底部几个标签页，点击切换。微信、淘宝、Instagram 都是这种。

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { Home, Search, User } from 'lucide-react-native'

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '发现',
          tabBarIcon: ({ color }) => <Search color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  )
}
```

**Stack 导航——** 页面从右边滑入，左上角有返回按钮。详情页、设置页通常是这种。

Expo Router 自动处理 Stack 导航。你只需要把页面文件放在 `app/` 目录下，用 `<Link href="/summary/123">` 跳转就行——跟 Next.js 的 `<Link>` 一模一样。

---

## 11.5 连接 Supabase——复用你的后端

**这是 React Native + Supabase 最大的优势：你的后端一行代码都不用改。**

你的 Web 应用用 Supabase 做数据库和认证。你的 App 可以直接连同一个 Supabase 项目——同一套数据、同一套 RLS 策略、同一套认证系统。

### 安装 Supabase 客户端

```bash
npx expo install @supabase/supabase-js expo-secure-store
```

`expo-secure-store` 是用来安全存储认证 Token 的——Web 里用 Cookie，App 里用 SecureStore。

### 配置 Supabase 客户端

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key) => SecureStore.getItemAsync(key),
      setItem: (key, value) => SecureStore.setItemAsync(key, value),
      removeItem: (key) => SecureStore.deleteItemAsync(key),
    },
    autoRefreshToken: true,
    persistSession: true,
  },
})
```

**关键区别只有一个：** Web 版用 Cookie 存 Session，App 版用 SecureStore 存 Session。除此之外，所有的数据查询和操作代码完全一样。

### 数据查询——跟 Web 一模一样

```typescript
// 获取摘要历史——跟你在 Web 里写的完全一样
const { data: summaries } = await supabase
  .from('summaries')
  .select('*')
  .order('created_at', { ascending: false })

// 获取用户信息
const { data: { user } } = await supabase.auth.getUser()
```

**你在 Web 版 Server Actions 里写的 Supabase 查询，直接复制到 App 里就能用。** 唯一的区别是 Web 版在服务端执行，App 版在客户端执行——但 RLS 策略保护你的数据安全，不需要担心。

---

## 11.6 App 里特有的能力

### 推送通知（Push Notification）

这是做 App 最核心的理由之一。Web 的通知能力有限（而且用户很少允许），但 App 的推送通知是杀手级功能。

Expo 提供了 `expo-notifications` 库，简化了推送通知的实现：

```bash
npx expo install expo-notifications expo-device
```

```typescript
import * as Notifications from 'expo-notifications'

// 请求推送权限
const { status } = await Notifications.requestPermissionsAsync()

// 获取推送 Token（发送到你的后端保存）
const token = await Notifications.getExpoPushTokenAsync()

// 发送推送通知（从你的后端调用 Expo Push API）
// POST https://exp.host/--/api/v2/push/send
// { "to": token, "title": "摘要已生成", "body": "点击查看结果" }
```

推送通知的完整流程：
1. App 启动时请求推送权限，获取用户的 Push Token
2. 把 Token 存到 Supabase 的 profiles 表里（加一个 `push_token` 字段）
3. 当长文摘要生成完成或用户有新消息时，你的后端（或 Supabase Edge Function）调用 Expo Push API 发送通知
4. 用户手机收到通知，点击后打开你的 App 对应的页面

### 离线缓存

App 可以在没有网络的时候继续工作——这对内容类产品特别有价值（用户在地铁上翻看已保存的摘要）。

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

// 获取数据时先查缓存
async function getSummaries() {
  const cached = await AsyncStorage.getItem('summaries')
  if (cached) return JSON.parse(cached)
  
  const { data } = await supabase.from('summaries').select('*')
  await AsyncStorage.setItem('summaries', JSON.stringify(data))
  return data
}
```

### 相机和相册

```bash
npx expo install expo-image-picker
```

```typescript
import * as ImagePicker from 'expo-image-picker'

// 从相册选图
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ['images'],
  allowsEditing: true,
  quality: 0.8,
})

if (!result.canceled) {
  // 上传到 Supabase Storage
  const file = result.assets[0]
  await supabase.storage
    .from('avatars')
    .upload(`${userId}/avatar.jpg`, file.uri)
}
```

上面是简化写法——真实环境里需要先把 `file.uri` 读成 ArrayBuffer 或 FormData 再上传。这类细节不用记，交给 AI 处理。

---

## 11.7 一套代码的复用策略

### 什么能复用

| 层级 | 能复用吗 | 说明 |
|------|---------|------|
| 业务逻辑（数据查询、计算、验证） | ✅ 完全复用 | Supabase 查询代码直接搬 |
| TypeScript 类型定义 | ✅ 完全复用 | 同一套数据库，同一套类型 |
| 状态管理逻辑 | ✅ 大部分复用 | React Hooks 通用 |
| UI 组件 | ❌ 需要重写 | View/Text vs div/span，样式体系不同 |
| 导航逻辑 | ⚠️ 部分复用 | 路由结构类似但导航模式不同 |
| 认证流程 | ⚠️ 部分复用 | 逻辑一样但 Token 存储方式不同 |

### 推荐的项目结构

如果你同时维护 Web 和 App，可以这样组织代码：

```
my-project/
├── packages/
│   └── shared/            ← 共享代码
│       ├── types/         ← TypeScript 类型定义
│       ├── utils/         ← 工具函数（价格计算、日期格式化）
│       └── queries/       ← Supabase 查询函数
├── apps/
│   ├── web/               ← Next.js Web 应用
│   └── mobile/            ← Expo React Native 应用
```

`shared` 里的代码两边都能用。UI 组件分开写——Web 用 shadcn/ui，App 用 React Native 组件。

但说实话，如果你是一个人做产品，这种 monorepo 结构增加了复杂度。**更实际的做法是：Web 和 App 各建一个独立项目，手动复制共用的类型定义和工具函数。** 等产品做大了再考虑 monorepo。

---

## 11.8 打包和上架

### iOS 上架流程

**第一，注册 Apple Developer 账号。**

去 developer.apple.com 注册，$99/年。需要一张国际信用卡。

**第二，用 EAS Build 打包。**

Expo 提供了 EAS（Expo Application Services）云端打包服务——你不需要本地装 Xcode，代码推到 Expo 服务器，它帮你在云端编译：

```bash
npm install -g eas-cli
eas login
eas build --platform ios
```

打包完成后会给你一个 `.ipa` 文件。

**第三，提交到 App Store Connect。**

```bash
eas submit --platform ios
```

EAS 自动把你的 `.ipa` 上传到 App Store Connect。然后你在 App Store Connect 网页里填写 App 信息——名称、描述、截图、分类——提交审核。

**第四，通过审核。**

Apple 的审核通常 1-3 天。常见的拒绝原因：
- 没有隐私政策链接
- App 描述跟实际功能不符
- 有 bug 或崩溃
- 使用了未经授权的第三方服务

### Android 上架流程

**第一，注册 Google Play Developer 账号。**

去 play.google.com/console 注册，$25 一次性费用。

**第二，用 EAS Build 打包。**

```bash
eas build --platform android
```

给你一个 `.aab` 文件。

**第三，上传到 Google Play Console。**

```bash
eas submit --platform android
```

在 Google Play Console 里填写 App 信息、上传截图、提交审核。

Google 的审核比 Apple 宽松，通常几小时到一天。

### 费用对比

| 项目 | iOS | Android |
|------|-----|---------|
| 开发者账号 | $99/年 | $25（一次性） |
| EAS Build 免费额度 | 每月有免费构建配额（数量以官网为准） | 同左 |
| Apple/Google 分成 | 30%；年收入低于 $100 万可申请小企业计划降至 15% | 30%；首个 $100 万收入按 15% |
| 审核时间 | 1-3 天 | 几小时到 1 天 |

**对独立开发者的建议：先上 Android。** $25 的成本、审核快、限制少。验证了产品之后再花 $99/年上 iOS。

---

## 11.9 AI 工具在 App 开发中的应用

AI 编码工具对 React Native 开发同样有效：

**Cursor：**

在 Cursor 里写 React Native 代码，Tab 补全和 Chat 的质量跟写 Web 代码一样好。因为 React Native 的代码本质上还是 React + TypeScript，AI 的训练数据里大量存在。

提示词技巧：在 `.cursor/rules` 里加上 React Native 相关的规则：

```markdown
- 使用最新稳定版 Expo SDK + Expo Router
- 样式用 NativeWind（Tailwind CSS for React Native）
- 导航用 expo-router 的文件系统路由
- 文本必须包在 <Text> 组件里
- 不要用 React Native 的 StyleSheet，用 NativeWind className
```

**Claude Code：**

特别适合做 Web 到 App 的代码迁移。你可以说：

```
看一下 web/src/actions/summary.ts 里的摘要查询逻辑，
帮我在 mobile/lib/queries/summary.ts 里写对应的 App 版本。
数据库查询逻辑一样，但要适配客户端直连 Supabase 的模式。
```

Claude Code 会对比两边的代码，保留查询逻辑、调整认证方式。

---

## 总结

- React Native + Expo 让你用 React + TypeScript 做 iOS 和 Android 应用——70% 的 Web 知识可以直接迁移
- Expo Router 的文件系统路由跟 Next.js App Router 几乎一模一样
- NativeWind 让你在 App 里继续用 Tailwind CSS 写样式
- Supabase 后端完全复用——同一个数据库、同一套 RLS、数据查询代码直接搬
- App 特有能力：推送通知、离线缓存、相机相册
- EAS Build 云端打包，不需要本地装 Xcode 或 Android Studio
- 先上 Android（$25），验证后再上 iOS（$99/年）

App 是可选路线，做不做都不影响主线。下一章回到后端——深入 Supabase（进阶可选），之后进入用户、核心功能、支付的业务开发。

---

### 课后作业

1. 运行 `npx create-expo-app@latest my-app`，用手机上的 Expo Go 扫码看看效果
2. 把 Expo 项目连接到你现有的 Supabase 项目，查询一条数据并显示在页面上
3. 用 NativeWind 给一个页面写样式，对比一下跟 Web 版 Tailwind 的区别
4. 用 Cursor 在 App 项目里生成一个页面——在 `.cursor/rules` 里提前配好 React Native 的规范
