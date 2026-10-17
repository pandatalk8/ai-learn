

---

## 12.1 为什么需要这一章

第 8~10 章你把项目搭起来、配好测试、部署上线了。接下来的用户、核心功能、支付章节会大量用到 Supabase。这一章是进阶可选内容——你可以先通读建立认知，也可以在后面的业务章节遇到问题时回来查。

MVP 阶段追求「能用就行」。但当你的产品开始有真实用户之后，你会遇到一堆新问题：

- 数据库查询越来越慢——你的表没有加索引
- 某些数据谁都能看到——你的 RLS 策略没配对
- 你想实现「当用户下单后自动发邮件」——你不知道该在哪写这个逻辑
- 你想做实时聊天或实时通知——普通的 API 轮询太慢了
- 图片上传越来越多——你需要文件存储和 CDN

这一章就是解决这些问题的。**它不是 Supabase 文档的翻译，而是教你怎么用 Supabase 构建真正的后端业务逻辑。**

说明一下：这一章用「在线课程平台」作为贯穿示例——它的表关系（课程、课时、购买、学习进度）比摘要工具复杂，更适合展示后端设计。所有方法同样适用于你自己的产品。

---

## 12.2 数据库设计——从「能用」到「好用」

### 表结构设计原则

在后面的业务章节里，你会让 AI 帮你建表，能用了就往下走。但数据库设计不只是「建几张表」——好的设计让你后续的开发效率翻倍，坏的设计让你每加一个功能都在还技术债。

**原则一：一张表只存一类东西。**

```
❌ 错误：把课程信息和课程内容放在同一张表
courses: id, title, description, price, lesson_1_content, lesson_2_content, ...

✅ 正确：拆成课程表和课时表
courses: id, title, description, price
lessons: id, course_id, title, content, sort_order
```

为什么？因为一门课有几十个课时。如果都塞在一张表里，你每次查课程列表都要把所有课时内容一起查出来——数据量巨大、速度极慢。拆成两张表后，查列表只查 courses 表（几 KB），查具体课时才查 lessons 表。

**原则二：用外键建立表之间的关系。**

```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author_id uuid references profiles(id) not null,
  price numeric(10,2) default 0,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz default now()
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  content text,
  sort_order integer default 0,
  estimated_minutes integer default 10
);
```

`references courses(id)` 就是外键——它告诉数据库「这个 `course_id` 必须是 courses 表里真实存在的一条记录」。如果你试图插入一个不存在的 `course_id`，数据库直接报错。

`on delete cascade` 的意思是：如果一门课被删除了，它下面的所有课时也自动删除。不写这个的话，删课程会报错（因为还有课时在引用它）。

**原则三：用 check 约束限制字段值。**

```sql
status text default 'draft' check (status in ('draft', 'published', 'archived'))
```

这行代码告诉数据库：`status` 字段只能是这三个值之一。如果有人（或有 bug 的代码）试图设一个 `status = 'actve'`（拼写错误），数据库会拒绝这次操作。

**这比在应用代码里做验证更可靠——因为数据库是最后一道防线。** 不管你的代码怎么写、有没有 bug，数据库层面的约束永远生效。

### 索引——让查询快 100 倍

当你的表有几千条数据时，查询速度不是问题。但当数据量到了几万、几十万条，没有索引的查询会变得很慢。

**什么是索引？**

打个比方：数据库表是一本书，索引就是书的目录。没有目录的时候，你要找某个内容得一页一页翻；有了目录，直接翻到对应页码。

```sql
-- 你经常按 author_id 查询课程
create index idx_courses_author on courses(author_id);

-- 你经常按 status 筛选已发布的课程
create index idx_courses_status on courses(status);

-- 你经常按 course_id 查询课时并排序
create index idx_lessons_course_order on lessons(course_id, sort_order);
```

**什么时候加索引？**

不是所有字段都需要索引。加索引会增加写入数据的成本（每次插入和更新都要同步更新索引）。经验法则：

