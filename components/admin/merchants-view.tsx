"use client"

import { useState } from "react"
import { Building2, Search, Filter, Plus, MoreHorizontal, Mail, Phone, MapPin, TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockMerchants } from "@/lib/data"

export function MerchantsView() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMerchants = mockMerchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "suspended": return "bg-red-500/10 text-red-500 border-red-500/20"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "活跃"
      case "pending": return "待审核"
      case "suspended": return "已暂停"
      default: return status
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground">商户管理</h1>
              <p className="text-sm text-muted-foreground mt-0.5">管理平台上的所有商户和店铺</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              添加商户
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索商户名称、邮箱..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4">
          {filteredMerchants.map((merchant) => (
            <div
              key={merchant.id}
              className="group bg-card border border-border rounded-xl p-5 hover:border-foreground/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 rounded-xl">
                    <AvatarImage src={merchant.avatar} />
                    <AvatarFallback className="rounded-xl bg-muted">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{merchant.name}</h3>
                      <Badge variant="outline" className={getStatusColor(merchant.status)}>
                        {getStatusText(merchant.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {merchant.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {merchant.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {merchant.location}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem>编辑信息</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">暂停商户</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 pt-4 border-t border-border grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">店铺数量</p>
                  <p className="text-lg font-semibold text-foreground">{merchant.storesCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">总销售额</p>
                  <p className="text-lg font-semibold text-foreground">¥{merchant.totalSales.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">本月增长</p>
                  <div className="flex items-center gap-1">
                    {merchant.growthRate >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-lg font-semibold ${merchant.growthRate >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {merchant.growthRate >= 0 ? '+' : ''}{merchant.growthRate}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">入驻时间</p>
                  <p className="text-sm text-foreground">{merchant.joinDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
