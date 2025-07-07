# React状态管理

> 从Vue响应式系统到React useState Hook的完全指南

## 🎯 学习目标

- 理解React状态管理的基本概念和工作原理
- 掌握useState Hook的使用方法和最佳实践
- 对比Vue的响应式系统和React状态管理的差异
- 学会处理复杂状态和状态提升

## 📖 核心概念对比

### Vue响应式系统 vs React状态管理

| 特性 | Vue响应式系统 | React状态管理 |
|------|---------------|---------------|
| **数据声明** | `ref()`, `reactive()` | `useState()` |
| **数据修改** | 直接赋值 `count.value++` | 调用setter `setCount(count + 1)` |
| **响应性** | 自动追踪依赖，自动更新 | 手动调用setter触发重新渲染 |
| **数据类型** | 支持任意类型的响应式 | 每个状态独立管理 |
| **计算属性** | `computed()` | `useMemo()` |
| **监听器** | `watch()`, `watchEffect()` | `useEffect()` |

## 🔄 基础状态管理对比

### 1. 简单状态声明和更新

**Vue Composition API:**
```vue
<template>
  <div>
    <p>计数：{{ count }}</p>
    <button @click="increment">增加</button>
    <button @click="decrement">减少</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++ // 直接修改，自动触发更新
}

const decrement = () => {
  count.value--
}

const reset = () => {
  count.value = 0
}
</script>
```

**React useState:**
```tsx
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  const increment = () => {
    setCount(count + 1) // 调用setter函数
  }
  
  const decrement = () => {
    setCount(count - 1)
  }
  
  const reset = () => {
    setCount(0)
  }
  
  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={increment}>增加</button>
      <button onClick={decrement}>减少</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

### 2. 对象状态管理

**Vue响应式对象:**
```vue
<template>
  <div>
    <h2>{{ user.name }}</h2>
    <p>年龄：{{ user.age }}</p>
    <p>邮箱：{{ user.email }}</p>
    <button @click="updateAge">增加年龄</button>
    <button @click="updateEmail">更新邮箱</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface User {
  name: string
  age: number
  email: string
}

const user = reactive<User>({
  name: '张三',
  age: 25,
  email: 'zhang@example.com'
})

const updateAge = () => {
  user.age++ // 直接修改对象属性
}

const updateEmail = () => {
  user.email = 'newemail@example.com'
}
</script>
```

**React对象状态:**
```tsx
import { useState } from 'react'

interface User {
  name: string
  age: number
  email: string
}

export default function UserProfile() {
  const [user, setUser] = useState<User>({
    name: '张三',
    age: 25,
    email: 'zhang@example.com'
  })
  
  const updateAge = () => {
    setUser({
      ...user,        // 展开现有属性
      age: user.age + 1  // 更新特定属性
    })
  }
  
  const updateEmail = () => {
    setUser(prevUser => ({
      ...prevUser,
      email: 'newemail@example.com'
    }))
  }
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>年龄：{user.age}</p>
      <p>邮箱：{user.email}</p>
      <button onClick={updateAge}>增加年龄</button>
      <button onClick={updateEmail}>更新邮箱</button>
    </div>
  )
}
```

## 🧠 状态更新模式

### 1. 函数式更新

```tsx
export default function CounterPatterns() {
  const [count, setCount] = useState(0)
  
  // ❌ 错误：直接使用当前值（可能导致并发问题）
  const badIncrement = () => {
    setCount(count + 1)
    setCount(count + 1) // 这里count还是旧值，结果只增加1
  }
  
  // ✅ 正确：使用函数式更新
  const goodIncrement = () => {
    setCount(prev => prev + 1)
    setCount(prev => prev + 1) // 这里会正确增加2
  }
  
  // ✅ 复杂对象的函数式更新
  const [user, setUser] = useState({ name: '张三', age: 25 })
  
  const updateUserAge = () => {
    setUser(prevUser => ({
      ...prevUser,
      age: prevUser.age + 1
    }))
  }
  
  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={goodIncrement}>正确的增加</button>
      <button onClick={updateUserAge}>增加年龄</button>
    </div>
  )
}
```

### 2. 数组状态管理

**Vue数组操作:**
```vue
<template>
  <div>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
        <button @click="removeItem(item.id)">删除</button>
      </li>
    </ul>
    <button @click="addItem">添加项目</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Item {
  id: number
  name: string
}

const items = ref<Item[]>([
  { id: 1, name: '项目1' },
  { id: 2, name: '项目2' }
])

