export interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  birthDate?: string | null;
  socialMedia?: string[];
  commissionRate: number;
  categoryId?: string | null;
  categoryName?: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}
