import { AffiliateCategory } from "../entities/affiliate-category";

export interface AffiliateCategoryRepository {
  getAll(includeInactive?: boolean): Promise<AffiliateCategory[]>;
  getById(id: string): Promise<AffiliateCategory>;
  create(data: CreateAffiliateCategoryDTO): Promise<AffiliateCategory>;
  update(id: string, data: UpdateAffiliateCategoryDTO): Promise<AffiliateCategory>;
  delete(id: string): Promise<void>;
}

export interface CreateAffiliateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateAffiliateCategoryDTO {
  name?: string;
  description?: string | null;
}
