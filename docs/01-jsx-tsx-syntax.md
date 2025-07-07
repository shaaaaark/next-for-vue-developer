# JSX/TSX语法

> 从Vue模板语法到React JSX的完全指南

## 🎯 学习目标

- 理解JSX是什么，以及它与Vue模板语法的区别
- 掌握TSX中的TypeScript类型定义
- 学会在JSX中处理事件和数据绑定
- 理解JSX的编译原理

## 📖 基础概念对比

### Vue模板语法 vs React JSX

| 特性 | Vue模板语法 | React JSX |
|------|-------------|-----------|
| **模板结构** | `<template>` 标签包裹 | 直接返回JSX |
| **数据插值** | `{{ variable }}` | `{variable}` |
| **属性绑定** | `:prop="value"` | `prop={value}` |
| **事件绑定** | `@click="handler"` | `onClick={handler}` |
| **条件渲染** | `v-if="condition"` | `{condition && <div>...</div>}` |
| **列表渲染** | `v-for="item in list"` | `{list.map(item => ...)}` |
| **类型检查** | 可选的TypeScript支持 | 原生TypeScript集成 |

## 🔄 语法对比示例

### 1. 基础组件结构

**Vue SFC:**
```vue
<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script setup lang="ts">
const title = ref('Hello Vue')
const message = ref('这是Vue组件')

const handleClick = () => {
  console.log('Vue按钮被点击')
}
</script>
```

**React TSX:**
```tsx
interface Props {}

export default function MyComponent(): JSX.Element {
  const title = 'Hello React'
  const message = '这是React组件'
  
  const handleClick = () => {
    console.log('React按钮被点击')
  }
  
  return (
    <div className="container">
      <h1>{title}</h1>
      <p>{message}</p>
      <button onClick={handleClick}>点击我</button>
    </div>
  )
}
```

### 2. 数据绑定和插值

**Vue模板:**
```vue
<template>
  <div>
    <!-- 文本插值 -->
    <p>{{ username }}</p>
    
    <!-- 属性绑定 -->
    <img :src="imageUrl" :alt="imageAlt" />
    
    <!-- 动态类名 -->
    <div :class="{ active: isActive, disabled: isDisabled }">
      状态指示器
    </div>
    
    <!-- 内联样式 -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">
      样式文本
    </div>
  </div>
</template>
```

**React JSX:**
```tsx
export default function DataBinding() {
  const username = 'Vue开发者'
  const imageUrl = '/avatar.jpg'
  const imageAlt = '用户头像'
  const isActive = true
  const isDisabled = false
  const textColor = 'blue'
  const fontSize = 16
  
  return (
    <div>
      {/* 文本插值 */}
      <p>{username}</p>
      
      {/* 属性绑定 */}
      <img src={imageUrl} alt={imageAlt} />
      
      {/* 动态类名 */}
      <div className={`indicator ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
        状态指示器
      </div>
      
      {/* 内联样式 */}
      <div style={{ color: textColor, fontSize: `${fontSize}px` }}>
        样式文本
      </div>
    </div>
  )
}
```

### 3. 事件处理

**Vue事件处理:**
```vue
<template>
  <div>
    <!-- 基础事件 -->
    <button @click="handleClick">基础点击</button>
    
    <!-- 带参数的事件 -->
    <button @click="handleClickWithParam('hello')">带参数点击</button>
    
    <!-- 事件修饰符 -->
    <form @submit.prevent="handleSubmit">
      <input @keyup.enter="handleEnter" />
    </form>
    
    <!-- 鼠标事件 -->
    <div @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      鼠标悬停区域
    </div>
  </div>
</template>
```

**React事件处理:**
```tsx
export default function EventHandling() {
  const handleClick = () => {
    console.log('基础点击')
  }
  
  const handleClickWithParam = (param: string) => {
    console.log('带参数点击:', param)
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // React中手动阻止默认行为
    console.log('表单提交')
  }
  
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log('回车键按下')
    }
  }
  
  const handleMouseEnter = () => console.log('鼠标进入')
  const handleMouseLeave = () => console.log('鼠标离开')
  
  return (
    <div>
      {/* 基础事件 */}
      <button onClick={handleClick}>基础点击</button>
      
      {/* 带参数的事件 - 使用箭头函数 */}
      <button onClick={() => handleClickWithParam('hello')}>带参数点击</button>
      
      {/* 表单事件 */}
      <form onSubmit={handleSubmit}>
        <input onKeyUp={handleKeyUp} />
      </form>
      
      {/* 鼠标事件 */}
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        鼠标悬停区域
      </div>
    </div>
  )
}
```

## 🏷️ TypeScript类型定义

### 组件Props类型

**Vue组件类型:**
```typescript
// Vue 3 Composition API
interface Props {
  title: string
  count: number
  isVisible?: boolean
  items: string[]
  user: {
    name: string
    age: number
  }
}

const props = defineProps<Props>()
```

**React组件类型:**
```tsx
interface Props {
  title: string
  count: number
  isVisible?: boolean
  items: string[]
  user: {
    name: string
    age: number
  }
}

