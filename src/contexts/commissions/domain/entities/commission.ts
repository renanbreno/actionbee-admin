export type CommissionStatus = "PENDING" | "PAID" | "CANCELLED";

export interface CommissionOrder {
  orderId: string;
  orderNumber: string;
  orderCreatedAt: string;
  couponCode: string | null;
  couponType: string | null;
  totalAmount: number;
  discountedAmount: number;
  commissionRate: number | null;
  commissionAmount: number | null;
  commissionStatus: CommissionStatus | null;
  commissionPaidAt: string | null;
  customerName: string;
  customerEmail: string;
}

export interface CommissionSummary {
  totalOrders: number;
  totalOriginalAmount: number;
  totalDiscountedAmount: number;
  totalCommissionAmount: number;
  pendingCommissionAmount: number;
  paidCommissionAmount: number;
}

export interface CommissionReport {
  orders: CommissionOrder[];
  summary: CommissionSummary;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
