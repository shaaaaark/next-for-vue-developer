import Link from "next/link";
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-purple-600">
          关于页面
        </h1>
        
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-purple-800 mb-2">
            🎯 Next.js路由魔法
          </h2>
          <p className="text-purple-700">
            这个页面的URL是: <code className="bg-purple-100 px-2 py-1 rounded">/about</code>
            <br />
            对应的文件路径: <code className="bg-purple-100 px-2 py-1 rounded">src/app/about/page.tsx</code>
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3">Vue Router方式</h3>
            <pre className="text-sm text-green-700">
{`// 1. 创建组件
const About = { 
  template: '<div>关于</div>' 
}

// 2. 配置路由
const routes = [
  { path: '/about', component: About }
]

// 3. 创建路由器
const router = VueRouter.createRouter({
  routes
})

// 4. 使用路由器
app.use(router)`}
            </pre>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-3">Next.js方式</h3>
            <pre className="text-sm text-purple-700">
{`// 1. 创建文件夹
📁 src/app/about/

// 2. 创建页面文件
📄 page.tsx

// 3. 导出组件
export default function About() {
  return <div>关于</div>
}

// 4. 完成！路由自动生成 ✨`}
            </pre>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            ⚡ Next.js路由的优势
          </h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• <strong>零配置</strong>：不需要路由配置文件</li>
            <li>• <strong>直观</strong>：文件结构即路由结构</li>
            <li>• <strong>类型安全</strong>：TypeScript自动推断路由</li>
            <li>• <strong>代码分割</strong>：每个页面自动分割代码</li>
          </ul>
        </div>
        
        <div className="text-center">
          <Link
            href="/" 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block mr-4"
          >
            返回首页
          </Link>
          <Link
            href="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            查看产品页面
          </Link>
        </div>
      </div>
    </div>
  );
}