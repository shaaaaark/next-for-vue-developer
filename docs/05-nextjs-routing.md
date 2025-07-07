# Next.js路由系统

> 从Vue Router配置式路由到Next.js文件系统路由的完全指南，掌握现代React应用的导航核心

## 🎯 学习目标

- 理解Next.js文件系统路由的工作原理
- 掌握动态路由和嵌套路由的创建方法
- 对比Vue Router和Next.js路由系统的设计理念
- 学会使用Next.js Link组件和路由API
- 掌握路由参数获取和页面元数据设置

## 📖 核心概念对比

### Vue Router vs Next.js路由系统

| 特性 | Vue Router | Next.js路由 |
|------|------------|-------------|
| **路由配置** | 集中配置文件 | 文件系统驱动 |
| **路由定义** | JavaScript对象 | 文件夹结构 |
| **动态路由** | `:id` 语法 | `[id]` 文件夹 |
| **嵌套路由** | `children` 配置 | 文件夹嵌套 |
| **路由守卫** | `beforeEach` 等钩子 | `middleware.ts` |
| **代码分割** | 手动配置 | 自动分割 |
| **类型安全** | 需要额外配置 | 内置TypeScript支持 |

### 路由创建方式对比

| 路由类型 | Vue Router创建 | Next.js创建 |
|----------|----------------|-------------|
| **基础路由** | 配置 `{ path: '/about', component: About }` | 创建 `app/about/page.tsx` |
| **动态路由** | 配置 `{ path: '/post/:id', component: Post }` | 创建 `app/post/[id]/page.tsx` |
| **嵌套路由** | 使用 `children` 数组 | 创建嵌套文件夹 |
| **Catch-all** | 配置 `{ path: '*', component: NotFound }` | 创建 `[...slug]/page.tsx` |

## 🗂️ 文件系统路由详解

### 1. 基础路由结构

**Vue Router传统方式:**
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Products from '@/views/Products.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

**Next.js文件系统方式:**
```
📁 src/app/
├── 📄 page.tsx              // 对应 '/' 路由
├── 📁 about/
│   └── 📄 page.tsx          // 对应 '/about' 路由  
├── 📁 products/
│   └── 📄 page.tsx          // 对应 '/products' 路由
└── 📄 layout.tsx            // 根布局组件
```

**优势对比:**
- ✅ **Next.js**: 零配置，文件结构即路由结构
- ✅ **Next.js**: 自动代码分割，按需加载
- ✅ **Next.js**: TypeScript自动类型推断
- ❌ **Vue Router**: 需要手动配置路由表
- ❌ **Vue Router**: 需要手动设置代码分割

### 2. 动态路由实现

**Vue Router动态路由:**
```javascript
// 路由配置
{
  path: '/products/:id',
  name: 'ProductDetail',
  component: () => import('@/views/ProductDetail.vue'),
  props: true
}

// 组件中获取参数
<template>
  <div>
    <h1>产品 {{ $route.params.id }}</h1>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = route.params.id

// 或者使用props
defineProps(['id'])
</script>

// 编程式导航
import { useRouter } from 'vue-router'
const router = useRouter()
router.push(`/products/${productId}`)
```

**Next.js动态路由:**
```typescript
// 文件结构
📁 src/app/products/[id]/
└── 📄 page.tsx

// 组件实现
interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = params.id
  
  return (
    <div>
      <h1>产品 {productId}</h1>
    </div>
  )
}

// 导航
import Link from 'next/link'
<Link href={`/products/${productId}`}>查看产品</Link>

// 编程式导航
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push(`/products/${productId}`)
```

## 🔗 导航组件对比

### Vue Router导航

```vue
<template>
  <div>
    <!-- 声明式导航 -->
    <router-link to="/">首页</router-link>
    <router-link to="/about">关于</router-link>
    <router-link :to="`/products/${product.id}`">
      {{ product.name }}
    </router-link>
    
    <!-- 带参数的导航 -->
    <router-link 
      :to="{ 
        name: 'ProductDetail', 
        params: { id: product.id },
        query: { tab: 'reviews' }
      }"
    >
      查看评论
    </router-link>
    
    <!-- 编程式导航 -->
    <button @click="navigateToProduct">跳转到产品</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToProduct = () => {
  router.push({
    name: 'ProductDetail',
    params: { id: 123 },
    query: { tab: 'details' }
  })
}
</script>
```

### Next.js导航

```tsx
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NavigationExample() {
  const router = useRouter()
  
  const navigateToProduct = () => {
    router.push('/products/123?tab=details')
  }
  
  return (
    <div>
      {/* 声明式导航 */}
      <Link href="/">首页</Link>
      <Link href="/about">关于</Link>
      <Link href={`/products/${product.id}`}>
        {product.name}
      </Link>
      
      {/* 带查询参数的导航 */}
      <Link 
        href={{
          pathname: '/products/[id]',
          query: { id: product.id, tab: 'reviews' }
        }}
      >
        查看评论
      </Link>
      
      {/* 编程式导航 */}
      <button onClick={navigateToProduct}>跳转到产品</button>
    </div>
  )
}
```

