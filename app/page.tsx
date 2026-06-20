"use client"

import { useState, useEffect } from "react"
import type { ActiveTab } from "@/lib/types"
import { mockProducts, mockOrders, mockCustomers } from "@/lib/data"
import { AdminSidebar } from "@/components/admin/sidebar"
import { CommandBar } from "@/components/admin/command-bar"
import { AIPanel } from "@/components/admin/ai-panel"
import { DashboardView } from "@/components/admin/dashboard-view"
import { ProductsView } from "@/components/admin/products-view"
import { OrdersView } from "@/components/admin/orders-view"
import { CustomersView } from "@/components/admin/customers-view"
import { StoresView } from "@/components/admin/stores-view"
import { MerchantsView } from "@/components/admin/merchants-view"
import { AgentsView } from "@/components/admin/agents-view"
import { MarketingView } from "@/components/admin/marketing-view"
import { FinanceView } from "@/components/admin/finance-view"
import { AnalyticsView } from "@/components/admin/analytics-view"
import { SettingsView } from "@/components/admin/settings-view"
import { ThemeEditorView } from "@/components/admin/theme-editor-view"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)

  // Load from localStorage on client mount
  useEffect(() => {
    const cachedProducts = localStorage.getItem("studio_products")
    if (cachedProducts) {
      try { 
        setProducts(JSON.parse(cachedProducts)) 
      } catch (e) { 
        console.error(e) 
        setProducts([])
      }
    } else {
      localStorage.setItem("studio_products", JSON.stringify([]))
      setProducts([])
    }

    const cachedOrders = localStorage.getItem("studio_orders")
    if (cachedOrders) {
      try { 
        setOrders(JSON.parse(cachedOrders)) 
      } catch (e) { 
        console.error(e) 
        setOrders([])
      }
    } else {
      localStorage.setItem("studio_orders", JSON.stringify([]))
      setOrders([])
    }

    const cachedCustomers = localStorage.getItem("studio_customers")
    if (cachedCustomers) {
      try { 
        setCustomers(JSON.parse(cachedCustomers)) 
      } catch (e) { 
        console.error(e) 
        setCustomers([])
      }
    } else {
      localStorage.setItem("studio_customers", JSON.stringify([]))
      setCustomers([])
    }
  }, [])

  // Persisting custom state setters
  const updateProducts = (newProducts: typeof mockProducts) => {
    setProducts(newProducts)
    localStorage.setItem("studio_products", JSON.stringify(newProducts))
  }

  const updateOrders = (newOrders: typeof mockOrders) => {
    setOrders(newOrders)
    localStorage.setItem("studio_orders", JSON.stringify(newOrders))
  }

  const updateCustomers = (newCustomers: typeof mockCustomers) => {
    setCustomers(newCustomers)
    localStorage.setItem("studio_customers", JSON.stringify(newCustomers))
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView products={products} setProducts={updateProducts} orders={orders} setOrders={updateOrders} customers={customers} setCustomers={updateCustomers} />
      case "products":
        return <ProductsView products={products} setProducts={updateProducts} />
      case "orders":
        return <OrdersView orders={orders} setOrders={updateOrders} />
      case "customers":
        return <CustomersView customers={customers} setCustomers={updateCustomers} />
      case "stores":
        return <StoresView />
      case "merchants":
        return <MerchantsView />
      case "agents":
        return <AgentsView />
      case "marketing":
        return <MarketingView />
      case "billing":
        return <FinanceView />
      case "analytics":
        return <AnalyticsView />
      case "settings":
        return <SettingsView />
      case "content":
        return <ThemeEditorView />
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-2">即将推出</p>
              <p className="text-sm text-muted-foreground">此功能正在开发中</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {renderContent()}
      </main>

      {/* AI Panel */}
      <AIPanel 
        isOpen={isAIPanelOpen} 
        onClose={() => setIsAIPanelOpen(false)} 
        onOpen={() => setIsAIPanelOpen(true)}
      />

      {/* Command Bar */}
      <CommandBar 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        setActiveTab={setActiveTab}
      />
    </div>
  )
}
