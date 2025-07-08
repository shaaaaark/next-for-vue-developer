'use client';

import { createUser, updateUserStatus } from '@/actions/form-actions';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ServerActionsDemo() {
  const searchParams = useSearchParams();
  const [currentUrl, setCurrentUrl] = useState('');
  const [userStatus, setUserStatus] = useState('正常');
  
  // 获取当前URL（客户端）
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // 检查是否有操作反馈
  const action = searchParams.get('action');
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const timestamp = searchParams.get('timestamp');

  // 根据操作更新显示状态
  useEffect(() => {
    if (action === 'update' && status) {
      const statusMap: Record<string, string> = {
        'active': '已激活',
        'suspended': '已暂停',
        'deleted': '已删除'
      };
      setUserStatus(statusMap[status] || status);
    }
  }, [action, status]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Server Actions - Next.js革命性特性
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">
          什么是Server Actions？
        </h3>
        <p className="text-blue-700 text-sm">
          Server Actions是Next.js 13+的革命性特性，允许你直接在组件中定义在服务端运行的函数。
          表单可以直接调用这些函数，无需手动创建API路由，大大简化了全栈开发流程！
        </p>
      </div>

      {/* 操作反馈显示 */}
      {action === 'update' && userId && status && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            操作成功
          </h3>
          <p className="text-blue-700 text-sm">
            用户 <code className="bg-white px-2 py-1 rounded border border-gray-200">{userId}</code> 
            的状态已更新为 <code className="bg-white px-2 py-1 rounded border border-gray-200">{status}</code>
          </p>
          <p className="text-gray-600 text-xs mt-1" suppressHydrationWarning>
            操作时间: {new Date(parseInt(timestamp || '0')).toLocaleString()}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Vue/React传统方式 */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">传统方式（Vue/React）</h3>
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`// 1. 创建API路由
// /api/users/route.ts
export async function POST(request) {
  const data = await request.json()
  // 处理数据...
  return Response.json({ success: true })
}

// 2. 前端调用API
const handleSubmit = async (e) => {
  e.preventDefault()
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  const result = await response.json()
  // 手动处理反馈...
}

// 3. 表单绑定
<form onSubmit={handleSubmit}>
  <input name="name" value={name} onChange={...} />
  <button type="submit">提交</button>
</form>`}
          </pre>
        </div>

        {/* Server Actions方式 */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">Server Actions方式</h3>
          <pre className="text-sm text-blue-700 overflow-x-auto">
{`// 1. 在单独文件中定义Server Action
// /actions/form-actions.ts
'use server';

export async function createUser(formData: FormData) {
  const name = formData.get('name')
  // 直接处理数据，无需API路由
  console.log('保存到数据库:', name)
  
  // 可以重定向提供反馈
  redirect('/success')
}

// 2. 导入并直接使用
import { createUser } from '@/actions/form-actions'

<form action={createUser}>
  <input name="name" defaultValue="张三" />
  <button type="submit">提交</button>
</form>

// 就这么简单！
// ✅ 无需创建API路由
// ✅ 无需fetch请求
// ✅ 自动表单提交和反馈`}
          </pre>
        </div>
      </div>

      {/* 实际演示 */}
      <div className="space-y-6">
        {/* 用户创建表单 */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">演示1：创建用户（Server Action）</h3>
          
          <form action={createUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                type="text"
                name="name"
                defaultValue=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入姓名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <input
                type="email"
                name="email"
                defaultValue=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入邮箱"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                角色
              </label>
              <select
                name="role"
                defaultValue="user"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
                <option value="moderator">版主</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              创建用户（Server Action）
            </button>
          </form>
        </div>

        {/* 状态更新表单 - 统一颜色版 */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">演示2：快速操作（单个字段）</h3>
          
          {/* 当前用户状态显示 */}
          <div className="mb-4 p-3 bg-white rounded border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-1">当前用户状态</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">用户ID: user-123</span>
              <span className="text-sm">•</span>
              <span className="text-sm font-medium text-blue-600">
                状态: {userStatus}
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <form action={updateUserStatus}>
              <input type="hidden" name="userId" value="user-123" />
              <input type="hidden" name="status" value="active" />
              <input type="hidden" name="currentUrl" value={currentUrl} />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                激活用户
              </button>
            </form>

            <form action={updateUserStatus}>
              <input type="hidden" name="userId" value="user-123" />
              <input type="hidden" name="status" value="suspended" />
              <input type="hidden" name="currentUrl" value={currentUrl} />
              <button
                type="submit"
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                暂停用户
              </button>
            </form>

            <form action={updateUserStatus}>
              <input type="hidden" name="userId" value="user-123" />
              <input type="hidden" name="status" value="deleted" />
              <input type="hidden" name="currentUrl" value={currentUrl} />
              <button
                type="submit"
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                删除用户
              </button>
            </form>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>实时反馈：</strong> 点击按钮后，页面会刷新并显示操作结果。
              这展示了Server Actions如何提供用户反馈！
            </p>
          </div>
        </div>
      </div>

      {/* Server Actions优势总结 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Server Actions核心优势</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">开发效率：</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• 无需创建API路由</li>
              <li>• 自动处理FormData</li>
              <li>• 类型安全的参数传递</li>
              <li>• 减少50%以上代码量</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">用户体验：</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• 无JavaScript也能工作</li>
              <li>• 自动错误处理</li>
              <li>• 可以提供页面级反馈</li>
              <li>• 渐进式增强</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>反馈机制：</strong> Server Actions可以通过重定向、URL参数、数据库状态等方式提供用户反馈。
            这比传统的API调用 + 状态管理更简洁！
          </p>
        </div>
      </div>
    </div>
  );
} 