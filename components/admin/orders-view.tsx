'use client';

import { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Filter,
  Download,
  ChevronDown,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Plus,
  X,
  Trash2,
  ListFilter,
  ArrowRightLeft,
  FileLayout
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Order } from '@/lib/types';

interface OrdersViewProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

export function OrdersView({ orders, setOrders }: OrdersViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New Order Form State
  const [formData, setFormData] = useState({
    customer: '',
    email: '',
    items: '1',
    total: '899',
    status: 'pending' as Order['status']
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                          o.customer.toLowerCase().includes(search.toLowerCase()) ||
                          o.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: '待处理', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock },
      processing: { label: '处理中', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Package },
      shipped: { label: '已发货', color: 'bg-purple-50 text-purple-700 border-purple-100', icon: Truck },
      delivered: { label: '已送达', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle },
      cancelled: { label: '已取消', color: 'bg-red-50 text-red-700 border-red-100', icon: XCircle },
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const handleOpenAddModal = () => {
    setFormData({
      customer: '',
      email: '',
      items: '1',
      total: '299',
      status: 'pending'
    });
    setIsAddModalOpen(true);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer.trim() || !formData.email.trim()) {
      toast.error('请输入客户姓名及有效邮箱');
      return;
    }

    const newOrderObj: Order = {
      id: `ORD-${Math.floor(9000 + Math.random() * 1000)}`,
      customer: formData.customer,
      email: formData.email,
      items: parseInt(formData.items) || 1,
      total: parseFloat(formData.total) || 0,
      date: new Date().toISOString().split('T')[0],
      status: formData.status
    };

    setOrders([newOrderObj, ...orders]);
    setIsAddModalOpen(false);
    toast.success(`🎉 订单『${newOrderObj.id}』已成功建立并绑定客户 ${newOrderObj.customer}！`);
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    }));
    toast.success(`订单 ${orderId} 状态已变更为「${
      newStatus === 'pending' ? '待处理' : 
      newStatus === 'processing' ? '处理中' : 
      newStatus === 'shipped' ? '已发货' : 
      newStatus === 'delivered' ? '已送达' : '已取消'
    }」`);

    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
    toast.success(`订单 ${orderId} 已从系统中作废移除`);
    setIsDetailModalOpen(false);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl w-full relative">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">订单</h1>
          <p className="text-sm text-muted-foreground mt-1">
            履约和跟踪当前店铺的全部购买交易
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              toast.success("订单账目及快递详情已妥善导出为 CSV / XLS 表格。");
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>导出订单</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white text-sm font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>新建订单</span>
          </button>
        </div>
      </div>

      {/* 状态过滤标签栏 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: 'all', label: '所有交易', count: statusCounts.all },
          { key: 'pending', label: '待处理', count: statusCounts.pending },
          { key: 'processing', label: '处理中', count: statusCounts.processing },
          { key: 'shipped', label: '已发货', count: statusCounts.shipped },
          { key: 'delivered', label: '已妥投', count: statusCounts.delivered },
          { key: 'cancelled', label: '已关闭', count: statusCounts.cancelled },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
            className={`p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-350'
            }`}
          >
            <p className="text-xl font-bold font-mono tracking-tight leading-none mb-1">
              {tab.count}
            </p>
            <p className="text-[11px] font-semibold opacity-75">
              {tab.label}
            </p>
          </button>
        ))}
      </div>

      {/* 搜索和快捷工具栏 */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white border border-border">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="输入订单号 🛒, 客户姓名, 或是邮箱地址直接直达筛选..."
            className="flex-1 bg-transparent text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 订单表格区 */}
      <div className="rounded-2xl bg-white border border-border overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-150 bg-[#f9fafb]">
              <th className="px-5 py-3.5 font-semibold text-zinc-500 uppercase">编号</th>
              <th className="px-5 py-3.5 font-semibold text-zinc-500 uppercase">客户账户</th>
              <th className="px-5 py-3.5 font-semibold text-zinc-500 uppercase">下单交易时间</th>
              <th className="px-5 py-3.5 text-center font-semibold text-zinc-500 uppercase">商品计数</th>
              <th className="px-5 py-3.5 text-right font-semibold text-zinc-500 uppercase">支付总款</th>
              <th className="px-5 py-3.5 font-semibold text-zinc-500 uppercase">处理状态</th>
              <th className="px-5 py-3.5 text-right font-semibold text-zinc-700">业务操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-medium text-xs">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50/45 transition-colors group">
                <td className="px-5 py-4">
                  <span className="font-bold text-zinc-900 font-mono text-sm">{order.id}</span>
                </td>
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-bold text-zinc-950">{order.customer}</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{order.email}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-zinc-500 font-mono">{order.date}</td>
                <td className="px-5 py-4 text-center text-sm font-bold text-zinc-700 font-mono">{order.items} 件</td>
                <td className="px-5 py-4 text-right font-bold text-zinc-900 font-mono text-sm">
                  ¥{order.total.toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleViewDetails(order)}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-500 hover:text-zinc-955 cursor-pointer"
                      title="查看订单详情与物流指令"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      title="作废订单"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="px-4 py-16 text-center">
            <Package className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-zinc-400">在此状态维度下，没有搜索到任何履约订单账目</p>
          </div>
        )}
      </div>

      {/* --- ADD ORDER MODAL --- */}
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
              手工录入付款单/订单
            </h2>
            <p className="text-xs text-zinc-400 mb-6 font-medium">适合线下或私域成单后手工在后台注籍同步库存</p>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">客户尊名 <span className="text-red-500">*</span></label>
                <Input 
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  placeholder="例如：张无忌"
                  className="rounded-xl border-zinc-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">客户绑定邮箱 <span className="text-red-500">*</span></label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="例如：wuji.zhang@email.com"
                  className="rounded-xl border-zinc-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">采购商品数 (件)</label>
                  <Input 
                    type="number"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">应付实收总款 (¥)</label>
                  <Input 
                    type="number"
                    value={formData.total}
                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                    className="rounded-xl border-zinc-200 font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">初始化支付状态</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                >
                  <option value="pending">待付款 (Pending)</option>
                  <option value="processing">配发货中 (Processing)</option>
                  <option value="shipped">已交寄发货 (Shipped)</option>
                  <option value="delivered">全部送达签收 (Delivered)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <Button type="button" variant="outline" className="rounded-xl border-zinc-200 text-zinc-650 text-xs cursor-pointer" onClick={() => setIsAddModalOpen(false)}>
                  放弃
                </Button>
                <Button type="submit" className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 font-bold text-xs px-5 cursor-pointer">
                  录入订单单据
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DETAIL & FULFILLMENT DIALOG --- */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button 
              onClick={() => { setIsDetailModalOpen(false); setSelectedOrder(null); }}
              className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
            >
              <X className="h-4 w-4 text-zinc-500" />
            </button>
            <h2 className="text-base font-bold text-zinc-900 mb-2 flex items-center gap-1.5">
              <Package className="h-5 w-5 text-zinc-800" />
              交易单 {selectedOrder.id} 精细详情
            </h2>
            <p className="text-xs text-zinc-400 mb-6 font-medium">对当前未了履约合同进行快递、作废、核对等操作</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-zinc-500 font-medium">绑定买家姓名</span>
                  <span className="font-bold text-zinc-950 text-right">{selectedOrder.customer}</span>
                  <span className="text-zinc-500 font-medium">联系邮箱</span>
                  <span className="font-mono text-zinc-800 text-right">{selectedOrder.email}</span>
                  <span className="text-zinc-500 font-medium">下单归档日期</span>
                  <span className="font-mono text-zinc-805 text-right">{selectedOrder.date}</span>
                  <span className="text-zinc-500 font-medium">实付金额汇总</span>
                  <span className="font-bold font-mono text-sm text-zinc-950 text-right">¥{selectedOrder.total}</span>
                </div>
              </div>

              {/* 状态快捷变更域 */}
              <div>
                <p className="text-xs font-bold text-zinc-700 mb-2">更新/推动履约链路</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map((st) => {
                    const lab = st === 'pending' ? '待付' : st === 'processing' ? '加工' : st === 'shipped' ? '已发' : st === 'delivered' ? '妥投' : '取消';
                    return (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                        className={`text-[11px] px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                          selectedOrder.status === st 
                            ? 'bg-zinc-950 text-white border-zinc-950' 
                            : 'bg-white text-zinc-650 border-zinc-200 hover:border-zinc-350'
                        }`}
                      >
                        {lab}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4 flex justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    toast.success("🖨️ 发货快递面单已推送至本地打印机，格式 A6 自动匹配完毕。");
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 text-zinc-700 font-semibold rounded-xl text-xs hover:bg-zinc-50 cursor-pointer"
                >
                  打印电子面单
                </button>
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="rounded-xl border-zinc-200 text-zinc-650 text-xs cursor-pointer" 
                    onClick={() => { setIsDetailModalOpen(false); setSelectedOrder(null); }}
                  >
                    关闭
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                    className="rounded-xl bg-red-650 hover:bg-red-700 text-white font-bold text-xs px-4 cursor-pointer"
                  >
                    作废该单
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

