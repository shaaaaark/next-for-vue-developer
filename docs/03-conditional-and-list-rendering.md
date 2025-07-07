# 条件渲染和列表渲染

> 从Vue指令系统到React JavaScript表达式的完全指南

## 🎯 学习目标

- 理解React中条件渲染的多种实现方式
- 掌握React列表渲染和key的最佳实践
- 对比Vue指令系统和React JavaScript表达式的差异
- 学会处理复杂的渲染逻辑和性能优化

## 📖 核心概念对比

### Vue指令系统 vs React JavaScript表达式

| 特性 | Vue指令系统 | React JavaScript表达式 |
|------|-------------|------------------------|
| **条件渲染** | `v-if`, `v-else-if`, `v-else`, `v-show` | `&&`, `||`, `? :`, `if语句` |
| **列表渲染** | `v-for="item in list"` | `list.map(item => ...)` |
| **键值管理** | `:key="item.id"` | `key={item.id}` |
| **语法风格** | 声明式指令 | 函数式表达式 |
| **条件控制** | 模板内指令 | JavaScript逻辑 |
| **性能优化** | 编译时优化 | 运行时优化 |

## 🔄 条件渲染对比

### 1. 基础条件渲染

**Vue条件渲染:**
```vue
<template>
  <div>
    <!-- v-if条件渲染 -->
    <p v-if="isLoggedIn">欢迎回来！</p>
    <p v-else>请先登录</p>
    
    <!-- v-show条件显示 -->
    <div v-show="isVisible">这个元素可能被隐藏</div>
    
    <!-- 复杂条件 -->
    <div v-if="user.role === 'admin'">
      管理员面板
    </div>
    <div v-else-if="user.role === 'user'">
      用户面板
    </div>
    <div v-else>
      访客面板
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const isLoggedIn = ref(true)
const isVisible = ref(true)
const user = reactive({ role: 'admin' })
</script>
```

**React条件渲染:**
```tsx
import { useState } from 'react'

export default function ConditionalRenderingDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [user, setUser] = useState({ role: 'admin' })
  
  return (
    <div>
      {/* 逻辑与条件渲染 */}
      {isLoggedIn && <p>欢迎回来！</p>}
      {!isLoggedIn && <p>请先登录</p>}
      
      {/* 三元运算符条件渲染 */}
      {isLoggedIn ? <p>欢迎回来！</p> : <p>请先登录</p>}
      
      {/* CSS控制显示隐藏（类似v-show） */}
      <div style={{ display: isVisible ? 'block' : 'none' }}>
        这个元素可能被隐藏
      </div>
      
      {/* 复杂条件渲染 */}
      {user.role === 'admin' && <div>管理员面板</div>}
      {user.role === 'user' && <div>用户面板</div>}
      {user.role !== 'admin' && user.role !== 'user' && <div>访客面板</div>}
      
      {/* 使用立即执行函数处理复杂逻辑 */}
      {(() => {
        if (user.role === 'admin') return <div>管理员面板</div>
        if (user.role === 'user') return <div>用户面板</div>
        return <div>访客面板</div>
      })()}
    </div>
  )
}
```

### 2. 多种条件渲染模式

**React条件渲染最佳实践:**
```tsx
interface User {
  id: number
  name: string
  role: 'admin' | 'user' | 'guest'
  isActive: boolean
}

export default function AdvancedConditionalRendering() {
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: '张三',
    role: 'admin',
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 渲染函数模式
  const renderUserStatus = () => {
    if (loading) return <div className="loading">加载中...</div>
    if (error) return <div className="error">错误: {error}</div>
    if (!user) return <div className="empty">未找到用户</div>
    
    return (
      <div className={`user-status ${user.isActive ? 'active' : 'inactive'}`}>
        {user.name} - {user.role}
      </div>
    )
  }
  
  // 组件模式
  const StatusComponent = () => {
    if (!user) return null
    
    return (
      <div>
        <h3>{user.name}</h3>
        {user.role === 'admin' && (
          <div className="admin-controls">
            <button>管理用户</button>
            <button>系统设置</button>
          </div>
        )}
        {user.isActive ? (
          <span className="status-active">在线</span>
        ) : (
          <span className="status-inactive">离线</span>
        )}
      </div>
    )
  }
  
  return (
    <div>
      {/* 渲染函数 */}
      {renderUserStatus()}
      
      {/* 组件渲染 */}
      <StatusComponent />
      
      {/* 多重条件 */}
      {user && user.isActive && user.role === 'admin' && (
        <div className="admin-panel">
          <h2>管理员专属功能</h2>
          <button>高级设置</button>
        </div>
      )}
      
      {/* 错误边界样式的条件渲染 */}
      {error ? (
        <div className="error-container">
          <h3>出错了！</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)}>重试</button>
        </div>
      ) : (
        <div className="content">
          {/* 正常内容 */}
        </div>
      )}
    </div>
  )
}
```

