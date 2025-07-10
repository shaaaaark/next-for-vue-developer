# 第十章：数据库集成与CRUD操作

> 从Vue的前后端分离到Next.js的全栈开发，掌握现代数据库集成最佳实践

## 🎯 学习目标

- 理解Next.js全栈开发的数据库集成方案
- 掌握Prisma ORM的使用和配置
- 学会在Server Actions中实现CRUD操作
- 对比Vue和Next.js的数据库操作方式
- 实现类型安全的数据查询和操作
- 掌握数据验证、错误处理和缓存策略

## 📖 技术栈对比

### Vue生态 vs Next.js生态

| 方面 | Vue生态 | Next.js生态 |
|------|---------|-------------|
| **架构模式** | 前后端分离 | 全栈一体化 |
| **后端框架** | Express.js、Koa.js | Next.js内置API路由 |
| **ORM选择** | Sequelize、TypeORM、Mongoose | Prisma（推荐）、Drizzle |
| **API设计** | RESTful API | Server Actions + API路由 |
| **类型安全** | 需要手动同步类型 | 端到端类型安全 |
| **数据获取** | axios、fetch在组件中 | Server Components中直接查询 |
| **表单处理** | v-model + API调用 | Server Actions直接处理 |
| **状态管理** | Vuex/Pinia管理服务端数据 | React Query/SWR或直接Server Actions |

## 🔧 技术栈选择

### 推荐配置

```typescript
// 我们的技术栈
{
  "数据库": "SQLite（开发）/ PostgreSQL（生产）",
  "ORM": "Prisma",
  "验证": "Zod",
  "表单": "Server Actions",
  "认证": "NextAuth.js",
  "部署": "Vercel"
}
```

### 为什么选择Prisma？

1. **类型安全**: 自动生成TypeScript类型
2. **迁移简单**: 可视化的数据库schema管理
3. **查询优化**: 自动N+1查询优化
4. **生态完善**: Next.js官方推荐
5. **开发体验**: 出色的IDE支持和错误提示

## 🚀 项目实战：博客管理系统

我们将扩展现有的博客演示，创建一个完整的数据库驱动应用。

### 数据模型设计

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // 关系
  posts     Post[]
  comments  Comment[]
  
  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  excerpt   String?
  slug      String   @unique
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // 关系
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  tags      PostTag[]
  
  @@map("posts")
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  
  // 关系
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  @@map("comments")
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts PostTag[]
  
  @@map("tags")
}

model PostTag {
  postId String
  tagId  String
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([postId, tagId])
  @@map("post_tags")
}
```

## 📊 Vue vs Next.js CRUD对比

### 1. 数据库连接

**Vue + Express方式:**
```javascript
// server/config/database.js
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
})

// server/models/Post.js
const Post = sequelize.define('Post', {
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  published: DataTypes.BOOLEAN
})

// server/routes/posts.js
app.get('/api/posts', async (req, res) => {
  const posts = await Post.findAll()
  res.json(posts)
})
```

**Next.js + Prisma方式:**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// app/posts/page.tsx (Server Component)
import { prisma } from '@/lib/prisma'

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: { author: true }
  })
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>by {post.author.name}</p>
        </article>
      ))}
    </div>
  )
}
```

### 2. 创建操作 (Create)

**Vue方式:**
```vue
<template>
  <form @submit.prevent="createPost">
    <input v-model="form.title" placeholder="标题" />
    <textarea v-model="form.content" placeholder="内容"></textarea>
    <button type="submit">发布</button>
  </form>
</template>

<script setup>
import axios from 'axios'

const form = ref({
  title: '',
  content: ''
})

const createPost = async () => {
  try {
    await axios.post('/api/posts', form.value)
    // 成功处理
  } catch (error) {
    // 错误处理
  }
}
</script>
```

**Next.js方式:**
```tsx
// actions/posts.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  content: z.string().min(1, '内容不能为空'),
  authorId: z.string()
})

export async function createPost(formData: FormData) {
  const result = createPostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    authorId: formData.get('authorId')
  })
  
  if (!result.success) {
    return { error: result.error.format() }
  }
  
  try {
    const post = await prisma.post.create({
      data: {
        ...result.data,
        slug: generateSlug(result.data.title)
      }
    })
    
    revalidatePath('/posts')
    return { success: true, post }
  } catch (error) {
    return { error: '创建失败' }
  }
}

// components/CreatePostForm.tsx
import { createPost } from '@/actions/posts'

export default function CreatePostForm() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="标题" required />
      <textarea name="content" placeholder="内容" required />
      <input name="authorId" type="hidden" value="user-id" />
      <button type="submit">发布</button>
    </form>
  )
}
```

### 3. 读取操作 (Read)

**Vue方式:**
```vue
<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else>
      <article v-for="post in posts" :key="post.id">
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>
      </article>
    </div>
  </div>
</template>

<script setup>
const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await axios.get('/api/posts')
    posts.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>
```

**Next.js方式:**
```tsx
// app/posts/page.tsx (Server Component - 无需loading状态)
import { prisma } from '@/lib/prisma'

export default async function PostsPage() {
  // 直接在服务端获取数据
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { name: true } },
      _count: { select: { comments: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <footer>
            <span>作者：{post.author.name}</span>
            <span>评论：{post._count.comments}</span>
          </footer>
        </article>
      ))}
    </div>
  )
}
```

