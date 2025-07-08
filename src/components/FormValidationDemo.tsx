'use client';

import { useState } from 'react';
import { z } from 'zod';
import { createUserWithValidation } from '@/actions/form-actions';

// 基础验证模式（用于客户端验证）
const baseUserSchema = z.object({
  name: z.string()
    .min(2, '姓名至少需要2个字符')
    .max(20, '姓名不能超过20个字符'),
  email: z.string()
    .email('请输入有效的邮箱地址'),
  age: z.number()
    .min(18, '年龄必须大于等于18岁')
    .max(120, '年龄不能超过120岁'),
  password: z.string()
    .min(8, '密码至少需要8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
  confirmPassword: z.string(),
  website: z.string()
    .url('请输入有效的网址')
    .optional()
    .or(z.literal('')), // 允许空字符串
});

// 完整验证模式（包含refine，用于客户端验证）
const userSchema = baseUserSchema.refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

// 类型推导
type UserFormData = z.infer<typeof userSchema>;

export default function FormValidationDemo() {
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: '',
    website: ''
  });

  // 客户端实时验证
  const validateField = (name: string, value: any) => {
    try {
      if (name === 'age') {
        value = Number(value);
      }
      
      // 验证单个字段
      const fieldSchema = baseUserSchema.shape[name as keyof typeof baseUserSchema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
      }
      
      // 如果是确认密码，需要特殊处理
      if (name === 'confirmPassword' && formData.password !== value) {
        throw new z.ZodError([{
          code: 'custom',
          message: '两次输入的密码不一致',
          path: ['confirmPassword']
        }]);
      }
      
      // 清除错误
      setClientErrors(prev => ({ ...prev, [name]: '' }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setClientErrors(prev => ({ 
          ...prev, 
          [name]: error.errors[0]?.message || '验证失败' 
        }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 实时验证（延迟执行避免频繁验证）
    setTimeout(() => validateField(name, value), 300);
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const numericData = {
        ...formData,
        age: Number(formData.age)
      };
      
      const validatedData = userSchema.parse(numericData);
      console.log('客户端验证通过：', validatedData);
      alert('客户端验证通过！请查看控制台输出。');
      setClientErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path[0] as string;
          errors[path] = err.message;
        });
        setClientErrors(errors);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        表单验证和错误处理（Zod）
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">
          Zod - 类型安全的验证库
        </h3>
        <p className="text-blue-700 text-sm">
          Zod是一个TypeScript友好的验证库，提供运行时验证和静态类型推导。
          相比传统验证方式，Zod提供更好的类型安全性和开发体验。
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Vue验证方式 */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Vue验证方式</h3>
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`// 使用VeeValidate或自定义验证
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required().min(2),
  email: yup.string().email().required(),
  age: yup.number().min(18).max(120)
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema
})

const onSubmit = handleSubmit((values) => {
  console.log('提交数据:', values)
})

// 模板中显示错误
<template>
  <input v-model="name" />
  <span v-if="errors.name">{{ errors.name }}</span>
</template>`}
          </pre>
        </div>

        {/* Zod验证方式 */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">Zod验证方式</h3>
          <pre className="text-sm text-blue-700 overflow-x-auto">
{`import { z } from 'zod'

// 定义验证模式
const userSchema = z.object({
  name: z.string().min(2, '姓名至少2个字符'),
  email: z.string().email('无效邮箱'),
  age: z.number().min(18, '最小18岁')
})

// 自动类型推导
type User = z.infer<typeof userSchema>

// Server Action中验证
// /actions/form-actions.ts
'use server'
export async function createUser(formData: FormData) {
  const data = userSchema.parse({
    name: formData.get('name'),
    email: formData.get('email'),
    age: Number(formData.get('age'))
  })
  // data现在是类型安全的User类型
}`}
          </pre>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 客户端验证演示 */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">客户端实时验证</h3>
          
          <form onSubmit={handleClientSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名 (2-20个字符)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  clientErrors.name 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="请输入姓名"
              />
              {clientErrors.name && (
                <p className="text-red-600 text-sm mt-1">{clientErrors.name}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  clientErrors.email 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="请输入邮箱"
              />
              {clientErrors.email && (
                <p className="text-red-600 text-sm mt-1">{clientErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                年龄 (18-120)
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  clientErrors.age 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="请输入年龄"
              />
              {clientErrors.age && (
                <p className="text-red-600 text-sm mt-1">{clientErrors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码 (8位+大小写+数字)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  clientErrors.password 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="请输入密码"
              />
              {clientErrors.password && (
                <p className="text-red-600 text-sm mt-1">{clientErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                确认密码
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  clientErrors.confirmPassword 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="请再次输入密码"
              />
              {clientErrors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{clientErrors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                网站 (可选)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  clientErrors.website 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="https://example.com"
              />
              {clientErrors.website && (
                <p className="text-red-600 text-sm mt-1">{clientErrors.website}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              客户端验证提交
            </button>
          </form>
        </div>

        {/* Server Action验证演示 */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">服务端验证（Server Action）</h3>
          
          <form action={createUserWithValidation} className="space-y-4">
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
                年龄
              </label>
              <input
                type="number"
                name="age"
                defaultValue=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入年龄"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                type="password"
                name="password"
                defaultValue=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入密码"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                确认密码
              </label>
              <input
                type="password"
                name="confirmPassword"
                defaultValue=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请再次输入密码"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                网站 (可选)
              </label>
              <input
                type="url"
                name="website"
                defaultValue=""
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              服务端验证提交
            </button>
          </form>
        </div>
      </div>

      {/* Zod优势总结 */}
      <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Zod验证优势</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">类型安全：</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• 自动类型推导</li>
              <li>• 编译时类型检查</li>
              <li>• 运行时验证保护</li>
              <li>• 完美的TypeScript集成</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-700 mb-2">开发体验：</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• 简洁的API设计</li>
              <li>• 丰富的内置验证器</li>
              <li>• 自定义验证规则</li>
              <li>• 详细的错误信息</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>💡 最佳实践：</strong> Server Actions放在单独的文件中，客户端可以做实时验证，
            服务端进行最终的安全验证。这样既有好的用户体验，又保证了数据安全！
          </p>
        </div>
      </div>
    </div>
  );
} 