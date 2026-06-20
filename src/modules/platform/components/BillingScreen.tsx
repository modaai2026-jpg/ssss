import React, { useState } from 'react';
import { CreditCard, ShieldCheck, RefreshCw, AlertCircle, Search, HelpCircle, ArrowUpRight } from 'lucide-react';
import { BillingGateway } from '../types';

interface BillingScreenProps {
  gateways: BillingGateway[];
  onToggleGateway: (id: string) => void;
  onUpdateGatewayMode: (id: string, mode: 'test' | 'live') => void;
}

export default function BillingScreen({ gateways, onToggleGateway, onUpdateGatewayMode }: BillingScreenProps) {
  const [syncedStatus, setSyncedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Realistic mock billing ledger
  const [billingLogs, setBillingLogs] = useState([
    { id: 'TX-90123', tenantName: '巴黎高级时装定制', gateway: 'Stripe', amount: 14200, status: 'settled', time: '2026-06-20 04:12' },
    { id: 'TX-90122', tenantName: '墨尔本极简家居', gateway: 'Stripe', amount: 5800, status: 'settled', time: '2026-06-19 23:35' },
    { id: 'TX-90121', tenantName: '东京独立手工匠坊', gateway: 'PayPal', amount: 1200, status: 'processing', time: '2026-06-19 18:22' },
    { id: 'TX-90120', tenantName: '柏林新锐先锋画廊', gateway: 'Manual Wire', amount: 21900, status: 'settled', time: '2026-06-19 11:04' },
  ]);

  const triggerSync = () => {
    setSyncedStatus('syncing');
    setTimeout(() => {
      setSyncedStatus('success');
      setTimeout(() => setSyncedStatus(null), 2500);
    }, 1205);
  };

  const filteredLogs = billingLogs.filter(log =>
    log.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Quick Action Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#e3e3e3] pb-4 mb-2">
        <div>
          <h3 className="text-16 font-bold text-neutral-900">统一计费网关与对公结算系统</h3>
          <p className="text-13 text-neutral-450">管理平台常态自动对账与 B2B 金融级清算路由</p>
        </div>
        <button
          onClick={triggerSync}
          disabled={syncedStatus === 'syncing'}
          className="px-4 py-2 bg-white border border-[#e3e3e3] text-neutral-700 hover:border-neutral-400 text-13 font-bold rounded-16 cursor-pointer flex items-center space-x-1.5 shadow-3xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#008060] ${syncedStatus === 'syncing' ? 'animate-spin' : ''}`} />
          <span>{syncedStatus === 'syncing' ? '自动清对账中...' : syncedStatus === 'success' ? '对账完毕' : '手动对账对齐'}</span>
        </button>
      </div>

      {/* Gateway Grid Configurations - Stripe, Paypal, Manual Wire */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {gateways.map((gate) => (
          <div key={gate.id} className="bg-white border border-[#e3e3e3] p-5 rounded-24 flex flex-col justify-between hover:border-neutral-400 transition-all shadow-3xs relative">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-13 font-extrabold text-neutral-950 uppercase tracking-widest font-mono flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-[#008060]" />
                  <span>{gate.name} 清算网关</span>
                </span>
                
                {/* Checkbox proxy */}
                <input
                  type="checkbox"
                  checked={gate.status === 'active'}
                  onChange={() => onToggleGateway(gate.id)}
                  className="rounded text-[#008060] focus:ring-[#008060] w-4.5 h-4.5 cursor-pointer accent-[#008060]"
                />
              </div>

              <div className="mt-4 border-t border-neutral-105 pt-3.5 space-y-2">
                <div className="flex justify-between text-13 text-neutral-500">
                  <span>商户大宗清账账号</span>
                  <strong className="font-mono text-neutral-800 font-bold">{gate.account}</strong>
                </div>
                <div className="flex justify-between text-13 text-neutral-500">
                  <span>常态轮询清障频率</span>
                  <strong className="font-mono text-neutral-800 font-bold">{gate.syncInterval}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-neutral-100 pt-3 flex items-center justify-between text-[11.5px]">
              <span className="text-neutral-450 font-semibold font-mono">底层沙盒模式</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => onUpdateGatewayMode(gate.id, 'test')}
                  className={`px-2 py-0.8 font-bold rounded-lg cursor-pointer ${
                    gate.mode === 'test' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f6f6f7] text-neutral-500'
                  }`}
                >
                  Sandbox
                </button>
                <button
                  onClick={() => onUpdateGatewayMode(gate.id, 'live')}
                  className={`px-2 py-0.8 font-bold rounded-lg cursor-pointer ${
                    gate.mode === 'live' ? 'bg-[#e6f2ee] text-[#008060] border border-emerald-250' : 'bg-[#f6f6f7] text-neutral-500'
                  }`}
                >
                  Live 线上
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Receipts Ledger Area */}
      <div className="bg-white border border-[#e3e3e3] rounded-24 p-6 shadow-3xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h4 className="text-13 uppercase font-extrabold text-neutral-450 tracking-wider font-mono">账款往来物理收支记账</h4>
          
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="搜索收支单标识"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-[#f6f6f7] border border-neutral-200 rounded-16 text-xs focus:outline-none focus:ring-1 focus:ring-[#008060]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-13">
            <thead>
              <tr className="bg-[#f6f6f7] border-b border-[#e3e3e3] text-neutral-450 font-semibold font-mono">
                <th className="p-4">收支单ID</th>
                <th className="p-4">租户商户</th>
                <th className="p-4">清结算通道</th>
                <th className="p-4">清账时间</th>
                <th className="p-4 text-right">账面流转金额</th>
                <th className="p-4 text-center">物理合规审计</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e3e3]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f6f6f7]/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-neutral-700">{log.id}</td>
                  <td className="p-4 font-bold text-neutral-900">{log.tenantName}</td>
                  <td className="p-4 text-neutral-500 font-medium">{log.gateway}</td>
                  <td className="p-4 font-mono text-neutral-450">{log.time}</td>
                  <td className="p-4 text-right font-mono font-black text-neutral-950">€{log.amount.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      log.status === 'settled' ? 'bg-[#e6f2ee] text-[#008060] border border-emerald-250' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {log.status === 'settled' ? '清算完成(Settled)' : '多端对账中'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
