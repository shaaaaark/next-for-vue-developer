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
}

// 服务端数据获取函数
async function getPosts(): Promise<BlogPost[]> {
  console.log('🚀 服务端开始获取数据...')
  const startTime = Date.now()
  
  try {
    // 在构建时使用备用数据，运行时使用API
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_BASE_URL) {
      // 构建时返回模拟数据
      console.log('✅ 使用构建时备用数据')
      return [
        {
          id: 1,
          title: 'SSR渲染的文章示例',
          excerpt: '这是服务端渲染获取的文章内容',
          slug: 'ssr-demo-post',
          publishedAt: '2024-01-20',
          author: 'SSR演示者',
          viewCount: 1500,
          tags: ['SSR', 'Next.js', '服务端渲染']
        }
      ]
    }
    
    // 运行时调用API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts`, {
      // 服务端渲染时不缓存，确保数据是最新的
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('获取文章失败')
    }
    
    const result: ApiResponse = await response.json()
    console.log(`✅ 服务端数据获取成功，耗时: ${Date.now() - startTime}ms`)
    
    return result.data
  } catch (error) {
    console.error('❌ 服务端数据获取失败:', error)
    // 返回备用数据，避免页面崩溃
    return [
      {
        id: 1,
        title: 'SSR渲染的文章示例',
        excerpt: '这是服务端渲染获取的文章内容',
        slug: 'ssr-demo-post',
        publishedAt: '2024-01-20',
        author: 'SSR演示者',
        viewCount: 1500,
        tags: ['SSR', 'Next.js', '服务端渲染']
      }
    ]
  }
}

// 服务端组件 - 自动SSR
export default async function BlogSSRPage() {
  // 在服务端获取数据
  const posts = await getPosts()
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* SSR说明 */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          🚀 服务端渲染 (SSR) 演示
        </h2>
        <p className="text-green-700 text-sm">
          • 数据在服务端获取完成后才返回HTML<br />
          • 用户收到的页面已经包含了完整内容<br />
          • 没有加载状态，直接看到完整页面<br />
          • SEO友好，搜索引擎可以直接抓取内容
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        博客文章 (服务端渲染)
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">暂无文章</p>
        </div>
      ) : (
        <>
          {/* 文章列表 */}
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link 
                        href={`/blog-ssr/${post.slug}`}
                        className="hover:text-green-600 transition-colors"
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

          {/* 实时渲染信息 */}
          <div className="mt-8 bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ⏱️ 渲染信息
            </h3>
            <p className="text-gray-600 text-sm">
              页面渲染时间: {new Date().toLocaleString('zh-CN')}<br />
              数据获取方式: 服务端 fetch API<br />
              缓存策略: no-store (每次都获取最新数据)
            </p>
          </div>
        </>
      )}

      {/* 对比说明 */}
      <div className="mt-12 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          💡 SSR的特点
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-yellow-700 mb-2">优势</h4>
            <ul className="text-yellow-600 space-y-1">
              <li>• 首屏加载快</li>
              <li>• SEO友好</li>
              <li>• 更好的用户体验</li>
              <li>• 数据新鲜度高</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-yellow-700 mb-2">劣势</h4>
            <ul className="text-yellow-600 space-y-1">
              <li>• 服务器压力大</li>
              <li>• 每次请求都要渲染</li>
              <li>• 可能影响TTFB</li>
              <li>• 需要服务器环境</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 性能对比 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          🔍 与CSR的差异
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>加载过程:</strong> CSR需要先加载页面框架，再获取数据；SSR直接返回包含数据的完整页面</p>
          <p><strong>首屏时间:</strong> SSR通常更快，因为避免了客户端的二次请求</p>
          <p><strong>SEO:</strong> SSR对搜索引擎更友好，爬虫可以直接获取完整内容</p>
        </div>
      </div>

      {/* 导航链接 */}
      <div className="mt-8 text-center">
        <div className="space-x-4">
          <Link 
            href="/blog-csr"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← 回到CSR版本
          </Link>
          <Link 
            href="/blog-ssg"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            体验SSG版本 →
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          刷新页面观察SSR的渲染过程
        </p>
      </div>
    </div>
  )
}

// 生成页面元数据
export async function generateMetadata() {
  const posts = await getPosts()
  
  return {
    title: `博客文章 (SSR) - 共${posts.length}篇`,
    description: '使用服务端渲染的博客文章列表，展示SSR的特点和优势',
  }
} 