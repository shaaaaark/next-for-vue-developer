import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getDocsPosts() {
  return await prisma.post.findMany({
    where: {
      published: true,
      slug: {
        startsWith: 'docs-'
      }
    },
    include: {
      author: true,
      tags: {
        include: {
          tag: true
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    },
    orderBy: [
      { slug: 'asc' }
    ]
  })
}

export default async function DocsPage() {
  const posts = await getDocsPosts()

  // 按类型分组
  const groupedPosts = posts.reduce((acc, post) => {
    const isGuide = post.tags.some(pt => pt.tag.name === '指南')
    const isTutorial = post.tags.some(pt => pt.tag.name === '教程')
    
    if (isGuide) {
      acc.guides.push(post)
    } else if (isTutorial) {
      acc.tutorials.push(post)
    } else {
      acc.references.push(post)
    }
    
    return acc
  }, { tutorials: [] as typeof posts, guides: [] as typeof posts, references: [] as typeof posts })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 学习文档中心
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            从Vue到Next.js的完整学习路径，涵盖基础语法、状态管理、路由、数据获取等核心概念
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              href="/blog-db"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看所有文章
            </Link>
            <Link
              href="/admin/posts"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              管理后台
            </Link>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-2xl font-bold text-blue-600">{groupedPosts.tutorials.length}</h3>
            <p className="text-gray-600">教程文档</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-2xl font-bold text-green-600">{groupedPosts.guides.length}</h3>
            <p className="text-gray-600">指南文档</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-2xl font-bold text-purple-600">{groupedPosts.references.length}</h3>
            <p className="text-gray-600">参考文档</p>
          </div>
        </div>

        {/* 教程文档 */}
        {groupedPosts.tutorials.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              🎯 教程文档
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({groupedPosts.tutorials.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedPosts.tutorials.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/blog-db/${post.slug}`} className="hover:text-blue-600">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>👀 {post.viewCount}</span>
                      <span>💬 {post._count.comments}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {post.tags.map((postTag) => (
                        <span
                          key={postTag.tag.id}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {postTag.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 指南文档 */}
        {groupedPosts.guides.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              📖 指南文档
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({groupedPosts.guides.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedPosts.guides.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      <Link href={`/blog-db/${post.slug}`} className="hover:text-green-600">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>👀 {post.viewCount}</span>
                      <span>💬 {post._count.comments}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {post.tags.map((postTag) => (
                        <span
                          key={postTag.tag.id}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {postTag.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 参考文档 */}
        {groupedPosts.references.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              📋 参考文档
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({groupedPosts.references.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedPosts.references.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      <Link href={`/blog-db/${post.slug}`} className="hover:text-purple-600">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>👀 {post.viewCount}</span>
                      <span>💬 {post._count.comments}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {post.tags.map((postTag) => (
                        <span
                          key={postTag.tag.id}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                        >
                          {postTag.tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">暂无文档</p>
          </div>
        )}
      </div>
    </div>
  )
} 