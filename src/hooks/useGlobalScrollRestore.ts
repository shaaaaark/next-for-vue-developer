'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ScrollPosition {
  pathname: string;
  scrollX: number;
  scrollY: number;
  timestamp: number;
}

const STORAGE_KEY = 'next-scroll-positions';
const SCROLL_RESTORE_DELAY = 100; // 页面加载后延迟恢复滚动

export function useGlobalScrollRestore(enabled: boolean = true) {
  const pathname = usePathname();

  // 保存滚动位置
  const saveScrollPosition = () => {
    if (typeof window === 'undefined' || !enabled) return;

    const currentPosition: ScrollPosition = {
      pathname,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      timestamp: Date.now()
    };

    try {
      const existingPositions = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || '[]'
      ) as ScrollPosition[];

      // 移除同路径的旧记录
      const filteredPositions = existingPositions.filter(
        pos => pos.pathname !== pathname
      );

      // 添加新记录
      filteredPositions.push(currentPosition);

      // 只保留最近20个位置记录
      const recentPositions = filteredPositions
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20);

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(recentPositions));
    } catch (error) {
      console.warn('Failed to save scroll position:', error);
    }
  };

  // 恢复滚动位置
  const restoreScrollPosition = () => {
    if (typeof window === 'undefined' || !enabled) return;

    try {
      const existingPositions = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || '[]'
      ) as ScrollPosition[];

      const positionForCurrentPage = existingPositions.find(
        pos => pos.pathname === pathname
      );

      if (positionForCurrentPage) {
        // 延迟恢复，确保页面内容已渲染
        setTimeout(() => {
          window.scrollTo(
            positionForCurrentPage.scrollX,
            positionForCurrentPage.scrollY
          );
        }, SCROLL_RESTORE_DELAY);
      }
    } catch (error) {
      console.warn('Failed to restore scroll position:', error);
    }
  };

  // 清除指定页面的滚动位置
  const clearScrollPosition = (targetPathname?: string) => {
    if (typeof window === 'undefined') return;

    try {
      const existingPositions = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || '[]'
      ) as ScrollPosition[];

      const filteredPositions = existingPositions.filter(
        pos => pos.pathname !== (targetPathname || pathname)
      );

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPositions));
    } catch (error) {
      console.warn('Failed to clear scroll position:', error);
    }
  };

  // 页面加载时恢复位置
  useEffect(() => {
    if (!enabled) return;
    restoreScrollPosition();
  }, [pathname, enabled]);

  // 监听滚动和页面卸载事件
  useEffect(() => {
    if (!enabled) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveScrollPosition, 300); // 防抖
    };

    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveScrollPosition();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, enabled]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition
  };
}

// 全局管理器Hook
export function useScrollPositionManager() {
  const getAllScrollPositions = (): ScrollPosition[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  const clearAllScrollPositions = () => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const getScrollPositionForPath = (pathname: string): ScrollPosition | null => {
    const positions = getAllScrollPositions();
    return positions.find(pos => pos.pathname === pathname) || null;
  };

  return {
    getAllScrollPositions,
    clearAllScrollPositions,
    getScrollPositionForPath
  };
} 