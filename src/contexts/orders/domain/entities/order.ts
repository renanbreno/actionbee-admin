export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod =
  | "CASH"
  | "PIX"
  | "TRANSFER"
  | "CARD"
  | "OTHER"
  | string;

export interface OrderListItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  discountedAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  itemsCount: number;
  couponCode?: string;
  hasOfferItems: boolean;
  hasDiscount: boolean;  // true quando totalAmount > discountedAmount (cupom ou oferta)
}

export interface PaginatedOrders {
  orders: OrderListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderDetailItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  originalPrice?: number;
  totalPrice: number;
}

export interface OrderShippingAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderShippingInfo {
  carrier: string;
  service: string;
  price: number;
  deliveryTime: number;
  trackingCode?: string;
  trackingUrl?: string;
}

export interface OrderDetail extends OrderListItem {
  items: OrderDetailItem[];
  shippingAddress: OrderShippingAddress;
  shippingInfo: OrderShippingInfo;
  couponCode?: string;
  gifts: { giftName: string; giftImageUrl?: string }[];
  statusHistory: { status: string; changedAt: string }[];
}

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};
