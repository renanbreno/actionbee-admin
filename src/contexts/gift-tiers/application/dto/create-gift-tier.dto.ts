export interface CreateGiftTierDto {
  name: string;
  description?: string;
  imageUrl?: string;
  image?: File;
  minOrderValue: number;
  costPrice: number;
  productId?: string;
}
