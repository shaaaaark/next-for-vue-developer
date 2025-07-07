import Image from "next/image";

export default function Home() {
  const title = "从Vue到Next.js的学习之旅";
  const subtitle = "Hello, Vue开发者！";
  const currentDate = new Date().toLocaleDateString('zh-CN');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
        {title}
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {subtitle}
        </h2>
        
        <p className="text-gray-600 mb-4">
          今天是 {currentDate}，让我们开始学习React和Next.js吧！
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">💡 第一个重要概念：JSX</h3>
          <p className="text-blue-700">
            注意看这个页面的代码，我们直接在JavaScript中写HTML，这就是JSX！
            不像Vue需要 &lt;template&gt; 标签。
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Vue中你熟悉的：</h4>
            <ul className="text-green-700 space-y-1">
              <li>• &lt;template&gt; 标签</li>
              <li>• {`{{ variable }}`} 插值语法</li>
              <li>• v-if, v-for 指令</li>
              <li>• data() 函数返回数据</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">React中的对应概念：</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• JSX 直接写HTML</li>
              <li>• {`{variable}`} 花括号插值</li>
              <li>• JavaScript表达式控制</li>
              <li>• const 变量直接定义</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          准备好了吗？让我们逐步探索React和Next.js的世界！
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          开始学习第一个概念
        </button>
      </div>
    </div>
  );
}
