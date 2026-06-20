export interface TenantDisk {
  id: string;
  name: string;
  owner: string;
  plan: string;
  status: 'active' | 'suspended' | 'past-due';
  logoUrl?: string;
  apiRequests: number;
  apiLimit: number;
  cpuUsage: number;
  memUsage: number;
  diskUsage: number;
  revenue: number;
  region: string;
  since: string;
}

export interface PlanPackage {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  subscribersCount: number;
  quotaLimit: string;
}

export interface SubscriptionRecord {
  id: string;
  tenantId: string;
  tenantName: string;
  planName: string;
  amount: number;
  status: 'active' | 'canceled' | 'past-due';
  nextBillingAt: string;
}

export interface BillingGateway {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  account: string;
  syncInterval: string;
  mode: 'test' | 'live';
}

export interface SupportTicket {
  id: string;
  tenantName: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'pending' | 'resolved';
  createdAt: string;
}

export interface WebhookDeliveryLog {
  id: string;
  topic: string;
  endpoint: string;
  timestamp: string;
  responseCode: number;
  durationMs: number;
  payloadSize: string;
}
