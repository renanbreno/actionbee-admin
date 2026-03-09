export interface SalesReportOrderItem {
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  originalPrice: number | null;
  totalPrice: number;
  priceType: string;
}

export interface SalesReportOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  source: string;
  customerName: string;
  customerEmail: string;
  items: SalesReportOrderItem[];
  totalAmount: number;
  discountedAmount: number;
  paymentMethod: string | null;
  shippingPrice: number;
  couponCode: string | null;
  // Affiliate commission (for reference)
  commissionRate: number | null;
  commissionAmount: number | null;
  commissionStatus: string | null;
  representativeName: string | null;
  // Representative commission
  representativeCommissionRate: number | null;
  representativeCommissionAmount: number | null;
  representativeCommissionStatus: "PENDING" | "PAID" | "CANCELLED" | null;
  representativeCommissionPaidAt: string | null;
}

export interface SalesReportSummary {
  totalOrders: number;
  grossRevenue: number;
  netRevenue: number;
  totalCommission: number;
  avgOrderValue: number;
}

export interface PaginatedSalesReport {
  summary: SalesReportSummary;
  orders: SalesReportOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SalesReportFilters {
  representativeName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
