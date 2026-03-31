export type StockMovementType = "IN" | "OUT" | "RETURN" | "ADJUSTMENT";

export interface StockMovement {
  id: string;
  productId: string;
  batchId?: string | null;
  orderId?: string | null;
  orderNumber?: string | null;
  batchNumber?: string | null;
  type: StockMovementType;
  quantity: number;
  reason?: string | null;
  createdAt: string;
}

export interface PaginatedMovements {
  data: StockMovement[];
  total: number;
}
