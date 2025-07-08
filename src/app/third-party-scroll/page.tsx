import ThirdPartyScrollDemo from '@/components/ThirdPartyScrollDemo';

export default function ThirdPartyScrollPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              📦 第三方库实现：滚动位置管理
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              使用 <code className="bg-gray-100 px-2 py-1 rounded">@n8tb1t/use-scroll-position</code> 
              库实现专业级的滚动位置保存和管理功能
            </p>
          </div>

          {/* 演示组件 */}
          <ThirdPartyScrollDemo />
        </div>
      </div>
    </div>
  );
} 