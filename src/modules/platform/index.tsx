import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, ShieldCheck, Sliders, Bell, LayoutDashboard, Building2, 
  Award, CreditCard, BarChart2, MessageSquare, ToggleLeft, Zap, HelpCircle 
} from 'lucide-react';

import DashboardScreen from './components/DashboardScreen';
import TenantsScreen from './components/TenantsScreen';
import PlansScreen from './components/PlansScreen';
import BillingScreen from './components/BillingScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import SupportScreen from './components/SupportScreen';
import SystemScreen from './components/SystemScreen';

import { 
  TenantDisk, PlanPackage, SubscriptionRecord, 
  BillingGateway, SupportTicket, WebhookDeliveryLog 
} from './types';

export default function PlatformRootHub() {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'tenants' | 'plans' | 'billing' | 'analytics' | 'support' | 'system'>('dashboard');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Core global module states that circulate into children screens
  const [tenants, setTenants] = useState<TenantDisk[]>([
    { 
      id: 'T-101', name: '巴黎高级时装定制', owner: 'Marc Laurent', plan: '旗舰套餐', 
      status: 'active', apiRequests: 42100, apiLimit: 80000, 
      cpuUsage: 4, memUsage: 16384, diskUsage: 500, revenue: 14200, 
      region: '欧盟一区(EU-West)', since: '2026-01-12' 
    },
    { 
      id: 'T-102', name: '墨尔本极简家居', owner: 'Sarah Chen', plan: '专业版', 
      status: 'active', apiRequests: 18900, apiLimit: 40000, 
      cpuUsage: 2, memUsage: 8192, diskUsage: 200, revenue: 5800, 
      region: '亚太新加坡(AP-South)', since: '2026-02-18' 
    },
    { 
      id: 'T-103', name: '东京独立手工匠坊', owner: 'Kenji Sato', plan: '基础套餐', 
      status: 'suspended', apiRequests: 1200, apiLimit: 10000, 
      cpuUsage: 1, memUsage: 4096, diskUsage: 50, revenue: 1200, 
      region: '亚太新加坡(AP-South)', since: '2026-03-01' 
    },
    { 
      id: 'T-104', name: '柏林新锐先锋画廊', owner: 'Emma Müller', plan: '旗舰套餐', 
      status: 'active', apiRequests: 62000, apiLimit: 80000, 
      cpuUsage: 4, memUsage: 16384, diskUsage: 500, revenue: 21900, 
      region: '欧洲中心一区(EU-West)', since: '2026-04-05' 
    },
  ]);

  const [plans, setPlans] = useState<PlanPackage[]>([
    { id: 'plan-basic', name: '基础套餐', price: 99, billingPeriod: 'monthly', features: ['1000 API 请求数', '单店 50 SKU 限制', '周常态对账汇总'], subscribersCount: 142, quotaLimit: '10k次/月' },
    { id: 'plan-pro', name: '专业版', price: 299, billingPeriod: 'monthly', features: ['40000 API 请求数', '无限制产品上架', '支持 Stripe / PayPal 清算'], subscribersCount: 318, quotaLimit: '40k次/月' },
    { id: 'plan-enterprise', name: '旗舰套餐', price: 899, billingPeriod: 'monthly', features: ['80000 API 请求数', '物理多活核心保障', '专用双因子 SLA 支持'], subscribersCount: 85, quotaLimit: '80k次/月' },
  ]);

  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([
    { id: 'SUB-4091', tenantId: 'T-101', tenantName: '巴黎高级时装定制', planName: '旗舰套餐', amount: 899, status: 'active', nextBillingAt: '2026-07-12' },
    { id: 'SUB-4092', tenantId: 'T-102', tenantName: '墨尔本极简家居', planName: '专业版', amount: 299, status: 'active', nextBillingAt: '2026-07-18' },
    { id: 'SUB-4093', tenantId: 'T-103', tenantName: '东京独立手工匠坊', planName: '基础套餐', amount: 99, status: 'past-due', nextBillingAt: '2026-06-19' },
    { id: 'SUB-4094', tenantId: 'T-104', tenantName: '柏林新锐先锋画廊', planName: '旗舰套餐', amount: 899, status: 'active', nextBillingAt: '2026-07-05' },
  ]);

  const [gateways, setGateways] = useState<BillingGateway[]>([
    { id: 'stripe', name: 'Stripe 离岸网关', status: 'active', account: 'acct_1N9B4E_live', syncInterval: '12小时', mode: 'live' },
    { id: 'paypal', name: 'PayPal 跨境清算', status: 'inactive', account: 'pp_merchant_7c_sandbox', syncInterval: '24小时', mode: 'test' },
    { id: 'wire_bank', name: '银行对公直电接结算', status: 'active', account: 'manual_wire_standard', syncInterval: '每周结算', mode: 'live' },
  ]);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: 'TK-8812', tenantName: '巴黎时装定制', title: 'Stripe 欧元双端汇率物理套算差异', priority: 'high', status: 'open', createdAt: '2026-06-19' },
    { id: 'TK-8810', tenantName: '柏林画廊', title: 'B2B 物理提现账目暂挂疑问', priority: 'critical', status: 'pending', createdAt: '2026-06-18' },
    { id: 'TK-8809', tenantName: '东京手作坊', title: 'API Webhook 密钥定期强制轮换', priority: 'medium', status: 'resolved', createdAt: '2026-06-15' },
  ]);

  const [webhookLogs, setWebhookLogs] = useState<WebhookDeliveryLog[]>([
    { id: 'D-801', topic: 'order.created (订单创建)', endpoint: 'https://api.atelier-paris.com/hook', timestamp: '2026-06-20 05:21', responseCode: 200, durationMs: 45, payloadSize: '2.4KB' },
    { id: 'D-802', topic: 'tenant.limits.reached (配额物理上限触发)', endpoint: 'https://api.melbourne-minimal.com/hook', timestamp: '2026-06-20 05:18', responseCode: 200, durationMs: 120, payloadSize: '1.2KB' },
    { id: 'D-803', topic: 'subscription.payment.success (账期强制扣款成功)', endpoint: 'https://analytics.atelier-paris.com/payouts', timestamp: '2026-06-20 05:12', responseCode: 201, durationMs: 95, payloadSize: '3.1KB' },
  ]);

  // Command handlers
  const pushToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleToggleTenant = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        const next = t.status === 'active' ? 'suspended' : 'active';
        pushToast(`租户物理仓 ${t.name} 服务状态重构：${next === 'active' ? '服务激活' : '锁定挂起'}`);
        return { ...t, status: next };
      }
      return t;
    }));
  };

  const handleAddTenant = (name: string, plan: string, region: string) => {
    const nextId = `T-${100 + tenants.length + 1}`;
    const newT: TenantDisk = {
      id: nextId,
      name,
      owner: '商户总管理员',
      plan,
      region,
      status: 'active',
      apiRequests: 0,
      apiLimit: plan === '旗舰套餐' ? 80000 : plan === '专业版' ? 40000 : 10000,
      cpuUsage: plan === '旗舰套餐' ? 4 : plan === '专业版' ? 2 : 1,
      memUsage: plan === '旗舰套餐' ? 16384 : plan === '专业版' ? 8192 : 4096,
      diskUsage: plan === '旗舰套餐' ? 500 : plan === '专业版' ? 200 : 50,
      revenue: 0,
      since: '2026-06-20'
    };
    setTenants([newT, ...tenants]);
    pushToast(`商户 ${name} 物理租户仓快速对准下拨完毕`);
  };

  const handleUpdateQuotas = (id: string, quotaField: string, value: number) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, [quotaField]: value };
      }
      return t;
    }));
    pushToast('租户控制台配额实时指令更新完成');
  };

  const handleUpdatePlanPrice = (id: string, price: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, price };
      }
      return p;
    }));
    pushToast('套餐销售定价重定义成功');
  };

  const handleAddPlan = (name: string, price: number, quota: string, features: string[]) => {
    const newP: PlanPackage = {
      id: `plan-${Math.floor(Math.random() * 900) + 100}`,
      name,
      price,
      billingPeriod: 'monthly',
      features,
      quotaLimit: quota,
      subscribersCount: 0
    };
    setPlans([...plans, newP]);
    pushToast(`商业新套餐【${name}】下拨完成`);
  };

  const handleToggleGateway = (id: string) => {
    setGateways(prev => prev.map(gate => {
      if (gate.id === id) {
        const next = gate.status === 'active' ? 'inactive' : 'active';
        pushToast(`结算通道 ${gate.name}：${next === 'active' ? '挂机上线' : '关断停用'}`);
        return { ...gate, status: next };
      }
      return gate;
    }));
  };

  const handleUpdateGatewayMode = (id: string, mode: 'test' | 'live') => {
    setGateways(prev => prev.map(gate => {
      if (gate.id === id) {
        return { ...gate, mode };
      }
      return gate;
    }));
    pushToast(`通道 ${id} 清算工作断点重构为: ${mode === 'live' ? '线上商业模式' : '底层沙盒测试'}`);
  };

  const handleAddTicket = (sender: string, title: string, priority: 'low' | 'medium' | 'high' | 'critical') => {
    const newTK: SupportTicket = {
      id: `TK-${Math.floor(Math.random() * 8000) + 1000}`,
      tenantName: sender,
      title,
      priority,
      status: 'open',
      createdAt: '2026-06-20'
    };
    setTickets([newTK, ...tickets]);
    pushToast('物理故障工单入栈对准');
  };

  const handleResolveTicket = (id: string) => {
    setTickets(prev => prev.map(tk => {
      if (tk.id === id) {
        return { ...tk, status: 'resolved' };
      }
      return tk;
    }));
    pushToast(`工单 ${id} 物理妥协修复完成`);
  };

  const triggerWebhookSim = () => {
    const choices = [
      { topic: 'tenant.growth.scale (物理商户高速增长)', payload: '1.4KB' },
      { topic: 'order.dispute.opened (退单争议召回)', payload: '2.8KB' },
      { topic: 'security.payout.hold (大单延迟结算通告)', payload: '3.0KB' },
    ];
    const item = choices[Math.floor(Math.random() * choices.length)];
    const timeNow = new Date();
    const timeStr = `${String(timeNow.getHours()).padStart(2, '0')}:${String(timeNow.getMinutes()).padStart(2, '0')}`;
    const newLog: WebhookDeliveryLog = {
      id: `D-${Math.floor(Math.random() * 900) + 100}`,
      topic: item.topic,
      endpoint: 'https://security.atelier-prod/gate',
      timestamp: `2026-06-20 ${timeStr}`,
      responseCode: Math.random() > 0.05 ? 200 : 500,
      durationMs: Math.floor(Math.random() * 150) + 30,
      payloadSize: item.payload
    };
    setWebhookLogs([newLog, ...webhookLogs]);
    pushToast(`成功触发自检通知投递: HTTP ${newLog.responseCode}`);
  };

  const clearWebhookLogs = () => {
    setWebhookLogs([]);
    pushToast('对账投递日志对齐清空');
  };

  // Sub tab navigation specifications
  const subNavItems = [
    { id: 'dashboard', label: '控制大盘/总览', icon: LayoutDashboard },
    { id: 'tenants', label: '多商户租户仓', icon: Building2 },
    { id: 'plans', label: '套餐销售及定价', icon: Award },
    { id: 'billing', label: '计费及结算网关', icon: CreditCard },
    { id: 'analytics', label: '租存与分群分析', icon: BarChart2 },
    { id: 'support', label: 'SLA物理客服', icon: MessageSquare },
    { id: 'system', label: '配置、安全与事件', icon: Sliders },
  ] as const;

  return (
    <div className="bg-[#f6f6f7] min-h-screen p-6 font-sans antialiased text-neutral-800 space-y-6">
      
      {/* Real-time floating master state toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] text-white border border-neutral-700/60 px-5 py-3 rounded-20 text-xs font-extrabold shadow-2xl flex items-center space-x-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#008060] animate-pulse"></span>
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SYSTEM META PLATFORM FLAG */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#e3e3e3] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-neutral-900 text-white rounded text-[9px] font-mono font-bold tracking-widest uppercase">
              PLATFORM TOTAL ADMIN - MASTER CORE
            </span>
            <span className="flex items-center space-x-1 text-[10px] font-bold text-[#008060] bg-emerald-50 border border-emerald-150 px-1.5 rounded">
              <ShieldCheck className="w-3 h-3" />
              <span>SSL 校验通过</span>
            </span>
          </div>
          <h2 className="text-24 font-black text-neutral-900 mt-1 tracking-tight">SaaS 物理总系统平台大本营</h2>
          <p className="text-13 text-neutral-500 mt-0.5">多活租户流转系统、套餐计费配置、国际结算通道、安全与 Webhook 底账总览</p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={triggerWebhookSim}
            className="px-3 py-1.5 bg-white border border-[#e3e3e3] hover:border-neutral-400 text-neutral-700 text-13 font-bold rounded-16 cursor-pointer flex items-center space-x-1 hover:shadow-xs transition-all"
          >
            <Zap className="w-4 h-4 text-[#008060]" />
            <span>一键轮询 Webhook</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC METADATA SUB-NAV TILES (Apple/Shopify Class Tab Layout) */}
      <div className="flex flex-wrap gap-1.5 bg-white border border-[#e3e3e3] p-1.5 rounded-24 shadow-3xs overflow-x-auto">
        {subNavItems.map((item) => {
          const IconComp = item.icon;
          const isSelected = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`flex items-center space-x-2 px-4.5 py-2 rounded-20 text-13 font-extrabold cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-neutral-900 text-white shadow-sm' 
                  : 'text-neutral-600 hover:bg-[#f6f6f7] hover:text-neutral-900'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE SCREEN DISPATCH */}
      <div className="min-h-[400px]">
        {activeSubTab === 'dashboard' && <DashboardScreen tenants={tenants} />}
        {activeSubTab === 'tenants' && (
          <TenantsScreen 
            tenants={tenants} 
            onToggleStatus={handleToggleTenant} 
            onAddTenant={handleAddTenant} 
            onUpdateQuotas={handleUpdateQuotas} 
          />
        )}
        {activeSubTab === 'plans' && (
          <PlansScreen 
            plans={plans} 
            subscriptions={subscriptions} 
            onUpdatePlanPrice={handleUpdatePlanPrice} 
            onAddPlan={handleAddPlan} 
          />
        )}
        {activeSubTab === 'billing' && (
          <BillingScreen 
            gateways={gateways} 
            onToggleGateway={handleToggleGateway} 
            onUpdateGatewayMode={handleUpdateGatewayMode} 
          />
        )}
        {activeSubTab === 'analytics' && <AnalyticsScreen />}
        {activeSubTab === 'support' && (
          <SupportScreen 
            tickets={tickets} 
            onAddTicket={handleAddTicket} 
            onResolveTicket={handleResolveTicket} 
          />
        )}
        {activeSubTab === 'system' && (
          <SystemScreen 
            webhookLogs={webhookLogs} 
            onTriggerWebhookSim={triggerWebhookSim} 
            onClearLogs={clearWebhookLogs} 
          />
        )}
      </div>

      {/* MASTER NOTATIONAL FOOTER */}
      <div className="pt-6 border-t border-[#e3e3e3] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 font-mono gap-2">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008060] animate-ping"></span>
          <span>Atelier SaaS Platform Admin Sink-Root Console Active</span>
        </div>
        <span>Shopify Polaris Architecture — Master Enterprise 12.4.9</span>
      </div>

    </div>
  );
}
