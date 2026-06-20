import React, { useState } from 'react';
import { Radio, ShieldAlert, Key, RefreshCcw, Trash2, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { WebhookDeliveryLog } from '../types';

interface SystemScreenProps {
  webhookLogs: WebhookDeliveryLog[];
  onTriggerWebhookSim: () => void;
  onClearLogs: () => void;
}

export default function SystemScreen({ webhookLogs, onTriggerWebhookSim, onClearLogs }: SystemScreenProps) {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [securitySecret, setSecuritySecret] = useState('sk_live_51Nv3p8BshPLa89A50vB9L');
  const [envDbc, setEnvDbc] = useState('postgresql://plat_prod_db:5432/saas_core');
  
  // Local environment properties
  const [envVariables, setEnvVariables] = useState([
    { key: 'ATELIER_CORE_SLA', val: 'SLA_A_STRICT', status: '已注入' },
    { key: 'STRIPE_LIVE_GATEWAY', val: 'stripe_prod_secret_token_x991f', status: '已注入' },
    { key: 'WEBHOOK_FAILURE_AUTO_RETRY', val: 'true', status: '未启用' },
  ]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top action grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Environment Settings Card */}
        <div className="bg-white border border-[#e3e3e3] p-6 rounded-24 shadow-3xs space-y-4">
          <div>
            <h4 className="text-16 font-extrabold text-neutral-900 flex items-center space-x-1.5">
              <Key className="w-5 h-5 text-[#008060]" />
              <span>底层容器环境变量注入 (Environment Configs)</span>
            </h4>
            <p className="text-13 text-neutral-450 mt-1">控制容器、物理集群与对公安全密钥绑定</p>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-neutral-450 uppercase">MASTER PG SQL CONNECTION STRING (DATABASE_URL)</span>
              <input
                type="text"
                value={envDbc}
                onChange={(e) => setEnvDbc(e.target.value)}
                className="w-full bg-[#f6f6f7] border border-neutral-200 rounded-16 px-3.5 py-1.8 text-xs font-mono focus:ring-1 focus:ring-[#008060] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-neutral-450 uppercase">系统常量栈 (Env Rails)</span>
              <div className="border border-[#e3e3e3] rounded-16 overflow-hidden">
                <table className="w-full border-collapse text-left text-13">
                  <thead>
                    <tr className="bg-[#f6f6f7] text-neutral-450 border-b border-[#e3e3e3] font-mono font-semibold">
                      <th className="p-2">常量名</th>
                      <th className="p-2">核定值</th>
                      <th className="p-2 text-right">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e3e3]">
                    {envVariables.map((env, index) => (
                      <tr key={index} className="hover:bg-neutral-50/50">
                        <td className="p-2 font-mono text-[11.5px] text-neutral-800 font-bold">{env.key}</td>
                        <td className="p-2 font-mono text-neutral-500 text-[11px] truncate max-w-[120px]">{env.val}</td>
                        <td className="p-2 text-right">
                          <span className="px-1.5 py-0.2 bg-emerald-50 text-[#008060] font-bold rounded text-[9.5px]">
                            {env.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Audit Settings */}
        <div className="bg-white border border-[#e3e3e3] p-6 rounded-24 shadow-3xs space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h4 className="text-16 font-extrabold text-neutral-900 flex items-center space-x-1.5">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>操作安全与防刷审计策略</span>
            </h4>
            <p className="text-13 text-neutral-450">实时同步平台多租户操作，拦截越权或突发多点登录行为</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-13 border-b border-neutral-100 pb-2">
              <span className="text-neutral-500 font-medium">离岸 IP 白名单限制策略</span>
              <span className="font-mono text-neutral-800 font-bold">已启用 Strict</span>
            </div>
            <div className="flex justify-between items-center text-13 border-b border-neutral-100 pb-2">
              <span className="text-neutral-500 font-medium">自动探测异常大宗流水 (&gt;€50,000)</span>
              <span className="font-mono text-[#008060] font-bold">自动熔断锁定</span>
            </div>
            <div className="flex justify-between items-center text-13">
              <span className="text-neutral-500 font-medium">双因子物理登录隔离认证 (2FA)</span>
              <span className="font-mono text-neutral-800 font-bold">全体平台管理员强制</span>
            </div>
          </div>

          <div className="bg-neutral-900 p-3 rounded-16 flex items-center justify-between border border-neutral-800">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 block">平台清算公钥 (Atelier Public Mastersk)</span>
              <strong className="text-white font-mono text-xs">
                {apiKeyVisible ? securitySecret : '•••••••••••••••••••••••••••••••'}
              </strong>
            </div>
            <button
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 text-neutral-900 text-[11px] font-extrabold rounded-lg cursor-pointer"
            >
              {apiKeyVisible ? '隐藏' : '显示'}
            </button>
          </div>
        </div>
      </div>

      {/* Webhook live deliveries simulator and logs */}
      <div className="bg-white border border-[#e3e3e3] rounded-24 p-6 shadow-3xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-13 uppercase font-extrabold text-neutral-450 tracking-wider font-mono">统一 Webhook 事件通知物理轮循分发器</h4>
            <p className="text-xs text-neutral-500 mt-0.5">捕获并投递商户端订单、租户续费、物理资源熔断等事件</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onTriggerWebhookSim}
              className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-[11.5px] font-bold rounded-12 cursor-pointer flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>快速自检触发通知模拟</span>
            </button>
            <button
              onClick={onClearLogs}
              className="px-3.5 py-1.5 border border-neutral-250 text-rose-600 hover:bg-rose-50 text-[11.5px] font-bold rounded-12 cursor-pointer flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空投递对账缓存</span>
            </button>
          </div>
        </div>

        {/* Webhook CLI style logs list */}
        <div className="bg-neutral-900 rounded-20 p-4 border border-neutral-800 text-[11.5px] font-mono h-52 overflow-y-auto shadow-inner text-emerald-400 space-y-1.8">
          <div className="text-neutral-500 border-b border-neutral-800 pb-1.5 flex justify-between">
            <span>分发物理通知事件列表 (Delivery Stack)</span>
            <span>响应延迟 / 分发状态</span>
          </div>

          {webhookLogs.length === 0 ? (
            <div className="text-neutral-600 text-center py-10 font-bold">目前分库暂无 Webhook 常态分发记录，请点击上方触发自检。</div>
          ) : (
            webhookLogs.map((log) => (
              <div key={log.id} className="flex justify-between items-center border-b border-neutral-800/20 pb-1 hover:bg-neutral-800/40 p-1 rounded">
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-neutral-500">[{log.timestamp}]</span>
                  <span className="text-white font-extrabold font-mono">{log.id}</span>
                  <span className="text-neutral-400 font-bold">{log.topic}</span>
                  <span className="text-[#008060] text-[10px] shrink-0 font-sans border border-[#008060]/30 px-1 rounded-sm">{log.payloadSize}</span>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <span className="text-neutral-500">{log.durationMs}ms</span>
                  <span className={`px-1.5 py-0.2 rounded font-black text-10 ${
                    log.responseCode === 200 || log.responseCode === 201 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    HTTP {log.responseCode}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
