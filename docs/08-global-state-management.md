# 第八章：全局状态管理

## 概述

本章详细介绍 Next.js 中的全局状态管理，重点对比 Vue 的 Vuex 与 React 生态中的 Zustand 库。通过实际案例学习如何实现状态持久化和视口位置保存功能。

## Vue vs React 状态管理对比

### Vue + Vuex 方式

```javascript
// store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0,
    user: null,
    viewportPosition: { x: 0, y: 0 }
  },
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    SET_USER(state, user) {
      state.user = user
    },
    SAVE_VIEWPORT_POSITION(state, { x, y }) {
      state.viewportPosition = { x, y }
      localStorage.setItem('scrollPos', JSON.stringify({ x, y }))
    }
  },
  actions: {
    login({ commit }, user) {
      commit('SET_USER', user)
    },
    saveScrollPosition({ commit }, position) {
      commit('SAVE_VIEWPORT_POSITION', position)
    }
  }
})

// 组件中使用
export default {
  computed: {
    count() {
      return this.$store.state.count
    },
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    increment() {
      this.$store.commit('INCREMENT')
    },
    login(userData) {
      this.$store.dispatch('login', userData)
    }
  },
  beforeDestroy() {
    this.$store.dispatch('saveScrollPosition', {
      x: window.scrollX,
      y: window.scrollY
    })
  }
}
```

### React + Zustand 方式

```typescript
// store/global-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface GlobalState {
  count: number
  user: User | null
  viewportPosition: { x: number; y: number; timestamp: number }
  
  increment: () => void
  login: (user: User) => void
  saveViewportPosition: (x: number, y: number) => void
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      count: 0,
      user: null,
      viewportPosition: { x: 0, y: 0, timestamp: Date.now() },
      
      increment: () => set((state) => ({ count: state.count + 1 })),
      login: (user) => set({ user }),
      saveViewportPosition: (x, y) => set({
        viewportPosition: { x, y, timestamp: Date.now() }
      })
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// 组件中使用
import { useGlobalStore } from '@/store/global-store'

export default function MyComponent() {
  const { count, user, increment, login } = useGlobalStore()
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

## 核心特性对比

| 特性 | Vue Vuex | React Zustand |
|------|----------|---------------|
| 学习曲线 | 中等（需要理解 mutations/actions） | 简单（直接的 API） |
| TypeScript | 需要额外配置 | 原生支持 |
| 包大小 | ~17KB | ~2.5KB |
| 持久化 | 需要插件 | 内置中间件 |
| 开发工具 | Vue DevTools | Redux DevTools |
| 性能 | 响应式更新 | 选择性订阅 |

## 状态持久化

### 基本持久化配置

```typescript
import { persist, createJSONStorage } from 'zustand/middleware'

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // 状态定义
    }),
    {
      name: 'app-storage', // localStorage 键名
      storage: createJSONStorage(() => localStorage),
      
      // 部分持久化：只保存特定字段
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        viewportPosition: state.viewportPosition
      })
    }
  )
)
```

### 视口位置管理

```typescript
// 专用的视口位置管理 hook
export const useViewportPosition = () => {
  const { viewportPosition, saveViewportPosition } = useGlobalStore()
  
  const saveCurrentPosition = () => {
    if (typeof window !== 'undefined') {
      saveViewportPosition(window.scrollX, window.scrollY)
    }
  }
  
  const restorePosition = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo(viewportPosition.x, viewportPosition.y)
    }
  }
  
  // 自动保存（防抖处理）
  const startAutoSave = () => {
    if (typeof window === 'undefined') return
    
    let timeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(timeout)
      timeout = setTimeout(saveCurrentPosition, 300)
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('beforeunload', saveCurrentPosition)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', saveCurrentPosition)
      clearTimeout(timeout)
    }
  }
  
  return {
    viewportPosition,
    saveCurrentPosition,
    restorePosition,
    startAutoSave
  }
}
```

### 组件中使用视口位置管理

```tsx
'use client'

