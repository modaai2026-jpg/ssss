"use client"

import { useState } from "react"
import { Megaphone, Search, Plus, MoreHorizontal, Mail, MessageSquare, TrendingUp, Users, Eye, MousePointer, Calendar, Target, Zap, BarChart3 } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const campaigns = [
  {
    id: "1",
    name: "新年大促销",
    type: "email",
    status: "active",
    budget: 50000,
    spent: 35000,
    reach: 125000,
    clicks: 8500,
    conversions: 420,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
  },
  {
    id: "2",
    name: "会员专享优惠",
    type: "sms",
    status: "scheduled",
    budget: 20000,
    spent: 0,
    reach: 0,
    clicks: 0,
    conversions: 0,
    startDate: "2024-02-01",
    endDate: "2024-02-28",
  },
  {
    id: "3",
    name: "春季新品发布",
    type: "push",
    status: "draft",
    budget: 30000,
    spent: 0,
    reach: 0,
    clicks: 0,
    conversions: 0,
    startDate: "2024-03-01",
    endDate: "2024-03-31",
  },
  {
    id: "4",
    name: "双十一预热",
    type: "email",
    status: "completed",
    budget: 100000,
    spent: 98000,
    reach: 500000,
    clicks: 45000,
    conversions: 2800,
    startDate: "2023-11-01",
    endDate: "2023-11-11",
  },
]

export function MarketingView() {
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "scheduled": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "draft": return "bg-muted text-muted-foreground border-border"
      case "completed": return "bg-foreground/10 text-foreground border-foreground/20"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "进行中"
      case "scheduled": return "已计划"
      case "draft": return "草稿"
      case "completed": return "已完成"
      default: return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />
      case "sms": return <MessageSquare className="h-4 w-4" />
      case "push": return <Zap className="h-4 w-4" />
      default: return <Megaphone className="h-4 w-4" />
    }
  }

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground">市场营销</h1>
              <p className="text-sm text-muted-foreground mt-0.5">管理营销活动和推广计划</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              创建活动
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="h-4 w-4" />
              <span className="text-sm">活跃活动</span>
            </div>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-emerald-500 mt-1">+3 本周</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">总触达</span>
            </div>
            <p className="text-2xl font-bold text-foreground">2.5M</p>
            <p className="text-xs text-emerald-500 mt-1">+15% vs 上月</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MousePointer className="h-4 w-4" />
              <span className="text-sm">点击率</span>
            </div>
            <p className="text-2xl font-bold text-foreground">4.2%</p>
            <p className="text-xs text-emerald-500 mt-1">+0.5% vs 上月</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">转化率</span>
            </div>
            <p className="text-2xl font-bold text-foreground">2.8%</p>
            <p className="text-xs text-emerald-500 mt-1">+0.3% vs 上月</p>
          </div>
        </div>

        {/* Campaigns */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="active">进行中</TabsTrigger>
              <TabsTrigger value="scheduled">已计划</TabsTrigger>
              <TabsTrigger value="draft">草稿</TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索活动..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>

          <TabsContent value="all" className="space-y-3">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="group bg-card border border-border rounded-xl p-5 hover:border-foreground/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {getTypeIcon(campaign.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{campaign.name}</h3>
                        <Badge variant="outline" className={getStatusColor(campaign.status)}>
                          {getStatusText(campaign.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {campaign.startDate} - {campaign.endDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        查看报告
                      </DropdownMenuItem>
                      <DropdownMenuItem>编辑活动</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">删除</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {campaign.status !== "draft" && (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">预算使用</span>
                        <span className="text-foreground">
                          ¥{campaign.spent.toLocaleString()} / ¥{campaign.budget.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(campaign.spent / campaign.budget) * 100} className="h-1.5" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Eye className="h-3 w-3" />
                          <span className="text-xs">触达人数</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{campaign.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <MousePointer className="h-3 w-3" />
                          <span className="text-xs">点击次数</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-xs">转化数</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{campaign.conversions.toLocaleString()}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
