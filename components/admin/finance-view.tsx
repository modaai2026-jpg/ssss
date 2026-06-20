"use client"

import { CreditCard, Wallet, Receipt, ArrowUpRight, ArrowDownLeft, Download, Filter, Calendar, TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const transactions = [
  { id: "1", type: "income", description: "订单收入 #ORD-2024-001", amount: 2580, status: "completed", date: "2024-01-20 14:30" },
  { id: "2", type: "income", description: "订单收入 #ORD-2024-002", amount: 1890, status: "completed", date: "2024-01-20 12:15" },
  { id: "3", type: "expense", description: "广告费用 - Google Ads", amount: -3500, status: "completed", date: "2024-01-20 10:00" },
  { id: "4", type: "income", description: "订单收入 #ORD-2024-003", amount: 4200, status: "pending", date: "2024-01-19 18:45" },
  { id: "5", type: "expense", description: "物流费用结算", amount: -1200, status: "completed", date: "2024-01-19 16:30" },
  { id: "6", type: "refund", description: "退款 #REF-2024-001", amount: -580, status: "completed", date: "2024-01-19 14:00" },
  { id: "7", type: "income", description: "订单收入 #ORD-2024-004", amount: 3150, status: "completed", date: "2024-01-18 11:20" },
  { id: "8", type: "expense", description: "平台服务费", amount: -500, status: "completed", date: "2024-01-18 09:00" },
]

const bills = [
  { id: "1", name: "平台月度服务费", amount: 2999, dueDate: "2024-02-01", status: "pending" },
  { id: "2", name: "短信服务包 - 10000条", amount: 500, dueDate: "2024-01-25", status: "overdue" },
  { id: "3", name: "云存储服务 - 100GB", amount: 199, dueDate: "2024-02-15", status: "upcoming" },
]

export function FinanceView() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "pending": return <Clock className="h-4 w-4 text-amber-500" />
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  const getBillStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "overdue": return "bg-red-500/10 text-red-500 border-red-500/20"
      case "upcoming": return "bg-muted text-muted-foreground border-border"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getBillStatusText = (status: string) => {
    switch (status) {
      case "pending": return "待支付"
      case "overdue": return "已逾期"
      case "upcoming": return "即将到期"
      default: return status
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">财务管理</h1>
              <p className="text-sm text-muted-foreground mt-0.5">收入支出与账单管理</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                本月
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                导出
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Wallet className="h-4 w-4" />
              <span className="text-sm">可用余额</span>
            </div>
            <p className="text-2xl font-bold text-foreground">¥ 128,450.00</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-xs text-emerald-500">+12.5% vs 上月</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">本月收入</span>
            </div>
            <p className="text-2xl font-bold text-emerald-500">¥ 89,320.00</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-xs text-emerald-500">+8.3% vs 上月</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <ArrowDownLeft className="h-4 w-4" />
              <span className="text-sm">本月支出</span>
            </div>
            <p className="text-2xl font-bold text-red-500">¥ 23,680.00</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="h-3 w-3 text-emerald-500" />
              <span className="text-xs text-emerald-500">-5.2% vs 上月</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Receipt className="h-4 w-4" />
              <span className="text-sm">待付账单</span>
            </div>
            <p className="text-2xl font-bold text-foreground">¥ 3,698.00</p>
            <div className="flex items-center gap-1 mt-2">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              <span className="text-xs text-amber-500">3 笔待处理</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="transactions">交易记录</TabsTrigger>
              <TabsTrigger value="bills">账单</TabsTrigger>
              <TabsTrigger value="payments">付款方式</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              筛选
            </Button>
          </div>

          <TabsContent value="transactions">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="divide-y divide-border">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === "income" ? "bg-emerald-500/10" : 
                        tx.type === "refund" ? "bg-amber-500/10" : "bg-red-500/10"
                      }`}>
                        {tx.type === "income" ? (
                          <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                        ) : tx.type === "refund" ? (
                          <ArrowDownLeft className="h-5 w-5 text-amber-500" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusIcon(tx.status)}
                      <span className={`text-sm font-semibold ${
                        tx.amount > 0 ? "text-emerald-500" : "text-red-500"
                      }`}>
                        {tx.amount > 0 ? "+" : ""}¥{Math.abs(tx.amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bills">
            <div className="space-y-3">
              {bills.map((bill) => (
                <div key={bill.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{bill.name}</p>
                      <p className="text-xs text-muted-foreground">到期日: {bill.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className={getBillStatusColor(bill.status)}>
                      {getBillStatusText(bill.status)}
                    </Badge>
                    <span className="text-sm font-semibold text-foreground">¥{bill.amount.toLocaleString()}</span>
                    <Button size="sm">支付</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">银行卡</p>
                    <p className="text-sm text-muted-foreground">**** **** **** 4242</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">默认付款方式</span>
                  <Badge variant="secondary">默认</Badge>
                </div>
              </div>
              <div className="bg-card border border-border border-dashed rounded-xl p-5 flex items-center justify-center cursor-pointer hover:border-foreground/30 transition-colors">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">添加付款方式</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