import { useViewportPosition } from '@/store/global-store'
import { useEffect } from 'react'

export default function ScrollableComponent() {
  const { startAutoSave, restorePosition } = useViewportPosition()
  
  // 启用自动保存
  useEffect(() => {
    const cleanup = startAutoSave()
    return cleanup
  }, [startAutoSave])
  
  // 页面加载时恢复位置
  useEffect(() => {
    restorePosition()
  }, [restorePosition])
  
  return (
    <div>
      {/* 长内容 */}
    </div>
  )
}
```

## 高级用法

### 多个 Store

```typescript
// 用户相关状态
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null })
    }),
    { name: 'user-storage' }
  )
)

// UI 相关状态
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  }))
}))
```

### 状态计算和派生

```typescript
export const useGlobalStore = create<GlobalState>((set, get) => ({
  items: [],
  filter: 'all',
  
  // 派生状态
  get filteredItems() {
    const { items, filter } = get()
    if (filter === 'completed') {
      return items.filter(item => item.completed)
    }
    return items
  },
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  setFilter: (filter) => set({ filter })
}))
```

## 实际应用场景

### 1. 用户状态管理

```typescript
interface User {
  id: string
  name: string
  email: string
  preferences: UserPreferences
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (credentials) => {
        const user = await authService.login(credentials)
        set({ user, isAuthenticated: true })
      },
      
      logout: () => {
        authService.logout()
        set({ user: null, isAuthenticated: false })
      }
    }),
    { name: 'auth-storage' }
  )
)
```

### 2. 购物车状态

```typescript
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      get total() {
        return get().items.reduce((sum, item) => 
          sum + item.price * item.quantity, 0
        )
      },
      
      addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id)
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }
        }
        return { items: [...state.items, { ...product, quantity: 1 }] }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      }))
    }),
    { name: 'cart-storage' }
  )
)
```

### 3. 主题和 UI 状态

```typescript
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      
      toggleSidebar: () => set((state) => ({
        sidebarCollapsed: !state.sidebarCollapsed
      }))
    }),
    { name: 'theme-storage' }
  )
)
```

## 性能优化

### 选择性订阅

```typescript
// 只订阅特定字段，避免不必要的重渲染
const count = useGlobalStore((state) => state.count)
const user = useGlobalStore((state) => state.user)

// 使用 shallow 比较对象
import { shallow } from 'zustand/shallow'

const { theme, sidebarOpen } = useGlobalStore(
  (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
  shallow
)
```

### 批量更新

```typescript
// 批量更新多个状态
const updateUserProfile = (profile: UserProfile) => {
  useGlobalStore.setState((state) => ({
    user: { ...state.user, ...profile },
    lastUpdated: Date.now(),
    isLoading: false
  }))
}
```

## 调试和开发工具

### 启用 Redux DevTools

```typescript
import { devtools } from 'zustand/middleware'

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        // 状态定义
      }),
      { name: 'app-storage' }
    ),
    { name: 'global-store' }
  )
)
```

## 最佳实践

1. **状态结构设计**：保持状态扁平化，避免深层嵌套
2. **类型安全**：使用 TypeScript 确保类型安全
3. **持久化策略**：只持久化必要的状态，避免敏感信息
4. **性能优化**：使用选择性订阅减少重渲染
5. **错误处理**：在状态更新中添加适当的错误处理

## 总结

Zustand 相比 Vuex 提供了更简洁的 API 和更好的 TypeScript 支持，同时保持了强大的功能性。通过合理使用状态管理和持久化技术，可以构建出用户体验优秀的 Web 应用。

### 关键优势

- **简单性**：无需复杂的 mutations/actions 模式
- **类型安全**：完全的 TypeScript 支持
- **性能**：自动优化的重渲染
- **灵活性**：可以创建多个独立的 store
- **持久化**：内置的状态持久化支持 