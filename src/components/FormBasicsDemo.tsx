'use client';

import { useState } from 'react';

export default function FormBasicsDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('表单数据：', formData);
    alert(`提交成功！\n姓名：${formData.name}\n邮箱：${formData.email}\n留言：${formData.message}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        基础表单处理对比
      </h2>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Vue方式对比 */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Vue 3 表单处理</h3>
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`<template>
  <form @submit.prevent="handleSubmit">
    <input 
      v-model="form.name" 
      placeholder="姓名" 
      required 
    />
    <input 
      v-model="form.email" 
      type="email" 
      placeholder="邮箱" 
      required 
    />
    <textarea 
      v-model="form.message" 
      placeholder="留言"
    />
    <button type="submit">提交</button>
  </form>
</template>

<script setup>
const form = reactive({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = () => {
  console.log('表单数据：', form)
  // 直接访问 form.name, form.email...
}
</script>`}
          </pre>
        </div>

        {/* React方式 */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">React 表单处理</h3>
          <pre className="text-sm text-blue-700 overflow-x-auto">
{`const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
});

const handleSubmit = (e) => {
  e.preventDefault();
  console.log('表单数据：', formData);
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

return (
  <form onSubmit={handleSubmit}>
    <input 
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="姓名" 
      required 
    />
    {/* 其他字段类似... */}
  </form>
);`}
          </pre>
        </div>
      </div>

      {/* 实际演示表单 */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">实际演示 - React控制组件</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入您的姓名"
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
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入您的邮箱"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              留言
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请留下您的消息"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            提交表单
          </button>
        </form>

        {/* 实时预览 */}
        <div className="mt-6 p-4 bg-white rounded border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">实时预览（展示React状态绑定）：</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>姓名：</strong>{formData.name || '(未填写)'}</p>
            <p><strong>邮箱：</strong>{formData.email || '(未填写)'}</p>
            <p><strong>留言：</strong>{formData.message || '(未填写)'}</p>
          </div>
        </div>
      </div>

      {/* 关键差异总结 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">关键差异总结</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">Vue优势：</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• v-model自动双向绑定</li>
              <li>• 模板语法简洁直观</li>
              <li>• 响应式数据自动更新</li>
              <li>• 代码量更少</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">React特点：</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• 显式的状态管理</li>
              <li>• 更好的类型支持</li>
              <li>• 明确的数据流向</li>
              <li>• 灵活的事件处理</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 