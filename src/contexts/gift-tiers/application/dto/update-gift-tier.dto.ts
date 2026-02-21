export interface UpdateGiftTierDto {
  name?: string;
  description?: string;
  imageUrl?: string;
  image?: File;
  minOrderValue?: number;
  productId?: string;
}
