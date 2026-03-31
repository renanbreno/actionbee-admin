export interface AddGiftStockAdjustmentDTO {
  quantity: number; // signed: positive = add, negative = remove
  reason?: string;
}
