export interface ProductBatch {
  id: string;
  productId: string;
  batchNumber: string;
  manufacturingDate?: string | null;
  expiryDate: string;
  initialQuantity: number;
  currentQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
