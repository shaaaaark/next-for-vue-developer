'use client';

import { useState } from 'react';

// TypeScript接口定义 - 类似Vue的类型定义
interface User {
  name: string;
  age: number;
}

export default function StateDemo() {
  // React的useState Hook - 类似Vue的ref()
  const [count, setCount] = useState<number>(0);
  const [user, setUser] = useState<User>({
    name: '张三',
    age: 25
  });
  const [message, setMessage] = useState<string>('Hello React!');

  // 事件处理函数
  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const updateUserAge = () => {
    setUser({
      ...user, // 展开运算符，类似Vue的解构
      age: user.age + 1
    });
  };

  const updateMessage = () => {
    setMessage(message === 'Hello React!' ? 'Hello Vue开发者!' : 'Hello React!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-indigo-600">
        React状态管理演示
      </h3>

      {/* 对比说明 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Vue Composition API</h4>
          <pre className="text-sm text-green-700 overflow-x-auto">
{`// Vue 3 写法
const count = ref(0)
const user = reactive({
  name: '张三',
  age: 25
})

const increment = () => {
  count.value++  // 注意需要.value
}`}
          </pre>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-semibold text-indigo-800 mb-3">React useState Hook</h4>
          <pre className="text-sm text-indigo-700 overflow-x-auto">
{`// React 写法
const [count, setCount] = useState(0)
const [user, setUser] = useState({
  name: '张三',
  age: 25
})

const increment = () => {
  setCount(count + 1)  // 直接使用
}`}
          </pre>
        </div>
      </div>

      {/* 实际演示 */}
      <div className="space-y-6">
        {/* 计数器演示 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">📊 计数器演示（类似Vue的ref）</h4>
          <div className="flex items-center space-x-4">
            <button 
              onClick={decrement}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              -1
            </button>
            <span className="text-xl font-bold text-gray-800">
              计数: {count}
            </span>
            <button 
              onClick={increment}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
            >
              +1
            </button>
          </div>
        </div>

        {/* 对象状态演示 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">👤 对象状态演示（类似Vue的reactive）</h4>
          <div className="flex items-center space-x-4">
            <span className="text-gray-800">
              姓名: {user.name}, 年龄: {user.age}
            </span>
            <button 
              onClick={updateUserAge}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              年龄+1
            </button>
          </div>
        </div>

        {/* 字符串状态演示 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">💬 字符串状态演示</h4>
          <div className="flex items-center space-x-4">
            <span className="text-gray-800">{message}</span>
            <button 
              onClick={updateMessage}
              className="bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600"
            >
              切换消息
            </button>
          </div>
        </div>
      </div>

      {/* 关键差异说明 */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">🔑 关键差异总结</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-yellow-700">Vue特点：</h5>
            <ul className="text-yellow-600 space-y-1 mt-1">
              <li>• ref需要.value访问</li>
              <li>• reactive自动响应式</li>
              <li>• 可以直接修改值</li>
              <li>• 自动依赖追踪</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-yellow-700">React特点：</h5>
            <ul className="text-yellow-600 space-y-1 mt-1">
              <li>• useState返回[值, 设置函数]</li>
              <li>• 必须通过setState更新</li>
              <li>• 对象更新需要展开运算符</li>
              <li>• 重新渲染基于setState调用</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 