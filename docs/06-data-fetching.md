# Next.js数据获取与渲染策略

> 从Vue的客户端渲染到Next.js的SSR/SSG/ISR全栈解决方案，掌握现代Web应用的数据获取策略

## 🎯 学习目标

- 理解SSR、SSG、ISR等渲染策略的概念和应用场景
- 掌握Next.js中不同的数据获取方法
- 对比Vue的客户端数据获取和Next.js的服务端数据获取
- 学会根据业务需求选择合适的渲染策略
- 掌握API路由的创建和使用

## 📖 核心概念对比

### Vue数据获取 vs Next.js数据获取
设计理念分析
1. 数据所有权
Vue: 子组件可以拥有自己的状态，通过事件通知父组件
React: 数据通常由父组件拥有，子组件只是"展示"数据
2. 数据流方向
Vue: 双向数据流感觉更自然（v-model、emit）
React: 严格的单向数据流（数据向下，事件向上）
3. 编程范式
Vue: 面向对象 + 事件驱动，更接近传统的GUI编程
React: 函数式编程，数据和行为分离
 
| 特性 | Vue应用 | Next.js应用 |
|------|---------|-------------|
| **渲染方式** | 客户端渲染(CSR) | SSR/SSG/ISR/CSR多种选择 |
| **数据获取时机** | 组件挂载后 | 构建时/请求时/客户端 |
| **首屏性能** | 需要等待JS加载和API | 服务端预渲染，更快首屏 |
| **SEO友好** | 需要额外配置SSR | 原生SEO优化 |
| **开发复杂度** | 相对简单 | 需要理解不同渲染策略 |
| **服务器要求** | 静态文件服务器 | 需要Node.js服务器(SSR) |

### Next.js渲染策略详解

| 渲染策略 | 何时渲染 | 适用场景 | 数据获取函数 |
|----------|----------|----------|--------------|
| **SSR** | 每次请求时 | 动态内容，需要实时数据 | `async function Page()` |
| **SSG** | 构建时 | 静态内容，不常变化 | `generateStaticParams()` |
| **ISR** | 构建时+定期重新生成 | 半静态内容，定期更新 | `revalidate` 配置 |
| **CSR** | 客户端 | 交互性强，用户特定内容 | `useEffect` + `fetch` |

## 🔄 Vue vs Next.js数据获取对比

### 1. 客户端数据获取

**Vue的传统方式:**
```vue
<template>
  <div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h1>{{ post.title }}</h1>
      <p>{{ post.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const post = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('/api/posts/1')
    if (!response.ok) throw new Error('获取失败')
    post.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
```

**Next.js客户端获取方式:**
```tsx
'use client'
import { useState, useEffect } from 'react'

interface Post {
  id: number
  title: string
  content: string
}

export default function ClientPost() {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch('/api/posts/1')
        if (!response.ok) throw new Error('获取失败')
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
  }, [])
  
  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>
  if (!post) return <div>未找到文章</div>
  
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

### 2. 服务端渲染 (SSR)

**Vue需要Nuxt.js等框架:**
```vue
<!-- pages/posts/[id].vue -->
<template>
  <div>
    <h1>{{ post.title }}</h1>
    <p>{{ post.content }}</p>
  </div>
</template>

<script setup>
// Nuxt.js的服务端数据获取
const { params } = useRoute()
const { data: post } = await $fetch(`/api/posts/${params.id}`)
</script>
```

**Next.js原生SSR支持:**
```tsx
// app/posts/[id]/page.tsx
interface Post {
  id: number
  title: string
  content: string
}

interface PageProps {
  params: { id: string }
}

// 服务端组件，自动SSR
export default async function PostPage({ params }: PageProps) {
  // 这个fetch在服务端执行
  const response = await fetch(`${process.env.API_BASE_URL}/posts/${params.id}`, {
    // Next.js自动缓存
    cache: 'force-cache'
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch post')
  }
  
  const post: Post = await response.json()
  
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>这个页面在服务端渲染！</p>
    </div>
  )
}

