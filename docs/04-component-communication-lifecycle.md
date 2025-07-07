 # 组件间通信和生命周期

> 从Vue的props/emit模式到React的props/callback模式，从Vue生命周期钩子到React useEffect的完全指南

## 🎯 学习目标

- 理解React组件间通信的核心模式
- 掌握useEffect生命周期管理的使用方法
- 对比Vue的props/emit和React的props/callback通信方式
- 学会处理副作用和生命周期的清理工作

## 📖 核心概念对比

### Vue组件通信 vs React组件通信

| 特性 | Vue组件通信 | React组件通信 |
|------|-------------|---------------|
| **向下传递** | `props` | `props` |
| **向上通信** | `$emit('event', data)` | `callback函数` |
| **事件监听** | `@custom-event="handler"` | `onCustomEvent={handler}` |
| **插槽/内容** | `<slot>` | `children prop` |
| **跨组件通信** | `provide/inject` | `Context API` |
| **全局状态** | `Vuex/Pinia` | `Redux/Zustand` |

### 🎯 核心设计理念差异

#### Vue的事件驱动模式 (Event-driven)
```vue
<!-- 子组件拥有状态，通过事件通知父组件 -->
<template>
  <input v-model="localValue" @input="notifyParent" />
</template>

<script setup>
const localValue = ref('')
const emit = defineEmits(['valueChange'])

const notifyParent = () => {
  // 1. 子组件先更新自己的数据
  // 2. 然后"通知"父组件发生了变化
  emit('valueChange', localValue.value)
}
</script>
```

#### React的回调函数模式 (Callback-based)
```tsx
// 父组件拥有状态，子组件通过回调"请求"更新
interface InputProps {
  value: string
  onChange: (newValue: string) => void
}

function Input({ value, onChange }: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 直接调用父组件的函数来"请求"更新数据
    onChange(e.target.value)
  }
  
  return <input value={value} onChange={handleChange} />
}
```

### 设计理念对比

设计理念分析
1. 数据所有权
Vue: 子组件可以拥有自己的状态，通过事件通知父组件
React: 数据通常由父组件拥有，子组件只是"展示"数据
2. 数据流方向
Vue: 双向数据流感觉更自然（v-model、emit）
React: 严格的单向数据流（数据向下，事件向上）
3. 编程范式
Vue: 面向对象 + 事件驱动，更接近传统的GUI编程
React: 函数式编程，数据和行为分离

| 方面 | Vue事件模式 | React回调模式 |
|------|-------------|---------------|
| **数据所有权** | 子组件可以拥有状态 | 状态通常在父组件 |
| **数据流感觉** | 双向数据流更自然 | 严格单向数据流 |
| **编程范式** | 面向对象+事件驱动 | 函数式编程 |
| **状态管理** | 分散式，组件各自管理 | 集中式，状态提升 |
| **调试体验** | 事件可能跳跃式传播 | 数据流清晰可追踪 |
| **代码组织** | 更接近传统GUI编程 | 数据和行为分离 |

**优势分析:**
- ✅ **Vue事件模式**: 更符合直觉，组件独立性强，双向绑定方便
- ✅ **React回调模式**: 数据流清晰，状态可预测，函数式编程优雅
- ❌ **Vue事件模式**: 大型应用中事件传播可能复杂
- ❌ **React回调模式**: 需要状态提升，组件耦合度相对较高

### Vue生命周期 vs React生命周期

| Vue生命周期钩子 | React useEffect等价 | 说明 |
|-----------------|-------------------|------|
| `beforeCreate` | 无直接等价 | 组件实例化前 |
| `created` | `useState初始化` | 组件实例创建后 |
| `beforeMount` | 无直接等价 | 挂载前 |
| `mounted` | `useEffect(fn, [])` | 挂载后，只执行一次 |
| `beforeUpdate` | 无直接等价 | 更新前 |
| `updated` | `useEffect(fn)` | 每次更新后 |
| `beforeDestroy` | `useEffect返回函数` | 卸载前清理 |
| `destroyed` | `useEffect返回函数` | 卸载后清理 |
| `watch` | `useEffect(fn, [deps])` | 监听特定值变化 |

## 🔄 组件间通信对比

### 1. 父子组件通信

