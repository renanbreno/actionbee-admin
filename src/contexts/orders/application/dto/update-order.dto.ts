import {
  CreateOrderItemDTO,
  CreateOrderBonusItemDTO,
  CreateOrderPaymentDTO,
  CreateOrderDiscountDTO,
  CreateOrderShippingAddressDTO,
  CreateOrderShippingInfoDTO,
} from "./create-order.dto";

export interface UpdateOrderDTO {
  customerId?: string;
  items?: CreateOrderItemDTO[];
  bonusItems?: CreateOrderBonusItemDTO[];
  payments?: CreateOrderPaymentDTO[];
  source?: "WHATSAPP" | "IN_STORE" | "INSTAGRAM" | "ECOMMERCE" | "REPRESENTATIVE";
  couponCode?: string;
  discount?: CreateOrderDiscountDTO;
  shippingAddress?: CreateOrderShippingAddressDTO;
  shippingInfo?: CreateOrderShippingInfoDTO;
  gifts?: { giftTierId: string; quantity: number }[];
  notes?: string;
  representativeId?: string;
}
