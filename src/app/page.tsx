"use client";


import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import StateDemo from '@/components/StateDemo';
import ConditionalAndListDemo from '@/components/ConditionalAndListDemo';
import ComponentCommunicationDemo from '@/components/ComponentCommunicationDemo';
import FormBasicsDemo from '@/components/FormBasicsDemo';
import ServerActionsDemo from '@/components/ServerActionsDemo';
import FormValidationDemo from '@/components/FormValidationDemo';
import GlobalStateDemo from '@/components/GlobalStateDemo';
import ViewportPositionDemo from '@/components/ViewportPositionDemo';

// 导航项配置 - 简化图标使用
const navigationItems = [
  { id: 'intro', title: '学习简介' },
  { id: 'progress', title: '学习进度' },
  { id: 'comparison', title: 'Vue vs React' },
  { id: 'state-demo', title: '状态管理' },
  { id: 'conditional-list-demo', title: '条件&列表渲染' },
  { id: 'communication-demo', title: '组件通信&生命周期' },
  { id: 'routing-demo', title: '路由系统' },
  { id: 'data-fetching-demo', title: '数据获取' },
  { id: 'forms-demo', title: '表单处理' },
  { id: 'global-state-demo', title: '全局状态管理' },
  { id: 'summary', title: '学习总结' },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState('intro');
  const title = "从Vue到Next.js的学习之旅";
  const subtitle = "Hello, Vue开发者！";
  const currentDate = new Date().toLocaleDateString('zh-CN');
  


  // 滚动到指定部分
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setActiveSection(sectionId);
    }
  };

  // 监听滚动位置，更新活动导航项
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map(item => item.id);
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 左侧导航 */}
      <nav className="w-80 bg-white shadow-lg fixed left-0 top-0 h-full overflow-y-auto z-10">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            学习目录
          </h2>
          
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                    activeSection === item.id
                      ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">学习提示</h3>
            <p className="text-sm text-blue-700">
              点击左侧导航项可以快速跳转到对应内容区域。建议按顺序学习，循序渐进。
            </p>
          </div>
        </div>
      </nav>

      {/* 右侧内容区域 */}
      <main className="flex-1 ml-80">
        <div className="container mx-auto px-8 py-8 max-w-5xl">
          
          {/* 学习简介 */}
          <section id="intro" className="mb-16">
            <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
              {title}
            </h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {subtitle}
              </h2>
              
              <p className="text-gray-600 mb-4">
                今天是 {currentDate}，让我们开始学习React和Next.js吧！
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                <h3 className="font-semibold text-blue-800 mb-2">学习目标</h3>
                <p className="text-blue-700">
                  通过对比Vue和React的差异，帮助Vue开发者快速上手Next.js开发。
                  我们将从基础语法开始，逐步深入到路由、状态管理、数据获取等核心概念。
                </p>
              </div>
            </div>
          </section>

          {/* 学习进度 */}
          <section id="progress" className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-600">
                学习进度
              </h2>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                <p className="text-blue-700">
                  JSX/TSX语法 → 状态管理(useState) → 条件渲染和列表渲染 → 组件通信&生命周期 → Next.js路由系统 → 数据获取&渲染策略 → 表单处理 → <strong>全局状态管理</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Vue vs React 对比 */}
          <section id="comparison" className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-600">
                Vue vs React 语法对比
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Vue中你熟悉的：</h4>
                  <ul className="text-gray-700 space-y-1">
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
          </section>
          
          {/* React 状态管理演示 */}
          <section id="state-demo" className="mb-16">
            <StateDemo />
          </section>
          
          {/* 条件渲染和列表渲染演示 */}
          <section id="conditional-list-demo" className="mb-16">
            <ConditionalAndListDemo />
          </section>
          
          {/* 组件间通信和生命周期演示 */}
          <section id="communication-demo" className="mb-16">
            <ComponentCommunicationDemo />
          </section>
          
          {/* Next.js路由系统演示 */}
          <section id="routing-demo" className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-600">
                Next.js路由系统演示
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">
                  文件系统路由 - 零配置的路由魔法
                </h3>
                <p className="text-blue-700">
                  在Next.js中，你只需要创建文件夹和文件，路由就自动生成了！
                  不像Vue Router需要手动配置每个路由。
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Vue Router方式</h4>
                  <pre className="text-sm text-gray-700">
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
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Next.js方式</h4>
                  <pre className="text-sm text-blue-700">
{`// 只需要创建文件结构！
📁 src/app/
  📄 page.tsx          → /
  📁 about/
    📄 page.tsx        → /about
  📁 products/
    📄 page.tsx        → /products
    📁 [id]/
      📄 page.tsx      → /products/123

// 零配置！自动生成路由`}
                  </pre>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  现在试试这些路由页面
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link 
                    href="/about" 
                    className="block p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors text-center border border-gray-200"
                  >
                    <h4 className="font-medium text-gray-800">
                      关于页面
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">/about</p>
                    <p className="text-xs text-gray-500 mt-1">基础路由演示</p>
                  </Link>
                  
                  <Link 
                    href="/products" 
                    className="block p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors text-center border border-gray-200"
                  >
                    <h4 className="font-medium text-gray-800">
                      产品列表
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">/products</p>
                    <p className="text-xs text-gray-500 mt-1">列表页面 + Link组件</p>
                  </Link>
                  
                  <Link 
                    href="/products/1" 
                    className="block p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors text-center border border-gray-200"
                  >
                    <h4 className="font-medium text-gray-800">
                      产品详情
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">/products/[id]</p>
                    <p className="text-xs text-gray-500 mt-1">动态路由演示</p>
                  </Link>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Next.js路由系统优势
                </h3>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• 零配置：文件结构即路由结构</li>
                  <li>• 自动代码分割：每个页面独立打包</li>
                  <li>• 类型安全：TypeScript自动推导路由参数</li>
                  <li>• 预加载优化：Link组件自动预加载页面</li>
                  <li>• 嵌套路由：支持复杂的路由结构</li>
                  <li>• 中间件支持：可以添加路由级别的逻辑</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Next.js数据获取演示 */}
          <section id="data-fetching-demo" className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-600">
                Next.js数据获取与渲染策略演示
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">
                  全新的数据获取方式 - 不只是客户端！
                </h3>
                <p className="text-blue-700">
                  Vue主要使用客户端渲染，而Next.js提供了多种渲染策略：
                  CSR(客户端渲染)、SSR(服务端渲染)、SSG(静态生成)、ISR(增量静态再生)
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    客户端渲染 (CSR)
                  </h3>
                  <p className="text-gray-700 mb-4">
                    类似Vue的传统方式，数据在浏览器中通过JavaScript获取
                  </p>
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p>• 先显示页面框架，再加载数据</p>
                    <p>• 用户会看到明显的加载状态</p>
                    <p>• 与Vue的开发体验类似</p>
                  </div>
                  <Link 
                    href="/blog-csr" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    体验CSR演示 →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    服务端渲染 (SSR)
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Next.js的核心特性，数据在服务端获取后返回完整页面
                  </p>
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p>• 没有加载状态，直接显示完整内容</p>
                    <p>• 首屏更快，SEO友好</p>
                    <p>• Vue需要Nuxt.js才有类似功能</p>
                  </div>
                  <Link 
                    href="/blog-ssr" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    体验SSR演示 →
                  </Link>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    静态生成 (SSG)
                  </h3>
                  <p className="text-gray-700 mb-4">
                    构建时生成静态HTML文件，访问速度最快
                  </p>
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p>• 构建时获取数据生成静态页面</p>
                    <p>• 访问速度最快，CDN友好</p>
                    <p>• Vue生态中较少见的特性</p>
                  </div>
                  <Link 
                    href="/blog-ssg" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    体验SSG演示 →
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  体验建议
                </h3>
                <ol className="text-gray-700 space-y-2 text-sm">
                  <li>第一步: 先访问CSR版本，观察加载过程和控制台日志</li>
                  <li>第二步: 再访问SSR版本，感受无加载状态的体验</li>
                  <li>第三步: 对比两种方式的页面加载速度差异</li>
                  <li>第四步: 使用浏览器开发者工具查看Network面板的请求时序</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  核心差异总结
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Vue应用 (主要CSR)</h4>
                    <ul className="text-blue-600 space-y-1">
                      <li>• 客户端渲染为主</li>
                      <li>• 需要Nuxt.js才有SSR</li>
                      <li>• onMounted中获取数据</li>
                      <li>• SEO需要额外配置</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Next.js应用 (多种选择)</h4>
                    <ul className="text-blue-600 space-y-1">
                      <li>• 原生支持多种渲染策略</li>
                      <li>• SSR开箱即用</li>
                      <li>• 服务端组件自动SSR</li>
                      <li>• SEO天然友好</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* 表单处理演示 */}
          <section id="forms-demo" className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-600">
                第七章：表单处理和数据变更
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Next.js表单处理革命性特性
                </h3>
                <p className="text-blue-700 text-sm">
                  学习Server Actions、Zod验证和现代表单处理技术。
                  这是Vue开发者转向Next.js时最令人兴奋的特性之一！
                </p>
              </div>
              
              <div className="space-y-8">
                <FormBasicsDemo />
                <Suspense fallback={<div>加载Server Actions演示...</div>}>
                  <ServerActionsDemo />
                </Suspense>
                <FormValidationDemo />
              </div>
              
              <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  完整表单页面演示
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  想要体验完整的表单处理流程？访问独立的表单演示页面：
                </p>
                <Link 
                  href="/forms" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  访问表单演示页面 →
                </Link>
              </div>
            </div>
          </section>
          
          {/* 全局状态管理演示 */}
          <section id="global-state-demo" className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-600">
                第八章：全局状态管理
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Zustand - Vue开发者的状态管理新选择
                </h3>
                <p className="text-blue-700 text-sm">
                  学习如何使用Zustand管理全局状态，实现状态持久化，
                  并解决页面刷新后视口位置丢失的常见问题。相比Vuex更简单、更轻量！
                </p>
              </div>
              
              <div className="space-y-8">
                <GlobalStateDemo />
                <ViewportPositionDemo />
              </div>
              
              <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  完整状态管理页面演示
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  想要体验完整的全局状态管理？访问独立的演示页面：
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/state-management" 
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    状态管理演示 →
                  </Link>
                  <Link 
                    href="/scroll-demo" 
                    className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    自定义滚动演示 →
                  </Link>
                  <Link 
                    href="/third-party-scroll" 
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    第三方库演示 →
                  </Link>
                </div>
              </div>
            </div>
          </section>
          
          {/* 学习总结 */}
          <section id="summary" className="mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold mb-3 text-blue-600 text-center">
                恭喜！你已经掌握了React/Next.js的核心概念
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-blue-600">JSX/TSX</h4>
                  <p className="text-sm text-gray-600">类型安全的模板语法</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-blue-600">useState</h4>
                  <p className="text-sm text-gray-600">响应式状态管理</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-blue-600">条件&列表渲染</h4>
                  <p className="text-sm text-gray-600">JavaScript表达式控制UI</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-blue-600">组件通信&生命周期</h4>
                  <p className="text-sm text-gray-600">props/回调函数 + useEffect</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-blue-600">Next.js路由</h4>
                  <p className="text-sm text-gray-600">文件系统路由</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-blue-600">数据获取</h4>
                  <p className="text-sm text-gray-600">CSR/SSR/SSG多种策略</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-blue-600">表单处理</h4>
                  <p className="text-sm text-gray-600">Server Actions + Zod验证</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-blue-600">全局状态管理</h4>
                  <p className="text-sm text-gray-600">Zustand + 状态持久化</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-center">
                太棒了！你已经掌握了从React基础到Next.js全局状态管理的核心概念。
                这包括了现代全栈开发的重要技能：Server Actions、类型安全验证、多种渲染策略、
                全局状态管理和视口位置保存等。
              </p>
              <div className="text-center">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  继续学习Next.js高级特性！
                </button>
              </div>
            </div>
          </section>
        
        </div>
      </main>
    </div>
  );
}