**Vue父子组件通信:**
```vue
<!-- 父组件 -->
<template>
  <div>
    <h2>父组件</h2>
    <p>子组件传来的消息: {{ messageFromChild }}</p>
    
    <!-- 向子组件传递props，监听子组件事件 -->
    <ChildComponent 
      :user-name="userName"
      :count="count"
      @increment="handleIncrement"
      @message-change="handleMessageChange"
      @custom-event="handleCustomEvent"
    />
    
    <button @click="updateUserName">更新用户名</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const userName = ref('Vue开发者')
const count = ref(0)
const messageFromChild = ref('')

const handleIncrement = () => {
  count.value++
}

const handleMessageChange = (newMessage: string) => {
  messageFromChild.value = newMessage
}

const handleCustomEvent = (data: any) => {
  console.log('收到自定义事件:', data)
}

const updateUserName = () => {
  userName.value = '更新后的用户名'
}
</script>
```

```vue
<!-- 子组件 -->
<template>
  <div class="child-component">
    <h3>子组件</h3>
    <p>接收到的用户名: {{ userName }}</p>
    <p>接收到的计数: {{ count }}</p>
    
    <button @click="incrementCount">增加计数</button>
    
    <input 
      v-model="localMessage" 
      @input="sendMessage"
      placeholder="发送消息给父组件"
    />
    
    <button @click="sendCustomEvent">发送自定义事件</button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

// 定义props类型
interface Props {
  userName: string
  count: number
}

const props = defineProps<Props>()

// 定义emits类型
const emit = defineEmits<{
  increment: []
  messageChange: [message: string]
  customEvent: [data: { type: string; payload: any }]
}>()

const localMessage = ref('')

const incrementCount = () => {
  emit('increment')
}

const sendMessage = () => {
  emit('messageChange', localMessage.value)
}

const sendCustomEvent = () => {
  emit('customEvent', {
    type: 'user-action',
    payload: { timestamp: Date.now(), action: 'button-click' }
  })
}
</script>
```

**React父子组件通信:**
```tsx
// 父组件
import { useState } from 'react'

interface ChildComponentProps {
  userName: string
  count: number
  onIncrement: () => void
  onMessageChange: (message: string) => void
  onCustomEvent: (data: { type: string; payload: any }) => void
}

export default function ParentComponent() {
  const [userName, setUserName] = useState('React开发者')
  const [count, setCount] = useState(0)
  const [messageFromChild, setMessageFromChild] = useState('')
  
  const handleIncrement = () => {
    setCount(prev => prev + 1)
  }
  
  const handleMessageChange = (newMessage: string) => {
    setMessageFromChild(newMessage)
  }
  
  const handleCustomEvent = (data: any) => {
    console.log('收到自定义事件:', data)
  }
  
  const updateUserName = () => {
    setUserName('更新后的用户名')
  }
  
  return (
    <div>
      <h2>父组件</h2>
      <p>子组件传来的消息: {messageFromChild}</p>
      
      {/* 向子组件传递props和回调函数 */}
      <ChildComponent
        userName={userName}
        count={count}
        onIncrement={handleIncrement}
        onMessageChange={handleMessageChange}
        onCustomEvent={handleCustomEvent}
      />
      
      <button onClick={updateUserName}>更新用户名</button>
    </div>
  )
}

// 子组件
function ChildComponent({
  userName,
  count,
  onIncrement,
  onMessageChange,
  onCustomEvent
}: ChildComponentProps) {
  const [localMessage, setLocalMessage] = useState('')
  
  const incrementCount = () => {
    onIncrement()
  }
  
  const sendMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const message = e.target.value
    setLocalMessage(message)
    onMessageChange(message)
  }
  
  const sendCustomEvent = () => {
    onCustomEvent({
      type: 'user-action',
      payload: { timestamp: Date.now(), action: 'button-click' }
    })
  }
  
  return (
    <div className="child-component">
      <h3>子组件</h3>
      <p>接收到的用户名: {userName}</p>
      <p>接收到的计数: {count}</p>
      
      <button onClick={incrementCount}>增加计数</button>
      
      <input
        value={localMessage}
        onChange={sendMessage}
        placeholder="发送消息给父组件"
      />
      
      <button onClick={sendCustomEvent}>发送自定义事件</button>
    </div>
  )
}
```

### 2. 兄弟组件通信

**Vue兄弟组件通信（通过父组件）:**
```vue
<!-- 父组件协调兄弟组件通信 -->
<template>
  <div>
    <SiblingA @data-change="handleDataFromA" />
    <SiblingB :data-from-a="dataFromA" @data-change="handleDataFromB" />
    <SiblingC :data-from-b="dataFromB" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dataFromA = ref('')
const dataFromB = ref('')

const handleDataFromA = (data: string) => {
  dataFromA.value = data
}

const handleDataFromB = (data: string) => {
  dataFromB.value = data
}
</script>
```