| 情况 | 要不要加索引 |
|------|-----------|
| WHERE 子句里经常出现的字段 | ✅ 加 |
| 外键字段（course_id, user_id） | ✅ 加（Supabase 不自动创建外键索引） |
| ORDER BY 排序字段 | ✅ 加 |
| 很少用来查询的字段（content, description） | ❌ 不加 |
| 数据量很小的表（< 1000 行） | ❌ 不需要 |

**怎么知道你的查询慢不慢？**

在 Supabase 后台，打开 SQL Editor，运行：

```sql
explain analyze
select * from courses where status = 'published' order by created_at desc;
```

`explain analyze` 会告诉你这个查询用了多长时间、有没有用到索引。如果你看到 `Seq Scan`（顺序扫描），说明没有用索引——数据量大时会很慢。加了索引后会变成 `Index Scan`。

### 用 AI 设计数据库

你不需要自己从零设计表结构。告诉 AI 你的产品功能，让它帮你设计：

```
我在做一个在线课程平台，功能包括：
1. 讲师创建和编辑课程（每门课有多个模块，每个模块有多节课时）
2. 学生购买课程并学习
3. 学生可以在每节课时下写笔记
4. 学生可以标记课时为「已完成」
5. 学生可以给课程打分和评论

帮我设计 Supabase 的数据库表结构，包含：
- 表定义（SQL）
- 索引
- RLS 策略
- 各表之间的关系图（用 ASCII 画）
```

AI 会给你一个完整的数据库设计方案，你审核后直接用。

---

## 12.3 RLS——数据库层面的权限控制

### 什么是 RLS

RLS（Row Level Security，行级安全策略）是 Supabase 最重要的安全特性。它在数据库层面控制「谁能看到哪些数据、谁能修改哪些数据」。

你可能会想：「权限不是在代码里判断就行了吗？比如 `if (user.id === course.author_id)`？」

代码里的权限检查有一个致命问题——**如果你漏了一处检查，数据就暴露了。** 你有十个查询课程的地方，只要一个地方忘了加权限判断，攻击者就能通过那个入口获取所有人的数据。

RLS 不一样。它在数据库层面生效——不管你的代码怎么写、有多少入口，只要 RLS 策略说「用户只能看自己的订单」，那用户就只能看自己的订单。没有例外。

### RLS 策略的四种操作

```sql
-- 1. SELECT 策略：谁能读数据
create policy "users can view published courses"
  on courses for select
  using (status = 'published');

-- 2. INSERT 策略：谁能插入数据
create policy "authenticated users can create courses"
  on courses for insert
  to authenticated
  with check (author_id = auth.uid());

-- 3. UPDATE 策略：谁能修改数据
create policy "authors can update own courses"
  on courses for update
  to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

-- 4. DELETE 策略：谁能删除数据
create policy "authors can delete own courses"
  on courses for delete
  to authenticated
  using (author_id = auth.uid());
```

拆解一下关键语法：

| 语法 | 含义 |
|------|------|
| `for select` / `insert` / `update` / `delete` | 这条策略控制哪种操作 |
| `to authenticated` | 只对登录用户生效。不写就对所有人生效（包括匿名用户） |
| `using (...)` | 条件表达式——「哪些行」可以被操作 |
| `with check (...)` | INSERT 和 UPDATE 时检查新数据是否满足条件 |
| `auth.uid()` | 当前登录用户的 ID（Supabase 内置函数） |

### 常见的 RLS 模式

**模式一：公开可读，只有作者能改。**

适用于课程、文章、产品列表——所有人都能看，但只有创建者能编辑。

```sql
-- 任何人都能看已发布的课程
create policy "public can view published courses"
  on courses for select
  using (status = 'published');

-- 作者能看自己所有课程（包括草稿）
create policy "authors can view own courses"
  on courses for select
  to authenticated
  using (author_id = auth.uid());

-- 只有作者能修改
create policy "authors can update own courses"
  on courses for update
  to authenticated
  using (author_id = auth.uid());
```

**模式二：只能操作自己的数据。**

