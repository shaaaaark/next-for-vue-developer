import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { deletePost, togglePostPublished } from '@/actions/posts'

// 获取所有文章（包括未发布的）
async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany({
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

function DeleteButton({ postId }: { postId: string, postTitle: string }) {
  return (
    <form action={deletePost} className="inline">
      <input type="hidden" name="id" value={postId} />
      <button
        type="submit"
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        删除
      </button>
    </form>
  )
}

function TogglePublishButton({ postId, published }: { postId: string, published: boolean }) {
  return (
    <form action={togglePostPublished} className="inline">
      <input type="hidden" name="id" value={postId} />
      <button
        type="submit"
        className={`px-3 py-1 text-sm rounded transition-colors ${
          published 
            ? 'bg-orange-600 text-white hover:bg-orange-700' 
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {published ? '取消发布' : '发布'}
      </button>
    </form>
  )
}

export default async function AdminPostsPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
            <p className="text-gray-600 mt-2">管理您的所有文章内容</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/blog-db"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              查看博客
            </Link>
            <Link 
              href="/admin/posts/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ✍️ 写新文章
            </Link>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">总文章数</h3>
            <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">已发布</h3>
            <p className="text-2xl font-bold text-green-600">
              {posts.filter(p => p.published).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">草稿</h3>
            <p className="text-2xl font-bold text-orange-600">
              {posts.filter(p => !p.published).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">总浏览量</h3>
            <p className="text-2xl font-bold text-blue-600">
              {posts.reduce((sum, post) => sum + post.viewCount, 0)}
            </p>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">还没有创建任何文章</p>
              <Link 
                href="/admin/posts/create"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                创建第一篇文章
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      文章信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      数据
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {post.title}
                            </p>
                            {post.excerpt && (
                              <p className="text-sm text-gray-500 truncate mt-1">
                                {post.excerpt}
                              </p>
                            )}
                            <div className="flex items-center mt-2 space-x-2">
                              <div className="flex items-center text-xs text-gray-500">
                                {post.author.avatar && (
                                  <img 
                                    src={post.author.avatar} 
                                    alt={post.author.name || ''}
                                    className="w-4 h-4 rounded-full mr-1"
                                  />
                                )}
                                <span>{post.author.name}</span>
                              </div>
                              {post.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {post.tags.slice(0, 2).map((postTag) => (
                                    <span
                                      key={postTag.tag.id}
                                      className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded"
                                    >
                                      {postTag.tag.name}
                                    </span>
                                  ))}
                                  {post.tags.length > 2 && (
                                    <span className="text-xs text-gray-500">
                                      +{post.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          <div>💬 {post._count.comments} 评论</div>
                          <div>👁️ {post.viewCount} 浏览</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          编辑
                        </Link>
                        <Link
                          href={`/blog-db/${post.slug}`}
                          className="text-gray-600 hover:text-gray-900"
                          target="_blank"
                        >
                          预览
                        </Link>
                        <TogglePublishButton postId={post.id} published={post.published} />
                        <DeleteButton postId={post.id} postTitle={post.title} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 底部说明 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">🎯 CRUD 操作演示</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>创建(Create):</strong> 点击"写新文章"按钮创建新文章</p>
            <p>• <strong>读取(Read):</strong> 页面自动从数据库读取并显示所有文章</p>
            <p>• <strong>更新(Update):</strong> 点击"编辑"修改文章，或切换发布状态</p>
            <p>• <strong>删除(Delete):</strong> 点击"删除"按钮永久删除文章</p>
          </div>
        </div>
      </div>
    </div>
  )
}