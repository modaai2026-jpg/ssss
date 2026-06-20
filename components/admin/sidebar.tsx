'use client';

import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Megaphone,
  Tag,
  FileText,
  BarChart3,
  Store, 
  Bot, 
  ListTodo,
  Activity,
  CreditCard, 
  Settings,
  ChevronDown,
  Search,
  Plus
} from 'lucide-react';
import type { ActiveTab } from '@/lib/types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  collapsed?: boolean;
}

// Shopify 风格的菜单分组
const menuGroups = [
  {
    items: [
      { id: 'dashboard' as ActiveTab, label: '主页', icon: LayoutDashboard },
      { id: 'orders' as ActiveTab, label: '订单', icon: ShoppingCart, badge: 3 },
      { id: 'products' as ActiveTab, label: '产品', icon: Package },
      { id: 'customers' as ActiveTab, label: '客户', icon: Users },
    ]
  },
  {
    items: [
      { id: 'marketing' as ActiveTab, label: '市场营销', icon: Megaphone },
      { id: 'discounts' as ActiveTab, label: '折扣', icon: Tag },
      { id: 'content' as ActiveTab, label: '内容', icon: FileText },
      { id: 'analytics' as ActiveTab, label: '分析', icon: BarChart3 },
    ]
  },
  {
    label: '销售渠道',
    items: [
      { id: 'stores' as ActiveTab, label: '在线商店', icon: Store },
    ]
  },
  {
    label: '智能化',
    items: [
      { id: 'agents' as ActiveTab, label: '智能体', icon: Bot },
      { id: 'queues' as ActiveTab, label: '队列', icon: ListTodo },
      { id: 'runtime' as ActiveTab, label: 'Runtime', icon: Activity },
    ]
  },
  {
    label: '系统',
    items: [
      { id: 'merchants' as ActiveTab, label: '商户', icon: Users },
      { id: 'logs' as ActiveTab, label: '日志', icon: FileText },
      { id: 'billing' as ActiveTab, label: '账单', icon: CreditCard },
      { id: 'settings' as ActiveTab, label: '设置', icon: Settings },
    ]
  },
];

export function AdminSidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-[240px] h-screen flex flex-col bg-sidebar text-sidebar-foreground shrink-0 border-r border-sidebar-border">
      {/* Logo 和搜索区域 */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-sidebar font-bold text-sm">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">Studio</span>
            <span className="text-[10px] text-sidebar-foreground/60 leading-tight">管理后台</span>
          </div>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="px-3 py-3">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-sidebar-accent text-sm text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/80 transition-colors">
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">搜索</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sidebar-border text-sidebar-foreground/50">
            CtrlK
          </kbd>
        </button>
      </div>

      {/* 工作区选择器 */}
      <div className="px-3 pb-2">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-sidebar-accent/50 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">M</span>
            </div>
            <span className="truncate">默认工作区</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
        </button>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto sidebar-scroll">
        <div className="space-y-4">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.label && (
                <div className="px-3 py-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/40">
                    {group.label}
                  </span>
                </div>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isActive 
                            ? 'bg-white text-sidebar font-medium shadow-sm' 
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white'
                        }`}
                      >
                        <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-sidebar' : ''}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className={`min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-medium ${
                            isActive 
                              ? 'bg-sidebar text-white' 
                              : 'bg-sidebar-accent text-sidebar-foreground/70'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* 添加应用按钮 */}
      <div className="p-3 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white transition-colors">
          <Plus className="h-4 w-4" />
          <span>添加应用</span>
        </button>
      </div>

      {/* 用户信息 */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-medium text-white">
            管
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">管理员</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">admin@studio.com</p>
          </div>
          <Settings className="h-4 w-4 text-sidebar-foreground/50" />
        </div>
      </div>
    </aside>
  );
}