适用于笔记、收藏、学习进度——纯私人数据。

```sql
create policy "users can manage own notes"
  on learning_notes for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

`for all` 是 `for select, insert, update, delete` 的简写。

**模式三：购买后才能访问。**

适用于付费内容——需要检查用户是否购买了对应的课程。

```sql
create policy "buyers can view course lessons"
  on lessons for select
  to authenticated
  using (
    exists (
      select 1 from course_purchases
      where course_purchases.course_id = lessons.course_id
        and course_purchases.user_id = auth.uid()
    )
    or
    exists (
      select 1 from courses
      where courses.id = lessons.course_id
        and courses.author_id = auth.uid()
    )
  );
```

这条策略的意思是：用户只能查看「已购买的课程的课时」或「自己创建的课程的课时」。

### RLS 调试技巧

RLS 策略写错了，数据可能查不出来，也不会报错——只是返回空数组。这很难调试。

**技巧一：在 SQL Editor 里模拟用户身份。**

```sql
-- 切换到某个用户的身份
set request.jwt.claims = '{"sub": "用户的 UUID"}';
set role authenticated;

-- 执行查询
select * from courses;

-- 重置身份
reset role;
```

**技巧二：临时关闭 RLS 排查问题。**

在 Supabase 后台的 Table Editor 里，点击表名旁边的盾牌图标，可以临时禁用 RLS。如果禁用后数据查出来了，说明是 RLS 策略的问题——回去检查策略条件。

**记得调试完后重新启用 RLS。** 生产环境关着 RLS 等于不设防。

---

## 12.4 Server Actions——Next.js 里的后端逻辑

### 为什么用 Server Actions 而不是 API Routes

Next.js 提供了两种写后端逻辑的方式：API Routes 和 Server Actions。

| 维度 | API Routes | Server Actions |
|------|-----------|---------------|
| 写法 | 在 `/api/` 目录下写路由处理函数 | 在任意 `.ts` 文件里加 `'use server'` |
| 调用方式 | 前端用 `fetch` 手动调用 | 前端直接调用函数（Next.js 自动处理） |
| 类型安全 | 需要手动定义请求/响应类型 | 函数参数和返回值自带类型（TypeScript） |
| 适合场景 | Webhook、第三方回调、公开 API | 表单提交、数据查询、业务逻辑 |

**在你的产品里，90% 的后端逻辑用 Server Actions 写。** 只有 Webhook 这种需要被外部服务调用的接口才用 API Routes。

### Server Action 的基本写法

```typescript
// src/actions/course.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCourse(formData: FormData) {
  const supabase = await createClient()
  
  // 1. 获取当前用户
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user) throw new Error('未登录')
  
  // 2. 从表单获取数据
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  
  // 3. 数据验证
  if (!title || title.length < 2) {
    return { error: '课程标题至少 2 个字符' }
  }
  if (price < 0) {
    return { error: '价格不能为负数' }
  }
  
  // 4. 插入数据库
  const { data, error } = await supabase
    .from('courses')
    .insert({
      title,
      description,
      price,
      author_id: user.id,
      status: 'draft',
    })
    .select()
    .single()
  
  if (error) {
    return { error: '创建失败，请重试' }
  }
  
  // 5. 刷新页面缓存
  revalidatePath('/dashboard')
  
  return { data }
}
```

**拆解关键步骤：**

1. **`'use server'`**——告诉 Next.js 这个文件里的函数只在服务端运行
2. **获取当前用户**——通过 Supabase Auth 验证用户身份
3. **数据验证**——在服务端再做一次验证（前端验证可以被绕过）
4. **数据库操作**——插入数据，处理错误
5. **`revalidatePath`**——告诉 Next.js 刷新这个路径的缓存，下次访问时会重新获取数据

### 在页面里调用 Server Action

**方式一：用 form 表单（最简单）**

```tsx
// src/app/dashboard/create/page.tsx
import { createCourse } from '@/actions/course'

