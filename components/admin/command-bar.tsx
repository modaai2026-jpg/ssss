"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3,
  Sparkles,
  Store,
  Bot,
  FileText,
  CreditCard,
  Command
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import type { ActiveTab } from "@/lib/types"

interface CommandBarProps {
  isOpen: boolean
  onClose: () => void
  setActiveTab: (tab: ActiveTab) => void
}

const navigationItems = [
  { icon: BarChart3, label: "仪表盘", tab: "dashboard" as ActiveTab, shortcut: "⌘D" },
  { icon: ShoppingCart, label: "订单", tab: "orders" as ActiveTab, shortcut: "⌘O" },
  { icon: Package, label: "产品", tab: "products" as ActiveTab, shortcut: "⌘P" },
  { icon: Users, label: "客户", tab: "customers" as ActiveTab, shortcut: "⌘C" },
  { icon: Store, label: "店铺", tab: "stores" as ActiveTab, shortcut: "" },
  { icon: Bot, label: "智能体", tab: "agents" as ActiveTab, shortcut: "" },
  { icon: FileText, label: "内容", tab: "content" as ActiveTab, shortcut: "" },
  { icon: CreditCard, label: "账单", tab: "billing" as ActiveTab, shortcut: "" },
  { icon: Settings, label: "设置", tab: "settings" as ActiveTab, shortcut: "⌘," },
]

const quickActions = [
  { icon: Sparkles, label: "AI 分析销售数据", action: "ai-analyze" },
  { icon: Package, label: "添加新产品", action: "add-product" },
  { icon: ShoppingCart, label: "处理待发货订单", action: "process-orders" },
  { icon: Users, label: "导出客户列表", action: "export-customers" },
]

export function CommandBar({ isOpen, onClose, setActiveTab }: CommandBarProps) {
  const handleNavigation = (tab: ActiveTab) => {
    setActiveTab(tab)
    onClose()
  }

  const handleAction = (action: string) => {
    console.log("[v0] Action triggered:", action)
    onClose()
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        // 这个会被父组件控制
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="搜索页面、操作或输入命令..." />
      <CommandList>
        <CommandEmpty>没有找到结果</CommandEmpty>
        
        <CommandGroup heading="导航">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.tab}
              onSelect={() => handleNavigation(item.tab)}
              className="flex items-center gap-3"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <kbd className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {item.shortcut}
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="快捷操作">
          {quickActions.map((item) => (
            <CommandItem
              key={item.action}
              onSelect={() => handleAction(item.action)}
              className="flex items-center gap-3"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
