'use client';

import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

// 模拟数据
const salesData = [
  { name: '周一', sales: 4000, orders: 24 },
  { name: '周二', sales: 3000, orders: 18 },
  { name: '周三', sales: 5000, orders: 32 },
  { name: '周四', sales: 2780, orders: 16 },
  { name: '周五', sales: 6890, orders: 45 },
  { name: '周六', sales: 8390, orders: 56 },
  { name: '周日', sales: 7490, orders: 48 },
];

const trafficData = [
  { name: '直接访问', value: 4000 },
  { name: '搜索引擎', value: 3000 },
  { name: '社交媒体', value: 2000 },
  { name: '推荐链接', value: 1500 },
  { name: '邮件营销', value: 1000 },
];

const topProducts = [
  { name: '智能手表 Pro Max', sales: 156, revenue: 467244, growth: 12.5 },
  { name: '无线降噪耳机', sales: 342, revenue: 307458, growth: 8.2 },
  { name: '4K显示器 27英寸', sales: 45, revenue: 112455, growth: -2.1 },
  { name: '机械键盘 87键', sales: 89, revenue: 53311, growth: 15.8 },
];

export function AnalyticsView() {
  const stats = [
    { 
      label: '总销售额', 
      value: '¥125,890', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign 
    },
    { 
      label: '总订单数', 
      value: '1,234', 
      change: '+8.2%', 
      trend: 'up',
      icon: ShoppingCart 
    },
    { 
      label: '转化率', 
      value: '3.24%', 
      change: '+0.5%', 
      trend: 'up',
      icon: TrendingUp 
    },
    { 
      label: '访客数', 
      value: '38,102', 
      change: '-2.1%', 
      trend: 'down',
      icon: Eye 
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* 页面标题 */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">数据分析</h1>
        <p className="text-sm text-muted-foreground mt-1">查看业务数据和趋势</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="p-5 rounded-xl bg-card border border-border hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className="h-5 w-5 text-foreground/70" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 销售趋势图 */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">销售趋势</h2>
            <p className="text-xs text-muted-foreground mt-0.5">过去 7 天的销售数据</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#1A1A1A" 
                  strokeWidth={2}
                  dot={{ fill: '#1A1A1A', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 流量来源 */}
        <div className="rounded-xl bg-card border border-border p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">流量来源</h2>
            <p className="text-xs text-muted-foreground mt-0.5">访客来源分布</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" fill="#1A1A1A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 热销商品 */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">热销商品</h2>
          <p className="text-xs text-muted-foreground mt-0.5">销量最高的产品</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-5 py-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">产品名称</th>
                <th className="px-5 py-3 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">销量</th>
                <th className="px-5 py-3 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">收入</th>
                <th className="px-5 py-3 text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider">增长</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-xs font-medium text-foreground">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-foreground">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-right text-foreground">{product.sales}</td>
                  <td className="px-5 py-4 text-sm text-right text-foreground">¥{product.revenue.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth >= 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {Math.abs(product.growth)}%
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
