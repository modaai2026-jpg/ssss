"use client"

import { User, Bell, Shield, CreditCard, Globe, Palette, Code, Database, Key, ChevronRight, Moon, Sun, Monitor, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function SettingsView() {
  const settingsGroups = [
    {
      title: "账户",
      items: [
        { icon: User, label: "个人资料", description: "管理您的账户信息和偏好设置", badge: null },
        { icon: Bell, label: "通知设置", description: "配置通知方式和提醒频率", badge: null },
        { icon: Shield, label: "安全设置", description: "密码、双重认证和登录历史", badge: "推荐" },
      ]
    },
    {
      title: "商店",
      items: [
        { icon: Globe, label: "域名管理", description: "管理自定义域名和 SSL 证书", badge: null },
        { icon: Palette, label: "主题设置", description: "自定义商店外观和品牌", badge: null },
        { icon: CreditCard, label: "支付方式", description: "配置支付网关和收款设置", badge: null },
      ]
    },
    {
      title: "开发者",
      items: [
        { icon: Key, label: "API 密钥", description: "管理 API 访问凭证", badge: null },
        { icon: Code, label: "Webhooks", description: "配置事件通知和集成", badge: null },
        { icon: Database, label: "数据导出", description: "导出商店数据和备份", badge: null },
      ]
    }
  ]

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-foreground">设置</h1>
          <p className="text-sm text-muted-foreground mt-0.5">管理您的账户和商店配置</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl space-y-8">
          {/* Theme Switcher */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-foreground">外观</h3>
                <p className="text-sm text-muted-foreground mt-0.5">选择界面主题</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", icon: Sun, label: "浅色" },
                { value: "dark", icon: Moon, label: "深色" },
                { value: "system", icon: Monitor, label: "跟随系统" },
              ].map((theme) => (
                <button
                  key={theme.value}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    theme.value === "dark" 
                      ? "border-foreground bg-foreground/5" 
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <theme.icon className="h-5 w-5 text-foreground" />
                  <span className="text-sm text-foreground">{theme.label}</span>
                  {theme.value === "dark" && (
                    <Check className="h-4 w-4 text-foreground absolute top-2 right-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Groups */}
          {settingsGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {group.title}
              </h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
                {group.items.map((item, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">{item.badge}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Settings */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              快捷设置
            </h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-foreground">邮件通知</p>
                  <p className="text-sm text-muted-foreground">接收订单和库存提醒</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-foreground">推送通知</p>
                  <p className="text-sm text-muted-foreground">接收实时消息推送</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-foreground">AI 助手</p>
                  <p className="text-sm text-muted-foreground">启用智能分析和建议</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div>
            <h2 className="text-sm font-medium text-red-500 uppercase tracking-wider mb-3">
              危险区域
            </h2>
            <div className="bg-card border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">删除商店</p>
                  <p className="text-sm text-muted-foreground">永久删除商店及所有数据，此操作不可撤销</p>
                </div>
                <Button variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10">
                  删除商店
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
