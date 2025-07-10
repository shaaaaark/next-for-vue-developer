'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// 数据验证模式
const createPostSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题不能超过100个字符'),
  content: z.string().min(10, '内容至少需要10个字符').max(10000, '内容不能超过10000个字符'),
  excerpt: z.string().max(200, '摘要不能超过200个字符').optional(),
  authorId: z.string(),
  published: z.boolean().default(false)
})

const updatePostSchema = createPostSchema.partial().extend({
  id: z.string()
})

// 生成文章slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格为连字符
    .replace(/^-+|-+$/g, '') // 移除首尾连字符
    + '-' + Date.now().toString(36) // 添加时间戳避免重复
}

// 创建文章
export async function createPost(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    authorId: formData.get('authorId'),
    published: formData.get('published') === 'on'
  }

  const result = createPostSchema.safeParse(rawData)

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors
    }
  }

  try {
    const post = await prisma.post.create({
      data: {
        ...result.data,
        slug: generateSlug(result.data.title)
      }
    })

    revalidatePath('/blog-db')
    revalidatePath('/admin/posts')
    
    return { 
      success: true, 
      post,
      message: '文章创建成功！'
    }
  } catch (error) {
    console.error('创建文章失败:', error)
    return { 
      error: '创建失败，请稍后重试' 
    }
  }
}

// 更新文章
export async function updatePost(formData: FormData) {
  const rawData = {
    id: formData.get('id'),
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    published: formData.get('published') === 'on'
  }

  const result = updatePostSchema.safeParse(rawData)

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors
    }
  }

  try {
    const { id, ...updateData } = result.data
    
    const post = await prisma.post.update({
      where: { id },
      data: updateData
    })

    revalidatePath('/blog-db')
    revalidatePath('/admin/posts')
    revalidatePath(`/blog-db/${post.slug}`)
    
    return { 
      success: true, 
      post,
      message: '文章更新成功！'
    }
  } catch (error) {
    console.error('更新文章失败:', error)
    return { 
      error: '更新失败，请稍后重试' 
    }
  }
}

// 删除文章
export async function deletePost(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) {
    console.error('文章ID不能为空')
    return
  }

  try {
    await prisma.post.delete({
      where: { id }
    })

    revalidatePath('/blog-db')
    revalidatePath('/admin/posts')
    
    console.log('文章删除成功！')
  } catch (error) {
    console.error('删除文章失败:', error)
  }
}

// 切换文章发布状态
export async function togglePostPublished(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) {
    console.error('文章ID不能为空')
    return
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { published: true }
    })

    if (!post) {
      console.error('文章不存在')
      return
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { published: !post.published }
    })

    revalidatePath('/blog-db')
    revalidatePath('/admin/posts')
    
    console.log(`文章已${updatedPost.published ? '发布' : '取消发布'}！`)
  } catch (error) {
    console.error('切换发布状态失败:', error)
  }
}

// 增加文章浏览量
export async function incrementPostViews(slug: string) {
  try {
    await prisma.post.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })
  } catch (error) {
    console.error('增加浏览量失败:', error)
  }
} 