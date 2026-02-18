export interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  socialMedia?: string[];
  commissionRate: number;
  createdAt: string;
  updatedAt?: string;
}
