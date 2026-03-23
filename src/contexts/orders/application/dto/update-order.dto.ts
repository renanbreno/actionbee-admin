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
  source?: "WHATSAPP" | "IN_STORE" | "INSTAGRAM" | "ECOMMERCE" | "REPRESENTATIVE" | "MERCADO_LIVRE";
  couponCode?: string;
  discount?: CreateOrderDiscountDTO;
  shippingAddress?: CreateOrderShippingAddressDTO;
  shippingInfo?: CreateOrderShippingInfoDTO;
  gifts?: { giftTierId: string; quantity: number }[];
  notes?: string | null;
  representativeId?: string | null;
  vendedorId?: string | null;
  orderDate?: string | null;
}
