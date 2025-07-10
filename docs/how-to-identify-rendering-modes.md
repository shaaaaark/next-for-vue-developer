# Next.js 渲染模式识别指南

> 如何准确判断 Next.js 应用中的 SSR、SSG、ISR 和 CSR 渲染模式

## 🎯 快速识别表

| 渲染模式 | 关键特征 | 代码标识 | 构建产物 | 网络请求时机 |
|----------|----------|----------|----------|--------------|
| **SSR** | 服务端每次请求时渲染 | `async function Page()` + `cache: 'no-store'` | `.js` 文件 | 服务端请求时 |
| **SSG** | 构建时预渲染 | `async function Page()` + `cache: 'force-cache'` | `.html` 文件 | 构建时 |
| **ISR** | 按需重新生成静态页面 | `revalidate` 配置 | `.html` + 重新生成逻辑 | 构建时 + 定期更新 |
| **CSR** | 客户端渲染 | `'use client'` + `useEffect` | `.js` 文件 | 客户端加载后 |

## 🔍 详细识别方法

### 1. 代码层面识别

#### SSR (服务端渲染)
```tsx
// ✅ SSR 特征
// - 服务端组件
// - 使用 cache: 'no-store' 或 cache: 'no-cache'
// - 每次请求都获取最新数据

export default async function SSRPage() {
  // 🔴 关键标识：cache: 'no-store'
  const response = await fetch('https://api.example.com/data', {
    cache: 'no-store'  // 不缓存，每次都重新获取
  })
  
  const data = await response.json()
  
  return <div>{data.title}</div>
}

// 📍 识别点：
// - 函数前有 async 关键字
// - 没有 'use client' 指令
// - fetch 使用 cache: 'no-store'
```

#### SSG (静态站点生成)
```tsx
// ✅ SSG 特征
// - 服务端组件
// - 使用 cache: 'force-cache' 或默认缓存
// - 构建时生成静态页面

export default async function SSGPage() {
  // 🟢 关键标识：cache: 'force-cache' 或默认缓存
  const response = await fetch('https://api.example.com/data', {
    cache: 'force-cache'  // 强制缓存，构建时获取
  })
  
  const data = await response.json()
  
  return <div>{data.title}</div>
}

// 📍 识别点：
// - 函数前有 async 关键字
// - 没有 'use client' 指令
// - fetch 使用默认缓存或 force-cache
```

#### ISR (增量静态再生)
```tsx
// ✅ ISR 特征
// - 基于 SSG，但添加了重新验证机制
// - 使用 revalidate 配置

export default async function ISRPage() {
  const response = await fetch('https://api.example.com/data', {
    // 🟡 关键标识：next.revalidate 配置
    next: { revalidate: 60 } // 每60秒重新验证
  })
  
  const data = await response.json()
  
  return <div>{data.title}</div>
}

// 📍 识别点：
// - 类似 SSG，但有 revalidate 配置
// - 使用 next.revalidate 或路由段配置
```

#### CSR (客户端渲染)
```tsx
// ✅ CSR 特征
// - 客户端组件
// - 使用 React Hooks 获取数据

'use client'  // 🔴 关键标识：客户端指令

import { useState, useEffect } from 'react'

export default function CSRPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // 🔴 关键标识：useEffect 中获取数据
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return <div>{data?.title}</div>
}

// 📍 识别点：
// - 文件顶部有 'use client' 指令
// - 使用 useState、useEffect
// - 在 useEffect 中发起数据请求
```

### 2. 运行时表现识别

#### 开发者工具检查
```javascript
// 在浏览器控制台执行以下代码

// 1. 检查是否有初始数据
console.log('Initial data in HTML:', 
  document.documentElement.innerHTML.includes('data-content')
)

// 2. 检查网络请求时机
console.log('Network requests:', 
  performance.getEntriesByType('navigation')
)

// 3. 检查页面加载状态
console.log('Page render mode:',
  window.__NEXT_DATA__?.props?.pageProps ? 'SSR/SSG' : 'CSR'
)
```

#### 网络面板观察
```bash
# SSR: 服务端请求，HTML 包含完整内容
# SSG: 静态文件，HTML 包含完整内容  
# ISR: 类似 SSG，但可能触发后台重新生成
# CSR: 客户端 XHR/Fetch 请求
```

### 3. 构建产物识别

#### 查看构建结果
```bash
# 运行构建命令
pnpm build

# 查看构建输出
pnpm build 2>&1 | grep -E "(SSG|ISR|SSR)"
```

