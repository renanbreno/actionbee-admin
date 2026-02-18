export interface ShippingQuotationItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface ShippingQuotationRequest {
  items: ShippingQuotationItem[];
  zipCode: string;
}

export interface ShippingOption {
  carrier: string;
  service: string;
  serviceCode?: number;
  deliveryTime: number;
  price: number;
  originalPrice?: number;
}

export interface ShippingQuotationResponse {
  zipCode: string;
  shippingOptions: ShippingOption[];
  freeShippingEnabled: boolean;
  freeShipping: boolean;
  freeShippingMinValue: number;
  cartSubtotal: number;
}