## 📋 列表渲染对比

### 1. 基础列表渲染

**Vue列表渲染:**
```vue
<template>
  <div>
    <!-- 基础列表 -->
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }} - {{ item.price }}
      </li>
    </ul>
    
    <!-- 带索引的列表 -->
    <ul>
      <li v-for="(item, index) in items" :key="item.id">
        {{ index + 1 }}. {{ item.name }}
      </li>
    </ul>
    
    <!-- 对象属性遍历 -->
    <ul>
      <li v-for="(value, key) in userInfo" :key="key">
        {{ key }}: {{ value }}
      </li>
    </ul>
    
    <!-- 嵌套列表 -->
    <div v-for="category in categories" :key="category.id">
      <h3>{{ category.name }}</h3>
      <ul>
        <li v-for="product in category.products" :key="product.id">
          {{ product.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  { id: 1, name: '商品1', price: 100 },
  { id: 2, name: '商品2', price: 200 }
])

const userInfo = ref({
  name: '张三',
  age: 25,
  email: 'zhang@example.com'
})

const categories = ref([
  {
    id: 1,
    name: '电子产品',
    products: [
      { id: 101, name: '手机' },
      { id: 102, name: '电脑' }
    ]
  }
])
</script>
```

**React列表渲染:**
```tsx
import { useState } from 'react'

interface Item {
  id: number
  name: string
  price: number
}

interface Product {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
  products: Product[]
}

export default function ListRenderingDemo() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: '商品1', price: 100 },
    { id: 2, name: '商品2', price: 200 }
  ])
  
  const [userInfo] = useState({
    name: '张三',
    age: 25,
    email: 'zhang@example.com'
  })
  
  const [categories] = useState<Category[]>([
    {
      id: 1,
      name: '电子产品',
      products: [
        { id: 101, name: '手机' },
        { id: 102, name: '电脑' }
      ]
    }
  ])
  
  return (
    <div>
      {/* 基础列表 */}
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - {item.price}
          </li>
        ))}
      </ul>
      
      {/* 带索引的列表 */}
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            {index + 1}. {item.name}
          </li>
        ))}
      </ul>
      
      {/* 对象属性遍历 */}
      <ul>
        {Object.entries(userInfo).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
      
      {/* 嵌套列表 */}
      {categories.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.products.map(product => (
              <li key={product.id}>
                {product.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

### 2. 列表操作和动态渲染

```tsx
interface Todo {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
}

export default function TodoListAdvanced() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: '学习React',
      completed: false,
      priority: 'high',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      text: '写文档',
      completed: true,
      priority: 'medium',
      createdAt: new Date('2024-01-02')
    }
  ])
  
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [sortBy, setSortBy] = useState<'created' | 'priority'>('created')
  
  // 过滤和排序逻辑
  const filteredAndSortedTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'created') {
        return b.createdAt.getTime() - a.createdAt.getTime()
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  
  const toggleTodo = (id: number) => {
    setTodos(prev => 
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }
  
  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }
  
  const addTodo = (text: string, priority: Todo['priority']) => {
    setTodos(prev => [
      ...prev,
      {
        id: Date.now(),
        text,
        completed: false,
        priority,
        createdAt: new Date()
      }
    ])
  }
  
  // 按优先级分组渲染
  const renderByPriority = () => {
    const groupedTodos = filteredAndSortedTodos.reduce((groups, todo) => {
      const priority = todo.priority
      if (!groups[priority]) {
        groups[priority] = []
      }
      groups[priority].push(todo)
      return groups
    }, {} as Record<Todo['priority'], Todo[]>)
    
    return Object.entries(groupedTodos).map(([priority, todos]) => (
      <div key={priority} className={`priority-group priority-${priority}`}>
        <h3>{priority.toUpperCase()} 优先级</h3>
        <ul>
          {todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)}>删除</button>
            </li>
          ))}
        </ul>
      </div>
    ))
  }
  
  return (
    <div>
      {/* 过滤控制 */}
      <div className="filters">
        {['all', 'active', 'completed'].map(filterOption => (
          <button
            key={filterOption}
            className={filter === filterOption ? 'active' : ''}
            onClick={() => setFilter(filterOption as typeof filter)}
          >
            {filterOption}
          </button>
        ))}
      </div>
      
      {/* 排序控制 */}
      <div className="sort-controls">
        <label>
          排序方式:
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="created">创建时间</option>
            <option value="priority">优先级</option>
          </select>
        </label>
      </div>
      
      {/* 列表渲染 */}
      <div className="todo-list">
        {filteredAndSortedTodos.length === 0 ? (
          <p className="empty-state">没有待办事项</p>
        ) : (
          <ul>
            {filteredAndSortedTodos.map(todo => (
              <li 
                key={todo.id} 
                className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="todo-text">{todo.text}</span>
                <span className="todo-priority">{todo.priority}</span>
                <span className="todo-date">
                  {todo.createdAt.toLocaleDateString()}
                </span>
                <button onClick={() => deleteTodo(todo.id)}>删除</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* 按优先级分组显示 */}
      <div className="grouped-view">
        <h2>按优先级分组</h2>
        {renderByPriority()}
      </div>
    </div>
  )
}
```

## 🔑 Key的重要性和最佳实践

### 1. Key的作用机制

```tsx
// ❌ 错误：使用数组索引作为key
function BadKeyExample() {
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry'])
  
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}> {/* 危险！索引作为key */}
          <input type="text" defaultValue={item} />
          <button onClick={() => removeItem(index)}>删除</button>
        </li>
      ))}
    </ul>
  )
}

