'use client';

import { useGlobalScrollRestore, useScrollPositionManager } from '@/hooks/useGlobalScrollRestore';
import { useGlobalStore } from '@/store/global-store';

interface GlobalScrollManagerProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export default function GlobalScrollManager({ 
  children, 
  enabled = true 
}: GlobalScrollManagerProps) {
  // 使用全局滚动恢复Hook
  useGlobalScrollRestore(enabled);

  // 可选：与Zustand状态管理集成
  const { saveViewportPosition } = useGlobalStore();

  // 组件本身不渲染任何UI，只提供滚动管理功能
  return <>{children}</>;
}

// 可选的滚动位置显示组件（开发调试用）
export function ScrollPositionDebugger() {
  const { getAllScrollPositions, clearAllScrollPositions } = useScrollPositionManager();

  const positions = getAllScrollPositions();

  if (process.env.NODE_ENV !== 'development') {
    return null; // 生产环境不显示
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs z-50">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">滚动位置记录</span>
        <button 
          onClick={clearAllScrollPositions}
          className="text-red-400 hover:text-red-300"
        >
          清空
        </button>
      </div>
      
      {positions.length === 0 ? (
        <div className="text-gray-400">暂无记录</div>
      ) : (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {positions.slice(0, 5).map((pos, index) => (
            <div key={index} className="border-b border-gray-600 pb-1">
              <div className="truncate">{pos.pathname}</div>
              <div className="text-gray-400">
                X:{pos.scrollX}, Y:{pos.scrollY}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 