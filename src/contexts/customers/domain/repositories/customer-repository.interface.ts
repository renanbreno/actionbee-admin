import { Customer, CustomerType, CustomerLifecycleStage, PaginatedCustomers } from "../entities/customer";

export type PurchaseStatus = 'all' | 'never' | 'inactive' | 'active';
export type CustomerTypeFilter = 'all' | 'FINAL_CONSUMER' | 'RETAILER_RESELLER' | 'DISTRIBUTOR_RESELLER';
export type LifecycleStageFilter = 'all' | CustomerLifecycleStage;

export interface CustomerRepository {
  getAllPaginated(
    page: number,
    limit: number,
    search?: string,
    purchaseStatus?: PurchaseStatus,
    customerType?: CustomerTypeFilter,
    lifecycleStage?: LifecycleStageFilter
  ): Promise<PaginatedCustomers>;
  getById(id: string): Promise<Customer>;
  create(data: CreateCustomerDTO): Promise<Customer>;
  update(id: string, data: UpdateCustomerDTO): Promise<Customer>;
  delete(id: string): Promise<void>;
  bulkUpdateLifecycleStage(ids: string[], stage: CustomerLifecycleStage): Promise<void>;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  cnpj?: string;
  customerType?: CustomerType;
  lifecycleStage?: CustomerLifecycleStage;
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
  email?: string | null;
  password?: string;
  phone?: string;
  cpf?: string | null;
  cnpj?: string | null;
  customerType?: CustomerType;
  lifecycleStage?: CustomerLifecycleStage | null;
  stateRegistration?: string | null;
  isIeExempt?: boolean | null;
  birthDate?: string | null;
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
