import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'

// 强制动态渲染，避免构建时预渲染
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      tags: {
        include: {
          tag: true
        }
      },
      comments: {
        include: {
          author: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!post) {
    return null
  }

  // 增加浏览量
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } }
  })

  return post
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, excerpt: true }
  })

  if (!post) {
    return {
      title: '文章不存在'
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

// Markdown渲染组件
function MarkdownContent({ content }: { content: string }) {
  // 简单的markdown渲染，将来可以替换为更完整的渲染器
  const htmlContent = content
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-6">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-8">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-2 py-1 bg-gray-100 text-sm rounded font-mono">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>')
    .replace(/^\- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$2</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, '<br/>')

  // 包装段落
  const paragraphs = htmlContent.split('</p><p class="mb-4">').map((para, index) => {
    if (index === 0) return `<p class="mb-4">${para}`
    return para
  }).join('</p><p class="mb-4">')

  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: paragraphs + '</p>' }}
    />
  )
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const isDocsPost = post.slug.startsWith('docs-')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 返回链接 */}
        <div className="mb-8">
          <Link 
            href={isDocsPost ? "/docs" : "/blog-db"}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← 返回{isDocsPost ? '文档中心' : '博客'}
          </Link>
        </div>

        {/* 文章头部 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((postTag) => (
                <span
                  key={postTag.tag.id}
                  className={`px-3 py-1 text-sm rounded-full ${
                    postTag.tag.name === '教程' 
                      ? 'bg-blue-100 text-blue-800'
                      : postTag.tag.name === '指南'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {postTag.tag.name}
                </span>
              ))}
            </div>

            {/* 标题 */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* 摘要 */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6">
                {post.excerpt}
              </p>
            )}

            {/* 元信息 */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <img 
                    src={post.author.avatar ? post.author.avatar : '/default-avatar.png'} 
                    alt={post.author.name || '用户头像'}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{post.author.name || '匿名用户'}</span>
                </div>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                {post.updatedAt > post.createdAt && (
                  <>
                    <span>•</span>
                    <span>更新于 {new Date(post.updatedAt).toLocaleDateString('zh-CN')}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span>👀 {post.viewCount}</span>
                <span>💬 {post.comments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 文章内容 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <MarkdownContent content={post.content || '暂无内容'} />
        </div>

        {/* 评论区 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            评论 ({post.comments.length})
          </h3>
          
          {post.comments.length > 0 ? (
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={comment.author.avatar ? comment.author.avatar : '/default-avatar.png'} 
                      alt={comment.author.name || '用户头像'}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">{comment.author.name || '匿名用户'}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">暂无评论</p>
          )}
        </div>
      </div>
    </div>
  )
} 