const addItem = () => {
  items.value.push({ // 直接修改数组
    id: Date.now(),
    name: `项目${items.value.length + 1}`
  })
}

const removeItem = (id: number) => {
  const index = items.value.findIndex(item => item.id === id)
  items.value.splice(index, 1) // 直接修改数组
}
</script>
```

**React数组状态:**
```tsx
import { useState } from 'react'

interface Item {
  id: number
  name: string
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: '项目1' },
    { id: 2, name: '项目2' }
  ])
  
  const addItem = () => {
    setItems(prevItems => [
      ...prevItems, // 展开现有数组
      {
        id: Date.now(),
        name: `项目${prevItems.length + 1}`
      }
    ])
  }
  
  const removeItem = (id: number) => {
    setItems(prevItems => 
      prevItems.filter(item => item.id !== id) // 返回新数组
    )
  }
  
  const updateItem = (id: number, newName: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id 
          ? { ...item, name: newName } // 更新特定项目
          : item
      )
    )
  }
  
  return (
    <div>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => removeItem(item.id)}>删除</button>
            <button onClick={() => updateItem(item.id, `更新的${item.name}`)}>
              更新
            </button>
          </li>
        ))}
      </ul>
      <button onClick={addItem}>添加项目</button>
    </div>
  )
}
```

## 🎛️ 复杂状态管理模式

### 1. 多个相关状态

```tsx
export default function FormDemo() {
  // ❌ 不推荐：分散的状态管理
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState(0)
  
  // ✅ 推荐：统一的对象状态
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: 0
  })
  
  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  return (
    <form>
      <input
        value={formData.firstName}
        onChange={(e) => updateField('firstName', e.target.value)}
        placeholder="名"
      />
      <input
        value={formData.lastName}
        onChange={(e) => updateField('lastName', e.target.value)}
        placeholder="姓"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder="邮箱"
      />
      <input
        type="number"
        value={formData.age}
        onChange={(e) => updateField('age', parseInt(e.target.value))}
        placeholder="年龄"
      />
    </form>
  )
}
```

### 2. 状态提升（Lifting State Up）

**父组件管理状态:**
```tsx
interface Todo {
  id: number
  text: string
  completed: boolean
}

// 父组件
export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  
  const addTodo = (text: string) => {
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text, completed: false }
    ])
  }
  
  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })
  
  return (
    <div>
      <TodoInput onAddTodo={addTodo} />
      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
      <TodoList todos={filteredTodos} onToggleTodo={toggleTodo} />
    </div>
  )
}

// 子组件：待办输入
interface TodoInputProps {
  onAddTodo: (text: string) => void
}

function TodoInput({ onAddTodo }: TodoInputProps) {
  const [inputValue, setInputValue] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim())
      setInputValue('')
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="添加待办事项"
      />
      <button type="submit">添加</button>
    </form>
  )
}

// 子组件：待办列表
interface TodoListProps {
  todos: Todo[]
  onToggleTodo: (id: number) => void
}

