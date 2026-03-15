export interface Vendedor {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  phone: string | null;
  birthDate: string | null;
  commissionRate: number;
  ordersCount: number;
  createdAt: string;
  updatedAt: string;
}
