export interface VendedorSalesReportOrderItem {
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  originalPrice: number | null;
  totalPrice: number;
  priceType: string;
}

export interface VendedorSalesReportOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  source: string;
  customerName: string;
  customerEmail: string;
  items: VendedorSalesReportOrderItem[];
  totalAmount: number;
  discountedAmount: number;
  paymentMethod: string | null;
  shippingPrice: number;
  couponCode: string | null;
  vendedorName: string | null;
  vendedorCommissionRate: number | null;
  vendedorCommissionAmount: number | null;
  vendedorCommissionStatus: "PENDING" | "PAID" | "CANCELLED" | null;
  vendedorCommissionPaidAt: string | null;
}

export interface VendedorSalesReportSummary {
  totalOrders: number;
  grossRevenue: number;
  netRevenue: number;
  totalCommission: number;
  avgOrderValue: number;
}

export interface PaginatedVendedorSalesReport {
  summary: VendedorSalesReportSummary;
  orders: VendedorSalesReportOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VendedorSalesReportFilters {
  vendedorName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