// 生成页面元数据
export async function generateMetadata({ params }: PageProps) {
  const response = await fetch(`${process.env.API_BASE_URL}/posts/${params.id}`)
  const post: Post = await response.json()
  
  return {
    title: post.title,
    description: post.content.substring(0, 100),
  }
}
```

## 📊 静态生成 (SSG) - Next.js独有

SSG是Next.js相比传统Vue应用的重大优势之一：

### 基础静态生成
```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>关于我们</h1>
      <p>这个页面在构建时生成，部署后就是静态HTML文件</p>
    </div>
  )
}
```

### 动态静态生成
```tsx
// app/posts/[slug]/page.tsx
interface Post {
  slug: string
  title: string
  content: string
  publishedAt: string
}

interface PageProps {
  params: { slug: string }
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.publishedAt}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}

// 告诉Next.js要生成哪些静态页面
export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 辅助函数
async function getAllPosts(): Promise<Post[]> {
  const response = await fetch(`${process.env.API_BASE_URL}/posts`)
  return response.json()
}

async function getPostBySlug(slug: string): Promise<Post> {
  const response = await fetch(`${process.env.API_BASE_URL}/posts/${slug}`)
  return response.json()
}
```

### 构建时的效果
```bash
# 运行构建命令
pnpm build

# Next.js会生成:
# /posts/hello-world.html
# /posts/react-tutorial.html
# /posts/nextjs-guide.html
# ...所有文章的静态HTML文件
```

## ⚡ 增量静态再生 (ISR)

ISR是Next.js的创新特性，Vue生态系统中没有直接对应：

```tsx
// app/news/[id]/page.tsx
interface NewsItem {
  id: number
  title: string
  content: string
  updatedAt: string
}

export default async function NewsPage({ params }: { params: { id: string } }) {
  const news = await getNewsItem(params.id)
  
  return (
    <div>
      <h1>{news.title}</h1>
      <p>最后更新: {news.updatedAt}</p>
      <div>{news.content}</div>
    </div>
  )
}

export async function generateStaticParams() {
  const newsItems = await getAllNews()
  return newsItems.map((item) => ({ id: item.id.toString() }))
}

async function getNewsItem(id: string): Promise<NewsItem> {
  const response = await fetch(`${process.env.API_BASE_URL}/news/${id}`, {
    // 每10分钟重新验证一次
    next: { revalidate: 600 }
  })
  return response.json()
}
```

**ISR的工作流程:**
1. **构建时**: 生成静态HTML
2. **用户访问**: 返回缓存的静态页面
3. **后台**: 检查是否需要重新生成
4. **更新后**: 新用户看到更新的页面

## 🛠️ API路由

Next.js允许你在同一个项目中创建API，这对Vue开发者来说是全新的：

### 创建API路由
```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface Post {
  id: number
  title: string
  content: string
}

// 模拟数据库
const posts: Post[] = [
  { id: 1, title: '第一篇文章', content: '这是内容...' },
  { id: 2, title: '第二篇文章', content: '更多内容...' },
]

// GET /api/posts
export async function GET() {
  return NextResponse.json(posts)
}

// POST /api/posts
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const newPost: Post = {
    id: posts.length + 1,
    title: body.title,
    content: body.content,
  }
  
  posts.push(newPost)
  
  return NextResponse.json(newPost, { status: 201 })
}
```

### 动态API路由
```typescript
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: { id: string }
}

// GET /api/posts/[id]
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const id = parseInt(params.id)
  const post = posts.find(p => p.id === id)
  
  if (!post) {
    return NextResponse.json(
      { error: '文章未找到' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(post)
}

// PUT /api/posts/[id]
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const id = parseInt(params.id)
  const body = await request.json()
  
  const postIndex = posts.findIndex(p => p.id === id)
  
  if (postIndex === -1) {
    return NextResponse.json(
      { error: '文章未找到' },
      { status: 404 }
    )
  }
  
  posts[postIndex] = { ...posts[postIndex], ...body }
  
  return NextResponse.json(posts[postIndex])
}

// DELETE /api/posts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const id = parseInt(params.id)
  const postIndex = posts.findIndex(p => p.id === id)
  
  if (postIndex === -1) {
    return NextResponse.json(
      { error: '文章未找到' },
      { status: 404 }
    )
  }
  
  posts.splice(postIndex, 1)
  
  return NextResponse.json({ message: '删除成功' })
}
```

## 🔄 数据获取策略选择

### 决策流程图

```
开始
  ↓
