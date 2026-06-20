import type { 
  AgentInfo, 
  BullQueue, 
  MerchantStore, 
  RuntimeLog, 
  ApprovalItem, 
  Notification,
  TimelineEvent,
  BillingStats,
  SafetyRules,
  Product,
  Order,
  Customer,
  Discount
} from './types';

// 初始智能体数据
export const INITIAL_AGENTS: AgentInfo[] = [
  {
    id: 'marketing-agent',
    name: 'marketing',
    displayName: '营销助理',
    status: 'idle',
    model: 'gemini-2.5-flash',
    taskCount: 142,
    memory: '14.2 MB',
    tools: ['create-discount-code', 'generate-copywriting', 'simulate-ctr', 'send-newsletter'],
    logs: [
      '[12:00:10] 已加载营销活动模板结构',
      '[11:45:22] 触发批量邮件任务路由',
      '[10:30:15] 完成批量通讯处理 (230 订阅者)'
    ]
  },
  {
    id: 'support-agent',
    name: 'support',
    displayName: '客服助理',
    status: 'executing',
    model: 'gemini-2.5-pro',
    taskCount: 389,
    memory: '28.9 MB',
    tools: ['retrieve-tickets', 'analyze-sentiment', 'draft-response', 'escalate-to-human'],
    logs: [
      '[12:01:40] 活跃用户会话请求结账支持',
      '[12:01:41] 调用工单检索搜索',
      '[12:01:42] 已发送个性化回复草稿'
    ]
  },
  {
    id: 'product-agent',
    name: 'product',
    displayName: '商品助理',
    status: 'idle',
    model: 'gemini-2.8-ultra',
    taskCount: 94,
    memory: '42.1 MB',
    tools: ['scrape-supplier-catalog', 'auto-generate-tags', 'optimize-images', 'sync-inventory'],
    logs: [
      '[11:15:30] 完成15个SKU目录的批量导入',
      '[11:15:35] 已入队商品生成任务'
    ]
  },
  {
    id: 'finance-agent',
    name: 'finance',
    displayName: '财务助理',
    status: 'idle',
    model: 'gemini-1.5-pro',
    taskCount: 221,
    memory: '8.4 MB',
    tools: ['reconcile-payouts', 'forecast-burn-rate', 'export-pdf-invoice'],
    logs: [
      '[09:00:00] 启动每周结算余额审计',
      '[09:05:12] 检测到商户 MRCH-902 异常交易'
    ]
  },
  {
    id: 'analytics-agent',
    name: 'analytics',
    displayName: '数据助理',
    status: 'idle',
    model: 'gemini-2.5-flash',
    taskCount: 1045,
    memory: '12.8 MB',
    tools: ['aggregate-metrics', 'forecast-token-spikes', 'compute-retries-ratio', 'generate-telemetry-digest'],
    logs: [
      '[12:01:10] 聚合6个活跃节点的多智能体令牌指标',
      '[11:45:00] 计算每小时队列延迟峰值'
    ]
  }
];

// 初始队列数据
export const INITIAL_QUEUES: BullQueue[] = [
  {
    name: 'product-generation',
    displayName: '商品生成',
    waiting: 2,
    active: 1,
    completed: 421,
    failed: 12,
    jobs: [
      { id: 'job-p1', name: '生成商品描述', status: 'active', payload: '{"skuCount": 5}', timestamp: '12:00:55' },
      { id: 'job-p2', name: '图片优化处理', status: 'waiting', payload: '{"resolutions": ["1080p", "4k"]}', timestamp: '12:01:22' },
      { id: 'job-p3', name: '索引搜索模型', status: 'completed', payload: '{"indexes": ["prod-vector-db"]}', timestamp: '11:58:34' }
    ]
  },
  {
    name: 'email-campaign',
    displayName: '邮件营销',
    waiting: 0,
    active: 0,
    completed: 1845,
    failed: 3,
    jobs: [
      { id: 'job-e1', name: '触发购物车召回流程', status: 'completed', payload: '{"audienceSize": 89}', timestamp: '11:45:00' },
      { id: 'job-e2', name: '预热邮件服务器', status: 'completed', payload: '{"nodes": ["sg-ap-east"]}', timestamp: '11:30:11' }
    ]
  },
  {
    name: 'bulk-edit',
    displayName: '批量编辑',
    waiting: 5,
    active: 1,
    completed: 822,
    failed: 41,
    jobs: [
      { id: 'job-b1', name: '全店促销折扣', status: 'active', payload: '{"stores": ["all"], "discount": "20%"}', timestamp: '12:01:10' },
      { id: 'job-b2', name: '重算区域税率', status: 'waiting', payload: '{"regions": ["EU-West", "APAC"]}', timestamp: '12:01:35' }
    ]
  },
  {
    name: 'analytics',
    displayName: '数据分析',
    waiting: 0,
    active: 0,
    completed: 24042,
    failed: 15,
    jobs: [
      { id: 'job-a1', name: '聚合AI令牌指标', status: 'completed', payload: '{"period": "hour-24"}', timestamp: '12:00:00' }
    ]
  }
];