**Next.js Link组件特性:**
- 🚀 **自动预加载**: 鼠标悬停时预加载页面代码
- ⚡ **客户端导航**: 无需刷新页面的SPA体验
- 🔒 **类型安全**: TypeScript自动检查路由路径
- 📦 **代码分割**: 自动按页面分割JavaScript包

## 📂 复杂路由模式

### 1. 嵌套路由

**Vue Router嵌套路由:**
```javascript
{
  path: '/admin',
  component: AdminLayout,
  children: [
    { path: '', component: AdminDashboard },
    { path: 'users', component: AdminUsers },
    { path: 'products', component: AdminProducts },
    { path: 'users/:id', component: AdminUserDetail }
  ]
}
```

**Next.js嵌套路由:**
```
📁 src/app/admin/
├── 📄 layout.tsx           // admin布局
├── 📄 page.tsx             // /admin 默认页面
├── 📁 users/
│   ├── 📄 page.tsx         // /admin/users
│   └── 📁 [id]/
│       └── 📄 page.tsx     // /admin/users/[id]
└── 📁 products/
    └── 📄 page.tsx         // /admin/products
```

```tsx
// app/admin/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      <nav>
        <Link href="/admin">仪表板</Link>
        <Link href="/admin/users">用户管理</Link>
        <Link href="/admin/products">产品管理</Link>
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

### 2. Catch-all路由

**Vue Router通配符:**
```javascript
{
  path: '/docs/:path*',
  component: DocsPage
}
```

**Next.js Catch-all:**
```
📁 src/app/docs/[...slug]/
└── 📄 page.tsx
```

```tsx
// app/docs/[...slug]/page.tsx
interface DocsPageProps {
  params: {
    slug: string[]
  }
}

export default function DocsPage({ params }: DocsPageProps) {
  const path = params.slug?.join('/') || ''
  
  return (
    <div>
      <h1>文档路径: {path}</h1>
      {/* /docs/getting-started/installation -> slug: ['getting-started', 'installation'] */}
    </div>
  )
}
```

### 3. 可选Catch-all路由

```
📁 src/app/shop/[[...category]]/
└── 📄 page.tsx
```

```tsx
// 匹配 /shop、/shop/electronics、/shop/electronics/phones
interface ShopPageProps {
  params: {
    category?: string[]
  }
}

export default function ShopPage({ params }: ShopPageProps) {
  const categories = params.category || []
  
  if (categories.length === 0) {
    return <div>所有商品</div>
  }
  
  return (
    <div>
      <h1>分类: {categories.join(' > ')}</h1>
    </div>
  )
}
```

## 🔧 路由API和工具

### 1. 获取路由信息

**Vue Router:**
```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

console.log('当前路径:', route.path)
console.log('路由参数:', route.params)
console.log('查询参数:', route.query)
console.log('路由名称:', route.name)
</script>
```

**Next.js:**
```tsx
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function RouteInfoExample() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  console.log('当前路径:', pathname)
  console.log('查询参数:', searchParams.get('tab'))
  
  return <div>路由信息组件</div>
}

// 在服务器组件中
interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function ServerPage({ params, searchParams }: PageProps) {
  console.log('路由参数:', params)
  console.log('查询参数:', searchParams)
  
  return <div>服务器组件</div>
}
```

### 2. 路由守卫和中间件

**Vue Router守卫:**
```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

// 组件内守卫
export default {
  beforeRouteEnter(to, from, next) {
    // 进入路由前
  },
  beforeRouteUpdate(to, from, next) {
    // 路由更新时
  },
  beforeRouteLeave(to, from, next) {
    // 离开路由前
  }
}
```

**Next.js中间件:**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // 检查认证
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // 检查地理位置
  const country = request.geo?.country
  if (country === 'CN') {
    // 重定向到中文版本
    return NextResponse.redirect(new URL('/zh' + request.nextUrl.pathname, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
```

## 🌐 国际化路由

### Vue Router国际化

```javascript
const routes = [
  {
    path: '/:locale',
    component: LocaleWrapper,
    children: [
      { path: '', component: Home },
      { path: 'about', component: About }
    ]
  }
]
```

### Next.js国际化

```typescript
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'zh', 'ja'],
    defaultLocale: 'en',
  },
}

// 自动路由: /en/about, /zh/about, /ja/about
```

## 📊 性能对比