数据是否经常变化？
  ↓          ↓
 是          否
  ↓          ↓
需要实时性？   使用SSG
  ↓    ↓      ↓
 是    否   构建时生成静态页面
  ↓    ↓
使用SSR  使用ISR
  ↓      ↓
每次请求  定期重新生成
```

### 具体应用场景

| 渲染策略 | 适用场景 | 实际例子 |
|----------|----------|----------|
| **SSG** | 静态内容 | 博客文章、产品说明、文档 |
| **ISR** | 半静态内容 | 新闻列表、商品信息、评论 |
| **SSR** | 动态内容 | 用户个人页面、实时数据 |
| **CSR** | 交互应用 | 仪表板、聊天应用、游戏 |

## 💡 实战示例：博客应用

让我们创建一个完整的博客应用来演示不同的数据获取策略：

### 1. 博客首页 (SSG)
```tsx
// app/blog/page.tsx
interface BlogPost {
  id: number
  title: string
  excerpt: string
  slug: string
  publishedAt: string
}

export default async function BlogPage() {
  // 在构建时获取所有文章
  const posts = await getAllBlogPosts()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">博客文章</h1>
      
      <div className="grid gap-6">
        {posts.map((post) => (
          <article key={post.id} className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <time className="text-sm text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
            </time>
          </article>
        ))}
      </div>
    </div>
  )
}

async function getAllBlogPosts(): Promise<BlogPost[]> {
  // 这里可以从CMS、数据库或文件系统获取数据
  const response = await fetch(`${process.env.API_BASE_URL}/posts`)
  return response.json()
}
```

### 2. 文章详情页 (SSG + ISR)
```tsx
// app/blog/[slug]/page.tsx
interface BlogPost {
  id: number
  title: string
  content: string
  slug: string
  publishedAt: string
  viewCount: number
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getBlogPost(params.slug)
  
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <time>{new Date(post.publishedAt).toLocaleDateString('zh-CN')}</time>
          <span>阅读量: {post.viewCount}</span>
        </div>
      </header>
      
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}

// 生成所有文章的静态页面
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 生成页面元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getBlogPost(params.slug)
  
  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
    },
  }
}

async function getBlogPost(slug: string): Promise<BlogPost> {
  const response = await fetch(`${process.env.API_BASE_URL}/posts/${slug}`, {
    // 每小时重新验证一次，更新阅读量等数据
    next: { revalidate: 3600 }
  })
  
  if (!response.ok) {
    throw new Error('文章未找到')
  }
  
  return response.json()
}
```

### 3. 用户仪表板 (SSR)
```tsx
// app/dashboard/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface UserData {
  id: number
  name: string
  email: string
  posts: BlogPost[]
  stats: {
    totalPosts: number
    totalViews: number
    totalComments: number
  }
}

export default async function DashboardPage() {
  // 获取用户认证信息
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')
  
  if (!token) {
    redirect('/login')
  }
  
  // 获取用户特定数据
  const userData = await getUserData(token.value)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        欢迎回来，{userData.name}！
      </h1>
      
      {/* 统计卡片 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">总文章数</h3>
          <p className="text-3xl font-bold text-blue-600">
            {userData.stats.totalPosts}
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">总阅读量</h3>
          <p className="text-3xl font-bold text-green-600">
            {userData.stats.totalViews}
          </p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold">总评论数</h3>
          <p className="text-3xl font-bold text-purple-600">
            {userData.stats.totalComments}
          </p>
        </div>
      </div>
      
      {/* 最近文章 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">我的文章</h2>
        <div className="space-y-4">
          {userData.posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-gray-600 text-sm">
                发布于 {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

async function getUserData(token: string): Promise<UserData> {
  const response = await fetch(`${process.env.API_BASE_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // 不缓存用户特定数据
    cache: 'no-store'
  })
  
  if (!response.ok) {
    throw new Error('获取用户数据失败')
  }
  
  return response.json()
}
```

## 🚀 性能优化技巧

### 1. 缓存策略
```tsx
// 不同的缓存策略
export default async function OptimizedPage() {
  // 强制缓存 - 适用于静态数据
  const staticData = await fetch('/api/static-data', {
    cache: 'force-cache'
  })
  
  // 不缓存 - 适用于实时数据
  const liveData = await fetch('/api/live-data', {
    cache: 'no-store'
  })
  
  // 时间缓存 - 适用于定期更新的数据
  const timedData = await fetch('/api/timed-data', {
    next: { revalidate: 60 } // 60秒后重新验证
  })
  
  return <div>优化后的页面</div>
}
```

### 2. 流式渲染
```tsx
import { Suspense } from 'react'

export default function StreamingPage() {
  return (
    <div>
      <h1>即时显示的标题</h1>
      
      {/* 慢数据用Suspense包装，不阻塞页面渲染 */}
      <Suspense fallback={<div>加载用户信息中...</div>}>
        <UserProfile />
      </Suspense>
      
      <Suspense fallback={<div>加载推荐内容中...</div>}>
        <RecommendedPosts />
      </Suspense>
    </div>
  )
}