### 4. 更新操作 (Update)

**Next.js Server Actions方式:**
```tsx
// actions/posts.ts
export async function updatePost(id: string, formData: FormData) {
  const result = updatePostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content')
  })
  
  if (!result.success) {
    return { error: result.error.format() }
  }
  
  try {
    const post = await prisma.post.update({
      where: { id },
      data: result.data
    })
    
    revalidatePath(`/posts/${post.slug}`)
    return { success: true, post }
  } catch (error) {
    return { error: '更新失败' }
  }
}

// components/EditPostForm.tsx
export default function EditPostForm({ post }) {
  const updateWithId = updatePost.bind(null, post.id)
  
  return (
    <form action={updateWithId}>
      <input name="title" defaultValue={post.title} />
      <textarea name="content" defaultValue={post.content} />
      <button type="submit">更新</button>
    </form>
  )
}
```

### 5. 删除操作 (Delete)

**Next.js方式:**
```tsx
// actions/posts.ts
export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id }
    })
    
    revalidatePath('/posts')
    return { success: true }
  } catch (error) {
    return { error: '删除失败' }
  }
}

// components/DeletePostButton.tsx
export default function DeletePostButton({ postId }) {
  const deleteWithId = deletePost.bind(null, postId)
  
  return (
    <form action={deleteWithId}>
      <button 
        type="submit"
        onClick={(e) => {
          if (!confirm('确定删除这篇文章吗？')) {
            e.preventDefault()
          }
        }}
      >
        删除
      </button>
    </form>
  )
}
```

## 🔍 高级查询和关系操作

### 复杂查询示例

```typescript
// 带搜索和分页的文章列表
export async function getPostsWithPagination({
  page = 1,
  pageSize = 10,
  search = '',
  tag = ''
}) {
  const skip = (page - 1) * pageSize
  
  const where = {
    published: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }),
    ...(tag && {
      tags: {
        some: {
          tag: { name: tag }
        }
      }
    })
  }
  
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: { select: { name: true, avatar: true } },
        tags: { include: { tag: true } },
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize
    }),
    prisma.post.count({ where })
  ])
  
  return {
    posts,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  }
}

// 获取文章详情（包含评论）
export async function getPostWithComments(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, avatar: true } },
      comments: {
        include: {
          author: { select: { name: true, avatar: true } }
        },
        orderBy: { createdAt: 'asc' }
      },
      tags: { include: { tag: true } }
    }
  })
  
  if (!post) {
    throw new Error('文章不存在')
  }
  
  return post
}
```

## 📝 错误处理和验证

### Zod验证方案

```typescript
// schemas/post.ts
import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string()
    .min(1, '标题不能为空')
    .max(100, '标题不能超过100个字符'),
  content: z.string()
    .min(10, '内容至少需要10个字符')
    .max(10000, '内容不能超过10000个字符'),
  excerpt: z.string()
    .max(200, '摘要不能超过200个字符')
    .optional(),
  tags: z.array(z.string()).max(5, '最多只能添加5个标签'),
  published: z.boolean().default(false)
})

export const updatePostSchema = createPostSchema.partial()

// 使用示例
export async function createPost(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    tags: formData.getAll('tags'),
    published: formData.get('published') === 'on'
  }
  
  const result = createPostSchema.safeParse(rawData)
  
  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors
    }
  }
  
  // 执行数据库操作...
}
```

## 🚀 性能优化

### 1. 查询优化

```typescript
// 避免N+1查询
const postsWithAuthors = await prisma.post.findMany({
  include: {
    author: true, // 一次性获取所有作者信息
    _count: {
      select: { comments: true } // 只获取计数，不加载所有评论
    }
  }
})

// 使用select减少数据传输
const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    excerpt: true,
    createdAt: true,
    author: {
      select: { name: true }
    }
  }
})
```

### 2. 缓存策略

```typescript
import { unstable_cache } from 'next/cache'

// 缓存热门文章
export const getPopularPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      where: { published: true },
      include: { author: { select: { name: true } } },
      orderBy: { viewCount: 'desc' },
      take: 5
    })
  },
  ['popular-posts'],
  { revalidate: 3600 } // 1小时缓存
)
```

## 📚 学习检查清单

- [ ] 理解Prisma的优势和基本概念
- [ ] 能够设计和实现数据模型
- [ ] 掌握基本的CRUD操作
- [ ] 了解关系查询和复杂查询
- [ ] 学会使用Zod进行数据验证
- [ ] 掌握错误处理最佳实践
- [ ] 理解查询优化和缓存策略
- [ ] 能够实现分页和搜索功能

## 🎯 下一步学习方向

完成数据库集成后，建议继续学习：

1. **用户认证** - NextAuth.js集成
2. **文件上传** - 图片和附件处理
3. **API设计** - RESTful API和GraphQL
4. **部署优化** - 数据库迁移和环境配置
5. **监控和日志** - 错误跟踪和性能监控

---

准备好开始实践了吗？我们将从安装和配置Prisma开始，逐步构建一个完整的博客管理系统！ 