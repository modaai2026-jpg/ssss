import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, Trash2, ArrowRight, CornerDownLeft, 
  RefreshCcw, Bot, Shield, CheckCircle2, AlertCircle, 
  HelpCircle, BarChart3, Users, Clock, Zap, MessageSquare, Plus, Check
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useProductStore } from '../../stores/productStore';
import { useOrderStore } from '../../stores/orderStore';
import { useDiscountStore } from '../../stores/discountStore';
import { eventBus, NotificationEvents } from '../../events';

interface AgentRole {
  id: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  icon: any;
  status: 'idle' | 'analyzing' | 'drafting' | 'completed';
  description: string;
}

interface SynergyLog {
  id: string;
  time: string;
  senderName: string;
  senderTitle: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'agent';
  color: string;
}

export default function SidekickWorkspace() {
  const { products, addProduct, updateProduct } = useProductStore();
  const { orders } = useOrderStore();
  const { discounts, addDiscount } = useDiscountStore();

  const [replenishedProducts, setReplenishedProducts] = useState<Record<string, boolean>>({});
  const [addedDiscounts, setAddedDiscounts] = useState<Record<string, boolean>>({});
  const [addedLinenItems, setAddedLinenItems] = useState<Record<string, boolean>>({});
  const [stayPopActive, setStayPopActive] = useState<boolean>(false);

  // Initial message states with localStorage synchronization
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('atelier_sidekick_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved sidekick messages", e);
      }
    }
    return [
      {
        id: 'init-01',
        role: 'model',
        agent: 'ceo',
        text: "您好，我是 **Atelier Noir** 的 AI 首席协调官（CEO Agent）。\n\n我已经将本商铺的 **多智能协同专家工作组** 召集完毕。我们将为您提供全天候的跨职业联勤会商支持：\n\n* **CEO 协同官**: 承接全局商铺策略，指派并汇编专家席位建议\n* **奢品文案官**: 主打法式奢华与极简主义，定制高级商品静奢文案\n* **财务精算师**: 测算欧洲多国增值税 (VAT)、Forex汇率折算及利润矩阵\n* **供应链主管**: 统筹保税仓重组、海外物流托运及低库存一键调拨方案\n* **流量企划官**: 设计高转化留客弹窗与 Klaviyo 邮件弃单挽回策略\n\n直接在下方输入您的商铺经营目标或难点，我们将启动专家合会商讨出具全套可执行方案！",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [teamMode, setTeamMode] = useState<'collaborative' | 'delegate'>('collaborative');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [synergyLogs, setSynergyLogs] = useState<SynergyLog[]>(() => {
    const saved = localStorage.getItem('atelier_sidekick_synergy_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // empty
      }
    }
    return [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>('session_1');

  useEffect(() => {
    localStorage.setItem('atelier_sidekick_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('atelier_sidekick_synergy_logs', JSON.stringify(synergyLogs));
  }, [synergyLogs]);

  const handleReplenishInventory = (productId: string) => {
    const prod = products.find(p => p.id === productId || p.sku === productId);
    if (prod) {
      updateProduct(prod.id, { inventory: 120 });
      setReplenishedProducts(prev => ({ ...prev, [productId]: true }));
      eventBus.emit(NotificationEvents.CREATED, {
        text: `📦 智联物流调发：${prod.title} 库存已成功补至 120 件！`
      });
    } else {
      const coffeeItem = products.find(p => p.title.includes('Coffee') || p.title.includes('Brewer') || p.sku === 'MC-DRP-CHR');
      if (coffeeItem) {
        updateProduct(coffeeItem.id, { inventory: 120 });
        setReplenishedProducts(prev => ({ ...prev, [productId]: true }));
        eventBus.emit(NotificationEvents.CREATED, {
          text: `📦 智联物流调发：${coffeeItem.title} 库存已成功补至 120 件！`
        });
      }
    }
  };

  const handleAddDiscount = () => {
    const alreadyExists = discounts.some(d => d.code === 'FESTIVE15');
    if (!alreadyExists) {
      const newDiscount = {
        id: 'disc_' + Date.now(),
        code: 'FESTIVE15',
        type: 'percentage' as const,
        value: 15,
        valueText: '15% OFF',
        status: 'active' as const,
        usageCount: 0,
        usageLimit: 500,
        minRequirement: '50',
        oncePerCustomer: true,
        startDate: new Date().toISOString().split('T')[0],
      };
      addDiscount(newDiscount);
    }
    setAddedDiscounts(prev => ({ ...prev, FESTIVE15: true }));
    eventBus.emit(NotificationEvents.CREATED, {
      text: `🏷️ 促单组件上线：优惠券「FESTIVE15」已全自动注入系统大盘！`
    });
  };

  const handleAddLinenLoungewear = () => {
    const alreadyExists = products.some(p => p.title.includes('Linen Loungewear'));
    if (!alreadyExists) {
      const newProd = {
        id: 'prod_' + Date.now(),
        title: 'Atelier Unstructured Linen Loungewear',
        description: 'Constructed from centuries-old Belgian flax weaves, our linen loungewear balances structure with ease. Designed with a generous silhouette that relaxes over time, the organic construction keeps it breathable in ambient heat and insulating in cooler drafts.',
        vendor: 'Atelier Noir',
        type: 'Clothing',
        status: 'active' as const,
        price: 89.00,
        compareAtPrice: 150.00,
        costPerItem: 18.00,
        sku: 'AT-LIN-LOU-MID',
        inventory: 60,
        inventoryByLocation: { 'Brussels Main': 40, 'Berlin Outlet': 20 },
        images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=450&q=80'],
        collections: ['Fall silhouttes', 'New Arrivals'],
        tags: ['sustainable', 'linen', 'quiet-luxury', 'lounge']
      };
      addProduct(newProd);
    }
    setAddedLinenItems(prev => ({ ...prev, loungewear: true }));
    eventBus.emit(NotificationEvents.CREATED, {
      text: `✍️ 内容发布就绪：奢影新品「Atelier Unstructured Linen Loungewear」已上架网店！`
    });
  };

  const handleToggleStayPop = () => {
    setStayPopActive(prev => !prev);
    eventBus.emit(NotificationEvents.CREATED, {
      text: stayPopActive 
        ? `🔴 StayPop 拦截组件已在店铺网关下线。` 
        : `🟢 StayPop 拦截组件已全站生效，出站挽回秒级拦截启动！`
    });
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Recent Sessions Mock database
  const SESSION_LIST = [
    { id: 'session_1', title: '📦 跨仓库存调拨', type: 'supply', time: '10分钟前' },
    { id: 'session_2', title: '✍️ 亚麻静奢文案', type: 'marketing', time: '1小时前' },
    { id: 'session_3', title: '🏷️ 弃单促单弹窗', type: 'retention', time: '3小时前' },
    { id: 'session_4', title: '📊 季度税务审计', type: 'finance', time: '昨天' }
  ];

  // Premium Expert Team config
  const [agents, setAgents] = useState<AgentRole[]>([
    {
      id: 'ceo',
      name: 'CEO 协调官',
      title: '首席协调',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      color: 'bg-[#008060] border-neutral-700',
      icon: Shield,
      status: 'idle',
      description: '大模型的全局分发器，统领并调度其余多职业 Agent 协同作业。'
    },
    {
      id: 'writer',
      name: '奢雅文案官',
      title: '文案顾问',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
      color: 'bg-emerald-900 border-emerald-700',
      icon: Sparkles,
      status: 'idle',
      description: '提供 Shopify 水准的奢华静默文案，擅长刻画呼吸、建筑结构感和材质温度。'
    },
    {
      id: 'finance',
      name: '财务精算官',
      title: '税务核算',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      color: 'bg-emerald-950 border-indigo-700',
      icon: BarChart3,
      status: 'idle',
      description: '精准裁定多币种记账结算、欧洲跨国 VAT 税率合规及边际贡献核算。'
    },
    {
      id: 'logistic',
      name: '供应链主管',
      title: '物流主理',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80',
      color: 'bg-amber-900 border-amber-700',
      icon: Clock,
      status: 'idle',
      description: '统筹保税仓库调配，检测低库存风险并起草 DHL/FedEx 跨境打单指令。'
    },
    {
      id: 'growth',
      name: '流量企划官',
      title: '留存运营',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      color: 'bg-purple-900 border-purple-700',
      icon: Zap,
      status: 'idle',
      description: '分析购物车留存曲线，定制出站挽回 StayPop 弹框及邮件重邀约体系。'
    }
  ]);

  // Insights / Data summary variables matching the Shopify UX
  const AGENT_STATS = [
    { label: '智能联勤率', value: '100%在线', change: '极高', isPositive: true },
    { label: '决策替代率', value: '94.2%', change: '已提12单', isPositive: true },
    { label: '弃单回追额', value: '€1,416.00', change: '变现28%', isPositive: true },
    { label: '联检时延', value: '110ms', change: '毫秒响应', isPositive: true }
  ];

  // Recommended high-fidelity prompt cues
  const PROMPTS = [
    { text: "查看商铺低库存情况", label: "📦 库存调拨" },
    { text: "起草比利时亚麻衣物描述", label: "✍️ 亚麻文案" },
    { text: "测算我们的订单VAT与汇率结算", label: "📊 财务税率" },
    { text: "弃单留客拦截弹窗优化", label: "🏷️ 促单拦截" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [synergyLogs]);

  // Main input controller combining remote API proxy and smart local script dispatcher
  const handleExecuteSynergy = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Step 1: Add User Input
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: promptText,
      timestamp: userMessageTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setSynergyLogs([]);

    // Clear Statuses first
    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));

    let finalResponseText = '';
    const cleanPrompt = promptText.toLowerCase();

    // Staggered Agent Collaboration orchestration simulation
    const logStep = (timeOffset: number, senderId: string, text: string) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const agentRef = agents.find(a => a.id === senderId);
          if (agentRef) {
            setAgents(curr => curr.map(a => {
              if (a.id === senderId) return { ...a, status: 'analyzing' };
              if (a.status === 'analyzing') return { ...a, status: 'completed' };
              return a;
            }));
            
            setSynergyLogs(prev => [
              ...prev,
              {
                id: `log-${Date.now()}-${timeOffset}`,
                time: new Date().toLocaleTimeString([], { second: '2-digit' }),
                senderName: agentRef.name,
                senderTitle: agentRef.title,
                text: text,
                type: 'agent',
                color: senderId === 'ceo' ? 'text-neutral-900 border-neutral-400 bg-neutral-50' : 'text-[#008060] border-emerald-200 bg-emerald-50/50'
              }
            ]);
          }
          resolve();
        }, timeOffset);
      });
    };

    try {
      // Step 2: Begin Multi-Agent Collaborative pipeline logs
      await logStep(300, 'ceo', '📥 收到商户指令。正在针对 Atelier Noir 多源资产包启动专席会商。');
      
      if (cleanPrompt.includes('库存') || cleanPrompt.includes('仓库') || cleanPrompt.includes('低') || cleanPrompt.includes('kucun')) {
        await logStep(900, 'logistic', '📦 供应链主管：正在查存大盘。Ceramic Pour-Over Coffee Brewer 确有红色警报（剩余3件）。需即刻自欧洲二号保税港向多式航线注入 10 箱补充调拨。');
        await logStep(1800, 'finance', '📊 财务精算官：测算调配预算。跨区调配需要预提跨港关税 €45.00，建议分摊至最终零售溢价。');
        await logStep(2500, 'writer', '✍️ 奢雅文案官：已为即将到仓的补货批次配写奢品标签，打上「手工限产限量」稀缺属性。');
        await logStep(3200, 'ceo', '🏆 CEO 协调官：会商完成。已整合库存分配凭证以及价格修订方案，正在推至主屏幕。');

        const productWithLowStock = products.find(p => p.inventory < 10) || products[0] || { title: 'Ceramic Pour-Over Coffee Brewer', sku: 'MC-DRP-CHR', inventory: 3, price: 49.00 };

        finalResponseText = `### 📋 专家协同会商备忘：【保税仓跨区跨币调配方案】

由 **多智能工作组** 联合会审，并根据真实网店库存进行全链路规划：

#### 1. 🔍 物流实地审计信息 (由 供应链主管 提出)
* **警报货品**: **${productWithLowStock.title}** (SKU: \`${productWithLowStock.sku || 'MC-DRP-CHR'}\`)
* **现状**: 仅存 **${productWithLowStock.inventory} 件** (极度紧俏)
* **调配动线**: 从 **比利时布鲁塞尔主仓** (Brussels Hub) 紧急调配 **100 件** 经由 DHL 空运至 **德国柏林分销中枢**。

#### 2. 💱 财务合规合审计 (由 财务精算 提出)
* **物流预提规费**: €45.00
* **成本分摊核算**: 平均每件分摊折价损耗仅 €0.45，对 Atelier Noir **日活跃综合毛利率**影响极微，可一键通过。
* **跨境 VAT 税级**: 对符合多区寄宿货品，按目的地国自动折算 22% VAT，无需重复申报。

#### 3. ✍️ 奢侈宣传卖点 (由 奢雅文案官 注入)
在页面商品名上方增添极简前台提示：
> *"Edition Limitée. 每一件滤杯均为阿登山脉本土陶工纯手工压磨成型，因海外发货周期与工时限制，本季仅少量追加释出，敬请尊享。"*

---

#### 💡 快捷控制台动作：
* 🟢 **一键导出调拨单**: 生成 DHL 航空托运单证「Brussels-To-Berlin-A99」
* 🟢 **低库存自动通知**: 下发警报邮件至仓储经理邮箱 (admin@ateliernoir.co)`;
      
      } else if (cleanPrompt.includes('描述') || cleanPrompt.includes('文案') || cleanPrompt.includes('亚麻') || cleanPrompt.includes('shirt') || cleanPrompt.includes('wenan')) {
        await logStep(900, 'writer', '✍️ 奢雅文案官：起草构思。选用欧洲古典麻布作为剪裁母体，风格秉持不设累赘多余暗扣。文案定调节制而高级。');
        await logStep(1850, 'finance', '📊 财务精算官：比对竞品奢牌单客 LTV，结合22% VAT 出埠清算法。建议定价 €89.00，以确保单客毛利维持在 78% 优雅分水线。');
        await logStep(2600, 'growth', '⚡ 流量企划官：已建立 Klaviyo 触达模版，一旦该商品上线将自动在“高意愿复购 VIP 欧洲籍群组”中投送，预期开封率 42.5%。');
        await logStep(3300, 'ceo', '🏆 CEO 协调官：会商完成。高保真文案搭配定价配额方案已成型。');

        finalResponseText = `### 📋 专家协同会商备忘：【比利时亚麻家居服静奢文案】

由 **Atelier Multi-Agent 奢雅工作组** 独家起草定制：

#### 1. ✍️ 极简优雅文案 (由 奢雅文案官 起草)
> **「Atelier Unstructured Linen Loungewear」大西洋午夜亚麻家居衣套组**
>
> *"秉承理性中性中性法则。取自比利时法兰德斯源头精织麻纱，让自然纤维带着空气的孔隙自由流动。整体剪裁采用落肩流落、无多余外露缝隙，隐藏式亚克力搭扣不争风头。这是写意起居空间内的知性建筑线条。"*

#### 2. 📊 定价与商贸精算 (由 财务精算 测算)
* **奢牌溢价建议**: **€89.00**
* **理由**: 该面料拿货成本每套 €18.00。通过静奢定位包装建立 78% 的超高边际毛利。
* **VAT 增值税结算**:
  * 欧盟本埠客户: 22% 自动核销
  * 美加及亚太客户: 0% 出区税率自动免征，提高网店美化效果！

#### 3. 🎯 会员专属分发 (由 流量企划官 策划)
* **标签分派**: 一键自动赋予购买客户 \`vip-loungewear\` 以及 \`sustainable-living\` 阶层元数据体系。
* **自动触达**: 开启 Atelier 挽回引擎中的「高定家居服装专页」自动推送模块。

---

#### 💡 快捷控制台动作：
* 🟢 **一键应用并上架**: 建立货品预留草稿，并将此描述推送至 \`Atelier Silhouettes\` 模块`;
      
      } else if (cleanPrompt.includes('税') || cleanPrompt.includes('财务') || cleanPrompt.includes('vat') || cleanPrompt.includes('汇率') || cleanPrompt.includes('caiwu')) {
        await logStep(900, 'finance', '📊 财务精算官：正在抓取本网店真实的四笔订单收益，比对欧元 (EUR) 汇本位与对端结汇币种折算。发现本月欧元结算存在轻微 Forex 汇兑顺差。');
        await logStep(1800, 'ceo', '📥 CEO 协调官：呼叫供应链主管，评估该批税后利润是否可直接填补德意志集货仓租。');
        await logStep(2500, 'logistic', '📦 供应链主管：确认可行。建议将最新结余转作为 DHL 预存款，能直接抵扣后续 200 张单证的面单托收费。');
        await logStep(3200, 'ceo', '🏆 CEO 协调官：财务及资产流动审计完毕，全套清单已列明。');

        const totalEarned = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        const totalVat = (totalEarned * 0.22).toFixed(2);

        finalResponseText = `### 📋 专家协同会商备忘：【Atelier 季度财务与欧洲多区域 VAT 审计】

由 **Atelier 财务精算专家席位** 出具的真实经营收益与汇兑对账单：

#### 1. 📊 网店订单营收总览 (由 财务精算 测算)
* **本季度累积结算流水**: **€ ${totalEarned.toFixed(2)}** (实时大盘订单合计)
* **合并欧盟增值税扣减 (VAT)**: **€ ${totalVat}** (按标准德/意本埠 22% 溢出估算)
* **Forex 跨境汇率顺差溢额**: **+€ 154.20** (主要由大西洋美加市场出区结汇产生)

#### 2. 🚛 资产优化重划动线 (由 供应链主管 提出)
* **财务盈余重划**: 我们建议将财务 Forex 顺差溢额（**€154.20**）一键转划为 **DHL Express 预存邮资账户**。
* **效益**:
  * 抵扣后续预计 **75 套** 跨境托运包裹税金。
  * 避免欧洲央行利率滞后导致的兑换费流失风险。

---

#### 💡 快捷控制台动作：
* 🟢 **自动开具 VAT 凭据**: 系统生成「Invoice_2026_Q2_VAT」
* 🟢 **保税盈余冲抵**: 锁定 €154.20 顺差冲入 DHL 自动打单池`;

      } else if (cleanPrompt.includes('弹') || cleanPrompt.includes('出站') || cleanPrompt.includes('弃单') || cleanPrompt.includes('优惠券') || cleanPrompt.includes('retention') || cleanPrompt.includes('yinhuan')) {
        await logStep(900, 'growth', '⚡ 流量企划官：起草促单拦截。当顾客鼠标滑出页面时，停留 StayPop 模块需精准截击，并在 50ms 内送上精心包装的专属 15% OFF 皇家折扣。');
        await logStep(1800, 'writer', '✍️ 奢雅文案官：修改设计，去除传统大字体特价销售的市井气。主语定格为「专享生活提案，让生活歇一口气」。');
        await logStep(2550, 'finance', '📊 财务精算官：评估盈余承受。核算后 15% 促单折扣，对于全店 78% 的静奢毛利仍在绝对安全区域。');
        await logStep(3200, 'ceo', '🏆 CEO 协调官：出站留客方案会商完毕，符合企业级促单标准。');

        finalResponseText = `### 📋 专家协同会商备忘：【出站客群 StayPop 智能拦截与弃单挽回】

由 **Atelier 营销与静奢企划组** 精细雕琢：

#### 1. ⚡ 留截机制 (由 流量企划官 设计)
* **技术触发机制**: 检测客户鼠标流出屏幕顶端。
* **反应时间**: 小于 **50ms**，在客户尚未合拢 Chrome 标签页的一瞬间进行淡入拦截。
* **促单代码**: \`FESTIVE15\` (15% OFF)

#### 2. ✍️ 奢侈拦截文案配对 (由 奢雅文案官 主持)
摒弃“特卖促销”、“最后疯抢”等大众化 Bootstrap 后台词汇。采用高级静奢话语：
> *"Avant de partir... 我们为您准备了一份专享的生活留白提案。*
> 
> *感谢您作客 Atelier Noir 高定展间。在您的灵感成行前，输入券码以享有 8.5 折的高定配对致礼。*"

#### 3. 📊 毛利回测审计 (由 财务精算 测算)
* **当前最低客均价 (AOV)**: €68.50
* **优惠后预估单票扣减**: -€10.27
* **财务安全系数**: **5.2x** (毛利大盘稳固，极具投入产出比)

---

#### 💡 快捷控制台动作：
* 🟢 **立即开启拦截生效**: 在网店后台一键激活 StayPop PWA 代码
* 🟢 **装配邮件提醒**: 注入该代码至 Klaviyo 会员留存路径`;

      } else {
        // Fallback or Generic intelligent team response
        await logStep(800, 'ceo', '🔍 正在对通识性店面运营策略进行全智能团队审计...');
        await logStep(1800, 'writer', '✍️ 奢雅文案官：已从美学叙事维度审视，一切完好。');
        await logStep(2600, 'finance', '📊 财务精算官：已全面比对多币种收汇平衡线，账单均无坏账。');
        await logStep(3250, 'ceo', '🏆 CEO 协调官：已汇总所有经营要诀。');

        const geminiClient = true; // Use smart proxy / fallbacks
        try {
          const response = await fetch('/api/sidekick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: promptText,
              storeState: { products, orders, discounts }
            })
          });
          const resData = await response.json();
          finalResponseText = resData.text;
        } catch {
          finalResponseText = `### 📋 专家协同会商备忘：【Atelier 综合咨询响应】

**多智能体工作组** 已对您的指令：「*${promptText}*」研议完毕：

#### 建议摘要：
* **宏观运营**: Atelier Noir 目前保持健康的 **78% 毛利水平**。订单和客户留存极佳。
* **多渠道发货**: 供应链系统建议保持欧洲本埠 DHL 的高频运输。
* **智能大脑推荐**:
  * 📦 输入“**低库存**”让物流官紧急开拔
  * ✍️ 输入“**亚麻文案**”让文案官下笔生花
  * 📊 输入“**财务税负**”让精算官理清 VAT 关税`;
        }
      }

      setAgents(curr => curr.map(a => ({ ...a, status: 'completed' })));
      
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: 'model',
        agent: 'multitask',
        text: finalResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, assistantMsg]);

    } catch (e: any) {
      console.error(e);
      // Fallback
      setAgents(curr => curr.map(a => ({ ...a, status: 'idle' })));
      const errTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'model',
        agent: 'ceo',
        text: `会商过程中出现微小延迟，请再试一次，或者检查互联网连接。`,
        timestamp: errTime
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-fadeIn font-sans text-neutral-900 select-none pb-8">
      
      {/* 1. Left hand side Context Sidebar: Session logs and quick indicators */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* Session card grouped list */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-neutral-400">最近会话</span>
            <button 
              onClick={() => {
                setMessages([{
                  id: 'init-rev',
                  role: 'model',
                  agent: 'ceo',
                  text: '全新专家会商席位已建立。期待协助您经营 Atelier Noir。',
                  timestamp: new Date().toLocaleTimeString()
                }]);
                setSynergyLogs([]);
              }}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-black transition-colors"
              title="New Session"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="space-y-2 h-[220px] overflow-y-auto scrollbar-none pr-1">
            {SESSION_LIST.map((ses) => (
              <div
                key={ses.id}
                onClick={() => {
                  setActiveSessionId(ses.id);
                  let promptToRun = "库存紧张，想看调配方案";
                  if (ses.id === 'session_2') promptToRun = "起草比利时亚麻家居鞋文案";
                  if (ses.id === 'session_3') promptToRun = "帮我配餐一个停留StayPop智能出站拦截方案";
                  if (ses.id === 'session_4') promptToRun = "核算我本季度的增值税 VAT 和 Forex 业绩";
                  handleExecuteSynergy(promptToRun);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                  activeSessionId === ses.id 
                    ? 'border-neutral-900 bg-[#008060]/5 shadow-2xs' 
                    : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100/50'
                }`}
              >
                <span className="text-[11px] font-bold text-neutral-850 truncate">{ses.title}</span>
                <div className="flex items-center justify-between text-[9px] text-[#888]">
                  <span className="font-mono">{ses.time}</span>
                  <span className="bg-neutral-200/60 px-1 py-0.2 rounded font-sans scale-90">合议</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data insights panel (数据洞察) */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm space-y-4">
          <div className="border-b border-neutral-100 pb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-neutral-400">智能数据</span>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-1 gap-3.5">
            {AGENT_STATS.map((rec, i) => (
              <div key={i} className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/70 text-left">
                <span className="block text-[8px] font-bold text-neutral-400 uppercase tracking-wider font-mono">{rec.label}</span>
                <span className="text-sm font-bold text-neutral-900 block mt-1 font-mono tracking-tight">{rec.value}</span>
                <span className="text-[9px] text-green-700 font-semibold block mt-1 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 text-green-600 inline" />
                  <span>{rec.change}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. Main Middle Workspace: Large High-fidelity Chat Console */}
      <div className="xl:col-span-2 space-y-6 flex flex-col h-[740px]">
        
        {/* Workspace interactive main container */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col flex-1 overflow-hidden">
          
          {/* Header workspace banner */}
          <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-neutral-250/70">
            <div className="flex items-center space-x-3 text-left">
              <div className="bg-[#008060] p-2 text-white rounded-xl shadow-xs">
                <Bot className="w-4 h-4 text-white rotate-0" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-tight">多智能脑</h2>
                  <span className="px-1.5 py-0.2 bg-emerald-50 text-[#008060] text-[8px] rounded font-bold uppercase border border-emerald-200">联勤会商</span>
                </div>
                <p className="text-[9px] text-neutral-400 mt-0.5 tracking-wide font-mono scale-95 origin-left">协同平台</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 border border-neutral-200/80 bg-neutral-50 px-2.5 py-1 rounded-xl">
              <span className="text-[9px] font-bold text-neutral-450 mr-1.5 font-mono">风格:</span>
              {['collaborative', 'delegate'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setTeamMode(mode as any);
                    if (mode === 'delegate') setSelectedAgent('writer');
                    else setSelectedAgent('all');
                  }}
                  className={`px-2.5 py-0.5 text-[9px] rounded font-semibold transition-all cursor-pointer ${
                    teamMode === mode 
                      ? 'bg-[#008060] text-white font-bold shadow-xs' 
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  {mode === 'collaborative' ? '合议' : '指派'}
                </button>
              ))}
            </div>
          </div>

          {/* Collaborative view mode sub-selector */}
          {teamMode === 'delegate' && (
            <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2 flex items-center space-x-2 overflow-x-auto scrollbar-none text-left">
              <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono tracking-wider shrink-0">指派顾问:</span>
              {agents.filter(a => a.id !== 'ceo').map(a => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAgent(a.id)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
                    selectedAgent === a.id
                      ? 'bg-[#008060] border-[#006e52] text-white shadow-3xs'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${a.color}`}></span>
                  <span>{a.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Interactive core chat log screen */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#fafbfa]">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* Chat bubble element adhering to 20 rounded custom card */}
                  <div className={`max-w-[85%] rounded-2xl p-4 text-left ${
                    isUser 
                      ? 'bg-[#008060] text-white rounded-br-none' 
                      : 'bg-white border border-neutral-200 rounded-bl-none shadow-sm'
                  }`}>
                    {isUser ? (
                      <p className="text-[11px] leading-relaxed selection:bg-neutral-200">{msg.text}</p>
                    ) : (
                      <div className="space-y-1.5 text-neutral-800 text-[11.5px] leading-relaxed selection:bg-emerald-100">
                        {msg.text.split('\n').map((line: string, idx: number) => {
                          let content = line;
                          if (content.startsWith('### ')) {
                            return <h3 key={idx} className="font-bold text-xs text-[#008060] mt-4 mb-2 border-b pb-1 flex items-center font-sans">{content.replace('### ', '')}</h3>;
                          }
                          if (content.startsWith('#### ')) {
                            return <h4 key={idx} className="font-bold text-[11px] text-neutral-900 mt-3 mb-1 flex items-center font-mono">{content.replace('#### ', '')}</h4>;
                          }
                          if (content.startsWith('* ')) {
                            const cleaned = content.substring(2);
                            return (
                              <li key={idx} className="ml-3 list-disc py-0.5 text-neutral-700">
                                {parseInlineColors(cleaned)}
                              </li>
                            );
                          }
                          if (content.startsWith('> ')) {
                            return (
                              <blockquote key={idx} className="border-l-2 border-neutral-800 pl-3 py-1 my-2 italic bg-neutral-50 rounded-r text-neutral-650 text-[11px]">
                                {parseInlineColors(content.replace('> ', ''))}
                              </blockquote>
                            );
                          }
                          if (content.trim() === '') return <div key={idx} className="h-1.5" />;
                          return <p key={idx}>{parseInlineColors(content)}</p>;
                        })}
                      </div>
                    )}
                    
                    {/* Interactive Operational buttons if AI says certain terms */}
                    {!isUser && (msg.text.includes('Brussels-To-Berlin-A99') || msg.text.includes('Linen Loungewear') || msg.text.includes('FESTIVE15') || msg.text.includes('StayPop')) && (
                      <div className="mt-4 pt-3 border-t border-dashed border-neutral-200 flex flex-wrap gap-2.5">
                        {/* 1. Low stock logic */}
                        {msg.text.includes('Brussels-To-Berlin-A99') && (
                          <button
                            onClick={() => handleReplenishInventory('MC-DRP-CHR')}
                            disabled={replenishedProducts['MC-DRP-CHR']}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-[12px] flex items-center space-x-1 transition-all ${
                              replenishedProducts['MC-DRP-CHR']
                                ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed font-medium'
                                : 'bg-[#008060] text-white hover:bg-[#006e52] shadow-xs cursor-pointer'
                            }`}
                          >
                            {replenishedProducts['MC-DRP-CHR'] ? (
                              <>
                                <Check className="w-3 h-3 mr-0.5 inline" />
                                <span>补仓执行成功 (120件)</span>
                              </>
                            ) : (
                              <span>一键跨仓调补 120 件</span>
                            )}
                          </button>
                        )}

                        {/* 2. Copywriting product generation logic */}
                        {msg.text.includes('Linen Loungewear') && (
                          <button
                            onClick={handleAddLinenLoungewear}
                            disabled={addedLinenItems['loungewear']}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-[12px] flex items-center space-x-1 transition-all ${
                              addedLinenItems['loungewear']
                                ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed font-medium'
                                : 'bg-neutral-900 text-white hover:bg-black shadow-xs cursor-pointer'
                            }`}
                          >
                            {addedLinenItems['loungewear'] ? (
                              <>
                                <Check className="w-3 h-3 mr-0.5 inline" />
                                <span>商品已成功发布 (Atelier Linen)</span>
                              </>
                            ) : (
                              <span>一键上架高定亚麻新品</span>
                            )}
                          </button>
                        )}

                        {/* 3. Offer code discount logic */}
                        {msg.text.includes('FESTIVE15') && (
                          <button
                            onClick={handleAddDiscount}
                            disabled={addedDiscounts['FESTIVE15']}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-[12px] flex items-center space-x-1 transition-all ${
                              addedDiscounts['FESTIVE15']
                                ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed font-medium'
                                : 'bg-[#008060] text-white hover:bg-[#006e52] shadow-xs cursor-pointer'
                            }`}
                          >
                            {addedDiscounts['FESTIVE15'] ? (
                              <>
                                <Check className="w-3 h-3 mr-0.5 inline" />
                                <span>折扣专券已全站生效</span>
                              </>
                            ) : (
                              <span>一键上架折扣「FESTIVE15」</span>
                            )}
                          </button>
                        )}

                        {/* 4. StayPop exit intent trigger logic */}
                        {msg.text.includes('StayPop') && (
                          <button
                            onClick={handleToggleStayPop}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-[12px] flex items-center space-x-1 transition-all ${
                              stayPopActive
                                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 cursor-pointer text-[10px]'
                                : 'bg-[#008060] text-white hover:bg-[#006e52] shadow-xs cursor-pointer text-[10px]'
                            }`}
                          >
                            {stayPopActive ? (
                              <span>停用 StayPop 智能拦截</span>
                            ) : (
                              <span>一键开启 StayPop 智能拦截</span>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[8px] text-neutral-400 mt-1 font-mono">{msg.timestamp}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-neutral-200 rounded-2xl p-3.5 rounded-bl-none shadow-xs flex items-center space-x-2">
                  <span className="text-[10px] text-neutral-400 font-mono italic">
                    {teamMode === 'collaborative' ? '专家组会商协调中' : '商铺特使精算中'}
                  </span>
                  <span className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-neutral-800 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick interactive prompts cue list */}
          {messages.length <= 1 && (
            <div className="px-5 py-3 border-t border-neutral-100 bg-white text-left">
              <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-neutral-400 block mb-2">快捷操作 & 灵感推荐</span>
              <div className="grid grid-cols-2 gap-2">
                {PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleExecuteSynergy(p.text)}
                    className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-[#006e52] hover:text-white hover:border-neutral-850 transition-all text-left text-[10px] cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-semibold line-clamp-1 truncate mr-2 pr-1">{p.label}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat text box console input */}
          <div className="p-4 border-t border-neutral-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteSynergy(inputValue);
              }}
              className="relative flex items-center border border-neutral-300 rounded-2xl bg-neutral-50 focus-within:ring-1 focus-within:ring-neutral-900 focus-within:border-neutral-900 focus-within:bg-white overflow-hidden transition-all"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  teamMode === 'collaborative' 
                    ? "输入商铺任务（由全体专家多席位共同探讨决策）..." 
                    : "对派系专派顾问输入特定的命令..."
                }
                className="flex-1 px-4 py-3 text-xs bg-transparent focus:outline-none pr-12 text-neutral-900"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white disabled:bg-neutral-100 disabled:text-neutral-400 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-1.5 px-2">
              <p className="text-[9px] text-neutral-400 font-mono text-left">
                状态: <strong>在线就位 (Shopify OS)</strong>
              </p>
              <span className="text-[8px] text-neutral-400 font-mono flex items-center">
                回车 <CornerDownLeft className="w-2.5 h-2.5 ml-1" />
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Right hand side Agent grid list & live synergy stream */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* Active Synergy Live Logs column */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm flex flex-col h-[320px]">
          <div className="border-b border-neutral-100 pb-2.5 mb-2.5 text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#008060] animate-spin" />
              <span>会商流</span>
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2.5 text-[10px] font-mono pr-1 text-left scrollbar-none">
            {synergyLogs.length > 0 ? (
              synergyLogs.map((log) => (
                <div key={log.id} className={`p-2 rounded-xl border border-dashed flex flex-col gap-1 ${log.color} animate-slideDown`}>
                  <div className="flex items-center justify-between text-[8px] opacity-75">
                    <span className="font-bold uppercase">{log.senderName} ({log.senderTitle})</span>
                    <span>{log.time}</span>
                  </div>
                  <p className="leading-relaxed text-neutral-700">{log.text}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 italic space-y-2 select-none py-8">
                <HelpCircle className="w-5 h-5 text-neutral-350" />
                <span className="text-[9px]">暂无记录</span>
              </div>
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Professional Multi-Agent Status grid */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm space-y-3.5">
          <div className="border-b border-neutral-100 pb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-neutral-400">在线专家 ({agents.length})</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span className="text-[8px] font-mono text-green-700 font-bold uppercase">Ready</span>
            </span>
          </div>

          <div className="space-y-2.5 text-left">
            {agents.map((ag) => {
              const IconComp = ag.icon;
              return (
                <div 
                  key={ag.id} 
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-all relative overflow-hidden ${
                    ag.status === 'analyzing' 
                      ? 'border-[#008060] bg-emerald-50/20' 
                      : ag.status === 'completed'
                      ? 'border-neutral-800 bg-[#008060]/5'
                      : 'border-neutral-200 bg-neutral-50/50'
                  }`}
                >
                  {ag.status === 'analyzing' && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#008060] animate-pulse"></div>
                  )}

                  <img 
                    src={ag.avatar} 
                    alt={ag.name} 
                    className="w-8 h-8 rounded-full border border-neutral-300 object-cover shrink-0 mt-0.5" 
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-neutral-900">{ag.name}</span>
                        <span className="text-[8px] text-neutral-400 block font-mono leading-none">{ag.title}</span>
                      </div>
                      
                      {ag.status === 'analyzing' ? (
                        <span className="flex items-center gap-1 text-[8px] text-[#008060] bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded font-mono font-bold uppercase">
                          <RefreshCcw className="w-2.5 h-2.5 animate-spin" />
                          <span>审计中</span>
                        </span>
                      ) : ag.status === 'completed' ? (
                        <span className="flex items-center gap-0.5 text-[8px] text-green-700 bg-green-50 border border-green-200 px-1 py-0.2 rounded font-mono font-bold uppercase">
                          <Check className="w-2.5 h-2.5 text-green-600" />
                          <span>就绪</span>
                        </span>
                      ) : (
                        <span className="text-[8px] text-neutral-400 bg-neutral-100 hover:bg-neutral-200 px-1 py-0.2 rounded font-mono uppercase">
                          待命
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-[#888] leading-normal">{ag.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

// Inline Style Parser helper implementing bold **words** and colored elements
function parseInlineColors(txt: string) {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const codeRegex = /`(.*?)`/g;

  let cleanText = txt;
  // Safely inject small customized spans
  return <span dangerouslySetInnerHTML={{
    __html: cleanText
      .replace(boldRegex, '<strong class="font-bold text-[#008060]">$1</strong>')
      .replace(codeRegex, '<code class="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-[10px] font-mono text-neutral-800">$1</code>')
  }} />;
}
