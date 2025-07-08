'use client';

import { useViewportPosition } from '@/store/global-store';
import { useEffect, useState } from 'react';

export default function ViewportPositionDemo() {
  const { 
    viewportPosition, 
    saveCurrentPosition, 
    restorePosition, 
    startAutoSave 
  } = useViewportPosition();
  
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  // 定时更新当前滚动位置（避免滚动冲突）
  useEffect(() => {
    const updatePosition = () => {
      setCurrentPosition({
        x: window.scrollX,
        y: window.scrollY
      });
    };

    // 使用定时器而不是滚动监听器，避免冲突
    const interval = setInterval(updatePosition, 500);
    return () => clearInterval(interval);
  }, []);

  // 自动保存功能
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const cleanup = startAutoSave();
    return cleanup;
  }, [autoSaveEnabled, startAutoSave]);

  // 格式化时间显示
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  // 生成简化的测试内容
  const generateTestContent = () => {
    const sections = [];
    for (let i = 1; i <= 8; i++) {
      sections.push(
        <div key={i} className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            📖 测试章节 {i}
          </h4>
          <p className="text-gray-600 leading-relaxed mb-2">
            这是第 {i} 个测试章节的内容。你可以滚动到这里测试位置保存功能。
          </p>
          <div className="text-sm text-gray-500">
            <span>章节 ID: section-{i}</span>
          </div>
        </div>
      );
    }
    return sections;
  };

  return (
    <div className="space-y-8">
      {/* 功能说明和控制面板 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            📍 视口位置管理演示
          </h3>
          <p className="text-gray-600">
            解决页面刷新后恢复到顶部的问题，让用户回到之前的浏览位置
          </p>
        </div>

        {/* Vue vs React 对比 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Vue 实现方式</h4>
            <pre className="text-sm bg-white p-3 rounded border text-gray-700 overflow-x-auto">
{`// Vue + Vuex 方式
// store/modules/viewport.js
state: {
  scrollPosition: { x: 0, y: 0 }
},
mutations: {
  SAVE_POSITION(state, { x, y }) {
    state.scrollPosition = { x, y }
    localStorage.setItem(
      'scrollPos', 
      JSON.stringify({ x, y })
    )
  }
}

// 组件中
beforeDestroy() {
  this.$store.commit('SAVE_POSITION', {
    x: window.scrollX,
    y: window.scrollY
  })
}
mounted() {
  const pos = this.$store.state.scrollPosition
  this.$nextTick(() => {
    window.scrollTo(pos.x, pos.y)
  })
}`}
            </pre>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Next.js + Zustand 方式</h4>
            <pre className="text-sm bg-white p-3 rounded border text-gray-700 overflow-x-auto">
{`// store/global-store.ts
export const useViewportPosition = () => {
  const { saveViewportPosition } = useGlobalStore()
  
  const startAutoSave = () => {
    const handleScroll = debounce(() => {
      saveViewportPosition(
        window.scrollX, 
        window.scrollY
      )
    }, 300)
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener(
      'scroll', handleScroll
    )
  }
  
  return { startAutoSave, restorePosition }
}

// 组件中使用
const { startAutoSave, restorePosition } = 
  useViewportPosition()
useEffect(() => startAutoSave(), [])`}
            </pre>
          </div>
        </div>

        {/* 状态显示面板 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">📊 位置状态面板</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-medium text-gray-700">当前位置</div>
              <div className="text-blue-600 font-mono">
                X: {currentPosition.x}px<br/>
                Y: {currentPosition.y}px
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-gray-700">保存位置</div>
              <div className="text-blue-600 font-mono">
                X: {viewportPosition.x}px<br/>
                Y: {viewportPosition.y}px
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-gray-700">保存时间</div>
              <div className="text-gray-600 text-xs" suppressHydrationWarning>
                {formatTime(viewportPosition.timestamp)}
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-medium text-gray-700">自动保存</div>
              <div className={`font-medium ${autoSaveEnabled ? 'text-blue-600' : 'text-gray-500'}`}>
                {autoSaveEnabled ? '✅ 已启用' : '❌ 已关闭'}
              </div>
            </div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={saveCurrentPosition}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            💾 手动保存位置
          </button>
          
          <button
            onClick={restorePosition}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            📍 恢复到保存位置
          </button>
          
          <button
            onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
            className={`px-4 py-2 rounded transition-colors ${
              autoSaveEnabled 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {autoSaveEnabled ? '⏸️ 关闭自动保存' : '▶️ 开启自动保存'}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            🔄 刷新页面测试
          </button>
        </div>

        {/* 使用说明 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-semibold text-gray-800 mb-2">🧪 测试步骤</h5>
          <ol className="text-sm text-gray-700 space-y-1">
            <li>1. 开启"自动保存"功能</li>
            <li>2. 滚动到页面中的任意位置</li>
            <li>3. 点击"刷新页面测试"按钮</li>
            <li>4. 观察页面是否自动滚动到之前的位置</li>
            <li>5. 也可以手动保存特定位置，然后恢复</li>
          </ol>
        </div>
      </div>

      {/* 长内容区域用于滚动测试 */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          📚 测试内容区域（向下滚动进行测试）
        </h3>
        {generateTestContent()}
      </div>

      {/* 底部说明 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">✨ 实际应用场景</h4>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h5 className="font-semibold mb-2">📱 移动端应用</h5>
            <ul className="space-y-1">
              <li>• 商品列表浏览位置保持</li>
              <li>• 文章阅读进度保存</li>
              <li>• 社交媒体时间线位置</li>
              <li>• 搜索结果页面位置</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-2">🖥️ 桌面端应用</h5>
            <ul className="space-y-1">
              <li>• 管理后台表格位置</li>
              <li>• 文档编辑器滚动位置</li>
              <li>• 数据分析页面位置</li>
              <li>• 多标签页面状态保持</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 