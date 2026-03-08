export interface RepresentativeCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpf: string | null;
  cnpj: string | null;
  customerType: string | null;
  createdAt: string;
}

export interface Representative {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  cnpj: string | null;
  phone: string | null;
  customersCount: number;
  createdAt: string;
  updatedAt: string;
}
