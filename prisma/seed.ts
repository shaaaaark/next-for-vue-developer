import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始播种数据...')

  // 创建用户
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: '管理员',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      }
    }),
    prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: '普通用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
      }
    })
  ])

  console.log('✅ 用户创建完成:', users.length)

  // 创建标签
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Next.js' },
      update: {},
      create: { name: 'Next.js' }
    }),
    prisma.tag.upsert({
      where: { name: 'React' },
      update: {},
      create: { name: 'React' }
    }),
    prisma.tag.upsert({
      where: { name: 'TypeScript' },
      update: {},
      create: { name: 'TypeScript' }
    }),
    prisma.tag.upsert({
      where: { name: 'Prisma' },
      update: {},
      create: { name: 'Prisma' }
    })
  ])

  console.log('✅ 标签创建完成:', tags.length)

  // 创建文章
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'nextjs-database-integration' },
      update: {},
      create: {
        title: 'Next.js 数据库集成完全指南',
        slug: 'nextjs-database-integration',
        excerpt: '学习如何在Next.js应用中集成Prisma和SQLite，实现完整的CRUD操作。',
        content: `# Next.js 数据库集成完全指南

## 前言

在这篇文章中，我们将学习如何在Next.js应用中集成数据库，使用Prisma ORM来实现类型安全的数据操作。

## 技术栈选择

我们选择了以下技术栈：
- **数据库**: SQLite (开发环境)
- **ORM**: Prisma
- **验证**: Zod
- **表单**: Server Actions

## 实现步骤

### 1. 安装依赖

\`\`\`bash
pnpm add prisma @prisma/client zod
\`\`\`

### 2. 初始化Prisma

\`\`\`bash
npx prisma init --datasource-provider sqlite
\`\`\`

### 3. 定义数据模型

在 \`prisma/schema.prisma\` 中定义我们的数据结构...

## 总结

通过本文的学习，你已经掌握了Next.js数据库集成的核心技能。`,
        published: true,
        authorId: users[0].id
      }
    }),
    prisma.post.upsert({
      where: { slug: 'vue-to-nextjs-migration' },
      update: {},
      create: {
        title: '从Vue到Next.js：前端开发者的迁移指南',
        slug: 'vue-to-nextjs-migration',
        excerpt: '详细对比Vue和Next.js的开发方式，帮助Vue开发者快速上手React生态。',
        content: `# 从Vue到Next.js：前端开发者的迁移指南

## 引言

作为一名Vue开发者，转向Next.js可能看起来很有挑战性。但实际上，两个框架有很多共同点。

## 主要差异对比

### 组件语法
Vue使用模板语法，而React使用JSX...

### 状态管理
Vue有Vuex/Pinia，React有Context/Zustand...

## 学习路径

推荐的学习顺序：
1. JSX语法基础
2. React组件概念
3. Next.js路由系统
4. 数据获取策略

## 实践建议

从小项目开始，逐步熟悉React生态...`,
        published: true,
        authorId: users[1].id
      }
    }),
    prisma.post.upsert({
      where: { slug: 'server-actions-deep-dive' },
      update: {},
      create: {
        title: 'Next.js Server Actions 深度解析',
        slug: 'server-actions-deep-dive',
        excerpt: '深入了解Server Actions的工作原理，以及如何在实际项目中最佳实践。',
        content: `# Next.js Server Actions 深度解析

## 什么是Server Actions

Server Actions是Next.js 13.4引入的新特性，允许我们在服务端执行函数...

## 核心优势

1. **类型安全**: 端到端的TypeScript支持
2. **简化API**: 无需创建API路由
3. **自动优化**: 自动处理loading和error状态

## 实际应用

让我们看一个完整的CRUD示例...`,
        published: false,
        authorId: users[0].id
      }
    })
  ])

  console.log('✅ 文章创建完成:', posts.length)

  // 为文章添加标签
  await Promise.all([
    prisma.postTag.upsert({
      where: {
        postId_tagId: {
          postId: posts[0].id,
          tagId: tags.find(t => t.name === 'Next.js')!.id
        }
      },
      update: {},
      create: {
        postId: posts[0].id,
        tagId: tags.find(t => t.name === 'Next.js')!.id
      }
    }),
    prisma.postTag.upsert({
      where: {
        postId_tagId: {
          postId: posts[0].id,
          tagId: tags.find(t => t.name === 'Prisma')!.id
        }
      },
      update: {},
      create: {
        postId: posts[0].id,
        tagId: tags.find(t => t.name === 'Prisma')!.id
      }
    }),
    prisma.postTag.upsert({
      where: {
        postId_tagId: {
          postId: posts[1].id,
          tagId: tags.find(t => t.name === 'Next.js')!.id
        }
      },
      update: {},
      create: {
        postId: posts[1].id,
        tagId: tags.find(t => t.name === 'Next.js')!.id
      }
    }),
    prisma.postTag.upsert({
      where: {
        postId_tagId: {
          postId: posts[1].id,
          tagId: tags.find(t => t.name === 'React')!.id
        }
      },
      update: {},
      create: {
        postId: posts[1].id,
        tagId: tags.find(t => t.name === 'React')!.id
      }
    })
  ])

  console.log('✅ 文章标签关联完成')

  // 创建评论
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: '这篇文章写得很详细，对我这个Next.js新手很有帮助！',
        postId: posts[0].id,
        authorId: users[1].id
      }
    }),
    prisma.comment.create({
      data: {
        content: '作为Vue开发者，我发现Next.js确实有很多相似的概念，感谢分享！',
        postId: posts[1].id,
        authorId: users[0].id
      }
    })
  ])

  console.log('✅ 评论创建完成:', comments.length)

  console.log('🎉 种子数据播种完成！')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 