// ✅ 正确：使用稳定的唯一标识符作为key
interface Item {
  id: string
  name: string
  value: string
}

function GoodKeyExample() {
  const [items, setItems] = useState<Item[]>([
    { id: 'item-1', name: 'Apple', value: '' },
    { id: 'item-2', name: 'Banana', value: '' },
    { id: 'item-3', name: 'Cherry', value: '' }
  ])
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}> {/* 使用稳定的id作为key */}
          <input type="text" defaultValue={item.name} />
          <button onClick={() => removeItem(item.id)}>删除</button>
        </li>
      ))}
    </ul>
  )
}
```

### 2. 复杂场景下的Key管理

```tsx
interface Message {
  id: string
  content: string
  timestamp: number
  edited?: boolean
}

function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])
  
  const editMessage = (id: string, newContent: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id
          ? { ...msg, content: newContent, edited: true }
          : msg
      )
    )
  }
  
  return (
    <div>
      {messages.map(message => (
        // 使用message.id作为key确保组件状态正确
        <MessageComponent
          key={message.id}
          message={message}
          onEdit={editMessage}
        />
      ))}
    </div>
  )
}

// 消息组件内部有自己的状态
function MessageComponent({ 
  message, 
  onEdit 
}: { 
  message: Message; 
  onEdit: (id: string, content: string) => void 
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  
  // 当message.id相同时，组件会保持isEditing状态
  // 这就是为什么key很重要的原因
  
  return (
    <div className="message">
      {isEditing ? (
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button onClick={() => {
            onEdit(message.id, editContent)
            setIsEditing(false)
          }}>
            保存
          </button>
        </div>
      ) : (
        <div>
          <p>{message.content}</p>
          {message.edited && <span className="edited-indicator">已编辑</span>}
          <button onClick={() => setIsEditing(true)}>编辑</button>
        </div>
      )}
    </div>
  )
}
```

## 🎨 高级渲染模式

### 1. 虚拟化长列表

```tsx
import { useMemo, useState } from 'react'

interface VirtualListProps {
  items: any[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: any, index: number) => React.ReactNode
}

function VirtualList({ items, itemHeight, containerHeight, renderItem }: VirtualListProps) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleRange = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(startIndex + visibleCount + 1, items.length)
    
    return { startIndex, endIndex, visibleCount }
  }, [scrollTop, containerHeight, itemHeight, items.length])
  
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight
  
  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {items
            .slice(visibleRange.startIndex, visibleRange.endIndex)
            .map((item, index) => (
              <div key={visibleRange.startIndex + index}>
                {renderItem(item, visibleRange.startIndex + index)}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

// 使用示例
function LargeListDemo() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random()
  }))
  
  return (
    <VirtualList
      items={items}
      itemHeight={50}
      containerHeight={400}
      renderItem={(item, index) => (
        <div style={{ height: 50, borderBottom: '1px solid #ccc', padding: 10 }}>
          {item.name} - {item.value.toFixed(2)}
        </div>
      )}
    />
  )
}
```

### 2. 条件渲染优化

```tsx
import { memo, useMemo } from 'react'