export default function MyComponent({ 
  title, 
  count, 
  isVisible = false, 
  items, 
  user 
}: Props) {
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      {isVisible && <span>可见内容</span>}
      <ul>
        {items.map(item => <li key={item}>{item}</li>)}
      </ul>
      <p>用户: {user.name}, 年龄: {user.age}</p>
    </div>
  )
}
```

### 事件类型定义

```tsx
// 常用的React事件类型
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log('按钮点击', e.currentTarget)
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log('输入变化', e.target.value)
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  console.log('表单提交')
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    console.log('回车键按下')
  }
}
```

## 🎨 JSX高级特性

### 1. 条件渲染模式

```tsx
export default function ConditionalRendering() {
  const isLoggedIn = true
  const userRole = 'admin'
  const items = ['item1', 'item2']
  
  return (
    <div>
      {/* 基础条件渲染 */}
      {isLoggedIn && <p>欢迎回来！</p>}
      
      {/* 三元运算符 */}
      {isLoggedIn ? <p>已登录</p> : <p>请登录</p>}
      
      {/* 复杂条件渲染 */}
      {isLoggedIn ? (
        userRole === 'admin' ? (
          <div>管理员面板</div>
        ) : (
          <div>用户面板</div>
        )
      ) : (
        <div>登录页面</div>
      )}
      
      {/* 使用立即执行函数 */}
      {(() => {
        if (!isLoggedIn) return <div>请先登录</div>
        if (userRole === 'admin') return <div>管理员</div>
        return <div>普通用户</div>
      })()}
    </div>
  )
}
```

### 2. 列表渲染和key

```tsx
interface User {
  id: number
  name: string
  email: string
}

export default function ListRendering() {
  const users: User[] = [
    { id: 1, name: '张三', email: 'zhang@example.com' },
    { id: 2, name: '李四', email: 'li@example.com' },
  ]
  
  return (
    <div>
      {/* 基础列表渲染 */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
      
      {/* 复杂列表渲染 */}
      <div>
        {users.map((user, index) => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <small>索引: {index}</small>
          </div>
        ))}
      </div>
      
      {/* 过滤后渲染 */}
      <div>
        {users
          .filter(user => user.name.includes('张'))
          .map(user => (
            <span key={user.id}>{user.name}</span>
          ))}
      </div>
    </div>
  )
}
```

## ⚠️ 常见陷阱和注意事项

### 1. className vs class

```tsx
// ❌ 错误：在JSX中使用class
<div class="container">内容</div>

// ✅ 正确：在JSX中使用className
<div className="container">内容</div>
```

### 2. 事件处理函数调用

```tsx
// ❌ 错误：立即调用函数
<button onClick={handleClick()}>按钮</button>

// ✅ 正确：传递函数引用
<button onClick={handleClick}>按钮</button>

// ✅ 正确：传递参数时使用箭头函数
<button onClick={() => handleClick('参数')}>按钮</button>
```

### 3. JSX片段

```tsx
// ❌ 错误：返回多个元素时缺少包装元素
function MyComponent() {
  return (
    <h1>标题</h1>
    <p>段落</p>
  )
}

// ✅ 正确：使用Fragment包装
function MyComponent() {
  return (
    <>
      <h1>标题</h1>
      <p>段落</p>
    </>
  )
}

// ✅ 也可以使用React.Fragment
function MyComponent() {
  return (
    <React.Fragment>
      <h1>标题</h1>
      <p>段落</p>
    </React.Fragment>
  )
}
```

## 🔍 编译原理对比

### Vue模板编译

```vue
<!-- Vue模板 -->
<template>
  <div>{{ message }}</div>
</template>

<!-- 编译后的渲染函数 -->
<script>
function render() {
  return h('div', this.message)
}
</script>
```

### JSX编译

```tsx
// JSX代码
const element = <div>{message}</div>

// 编译后的JavaScript (React 17+)
const element = jsx('div', { children: message })

// 旧版本编译结果 (React 16及以前)
const element = React.createElement('div', null, message)
```

## 💡 最佳实践

### 1. 组件命名
- 组件名使用PascalCase (如：`UserProfile`)
- 文件名与组件名保持一致
- Props接口使用`组件名 + Props`的命名方式

### 2. 类型安全
- 始终为Props定义接口
- 使用严格的TypeScript配置
- 合理使用联合类型和可选属性

### 3. 代码组织
- 将复杂的JSX逻辑提取为变量或函数
- 保持组件函数的简洁性
- 合理使用组件拆分

## 🎯 练习建议

1. **转换练习**: 将你熟悉的Vue组件转换为React组件
2. **类型练习**: 为复杂的组件定义完整的TypeScript类型
3. **事件练习**: 实现各种事件处理场景
4. **条件渲染练习**: 实现复杂的条件渲染逻辑

## 📚 延伸阅读

- [React官方文档 - JSX](https://react.dev/learn/writing-markup-with-jsx)
- [TypeScript官方文档 - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [Vue vs React语法对比](https://vue-to-react.surge.sh/)

---

**下一步**: 学习 [React状态管理](./02-react-state-management.md) 