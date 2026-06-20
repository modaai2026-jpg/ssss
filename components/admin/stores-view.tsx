"use client"

import { useState } from "react"
import { Store, Search, Filter, Plus, MoreHorizontal, ExternalLink, Eye, Settings, TrendingUp, Package, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockStores } from "@/lib/data"

export function StoresView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredStores = mockStores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "maintenance": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "inactive": return "bg-muted text-muted-foreground border-border"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "运营中"
      case "maintenance": return "维护中"
      case "inactive": return "已关闭"
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
              <h1 className="text-xl font-semibold text-foreground">在线商店</h1>
              <p className="text-sm text-muted-foreground mt-0.5">管理您的所有在线店铺</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              创建店铺
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索店铺名称、域名..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="flex items-center border border-border rounded-lg p-0.5">
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-7 px-2"
              >
                网格
              </Button>
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-7 px-2"
              >
                列表
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/20 transition-all duration-200"
              >
                {/* Store Preview */}
                <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Store className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className={getStatusColor(store.status)}>
                      {getStatusText(store.status)}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="h-7 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        预览
                      </Button>
                      <Button size="sm" variant="secondary" className="h-7 text-xs">
                        <Settings className="h-3 w-3 mr-1" />
                        设置
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Store Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-foreground">{store.name}</h3>
                      <a href={`https://${store.url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-0.5">
                        {store.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>编辑店铺</DropdownMenuItem>
                        <DropdownMenuItem>查看分析</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">关闭店铺</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <Package className="h-3 w-3" />
                        <span className="text-xs">产品</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{store.productsCount}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <ShoppingCart className="h-3 w-3" />
                        <span className="text-xs">订单</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{store.ordersCount}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs">销售额</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">¥{(store.revenue / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="group bg-card border border-border rounded-lg p-4 hover:border-foreground/20 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Store className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{store.name}</h3>
                      <Badge variant="outline" className={getStatusColor(store.status)}>
                        {getStatusText(store.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{store.url}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">产品</p>
                    <p className="font-medium">{store.productsCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">订单</p>
                    <p className="font-medium">{store.ordersCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">销售额</p>
                    <p className="font-medium">¥{store.revenue.toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