| 特性 | Vue Router | Next.js路由 |
|------|------------|-------------|
| **首次加载** | 需要路由配置 | 自动代码分割 |
| **路由切换** | 客户端渲染 | 客户端+SSR |
| **预加载** | 手动配置 | 自动预加载 |
| **缓存策略** | 浏览器缓存 | Next.js缓存 |
| **SEO友好** | 需要SSR配置 | 内置SSR/SSG |

## 🚀 实战示例：博客应用路由

### Vue Router实现
```javascript
// router配置
const routes = [
  { path: '/', component: Home },
  { path: '/blog', component: BlogList },
  { path: '/blog/:slug', component: BlogPost },
  { path: '/category/:name', component: CategoryPosts },
  { path: '/author/:id', component: AuthorProfile },
  { path: '/search', component: SearchResults }
]
```

### Next.js实现
```
📁 src/app/
├── 📄 page.tsx                    // 首页
├── 📁 blog/
│   ├── 📄 page.tsx                // 博客列表
│   └── 📁 [slug]/
│       └── 📄 page.tsx            // 博客文章
├── 📁 category/
│   └── 📁 [name]/
│       └── 📄 page.tsx            // 分类文章
├── 📁 author/
│   └── 📁 [id]/
│       └── 📄 page.tsx            // 作者页面
└── 📁 search/
    └── 📄 page.tsx                // 搜索结果
```

```tsx
// app/blog/[slug]/page.tsx
interface BlogPostProps {
  params: { slug: string }
}

export default async function BlogPost({ params }: BlogPostProps) {
  // 服务器端数据获取
  const post = await fetchPost(params.slug)
  
  if (!post) {
    notFound() // 自动404处理
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}

// 自动生成静态页面
export async function generateStaticParams() {
  const posts = await fetchAllPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// SEO元数据
export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const post = await fetchPost(params.slug)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  }
}
```

## 🎯 最佳实践

### 1. 文件组织建议

```
📁 src/app/
├── 📄 layout.tsx              // 根布局
├── 📄 page.tsx                // 首页
├── 📄 loading.tsx             // 全局加载状态
├── 📄 error.tsx               // 全局错误页面
├── 📄 not-found.tsx           // 404页面
├── 📁 (auth)/                 // 路由组，不影响URL
│   ├── 📄 layout.tsx          // 认证布局
│   ├── 📁 login/
│   └── 📁 register/
├── 📁 dashboard/
│   ├── 📄 layout.tsx          // 仪表板布局
│   ├── 📄 page.tsx            // 仪表板首页
│   ├── 📄 loading.tsx         // 仪表板加载状态
│   └── 📁 settings/
└── 📁 api/                    // API路由
    └── 📁 posts/
        └── 📄 route.ts
```

### 2. 类型安全实践

```typescript
// types/navigation.ts
export interface NavigationItem {
  href: string
  label: string
  children?: NavigationItem[]
}

// 路由类型定义
export type PageParams = {
  id: string
  slug?: string
}

export type SearchParams = {
  page?: string
  limit?: string
  q?: string
}

// 通用页面Props类型
export interface PageProps<P = {}, S = {}> {
  params: P
  searchParams: S
}
```

### 3. 性能优化技巧

```tsx
// 动态导入组件
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>加载中...</div>,
  ssr: false // 如果不需要SSR
})

// 预加载关键路由
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  
  useEffect(() => {
    // 预加载可能访问的页面
    router.prefetch('/dashboard')
    router.prefetch('/products')
  }, [])
  
  return <div>首页内容</div>
}
```

## 💡 核心差异总结

### 设计理念
- **Vue Router**: 集中式配置，灵活性高，需要手动设置
- **Next.js**: 约定优于配置，零配置开箱即用

### 开发体验
- **Vue Router**: 需要学习路由API和配置语法
- **Next.js**: 只需要创建文件和文件夹

### 性能特性
- **Vue Router**: 需要手动优化代码分割和预加载
- **Next.js**: 自动代码分割、预加载和缓存优化

### 类型安全
- **Vue Router**: 需要额外配置TypeScript类型
- **Next.js**: 原生TypeScript支持，自动类型推断

## 🎉 学习检查清单

- [ ] 理解文件系统路由的工作原理
- [ ] 掌握基础路由和动态路由的创建方法
- [ ] 学会使用Link组件进行导航
- [ ] 了解嵌套路由和布局的使用
- [ ] 掌握路由参数和查询参数的获取
- [ ] 理解Catch-all路由的应用场景
- [ ] 学会使用中间件进行路由守卫
- [ ] 掌握SEO优化和元数据设置
- [ ] 了解国际化路由的实现方式
- [ ] 能够对比Vue Router和Next.js路由的优缺点

---

**🎯 下一步**: 完成路由系统学习后，建议继续学习Next.js的数据获取和状态管理，深入了解全栈React应用的开发方式。 