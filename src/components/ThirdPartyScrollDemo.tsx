'use client';

import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ThirdPartyScrollDemo() {
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [hideOnScroll, setHideOnScroll] = useState(false);
  const pathname = usePathname();

  // 使用 @n8tb1t/use-scroll-position 库
  useScrollPosition(
    ({ prevPos, currPos }) => {
      setScrollX(Math.abs(currPos.x));
      setScrollY(Math.abs(currPos.y));
      
      // 演示：滚动时隐藏元素
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll],
    undefined,
    false,
    300 // 防抖延迟
  );

  // 保存到localStorage
  const savePosition = () => {
    localStorage.setItem(`scroll-${pathname}`, JSON.stringify({
      x: scrollX,
      y: scrollY,
      timestamp: Date.now()
    }));
  };

  // 恢复位置
  const restorePosition = () => {
    const saved = localStorage.getItem(`scroll-${pathname}`);
    if (saved) {
      const position = JSON.parse(saved);
      window.scrollTo(position.x, position.y);
    }
  };

  // 页面加载时恢复
  useEffect(() => {
    setTimeout(restorePosition, 100);
  }, [pathname]);

  // 页面卸载时保存
  useEffect(() => {
    const handleBeforeUnload = () => savePosition();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [scrollX, scrollY, pathname]);

  return (
    <div className="space-y-8">
      {/* use-scroll-position 库演示 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          📦 use-scroll-position 库演示
        </h3>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
          <h4 className="font-semibold text-green-800 mb-3">
            ✅ @n8tb1t/use-scroll-position
          </h4>
          <div className="text-sm text-green-700 space-y-2">
            <p><strong>特点</strong>：最流行的React滚动Hook</p>
            <p><strong>大小</strong>：~5KB</p>
            <p><strong>下载量</strong>：200万+/月</p>
            <p><strong>维护</strong>：活跃维护，TypeScript支持</p>
            <div className="bg-white p-2 rounded border text-xs text-gray-700 mt-3">
              <pre>{`useScrollPosition(
  ({ prevPos, currPos }) => {
    // 滚动回调处理
  },
  [deps],        // 依赖数组
  element,       // 目标元素 (null = window)
  useWindow,     // 是否使用window
  wait          // 防抖延迟 (ms)
)`}</pre>
            </div>
          </div>
        </div>

        {/* 实时滚动信息 */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">
            📊 实时滚动信息
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700">X轴位置</div>
              <div className="text-blue-600 font-mono">{scrollX}px</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700">Y轴位置</div>
              <div className="text-blue-600 font-mono">{scrollY}px</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700">当前路径</div>
              <div className="text-gray-600 text-xs">{pathname}</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700">滚动方向</div>
              <div className={`font-medium ${hideOnScroll ? 'text-orange-600' : 'text-green-600'}`}>
                {hideOnScroll ? '📉 向下' : '📈 向上'}
              </div>
            </div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={savePosition}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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
            onClick={() => {
              localStorage.removeItem(`scroll-${pathname}`);
              alert('已清除此页面的滚动记录');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            🗑️ 清除记录
          </button>
        </div>
      </div>

      {/* 测试导航区域 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          🧪 测试滚动位置保存功能
        </h4>
        <p className="text-gray-600 mb-4">
          滚动到下方任意位置，然后点击导航链接测试滚动位置保存：
        </p>
        
        <div className="grid md:grid-cols-3 gap-4">
          <Link 
            href="/"
            className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
          >
            <div className="font-semibold text-green-800">返回首页</div>
            <div className="text-sm text-green-600">测试位置保存</div>
          </Link>
          
          <Link 
            href="/scroll-demo"
            className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <div className="font-semibold text-blue-800">自定义实现</div>
            <div className="text-sm text-blue-600">对比效果</div>
          </Link>
          
          <Link 
            href="/state-management"
            className="p-4 text-center bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="font-semibold text-gray-800">状态管理</div>
            <div className="text-sm text-gray-600">其他演示</div>
          </Link>
        </div>
      </div>

      {/* 长内容区域用于测试 */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          📚 测试内容区域（向下滚动测试滚动位置保存）
        </h4>
        
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <h5 className="text-lg font-semibold text-gray-800 mb-3">
              📖 测试章节 {i + 1}
            </h5>
            <p className="text-gray-600 leading-relaxed mb-4">
              这是使用 <code className="bg-gray-100 px-2 py-1 rounded">@n8tb1t/use-scroll-position</code> 
              库实现的滚动位置保存功能。这个库提供了强大的滚动事件处理能力，
              可以精确监听和控制页面滚动行为。
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <h6 className="font-semibold text-green-700 mb-2">库的特点</h6>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• 自动防抖优化</li>
                  <li>• 支持元素级滚动</li>
                  <li>• TypeScript支持</li>
                  <li>• 轻量级实现</li>
                </ul>
              </div>
              
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <h6 className="font-semibold text-blue-700 mb-2">实际应用</h6>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• 无限滚动列表</li>
                  <li>• 滚动动画触发</li>
                  <li>• 导航栏隐藏显示</li>
                  <li>• 阅读进度追踪</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              当前位置：Y轴 {scrollY}px | 章节编号：{i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* 功能总结 */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          💡 功能特点
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded border border-green-200">
            <h5 className="font-semibold text-green-700 mb-2">✅ 库的优势</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• 自动防抖优化，性能出色</li>
              <li>• 支持元素级和窗口级滚动</li>
              <li>• 完整的TypeScript类型支持</li>
              <li>• 轻量级实现，仅5KB大小</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded border border-blue-200">
            <h5 className="font-semibold text-blue-700 mb-2">⚡ 实际应用</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• 滚动位置自动保存与恢复</li>
              <li>• 滚动方向检测和响应</li>
              <li>• 导航栏显示/隐藏控制</li>
              <li>• 无限滚动和懒加载触发</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 