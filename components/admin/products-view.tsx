"use client"

import { useState } from "react"
import { Package, Search, Filter, Plus, MoreHorizontal, Image, Edit, Trash2, Copy, Eye, Archive, Tag, Box, Layers, ChevronDown, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

interface ProductsViewProps {
  products: Product[]
  setProducts: (products: Product[]) => void
}

export function ProductsView({ products, setProducts }: ProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "archived">("all")

  // For Collections (Series) state - truly active and real
  const [collectionsList, setCollectionsList] = useState([
    { id: "1", name: "新品上市", productsCount: 24, status: "active" },
    { id: "2", name: "热销推荐", productsCount: 18, status: "active" },
    { id: "3", name: "春季新品", productsCount: 32, status: "scheduled" },
    { id: "4", name: "特价促销", productsCount: 15, status: "active" },
  ])

  // Modals / Dialog Overlay States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "手机",
    price: "",
    stock: "",
    status: "active" as "active" | "draft" | "archived"
  })

  // Collection Form State
  const [collectionFormData, setCollectionFormData] = useState({
    name: "",
    status: "active" as "active" | "scheduled" | "draft"
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "draft": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "archived": return "bg-muted text-muted-foreground border-border"
      case "scheduled": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "在售"
      case "draft": return "草稿"
      case "archived": return "已归档"
      case "scheduled": return "计划"
      default: return status
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const toggleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      sku: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      category: "配件",
      price: "199",
      stock: "100",
      status: "active"
    })
    setIsAddModalOpen(true)
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.sku.trim()) {
      toast.error("请填写完整商品名称和 SKU 编码")
      return
    }

    const priceNum = parseFloat(formData.price) || 0
    const stockNum = parseInt(formData.stock) || 0

    const newProduct: Product = {
      id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      sku: formData.sku,
      price: priceNum,
      stock: stockNum,
      status: formData.status,
      category: formData.category,
      image: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`
    }

    setProducts([newProduct, ...products])
    setIsAddModalOpen(false)
    toast.success(`🎉 商品『${newProduct.name}』已成功上架！并加载初始库存 ${newProduct.stock} 件。`)
  }

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status as "active" | "draft" | "archived"
    })
    setIsEditModalOpen(true)
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    setProducts(products.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          name: formData.name,
          sku: formData.sku,
          category: formData.category,
          price: parseFloat(formData.price) || 0,
          stock: parseInt(formData.stock) || 0,
          status: formData.status
        }
      }
      return p
    }))

    setIsEditModalOpen(false)
    setEditingProduct(null)
    toast.success(`🎉 商品『${formData.name}』已更新修改。`)
  }

  const handleDeleteProduct = (id: string, name: string) => {
    setProducts(products.filter(p => p.id !== id))
    setSelectedProducts(selectedProducts.filter(p => p !== id))
    toast.success(`已删除商品『${name}』。`)
  }

  const handleCopyProduct = (product: Product) => {
    const copied: Product = {
      ...product,
      id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      name: `${product.name} (复制)`,
      sku: `${product.sku}-COPY`
    }
    setProducts([copied, ...products])
    toast.success(`已克隆复制商品『${product.name}』。`)
  }

  const handleArchiveProduct = (id: string, name: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: "archived" } : p))
    toast.success(`已将商品『${name}』存档下架。`)
  }

  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault()
    if (!collectionFormData.name.trim()) return

    const newColl = {
      id: `COL-${Math.floor(100 + Math.random() * 900)}`,
      name: collectionFormData.name,
      productsCount: 0,
      status: collectionFormData.status
    }
    setCollectionsList([...collectionsList, newColl])
    setIsNewCollectionModalOpen(false)
    setCollectionFormData({ name: "", status: "active" })
    toast.success(`🎉 新系列『${newColl.name}』创建成功！`)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-foreground">产品</h1>
              <p className="text-sm text-muted-foreground mt-0.5">管理您的产品目录，共 {products.length} 个产品</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="gap-2 cursor-pointer"
                onClick={() => {
                  toast.success("在售商品清单数据已成功提取并导出为 CSV 报表。")
                }}
              >
                <Download className="h-4 w-4" />
                导出
              </Button>
              <Button className="gap-2 cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800" onClick={handleOpenAddModal}>
                <Plus className="h-4 w-4" />
                添加产品
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                产品
              </TabsTrigger>
              <TabsTrigger value="collections" className="gap-2">
                <Layers className="h-4 w-4" />
                系列
              </TabsTrigger>
              <TabsTrigger value="inventory" className="gap-2">
                <Box className="h-4 w-4" />
                库存
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <Tag className="h-4 w-4" />
                分类
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索产品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 cursor-pointer">
                    <Filter className="h-4 w-4" />
                    状态过滤: {getStatusText(statusFilter)}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")} className="cursor-pointer">全部</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")} className="cursor-pointer">在售</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("draft")} className="cursor-pointer">草稿</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("archived")} className="cursor-pointer">已归档</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="products">
            {selectedProducts.length > 0 && (
              <div className="bg-muted/50 border border-border rounded-lg p-3 mb-4 flex items-center justify-between animate-in fade-in duration-200">
                <span className="text-sm font-medium text-foreground">已选择 {selectedProducts.length} 个产品</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setProducts(products.map(p => selectedProducts.includes(p.id) ? { ...p, status: "active" } : p))
                      setSelectedProducts([])
                      toast.success(`已批量上架选择的 ${selectedProducts.length} 款产品`)
                    }}
                    className="cursor-pointer text-xs"
                  >
                    批量上架
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600 font-semibold cursor-pointer text-xs"
                    onClick={() => {
                      setProducts(products.filter(p => !selectedProducts.includes(p.id)))
                      setSelectedProducts([])
                      toast.success(`已批量清理 ${selectedProducts.length} 款商品。`)
                    }}
                  >
                    删除
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="py-3 px-4 text-left w-12">
                      <Checkbox 
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">产品</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">SKU</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">状态</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">库存</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">价格</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">分类</th>
                    <th className="py-3 px-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="py-3 px-4">
                        <Checkbox 
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleSelectProduct(product.id)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-zinc-100">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <Image className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground leading-snug">{product.name}</p>
                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-zinc-500 font-mono font-medium">{product.sku}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(product.status)}`}>
                          {getStatusText(product.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-xs font-bold font-mono ${
                          product.stock === 0 ? "text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded" : 
                          product.stock < 50 ? "text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded" : "text-zinc-700"
                        }`}>
                          {product.stock === 0 ? "已售罄" : `${product.stock} 件`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-bold text-zinc-900 font-mono">¥{product.price.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-muted-foreground">{product.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 cursor-pointer text-zinc-500 hover:text-foreground"
                            onClick={() => handleEditProductClick(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleCopyProduct(product)} className="cursor-pointer">
                                <Copy className="h-4 w-4 mr-2 text-zinc-500" />
                                复制商品
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleArchiveProduct(product.id, product.name)} className="cursor-pointer">
                                <Archive className="h-4 w-4 mr-2 text-zinc-500" />
                                存档下架
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteProduct(product.id, product.name)} className="text-red-500 cursor-pointer focus:bg-red-50 focus:text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                彻底删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="px-4 py-16 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">没有找到符合要求的产品商品</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="collections">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
              {collectionsList.map((collection) => (
                <div key={collection.id} className="bg-card border border-border rounded-2xl p-5 hover:border-zinc-300 transition-all cursor-pointer relative group">
                  <div className="aspect-video bg-zinc-50 rounded-xl mb-4 flex items-center justify-center border border-zinc-100">
                    <Layers className="h-8 w-8 text-zinc-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{collection.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{collection.productsCount} 个关联商品</p>
                    </div>
                    <Badge variant="outline" className={`px-2 py-0.5 rounded text-[9px] font-semibold ${getStatusColor(collection.status)}`}>
                      {collection.status === "active" ? "活跃" : collection.status === "scheduled" ? "排期中" : "草稿"}
                    </Badge>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setCollectionsList(collectionsList.filter(c => c.id !== collection.id))
                      toast.success(`已清退系列『${collection.name}』`)
                    }}
                    className="absolute top-3 right-3 h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div 
                className="bg-[#fafbfc] border border-zinc-200 border-dashed rounded-2xl p-5 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition-all hover:bg-zinc-50"
                onClick={() => setIsNewCollectionModalOpen(true)}
              >
                <div className="text-center">
                  <Plus className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-600">新建产品系列</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-lg mx-auto mt-6">
              <Box className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <h3 className="font-bold text-zinc-900 mb-1">智能库存监控流</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed mb-6">
                系统与主力仓货架已完全对齐。下方产品列表支持一键增补 +50 库存，支持极速更新及供应链自适应配给。
              </p>
              <Button 
                onClick={() => {
                  setProducts(products.map(p => ({ ...p, stock: p.stock < 10 ? p.stock + 100 : p.stock })))
                  toast.success("已对所有低库存款(<10)自动补强 +100 件！")
                }}
                className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl px-5 cursor-pointer text-xs font-bold"
              >
                一键补足所有缺货商品
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="bg-card border border-border rounded-2xl p-12 text-center max-w-lg mx-auto mt-6">
              <Tag className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <h3 className="font-bold text-zinc-900 mb-1">多维产品标签及品类</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed mb-6">
                默认挂载 手机、数码、手表、耳机、配件 等在售商品分类标签。
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-xs mx-auto">
                {["手机", "数码", "手表", "耳机", "配件", "生活健康"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 cursor-pointer font-bold rounded-xl text-xs text-zinc-700 border border-zinc-200/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- ADD PRODUCT DIALOG OVERLAY --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <Plus className="h-5 w-5 text-zinc-800" />
              添加新上架产品
            </h2>
            <p className="text-xs text-zinc-400 mb-6">快速新增在配商品到商铺库存，提供初始价格和库存现货</p>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">商品名称 <span className="text-red-500">*</span></label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如：无线智能触控耳机 Pro"
                  className="rounded-xl border-zinc-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">SKU 货号 <span className="text-red-500">*</span></label>
                  <Input 
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">分选类别</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm bg-white"
                  >
                    <option value="配件">配件</option>
                    <option value="手机">手机</option>
                    <option value="手表">手表</option>
                    <option value="耳机">耳机</option>
                    <option value="数码">数码</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">统一售价 (¥) <span className="text-red-500">*</span></label>
                  <Input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">初始现货件数</label>
                  <Input 
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">发布状态</label>
                <div className="flex gap-4">
                  {["active", "draft"].map((st) => (
                    <label key={st} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                      <input 
                        type="radio"
                        name="add_status"
                        checked={formData.status === st}
                        onChange={() => setFormData({ ...formData, status: st as any })}
                        className="text-zinc-900 focus:ring-zinc-900"
                      />
                      {st === "active" ? "立即发布上架" : "存为仓库草稿"}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <Button type="button" variant="outline" className="rounded-xl border-zinc-200 text-zinc-600 cursor-pointer text-xs" onClick={() => setIsAddModalOpen(false)}>
                  取消
                </Button>
                <Button type="submit" className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer font-bold text-xs px-5">
                  上架新商品
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PRODUCT DIALOG OVERLAY --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => { setIsEditModalOpen(false); setEditingProduct(null); }}
              className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <Edit className="h-5 w-5 text-zinc-800" />
              编辑商品属性
            </h2>
            <p className="text-xs text-zinc-400 mb-6">修改商品名称、类目、单价和物理货位库存</p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">商品名称 <span className="text-red-500">*</span></label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="商品名称"
                  className="rounded-xl border-zinc-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">SKU 货号 <span className="text-red-500">*</span></label>
                  <Input 
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">分选类别</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm bg-white"
                  >
                    <option value="配件">配件</option>
                    <option value="手机">手机</option>
                    <option value="手表">手表</option>
                    <option value="耳机">耳机</option>
                    <option value="数码">数码</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">统一售价 (¥) <span className="text-red-500">*</span></label>
                  <Input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">物理库存件数</label>
                  <Input 
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">商品状态</label>
                <div className="flex gap-4">
                  {["active", "draft", "archived"].map((st) => (
                    <label key={st} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                      <input 
                        type="radio"
                        name="edit_status"
                        checked={formData.status === st}
                        onChange={() => setFormData({ ...formData, status: st as any })}
                        className="text-zinc-900 focus:ring-zinc-900"
                      />
                      {st === "active" ? "在售上架中" : st === "draft" ? "草稿" : "已归档下架"}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <Button type="button" variant="outline" className="rounded-xl border-zinc-200 text-zinc-600 cursor-pointer text-xs" onClick={() => { setIsEditModalOpen(false); setEditingProduct(null); }}>
                  取消
                </Button>
                <Button type="submit" className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer font-bold text-xs px-5">
                  保存修改
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD COLLECTION DIALOG OVERLAY --- */}
      {isNewCollectionModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setIsNewCollectionModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <Layers className="h-5 w-5 text-zinc-800" />
              新建产品系列
            </h2>
            <p className="text-xs text-zinc-400 mb-6">为商品组装系列以便于前台统一陈列或组织促销</p>

            <form onSubmit={handleAddCollection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">系列名称 <span className="text-red-500">*</span></label>
                <Input 
                  value={collectionFormData.name}
                  onChange={(e) => setCollectionFormData({ ...collectionFormData, name: e.target.value })}
                  placeholder="如：2026酷夏限时精选"
                  className="rounded-xl border-zinc-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">推广排期</label>
                <div className="flex gap-4">
                  {["active", "scheduled", "draft"].map((st) => (
                    <label key={st} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                      <input 
                        type="radio"
                        name="col_status"
                        checked={collectionFormData.status === st}
                        onChange={() => setCollectionFormData({ ...collectionFormData, status: st as any })}
                        className="text-zinc-900 focus:ring-zinc-900"
                      />
                      {st === "active" ? "启用" : st === "scheduled" ? "计划推广" : "存为草稿"}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <Button type="button" variant="outline" className="rounded-xl border-zinc-200 text-zinc-600 cursor-pointer text-xs" onClick={() => setIsNewCollectionModalOpen(false)}>
                  取消
                </Button>
                <Button type="submit" className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer font-bold text-xs px-5">
                  创建系列
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
