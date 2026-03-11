export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "WAITING"
  | "IN_ANALYSIS"
  | "AUTHORIZED"
  | "PAID"
  | "DECLINED"
  | "CANCELED";

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
  representativeName?: string;
  totalAmount: number;
  discountedAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
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

export type OrderItemPriceType = "COMMON" | "RETAILER" | "DISTRIBUTOR";

export interface OrderDetailItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  originalPrice?: number;
  totalPrice: number;
  priceType?: OrderItemPriceType;
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

export interface OrderPaymentEntry {
  paymentMethod: string;
  amount: number;
  status: string;
}

export interface OrderBonusItem {
  productName: string;
  variantName: string;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
}

export interface OrderDetail extends OrderListItem {
  items: OrderDetailItem[];
  bonusItems?: OrderBonusItem[];
  shippingAddress: OrderShippingAddress;
  shippingInfo: OrderShippingInfo;
  couponCode?: string;
  gifts: { giftName: string; giftImageUrl?: string; quantity: number; unitCost?: number; totalCost?: number }[];
  statusHistory: { status: string; changedAt: string }[];
  boletoBarcode?: string;
  boletoPdfUrl?: string;
  boletoDueDate?: string;
  payments: OrderPaymentEntry[];
  meShipmentId?: string;
  meLabelUrl?: string;
  meServiceCode?: number;
  paymentLink?: string;
}

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};
