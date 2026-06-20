import React from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { BarChart3, TrendingUp, Users, Percent, HelpCircle } from 'lucide-react';

export default function AnalyticsScreen() {
  const retentionCohorts = [
    { cohort: '2026-01 (入驻)', size: '82 家', m1: '95%', m2: '92%', m3: '89%', m4: '88%' },
    { cohort: '2026-02 (入驻)', size: '94 家', m1: '98%', m2: '94%', m3: '91%', m4: '85%' },
    { cohort: '2026-03 (入驻)', size: '105 家', m1: '94%', m2: '89%', m3: '86%', m4: '-' },
    { cohort: '2026-04 (入驻)', size: '120 家', m1: '97%', m2: '93%', m3: '-', m4: '-' },
  ];

  const categoryShare = [
    { name: '高级时尚定制', value: 45000, color: '#008060' },
    { name: '极简家居', value: 28000, color: '#1a1a1a' },
    { name: '独立手作坊', value: 15000, color: '#4a4a4a' },
    { name: '先锋新锐画廊', value: 31000, color: '#a3a3a3' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* High-end analytic metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e3e3e3] p-5 rounded-24 shadow-3xs hover:border-neutral-400 transition-all">
          <span className="text-13 text-neutral-450 block font-mono font-bold uppercase">LTV RETENTION VALUE</span>
          <h4 className="text-20 font-black text-neutral-900 mt-2">商户物理复购/续费率</h4>
          <p className="text-13 text-emerald-800 font-semibold mt-1">SaaS 周期留存常态 A+1 级别 (94.2%)</p>
        </div>

        <div className="bg-white border border-[#e3e3e3] p-5 rounded-24 shadow-3xs hover:border-neutral-400 transition-all">
          <span className="text-13 text-neutral-450 block font-mono font-bold uppercase">AVG REVENUE PER MERCHANT</span>
          <h4 className="text-20 font-black text-neutral-900 mt-2">ARPU (每户常态流转度额)</h4>
          <p className="text-13 text-neutral-800 font-semibold mt-1">€11,200/季度 (较上周期上涨 8.4%)</p>
        </div>

        <div className="bg-white border border-[#e3e3e3] p-5 rounded-24 shadow-3xs hover:border-neutral-400 transition-all">
          <span className="text-13 text-neutral-450 block font-mono font-bold uppercase">PHYSICAL CLUSTERS SCALE</span>
          <h4 className="text-20 font-black text-neutral-900 mt-2">容器多活集群运行损耗</h4>
          <p className="text-13 text-neutral-500 mt-1">欧洲 EU-West 一区, 亚太 AP-South 正常多活</p>
        </div>
      </div>

      {/* Cohort matrix */}
      <div className="bg-white border border-[#e3e3e3] rounded-24 p-6 shadow-3xs space-y-4">
        <div>
          <h4 className="text-13 uppercase font-extrabold text-neutral-450 tracking-wider font-mono">2026年入驻多租户商户留存分析 (Cohort Matrix)</h4>
          <p className="text-xs text-neutral-500 mt-0.5">反映在开店后不同维度周期的 SaaS 续签及 API 连续调用活度</p>
        </div>

        <div className="overflow-x-auto border border-[#e3e3e3] rounded-16">
          <table className="w-full text-left text-13">
            <thead>
              <tr className="bg-[#f6f6f7] border-b border-[#e3e3e3] text-neutral-450 font-semibold font-mono">
                <th className="p-4">年度入驻同期组 (Cohort Group)</th>
                <th className="p-4">初始流派规模 (Tenant Size)</th>
                <th className="p-4 text-center">首月留存率</th>
                <th className="p-4 text-center">第三月留存率</th>
                <th className="p-4 text-center">第六月留存率</th>
                <th className="p-4 text-center">第九月留存率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e3e3]">
              {retentionCohorts.map((row, index) => (
                <tr key={index} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="p-4 font-bold text-neutral-900">{row.cohort}</td>
                  <td className="p-4 font-mono font-semibold text-neutral-500">{row.size}</td>
                  <td className="p-4 text-center font-mono font-bold text-[#008060] bg-emerald-50/20">{row.m1}</td>
                  <td className="p-4 text-center font-mono font-bold text-[#008060] bg-emerald-50/15">{row.m2}</td>
                  <td className="p-4 text-center font-mono font-bold text-[#008060] bg-emerald-50/10">{row.m3}</td>
                  <td className="p-4 text-center font-mono font-medium text-neutral-400">{row.m4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharts categorization Share bar */}
      <div className="bg-white border border-[#e3e3e3] rounded-24 p-6 shadow-3xs">
        <h4 className="text-13 uppercase font-extrabold text-neutral-450 tracking-wider font-mono mb-4">按细分消费赛道统计大盘流水份额</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryShare}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" stroke="#a3a3a3" style={{ fontSize: '12px' }} tickLine={false} />
              <YAxis stroke="#a3a3a3" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', color: '#ffffff', borderRadius: '12px', fontSize: '11px', border: 'none' }}
              />
              <Bar dataKey="value" fill="#008060" radius={[12, 12, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
