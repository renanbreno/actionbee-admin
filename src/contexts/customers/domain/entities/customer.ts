export interface CustomerAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  cpf?: string | null;
  emailVerified: boolean;
  ordersCount?: number;
  address?: CustomerAddress | null;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginatedCustomers {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
