import GlobalStateDemo from '@/components/GlobalStateDemo';
import ViewportPositionDemo from '@/components/ViewportPositionDemo';
import Link from 'next/link';
export default function StateManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            全局状态管理
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            学习如何在 Next.js 中使用 Zustand 管理全局状态，包括状态持久化和视口位置保存
          </p>
        </div>

        {/* 学习内容 */}
        <div className="space-y-12">
          {/* 全局状态管理演示 */}
          <section>
            <GlobalStateDemo />
          </section>

          {/* 视口位置管理演示 */}
          <section>
            <ViewportPositionDemo />
          </section>

          {/* 学习要点总结 */}
          <section className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              📚 本章学习要点
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">核心概念</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Zustand vs Vuex</strong>：状态管理库对比</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>状态持久化</strong>：localStorage 自动保存</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>TypeScript 集成</strong>：完全类型安全的状态</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>性能优化</strong>：自动重渲染优化</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">实践技能</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Store 创建</strong>：创建和配置全局状态</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>状态订阅</strong>：组件中使用全局状态</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>视口管理</strong>：滚动位置保存与恢复</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>中间件使用</strong>：persist 中间件配置</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">🎯 实际项目应用</h4>
              <p className="text-gray-700 leading-relaxed">
                全局状态管理是现代 Web 应用的重要组成部分。通过本章学习，你已经掌握了如何使用 Zustand 
                管理应用状态、实现状态持久化，以及解决页面刷新后视口位置丢失的常见问题。
                这些技能在构建用户体验良好的 Web 应用时非常重要。
              </p>
            </div>
          </section>
        </div>

        {/* 导航链接 */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/forms"
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-blue-600 transition-colors"
          >
            ← 上一章：表单处理
          </Link>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
} 