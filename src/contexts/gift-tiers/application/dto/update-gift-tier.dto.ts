export interface UpdateGiftTierDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  image?: File;
  minOrderValue?: number;
  costPrice?: number;
  productId?: string;
}