**React兄弟组件通信（通过父组件状态提升）:**
```tsx
export default function SiblingCommunicationDemo() {
  const [dataFromA, setDataFromA] = useState('')
  const [dataFromB, setDataFromB] = useState('')
  
  return (
    <div>
      <SiblingA onDataChange={setDataFromA} />
      <SiblingB 
        dataFromA={dataFromA} 
        onDataChange={setDataFromB} 
      />
      <SiblingC dataFromB={dataFromB} />
    </div>
  )
}

function SiblingA({ onDataChange }: { onDataChange: (data: string) => void }) {
  const [inputValue, setInputValue] = useState('')
  
  const handleSubmit = () => {
    onDataChange(inputValue)
  }
  
  return (
    <div>
      <h3>组件A</h3>
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSubmit}>发送给B</button>
    </div>
  )
}

function SiblingB({ 
  dataFromA, 
  onDataChange 
}: { 
  dataFromA: string
  onDataChange: (data: string) => void 
}) {
  const processedData = `处理后的数据: ${dataFromA}`
  
  const sendToC = () => {
    onDataChange(processedData)
  }
  
  return (
    <div>
      <h3>组件B</h3>
      <p>从A收到: {dataFromA}</p>
      <button onClick={sendToC}>处理后发送给C</button>
    </div>
  )
}

function SiblingC({ dataFromB }: { dataFromB: string }) {
  return (
    <div>
      <h3>组件C</h3>
      <p>从B收到: {dataFromB}</p>
    </div>
  )
}
```

## 🔄 生命周期和副作用管理

### 1. 组件挂载和卸载

**Vue生命周期:**
```vue
<template>
  <div>
    <h3>{{ title }}</h3>
    <p>计数: {{ count }}</p>
    <p>时间: {{ currentTime }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUpdated, watch } from 'vue'

const title = ref('Vue组件')
const count = ref(0)
const currentTime = ref(new Date().toLocaleString())
let timer: number | null = null

// 组件挂载后
onMounted(() => {
  console.log('Vue组件已挂载')
  document.title = title.value
  
  // 启动定时器
  timer = setInterval(() => {
    currentTime.value = new Date().toLocaleString()
  }, 1000)
  
  // 模拟API调用
  fetchData()
})

// 组件更新后
onUpdated(() => {
  console.log('Vue组件已更新')
})

// 组件卸载前
onBeforeUnmount(() => {
  console.log('Vue组件即将卸载')
  if (timer) {
    clearInterval(timer)
  }
  document.title = 'Vue应用'
})

// 监听特定数据变化
watch(count, (newCount, oldCount) => {
  console.log(`count从${oldCount}变为${newCount}`)
  document.title = `${title.value} - ${newCount}`
})

const fetchData = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('数据加载完成')
  } catch (error) {
    console.error('数据加载失败:', error)
  }
}
</script>
```

**React useEffect:**
```tsx
import { useState, useEffect } from 'react'

export default function ReactLifecycleDemo() {
  const [title] = useState('React组件')
  const [count, setCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString())
  
  // 相当于Vue的onMounted（只执行一次）
  useEffect(() => {
    console.log('React组件已挂载')
    document.title = title
    
    // 启动定时器
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString())
    }, 1000)
    
    // 模拟API调用
    fetchData()
    
    // 清理函数 - 相当于Vue的onBeforeUnmount
    return () => {
      console.log('React组件即将卸载')
      clearInterval(timer)
      document.title = 'React应用'
    }
  }, [title]) // 依赖数组，只有title变化时才重新执行
  
  // 相当于Vue的watch（监听count变化）
  useEffect(() => {
    console.log(`count变为${count}`)
    document.title = `${title} - ${count}`
  }, [count, title]) // 依赖count和title
  
  // 相当于Vue的onUpdated（每次渲染后都执行）
  useEffect(() => {
    console.log('React组件已更新')
  })
  
  const fetchData = async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('数据加载完成')
    } catch (error) {
      console.error('数据加载失败:', error)
    }
  }
  
  return (
    <div>
      <h3>{title}</h3>
      <p>计数: {count}</p>
      <p>时间: {currentTime}</p>
      <button onClick={() => setCount(c => c + 1)}>增加计数</button>
    </div>
  )
}
```

