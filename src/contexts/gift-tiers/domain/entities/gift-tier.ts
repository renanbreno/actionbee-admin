export interface GiftTier {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  minOrderValue: number;
  productId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