export default function CreateCoursePage() {
  return (
    <form action={createCourse}>
      <input name="title" placeholder="课程标题" required />
      <textarea name="description" placeholder="课程描述" />
      <input name="price" type="number" step="0.01" placeholder="价格" />
      <button type="submit">创建课程</button>
    </form>
  )
}
```

`form` 的 `action` 属性直接传 Server Action 函数。用户点提交按钮，Next.js 自动把表单数据发到服务端、调用 `createCourse` 函数。

**方式二：用 useActionState（需要 loading 状态和错误提示）**

```tsx
'use client'

import { useActionState } from 'react'
import { createCourse } from '@/actions/course'

export default function CreateCourseForm() {
  const [state, formAction, isPending] = useActionState(createCourse, null)
  
  return (
    <form action={formAction}>
      <input name="title" placeholder="课程标题" required />
      <textarea name="description" placeholder="课程描述" />
      <input name="price" type="number" step="0.01" placeholder="价格" />
      
      {state?.error && (
        <p className="text-red-500">{state.error}</p>
      )}
      
      <button type="submit" disabled={isPending}>
        {isPending ? '创建中...' : '创建课程'}
      </button>
    </form>
  )
}
```

`useActionState` 给你三样东西：上一次的返回值（`state`）、包装后的 action（`formAction`）、加载状态（`isPending`）。你可以用 `isPending` 显示 loading 动画，用 `state.error` 显示错误信息。

**方式三：在事件处理里直接调用（非表单场景）**

```tsx
'use client'

import { toggleBookmark } from '@/actions/bookmark'

export default function BookmarkButton({ courseId }: { courseId: string }) {
  async function handleClick() {
    const result = await toggleBookmark(courseId)
    if (result.error) {
      alert(result.error)
    }
  }
  
  return <button onClick={handleClick}>收藏</button>
}
```

---

## 12.5 复杂查询模式

### 关联查询（Join）

Supabase 的客户端库支持用点号语法做关联查询——不需要手写 SQL JOIN：

```typescript
// 查询课程及其所有课时
const { data } = await supabase
  .from('courses')
  .select(`
    id,
    title,
    price,
    author:profiles(id, full_name, avatar_url),
    lessons(id, title, sort_order, estimated_minutes)
  `)
  .eq('status', 'published')
  .order('created_at', { ascending: false })
```

这条查询返回的数据结构是：

```json
{
  "id": "xxx",
  "title": "AI 出海实战",
  "price": 49.99,
  "author": { "id": "yyy", "full_name": "张三", "avatar_url": "..." },
  "lessons": [
    { "id": "z1", "title": "第一课", "sort_order": 1, "estimated_minutes": 15 },
    { "id": "z2", "title": "第二课", "sort_order": 2, "estimated_minutes": 20 }
  ]
}
```

**一次查询拿到了课程信息 + 作者信息 + 所有课时。** 不需要先查课程、再用 `author_id` 查作者、再用 `course_id` 查课时——那样要三次请求，效率低。

### 分页查询

数据量大了之后，你不能一次查出所有记录。分页查询：

```typescript
const PAGE_SIZE = 20

async function getCourses(page: number) {
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  
  const { data, count } = await supabase
    .from('courses')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to)
  
  return {
    courses: data,
    totalPages: Math.ceil((count || 0) / PAGE_SIZE),
  }
}
```

`{ count: 'exact' }` 让 Supabase 同时返回总记录数，这样你就知道一共有多少页了。

### 全文搜索

Supabase 基于 PostgreSQL，原生支持全文搜索：

```sql
-- 先给表加全文搜索索引
alter table courses add column fts tsvector
  generated always as (to_tsvector('english', title || ' ' || coalesce(description, ''))) stored;
create index idx_courses_fts on courses using gin(fts);
```

```typescript
// 在代码里搜索
const { data } = await supabase
  .from('courses')
  .select('*')
  .textSearch('fts', 'AI machine learning')
  .eq('status', 'published')
