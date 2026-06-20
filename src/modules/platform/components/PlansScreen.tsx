import React, { useState } from 'react';
import { Award, Plus, Check, Edit2, ShieldAlert, Users, TrendingUp } from 'lucide-react';
import { PlanPackage, SubscriptionRecord } from '../types';

interface PlansScreenProps {
  plans: PlanPackage[];
  subscriptions: SubscriptionRecord[];
  onUpdatePlanPrice: (planId: string, newPrice: number) => void;
  onAddPlan: (name: string, price: number, quota: string, features: string[]) => void;
}

export default function PlansScreen({ plans, subscriptions, onUpdatePlanPrice, onAddPlan }: PlansScreenProps) {
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);

  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState(199);
  const [newPlanQuota, setNewPlanQuota] = useState('50k次/月');
  const [newPlanFeatures, setNewPlanFeatures] = useState('高频物理备份, 国际计费网关, SSL 加密防护');

  const handleEditPrice = (p: PlanPackage) => {
    setEditingPlanId(p.id);
    setTempPrice(p.price);
  };

  const handleSavePrice = (id: string) => {
    onUpdatePlanPrice(id, tempPrice);
    setEditingPlanId(null);
  };

  const handleSubmitNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName) return;
    const feats = newPlanFeatures.split(',').map(f => f.trim());
    onAddPlan(newPlanName, newPlanPrice, newPlanQuota, feats);
    setNewPlanName('');
    setShowAddPlanModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#e3e3e3] pb-4 mb-2 gap-4">
        <div>
          <h3 className="text-16 font-bold text-neutral-900">平台套餐及常态订阅流转盘</h3>
          <p className="text-13 text-neutral-450">包含 B2B 国际大宗批发商户与 D2C 统一阶梯账单</p>
        </div>
        <button
          onClick={() => setShowAddPlanModal(true)}
          className="px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white text-13 font-bold rounded-16 cursor-pointer flex items-center space-x-1 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>开发全新商业套餐</span>
        </button>
      </div>

      {/* Plans List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div key={p.id} className="bg-white border border-[#e3e3e3] p-6 rounded-24 flex flex-col justify-between hover:border-neutral-400 transition-all duration-300 relative group overflow-hidden shadow-3xs">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#008060]/10 group-hover:bg-[#008060] transition-colors" />

            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-16 font-extrabold text-neutral-900">{p.name}</h4>
                  <span className="text-[10px] font-mono text-[#008060] font-bold tracking-wider">{p.quotaLimit}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-50 text-[#008060] border border-emerald-150 font-bold rounded-lg text-[9.5px]">
                  常态销售中
                </span>
              </div>

              {/* Price configuration */}
              <div className="border-t border-neutral-100 pt-3.5 mt-3.5 space-y-1">
                <span className="text-13 text-neutral-450 block font-mono">底层常态定价</span>
                {editingPlanId === p.id ? (
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="font-mono text-xs text-neutral-900">€</span>
                    <input 
                      type="number" 
                      value={tempPrice}
                      onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                      className="w-20 bg-[#f6f6f7] border border-neutral-200 rounded-lg px-2 py-1 text-xs text-neutral-900 font-bold"
                    />
                    <button 
                      onClick={() => handleSavePrice(p.id)}
                      className="p-1 px-2.5 bg-[#008060] text-white text-11 font-bold rounded-lg cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between">
                    <strong className="text-20 font-mono font-black text-neutral-900">€{p.price} <span className="text-[10.5px] text-neutral-400 font-normal">/ 月</span></strong>
                    <button 
                      onClick={() => handleEditPrice(p)}
                      className="text-13 text-[#008060] font-bold hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>更改物理定价</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Subscriber ratio */}
              <div className="mt-4 flex items-center space-x-2 text-13">
                <Users className="w-4 h-4 text-neutral-400" />
                <span>物理租户占有量 : <strong className="font-mono text-neutral-800 font-bold">{p.subscribersCount} 户</strong></span>
              </div>

              {/* Features lists */}
              <div className="mt-4 border-t border-neutral-100 pt-3.5 space-y-2">
                <span className="text-11 uppercase font-extrabold tracking-widest text-neutral-400 block font-mono">核定物理权益</span>
                <ul className="space-y-1 text-13 text-neutral-500">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1 h-1 bg-[#008060] rounded-full" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Active/Canceled Table Grid */}
      <div className="bg-white border border-[#e3e3e3] rounded-24 p-6 shadow-3xs">
        <h4 className="text-13 uppercase font-extrabold text-neutral-450 tracking-wider font-mono mb-4">进行中/逾期对账账单订阅周期池</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-13">
            <thead>
              <tr className="bg-[#f6f6f7] border-b border-[#e3e3e3] text-neutral-450 font-semibold font-mono">
                <th className="p-4">订阅单ID</th>
                <th className="p-4">对应商户</th>
                <th className="p-4">对账套餐</th>
                <th className="p-4">计费常态额</th>
                <th className="p-4">下个物理扣款期</th>
                <th className="p-4 text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e3e3]">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#f6f6f7]/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-neural-700">{sub.id}</td>
                  <td className="p-4 font-bold text-neutral-900">{sub.tenantName}</td>
                  <td className="p-4">{sub.planName}</td>
                  <td className="p-4 font-mono font-bold">€{sub.amount.toLocaleString()}</td>
                  <td className="p-4 font-mono text-neutral-450">{sub.nextBillingAt}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      sub.status === 'active' ? 'bg-[#e6f2ee] text-[#008060] border border-emerald-250' :
                      sub.status === 'past-due' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {sub.status === 'active' ? '进行中' : sub.status === 'past-due' ? '异常逾期' : '已取消'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddPlanModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white border-2 border-neutral-900 p-6 rounded-24 max-w-sm w-full space-y-4">
            <h3 className="text-16 font-bold text-neutral-950">下拨全新的 SaaS 产品商业套餐</h3>
            
            <form onSubmit={handleSubmitNewPlan} className="space-y-3">
              <div>
                <label className="text-13 font-semibold text-neutral-500 block mb-1">套餐标识名称</label>
                <input
                  type="text"
                  required
                  placeholder="例如：巴黎奢华B2B定制包"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full bg-[#f6f6f7] border border-neutral-200 px-3.5 py-1.8 rounded-20 text-13 focus:ring-1 focus:ring-[#008060] focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-13 font-semibold text-neutral-500 block mb-1">销售定价 (每月欧元/€)</label>
                <input
                  type="number"
                  required
                  value={newPlanPrice}
                  onChange={(e) => setNewPlanPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#f6f6f7] border border-neutral-200 px-3.5 py-1.8 rounded-20 text-13 focus:ring-1 focus:ring-[#008060] focus:outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-13 font-semibold text-neutral-500 block mb-1">底层流控物理额度</label>
                <input
                  type="text"
                  required
                  value={newPlanQuota}
                  onChange={(e) => setNewPlanQuota(e.target.value)}
                  className="w-full bg-[#f6f6f7] border border-neutral-200 px-3.5 py-1.8 rounded-20 text-13 focus:ring-1 focus:ring-[#008060] focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-13 font-semibold text-neutral-500 block mb-1">物理配置权益 (逗号分割)</label>
                <textarea
                  value={newPlanFeatures}
                  rows={2}
                  onChange={(e) => setNewPlanFeatures(e.target.value)}
                  className="w-full bg-[#f6f6f7] border border-neutral-200 px-3.5 py-1.8 rounded-20 text-13 focus:ring-1 focus:ring-[#008060] focus:outline-none text-neutral-700"
                />
              </div>

              <div className="pt-3 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="w-1/2 py-2 border border-neutral-250 text-neutral-700 text-13 font-semibold rounded-16 hover:bg-neutral-100 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#1a1a1a] hover:bg-black text-white text-13 font-bold rounded-16 cursor-pointer"
                >
                  确认下拨商业套餐
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
