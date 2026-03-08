export type OrderItemPriceType = "COMMON" | "RETAILER" | "DISTRIBUTOR";

export interface CreateOrderItemDTO {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  priceType?: OrderItemPriceType;
}

export interface CreateOrderShippingAddressDTO {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CreateOrderShippingInfoDTO {
  carrier: string;
  service: string;
  serviceCode?: number;
  price: number;
  deliveryTime: number;
}

export interface CreateOrderPaymentDTO {
  method: string;
  amount: number;
  boletoDueDays?: 30 | 60;
}

export type DiscountType = "ABSOLUTE" | "PERCENTAGE";

export interface CreateOrderDiscountDTO {
  type: DiscountType;
  value: number;
}

export interface CreateOrderDTO {
  customerId: string;
  items: CreateOrderItemDTO[];
  payments: CreateOrderPaymentDTO[];
  source: "WHATSAPP" | "IN_STORE" | "INSTAGRAM" | "ECOMMERCE" | "REPRESENTATIVE";
  couponCode?: string;
  discount?: CreateOrderDiscountDTO;
  shippingAddress?: CreateOrderShippingAddressDTO;
  shippingInfo?: CreateOrderShippingInfoDTO;
  giftTierIds?: string[];
  notes?: string;
  representativeId?: string;
}