```

这比 `ilike '%keyword%'` 的模糊搜索强很多——全文搜索支持词根匹配（`learning` 能匹配 `learn`）、忽略停用词（`the`、`is`）、结果排序。

### 数据库函数（RPC）

有些业务逻辑在应用代码里写很复杂，但在 SQL 里写一个函数就几行。比如「获取用户的学习统计数据」：

```sql
create or replace function get_user_stats(target_user_id uuid)
returns json as $$
  select json_build_object(
    'total_courses', (
      select count(*) from course_purchases where user_id = target_user_id
    ),
    'completed_lessons', (
      select count(*) from learning_progress
      where user_id = target_user_id and completed = true
    ),
    'total_notes', (
      select count(*) from learning_notes where user_id = target_user_id
    ),
    'study_streak_days', (
      select count(distinct date(created_at)) from learning_progress
      where user_id = target_user_id
        and created_at > now() - interval '30 days'
    )
  );
$$ language sql security definer;
```

在代码里用一行调用：

```typescript
const { data: stats } = await supabase.rpc('get_user_stats', {
  target_user_id: user.id,
})
// stats = { total_courses: 5, completed_lessons: 42, total_notes: 18, study_streak_days: 7 }
```

**`security definer` 的意思是：** 这个函数用创建者的权限执行，不受 RLS 限制。适合跨表统计这种需要全局视角的操作。但要注意：函数里要自己做权限检查（确保只返回该用户的数据），不然就绕过了 RLS 的保护。

---

## 12.6 Realtime——实时功能

### 什么时候需要 Realtime

普通的数据查询是「你主动问，服务器回答」。但有些场景你需要数据**主动推送**到客户端：

- 实时聊天——对方发消息你立刻看到
- 实时通知——有人评论了你的课程
- 协作编辑——多人同时编辑一个文档
- 实时仪表盘——订单数据实时更新

Supabase 内置了 Realtime 功能，基于 WebSocket 连接，不需要你搭额外的服务。

### 监听数据变化

```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useRealtimeComments(lessonId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  
  useEffect(() => {
    // 先加载已有评论
    supabase
      .from('lesson_comments')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('lesson_id', lessonId)
      .order('created_at')
      .then(({ data }) => setComments(data || []))
    
    // 监听新评论
    const channel = supabase
      .channel(`comments:${lessonId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'lesson_comments',
          filter: `lesson_id=eq.${lessonId}`,
        },
        async (payload) => {
          // 新评论来了，查一下完整数据（包括作者信息）
          const { data } = await supabase
            .from('lesson_comments')
            .select('*, author:profiles(full_name, avatar_url)')
            .eq('id', payload.new.id)
            .single()
          
          if (data) {
            setComments(prev => [...prev, data])
          }
        }
      )
      .subscribe()
    
    // 组件卸载时取消监听
    return () => {
      supabase.removeChannel(channel)
    }
  }, [lessonId])
  
  return comments
}
```

**这段代码做了什么：** 先加载已有的评论，然后建立一个 WebSocket 连接，持续监听 `lesson_comments` 表的新增记录。有人发了新评论，你的页面上立刻显示——不需要刷新。

### Realtime 的注意事项

**第一，要在 Supabase 后台开启 Realtime。**

进入 Database → Replication，找到你要监听的表，开启 Realtime。默认是关闭的。

**第二，Realtime 有连接数限制。**

免费版最多 200 个并发连接，Pro 版最多 500 个。如果你的产品同时在线用户超过这个数，需要升级方案或优化连接策略（比如只在需要的页面建立连接）。

**第三，不要监听大表的所有变化。**

一定要用 `filter` 参数过滤——只监听你关心的数据变化。监听整张表的所有变化会消耗大量资源。

---

## 12.7 Storage——文件存储

### Supabase Storage 基本用法

你的产品里可能需要存文件——用户头像、课程封面、课件附件。Supabase Storage 提供了类似 AWS S3 的文件存储服务。

**第一步：创建 Bucket。**

在 Supabase 后台 → Storage → New Bucket：
- 名称：`avatars`（或 `covers`、`attachments`）
- 选择 Public 或 Private——头像通常是 Public（任何人都能看），私密文件选 Private

**第二步：上传文件。**

```typescript
async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`
  
  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true,  // 如果已存在就覆盖
    })
  
  if (error) throw error
  
  // 获取公开 URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)
  
  // 更新用户资料里的头像 URL
  await supabase
    .from('profiles')
    .update({ avatar_url: data.publicUrl })
    .eq('id', userId)
  
  return data.publicUrl
}
```

**第三步：配置 Storage 的 RLS。**

Storage 也有 RLS 策略——控制谁能上传、谁能下载、谁能删除文件：

```sql
-- 任何人都能查看 avatars bucket 的文件
create policy "public can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- 用户只能上传到自己的目录
create policy "users can upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## 12.8 Edge Functions——无服务器后端函数

### 什么时候需要 Edge Functions

Server Actions 已经能处理大部分后端逻辑。但有些场景 Server Actions 做不了：

- **定时任务**——每天凌晨清理过期数据
- **Webhook 处理**——接收第三方服务的回调（这个也可以用 API Routes）
- **复杂的异步任务**——生成 PDF、发送批量邮件、调用多个外部 API
- **跟 Supabase 数据库事件联动**——数据库触发器触发后执行自定义逻辑

Supabase Edge Functions 是运行在 Deno 环境里的无服务器函数。

### 创建和部署

```bash
# 安装 Supabase CLI（不支持 npm 全局安装）
# Mac：
brew install supabase/tap/supabase
# 或者装进项目里，用 npx 调用：
npm install supabase --save-dev

# 创建一个 Edge Function
npx supabase functions new send-welcome-email

# 编辑函数
# supabase/functions/send-welcome-email/index.ts
```

```typescript
// supabase/functions/send-welcome-email/index.ts
Deno.serve(async (req) => {
  const { user_id, email } = await req.json()
  
  // 调用邮件服务（比如 Resend）
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'noreply@yoursite.com',
      to: email,
      subject: '欢迎加入！',
      html: '<h1>欢迎来到我们的平台！</h1>',
    }),
  })
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

```bash
# 部署到 Supabase
npx supabase functions deploy send-welcome-email
```

### 用数据库触发器调用 Edge Function

最强大的用法是：**数据库表发生变化时，自动触发 Edge Function。**

比如「用户注册后自动发欢迎邮件」：

```sql
-- 创建触发器函数
create or replace function handle_new_user()
returns trigger as $$
begin
  perform net.http_post(
    url := 'https://你的项目.supabase.co/functions/v1/send-welcome-email',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key')
    ),
    body := json_build_object('user_id', new.id, 'email', new.email)::jsonb
  );
  return new;
