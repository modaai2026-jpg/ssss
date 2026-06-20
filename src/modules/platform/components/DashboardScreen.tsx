import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { LayoutDashboard, Coins, Users, Building2, TrendingUp, Cpu, Server, ShieldCheck } from 'lucide-react';
import { TenantDisk } from '../types';

interface DashboardScreenProps {
  tenants: TenantDisk[];
}

export default function DashboardScreen({ tenants }: DashboardScreenProps) {
  const analyticsData = [
    { name: '06-14', revenue: 41000, tenants: 412, cpu: 22 },
    { name: '06-15', revenue: 48000, tenants: 418, cpu: 28 },
    { name: '06-16', revenue: 45000, tenants: 420, cpu: 25 },
    { name: '06-17', revenue: 52000, tenants: 425, cpu: 31 },
    { name: '06-18', revenue: 61000, tenants: 429, cpu: 38 },
    { name: '06-19', revenue: 58000, tenants: 432, cpu: 32 },
    { name: '06-20', revenue: 63000, tenants: 435, cpu: 35 },
  ];

  const totalRevenue = tenants.reduce((acc, t) => acc + t.revenue, 0);
  const activeCount = tenants.filter(t => t.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* HUD OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-[#e3e3e3] p-6 rounded-2xl shadow-3xs flex flex-col justify-between hover:border-neutral-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-13 text-neutral-450 font-medium">平台累计常态流转额</span>
            <span className="p-2 bg-emerald-50 text-[#008060] rounded-2s">
              <Coins className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-24 font-bold text-neutral-900">€{totalRevenue.toLocaleString()}</h4>
            <span className="text-13 text-[#008060] font-semibold mt-1 block">比上周同期增长 +14.2%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#e3e3e3] p-6 rounded-2xl shadow-3xs flex flex-col justify-between hover:border-neutral-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-13 text-neutral-450 font-medium">核心入驻品牌商户</span>
            <span className="p-2 bg-neutral-100 text-neutral-900 rounded-2s">
              <Building2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-24 font-bold text-neutral-900">{tenants.length} 户</h4>
            <span className="text-13 text-neutral-455 mt-1 block">物理集群活跃率 {((activeCount / tenants.length) * 105).toFixed(0)}%</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#e3e3e3] p-6 rounded-2xl shadow-3xs flex flex-col justify-between hover:border-neutral-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-13 text-neutral-450 font-medium">昨日安全处理流速</span>
            <span className="p-2 bg-neutral-100 text-neutral-900 rounded-2s">
              <Server className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-24 font-bold text-neutral-900">222k req</h4>
            <span className="text-13 text-emerald-800 font-semibold mt-1 block">无拦截死锁响应 100%</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#e3e3e3] p-6 rounded-2xl shadow-3xs flex flex-col justify-between hover:border-neutral-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-13 text-neutral-450 font-medium">安全盾防火墙探针</span>
            <span className="p-2 bg-emerald-50 text-[#008060] rounded-2s">
              <ShieldCheck className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-24 font-bold text-[#008060]">完美 (A级)</h4>
            <span className="text-13 text-neutral-500 mt-1 block">双重操作审计均已就绪</span>
          </div>
        </div>
      </div>

      {/* RECHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#e3e3e3] rounded-24 p-6 hover:shadow-2xs transition-all">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-4 mb-4">
            <div>
              <h3 className="text-16 font-bold text-neutral-900">平台常态财务流转趋势</h3>
              <p className="text-13 text-neutral-450">实时同步国际计费网关账单并清洗</p>
            </div>
            <span className="font-mono text-13 text-[#008060] bg-emerald-50 px-2 py-0.5 rounded-lg font-bold">24H Live</span>
          </div>
          
          <div className="h-56 pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlatGreen-m" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008060" stopOpacity={0.16}/>
                    <stop offset="95%" stopColor="#008060" stopOpacity={0.005}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" stroke="#b5b5b5" style={{ fontSize: '11px' }} tickLine={false} />
                <YAxis stroke="#b5b5b5" style={{ fontSize: '11px' }} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#008060" strokeWidth={2} fillOpacity={1} fill="url(#colorPlatGreen-m)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#e3e3e3] rounded-24 p-6 hover:shadow-2xs transition-all flex flex-col justify-between">
          <div>
            <h3 className="text-16 font-bold text-neutral-900">物理节点负载占用率</h3>
            <p className="text-13 text-neutral-450">每分对账及自动回档保护耗损</p>
          </div>

          <div className="h-44 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" stroke="#b5b5b5" style={{ fontSize: '11px' }} tickLine={false} />
                <YAxis stroke="#b5b5b5" style={{ fontSize: '11px' }} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="cpu" fill="#1a1a1a" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
