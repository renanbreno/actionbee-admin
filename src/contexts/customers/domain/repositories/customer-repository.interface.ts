import { Customer, CustomerType, PaginatedCustomers } from "../entities/customer";

export type PurchaseStatus = 'all' | 'never' | 'inactive' | 'active';
export type CustomerTypeFilter = 'all' | 'FINAL_CONSUMER' | 'RETAILER_RESELLER' | 'DISTRIBUTOR_RESELLER';

export interface CustomerRepository {
  getAllPaginated(
    page: number,
    limit: number,
    search?: string,
    purchaseStatus?: PurchaseStatus,
    customerType?: CustomerTypeFilter
  ): Promise<PaginatedCustomers>;
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
  customerType?: CustomerType;
  stateRegistration?: string;
  isIeExempt?: boolean;
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
  customerType?: CustomerType;
  stateRegistration?: string;
  isIeExempt?: boolean;
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
