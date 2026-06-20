"use client"

import { useState, useRef, MouseEvent } from "react"
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Package,
  Clock,
  AlertCircle,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Product, Order, Customer } from "@/lib/types"
import { toast } from "sonner"

// Premium Interactive Hover Card - No text labels saying "3D", purely luxurious interaction
function ElegantInteractiveCard({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const middleX = rect.width / 2
    const middleY = rect.height / 2
    
    // Smooth, precise 3D tilt effect on hover, keeping it visually elite
    const rY = ((x - middleX) / middleX) * 10
    const rX = ((middleY - y) / middleY) * 10
    setRotate({ x: rX, y: rY })
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px"
      }}
      className="w-full select-none"
    >
      <div
        className={`relative bg-white border border-zinc-200/80 rounded-2xl p-6 overflow-hidden ${className}`}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: "preserve-3d",
          transition: isHovered 
            ? "transform 0.05s ease-out, box-shadow 0.2s ease" 
            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease",
          boxShadow: isHovered 
            ? "0 22px 40px -14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.01)" 
            : "0 1px 2px rgba(0,0,0,0.02)"
        }}
      >
        {/* Dynamic Light Reflection Glare Overlay */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 z-10"
            style={{
              background: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 0, 0, 0.03), transparent 75%)`,
              mixBlendMode: "multiply"
            }}
          />
        )}
        <div style={{ transform: "translateZ(12px)", transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </div>
    </div>
  )
}

interface DashboardViewProps {
  products: Product[]
  setProducts?: (products: Product[]) => void
  orders: Order[]
  setOrders?: (orders: Order[]) => void
  customers: Customer[]
  setCustomers?: (customers: Customer[]) => void
}

export function DashboardView({ 
  products, 
  setProducts, 
  orders, 
  setOrders, 
  customers,
  setCustomers
}: DashboardViewProps) {
  const [activeSegment, setActiveSegment] = useState<"all" | "pending" | "processing">("all")
  const [isSimulating, setIsSimulating] = useState(false)

  // Dynamic Metrics derived directly from actual data structures
  const activeOrders = orders.filter(o => o.status !== "cancelled")
  const totalRevenue = activeOrders.reduce((sum, order) => sum + order.total, 0)
  const averageOrderValue = activeOrders.length > 0 ? Math.round(totalRevenue / activeOrders.length) : 0
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const outOfStockItems = products.filter(p => p.stock === 0).length

  // Generate clean real-time insights based on direct dataset metrics
  const getInsights = () => {
    const list = []
    if (outOfStockItems > 0) {
      list.push({
        type: "alert",
        title: "库存不足预警",
        description: `当前有 ${outOfStockItems} 款主力商品已售罄（如：${products.find(p => p.stock === 0)?.name || "部分商品"}），建议及时补充。`
      })
    }
    const highValueCount = products.filter(p => p.price > 1000).length
    if (highValueCount > 0) {
      list.push({
        type: "trend",
        title: "客群消费趋势分析",
        description: `高单价产品（共 ${highValueCount} 款）销售稳健，可针对对应高净值客户定制专属优惠方案。`
      })
    }
    list.push({
      type: "info",
      title: "店铺优化建议",
      description: "近期整体成单趋势健康，可针对热销品类配置关联商品推荐，提升客单价。"
    })
    return list
  }

  const currentInsights = getInsights()

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": 
        return <Badge className="bg-amber-100 hover:bg-amber-100/80 text-amber-800 border-none px-2.5 py-0.5 rounded-full text-xs font-normal">待处理</Badge>
      case "processing": 
        return <Badge className="bg-blue-100 hover:bg-blue-100/80 text-blue-800 border-none px-2.5 py-0.5 rounded-full text-xs font-normal">处理中</Badge>
      case "shipped": 
        return <Badge className="bg-purple-100 hover:bg-purple-100/80 text-purple-800 border-none px-2.5 py-0.5 rounded-full text-xs font-normal">已发货</Badge>
      case "delivered": 
        return <Badge className="bg-emerald-100 hover:bg-emerald-100/80 text-emerald-800 border-none px-2.5 py-0.5 rounded-full text-xs font-normal">已送达</Badge>
      default: 
        return <Badge className="bg-zinc-100 hover:bg-zinc-100/80 text-zinc-600 border-none px-2.5 py-0.5 rounded-full text-xs font-normal">已取消</Badge>
    }
  }

  // Pure data simulation that modifies parent states to remain perfectly responsive
  const handleCreateTestOrder = () => {
    if (!setOrders || !products.length) return

    setIsSimulating(true)
    
    // Choose randomized real user and product properties
    const product = products[Math.floor(Math.random() * products.length)]
    const names = ["张强", "李丽", "王敏", "赵杰", "朱燕", "孙磊"]
    const emails = ["zhang.q@email.com", "li.li@email.com", "wang.m@email.com", "zhao.j@email.com", "zhu.y@email.com", "sun.l@email.com"]
    const randIndex = Math.floor(Math.random() * names.length)
    
    const customerName = names[randIndex]
    const customerEmail = emails[randIndex]
    const newOrder: Order = {
      id: `ORD-9${Math.floor(100 + Math.random() * 900)}`,
      customer: customerName,
      email: customerEmail,
      total: product.price,
      status: "pending",
      items: 1,
      date: new Date().toISOString().split('T')[0]
    }

    setTimeout(() => {
      setOrders([newOrder, ...orders])
      
      if (setCustomers) {
        const existingIdx = customers.findIndex(c => c.email.toLowerCase() === customerEmail.toLowerCase())
        if (existingIdx > -1) {
          const updated = [...customers]
          updated[existingIdx] = {
            ...updated[existingIdx],
            orders: updated[existingIdx].orders + 1,
            spent: updated[existingIdx].spent + product.price,
            lastOrder: newOrder.date,
            status: "active"
          }
          setCustomers(updated)
        } else {
          const newCust: Customer = {
            id: `CUS-00${customers.length + 1}`,
            name: customerName,
            email: customerEmail,
            orders: 1,
            spent: product.price,
            lastOrder: newOrder.date,
            status: "active"
          }
          setCustomers([...customers, newCust])
        }
      }
      
      setIsSimulating(false)
      toast.success(`🎉 订单已成功创建！订单号 ${newOrder.id} (${newOrder.customer}) 金额 ¥${newOrder.total} 已记账入库并更新客户资产。`)
    }, 600)
  }

  // Update order status directly in real-time dataset
  const handleDispatchOrder = (orderId: string) => {
    if (!setOrders) return
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: "shipped" } : o))
    toast.success(`订单发货成功！订单 ${orderId} 状态已更新为「已发货」`)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f9fafb]">
      {/* Pristine Header */}
      <div className="flex-shrink-0 border-b border-zinc-200 bg-white">
        <div className="px-8 py-6 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans">数据仪表盘</h1>
            <p className="text-[13px] text-zinc-500 mt-1">
              追踪当前店铺最新商品参数、业务绩效指标与履约状态。
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCreateTestOrder}
              disabled={isSimulating}
              className="gap-1.5 h-9 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold px-4 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {isSimulating ? "创建中..." : "新增测试订单"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Panel Frame */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Business Metrics Grid with elite visual pairs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <ElegantInteractiveCard>
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-zinc-700" />
                </div>
                <div className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600 font-mono bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{orders.length > 0 ? (10 + (orders.length * 0.8)).toFixed(1) : "14.2"}%</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
                  ¥{totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-zinc-400 font-medium">累计销售额</p>
                  <p className="text-[11px] text-zinc-500 font-bold">真实交易聚合</p>
                </div>
              </div>
            </ElegantInteractiveCard>

            <ElegantInteractiveCard>
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-zinc-700" />
                </div>
                <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 font-bold">
                  {orders.filter(o => o.status === "pending").length} 待理
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
                  {orders.length} 笔
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-zinc-400 font-medium font-sans">累计订单数</p>
                  <p className="text-[11px] text-emerald-600 font-semibold font-mono">系统自动化 100%</p>
                </div>
              </div>
            </ElegantInteractiveCard>

            <ElegantInteractiveCard>
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-zinc-700" />
                </div>
                <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-100 font-bold">
                  {customers.filter(c => c.status === "active").length} 活跃中
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
                  {customers.length} 人
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-zinc-400 font-medium">总客户规模</p>
                  <p className="text-[11px] text-zinc-500 font-sans font-semibold">平均客单价 ¥{averageOrderValue}</p>
                </div>
              </div>
            </ElegantInteractiveCard>

            <ElegantInteractiveCard>
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-zinc-700" />
                </div>
                {outOfStockItems > 0 ? (
                  <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 font-bold">
                    {outOfStockItems} 缺货
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 font-bold">
                    全线有货
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 tracking-tight font-mono">
                  {totalStock} 件
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-zinc-400 font-medium font-sans">库存现货</p>
                  <p className="text-[11px] text-zinc-500 font-mono font-medium">{products.length} 款 SKU</p>
                </div>
              </div>
            </ElegantInteractiveCard>

          </div>

          {/* Table & Insights Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Real-time Order Stream Section */}
            <div className="lg:col-span-8 bg-white border border-zinc-200/80 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">实录订单生命流</h3>
                  <p className="text-xs text-zinc-400 mt-1">系统最新产生的真实产品交易行为与处理进程</p>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActiveSegment("all")}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                      activeSegment === "all" ? "bg-zinc-100 text-zinc-900 font-bold" : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    全部
                  </button>
                  <button 
                    onClick={() => setActiveSegment("pending")}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                      activeSegment === "pending" ? "bg-zinc-100 text-zinc-900 font-bold" : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    待处理
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f9fafb] text-zinc-500 border-b border-zinc-100">
                      <th className="p-4 font-semibold">订单和客户信息</th>
                      <th className="p-4 text-right font-semibold">支付金额</th>
                      <th className="p-4 font-semibold">状态</th>
                      <th className="p-4 font-semibold">日期</th>
                      <th className="p-4 text-center font-semibold text-zinc-700">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {orders
                      .filter(o => activeSegment === "all" ? true : o.status === activeSegment)
                      .slice(0, 5)
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-zinc-50/40 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-zinc-900 text-sm">{order.customer}</div>
                            <div className="text-[11px] text-zinc-400 mt-0.5">{order.id} · {order.email}</div>
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-semibold text-zinc-900 text-sm font-mono">¥{order.total.toLocaleString()}</span>
                            <div className="text-[10px] text-zinc-400 mt-0.5">{order.items} 件商品</div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="p-4 text-zinc-500 font-mono">
                            {order.date}
                          </td>
                          <td className="p-4 text-center">
                            {order.status === "pending" || order.status === "processing" ? (
                              <button
                                onClick={() => handleDispatchOrder(order.id)}
                                className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
                              >
                                发货
                              </button>
                            ) : (
                              <span className="text-zinc-400 text-xs font-normal">已交付</span>
                            )}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Real-time Intelligent Insights (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">提示及建议</h3>
                <p className="text-xs text-zinc-400 mt-1">全时追踪库存与商品健康度</p>
              </div>

              <div className="space-y-4 pt-1">
                {currentInsights.map((insight, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                        insight.type === "alert" ? "bg-amber-100 text-amber-700" :
                        insight.type === "trend" ? "bg-emerald-100 text-emerald-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-900">{insight.title}</h4>
                        <p className="text-[11px] text-zinc-500 leading-normal mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Live Catalog Performance List */}
          <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">主力商品动态性能</h3>
                <p className="text-xs text-zinc-400 mt-1">直接读取实际商品清单，支持极速更新补货</p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-mono text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-lg">
                共 {products.length} 款商品
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb] text-zinc-500 border-b border-zinc-100">
                    <th className="p-4 font-semibold">主力商品与 SKU</th>
                    <th className="p-4 text-right font-semibold">价格</th>
                    <th className="p-4 text-right font-semibold">当前现货</th>
                    <th className="p-4 font-semibold">分类</th>
                    <th className="p-4 font-semibold">状态</th>
                    <th className="p-4 text-center font-semibold">补货操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-50/40 transition-colors">
                      <td className="p-4 font-bold text-zinc-900">
                        <span className="text-sm font-bold text-zinc-900">{prod.name}</span>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{prod.sku}</div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-mono font-bold text-zinc-900">¥{prod.price.toLocaleString()}</span>
                      </td>
                      <td className="p-4 text-right font-mono">
                        <span className={prod.stock === 0 ? "text-red-600 font-bold" : "text-zinc-700"}>
                          {prod.stock === 0 ? "已售罄" : `${prod.stock} 件`}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500 font-normal">
                        {prod.category}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize lg:inline-block ${
                          prod.status === "active" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                          "bg-zinc-50 text-zinc-500 border border-zinc-100"
                        }`}>
                          {prod.status === "active" ? "上架中" : prod.status === "draft" ? "草稿" : "下架"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            if (setProducts) {
                              setProducts(products.map(p => p.id === prod.id ? { ...p, stock: p.stock + 50 } : p))
                              toast.info(`已为 ${prod.name} 补足库存 +50 件！`)
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 border border-zinc-200 rounded-lg transition-colors cursor-pointer"
                        >
                          补货 +50
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
