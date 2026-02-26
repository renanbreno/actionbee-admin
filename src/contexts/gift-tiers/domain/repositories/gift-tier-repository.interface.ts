import { GiftTier } from "../entities/gift-tier";

export interface CreateGiftTierParams {
  name: string;
  description?: string;
  image?: File;
  minOrderValue: number;
  costPrice: number;
  productId?: string;
}

export interface UpdateGiftTierParams {
  name?: string;
  description?: string;
  image?: File;
  minOrderValue?: number;
  costPrice?: number;
  productId?: string;
}

export interface GiftTierRepository {
  getAll(): Promise<GiftTier[]>;
  create(params: CreateGiftTierParams): Promise<GiftTier>;
  update(id: string, params: UpdateGiftTierParams): Promise<GiftTier>;
  activate(id: string): Promise<GiftTier>;
  deactivate(id: string): Promise<GiftTier>;
  delete(id: string): Promise<void>;
}
