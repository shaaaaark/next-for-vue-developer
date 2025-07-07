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

// 静态数据获取函数
async function getStaticPosts(): Promise<BlogPost[]> {
  console.log('🏗️ 构建时获取数据...')
  const buildTime = Date.now()
  
  try {
    // 在构建时调用API获取数据
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts`, {
      // 强制缓存，因为这是静态生成
      cache: 'force-cache'
    })
    
    if (!response.ok) {
      throw new Error('获取文章失败')
    }
    
    const result: ApiResponse = await response.json()
    console.log(`✅ 构建时数据获取成功，耗时: ${Date.now() - buildTime}ms`)
    
    return result.data
  } catch (error) {
    console.error('❌ 构建时数据获取失败:', error)
    // 为了演示，返回模拟数据
    return [
      {
        id: 1,
        title: 'Vue到React的思维转换',
        excerpt: '探讨Vue开发者如何快速适应React的开发模式',
        slug: 'vue-to-react-mindset',
        publishedAt: '2024-01-15',
        author: '前端学习者',
        viewCount: 1245,
        tags: ['Vue', 'React', '学习心得']
      },
      {
        id: 2,
        title: 'Next.js的渲染策略深度解析',
        excerpt: '深入理解Next.js的多种渲染策略及其应用场景',
        slug: 'nextjs-rendering-strategies',
        publishedAt: '2024-01-10',
        author: '技术分享者',
        viewCount: 2156,
        tags: ['Next.js', 'SSR', 'SSG', '性能优化']
      },
      {
        id: 3,
        title: 'TypeScript在React中的最佳实践',
        excerpt: '分享React+TypeScript开发中的实用技巧和模式',
        slug: 'typescript-react-best-practices',
        publishedAt: '2024-01-05',
        author: '类型安全守护者',
        viewCount: 892,
        tags: ['TypeScript', 'React', '最佳实践']
      }
    ]
  }
}

// 静态生成组件
export default async function BlogSSGPage() {
  // 在构建时获取数据
  const posts = await getStaticPosts()
  const buildTime = new Date().toISOString()
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* SSG说明 */}
      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-purple-800 mb-2">
          🏗️ 静态生成 (SSG) 演示
        </h2>
        <p className="text-purple-700 text-sm">
          • 这个页面在构建时生成，部署后就是静态HTML文件<br />
          • 数据在构建时获取，不会在每次访问时重新获取<br />
          • 访问速度最快，CDN友好，但数据可能不是最新的<br />
          • 适合内容变化不频繁的页面，如博客文章
        </p>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        博客文章 (静态生成)
      </h1>

      {/* 文章列表 */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link 
                    href={`/blog-ssg/${post.slug}`}
                    className="hover:text-purple-600 transition-colors"
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

      {/* 构建信息 */}
      <div className="mt-8 bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🏗️ 静态生成信息
        </h3>
        <p className="text-gray-600 text-sm">
          页面构建时间: {new Date(buildTime).toLocaleString('zh-CN')}<br />
          数据获取方式: 构建时从API获取<br />
          缓存策略: force-cache (永久缓存)<br />
          🚀 这是一个静态HTML文件，访问速度极快！
        </p>
      </div>

      {/* 对比说明 */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          💡 SSG的特点
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-yellow-700 mb-2">优势</h4>
            <ul className="text-yellow-600 space-y-1">
              <li>• 访问速度最快</li>
              <li>• CDN友好，全球分发</li>
              <li>• 服务器压力最小</li>
              <li>• SEO最优</li>
              <li>• 安全性高（静态文件）</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-yellow-700 mb-2">劣势</h4>
            <ul className="text-yellow-600 space-y-1">
              <li>• 数据可能不是最新的</li>
              <li>• 构建时间可能较长</li>
              <li>• 更新内容需要重新构建</li>
              <li>• 不适合实时数据</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 构建演示 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          🔍 构建过程演示
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>1. 开发时:</strong> <code>pnpm dev</code> - 每次访问都重新生成</p>
          <p><strong>2. 构建时:</strong> <code>pnpm build</code> - 生成静态HTML文件</p>
          <p><strong>3. 生产时:</strong> 直接服务静态文件，无需服务器计算</p>
          <div className="bg-blue-100 p-3 rounded mt-3">
            <code className="text-xs">
              .next/static/chunks/pages/blog-ssg-[hash].html<br />
              ↑ 这就是生成的静态文件
            </code>
          </div>
        </div>
      </div>

      {/* 与其他渲染策略的对比 */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-indigo-800 mb-3">
          📊 渲染策略对比
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">特性</th>
                <th className="text-left p-2">CSR</th>
                <th className="text-left p-2">SSR</th>
                <th className="text-left p-2 bg-purple-100">SSG</th>
              </tr>
            </thead>
            <tbody className="text-indigo-700">
              <tr className="border-b">
                <td className="p-2 font-medium">数据获取时机</td>
                <td className="p-2">客户端运行时</td>
                <td className="p-2">每次请求时</td>
                <td className="p-2 bg-purple-50">构建时</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">首屏速度</td>
                <td className="p-2">慢</td>
                <td className="p-2">快</td>
                <td className="p-2 bg-purple-50">最快</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">服务器压力</td>
                <td className="p-2">小</td>
                <td className="p-2">大</td>
                <td className="p-2 bg-purple-50">最小</td>
              </tr>
              <tr>
                <td className="p-2 font-medium">数据新鲜度</td>
                <td className="p-2">实时</td>
                <td className="p-2">实时</td>
                <td className="p-2 bg-purple-50">构建时</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 导航链接 */}
      <div className="mt-8 text-center">
        <div className="space-x-4">
          <Link 
            href="/blog-csr"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← CSR版本
          </Link>
          <Link 
            href="/blog-ssr"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            ← SSR版本
          </Link>
          <Link 
            href="/blog-isr"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            体验ISR版本 →
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          💡 运行 <code>pnpm build</code> 可以看到SSG的构建过程
        </p>
      </div>
    </div>
  )
}

// 生成页面元数据
export async function generateMetadata() {
  const posts = await getStaticPosts()
  
  return {
    title: `博客文章 (SSG) - 共${posts.length}篇`,
    description: '使用静态生成的博客文章列表，展示SSG的特点和优势',
  }
} 