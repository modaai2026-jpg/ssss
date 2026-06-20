"use client"

import { useState } from "react"
import { Bot, Search, Plus, MoreHorizontal, Zap, MessageSquare, Clock, Settings, Play, Pause, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockAgents } from "@/lib/data"

export function AgentsView() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAgents = mockAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "idle": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "offline": return "bg-muted text-muted-foreground border-border"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "运行中"
      case "idle": return "空闲"
      case "offline": return "离线"
      default: return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "customer_service": return <MessageSquare className="h-4 w-4" />
      case "sales": return <Zap className="h-4 w-4" />
      case "analytics": return <Activity className="h-4 w-4" />
      default: return <Bot className="h-4 w-4" />
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "customer_service": return "客服助手"
      case "sales": return "销售助手"
      case "analytics": return "数据分析"
      default: return "通用助手"
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground">智能体</h1>
              <p className="text-sm text-muted-foreground mt-0.5">AI 助手管理与配置</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              创建智能体
            </Button>
          </div>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索智能体..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="group bg-card border border-border rounded-xl p-5 hover:border-foreground/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/10 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{agent.name}</h3>
                      <Badge variant="outline" className={getStatusColor(agent.status)}>
                        {getStatusText(agent.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs gap-1">
                        {getTypeIcon(agent.type)}
                        {getTypeName(agent.type)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {agent.status === "active" ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:text-amber-600">
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:text-emerald-600">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        配置
                      </DropdownMenuItem>
                      <DropdownMenuItem>查看日志</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">删除</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {agent.description}
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">资源使用</span>
                    <span className="text-foreground font-medium">{agent.resourceUsage}%</span>
                  </div>
                  <Progress value={agent.resourceUsage} className="h-1.5" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <MessageSquare className="h-3 w-3" />
                      <span className="text-xs">对话数</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{agent.conversationsCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Zap className="h-3 w-3" />
                      <span className="text-xs">响应率</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{agent.responseRate}%</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">平均响应</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{agent.avgResponseTime}s</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
