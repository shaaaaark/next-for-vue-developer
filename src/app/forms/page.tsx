import FormBasicsDemo from '@/components/FormBasicsDemo';
import ServerActionsDemo from '@/components/ServerActionsDemo';
import FormValidationDemo from '@/components/FormValidationDemo';
import Link from 'next/link';

export default function FormsPage() {
  return (
    <div className="container mx-auto px-8 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        第七章：表单处理和数据变更
      </h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          本章学习重点
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Vue表单处理回顾：</h3>
            <ul className="text-blue-600 space-y-1">
              <li>• v-model双向绑定</li>
              <li>• @submit表单提交</li>
              <li>• 客户端验证和提示</li>
              <li>• axios发送请求</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Next.js表单处理：</h3>
            <ul className="text-blue-600 space-y-1">
              <li>• Server Actions服务端处理</li>
              <li>• action属性直接提交</li>
              <li>• Zod类型安全验证</li>
              <li>• FormData原生API</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* 基础表单对比 */}
        <FormBasicsDemo />
        
        {/* Server Actions演示 */}
        <ServerActionsDemo />
        
        {/* 表单验证演示 */}
        <FormValidationDemo />
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">
          🎉 学习完成！
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">你已经掌握：</h3>
            <ul className="text-blue-600 space-y-1 text-sm">
              <li>• Server Actions的强大功能</li>
              <li>• Zod类型安全验证</li>
              <li>• 客户端和服务端验证的结合</li>
              <li>• Next.js表单最佳实践</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">下一步学习建议：</h3>
            <ul className="text-blue-600 space-y-1 text-sm">
              <li>• 数据库集成（Prisma）</li>
              <li>• 用户认证（NextAuth.js）</li>
              <li>• 文件上传处理</li>
              <li>• 复杂表单状态管理</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← 返回主学习页面
          </Link>
        </div>
      </div>
    </div>
  );
} 