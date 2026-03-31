export interface AddStockEntryDTO {
  batchNumber: string;
  expiryDate: string;
  manufacturingDate?: string;
  quantity: number;
}
