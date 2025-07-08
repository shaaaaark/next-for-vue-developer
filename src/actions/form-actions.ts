'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

// Server Action - 创建用户
export async function createUser(formData: FormData) {
  // 获取表单数据
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  
  // 模拟数据验证
  if (!name || !email) {
    throw new Error('姓名和邮箱是必填项');
  }
  
  // 模拟数据库操作
  console.log('保存用户到数据库：', { name, email, role });
  
  // 模拟异步操作（比如数据库写入）
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('用户创建成功！');
}

// Server Action - 更新用户状态 (改进版，带反馈)
export async function updateUserStatus(formData: FormData) {
  const userId = formData.get('userId') as string;
  const status = formData.get('status') as string;
  
  console.log('更新用户状态：', { userId, status });
  
  // 模拟数据库操作
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('状态更新成功！');
  
  // 重定向到同一页面，带状态参数，这样可以显示反馈
  const currentUrl = new URL(formData.get('currentUrl') as string || '/');
  currentUrl.searchParams.set('action', 'update');
  currentUrl.searchParams.set('userId', userId);
  currentUrl.searchParams.set('status', status);
  currentUrl.searchParams.set('timestamp', Date.now().toString());
  
  redirect(currentUrl.toString());
}

// Zod验证模式
const userSchema = z.object({
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
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

// Server Action - 带Zod验证的用户创建
export async function createUserWithValidation(formData: FormData) {
  // 从FormData提取数据
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    age: Number(formData.get('age')),
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    website: formData.get('website') as string,
  };

  // Zod验证
  try {
    const validatedData = userSchema.parse(rawData);
    console.log('验证通过，用户数据：', validatedData);
    
    // 模拟数据库保存
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('用户创建成功！');
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('验证失败：', error.errors);
      throw new Error(`验证失败: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
} 