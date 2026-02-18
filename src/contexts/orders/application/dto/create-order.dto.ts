export interface CreateOrderItemDTO {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  originalPrice?: number;
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

export interface CreateOrderDTO {
  customerId: string;
  items: CreateOrderItemDTO[];
  paymentMethod: string;
  couponCode?: string;
  shippingAddress?: CreateOrderShippingAddressDTO;
  shippingInfo?: CreateOrderShippingInfoDTO;
  giftTierIds?: string[];
  notes?: string;
  boletoDueDays?: 30 | 60;
}
