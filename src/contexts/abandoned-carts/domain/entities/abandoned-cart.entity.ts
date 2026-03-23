export type CheckoutStep = "CART" | "CHECKOUT" | "PAYMENT";

export interface AbandonedCart {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  cartValue: number;
  itemsCount: number;
  checkoutStep: CheckoutStep;
  abandonedAt: string;
  notificationCount: number;
  lastNotifiedAt: string | null;
}

export interface PaginatedAbandonedCarts {
  abandonedCarts: AbandonedCart[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
