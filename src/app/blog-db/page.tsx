import { prisma } from '@/lib/prisma'
import Link from 'next/link'

// 强制动态渲染，避免构建时预渲染
export const dynamic = 'force-dynamic'

// 获取所有已发布的文章
async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true, avatar: true }
        },
        tags: {
          include: { tag: true }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return posts
  } catch (error) {
    console.error('获取文章失败:', error)
    return []
  }
}

export default async function BlogDBPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 数据库驱动的博客系统
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            基于 Prisma + SQLite 的完整 CRUD 操作演示
          </p>
          
          {/* 导航链接 */}
          <div className="flex justify-center gap-4 mb-8">
            <Link 
              href="/admin/posts" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📝 管理文章
            </Link>
            <Link 
              href="/admin/posts/create" 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              ✍️ 写文章
            </Link>
          </div>
        </div>

        {/* 技术特性说明 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🎯 技术特性</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">数据库层</h3>
              <ul className="space-y-1">
                <li>• Prisma ORM - 类型安全的数据操作</li>
                <li>• SQLite - 零配置的本地数据库</li>
                <li>• 关系查询 - 用户、文章、标签、评论</li>
                <li>• 数据验证 - Zod schema 验证</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">应用层</h3>
              <ul className="space-y-1">
                <li>• Server Actions - 服务端表单处理</li>
                <li>• 自动缓存 - Next.js 自动重新验证</li>
                <li>• 类型安全 - 端到端 TypeScript</li>
                <li>• 实时更新 - 乐观更新和错误处理</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 文章列表 */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">还没有发布的文章</p>
            <Link 
              href="/admin/posts/create"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建第一篇文章
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {/* 文章标题 */}
                  <h2 className="text-2xl font-bold mb-3">
                    <Link 
                      href={`/blog-db/${post.slug}`}
                      className="text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  
                  {/* 文章摘要 */}
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  
                  {/* 标签 */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((postTag) => (
                        <span
                          key={postTag.tag.id}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {postTag.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* 文章元信息 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {post.author.avatar && (
                          <img 
                            src={post.author.avatar} 
                            alt={post.author.name || '匿名用户'}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span>{post.author.name || '匿名用户'}</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                      <span>•</span>
                      <span>{post._count.comments} 条评论</span>
                      <span>•</span>
                      <span>{post.viewCount} 次浏览</span>
                    </div>
                    
                    <Link 
                      href={`/blog-db/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      阅读全文 →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Vue对比说明 */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">
            🔄 Vue vs Next.js 数据处理对比
          </h2>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Vue方式:</strong> 组件挂载 → axios请求 → 状态更新 → 页面渲染</p>
            <p><strong>Next.js方式:</strong> 服务端直接查询 → 完整HTML返回 → 立即可见</p>
            <p className="mt-3 font-medium">优势：更快的首屏加载、更好的SEO、类型安全保障</p>
          </div>
        </div>
      </div>
    </div>
  )
}