function TodoList({ todos, onToggleTodo }: TodoListProps) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggleTodo(todo.id)}
          />
          <span style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none' 
          }}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  )
}
```

## 🔄 计算值和副作用

### 1. 计算属性对比

**Vue计算属性:**
```vue
<template>
  <div>
    <p>全名：{{ fullName }}</p>
    <p>购物车总价：￥{{ totalPrice }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')
const items = ref([
  { name: '商品1', price: 100, quantity: 2 },
  { name: '商品2', price: 200, quantity: 1 }
])

// 自动缓存，依赖变化时重新计算
const fullName = computed(() => firstName.value + lastName.value)
const totalPrice = computed(() => 
  items.value.reduce((total, item) => total + item.price * item.quantity, 0)
)
</script>
```

**React useMemo:**
```tsx
import { useState, useMemo } from 'react'

interface CartItem {
  name: string
  price: number
  quantity: number
}

export default function ShoppingCart() {
  const [firstName, setFirstName] = useState('张')
  const [lastName, setLastName] = useState('三')
  const [items, setItems] = useState<CartItem[]>([
    { name: '商品1', price: 100, quantity: 2 },
    { name: '商品2', price: 200, quantity: 1 }
  ])
  
  // 使用useMemo缓存计算结果
  const fullName = useMemo(() => {
    console.log('计算全名') // 只有依赖变化时才会执行
    return firstName + lastName
  }, [firstName, lastName])
  
  const totalPrice = useMemo(() => {
    console.log('计算总价')
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [items])
  
  return (
    <div>
      <p>全名：{fullName}</p>
      <p>购物车总价：￥{totalPrice}</p>
      <button onClick={() => setFirstName('李')}>改名</button>
    </div>
  )
}
```

## ⚠️ 常见陷阱和最佳实践

### 1. 状态更新的异步性

```tsx
export default function AsyncStateDemo() {
  const [count, setCount] = useState(0)
  
  // ❌ 错误：期望立即读取更新后的值
  const badUpdate = () => {
    setCount(count + 1)
    console.log(count) // 仍然是旧值！
  }
  
  // ✅ 正确：使用useEffect监听状态变化
  useEffect(() => {
    console.log('count更新了:', count)
  }, [count])
  
  // ✅ 正确：如果需要基于新值进行操作
  const goodUpdate = () => {
    const newCount = count + 1
    setCount(newCount)
    console.log('即将设置为:', newCount)
  }
  
  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={goodUpdate}>正确更新</button>
    </div>
  )
}
```

### 2. 对象和数组的不可变更新

```tsx
export default function ImmutableUpdates() {
  const [user, setUser] = useState({
    name: '张三',
    address: {
      city: '北京',
      street: '长安街'
    },
    hobbies: ['读书', '游泳']
  })
  
  // ❌ 错误：直接修改对象
  const badUpdateCity = () => {
    user.address.city = '上海' // 直接修改，不会触发重新渲染
    setUser(user)
  }
  
  // ✅ 正确：深层对象的不可变更新
  const goodUpdateCity = () => {
    setUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        city: '上海'
      }
    }))
  }
  
  // ✅ 正确：数组的不可变更新
  const addHobby = () => {
    setUser(prev => ({
      ...prev,
      hobbies: [...prev.hobbies, '绘画']
    }))
  }
  
  const removeHobby = (hobby: string) => {
    setUser(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobby)
    }))
  }
  
  return (
    <div>
      <h3>{user.name}</h3>
      <p>城市：{user.address.city}</p>
      <p>爱好：{user.hobbies.join(', ')}</p>
      <button onClick={goodUpdateCity}>迁移到上海</button>
      <button onClick={addHobby}>添加爱好</button>
    </div>
  )
}
```

### 3. 状态初始化性能优化

```tsx
// ❌ 每次渲染都会执行昂贵的计算
const badExample = () => {
  const [data, setData] = useState(expensiveComputation())
  // ...
}

// ✅ 使用懒初始化，只计算一次
const goodExample = () => {
  const [data, setData] = useState(() => expensiveComputation())
  // ...
}

function expensiveComputation() {
  console.log('执行昂贵的计算...')
  return { value: Math.random() * 1000 }
}
```

## 🎯 实际应用场景

### 购物车状态管理示例

```tsx
interface Product {
  id: number
  name: string
  price: number
}

interface CartItem extends Product {
  quantity: number
}

export default function ShoppingCartApp() {
  const [cart, setCart] = useState<CartItem[]>([])
  
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prev, { ...product, quantity: 1 }]
    })
  }
  
  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }
  
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }
  
  const totalPrice = useMemo(() =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  )
  
  const totalItems = useMemo(() =>
    cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  )
  
  return (
    <div>
      <h2>购物车 ({totalItems} 件商品)</h2>
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <span>￥{item.price}</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            min="1"
          />
          <button onClick={() => removeFromCart(item.id)}>删除</button>
        </div>
      ))}
      <div className="total">
        总价：￥{totalPrice}
      </div>
    </div>
  )
}
```

## 💡 最佳实践总结

### 1. 状态结构设计
- 保持状态扁平化，避免深层嵌套
- 相关的状态放在一起管理
- 避免冗余状态，优先使用计算值

### 2. 状态更新原则
- 始终使用不可变更新模式
- 复杂更新使用函数式setter
- 避免在渲染过程中调用setter

### 3. 性能优化
- 使用useMemo缓存昂贵的计算
- 合理拆分组件避免不必要的重新渲染
- 使用懒初始化避免重复计算

## 🎯 练习建议

1. **基础练习**: 实现计数器、表单输入等简单状态管理
2. **进阶练习**: 实现购物车、待办列表等复杂状态管理
3. **优化练习**: 使用useMemo和useCallback优化性能
4. **架构练习**: 练习状态提升和组件间通信

## 📚 延伸阅读

- [React官方文档 - State](https://react.dev/learn/state-a-components-memory)
- [React官方文档 - useState](https://react.dev/reference/react/useState)
- [React官方文档 - useMemo](https://react.dev/reference/react/useMemo)

---

**下一步**: 学习 [条件渲染和列表渲染](./03-conditional-and-list-rendering.md) 