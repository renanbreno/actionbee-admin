export type GiftStockMovType = "IN" | "OUT" | "RETURN" | "ADJUSTMENT";

export interface GiftStockMovement {
  id: string;
  giftTierId: string;
  orderId?: string | null;
  shipmentId?: string | null;
  type: GiftStockMovType;
  quantity: number;
  reason?: string | null;
  createdAt: string;
}

export interface PaginatedGiftMovements {
  data: GiftStockMovement[];
  total: number;
}
