import Image from "next/image";
import StateDemo from '@/components/StateDemo';
import ConditionalAndListDemo from '@/components/ConditionalAndListDemo';
import ComponentCommunicationDemo from '@/components/ComponentCommunicationDemo';

export default function Home() {
  const title = "从Vue到Next.js的学习之旅";
  const subtitle = "Hello, Vue开发者！";
  const currentDate = new Date().toLocaleDateString('zh-CN');
  
  // 演示用的用户数据 - 注意这里的类型会被TSX检查
  const demoUser = {
    name: "Vue开发者小明",
    age: 28,
    isVueUser: true
  };
  
  const handleButtonClick = () => {
    alert("这就是TypeScript + React的事件处理！");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
        {title}
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {subtitle}
        </h2>
        
        <p className="text-gray-600 mb-4">
          今天是 {currentDate}，让我们开始学习React和Next.js吧！
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">📚 学习进度</h3>
          <p className="text-blue-700">
            ✅ JSX/TSX语法 → ✅ 状态管理(useState) → ✅ 条件渲染和列表渲染 → ✅ 组件通信&生命周期 → ✅ Next.js路由系统 → 🔄 数据获取&渲染策略
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Vue中你熟悉的：</h4>
            <ul className="text-green-700 space-y-1">
              <li>• &lt;template&gt; 标签</li>
              <li>• {`{{ variable }}`} 插值语法</li>
              <li>• v-if, v-for 指令</li>
              <li>• data() 函数返回数据</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">React中的对应概念：</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• JSX 直接写HTML</li>
              <li>• {`{variable}`} 花括号插值</li>
              <li>• JavaScript表达式控制</li>
              <li>• const 变量直接定义</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* React 状态管理演示 */}
      <div className="mt-8">
        <StateDemo />
      </div>
      
      {/* 条件渲染和列表渲染演示 */}
      <div className="mt-8">
        <ConditionalAndListDemo />
      </div>
      
      {/* 组件间通信和生命周期演示 */}
      <div className="mt-8">
        <ComponentCommunicationDemo />
      </div>
      
      {/* Next.js路由系统演示 */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600">
          🗺️ Next.js路由系统演示
        </h2>
        
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-indigo-800 mb-2">
            🎯 文件系统路由 - 零配置的路由魔法
          </h3>
          <p className="text-indigo-700">
            在Next.js中，你只需要创建文件夹和文件，路由就自动生成了！
            不像Vue Router需要手动配置每个路由。
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3">Vue Router方式</h4>
            <pre className="text-sm text-green-700">
{`// 需要手动配置
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/products', component: Products },
  { path: '/products/:id', component: ProductDetail }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

app.use(router)`}
            </pre>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-3">Next.js方式</h4>
            <pre className="text-sm text-indigo-700">
{`// 只需要创建文件结构！
📁 src/app/
  📄 page.tsx          → /
  📁 about/
    📄 page.tsx        → /about
  📁 products/
    📄 page.tsx        → /products
    📁 [id]/
      📄 page.tsx      → /products/123

// 零配置！自动生成路由 ✨`}
            </pre>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            🚀 现在试试这些路由页面
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a 
              href="/about" 
              className="block p-4 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors text-center group"
            >
              <h4 className="font-medium text-purple-800 group-hover:text-purple-900">
                📄 关于页面
              </h4>
              <p className="text-sm text-purple-600 mt-1">/about</p>
              <p className="text-xs text-purple-500 mt-1">基础路由演示</p>
            </a>
            
            <a 
              href="/products" 
              className="block p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors text-center group"
            >
              <h4 className="font-medium text-blue-800 group-hover:text-blue-900">
                📦 产品列表
              </h4>
              <p className="text-sm text-blue-600 mt-1">/products</p>
              <p className="text-xs text-blue-500 mt-1">列表页面 + Link组件</p>
            </a>
            
            <a 
              href="/products/1" 
              className="block p-4 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors text-center group"
            >
              <h4 className="font-medium text-orange-800 group-hover:text-orange-900">
                🔍 产品详情
              </h4>
              <p className="text-sm text-orange-600 mt-1">/products/[id]</p>
              <p className="text-xs text-orange-500 mt-1">动态路由演示</p>
            </a>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            ✨ Next.js路由系统优势
          </h3>
          <ul className="text-green-700 space-y-1 text-sm">
            <li>• <strong>零配置</strong>：文件结构即路由结构</li>
            <li>• <strong>自动代码分割</strong>：每个页面独立打包</li>
            <li>• <strong>类型安全</strong>：TypeScript自动推导路由参数</li>
            <li>• <strong>预加载优化</strong>：Link组件自动预加载页面</li>
            <li>• <strong>嵌套路由</strong>：支持复杂的路由结构</li>
            <li>• <strong>中间件支持</strong>：可以添加路由级别的逻辑</li>
          </ul>
        </div>
      </div>
      
      {/* Next.js数据获取演示 */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-orange-600">
          🔄 Next.js数据获取与渲染策略演示
        </h2>
        
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-orange-800 mb-2">
            🎯 全新的数据获取方式 - 不只是客户端！
          </h3>
          <p className="text-orange-700">
            Vue主要使用客户端渲染，而Next.js提供了多种渲染策略：
            CSR(客户端渲染)、SSR(服务端渲染)、SSG(静态生成)、ISR(增量静态再生)
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">
              🔄 客户端渲染 (CSR)
            </h3>
            <p className="text-blue-700 mb-4">
              类似Vue的传统方式，数据在浏览器中通过JavaScript获取
            </p>
            <div className="text-sm text-blue-600 mb-4 space-y-1">
              <p>• 先显示页面框架，再加载数据</p>
              <p>• 用户会看到明显的加载状态</p>
              <p>• 与Vue的开发体验类似</p>
            </div>
            <a 
              href="/blog-csr" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              体验CSR演示 →
            </a>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-xl font-semibold text-green-800 mb-3">
              🚀 服务端渲染 (SSR)
            </h3>
            <p className="text-green-700 mb-4">
              Next.js的核心特性，数据在服务端获取后返回完整页面
            </p>
            <div className="text-sm text-green-600 mb-4 space-y-1">
              <p>• 没有加载状态，直接显示完整内容</p>
              <p>• 首屏更快，SEO友好</p>
              <p>• Vue需要Nuxt.js才有类似功能</p>
            </div>
            <a 
              href="/blog-ssr" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              体验SSR演示 →
            </a>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-800 mb-3">
              🏗️ 静态生成 (SSG)
            </h3>
            <p className="text-purple-700 mb-4">
              构建时生成静态HTML文件，访问速度最快
            </p>
            <div className="text-sm text-purple-600 mb-4 space-y-1">
              <p>• 构建时获取数据生成静态页面</p>
              <p>• 访问速度最快，CDN友好</p>
              <p>• Vue生态中较少见的特性</p>
            </div>
            <a 
              href="/blog-ssg" 
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              体验SSG演示 →
            </a>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-yellow-800 mb-3">
            🎯 体验建议
          </h3>
          <ol className="text-yellow-700 space-y-2 text-sm">
            <li><strong>第一步:</strong> 先访问CSR版本，观察加载过程和控制台日志</li>
            <li><strong>第二步:</strong> 再访问SSR版本，感受无加载状态的体验</li>
            <li><strong>第三步:</strong> 对比两种方式的页面加载速度差异</li>
            <li><strong>第四步:</strong> 使用浏览器开发者工具查看Network面板的请求时序</li>
          </ol>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">
            💡 核心差异总结
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-purple-700 mb-2">Vue应用 (主要CSR)</h4>
              <ul className="text-purple-600 space-y-1">
                <li>• 客户端渲染为主</li>
                <li>• 需要Nuxt.js才有SSR</li>
                <li>• onMounted中获取数据</li>
                <li>• SEO需要额外配置</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-700 mb-2">Next.js应用 (多种选择)</h4>
              <ul className="text-purple-600 space-y-1">
                <li>• 原生支持多种渲染策略</li>
                <li>• SSR开箱即用</li>
                <li>• 服务端组件自动SSR</li>
                <li>• SEO天然友好</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* 学习总结 */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          🎉 恭喜！你已经掌握了React/Next.js的核心概念
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-medium text-green-600">✅ JSX/TSX</h4>
            <p className="text-sm text-gray-600">类型安全的模板语法</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-medium text-blue-600">✅ useState</h4>
            <p className="text-sm text-gray-600">响应式状态管理</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-medium text-purple-600">✅ 条件&列表渲染</h4>
            <p className="text-sm text-gray-600">JavaScript表达式控制UI</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-medium text-orange-600">✅ 组件通信&生命周期</h4>
            <p className="text-sm text-gray-600">props/回调函数 + useEffect</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-medium text-indigo-600">✅ Next.js路由</h4>
            <p className="text-sm text-gray-600">文件系统路由</p>
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          太棒了！你已经掌握了从React基础到Next.js路由系统的核心概念。
          接下来可以学习更多Next.js的高级特性，比如数据获取、API路由、服务端渲染等。
        </p>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
          继续学习Next.js高级特性！
        </button>
      </div>
    
    </div>
  );
}