// 初始商户数据
export const INITIAL_MERCHANTS: MerchantStore[] = [
  {
    id: 'MRCH-901',
    name: '极简科技旗舰店',
    merchantName: 'Aero Labs Inc.',
    plan: 'Enterprise',
    aiUsage: '3.4M / 5M',
    limitPattern: '68%',
    status: 'active',
    tokenCost: 142.20
  },
  {
    id: 'MRCH-902',
    name: '潮流服饰官方店',
    merchantName: 'UrbanStyle Co.',
    plan: 'Pro',
    aiUsage: '890K / 1M',
    limitPattern: '89%',
    status: 'active',
    tokenCost: 78.50
  },
  {
    id: 'MRCH-903',
    name: '智能家居体验馆',
    merchantName: 'SmartHome Ltd.',
    plan: 'Starter',
    aiUsage: '120K / 200K',
    limitPattern: '60%',
    status: 'active',
    tokenCost: 12.30
  },
  {
    id: 'MRCH-904',
    name: '美妆集合店',
    merchantName: 'BeautyBox Inc.',
    plan: 'Pro',
    aiUsage: '950K / 1M',
    limitPattern: '95%',
    status: 'suspended',
    tokenCost: 89.90
  }
];

// 初始日志数据
export const INITIAL_LOGS: RuntimeLog[] = [
  {
    id: 'LOG-001',
    timestamp: '12:01:45',
    action: 'product.batch_update',
    payload: '{"count": 24, "fields": ["price", "inventory"]}',
    merchantId: 'MRCH-901',
    status: 'success',
    executor: 'product-agent'
  },
  {
    id: 'LOG-002',
    timestamp: '12:01:30',
    action: 'email.campaign_send',
    payload: '{"recipients": 1250, "template": "summer_sale"}',
    merchantId: 'MRCH-902',
    status: 'executing',
    executor: 'marketing-agent'
  },
  {
    id: 'LOG-003',
    timestamp: '12:00:15',
    action: 'order.refund_process',
    payload: '{"orderId": "ORD-8842", "amount": 299.00}',
    merchantId: 'MRCH-901',
    status: 'success',
    executor: 'finance-agent'
  },
  {
    id: 'LOG-004',
    timestamp: '11:58:22',
    action: 'inventory.sync',
    payload: '{"warehouse": "SH-01", "items": 156}',
    merchantId: 'MRCH-903',
    status: 'failed',
    executor: 'product-agent'
  },
  {
    id: 'LOG-005',
    timestamp: '11:45:10',
    action: 'customer.segment_update',
    payload: '{"segment": "vip_customers", "added": 45}',
    merchantId: 'MRCH-901',
    status: 'success',
    executor: 'analytics-agent'
  }
];

// 初始审批数据
export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'APR-001',
    type: 'refund',
    target: '订单 #ORD-9921',
    status: 'pending',
    requestedBy: 'support-agent',
    severity: 'High',
    timestamp: '12:00:30',
    payload: { orderId: 'ORD-9921', amount: 1299.00, reason: '商品质量问题' },
    limits: '超出单笔退款限额 ¥500'
  },
  {
    id: 'APR-002',
    type: 'bulk_edit',
    target: '批量修改 324 个商品价格',
    status: 'pending',
    requestedBy: 'product-agent',
    severity: 'Critical',
    timestamp: '11:55:00',
    payload: { productCount: 324, priceChange: '-15%' },
    limits: '涉及商品数量超过 100'
  },
  {
    id: 'APR-003',
    type: 'payout',
    target: '商户结算 MRCH-902',
    status: 'approved',
    requestedBy: 'finance-agent',
    severity: 'Medium',
    timestamp: '11:30:00',
    payload: { merchantId: 'MRCH-902', amount: 45680.00 },
    limits: '常规结算'
  }
];

