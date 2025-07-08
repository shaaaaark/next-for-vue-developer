import { NextRequest, NextResponse } from 'next/server'

// 复用前面定义的数据（实际项目中可能从数据库获取）
const posts = [
  {
    id: 1,
    title: 'Vue到React的思维转换',
    content: `
      <h2>理解组件化思想的差异</h2>
      <p>Vue的组件是基于选项式API或组合式API，而React的组件本质上就是JavaScript函数。这个差异影响了我们思考组件的方式。</p>
      
      <h3>Vue组件示例</h3>
      <pre><code>
// Vue组件
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() { this.count++ }
  }
}
      </code></pre>
      
      <h3>React组件示例</h3>
      <pre><code>
// React组件
function Counter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)
  return <button onClick={increment}>{count}</button>
}
      </code></pre>
      
      <p>React的函数式组件让状态管理变得更加明确和可预测。</p>
    `,
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
    content: `
      <h2>三种核心渲染策略</h2>
      <p>Next.js提供了SSR、SSG、ISR三种渲染策略，每种都有其适用场景。</p>
      
      <h3>1. SSR - 服务端渲染</h3>
      <p>适用于需要实时数据的页面，如用户个人中心、实时数据展示。</p>
      
      <h3>2. SSG - 静态生成</h3>
      <p>适用于内容相对固定的页面，如博客文章、产品介绍页。</p>
      
      <h3>3. ISR - 增量静态再生</h3>
      <p>结合了SSG和SSR的优势，既有静态页面的性能，又能定期更新内容。</p>
      
      <p>选择正确的渲染策略对性能和用户体验至关重要。</p>
    `,
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
    content: `
      <h2>类型安全的React开发</h2>
      <p>TypeScript为React开发带来了更好的开发体验和代码质量。</p>
      
      <h3>组件Props类型定义</h3>
      <pre><code>
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

function Button({ children, onClick, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={\`btn btn-\${variant}\`}
    >
      {children}
    </button>
  )
}
      </code></pre>
      
      <h3>useState的类型推断</h3>
      <pre><code>
// TypeScript会自动推断类型
const [count, setCount] = useState(0) // number
const [user, setUser] = useState<User | null>(null) // User | null
      </code></pre>
      
      <p>合理使用TypeScript能让React开发更加高效和安全。</p>
    `,
    excerpt: '分享React+TypeScript开发中的实用技巧和模式',
    slug: 'typescript-react-best-practices',
    publishedAt: '2024-01-05',
    author: '类型安全守护者',
    viewCount: 892,
    tags: ['TypeScript', 'React', '最佳实践']
  }
]

// GET /api/posts/[slug] - 根据slug获取单个文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    console.log('🔍 查找文章:', slug)
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 查找文章
    const post = posts.find(p => p.slug === slug)
    
    if (!post) {
      return NextResponse.json(
        { 
          success: false, 
          error: '文章未找到' 
        }, 
        { status: 404 }
      )
    }
    
    // 模拟增加阅读量
    post.viewCount++
    
    console.log('✅ 找到文章:', post.title)
    
    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('❌ 获取文章失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '服务器错误' 
      }, 
      { status: 500 }
    )
  }
}

// PUT /api/posts/[slug] - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const postIndex = posts.findIndex(p => p.slug === slug)
    
    if (postIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: '文章未找到' 
        }, 
        { status: 404 }
      )
    }
    
    // 更新文章
    posts[postIndex] = {
      ...posts[postIndex],
      ...body,
      // 保护一些不应该被修改的字段
      id: posts[postIndex].id,
      slug: posts[postIndex].slug,
      publishedAt: posts[postIndex].publishedAt
    }
    
    return NextResponse.json({
      success: true,
      data: posts[postIndex]
    })
  } catch (_error) {
    return NextResponse.json(
      { 
        success: false, 
        error: '更新文章失败' 
      }, 
      { status: 500 }
    )
  }
} 