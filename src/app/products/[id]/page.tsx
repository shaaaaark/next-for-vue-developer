// 这是Next.js的动态路由页面！
// 文件名 [id] 表示这是一个动态参数
import Link from 'next/link';
interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

// 模拟产品数据
const products = [
  { id: 1, name: 'Vue学习手册', price: 99, description: '深入学习Vue.js框架', content: '这是一本全面的Vue.js学习指南...' },
  { id: 2, name: 'React实战指南', price: 129, description: '从零开始学习React', content: '本书将带你从React基础到高级应用...' },
  { id: 3, name: 'Next.js完全教程', price: 159, description: '掌握全栈开发', content: '学习Next.js的所有特性和最佳实践...' },
];

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Next.js自动将URL中的[id]部分传递给params.id
  const productId = parseInt(params.id);
  const product = products.find(p => p.id === productId);

  // 如果产品不存在，显示404状态
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">产品未找到</h1>
          <p className="text-gray-600 mb-6">产品ID {params.id} 不存在</p>
          <Link
            href="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            返回产品列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-orange-600">
          {product.name}
        </h1>
        
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-orange-800 mb-2">
            🎯 动态路由魔法
          </h2>
          <p className="text-orange-700">
            当前URL: <code className="bg-orange-100 px-2 py-1 rounded">/products/{params.id}</code>
            <br />
            文件路径: <code className="bg-orange-100 px-2 py-1 rounded">src/app/products/[id]/page.tsx</code>
            <br />
            URL参数: <code className="bg-orange-100 px-2 py-1 rounded">params.id = "{params.id}"</code>
          </p>
        </div>

        {/* 产品信息 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">产品详情</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-gray-700">{product.content}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">购买信息</h3>
            <div className="space-y-3">
              <p className="text-2xl font-bold text-blue-600">¥{product.price}</p>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                立即购买
              </button>
              <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                加入购物车
              </button>
            </div>
          </div>
        </div>

        {/* 技术对比 */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-green-800 mb-3">🔧 动态路由参数获取对比</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Vue Router</h4>
              <pre className="text-green-600 bg-green-100 p-2 rounded">
{`// 在组件中获取参数
export default {
  mounted() {
    // 方式1: this.$route.params
    const id = this.$route.params.id
    
    // 方式2: props: true
    // props: ['id']
  }
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-green-700 mb-2">Next.js</h4>
              <pre className="text-green-600 bg-green-100 p-2 rounded">
{`// 自动注入params参数
export default function Page({ params }) {
  const id = params.id
  
  // TypeScript类型安全
  interface Props {
    params: { id: string }
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* 路由特性 */}
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-purple-800 mb-2">
            ✨ Next.js动态路由特性
          </h3>
          <ul className="text-purple-700 space-y-1 text-sm">
            <li>• <strong>自动参数注入</strong>：params自动传递给组件</li>
            <li>• <strong>类型安全</strong>：TypeScript完全支持</li>
            <li>• <strong>嵌套路由</strong>：支持 [id]/[slug] 等复杂结构</li>
            <li>• <strong>Catch-all路由</strong>：[...slug] 匹配所有路径</li>
            <li>• <strong>静态生成</strong>：可以预生成动态页面</li>
          </ul>
        </div>

        {/* 导航按钮 */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← 返回产品列表
          </Link>
          <Link
            href="/" 
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            返回首页
          </Link>
          
          {/* 展示其他产品的链接 */}
          {products
            .filter(p => p.id !== productId)
            .slice(0, 2)
            .map(p => (
              <a
                key={p.id}
                href={`/products/${p.id}`}
                className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                查看 {p.name}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}