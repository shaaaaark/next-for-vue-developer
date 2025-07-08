import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 用户信息类型定义
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// 视口位置类型定义
export interface ViewportPosition {
  x: number;
  y: number;
  timestamp: number;
}

// 全局状态类型定义
export interface GlobalState {
  // 用户相关状态
  user: User | null;
  isAuthenticated: boolean;
  
  // 界面状态
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  
  // 视口位置状态
  viewportPosition: ViewportPosition;
  
  // 计数器演示
  count: number;
  
  // 状态更新方法
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // 视口位置方法
  saveViewportPosition: (x: number, y: number) => void;
  restoreViewportPosition: () => ViewportPosition;
  
  // 计数器方法
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// 创建持久化的全局状态store
export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isAuthenticated: false,
      theme: 'light',
      sidebarOpen: false,
      viewportPosition: { x: 0, y: 0, timestamp: Date.now() },
      count: 0,
      
      // 用户相关方法
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: (user) => set({ 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
      
      // 主题切换
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      // 侧边栏控制
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // 视口位置管理
      saveViewportPosition: (x, y) => {
        const position = { x, y, timestamp: Date.now() };
        set({ viewportPosition: position });
        
        // 同时保存到浏览器滚动恢复机制
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('scrollPosition', JSON.stringify(position));
        }
      },
      
      restoreViewportPosition: () => {
        const state = get();
        return state.viewportPosition;
      },
      
      // 计数器方法
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'nextjs-global-state', // localStorage的key
      storage: createJSONStorage(() => localStorage), // 使用localStorage
      
      // 部分持久化：只保存特定字段
      partialize: (state) => ({
        theme: state.theme,
        viewportPosition: state.viewportPosition,
        count: state.count,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// 视口位置管理的专用hook
export const useViewportPosition = () => {
  const { viewportPosition, saveViewportPosition, restoreViewportPosition } = useGlobalStore();
  
  // 保存当前滚动位置
  const saveCurrentPosition = () => {
    if (typeof window !== 'undefined') {
      const x = window.scrollX;
      const y = window.scrollY;
      saveViewportPosition(x, y);
    }
  };
  
  // 恢复滚动位置
  const restorePosition = () => {
    if (typeof window !== 'undefined') {
      const position = restoreViewportPosition();
      window.scrollTo(position.x, position.y);
    }
  };
  
  // 自动保存滚动位置（防抖）
  const startAutoSave = () => {
    if (typeof window === 'undefined') return;
    
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(saveCurrentPosition, 300); // 300ms防抖
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', saveCurrentPosition);
    
    // 返回清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', saveCurrentPosition);
      clearTimeout(timeout);
    };
  };
  
  return {
    viewportPosition,
    saveCurrentPosition,
    restorePosition,
    startAutoSave,
  };
}; 