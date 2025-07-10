import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const prisma = new PrismaClient()

// 生成slug
function generateSlug(filename: string): string {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 提取摘要
function extractExcerpt(content: string, maxLength = 200): string {
  // 移除markdown语法
  const cleanContent = content
    .replace(/^#{1,6}\s+/gm, '') // 移除标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体
    .replace(/`(.*?)`/g, '$1') // 移除代码
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/\n+/g, ' ') // 替换换行为空格
    .trim()

  return cleanContent.length > maxLength 
    ? cleanContent.substring(0, maxLength) + '...'
    : cleanContent
}

// 解析文档优先级
function getPriority(filename: string): number {
  const match = filename.match(/^(\d+)-/)
  return match ? parseInt(match[1]) : 999
}

// 获取文档类型
function getDocType(filename: string): 'tutorial' | 'guide' | 'reference' {
  if (filename.includes('tutorial') || filename.match(/^\d+-/)) {
    return 'tutorial'
  }
  if (filename.includes('guide') || filename.includes('how-to')) {
    return 'guide'
  }
  return 'reference'
}

async function importDocs() {
  console.log('📚 开始导入文档...')

  const docsDir = path.join(process.cwd(), 'docs')
  
  if (!fs.existsSync(docsDir)) {
    console.error('❌ docs目录不存在')
    return
  }

  // 获取或创建文档作者
  const docAuthor = await prisma.user.upsert({
    where: { email: 'docs@system.com' },
    update: {},
    create: {
      email: 'docs@system.com',
      name: '文档系统',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=docs'
    }
  })

  // 创建文档标签
  const docTag = await prisma.tag.upsert({
    where: { name: '学习文档' },
    update: {},
    create: { name: '学习文档' }
  })

  const tutorialTag = await prisma.tag.upsert({
    where: { name: '教程' },
    update: {},
    create: { name: '教程' }
  })

  const guideTag = await prisma.tag.upsert({
    where: { name: '指南' },
    update: {},
    create: { name: '指南' }
  })

  // 读取所有markdown文件
  const files = fs.readdirSync(docsDir)
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => getPriority(a) - getPriority(b))

  console.log(`📄 发现 ${files.length} 个文档文件`)

  for (const file of files) {
    try {
      const filePath = path.join(docsDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      
      // 解析frontmatter
      const { data: frontmatter, content } = matter(fileContent)
      
      const slug = `docs-${generateSlug(file)}`
      const title = frontmatter.title || 
        content.match(/^#\s+(.+)$/m)?.[1] || 
        file.replace(/\.md$/, '').replace(/^\d+-/, '').replace(/-/g, ' ')
      
      const excerpt = frontmatter.description || 
        frontmatter.excerpt || 
        extractExcerpt(content)
      
      const docType = getDocType(file)
      const priority = getPriority(file)

      // 检查文档是否已存在
      const existingPost = await prisma.post.findUnique({
        where: { slug }
      })

      let post
      if (existingPost) {
        // 更新现有文档
        post = await prisma.post.update({
          where: { slug },
          data: {
            title,
            content,
            excerpt,
            published: true,
            viewCount: existingPost.viewCount // 保持现有浏览量
          }
        })
        console.log(`📝 更新文档: ${title}`)
      } else {
        // 创建新文档
        post = await prisma.post.create({
          data: {
            title,
            content,
            excerpt,
            slug,
            published: true,
            authorId: docAuthor.id
          }
        })
        console.log(`✨ 创建文档: ${title}`)
      }

      // 添加标签
      const tagsToAdd = [docTag.id]
      if (docType === 'tutorial') tagsToAdd.push(tutorialTag.id)
      if (docType === 'guide') tagsToAdd.push(guideTag.id)

      // 清除现有标签关联
      await prisma.postTag.deleteMany({
        where: { postId: post.id }
      })

      // 添加新标签关联
      for (const tagId of tagsToAdd) {
        await prisma.postTag.upsert({
          where: {
            postId_tagId: { postId: post.id, tagId }
          },
          update: {},
          create: { postId: post.id, tagId }
        })
      }

    } catch (error) {
      console.error(`❌ 导入文件 ${file} 失败:`, error)
    }
  }

  console.log('🎉 文档导入完成！')
}

// 安装gray-matter依赖的提示
async function checkDependencies() {
  try {
    require('gray-matter')
  } catch (error) {
    console.log('📦 正在安装必要依赖...')
    const { execSync } = require('child_process')
    execSync('pnpm add gray-matter', { stdio: 'inherit' })
  }
}

async function main() {
  try {
    await checkDependencies()
    await importDocs()
  } catch (error) {
    console.error('❌ 导入过程中出现错误:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export { importDocs } 