// 初始通知数据
export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'N-001',
    type: 'warning',
    title: 'AI 配额警告',
    text: '商户 MRCH-902 的 AI 用量已达 89%',
    timestamp: '12:00',
    read: false
  },
  {
    id: 'N-002',
    type: 'failure',
    title: '同步失败',
    text: '仓库 SH-01 库存同步任务失败',
    timestamp: '11:58',
    read: false
  },
  {
    id: 'N-003',
    type: 'success',
    title: '营销活动已启动',
    text: '夏季促销邮件已发送至 1,250 位客户',
    timestamp: '11:45',
    read: true
  }
];

// 初始时间线数据
export const INITIAL_TIMELINE: TimelineEvent[] = [
  { time: '12:01', author: 'product-agent', type: 'order', text: '处理了 3 个新订单' },
  { time: '11:45', author: 'marketing-agent', type: 'marketing', text: '启动夏季促销活动' },
  { time: '11:30', author: 'system', type: 'system', text: '系统自动备份完成' },
  { time: '10:15', author: 'support-agent', type: 'staff', text: '回复了 12 个客户咨询' }
];

// 初始账单统计
export const INITIAL_BILLING_STATS: BillingStats = {
  aiQuotaUsed: 4250000,
  agentNodeCost: 156.80,
  apiSurcharges: 23.50,
  databaseVCPUHours: 48.5
};

// 初始安全规则
export const INITIAL_SAFETY_RULES: SafetyRules = {
  maxRefund: 500,
  maxPriceChangePct: 20,
  allowDangerousBulkDelete: false,
  requireAdminForPayouts: true
};

// 初始产品数据
export const INITIAL_PRODUCTS: Product[] = [
  { id: 'PRD-001', name: '智能手表 Pro Max', sku: 'SW-PRO-001', price: 2999, stock: 156, status: 'active', category: '智能设备' },
  { id: 'PRD-002', name: '无线降噪耳机', sku: 'WH-NC-002', price: 899, stock: 342, status: 'active', category: '音频设备' },
  { id: 'PRD-003', name: '便携充电宝 20000mAh', sku: 'PB-20K-003', price: 199, stock: 0, status: 'draft', category: '配件' },
  { id: 'PRD-004', name: '机械键盘 87键', sku: 'KB-87-004', price: 599, stock: 89, status: 'active', category: '外设' },
  { id: 'PRD-005', name: '4K显示器 27英寸', sku: 'MN-4K27-005', price: 2499, stock: 45, status: 'active', category: '显示器' },
  { id: 'PRD-006', name: '人体工学椅', sku: 'CH-ERG-006', price: 1899, stock: 23, status: 'archived', category: '办公家具' }
];

// 初始订单数据
export const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-9921', customer: '张伟', email: 'zhang.wei@email.com', total: 3898, status: 'pending', items: 2, date: '2024-01-15' },
  { id: 'ORD-9920', customer: '李娜', email: 'li.na@email.com', total: 899, status: 'processing', items: 1, date: '2024-01-15' },
  { id: 'ORD-9919', customer: '王芳', email: 'wang.fang@email.com', total: 5497, status: 'shipped', items: 3, date: '2024-01-14' },
  { id: 'ORD-9918', customer: '刘强', email: 'liu.qiang@email.com', total: 199, status: 'delivered', items: 1, date: '2024-01-13' },
  { id: 'ORD-9917', customer: '陈静', email: 'chen.jing@email.com', total: 2999, status: 'cancelled', items: 1, date: '2024-01-12' }
];

// 初始客户数据
export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'CUS-001', name: '张伟', email: 'zhang.wei@email.com', orders: 12, spent: 25680, lastOrder: '2024-01-15', status: 'active' },
  { id: 'CUS-002', name: '李娜', email: 'li.na@email.com', orders: 8, spent: 12450, lastOrder: '2024-01-15', status: 'active' },
  { id: 'CUS-003', name: '王芳', email: 'wang.fang@email.com', orders: 23, spent: 45890, lastOrder: '2024-01-14', status: 'active' },
  { id: 'CUS-004', name: '刘强', email: 'liu.qiang@email.com', orders: 3, spent: 2890, lastOrder: '2024-01-13', status: 'inactive' }
];