// 使用memo优化条件渲染组件
const ExpensiveComponent = memo(({ data }: { data: any }) => {
  console.log('ExpensiveComponent渲染')
  
  // 模拟昂贵的计算
  const processedData = useMemo(() => {
    return data.map((item: any) => ({
      ...item,
      processed: item.value * 2
    }))
  }, [data])
  
  return (
    <div>
      {processedData.map((item: any) => (
        <div key={item.id}>{item.processed}</div>
      ))}
    </div>
  )
})

function OptimizedConditionalRendering() {
  const [showExpensive, setShowExpensive] = useState(false)
  const [data, setData] = useState([
    { id: 1, value: 10 },
    { id: 2, value: 20 }
  ])
  const [counter, setCounter] = useState(0)
  
  return (
    <div>
      <button onClick={() => setCounter(c => c + 1)}>
        计数器: {counter}
      </button>
      
      <button onClick={() => setShowExpensive(!showExpensive)}>
        {showExpensive ? '隐藏' : '显示'}昂贵组件
      </button>
      
      {/* 只有showExpensive为true时才渲染昂贵组件 */}
      {showExpensive && <ExpensiveComponent data={data} />}
      
      {/* 使用&& 和 || 的组合进行复杂条件渲染 */}
      {(showExpensive && data.length > 0) ? (
        <div>有数据且显示</div>
      ) : (
        <div>无数据或隐藏</div>
      )}
    </div>
  )
}
```

## ⚠️ 常见陷阱和最佳实践

### 1. 避免在渲染中创建新对象

```tsx
// ❌ 错误：每次渲染都创建新的样式对象
function BadStyling() {
  return (
    <div>
      {items.map(item => (
        <div
          key={item.id}
          style={{ backgroundColor: 'red', padding: 10 }} // 每次都是新对象
        >
          {item.name}
        </div>
      ))}
    </div>
  )
}

// ✅ 正确：提取样式对象到组件外部或使用useMemo
const itemStyle = { backgroundColor: 'red', padding: 10 }

function GoodStyling() {
  const dynamicStyle = useMemo(() => ({
    backgroundColor: isActive ? 'blue' : 'gray',
    padding: 10
  }), [isActive])
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id} style={itemStyle}>
          {item.name}
        </div>
      ))}
    </div>
  )
}
```

### 2. 避免在map中进行复杂逻辑

```tsx
// ❌ 错误：在map中处理复杂逻辑
function BadLogicInMap() {
  return (
    <div>
      {items.map(item => {
        // 复杂的业务逻辑不应该在这里
        const isSpecial = item.category === 'special' && item.priority > 5
        const displayName = isSpecial 
          ? `⭐ ${item.name}` 
          : item.name
        const backgroundColor = isSpecial ? 'gold' : 'white'
        
        return (
          <div key={item.id} style={{ backgroundColor }}>
            {displayName}
          </div>
        )
      })}
    </div>
  )
}

// ✅ 正确：提取到单独的组件或函数
function ItemComponent({ item }: { item: Item }) {
  const isSpecial = item.category === 'special' && item.priority > 5
  const displayName = isSpecial ? `⭐ ${item.name}` : item.name
  const backgroundColor = isSpecial ? 'gold' : 'white'
  
  return (
    <div style={{ backgroundColor }}>
      {displayName}
    </div>
  )
}

function GoodLogicSeparation() {
  return (
    <div>
      {items.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  )
}
```

## 💡 最佳实践总结

### 1. 条件渲染
- 使用`&&`进行简单的条件渲染
- 使用三元运算符处理二选一的情况
- 复杂逻辑提取为函数或组件
- 避免深层嵌套的条件渲染

### 2. 列表渲染
- 始终提供稳定的key值
- 避免使用数组索引作为key
- 复杂列表项提取为独立组件
- 大数据量考虑虚拟化方案

### 3. 性能优化
- 使用memo优化不必要的重新渲染
- 使用useMemo缓存昂贵的计算
- 避免在渲染过程中创建新对象
- 合理拆分组件粒度

## 🎯 练习建议

1. **基础练习**: 实现各种条件渲染模式
2. **列表练习**: 实现增删改查的动态列表
3. **性能练习**: 优化大列表的渲染性能
4. **复杂场景**: 实现带过滤、排序、分页的数据列表

## 📚 延伸阅读

- [React官方文档 - 条件渲染](https://react.dev/learn/conditional-rendering)
- [React官方文档 - 列表渲染](https://react.dev/learn/rendering-lists)
- [React官方文档 - Keys的重要性](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)

---

**下一步**: 学习 [组件间通信和生命周期](./04-component-communication-lifecycle.md) 