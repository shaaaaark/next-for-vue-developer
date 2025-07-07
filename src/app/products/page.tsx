import Link from 'next/link';

// 模拟数据 - 在实际项目中这可能来自API
const products = [
  { id: 1, name: 'Vue学习手册', price: 99, description: '深入学习Vue.js框架' },
  { id: 2, name: 'React实战指南', price: 129, description: '从零开始学习React' },
  { id: 3, name: 'Next.js完全教程', price: 159, description: '掌握全栈开发' },
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          产品列表
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            🗺️ 文件系统路由演示
          </h2>
          <p className="text-blue-700">
            当前页面: <code className="bg-blue-100 px-2 py-1 rounded">/products</code>
            <br />
            点击产品可以访问动态路由: <code className="bg-blue-100 px-2 py-1 rounded">/products/[id]</code>
          </p>
        </div>
        
        {/* 产品列表 */}
        <div className="grid gap-4 mb-8">
          {products.map(product => (
            <Link 
              key={product.id}
              href={`/products/${product.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border group"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                  <p className="text-gray-500 text-xs mt-1">产品ID: {product.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">¥{product.price}</p>
                  <p className="text-sm text-gray-500 group-hover:text-blue-500">
                    点击查看详情 →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* 路由对比说明 */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-green-800 mb-3">💡 动态路由对比</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Vue Router</h4>
              <pre className="text-green-600 bg-green-100 p-2 rounded">
{`// router配置
{
  path: '/products/:id',
  component: ProductDetail,
  props: true
}

// 模板中使用
<router-link 
  :to="\`/products/\${product.id}\`">
  查看详情
</router-link>`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-green-700 mb-2">Next.js</h4>
              <pre className="text-green-600 bg-green-100 p-2 rounded">
{`// 文件结构
📁 products/[id]/page.tsx

// 组件中使用
<Link href={\`/products/\${product.id}\`}>
  查看详情
</Link>

// 自动类型安全 + 预加载！`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* 特性说明 */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            🚀 Next.js Link组件特性
          </h3>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>• <strong>自动预加载</strong>：鼠标悬停时预加载页面</li>
            <li>• <strong>客户端导航</strong>：无需刷新页面</li>
            <li>• <strong>类型安全</strong>：TypeScript自动检查路由</li>
            <li>• <strong>性能优化</strong>：只加载需要的代码</li>
          </ul>
        </div>
        
        <div className="text-center">
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block mr-4"
          >
            返回首页
          </a>
          <a 
            href="/about" 
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-block"
          >
            关于页面
          </a>
        </div>
      </div>
    </div>
  );
}