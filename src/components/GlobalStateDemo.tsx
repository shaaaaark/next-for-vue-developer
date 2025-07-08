'use client';

import { useGlobalStore } from '@/store/global-store';
import { useState } from 'react';

export default function GlobalStateDemo() {
  const { 
    count, 
    increment, 
    decrement, 
    reset,
    theme,
    toggleTheme,
    user,
    isAuthenticated,
    login,
    logout
  } = useGlobalStore();

  const [loginForm, setLoginForm] = useState({
    name: '',
    email: ''
  });

  const handleLogin = () => {
    if (loginForm.name && loginForm.email) {
      login({
        id: Date.now().toString(),
        name: loginForm.name,
        email: loginForm.email
      });
      setLoginForm({ name: '', email: '' });
    }
  };

  return (
    <div className="space-y-8 p-6 border border-gray-200 rounded-lg">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          🔄 全局状态管理演示
        </h3>
        <p className="text-gray-600">
          对比 <span className="font-mono bg-gray-100 px-2 py-1 rounded">Vue Vuex</span> vs{' '}
          <span className="font-mono bg-blue-100 px-2 py-1 rounded">React Zustand</span>
        </p>
      </div>

      {/* Vue vs React 状态管理对比 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Vue + Vuex 方式</h4>
          <pre className="text-sm bg-white p-3 rounded border text-gray-700 overflow-x-auto">
{`// store/index.js
export default new Vuex.Store({
  state: {
    count: 0,
    user: null
  },
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    login({ commit }, user) {
      commit('SET_USER', user)
    }
  }
})

// 组件中使用
computed: {
  count() {
    return this.$store.state.count
  }
},
methods: {
  increment() {
    this.$store.commit('INCREMENT')
  }
}`}
          </pre>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">React + Zustand 方式</h4>
          <pre className="text-sm bg-white p-3 rounded border text-gray-700 overflow-x-auto">
{`// store/global-store.ts
export const useGlobalStore = create()(
  persist((set) => ({
    count: 0,
    user: null,
    increment: () => set((state) => ({ 
      count: state.count + 1 
    })),
    login: (user) => set({ user })
  }), {
    name: 'app-storage'
  })
)

// 组件中使用
const { count, increment, user, login } = 
  useGlobalStore();`}
          </pre>
        </div>
      </div>

      {/* 计数器演示 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">计数器状态演示</h4>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-2xl font-bold text-blue-600">{count}</span>
          <div className="flex gap-2">
            <button
              onClick={increment}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              +1
            </button>
            <button
              onClick={decrement}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              -1
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
            >
              重置
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          💾 这个计数器的值会自动保存到 localStorage，刷新页面后依然保持！
        </p>
      </div>

      {/* 主题切换演示 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">主题状态演示</h4>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-700">当前主题: </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            theme === 'light' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-gray-800 text-white'
          }`}>
            {theme === 'light' ? '🌞 浅色模式' : '🌙 深色模式'}
          </span>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            切换主题
          </button>
        </div>
        <p className="text-sm text-gray-600">
          🎨 主题偏好会自动保存，下次访问时自动应用！
        </p>
      </div>

      {/* 用户登录状态演示 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">用户状态演示</h4>
        
        {!isAuthenticated ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="用户名"
                value={loginForm.name}
                onChange={(e) => setLoginForm(prev => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                placeholder="邮箱"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={!loginForm.name || !loginForm.email}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              登录
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h5 className="font-semibold text-gray-800">{user?.name}</h5>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              退出登录
            </button>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mt-4">
          👤 用户登录状态会持久保存，刷新页面仍然保持登录！
        </p>
      </div>

      {/* 优势总结 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">🚀 Zustand 相比 Vuex 的优势</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✅ <strong>更简单</strong>：无需 mutations/actions 的繁琐模式</li>
          <li>✅ <strong>TypeScript 友好</strong>：完全类型安全</li>
          <li>✅ <strong>体积更小</strong>：仅 2.5KB vs Vuex 的 17KB</li>
          <li>✅ <strong>自动持久化</strong>：内置 localStorage 支持</li>
          <li>✅ <strong>灵活性高</strong>：可以创建多个 store</li>
          <li>✅ <strong>性能优秀</strong>：自动优化重渲染</li>
        </ul>
      </div>
    </div>
  );
} 