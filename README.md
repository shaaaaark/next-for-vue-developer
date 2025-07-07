# Vue 开发者的 Next.js 学习项目

> 🎯 一个专为Vue开发者设计的Next.js完整学习路线，通过对比和实践深入理解React和Next.js

## 📖 项目介绍

这个项目旨在帮助有Vue开发经验的开发者系统学习Next.js。通过对比Vue和React/Next.js的异同，以代码实践驱动学习，逐步掌握Next.js的核心概念和最佳实践。

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 打开浏览器访问
# http://localhost:3000
```

## 📚 学习路线

### ✅ 已完成模块

#### 第一章：JSX/TSX语法基础
- **文档**：[01-jsx-tsx-syntax.md](./docs/01-jsx-tsx-syntax.md)
- **演示组件**：[StateDemo.tsx](./src/components/StateDemo.tsx)
- **核心内容**：
  - JSX vs Vue模板语法
  - 条件渲染和列表渲染
  - 事件处理对比
  - 样式处理差异

#### 第二章：React状态管理
- **文档**：[02-react-state-management.md](./docs/02-react-state-management.md)
- **演示组件**：[StateDemo.tsx](./src/components/StateDemo.tsx)
- **核心内容**：
  - useState vs Vue的reactive
  - useEffect vs Vue的生命周期
  - 状态更新机制对比
  - 副作用处理差异

#### 第三章：条件渲染和列表渲染
- **文档**：[03-conditional-and-list-rendering.md](./docs/03-conditional-and-list-rendering.md)
- **演示组件**：[ConditionalAndListDemo.tsx](./src/components/ConditionalAndListDemo.tsx)
- **核心内容**：
  - 条件渲染：v-if vs JSX表达式
  - 列表渲染：v-for vs map方法
  - key属性的重要性
  - 性能优化对比

#### 第四章：组件间通信和生命周期
- **文档**：[04-component-communication-lifecycle.md](./docs/04-component-communication-lifecycle.md)
- **演示组件**：[ComponentCommunicationDemo.tsx](./src/components/ComponentCommunicationDemo.tsx)
- **核心内容**：
  - Props传递对比
  - 事件通信：emit vs 回调函数
  - 设计理念差异分析
  - 生命周期对比

#### 第五章：Next.js路由系统
- **文档**：[05-nextjs-routing.md](./docs/05-nextjs-routing.md)
- **演示页面**：
  - [/about](./src/app/about/page.tsx) - 静态路由
  - [/products](./src/app/products/page.tsx) - 产品列表
  - [/products/[id]](./src/app/products/[id]/page.tsx) - 动态路由
- **核心内容**：
  - 文件系统路由 vs Vue Router
  - 动态路由和参数获取
  - 嵌套路由和布局
  - 路由守卫对比

#### 第六章：数据获取策略
- **文档**：[06-data-fetching.md](./docs/06-data-fetching.md)
- **演示页面**：
  - [/blog-csr](./src/app/blog-csr/page.tsx) - 客户端渲染
  - [/blog-ssr](./src/app/blog-ssr/page.tsx) - 服务端渲染
  - [/blog-ssg](./src/app/blog-ssg/page.tsx) - 静态生成
- **API路由**：
  - [/api/posts](./src/app/api/posts/route.ts) - 博客API
  - [/api/posts/[slug]](./src/app/api/posts/[slug]/route.ts) - 动态API
- **核心内容**：
  - CSR vs SSR vs SSG对比
  - fetch API和缓存策略
  - API路由设计
  - 渲染策略选择

### 🎯 计划中的模块

#### 第七章：表单处理和数据变更（优先级：⭐⭐⭐⭐⭐）
- **核心内容**：
  - Server Actions vs Vue的表单提交
  - 表单验证和错误处理
  - 乐观更新（Optimistic Updates）
  - 文件上传处理
- **实践项目**：用户注册/登录表单、文件上传组件

#### 第八章：错误处理和加载状态（优先级：⭐⭐⭐⭐）
- **核心内容**：
  - error.js、loading.js、not-found.js文件约定
  - 错误边界（Error Boundaries）
  - 流式渲染和Suspense
  - 骨架屏设计
- **实践项目**：完善的错误处理和加载状态系统

#### 第九章：缓存系统深入（优先级：⭐⭐⭐⭐）
- **核心内容**：
  - 四种缓存机制：Request Memoization、Data Cache、Full Route Cache、Router Cache
  - 缓存策略配置和优化
  - revalidation机制
  - 与Vue的缓存对比
- **实践项目**：高性能缓存示例

#### 第十章：优化技术（优先级：⭐⭐⭐）
- **核心内容**：
  - Image组件优化
  - 字体优化和Web Fonts
  - 脚本加载优化
  - 懒加载和代码分割
- **实践项目**：性能优化案例分析

#### 第十一章：中间件和认证（优先级：⭐⭐⭐）
- **核心内容**：
  - Middleware概念和使用
  - 身份验证流程设计
  - 权限控制和路由保护
  - JWT处理和会话管理
- **实践项目**：完整的认证系统

#### 第十二章：高级路由特性（优先级：⭐⭐）
- **核心内容**：
  - 平行路由（Parallel Routes）
  - 拦截路由（Intercepting Routes）
  - 路由组（Route Groups）
  - 中间件路由控制
- **实践项目**：复杂路由架构示例

## 🛠 技术栈

- **框架**：Next.js 14 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **包管理**：pnpm
- **开发工具**：ESLint、Prettier

## 📁 项目结构

```
nextjs_demo/
├── docs/                           # 学习文档
│   ├── 01-jsx-tsx-syntax.md
│   ├── 02-react-state-management.md
│   ├── 03-conditional-and-list-rendering.md
│   ├── 04-component-communication-lifecycle.md
│   ├── 05-nextjs-routing.md
│   ├── 06-data-fetching.md
│   └── README.md
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── about/                  # 静态路由示例
│   │   ├── products/               # 产品页面和动态路由
│   │   ├── blog-csr/               # 客户端渲染示例
│   │   ├── blog-ssr/               # 服务端渲染示例
│   │   ├── blog-ssg/               # 静态生成示例
│   │   ├── api/                    # API路由
│   │   ├── layout.tsx              # 根布局
│   │   ├── page.tsx                # 首页
│   │   └── globals.css             # 全局样式
│   └── components/                 # 可复用组件
│       ├── StateDemo.tsx
│       ├── ConditionalAndListDemo.tsx
│       └── ComponentCommunicationDemo.tsx
├── public/                         # 静态资源
└── package.json
```

## 🎓 学习方法

### 1. 代码驱动学习
- 每个概念都有对应的代码示例
- 通过对比Vue和React的实现方式加深理解
- 实践项目巩固所学知识

### 2. 渐进式学习
- 从基础语法到高级特性
- 每个模块都建立在前面的基础上
- 循序渐进，避免认知负荷过重

### 3. 对比式理解
- Vue vs React语法对比
- 设计理念差异分析
- 最佳实践对比

## 🚀 下一步计划

1. **立即开始**：第七章 - 表单处理和数据变更
2. **中期目标**：完成所有核心模块的学习
3. **长期目标**：构建一个完整的Next.js项目

## 📝 学习笔记

- 每个模块的学习重点都记录在对应的文档中
- 关键的设计理念差异需要特别关注
- 实践代码中的注释包含重要的学习要点

## 🤝 贡献

如果您发现任何问题或有改进建议，欢迎提交Issue或Pull Request。

## 📄 许可证

MIT License

---

> 💡 **学习提示**：建议按照模块顺序学习，每完成一个模块后在对应的checkbox上打勾，并在学习过程中记录自己的思考和疑问。
