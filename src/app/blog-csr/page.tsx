'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// 类型定义
interface BlogPost {
  id: number
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  author: string
  viewCount: number
  tags: string[]
}

interface ApiResponse {
  success: boolean
  data: BlogPost[]
  total: number
  error?: string
}

export default function BlogCSRPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔄 客户端开始获取数据...')
    const startTime = Date.now()
    
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts')
        const result: ApiResponse = await response.json()
        
        if (result.success) {
          setPosts(result.data)
          console.log(`✅ 客户端数据获取成功，耗时: ${Date.now() - startTime}ms`)
        } else {
          throw new Error(result.error || '获取失败')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '未知错误'
        setError(errorMessage)
        console.error('❌ 客户端数据获取失败:', errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            🔄 客户端渲染 (CSR) 演示
          </h2>
          <p className="text-blue-700">
            这个页面使用客户端渲染，数据在浏览器中通过JavaScript获取
          </p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载博客文章...</p>
            <p className="text-sm text-gray-500 mt-2">
              💡 观察控制台，可以看到数据获取的过程
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            ❌ 加载失败
          </h2>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* CSR说明 */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          🔄 客户端渲染 (CSR) 演示
        </h2>
        <p className="text-blue-700 text-sm">
          • 页面首先渲染基础HTML结构<br />
          • 然后通过JavaScript调用API获取数据<br />
          • 数据获取完成后更新界面<br />
          • 用户会看到明显的加载过程
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        博客文章 (客户端渲染)
      </h1>

      {/* 文章列表 */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link 
                    href={`/blog-csr/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>📝 {post.author}</span>
                <span>📅 {post.publishedAt}</span>
                <span>👀 {post.viewCount} 次阅读</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 对比说明 */}
      <div className="mt-12 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          💡 CSR的特点
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-yellow-700 mb-2">优势</h4>
            <ul className="text-yellow-600 space-y-1">
              <li>• 后续页面切换快速</li>
              <li>• 交互性强</li>
              <li>• 服务器压力小</li>
              <li>• 开发相对简单</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-yellow-700 mb-2">劣势</h4>
            <ul className="text-yellow-600 space-y-1">
              <li>• 首屏加载慢</li>
              <li>• SEO不友好</li>
              <li>• 依赖JavaScript</li>
              <li>• 用户体验有跳跃感</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 导航链接 */}
      <div className="mt-8 text-center">
        <div className="space-x-4">
          <Link 
            href="/blog-ssr"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            体验SSR版本 →
          </Link>
          <Link 
            href="/blog-ssg"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            体验SSG版本 →
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          对比不同渲染策略的性能差异
        </p>
      </div>
    </div>
  )
} 