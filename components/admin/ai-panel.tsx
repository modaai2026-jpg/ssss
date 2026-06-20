"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, X, Maximize2, Minimize2, Bot, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AIPanelProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const quickActions = [
  "生成销售报告",
  "查看待处理订单",
  "分析库存趋势",
  "创建营销活动",
]

export function AIPanel({ isOpen, onClose, onOpen }: AIPanelProps) {
  const [input, setInput] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "您好！我是您的智能助理，可以帮助您管理商店、分析数据、处理订单等。请问有什么可以帮您的？",
      timestamp: "刚刚"
    }
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: "刚刚"
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")

    // 模拟 AI 响应
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `收到您的请求："${input}"。我正在处理中，请稍候...`,
        timestamp: "刚刚"
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
  }

  // 浮动按钮（面板关闭时显示）
  if (!isOpen) {
    return (
      <Button
        onClick={onOpen}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-foreground text-background hover:bg-foreground/90 z-50"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <aside className={`${isExpanded ? "w-[420px]" : "w-[360px]"} h-full flex flex-col bg-card border-l border-border shrink-0 transition-all duration-200`}>
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center">
            <Bot className="h-5 w-5 text-background" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">智能助理</h2>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground">在线</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-foreground text-background rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className={`text-[10px] mt-2 ${
                msg.role === "user" ? "text-background/60" : "text-muted-foreground"
              }`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-t border-border shrink-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">快捷操作</p>
        <div className="flex flex-wrap gap-1.5">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-muted text-foreground hover:bg-muted/80 transition-colors border border-border"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-muted border border-border">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="输入消息..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none px-2"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="h-8 w-8 rounded-lg"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
