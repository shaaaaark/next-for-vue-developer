import Link from 'next/link';
import { ScrollPositionDebugger } from '@/components/GlobalScrollManager';

export default function ScrollDemoPage() {
  // 生成长内容用于测试滚动
  const generateContent = () => {
    const sections = [];
    for (let i = 1; i <= 15; i++) {
      sections.push(
        <section key={i} className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            第 {i} 章节
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            这是第 {i} 个章节的内容。这个页面用来演示全局滚动位置保存功能。
            你可以滚动到任意位置，然后通过导航链接跳转到其他页面，
            再返回这个页面时，滚动位置会自动恢复到你离开时的位置。
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">功能特点</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 自动保存滚动位置到 sessionStorage</li>
                <li>• 页面切换时自动恢复位置</li>
                <li>• 支持防抖优化性能</li>
                <li>• 多页面独立记录</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded">
              <h3 className="font-semibold text-blue-700 mb-2">测试步骤</h3>
              <ol className="text-sm text-blue-600 space-y-1">
                <li>1. 滚动到此位置</li>
                <li>2. 点击下方导航链接</li>
                <li>3. 在其他页面滚动一下</li>
                <li>4. 返回这个页面</li>
                <li>5. 观察位置是否恢复</li>
              </ol>
            </div>
          </div>
        </section>
      );
    }
    return sections;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 开发调试器 */}
      <ScrollPositionDebugger />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            全局滚动位置保存演示
          </h1>
          <p className="text-xl text-gray-600">
            测试页面级别的滚动位置自动保存与恢复功能
          </p>
        </div>

        {/* 导航区域 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            测试导航 - 点击跳转到其他页面
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link 
              href="/"
              className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <div className="font-semibold text-blue-800">首页</div>
              <div className="text-sm text-blue-600">查看学习进度</div>
            </Link>
            
            <Link 
              href="/state-management"
              className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <div className="font-semibold text-blue-800">状态管理</div>
              <div className="text-sm text-blue-600">Zustand演示</div>
            </Link>
            
            <Link 
              href="/forms"
              className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <div className="font-semibold text-blue-800">表单处理</div>
              <div className="text-sm text-blue-600">Server Actions</div>
            </Link>
          </div>
        </div>

        {/* 实现说明 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🔧 实现原理
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">1. Hook实现</h3>
              <pre className="text-sm bg-gray-50 p-3 rounded border text-gray-700 overflow-x-auto">
{`// hooks/useGlobalScrollRestore.ts
export function useGlobalScrollRestore() {
  const pathname = usePathname()
  
  // 保存滚动位置到sessionStorage
  const saveScrollPosition = () => {
    const position = {
      pathname,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      timestamp: Date.now()
    }
    sessionStorage.setItem('scroll', 
      JSON.stringify(position))
  }
  
  // 页面加载时恢复位置
  useEffect(() => {
    restoreScrollPosition()
  }, [pathname])
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">2. 全局集成</h3>
              <pre className="text-sm bg-gray-50 p-3 rounded border text-gray-700 overflow-x-auto">
{`// layout.tsx 中使用
import GlobalScrollManager from 
  '@/components/GlobalScrollManager'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlobalScrollManager>
          {children}
        </GlobalScrollManager>
      </body>
    </html>
  )
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* 长内容区域 */}
        <div>
          {generateContent()}
        </div>

        {/* 底部导航 */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            继续测试
          </h3>
          <p className="text-gray-600 mb-4">
            现在滚动到这里，然后点击下面的链接，体验滚动位置保存功能：
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/about"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              访问关于页面
            </Link>
            <Link 
              href="/products"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              查看产品列表
            </Link>
            <Link 
              href="/blog-ssr"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              SSR演示页面
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 