### 2. 复杂副作用管理

**数据获取和错误处理:**
```tsx
import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
}

interface ApiResponse {
  data: User[]
  status: 'success' | 'error'
  message?: string
}

export default function DataFetchingComponent() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  
  // 数据获取副作用
  useEffect(() => {
    let isCancelled = false // 防止组件卸载后仍然设置状态
    
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/users?page=${page}`)
        const data: ApiResponse = await response.json()
        
        // 检查组件是否已卸载
        if (!isCancelled) {
          if (data.status === 'success') {
            setUsers(data.data)
          } else {
            setError(data.message || '获取用户失败')
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : '网络错误')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchUsers()
    
    // 清理函数
    return () => {
      isCancelled = true
    }
  }, [page]) // 依赖page，页码变化时重新获取数据
  
  // 键盘事件监听
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r' && event.ctrlKey) {
        event.preventDefault()
        setPage(1) // 刷新数据
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])
  
  // 窗口大小变化监听
  useEffect(() => {
    const handleResize = () => {
      console.log('窗口大小变化:', window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>
  
  return (
    <div>
      <h2>用户列表</h2>
      <div>
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          上一页
        </button>
        <span>第 {page} 页</span>
        <button onClick={() => setPage(p => p + 1)}>
          下一页
        </button>
      </div>
      
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
      
      <p>提示: 按 Ctrl+R 刷新数据</p>
    </div>
  )
}
```

### 3. 自定义Hook封装副作用

**封装数据获取逻辑:**
```tsx
// 自定义Hook - useApi
function useApi<T>(url: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    let isCancelled = false
    
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(url)
        const result = await response.json()
        
        if (!isCancelled) {
          setData(result)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : '请求失败')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }
    
    fetchData()
    
    return () => {
      isCancelled = true
    }
  }, [url, ...dependencies])
  
  return { data, loading, error }
}

// 自定义Hook - useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('读取localStorage失败:', error)
      return initialValue
    }
  })
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('写入localStorage失败:', error)
    }
  }
  
  return [storedValue, setValue] as const
}

