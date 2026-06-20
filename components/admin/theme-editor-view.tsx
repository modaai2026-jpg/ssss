"use client"

import { Paintbrush, Layout, Palette, Type, Image, Layers, Sparkles, Eye, Settings, Save, Undo, Redo, Monitor, Smartphone, Tablet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const templates = [
  { id: "1", name: "现代极简", category: "极简风格", preview: "/placeholder.svg", isPro: false },
  { id: "2", name: "商务专业", category: "商务风格", preview: "/placeholder.svg", isPro: false },
  { id: "3", name: "创意艺术", category: "创意风格", preview: "/placeholder.svg", isPro: true },
  { id: "4", name: "奢华品牌", category: "高端风格", preview: "/placeholder.svg", isPro: true },
  { id: "5", name: "时尚潮流", category: "时尚风格", preview: "/placeholder.svg", isPro: false },
  { id: "6", name: "自然清新", category: "清新风格", preview: "/placeholder.svg", isPro: false },
]

export function ThemeEditorView() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">主题编辑器</h1>
              <p className="text-sm text-muted-foreground mt-0.5">自定义您的店铺外观</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Redo className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                预览
              </Button>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                发布
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Tools */}
        <div className="w-80 border-r border-border bg-card/30 flex flex-col">
          <Tabs defaultValue="templates" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4 grid grid-cols-3">
              <TabsTrigger value="templates" className="text-xs">
                <Layout className="h-3 w-3 mr-1" />
                模板
              </TabsTrigger>
              <TabsTrigger value="style" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                样式
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="flex-1 overflow-auto p-4 space-y-4">
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="group bg-background border border-border rounded-lg overflow-hidden hover:border-foreground/30 transition-all cursor-pointer"
                  >
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Layers className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      {template.isPro && (
                        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                          PRO
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary">使用</Button>
                        <Button size="sm" variant="secondary">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-foreground">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="style" className="flex-1 overflow-auto p-4 space-y-6">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  颜色
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">主色调</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-foreground border border-border cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">背景色</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-background border border-border cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">强调色</span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 border border-border cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  字体
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">标题字体</span>
                    <Button variant="outline" size="sm">Geist Sans</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">正文字体</span>
                    <Button variant="outline" size="sm">Geist Sans</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 overflow-auto p-4">
              <div className="bg-gradient-to-br from-foreground/5 to-foreground/10 border border-border rounded-xl p-4 text-center">
                <Sparkles className="h-10 w-10 text-foreground mx-auto mb-3" />
                <h3 className="font-medium text-foreground mb-2">AI 智能设计</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  描述您想要的店铺风格，AI 将为您生成专属设计
                </p>
                <textarea
                  placeholder="例如：我想要一个现代简约风格的服装店，主色调为黑白配色..."
                  className="w-full h-24 p-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
                <Button className="w-full mt-3 gap-2">
                  <Sparkles className="h-4 w-4" />
                  生成设计
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col bg-muted/30">
          {/* Device Switcher */}
          <div className="flex items-center justify-center gap-2 p-3 border-b border-border">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Monitor className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Tablet className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          {/* Preview Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-4xl aspect-video bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Paintbrush className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">选择模板或开始自定义设计</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
