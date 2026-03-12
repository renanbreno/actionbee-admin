export interface CreateAffiliateDto {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  socialMedia?: string[];
  commissionRate: number;
  categoryId?: string;
  couponId?: string;
}
