import { Affiliate } from "../entities/affiliate";

export interface CreateAffiliateParams {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  socialMedia?: string[];
  commissionRate: number;
  categoryId?: string;
}

export interface UpdateAffiliateParams {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  socialMedia?: string[];
  commissionRate?: number;
  categoryId?: string;
}

export interface AffiliateRepository {
  getAll(): Promise<Affiliate[]>;
  create(params: CreateAffiliateParams): Promise<Affiliate>;
  update(id: string, params: UpdateAffiliateParams): Promise<Affiliate>;
  delete(id: string): Promise<void>;
}