#### 构建输出解读
```bash
# Next.js 构建输出示例
┌ ○ /                           # 静态页面 (SSG)
├ ● /blog-ssr                   # 服务端渲染 (SSR)
├ ○ /blog-ssg                   # 静态生成 (SSG)  
├ ◐ /blog-isr                   # 增量静态再生 (ISR)
└ ○ /blog-csr                   # 客户端渲染 (CSR，但实际是静态壳)

# 符号含义：
# ○ 静态页面 (SSG)
# ● 服务端渲染 (SSR) 
# ◐ 增量静态再生 (ISR)
# λ 服务端函数
```

#### 文件系统检查
```bash
# 查看 .next 目录结构
ls -la .next/

# SSG 页面会生成 .html 文件
.next/server/app/blog-ssg.html

# SSR 页面只有 .js 文件
.next/server/app/blog-ssr.js

# ISR 页面有 .html 和重新生成配置
.next/server/app/blog-isr.html
.next/server/app/blog-isr.js
```

## 🛠️ 实用检测工具

### 创建渲染模式检测器
```tsx
// utils/renderModeDetector.ts
export function detectRenderMode(): string {
  // 运行时检测
  if (typeof window === 'undefined') {
    return 'SSR' // 服务端环境
  }
  
  // 客户端检测
  const hasInitialData = document.querySelector('[data-nextjs-data]')
  const hasLoadingState = document.querySelector('[data-loading]')
  
  if (hasInitialData && !hasLoadingState) {
    return 'SSG/SSR' // 预渲染内容
  }
  
  if (hasLoadingState) {
    return 'CSR' // 客户端渲染
  }
  
  return 'Unknown'
}

// Hook 版本
export function useRenderMode() {
  const [mode, setMode] = useState<string>('detecting')
  
  useEffect(() => {
    setMode(detectRenderMode())
  }, [])
  
  return mode
}
```

### 页面性能检测
```tsx
// components/RenderModeIndicator.tsx
'use client'

export function RenderModeIndicator() {
  const [info, setInfo] = useState({
    mode: 'detecting',
    loadTime: 0,
    hasInitialData: false
  })
  
  useEffect(() => {
    const startTime = performance.now()
    
    // 检测渲染模式
    const hasInitialData = document.documentElement.innerHTML.length > 1000
    const mode = hasInitialData ? 'SSG/SSR' : 'CSR'
    
    setInfo({
      mode,
      loadTime: performance.now() - startTime,
      hasInitialData
    })
  }, [])
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
      <div>模式: {info.mode}</div>
      <div>加载时间: {info.loadTime.toFixed(2)}ms</div>
      <div>预渲染: {info.hasInitialData ? '是' : '否'}</div>
    </div>
  )
}
```

## 🔍 实际项目中的判断流程

### 1. 首先看代码特征
```bash
# 检查文件是否有 'use client'
grep -r "use client" src/

# 检查是否有 async 组件
grep -r "export default async function" src/

# 检查 fetch 缓存配置
grep -r "cache:" src/
```

### 2. 运行开发服务器观察
```bash
# 启动开发模式
pnpm dev

# 观察控制台输出
# - SSR: 服务端日志
# - SSG: 构建时日志  
# - CSR: 客户端日志
```

### 3. 构建并分析
```bash
# 构建项目
pnpm build

# 分析构建输出
# 观察页面符号：○ ● ◐ λ
```

### 4. 浏览器检查
```javascript
// F12 开发者工具
// Network 面板查看请求时机
// Console 检查初始数据
// Performance 分析加载过程
```

## 🎯 最佳实践建议

### 什么时候用什么模式？

1. **SSG**: 静态内容，如博客文章、产品展示
2. **ISR**: 半静态内容，如新闻列表、商品目录  
3. **SSR**: 动态内容，如用户个人页面、实时数据
4. **CSR**: 交互为主，如仪表板、复杂表单

### 混合使用策略
```tsx
// 同一个应用中可以混合使用
app/
├── page.tsx          # SSG (首页)
├── blog/
│   ├── page.tsx      # SSG (博客列表)
│   └── [slug]/
│       └── page.tsx  # ISR (文章详情)
├── dashboard/
│   └── page.tsx      # CSR (用户仪表板)
└── api/
    └── user/
        └── route.ts  # SSR (用户API)
```

通过以上方法，你可以准确识别 Next.js 应用中每个页面的渲染模式，并根据实际需求选择最合适的渲染策略。 