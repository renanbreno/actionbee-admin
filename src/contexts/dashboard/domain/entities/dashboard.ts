export interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface TopCustomer {
  name: string;
  email: string;
  totalSpent: number;
  orderCount: number;
}

export interface LowStockProduct {
  productId: string;
  productName: string;
  stockUnits: number;
}

export interface TopSellingItem {
  productName: string;
  variantName: string;
  quantity: number;
  revenue: number;
}

export interface TopAffiliate {
  name: string;
  orders: number;
  commissionEarned: number;
  totalGrossRevenue: number;
  totalNetRevenue: number;
  pendingCommission: number;
  paidCommission: number;
  avgCommissionRate: number;
}

export interface CouponUsage {
  code: string;
  usedCount: number;
  totalDiscount: number;
}

export interface TopAffiliateCategory {
  categoryId: string;
  categoryName: string;
  orders: number;
  revenue: number;
  netRevenue: number;
  commissionEarned: number;
  grossRevenuePercent: number;
  netRevenuePercent: number;
}

export interface SalesBySource {
  source: 'WHATSAPP' | 'IN_STORE' | 'INSTAGRAM' | 'ECOMMERCE';
  orders: number;
  grossRevenue: number;
  netRevenue: number;
  percentage: number;
}

export interface GiftTierSummary {
  tierName: string;
  count: number;
  costPerUnit: number;
  totalCost: number;
}

export interface GiftMetrics {
  totalGiftsGiven: number;
  totalGiftCost: number;
  byTier: GiftTierSummary[];
}

export interface DashboardSales {
  totalOrders: number;
  grossRevenue: number;
  netRevenue: number;
  avgOrderValue: number;
  revenueByDay: RevenueByDay[];
  comparison: {
    totalOrders: number;
    grossRevenue: number;
    netRevenue: number;
    changePercent: {
      totalOrders: number;
      grossRevenue: number;
      netRevenue: number;
    };
  };
  ordersByStatus: OrdersByStatus[];
  salesBySource?: SalesBySource[];
  gifts?: GiftMetrics;
}

export interface DashboardCustomers {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  customersWithNoOrders: number;
  churnedCustomers: number;
  topCustomers: TopCustomer[];
}

export interface DashboardProducts {
  totalActive: number;
  totalInactive: number;
  lowStock: LowStockProduct[];
  topSelling: TopSellingItem[];
}

export interface DashboardAffiliates {
  totalAffiliates: number;
  totalActiveCoupons: number;
  totalOrdersWithCommission: number;
  totalGrossRevenue: number;
  totalNetRevenue: number;
  totalRevenueGenerated: number;
  totalCommissionGenerated: number;
  totalCommissionPaid: number;
  totalCommissionPending: number;
  totalCommissionCancelled: number;
  avgCommissionRate: number;
  pendingCommission: number;
  paidCommission: number;
  commissionByStatus: Array<{
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    count: number;
    amount: number;
    percentage: number;
  }>;
  topAffiliates: TopAffiliate[];
  couponUsage: CouponUsage[];
  topCategories: TopAffiliateCategory[];
  shipmentMetrics?: Array<{
    affiliateId: string;
    affiliateName: string;
    totalShipments: number;
    totalItemsSent: number;
    totalCost: number;
    lastShipmentDate?: string;
    lastShipmentStatus?: string;
  }>;
  paymentTrend?: Array<{
    month: string;
    paidAmount: number;
    pendingAmount: number;
    cancelledAmount: number;
    totalOrders: number;
  }>;
}

export interface ChannelBreakdown {
  totalOrders: number;
  grossRevenue: number;
  netRevenue: number;
  avgOrderValue: number;
  totalCustomers: number;
  newCustomers: number;
}

export interface DashboardChannels {
  b2b: ChannelBreakdown;
  b2c: ChannelBreakdown;
}

export interface DashboardMetrics {
  generatedAt: string;
  period: {
    from: string;
    to: string;
  };
  sales: DashboardSales;
  customers: DashboardCustomers;
  products: DashboardProducts;
  affiliates: DashboardAffiliates;
  channels?: DashboardChannels;
}