// 初始折扣数据
export const INITIAL_DISCOUNTS: Discount[] = [
  { id: 'DSC-001', code: 'SUMMER2024', type: 'percentage', value: 20, usageCount: 156, usageLimit: 500, status: 'active', startDate: '2024-01-01', endDate: '2024-03-31' },
  { id: 'DSC-002', code: 'NEWUSER50', type: 'fixed', value: 50, usageCount: 89, usageLimit: 1000, status: 'active', startDate: '2024-01-01', endDate: '2024-12-31' },
  { id: 'DSC-003', code: 'VIP15OFF', type: 'percentage', value: 15, usageCount: 45, usageLimit: 100, status: 'expired', startDate: '2023-12-01', endDate: '2023-12-31' }
];

// Mock 数据导出 (兼容组件引用)
export const mockProducts = INITIAL_PRODUCTS;
export const mockOrders = INITIAL_ORDERS;
export const mockCustomers = INITIAL_CUSTOMERS;
export const mockDiscounts = INITIAL_DISCOUNTS;

// Mock Agents 数据
export const mockAgents = [
  {
    id: "agent-001",
    name: "客服助理",
    status: "active" as const,
    type: "customer_service" as const,
    description: "自动处理客户咨询，提供24/7全天候服务支持，智能分流和工单管理",
    conversationsCount: 12580,
    responseRate: 98.5,
    avgResponseTime: 1.2,
    resourceUsage: 45,
  },
  {
    id: "agent-002",
    name: "销售顾问",
    status: "active" as const,
    type: "sales" as const,
    description: "智能推荐产品，分析用户行为，提供个性化购物建议",
    conversationsCount: 8420,
    responseRate: 96.8,
    avgResponseTime: 1.5,
    resourceUsage: 62,
  },
  {
    id: "agent-003",
    name: "数据分析师",
    status: "idle" as const,
    type: "analytics" as const,
    description: "自动生成销售报表，分析趋势，预测库存需求",
    conversationsCount: 3250,
    responseRate: 99.2,
    avgResponseTime: 2.1,
    resourceUsage: 28,
  },
  {
    id: "agent-004",
    name: "营销助手",
    status: "offline" as const,
    type: "sales" as const,
    description: "创建营销活动，自动化邮件营销，社交媒体管理",
    conversationsCount: 5680,
    responseRate: 94.5,
    avgResponseTime: 1.8,
    resourceUsage: 0,
  },
];

// Mock Stores 数据
export const mockStores = [
  {
    id: "store-001",
    name: "极简科技旗舰店",
    url: "tech-flagship.myshop.com",
    status: "active" as const,
    productsCount: 256,
    ordersCount: 1580,
    revenue: 458000,
  },
  {
    id: "store-002",
    name: "潮流服饰官方店",
    url: "urban-style.myshop.com",
    status: "active" as const,
    productsCount: 482,
    ordersCount: 2340,
    revenue: 892000,
  },
  {
    id: "store-003",
    name: "智能家居体验馆",
    url: "smart-home.myshop.com",
    status: "maintenance" as const,
    productsCount: 128,
    ordersCount: 680,
    revenue: 234000,
  },
  {
    id: "store-004",
    name: "美妆集合店",
    url: "beauty-box.myshop.com",
    status: "active" as const,
    productsCount: 365,
    ordersCount: 1920,
    revenue: 567000,
  },
];

// Mock Merchants 数据
export const mockMerchants = [
  {
    id: "merchant-001",
    name: "Aero Labs Inc.",
    email: "contact@aerolabs.com",
    phone: "400-888-1234",
    location: "上海市浦东新区",
    avatar: "",
    status: "active" as const,
    storesCount: 3,
    totalSales: 1580000,
    growthRate: 15.2,
    joinDate: "2023-06-15",
  },
  {
    id: "merchant-002",
    name: "UrbanStyle Co.",
    email: "info@urbanstyle.cn",
    phone: "400-666-5678",
    location: "广州市天河区",
    avatar: "",
    status: "active" as const,
    storesCount: 2,
    totalSales: 892000,
    growthRate: 8.5,
    joinDate: "2023-08-20",
  },
  {
    id: "merchant-003",
    name: "SmartHome Ltd.",
    email: "support@smarthome.io",
    phone: "400-999-0000",
    location: "深圳市南山区",
    avatar: "",
    status: "pending" as const,
    storesCount: 1,
    totalSales: 234000,
    growthRate: -2.3,
    joinDate: "2024-01-05",
  },
  {
    id: "merchant-004",
    name: "BeautyBox Inc.",
    email: "hello@beautybox.com",
    phone: "400-777-3333",
    location: "北京市朝阳区",
    avatar: "",
    status: "suspended" as const,
    storesCount: 1,
    totalSales: 567000,
    growthRate: 0,
    joinDate: "2023-09-10",
  },
];
