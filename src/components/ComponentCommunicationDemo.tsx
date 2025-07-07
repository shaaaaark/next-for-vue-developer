'use client'

import { useState, useEffect } from 'react'

// 子组件的Props类型定义
interface ChildComponentProps {
  count: number
  name: string
  onIncrement: () => void
  onDecrement: () => void
  onNameChange: (newName: string) => void
}

// 子组件 - 接收props并触发父组件的回调函数
function ChildComponent({ 
  count, 
  name, 
  onIncrement, 
  onDecrement, 
  onNameChange 
}: ChildComponentProps) {
  const [inputValue, setInputValue] = useState('')
  
  // 子组件的生命周期 - 相当于Vue的mounted
  useEffect(() => {
    console.log('子组件挂载了！')
    return () => {
      console.log('子组件将要卸载！')
    }
  }, []) // 空依赖数组表示只在挂载和卸载时执行
  
  // 监听count变化 - 相当于Vue的watch
  useEffect(() => {
    console.log(`count变化了: ${count}`)
  }, [count]) // 依赖count，count变化时执行
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onNameChange(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
      <h3 className="text-lg font-bold text-blue-800 mb-4">子组件 (Child Component)</h3>
      
      <div className="space-y-4">
        <div className="bg-white p-4 rounded">
          <p className="text-gray-700">接收到的props:</p>
          <p className="font-mono">count: {count}</p>
          <p className="font-mono">name: {name}</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={onIncrement}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            增加计数
          </button>
          <button 
            onClick={onDecrement}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            减少计数
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入新名字"
            className="border rounded px-3 py-2 w-full"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            更新父组件名字
          </button>
        </form>
      </div>
    </div>
  )
}

// 主组件 - 演示组件间通信和生命周期
export default function ComponentCommunicationDemo() {
  const [count, setCount] = useState(0)
  const [userName, setUserName] = useState('Vue开发者')
  const [isChildVisible, setIsChildVisible] = useState(true)
  
  // 组件挂载时的副作用 - 相当于Vue的mounted
  useEffect(() => {
    console.log('父组件挂载了！')
    document.title = `计数: ${count}`
    
    return () => {
      console.log('父组件卸载清理')
      document.title = 'Next.js学习'
    }
  }, [])
  
  // 监听count变化并更新页面标题 - 相当于Vue的watch
  useEffect(() => {
    document.title = `计数: ${count}`
  }, [count])
  
  // 复杂的副作用 - 模拟API调用
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(`用户 ${userName} 的计数更新为: ${count}`)
    }, 1000)
    
    // 清理函数 - 相当于Vue的beforeDestroy
    return () => clearTimeout(timer)
  }, [count, userName]) // 依赖多个值
  
  // 传递给子组件的回调函数
  const handleIncrement = () => setCount(prev => prev + 1)
  const handleDecrement = () => setCount(prev => prev - 1)
  const handleNameChange = (newName: string) => setUserName(newName)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">组件间通信 & 生命周期对比</h2>
        <p className="text-lg">学习React/Next.js的组件通信模式和生命周期管理</p>
      </div>
      
      {/* Vue vs React 对比说明 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
          <h3 className="text-lg font-bold text-green-800 mb-3">Vue方式</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Props传递:</strong> 通过props向下传递</p>
            <p><strong>事件触发:</strong> $emit('event-name', data)</p>
            <p><strong>生命周期:</strong> mounted, updated, beforeDestroy</p>
            <p><strong>数据监听:</strong> watch: {'{ count(newVal) {...} }'}</p>
            <p><strong>模板语法:</strong> @click="method" :prop="value"</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <h3 className="text-lg font-bold text-blue-800 mb-3">React/Next.js方式</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Props传递:</strong> 通过props向下传递</p>
            <p><strong>事件触发:</strong> 回调函数 onEvent(data)</p>
            <p><strong>生命周期:</strong> useEffect(() =&gt; &#123;&#125;)</p>
            <p><strong>数据监听:</strong> useEffect(() =&gt; &#123;&#125;, [dependency])</p>
            <p><strong>JSX语法:</strong> onClick=&#123;handler&#125; prop=&#123;value&#125;</p>
          </div>
        </div>
      </div>
      
      {/* 父组件状态显示 */}
      <div className="border-2 border-purple-300 rounded-lg p-6 bg-purple-50">
        <h3 className="text-lg font-bold text-purple-800 mb-4">父组件 (Parent Component)</h3>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded">
            <p className="text-gray-700">父组件状态:</p>
            <p className="font-mono">count: {count}</p>
            <p className="font-mono">userName: {userName}</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsChildVisible(!isChildVisible)}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              {isChildVisible ? '隐藏' : '显示'}子组件
            </button>
            <button 
              onClick={() => setCount(0)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              重置计数
            </button>
          </div>
        </div>
      </div>
      
      {/* 子组件 */}
      {isChildVisible && (
        <ChildComponent
          count={count}
          name={userName}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onNameChange={handleNameChange}
        />
      )}
      
      {/* 生命周期说明 */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
        <h3 className="text-lg font-bold text-yellow-800 mb-3">生命周期对比</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold text-green-700">Vue生命周期</h4>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>mounted: 组件挂载后</li>
              <li>updated: 数据更新后</li>
              <li>beforeDestroy: 组件销毁前</li>
              <li>watch: 数据变化监听</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-700">React useEffect</h4>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>useEffect(() =&gt; &#123;&#125;, []): 等同于mounted</li>
              <li>useEffect(() =&gt; &#123;&#125;, [dep]): 等同于watch</li>
              <li>return () =&gt; &#123;&#125;: 等同于beforeDestroy</li>
              <li>useEffect(() =&gt; &#123;&#125;): 每次渲染都执行</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-4">
        <h4 className="font-bold mb-2">💡 关键差异总结:</h4>
        <ul className="space-y-1 text-sm">
          <li>• <strong>Vue:</strong> 使用$emit向上通信，有明确的生命周期钩子</li>
          <li>• <strong>React:</strong> 使用回调函数向上通信，用useEffect统一处理副作用</li>
          <li>• <strong>Vue:</strong> 双向绑定，watch监听数据变化</li>
          <li>• <strong>React:</strong> 单向数据流，useEffect监听依赖变化</li>
        </ul>
      </div>
    </div>
  )
} 