end;
$$ language plpgsql security definer;

-- 绑定到 profiles 表的 INSERT 事件
create trigger on_new_user
  after insert on profiles
  for each row
  execute function handle_new_user();
```

注意其中的密钥处理：Service Role Key 要先存进 Supabase Vault（后台 Settings → Vault），SQL 里从 Vault 读取，不要把密钥写死在触发器里。这些细节让 AI 帮你处理即可。

现在，每当 `profiles` 表有新用户注册，数据库自动调用 Edge Function 发送欢迎邮件。你的应用代码里不需要写任何发邮件的逻辑——数据库触发器处理一切。

---

## 12.9 用 AI 写后端代码

后端代码的逻辑通常比前端代码更清晰——输入是什么、输出是什么、中间做什么操作，都是确定的。这意味着 AI 写后端代码的准确率比写前端 UI 更高。

### 给 AI 写后端代码的提示词模板

```
写一个 Server Action：[功能描述]

输入：[参数列表]
输出：{ data: [成功返回什么], error: [失败返回什么] }

业务逻辑：
1. [第一步]
2. [第二步]
3. [第三步]

权限要求：[谁能调用]
数据库表：[涉及哪些表]
```

**实际例子：**

```
写一个 Server Action：用户购买课程。

输入：courseId (string)
输出：{ data: { purchase_id }, error: string }

