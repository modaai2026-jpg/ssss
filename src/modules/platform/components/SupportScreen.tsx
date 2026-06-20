import React, { useState } from 'react';
import { HelpCircle, Search, FileText, CheckCircle2, MessageSquare, AlertTriangle, Plus } from 'lucide-react';
import { SupportTicket } from '../types';

interface SupportScreenProps {
  tickets: SupportTicket[];
  onAddTicket: (sender: string, title: string, priority: 'low' | 'medium' | 'high' | 'critical') => void;
  onResolveTicket: (id: string) => void;
}

export default function SupportScreen({ tickets, onAddTicket, onResolveTicket }: SupportScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSender, setNewSender] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTickets = tickets.filter(tk =>
    tk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tk.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tk.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSender) return;
    onAddTicket(newSender, newTitle, newPriority);
    setNewTitle('');
    setNewSender('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Quick filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#e3e3e3] pb-4 mb-2">
        <div>
          <h3 className="text-16 font-bold text-neutral-900">多租户商户 SLA 工单支持中心</h3>
          <p className="text-13 text-neutral-450">物理对接 Atelier Core 客服系统，确保 B2B 全天候平顺运转</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white text-13 font-bold rounded-16 cursor-pointer flex items-center space-x-1 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>手工派发物理异常工单</span>
        </button>
      </div>

      {/* SLA Threshold status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e3e3e3] p-5 rounded-24 shadow-3xs hover:border-neutral-400 transition-all">
          <span className="text-11 font-mono uppercase tracking-widest text-[#008060] font-bold">SLA FIRST RESPONSE</span>
          <h4 className="text-16 font-extrabold text-neutral-950 mt-1">首单物理回复均时</h4>
          <strong className="text-20 font-bold font-mono text-neutral-900 mt-1 block">18.4 分钟</strong>
        </div>

        <div className="bg-white border border-[#e3e3e3] p-5 rounded-24 shadow-3xs hover:border-neutral-400 transition-all">
          <span className="text-11 font-mono uppercase tracking-widest text-[#008060] font-bold">ACCELERATED CHANNELS</span>
          <h4 className="text-16 font-extrabold text-neutral-950 mt-1">极速加固通道活跃</h4>
          <strong className="text-20 font-bold font-mono text-neutral-900 mt-1 block">8 / 8 组在线</strong>
        </div>

        <div className="bg-white border border-[#e3e3e3] p-5 rounded-24 shadow-3xs hover:border-neutral-400 transition-all">
          <span className="text-11 font-mono uppercase tracking-widest text-[#1a1a1a] font-bold">TOTAL UNRESOLVED</span>
          <h4 className="text-16 font-extrabold text-neutral-950 mt-1">待完结阻截问题</h4>
          <strong className="text-20 font-bold font-mono text-rose-600 mt-1 block">{tickets.filter(t => t.status !== 'resolved').length} 件</strong>
        </div>
      </div>

      {/* Live table list */}
      <div className="bg-white border border-[#e3e3e3] rounded-24 p-6 shadow-3xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h4 className="text-13 uppercase font-extrabold text-neutral-450 tracking-wider font-mono">排队待处理及锁定工单流</h4>
          
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-450">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="搜索工单、发起人、标识"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.8 bg-[#f6f6f7] border border-neutral-200 rounded-16 text-xs focus:outline-none focus:ring-1 focus:ring-[#008060]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-13">
            <thead>
              <tr className="bg-[#f6f6f7] border-b border-[#e3e3e3] text-neutral-450 font-semibold font-mono">
                <th className="p-4 w-16">工单ID</th>
                <th className="p-4">发起商户</th>
                <th className="p-4">故障说明</th>
                <th className="p-4">发起时间</th>
                <th className="p-4 text-center">优先级</th>
                <th className="p-4 text-center">状态</th>
                <th className="p-4 text-right w-24">物理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e3e3]">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">目前暂无排队挂起工单。</td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-neutral-700">{t.id}</td>
                    <td className="p-4 font-bold text-neutral-900">{t.tenantName}</td>
                    <td className="p-4 text-neutral-600 font-medium">{t.title}</td>
                    <td className="p-4 font-mono text-neutral-450">{t.createdAt}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold uppercase ${
                        t.priority === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200 font-black' :
                        t.priority === 'high' ? 'bg-amber-50 text-amber-800' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-lg text-[9.5px] font-semibold ${
                        t.status === 'open' ? 'bg-[#1a1a1a] text-white' :
                        t.status === 'pending' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-50 text-[#008060]'
                      }`}>
                        {t.status === 'open' ? '待完结' : t.status === 'pending' ? '处理中' : '已完结'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {t.status !== 'resolved' ? (
                        <button
                          onClick={() => onResolveTicket(t.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#008060] text-[10.5px] font-extrabold rounded-lg cursor-pointer transition-colors"
                        >
                          标记处理完结
                        </button>
                      ) : (
                        <span className="text-[11.5px] text-neutral-400 font-bold decoration-dotted">固化对账完成</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual support modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white border-2 border-neutral-900 p-6 rounded-24 max-w-sm w-full space-y-4">
            <h3 className="text-16 font-bold text-neutral-950">手工拨备安全及物理工单</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-13 font-semibold text-neutral-500 block mb-1">申诉发起商户</label>
                <input
                  type="text"
                  required
                  placeholder="例如：巴黎时尚定制室"
                  value={newSender}
                  onChange={(e) => setNewSender(e.target.value)}
                  className="w-full bg-[#f6f6f7] border border-neutral-200 px-3.5 py-1.8 rounded-20 text-13 focus:ring-1 focus:ring-[#008060] focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-13 font-semibold text-neutral-500 block mb-1">申诉故障主题描述</label>
                <input
                  type="text"
                  required
                  placeholder="例如：Stripe 离岸货币代扣异常延迟"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#f6f6f7] border border-neutral-200 px-3.5 py-1.8 rounded-20 text-13 focus:ring-1 focus:ring-[#008060] focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-13 font-semibold text-neutral-500 block mb-1">物理紧急等级 (Severity Level)</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-[#f6f6f7] border border-neutral-200 px-3.5 py-1.8 rounded-20 text-13 focus:ring-1 focus:ring-[#008060] focus:outline-none font-bold"
                >
                  <option value="low">较低 (Low)</option>
                  <option value="medium">中等 (Medium)</option>
                  <option value="high">紧急 (High / High Response)</option>
                  <option value="critical">超高物理异常 (Critical SLA-breaker)</option>
                </select>
              </div>

              <div className="pt-3 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 border border-neutral-250 text-neutral-700 text-13 font-semibold rounded-16 hover:bg-neutral-100 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#1a1a1a] hover:bg-black text-white text-13 font-bold rounded-16 cursor-pointer"
                >
                  派发到客服队列
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
