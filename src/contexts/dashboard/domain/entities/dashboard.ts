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
  totalGrossRevenue: number;
  totalNetRevenue: number;
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
  avgCommissionRate: number;
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
}

export interface DashboardCustomers {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
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
}
