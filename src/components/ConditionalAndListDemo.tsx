'use client';

import { useState } from 'react';

// 定义数据类型
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface User {
  id: number;
  name: string;
  age: number;
  isVip: boolean;
}

export default function ConditionalAndListDemo() {
  // 状态管理
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'guest' | 'user' | 'admin'>('guest');
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: '学习Vue', completed: true },
    { id: 2, text: '学习React', completed: false },
    { id: 3, text: '学习Next.js', completed: false },
  ]);
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: '张三', age: 25, isVip: true },
    { id: 2, name: '李四', age: 30, isVip: false },
    { id: 3, name: '王五', age: 28, isVip: true },
  ]);

  // 切换todo完成状态
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 添加新todo
  const addTodo = () => {
    const newTodo: TodoItem = {
      id: Date.now(),
      text: `新任务 ${Date.now()}`,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  // 删除todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-rose-600">
        条件渲染和列表渲染演示
      </h3>

      {/* 语法对比说明 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Vue模板指令</h4>
          <pre className="text-sm text-green-700 overflow-x-auto">
{`<!-- 条件渲染 -->
<div v-if="showWelcome">欢迎</div>
<div v-else-if="userRole === 'admin'">管理员</div>
<div v-else>游客</div>

<!-- 列表渲染 -->
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>`}
          </pre>
        </div>

        <div className="bg-rose-50 p-4 rounded-lg">
          <h4 className="font-semibold text-rose-800 mb-3">React JSX表达式</h4>
          <pre className="text-sm text-rose-700 overflow-x-auto">
{`{/* 条件渲染 */}
{showWelcome && <div>欢迎</div>}
{userRole === 'admin' ? <div>管理员</div> : <div>游客</div>}

{/* 列表渲染 */}
<ul>
  {todos.map(todo => (
    <li key={todo.id}>
      {todo.text}
    </li>
  ))}
</ul>`}
          </pre>
        </div>
      </div>

      {/* 实际演示区域 */}
      <div className="space-y-8">
        
        {/* 条件渲染演示 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">🔄 条件渲染演示</h4>
          
          <div className="space-y-4">
            {/* v-if 等效演示 */}
            <div>
              <button 
                onClick={() => setShowWelcome(!showWelcome)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600"
              >
                {showWelcome ? '隐藏' : '显示'}欢迎消息
              </button>
              
              {/* React条件渲染：{condition && <element>} */}
              {showWelcome && (
                <div className="bg-blue-100 p-3 rounded inline-block">
                  🎉 欢迎学习React！(类似v-if="showWelcome")
                </div>
              )}
            </div>

            {/* 多重条件演示 */}
            <div>
              <div className="mb-2">
                <label className="mr-2">选择用户角色：</label>
                <select 
                  value={userRole} 
                  onChange={(e) => setUserRole(e.target.value as 'guest' | 'user' | 'admin')}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="guest">游客</option>
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              
              {/* React多重条件：三元运算符嵌套或多个条件 */}
              <div className="space-y-2">
                {userRole === 'admin' && (
                  <div className="bg-red-100 p-3 rounded">
                    🔑 管理员面板 (类似v-if="userRole === 'admin'")
                  </div>
                )}
                {userRole === 'user' && (
                  <div className="bg-green-100 p-3 rounded">
                    👤 用户仪表板 (类似v-else-if="userRole === 'user'")
                  </div>
                )}
                {userRole === 'guest' && (
                  <div className="bg-yellow-100 p-3 rounded">
                    🚪 请先登录 (类似v-else)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 列表渲染演示 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">📋 列表渲染演示（类似v-for）</h4>
          
          {/* Todo列表 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-semibold">Todo列表</h5>
              <button 
                onClick={addTodo}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                添加任务
              </button>
            </div>
            
            {/* React列表渲染：array.map() */}
            <ul className="space-y-2">
              {todos.map(todo => (
                <li 
                  key={todo.id} 
                  className="flex items-center justify-between bg-white p-3 rounded border"
                >
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="mr-3"
                    />
                    <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                      {todo.text}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    删除
                  </button>
                </li>
              ))}
            </ul>
            
            {/* 空列表提示 */}
            {todos.length === 0 && (
              <div className="text-gray-500 text-center py-4">
                暂无任务 (类似v-if="todos.length === 0")
              </div>
            )}
          </div>

          {/* 用户列表 - 带过滤条件 */}
          <div>
            <h5 className="font-semibold mb-3">用户列表（VIP过滤演示）</h5>
            
            {/* 显示所有用户 */}
            <div className="mb-4">
              <h6 className="text-sm font-medium mb-2">所有用户：</h6>
              <div className="grid gap-2">
                {users.map(user => (
                  <div 
                    key={user.id}
                    className={`p-2 rounded border ${user.isVip ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50'}`}
                  >
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-600 ml-2">({user.age}岁)</span>
                    {user.isVip && <span className="ml-2 text-yellow-600">👑 VIP</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* 只显示VIP用户 - 类似v-for with v-if */}
            <div>
              <h6 className="text-sm font-medium mb-2">仅VIP用户（类似v-for + v-if过滤）：</h6>
              <div className="grid gap-2">
                {users
                  .filter(user => user.isVip) // 在React中，我们用filter()来过滤
                  .map(user => (
                    <div 
                      key={user.id}
                      className="p-2 rounded border bg-yellow-50 border-yellow-300"
                    >
                      <span className="font-medium">{user.name}</span>
                      <span className="text-gray-600 ml-2">({user.age}岁)</span>
                      <span className="ml-2 text-yellow-600">👑 VIP</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* 关键差异总结 */}
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-3">🔑 关键差异总结</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold text-orange-700 mb-2">Vue指令特点：</h5>
              <ul className="text-orange-600 space-y-1">
                <li>• v-if/v-else-if/v-else 清晰</li>
                <li>• v-for="item in items" 直观</li>
                <li>• v-show 控制CSS显示</li>
                <li>• 模板中的逻辑简单</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-orange-700 mb-2">React表达式特点：</h5>
              <ul className="text-orange-600 space-y-1">
                <li>• {`{condition && <element>}`} 短路运算</li>
                <li>• {`{array.map(item => <element>)}`}</li>
                <li>• 完全的JavaScript表达式</li>
                <li>• 更灵活但需要JS知识</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 