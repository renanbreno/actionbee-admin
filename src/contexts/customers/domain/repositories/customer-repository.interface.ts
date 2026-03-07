import { Customer, PaginatedCustomers } from "../entities/customer";

export interface CustomerRepository {
  getAllPaginated(page: number, limit: number, search?: string, inactiveOnly?: boolean): Promise<PaginatedCustomers>;
  getById(id: string): Promise<Customer>;
  create(data: CreateCustomerDTO): Promise<Customer>;
  update(id: string, data: UpdateCustomerDTO): Promise<Customer>;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  isFinalConsumer?: boolean;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    number: string;
    complement?: string;
  };
}

export interface UpdateCustomerDTO {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  isFinalConsumer?: boolean;
  address?: {
    street?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    number?: string;
    complement?: string;
  };
}
