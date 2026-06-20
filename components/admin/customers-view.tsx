'use client';

import { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Plus,
  Download,
  Mail,
  Users,
  DollarSign,
  ShoppingCart,
  X,
  Edit,
  Trash2,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Customer } from '@/lib/types';

interface CustomersViewProps {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
}

export function CustomersView({ customers, setCustomers }: CustomersViewProps) {
  const [search, setSearch] = useState('');
  
  // Dialog Open states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedMailCustomer, setSelectedMailCustomer] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orders: '0',
    spent: '0',
    status: 'active' as 'active' | 'inactive'
  });

  // Mail Form State
  const [mailSubject, setMailSubject] = useState('您的专属高净值特惠权益已送达');
  const [mailContent, setMailContent] = useState('尊敬的贵宾，为了感谢您一直以来的支持，特别为您推送全场满件特惠礼券。期待您的光临！');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = customers.reduce((sum, c) => sum + c.spent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      orders: '0',
      spent: '0',
      status: 'active'
    });
    setIsAddModalOpen(true);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('请填写完整的客户姓名与常用邮箱');
      return;
    }

    // Check if duplicate email
    if (customers.some(c => c.email.toLowerCase() === formData.email.trim().toLowerCase())) {
      toast.error('此邮箱已被注册，请检查输入或更换邮箱');
      return;
    }

    const newCust: Customer = {
      id: `CUS-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      email: formData.email,
      orders: parseInt(formData.orders) || 0,
      spent: parseFloat(formData.spent) || 0,
      lastOrder: formData.orders !== '0' ? new Date().toISOString().split('T')[0] : '无下单记录',
      status: formData.status
    };

    setCustomers([newCust, ...customers]);
    setIsAddModalOpen(false);
    toast.success(`🎉 客户『${newCust.name}』已录入管理系统，并同步注册会员账户！`);
  };

  const handleEditClick = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name,
      email: cust.email,
      orders: cust.orders.toString(),
      spent: cust.spent.toString(),
      status: cust.status as 'active' | 'inactive'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    setCustomers(customers.map(c => {
      if (c.id === editingCustomer.id) {
        return {
          ...c,
          name: formData.name,
          email: formData.email,
          orders: parseInt(formData.orders) || 0,
          spent: parseFloat(formData.spent) || 0,
          status: formData.status
        };
      }
      return c;
    }));

    setIsEditModalOpen(false);
    setEditingCustomer(null);
    toast.success(`🎉 客户『${formData.name}』的资料信息已更新保存。`);
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    toast.success(`客户『${name}』已从管理系统内移除。`);
  };

  const handleMailClick = (cust: Customer) => {
    setSelectedMailCustomer(cust);
    setMailSubject(`致客户 ${cust.name} 的特别回馈礼遇`);
    setMailContent(`尊敬的 ${cust.name}，感谢您累计在店铺消费了 ¥${cust.spent.toLocaleString()}。我们特别为您送上最新的高净值VIP专属折扣，欢迎到店使用！`);
    setIsMailModalOpen(true);
  };

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMailCustomer) return;

    toast.loading(`正在向客户邮箱 ${selectedMailCustomer.email} 发送自动化邮件...`, { id: "send-mail" });
    setTimeout(() => {
      toast.success(`🎉 邮件成功发出！客户 ${selectedMailCustomer.name} 将即时收到促销简讯。`, { id: "send-mail" });
      setIsMailModalOpen(false);
      setSelectedMailCustomer(null);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl w-full relative">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">客户</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理您的客户关系，共 {customers.length} 个客户
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              toast.success("客户关系名录已按 CSV 标准格式成功导出并下载。");
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>导出客户</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>添加客户</span>
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-zinc-700" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-zinc-900">{customers.length} 人</p>
          <p className="text-[11px] font-medium text-zinc-400 mt-1">总客户规模</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-zinc-700" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-zinc-900">¥{totalSpent.toLocaleString()}</p>
          <p className="text-[11px] font-medium text-zinc-400 mt-1">客群累计消费额</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-zinc-700" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-zinc-900">{totalOrders} 次</p>
          <p className="text-[11px] font-medium text-zinc-400 mt-1">交易履约总量</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-zinc-700" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-zinc-900">¥{Math.round(avgOrderValue).toLocaleString()}</p>
          <p className="text-[11px] font-medium text-zinc-400 mt-1">系统平均客单价</p>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-border max-w-md">
        <Search className="h-4 w-4 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索客户姓名或常用邮箱..."
          className="flex-1 bg-transparent text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
        />
      </div>

      {/* 客户表格 */}
      <div className="rounded-2xl bg-white border border-border overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-150 bg-[#f9fafb]">
              <th className="px-5 py-3 font-semibold text-zinc-500 uppercase">客户账户信息</th>
              <th className="px-5 py-3 text-center font-semibold text-zinc-500 uppercase">订单量</th>
              <th className="px-5 py-3 text-right font-semibold text-zinc-500 uppercase">消费总额</th>
              <th className="px-5 py-3 font-semibold text-zinc-500 uppercase">最近来访下单</th>
              <th className="px-5 py-3 font-semibold text-zinc-500 uppercase">会员状态</th>
              <th className="px-5 py-3 text-right font-semibold text-zinc-700">业务操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-medium">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-zinc-50/45 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-950">{customer.name}</p>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{customer.id} · {customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-center font-bold text-zinc-700 font-mono text-sm">{customer.orders}</td>
                <td className="px-5 py-4 text-right font-bold text-zinc-900 font-mono text-sm">
                  ¥{customer.spent.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-zinc-500 font-mono">{customer.lastOrder}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    customer.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-zinc-50 text-zinc-500 border-zinc-150'
                  }`}>
                    {customer.status === 'active' ? '活跃特尊' : '非活动'}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleMailClick(customer)}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer text-zinc-500 hover:text-zinc-900"
                      title="发短信/邮件推送"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditClick(customer)}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer text-zinc-500 hover:text-zinc-900"
                      title="编辑"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      title="移出客户"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="px-4 py-16 text-center">
            <Users className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-zinc-400">没有查找到相应客户账号</p>
          </div>
        )}
      </div>

      {/* --- ADD CUSTOMER MODAL OVERLAY --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <Plus className="h-5 w-5 text-zinc-800" />
              添加新客户记录
            </h2>
            <p className="text-xs text-zinc-400 mb-6">在会员及客户关系中心内手动注籍，支持配置初始交易情况</p>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">客户姓名 <span className="text-red-500">*</span></label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如：马云飞"
                  className="rounded-xl border-zinc-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">常用邮箱地址 <span className="text-red-500">*</span></label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="如：yunfei.ma@email.com"
                  className="rounded-xl border-zinc-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">历史成交订单量</label>
                  <Input 
                    type="number"
                    value={formData.orders}
                    onChange={(e) => setFormData({ ...formData, orders: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">历史累消金额 (¥)</label>
                  <Input 
                    type="number"
                    value={formData.spent}
                    onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">客户状态</label>
                <div className="flex gap-4">
                  {["active", "inactive"].map((st) => (
                    <label key={st} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                      <input 
                        type="radio"
                        name="add_cust_status"
                        checked={formData.status === st}
                        onChange={() => setFormData({ ...formData, status: st as any })}
                        className="text-zinc-900 focus:ring-zinc-900"
                      />
                      {st === "active" ? "活跃会员/经常购买" : "静止/存量备份"}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <Button type="button" variant="outline" className="rounded-xl border-zinc-200 text-zinc-600 text-xs cursor-pointer" onClick={() => setIsAddModalOpen(false)}>
                  取消
                </Button>
                <Button type="submit" className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 font-bold text-xs px-5 cursor-pointer">
                  录入客户账户
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT CUSTOMER MODAL OVERLAY --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => { setIsEditModalOpen(false); setEditingCustomer(null); }}
              className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <Edit className="h-5 w-5 text-zinc-800" />
              编辑客户资料
            </h2>
            <p className="text-xs text-zinc-400 mb-6">修改已注籍客户的基础物理资料或调配其生命消费总值</p>

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">客户姓名 <span className="text-red-500">*</span></label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="客户姓名"
                  className="rounded-xl border-zinc-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">常用邮箱地址 <span className="text-red-500">*</span></label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="邮箱"
                  className="rounded-xl border-zinc-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">历史成交订单量</label>
                  <Input 
                    type="number"
                    value={formData.orders}
                    onChange={(e) => setFormData({ ...formData, orders: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">历史累消金额 (¥)</label>
                  <Input 
                    type="number"
                    value={formData.spent}
                    onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">会员状态</label>
                <div className="flex gap-4">
                  {["active", "inactive"].map((st) => (
                    <label key={st} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                      <input 
                        type="radio"
                        name="edit_cust_status"
                        checked={formData.status === st}
                        onChange={() => setFormData({ ...formData, status: st as any })}
                        className="text-zinc-900 focus:ring-zinc-900"
                      />
                      {st === "active" ? "活跃特尊" : "非活动静置"}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <Button type="button" variant="outline" className="rounded-xl border-zinc-200 text-zinc-600 text-xs cursor-pointer" onClick={() => { setIsEditModalOpen(false); setEditingCustomer(null); }}>
                  取消
                </Button>
                <Button type="submit" className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 font-bold text-xs px-5 cursor-pointer">
                  保存修改
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SEND CAMPAIGN EMAIL DIALOG --- */}
      {isMailModalOpen && selectedMailCustomer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => { setIsMailModalOpen(false); setSelectedMailCustomer(null); }}
              className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <Mail className="h-5 w-5 text-zinc-800" />
              推送智能营销简讯
            </h2>
            <p className="text-xs text-zinc-400 mb-6">直接将促销内容、折扣礼券或系统消息通过 Webhook/邮道 送达账户</p>

            <form onSubmit={handleSendMail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">接收者邮箱</label>
                <span className="font-mono text-xs font-bold text-zinc-800">{selectedMailCustomer.name} &lt;{selectedMailCustomer.email}&gt;</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">邮件/讯息主题</label>
                <Input 
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="rounded-xl border-zinc-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">讯息具体内容</label>
                <textarea 
                  value={mailContent}
                  onChange={(e) => setMailContent(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  rows={4}
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <Button type="button" variant="outline" className="rounded-xl border-zinc-200 text-zinc-600 text-xs cursor-pointer" onClick={() => { setIsMailModalOpen(false); setSelectedMailCustomer(null); }}>
                  取消
                </Button>
                <Button type="submit" className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 font-bold text-xs px-5 cursor-pointer">
                  发送优惠讯息
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