async function UserProfile() {
  // 模拟慢API
  await new Promise(resolve => setTimeout(resolve, 2000))
  const user = await fetchUser()
  
  return <div>用户: {user.name}</div>
}

async function RecommendedPosts() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const posts = await fetchRecommendedPosts()
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

## 📊 性能对比总结

| 方面 | Vue SPA | Next.js SSG | Next.js SSR | Next.js ISR |
|------|---------|-------------|-------------|-------------|
| **首屏速度** | 慢 | 最快 | 快 | 快 |
| **SEO** | 差 | 优秀 | 优秀 | 优秀 |
| **服务器负载** | 无 | 无 | 高 | 低 |
| **实时性** | 好 | 差 | 最好 | 中等 |
| **部署复杂度** | 简单 | 简单 | 复杂 | 中等 |
| **开发体验** | 简单 | 中等 | 复杂 | 中等 |

## 🎯 最佳实践建议

### 1. 选择合适的渲染策略
```tsx
// 决策树示例
function chooseRenderingStrategy(content: ContentType) {
  if (content.isUserSpecific) {
    return 'SSR' // 用户特定内容
  }
  
  if (content.updateFrequency === 'never') {
    return 'SSG' // 永不变化的内容
  }
  
  if (content.updateFrequency === 'daily') {
    return 'ISR' // 定期更新的内容
  }
  
  if (content.isRealtime) {
    return 'CSR' // 实时内容
  }
  
  return 'SSG' // 默认选择
}
```

### 2. 错误处理
```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPost(params.slug)
    
    if (!post) {
      notFound() // 触发404页面
    }
    
    return <div>{post.title}</div>
  } catch (error) {
    // 抛出错误会触发error.tsx
    throw new Error('获取文章失败')
  }
}
```

### 3. 类型安全
```tsx
// types/api.ts
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 使用类型安全的数据获取
async function fetchPosts(page: number = 1): Promise<PaginatedResponse<BlogPost>> {
  const response = await fetch(`/api/posts?page=${page}`)
  return response.json()
}
```

## 💡 核心差异总结

### Vue vs Next.js数据获取
- **Vue**: 主要依赖客户端渲染，数据获取在组件挂载后进行
- **Next.js**: 提供多种渲染策略，可以在构建时、请求时或客户端获取数据

### 开发体验
- **Vue**: 学习曲线平缓，概念相对简单
- **Next.js**: 需要理解不同渲染策略，但提供了更好的性能和SEO

### 性能特点
- **Vue**: 首屏较慢，但后续交互流畅
- **Next.js**: 首屏快速，SEO友好，但需要合理选择渲染策略

## 🎉 学习检查清单

- [ ] 理解SSR、SSG、ISR的概念和区别
- [ ] 掌握Next.js中不同的数据获取方法
- [ ] 能够根据业务需求选择合适的渲染策略
- [ ] 学会创建和使用API路由
- [ ] 理解缓存策略和性能优化
- [ ] 掌握错误处理和类型安全
- [ ] 能够实现流式渲染和Suspense
- [ ] 了解不同渲染策略的性能特点
- [ ] 能够对比Vue和Next.js的数据获取方式

---

**🎯 下一步**: 完成数据获取学习后，建议继续学习Next.js的样式解决方案和状态管理，进一步提升全栈开发技能。 