业务逻辑：
1. 验证用户已登录
2. 查询课程价格
3. 检查用户余额是否足够
4. 扣减用户余额（balance_transactions 表插入一条消费记录）
5. 创建购买记录（course_purchases 表）
6. 如果余额不足，返回错误信息

权限要求：已登录用户
数据库表：courses, profiles, balance_transactions, course_purchases

注意：步骤 4 和 5 需要在同一个事务里执行，防止扣了钱但没创建购买记录。
```

AI 会根据这个模板生成完整的 Server Action，包括错误处理、类型定义、事务控制。

### 事务——多步操作的原子性

上面的「购买课程」涉及两步数据库操作：扣余额 + 创建购买记录。如果扣了余额但创建购买记录失败了怎么办？用户的钱扣了，但没有获得课程——这是不可接受的。

解决方案是**数据库事务**——要么两步都成功，要么两步都回滚。在 Supabase 里，用数据库函数实现事务：

```sql
create or replace function purchase_course(
  p_user_id uuid,
  p_course_id uuid
) returns json as $$
declare
  v_price numeric;
  v_balance numeric;
  v_purchase_id uuid;
begin
  -- 查课程价格
  select price into v_price from courses where id = p_course_id;
  if not found then
    return json_build_object('error', '课程不存在');
  end if;
  
  -- 查用户余额
  select balance into v_balance from profiles where id = p_user_id;
  if v_balance < v_price then
    return json_build_object('error', '余额不足');
  end if;
  
  -- 扣余额
  update profiles set balance = balance - v_price where id = p_user_id;
  
  -- 创建购买记录
  insert into course_purchases (user_id, course_id, amount)
  values (p_user_id, p_course_id, v_price)
  returning id into v_purchase_id;
  
  -- 记录交易
  insert into balance_transactions (user_id, amount, type, description)
  values (p_user_id, -v_price, 'purchase', '购买课程');
  
  return json_build_object('data', json_build_object('purchase_id', v_purchase_id));
end;
$$ language plpgsql security definer;
```

如果中间任何一步失败，PostgreSQL 自动回滚所有操作——余额不会被扣、购买记录不会被创建。

在 Server Action 里调用：

```typescript
export async function purchaseCourse(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登录' }
  
  const { data, error } = await supabase.rpc('purchase_course', {
    p_user_id: user.id,
    p_course_id: courseId,
  })
  
  if (error) return { error: '购买失败' }
  if (data.error) return { error: data.error }
  
  revalidatePath('/learn')
  return { data: data.data }
}
```

---

## 总结

- **数据库设计**：一张表存一类数据、用外键建立关系、用 check 约束限制字段值、给常用查询字段加索引
- **RLS**：在数据库层面控制权限——公开可读、私有数据、购买后访问三种模式
- **Server Actions**：Next.js 的后端逻辑标准写法——`'use server'`、获取用户、验证数据、操作数据库、刷新缓存
- **复杂查询**：关联查询（`.select('*, author:profiles(*)')`）、分页（`.range()`）、全文搜索（`.textSearch()`）、数据库函数（`.rpc()`）
- **Realtime**：用 WebSocket 监听数据库变化，实现实时功能
- **Storage**：文件上传和管理，配合 RLS 控制访问权限
- **Edge Functions**：无服务器函数 + 数据库触发器，实现自动化流程
- **事务**：用数据库函数包裹多步操作，保证原子性

这一章的内容不需要一次全部掌握——知道每种能力的存在和适用场景，需要时回来查。下一章进入用户业务：注册、登录、个人资料，产品的第一块真实业务。

### 课后作业

1. 给你的项目设计一张新表（带外键、索引、check 约束），用 SQL Editor 创建并写 RLS 策略
2. 写一个包含关联查询的 Server Action——一次查询获取主表和关联表的数据
3. 用 `explain analyze` 检查你最常用的查询，看是否用到了索引
4. 尝试用 Supabase Realtime 监听一张表的变化——在一个浏览器窗口里插入数据，在另一个窗口里观察实时更新
