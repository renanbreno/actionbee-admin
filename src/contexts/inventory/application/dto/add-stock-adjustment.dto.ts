export interface AddStockAdjustmentDTO {
  quantity: number; // positivo = entrada, negativo = saída
  reason?: string;
  batchId?: string;
}
