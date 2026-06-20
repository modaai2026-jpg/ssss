"use client"

import { useState, useEffect } from "react"
import { Bot, Play, RefreshCw, MessageSquare, BadgeAlert, Coins, ChevronRight, CheckCircle2, ShoppingCart, Percent, Package2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"
import type { Product, Order, Customer } from "@/lib/types"

interface SandboxProps {
  products: Product[]
  setProducts: (products: Product[]) => void
  orders: Order[]
  setOrders: (orders: Order[]) => void
  customers: Customer[]
  setCustomers: (customers: Customer[]) => void
}

interface Step {
  agentName: string
  displayName: string
  avatar: string
  color: string
  text: string
  actionText?: string
}

interface Scenario {
  id: string
  teamName: string
  teamDesc: string
  title: string
  icon: React.ReactNode
  steps: Step[]
  effect: (props: SandboxProps) => void
  successMsg: string
}

export function AgentsTeamSandbox({
  products,
  setProducts,
  orders,
  setOrders,
  customers,
  setCustomers
}: SandboxProps) {
  const [activeScenarioId, setActiveScenarioId] = useState("marketing")
  const [currentStep, setCurrentStep] = useState(-1) // -1 means not started
  const [isRunning, setIsRunning] = useState(false)
  const [stepMessages, setStepMessages] = useState<Step[]>([])

  const scenarios: Scenario[] = [
    {
      id: "marketing",
      teamName: "高转化爆品营销组 (Marketing Team)",
      teamDesc: "由营销助理与数据助理协同，精准挖掘高加购高转化商品并自动上架专属闪促券，最大化ROI。",
      title: "智能扫描爆品并一键下发快闪折扣",
      icon: <Percent className="h-4 w-4" />,
      steps: [
        {
          agentName: "analytics",
          displayName: "数据分析师 · Analytics",
          avatar: "数",
          color: "border-blue-500/30 text-blue-400 bg-blue-500/5",
          text: "正在读取近24小时产品销售波动率... 检测到热播爆品『智能手表 Pro Max』(PRD-001) 加购率逆势上涨 42%，而平均转化耗时相比往期缩短了 15%。当前商品备货充裕 (156件)，深度建议立即下发快闪折扣！",
        },
        {
          agentName: "marketing",
          displayName: "爆品策划官 · Marketing",
          avatar: "营",
          color: "border-purple-500/30 text-purple-400 bg-purple-500/5",
          text: "收到数据策略！已在全渠道快速配置并激活 85折 限时快闪折扣券『WATCH85』，同时自动修改网店目录显示价格由 ¥2999 下调至 ¥2549。预计可驱动本周转化提升 30%！",
          actionText: "已向活动模块下发 85折 闪降策略",
        },
        {
          agentName: "support",
          displayName: "智能前台客服 · Support",
          avatar: "客",
          color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
          text: "已将优惠策略加载至前台客服知识库！接下来所有加入购物车而流失的用户，系统将在其流失 5 分钟内自动派遣客服智能体发送带有『WATCH85』专属高转化挽单卡片，保证极致购物粘性！",
        }
      ],
      effect: (p) => {
        // Lower the price of PRD-001 (智能手表 Pro Max)
        p.setProducts(p.products.map(prod => {
          if (prod.id === "PRD-001") {
            return { ...prod, price: 2549 }
          }
          return prod
        }))
      },
      successMsg: "爆品折扣激活成功！商品「智能手表 Pro Max」前台价格已正式降为 ¥2,549，并生成活动凭记。"
    },
    {
      id: "refund",
      teamName: "客服与风控自动合规组 (Support Team)",
      teamDesc: "由客服助理与财务助理协同，自动审计高净值VIP客户的延阻订单并执行极速自动退款。",
      title: "高净值金牌 VIP 订单闪退处理",
      icon: <BadgeAlert className="h-4 w-4" />,
      steps: [
        {
          agentName: "support",
          displayName: "智能客服助理 · Support",
          avatar: "客",
          color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
          text: "警告：收到客户『张伟』关于订单 ORD-9921 (价值 ¥3,898) 发起的恶意纠纷退款。客户申诉理由：『指纹硬件触感常发生卡顿延迟，体验极差』。已拦截入队列并申请财务智能风控二次审查。",
        },
        {
          agentName: "analytics",
          displayName: "金信分析官 · Analytics",
          avatar: "数",
          color: "border-blue-500/30 text-blue-400 bg-blue-500/5",
          text: "金信画像正在加载... 客户『张伟』(ID: CUS-001) 历史无恶退率，在店已消费 ¥25,680，属于极高商业净值的金牌 VIP 级别！极力建议该笔理赔执行『客满优先』闪电退款程序，提升二次复购心智！",
        },
        {
          agentName: "finance",
          displayName: "智能核算会计 · Finance",
          avatar: "财",
          color: "border-amber-500/30 text-amber-400 bg-amber-500/5",
          text: "收到高层信用核发授权。已调用原路退还网关，成功发起 ¥3,898 退款交易！已于管理系统同步完成对订单 ORD-9921 的取消与标注，原路资金预计于 12 小时内自动复原银行账户。",
          actionText: "已于后台更新订单 ORD-9921 状态为：已取消",
        }
      ],
      effect: (p) => {
        // Change ORD-9921 status to 'cancelled'
        p.setOrders(p.orders.map(o => {
          if (o.id === "ORD-9921") {
            return { ...o, status: "cancelled" }
          }
          return o
        }))
      },
      successMsg: "售后退款审计批复！订单「ORD-9921」状态已在后台修改为「已取消（退款成功）」，资金安全原路返回。"
    },
    {
      id: "inventory",
      teamName: "供应链预警与自动盘货组 (Supply Chain)",
      teamDesc: "由商品助理、财务助理实时配合，针对全系零库存 SKU 智控批量订货补充。",
      title: "零库存缺货自动向供应商采购储备",
      icon: <Package2 className="h-4 w-4" />,
      steps: [
        {
          agentName: "analytics",
          displayName: "库存运营盘货官 · Analytics",
          avatar: "数",
          color: "border-blue-500/30 text-blue-400 bg-blue-500/5",
          text: "检测到重大盘货赤字！热销爆款商品『便携充电宝 20000mAh』(PRD-003) 实时库存已归 0 导致被迫下架。根据近期流失购买请求记录估算，每延误一天供货将增加 ¥8,900 的销售净损失！",
        },
        {
          agentName: "product",
          displayName: "供应链货采经理 · Product",
          avatar: "物",
          color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
          text: "白牌供应链系统已握手成功。我已定位并匹配到最优质源头白牌厂家，每件采购成本价格仅需 ¥65。决定一键起草采购单，进货量 500 件，直接上架补充！",
        },
        {
          agentName: "finance",
          displayName: "智能财务风控官 · Finance",
          avatar: "财",
          color: "border-amber-500/30 text-amber-400 bg-amber-500/5",
          text: "采购预算支出审查中。申请备货资金 ¥32,500 审核无异常，已划归采购结算备妥，并下达采购批复！前台店铺状态一键启用智能预约并赋予库存 +500 件，让客户可无缝下单预售！",
          actionText: "已向 PRD-003 商品库存批复 +500，状态改为上架",
        }
      ],
      effect: (p) => {
        // Set stock of PRD-003 to 500 and status to active
        p.setProducts(p.products.map(prod => {
          if (prod.id === "PRD-003") {
            return { ...prod, stock: 500, status: "active" }
          }
          return prod
        }))
      },
      successMsg: "供应链采购决策已就绪！缺货商品『便携充电宝 20000mAh』已充入 500 件新库存，且商品在前台已重新上架！"
    }
  ]

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0]

  useEffect(() => {
    // Reset output panel when active scenario changes
    setCurrentStep(-1)
    setIsRunning(false)
    setStepMessages([])
  }, [activeScenarioId])

  const runNextStep = (stepIndex: number) => {
    if (stepIndex >= activeScenario.steps.length) {
      setIsRunning(false)
      activeScenario.effect({ products, setProducts, orders, setOrders, customers, setCustomers })
      toast.success(activeScenario.successMsg, {
        duration: 5000,
        position: "top-center"
      })
      return
    }

    const stepData = activeScenario.steps[stepIndex]
    setStepMessages(prev => [...prev, stepData])
    setCurrentStep(stepIndex)

    if (stepData.actionText) {
      toast.info(`[智能行为通知] ${stepData.actionText}`, {
        position: "bottom-left"
      })
    }

    // Auto-progress to next step with slight organic delay
    setTimeout(() => {
      runNextStep(stepIndex + 1)
    }, 2800)
  }

  const handleStartSimulation = () => {
    if (isRunning) return
    setIsRunning(true)
    setStepMessages([])
    setCurrentStep(0)
    runNextStep(0)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0">
      {/* List / Config Panel */}
      <div className="xl:col-span-5 flex flex-col gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-foreground/10 text-foreground">
              <Bot className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-semibold text-foreground">1. 选择智能协作团队</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            每个团队均由不同专业、不同知识模型的智能体组合而成，能跨界完成复杂业务链。
          </p>

          <div className="space-y-3">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  if (!isRunning) setActiveScenarioId(sc.id)
                }}
                disabled={isRunning}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  activeScenarioId === sc.id
                    ? "border-foreground bg-foreground/5 shadow-sm"
                    : "border-border hover:bg-muted/40"
                } ${isRunning ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-foreground">
                    {sc.teamName.split(" ")[0]}
                  </span>
                  <Badge variant={activeScenarioId === sc.id ? "default" : "secondary"} className="text-[10px]">
                    {sc.id === "marketing" ? "3智能体 · 营销" : sc.id === "refund" ? "3智能体 · 客满" : "3智能体 · 物流"}
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="p-1 rounded-md bg-foreground/5 text-foreground">
                    {sc.icon}
                  </span>
                  {sc.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {sc.teamDesc}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">协同状态监控 Panel</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">中枢通信事件流</span>
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                正在伺服
              </span>
            </div>
            <div className="pb-1">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-muted-foreground">中枢决策可用度 / 调度延迟</span>
                <span className="text-foreground">99.98% / 15ms</span>
              </div>
              <Progress value={99.9} className="h-1 bg-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Sandbox Terminal Output Panel */}
      <div className="xl:col-span-7 flex flex-col min-h-[480px] bg-neutral-950 text-neutral-300 border border-neutral-900 rounded-xl overflow-hidden shadow-2xl relative">
        {/* Terminal Header */}
        <div className="px-5 py-3.5 bg-neutral-900/60 border-b border-neutral-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono text-neutral-400">
              agent_workspace_core@{activeScenarioId}_thread.sh
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning && currentStep >= activeScenario.steps.length - 1 && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStepMessages([])
                  setCurrentStep(-1)
                }}
                className="h-7 px-2.5 rounded-lg hover:bg-neutral-800 text-xs border border-neutral-800 text-neutral-400 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                重置
              </Button>
            )}
            <Button
              onClick={handleStartSimulation}
              disabled={isRunning}
              className="h-8 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {isRunning ? "协同执掌中..." : "启动协同运作"}
            </Button>
          </div>
        </div>

        {/* Live Terminal Stream Content */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs space-y-4">
          <AnimatePresence initial={false}>
            {stepMessages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center text-neutral-500 py-20"
              >
                <Bot className="h-12 w-12 text-neutral-800 mb-3 animate-pulse" />
                <p className="text-xs font-medium">智能协同沙盘终端已准备就绪</p>
                <p className="text-[10px] text-neutral-600 mt-1 max-w-xs leading-normal">
                  请点击右上角的「启动协同运作」按钮，观看营销、客服、盘货与财务助理之间的真实分布式决策协作流。
                </p>
              </motion.div>
            )}

            {stepMessages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={`p-4 rounded-xl border leading-relaxed ${msg.color}`}
              >
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-neutral-900/30">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-neutral-900 text-neutral-100 flex items-center justify-center font-bold text-[10px]">
                      {msg.avatar}
                    </span>
                    <span className="font-bold text-[11px] uppercase tracking-wide">
                      {msg.displayName}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-neutral-800 text-neutral-400 capitalize">
                    {msg.agentName === "analytics" ? "Core Insights" : "Task executor"}
                  </Badge>
                </div>
                <p className="whitespace-pre-line leading-relaxed tracking-wide text-neutral-200 text-[11px]">
                  {msg.text}
                </p>

                {msg.actionText && (
                  <div className="mt-3 pt-2 border-t border-neutral-900/10 flex items-center gap-1 text-[10px] text-emerald-400/90 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>自动更改生效：{msg.actionText}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Execution Progress / Flow Summary Card */}
          {currentStep >= activeScenario.steps.length - 1 && !isRunning && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="p-5 rounded-xl bg-neutral-900/80 border border-emerald-500/20 text-neutral-200 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs pb-1 border-b border-neutral-800">
                <CheckCircle2 className="h-4 w-4" />
                <span>协作任务执行流汇结论 (Simulated Result)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-300">
                经过智能体多端分布式协同决策链路计算，该决策逻辑已经顺利完成。
                本系统采用底层<b>状态统一响应链 (Unified Lifecycle Chain)</b>，前台表格与财务指标已实时动态重新渲染：
              </p>

              <div className="grid grid-cols-2 gap-3 mt-1.5 p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <div>
                  <p className="text-[10px] text-neutral-500">受托行为目标</p>
                  <p className="text-xs text-white font-semibold mt-0.5">{activeScenario.title}</p>
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500">主要涉及状态修改</p>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                    {activeScenario.id === "marketing" ? "商品 PRD-001 零售价 → 85折" : activeScenario.id === "refund" ? "订单 ORD-9921 状态 → 已取消（退款）" : "商品 PRD-003 库存 → +500（上架）"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2">
                <span>消耗 Tokens: ~4,250 Tokens</span>
                <span>决策计算耗时: 15.6s</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
