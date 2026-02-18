export interface CreateGiftTierDto {
  name: string;
  description?: string;
  imageUrl?: string;
  minOrderValue: number;
  productId?: string;
}
