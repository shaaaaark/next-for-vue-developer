import { NextResponse } from 'next/server'

// 模拟博客文章数据
interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  publishedAt: string
  author: string
  viewCount: number
  tags: string[]
}

const posts: BlogPost[] = [
  {
    id: 1,
    title: 'Vue到React的思维转换',
    content: '<p>从Vue开发者的角度来理解React的组件化思想...</p><p>Vue的响应式系统vs React的状态管理...</p>',
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
    content: '<p>SSR、SSG、ISR三种渲染策略的优缺点分析...</p><p>如何根据业务场景选择合适的渲染方式...</p>',
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
    content: '<p>如何在React项目中充分利用TypeScript的类型系统...</p><p>常见的类型定义模式和技巧...</p>',
    excerpt: '分享React+TypeScript开发中的实用技巧和模式',
    slug: 'typescript-react-best-practices',
    publishedAt: '2024-01-05',
    author: '类型安全守护者',
    viewCount: 892,
    tags: ['TypeScript', 'React', '最佳实践']
  }
]

// GET /api/posts - 获取所有文章
export async function GET() {
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 返回文章列表
    return NextResponse.json({
      success: true,
      data: posts,
      total: posts.length
    })
  } catch (_error) {
    return NextResponse.json(
      { 
        success: false, 
        error: '获取文章列表失败' 
      }, 
      { status: 500 }
    )
  }
}

// POST /api/posts - 创建新文章
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 简单的数据验证
    if (!body.title || !body.content) {
      return NextResponse.json(
        { 
          success: false, 
          error: '标题和内容不能为空' 
        }, 
        { status: 400 }
      )
    }
    
    // 创建新文章
    const newPost: BlogPost = {
      id: posts.length + 1,
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 100) + '...',
      slug: body.title.toLowerCase().replace(/\s+/g, '-'),
      publishedAt: new Date().toISOString().split('T')[0],
      author: body.author || '匿名作者',
      viewCount: 0,
      tags: body.tags || []
    }
    
    posts.push(newPost)
    
    return NextResponse.json({
      success: true,
      data: newPost
    }, { status: 201 })
  } catch (_error) {
    return NextResponse.json(
      { 
        success: false, 
        error: '创建文章失败' 
      }, 
      { status: 500 }
    )
  }
} 