// 使用自定义Hook
export default function CustomHookExample() {
  const { data: users, loading, error } = useApi<User[]>('/api/users')
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    theme: 'light',
    language: 'zh-CN'
  })
  
  return (
    <div>
      <h2>用户列表</h2>
      
      <div>
        <label>
          主题:
          <select 
            value={preferences.theme}
            onChange={(e) => setPreferences({
              ...preferences,
              theme: e.target.value
            })}
          >
            <option value="light">浅色</option>
            <option value="dark">深色</option>
          </select>
        </label>
      </div>
      
      {loading && <div>加载中...</div>}
      {error && <div>错误: {error}</div>}
      {users && (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## 🎛️ 高级组件通信模式

### 1. Context API跨组件通信

```tsx
import { createContext, useContext, useState, ReactNode } from 'react'

// 创建Context
interface UserContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider组件
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }
  
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }
  
  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }
  
  return (
    <UserContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  )
}

// 自定义Hook使用Context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser必须在UserProvider内部使用')
  }
  return context
}

// 使用Context的组件
function Header() {
  const { user, logout } = useUser()
  
  return (
    <header>
      {user ? (
        <div>
          <span>欢迎, {user.name}</span>
          <button onClick={logout}>退出</button>
        </div>
      ) : (
        <span>请登录</span>
      )}
    </header>
  )
}

function Profile() {
  const { user, updateProfile } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  
  const handleSave = () => {
    updateProfile({ name })
    setIsEditing(false)
  }
  
  if (!user) return <div>请先登录</div>
  
  return (
    <div>
      <h2>个人资料</h2>
      {isEditing ? (
        <div>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleSave}>保存</button>
          <button onClick={() => setIsEditing(false)}>取消</button>
        </div>
      ) : (
        <div>
          <p>姓名: {user.name}</p>
          <button onClick={() => setIsEditing(true)}>编辑</button>
        </div>
      )}
    </div>
  )
}
```

### 2. 高阶组件和组件组合

**高阶组件模式:**
```tsx
// 高阶组件 - 添加加载状态
function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  loadingMessage = '加载中...'
) {
  return function WithLoadingComponent(props: P & { isLoading: boolean }) {
    const { isLoading, ...rest } = props
    
    if (isLoading) {
      return <div className="loading">{loadingMessage}</div>
    }
    
    return <Component {...(rest as P)} />
  }
}

// 高阶组件 - 添加错误边界
function withErrorBoundary<P extends object>(Component: React.ComponentType<P>) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// 使用高阶组件
const UserListWithLoading = withLoading(UserList, '正在加载用户数据...')
const SafeUserList = withErrorBoundary(UserListWithLoading)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  
  return (
    <SafeUserList 
      isLoading={isLoading}
      users={users}
    />
  )
}
```

**组件组合模式:**
```tsx
// 复合组件模式
interface CardProps {
  children: ReactNode
  className?: string
}

interface CardHeaderProps {
  children: ReactNode
}

interface CardBodyProps {
  children: ReactNode
}

interface CardFooterProps {
  children: ReactNode
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ children }: CardHeaderProps) {
  return <div className="card-header">{children}</div>
}

function CardBody({ children }: CardBodyProps) {
  return <div className="card-body">{children}</div>
}

function CardFooter({ children }: CardFooterProps) {
  return <div className="card-footer">{children}</div>
}

// 组合使用
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card

// 使用复合组件
function UserProfile({ user }: { user: User }) {
  return (
    <Card className="user-profile">
      <Card.Header>
        <h2>{user.name}</h2>
      </Card.Header>
      <Card.Body>
        <p>邮箱: {user.email}</p>
        <p>角色: {user.role}</p>
      </Card.Body>
      <Card.Footer>
        <button>编辑</button>
        <button>删除</button>
      </Card.Footer>
    </Card>
  )
}
```

## ⚠️ 常见陷阱和最佳实践

### 1. useEffect依赖数组陷阱

```tsx
// ❌ 错误：遗漏依赖
function BadDependencyExample() {
  const [count, setCount] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  
  useEffect(() => {
    const result = count * multiplier
    console.log('计算结果:', result)
  }, [count]) // 遗漏了multiplier依赖
  
  return <div>...</div>
}

// ✅ 正确：包含所有依赖
function GoodDependencyExample() {
  const [count, setCount] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  
  useEffect(() => {
    const result = count * multiplier
    console.log('计算结果:', result)
  }, [count, multiplier]) // 包含所有依赖
  
  return <div>...</div>
}

// ✅ 使用useCallback稳定函数引用
function CallbackExample() {
  const [count, setCount] = useState(0)
  
  const expensiveFunction = useCallback(() => {
    return count * 2
  }, [count])
  
  useEffect(() => {
    const result = expensiveFunction()
    console.log('结果:', result)
  }, [expensiveFunction]) // expensiveFunction是稳定的引用
  
  return <div>...</div>
}
```

### 2. 内存泄漏防范

```tsx
// ✅ 正确的副作用清理
function ProperCleanupExample() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    let isCancelled = false
    
    const subscription = someDataStream.subscribe(newData => {
      if (!isCancelled) {
        setData(newData)
      }
    })
    
    const timer = setInterval(() => {
      if (!isCancelled) {
        console.log('定时任务执行')
      }
    }, 1000)
    
    // 清理函数
    return () => {
      isCancelled = true
      subscription.unsubscribe()
      clearInterval(timer)
    }
  }, [])
  
  return <div>...</div>
}
```

## 💡 最佳实践总结

### 1. 组件通信
- 优先使用props向下传递数据
- 使用回调函数向上通信
- 避免过深的props传递，考虑使用Context
- 合理使用状态提升集中管理相关状态

### 2. 生命周期管理
- 始终在useEffect中处理副作用
- 正确设置依赖数组避免无限循环
- 及时清理订阅、定时器等资源
- 使用自定义Hook封装复杂逻辑

### 3. 性能优化
- 使用useCallback和useMemo缓存函数和值
- 避免在渲染过程中创建新对象
- 合理拆分组件减少重新渲染范围
- 使用React.memo优化函数组件

## 🎯 练习建议

1. **基础练习**: 实现父子组件、兄弟组件通信
2. **生命周期练习**: 处理数据获取、事件监听、定时器
3. **高级模式练习**: 实现Context、自定义Hook、高阶组件
4. **性能优化练习**: 使用各种优化技术提升应用性能

## 📚 延伸阅读

- [React官方文档 - useEffect](https://react.dev/reference/react/useEffect)
- [React官方文档 - Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React官方文档 - 自定义Hook](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

**下一步**: 学习 [Next.js路由系统](./05-nextjs-routing-system.md)