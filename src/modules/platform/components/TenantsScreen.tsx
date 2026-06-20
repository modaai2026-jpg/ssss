import React, { useState } from 'react';
import { Search, Plus, Filter, Sliders, ShieldAlert, Cpu, Database, Check } from 'lucide-react';
import { TenantDisk } from '../types';

interface TenantsScreenProps {
  tenants: TenantDisk[];
  onToggleStatus: (id: string) => void;
  onAddTenant: (name: string, plan: string, region: string) => void;
  onUpdateQuotas: (id: string, quotaField: string, value: number) => void;
}

export default function TenantsScreen({ tenants, onToggleStatus, onAddTenant, onUpdateQuotas }: TenantsScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [newPlan, setNewPlan] = useState('专业版');
  const [newRegion, setNewRegion] = useState('欧洲中心一区 (EU-West)');
  
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTenant = tenants.find(t => t.id === selectedTenantId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand) return;
    onAddTenant(newBrand, newPlan, newRegion);
    setNewBrand('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Quick Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-[#e3e3e3] p-4 rounded-2xl shadow-3xs">
        <div className="relative w-full md:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="搜索商户 ID、品牌、或者负责人"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f6f6f7] border border-neutral-200 rounded-20 text-13 focus:outline-none focus:ring-1 focus:ring-[#008060] transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto px-4 py-2 bg-[#1a1a1a] hover:bg-black text-white text-13 font-bold rounded-16 cursor-pointer transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>分配全新租户物理仓</span>
          </button>
        </div>
      </div>

      {/* Grid container: tenants on left, side panel details on right if selected */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className={`bg-white border border-[#e3e3e3] rounded-24 overflow-hidden shadow-3xs ${selectedTenantId ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-13">
              <thead>
                <tr className="bg-[#f6f6f7] border-b border-[#e3e3e3] text-neutral-450 font-semibold font-mono">
                  <th className="p-4 w-12 text-center">租户ID</th>
                  <th className="p-4">商户品牌</th>
                  <th className="p-4">部署物理节点</th>
                  <th className="p-4">套餐等级</th>
                  <th className="p-4 text-right">营业流水</th>
                  <th className="p-4 text-center">系统配额</th>
                  <th className="p-4 text-center">物理状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e3e3]">
                {filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-neutral-400">没有匹配的商户物理租户仓。</td>
                  </tr>
                ) : (
                  filteredTenants.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTenantId(t.id)}
                      className={`hover:bg-[#f6f6f7]/50 cursor-pointer transition-colors ${selectedTenantId === t.id ? 'bg-[#e6f2ee]/30' : ''}`}
                    >
                      <td className="p-4 font-mono font-bold text-center text-[11px] text-neutral-500">{t.id}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-neutral-900">{t.name}</p>
                          <p className="text-[11.5px] text-neutral-450">联系人: {t.owner}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-mono text-neutral-500">{t.region}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                          t.plan === '旗舰套餐' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          t.plan === '专业版' ? 'bg-emerald-50 text-[#008060] border border-emerald-200' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {t.plan}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-[#008060]">€{t.revenue.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-1">
                          <div className="w-16 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#008060] h-1.5 rounded-full" style={{ width: `${(t.apiRequests / t.apiLimit) * 100}%` }} />
                          </div>
                          <span className="text-[10px] font-mono whitespace-nowrap">{((t.apiRequests / t.apiLimit) * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-16 text-[11px] font-bold inline-block border ${
                          t.status === 'active' ? 'bg-[#e6f2ee] text-[#008060] border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {t.status === 'active' ? '正常运行(Live)' : '暂停使用'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Tenant Quota Controls */}
        {selectedTenant && (
          <div className="bg-white border border-[#e3e3e3] rounded-24 p-6 space-y-5 shadow-3xs animate-fadeIn">
            <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#008060] font-bold block uppercase">PHYSICAL QUOTA CONTROLLER</span>
                <h3 className="text-16 font-bold text-neutral-900 truncate">{selectedTenant.name}</h3>
                <span className="text-[11px] font-mono text-neutral-400">ID: {selectedTenant.id}</span>
              </div>
              <button
                onClick={() => setSelectedTenantId(null)}
                className="text-13 text-neutral-400 hover:text-neutral-900 cursor-pointer font-semibold font-mono"
              >
                关闭面板
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs font-semibold text-neutral-500 font-mono">
                  <span>API 物理调用限制 (/min)</span>
                  <span className="text-neutral-900 font-black">{selectedTenant.apiLimit} 次/分</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={selectedTenant.apiLimit}
                  onChange={(e) => onUpdateQuotas(selectedTenant.id, 'apiLimit', parseInt(e.target.value))}
                  className="w-full accent-[#008060] cursor-pointer"
                />
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <div className="flex items-center justify-between text-13">
                  <span className="text-neutral-500 font-medium">可用虚拟内存(Memory Config)</span>
                  <strong className="font-mono text-neutral-800 font-bold">{selectedTenant.memUsage} MB</strong>
                </div>
                <div className="flex items-center justify-between text-13">
                  <span className="text-neutral-500 font-medium">底层物理核心配给(CPU)</span>
                  <strong className="font-mono text-neutral-800 font-bold">{selectedTenant.cpuUsage} vCPU</strong>
                </div>
                <div className="flex items-center justify-between text-13">
                  <span className="text-neutral-500 font-medium">SSD 云存储配额限制</span>
                  <strong className="font-mono text-neutral-800 font-bold">{selectedTenant.diskUsage} GB</strong>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-2">
                <button
                  onClick={() => onToggleStatus(selectedTenant.id)}
                  className={`w-full py-2 rounded-16 text-13 font-bold cursor-pointer transition-colors border flex items-center justify-center space-x-2 ${
                    selectedTenant.status === 'active'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      : 'bg-[#e6f2ee] text-[#008060] border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{selectedTenant.status === 'active' ? '立即物理挂起商户(Suspend)' : '恢复商户服务'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white border-2 border-neutral-900 p-6 rounded-24 max-w-sm w-full space-y-4">
            <h3 className="text-16 font-bold text-neutral-950">下拨全新的 SaaS 租户物理仓</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-13 font-semibold text-neutral-500 block mb-1">商户品牌名称</label>
                <input
                  type="text"
                  required
                  placeholder="例如：米兰鞋履精品店"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="w-full bg-[#f6f6f7] border border-neutral-200 px-3.5 py-2 rounded-20 text-13 focus:ring-1 focus:ring-[#008060] focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-13 font-semibold text-neutral-500 block mb-1">物理所属套餐等级</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  className="w-full bg-[#f6f6f7] border border-neutral-200 px-3.5 py-2 rounded-20 text-13 focus:ring-1 focus:ring-[#008060] focus:outline-none font-bold"
                >
                  <option value="基础套餐">基础套餐（€99/月）</option>
                  <option value="专业版">专业版（€299/月）</option>
                  <option value="旗舰套餐">旗舰套餐（€899/月）</option>
                </select>
              </div>

              <div>
                <label className="text-13 font-semibold text-neutral-500 block mb-1">部署物理中心分区</label>
                <select
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  className="w-full bg-[#f6f6f7] border border-neutral-200 px-3.5 py-2 rounded-20 text-13 focus:ring-1 focus:ring-[#008060] focus:outline-none font-bold"
                >
                  <option value="欧洲中心一区 (EU-West)">欧洲中心一区 (EU-West)</option>
                  <option value="亚太新加坡一区 (AP-South)">亚太新加坡一区 (AP-South)</option>
                  <option value="北美国际总分区 (US-East)">北美国际总分区 (US-East)</option>
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
                  快速拨备分配
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
