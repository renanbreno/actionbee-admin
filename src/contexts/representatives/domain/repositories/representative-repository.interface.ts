import { Representative, RepresentativeCustomer } from "../entities/representative";
import { PaginatedSalesReport, SalesReportFilters } from "../entities/sales-report";

export interface CreateRepresentativeParams {
  name: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  phone: string;
  commissionRate?: number;
}

export interface UpdateRepresentativeParams {
  name?: string;
  email?: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  commissionRate?: number;
}

export interface RepresentativeRepository {
  getAll(name?: string): Promise<Representative[]>;
  getById(id: string): Promise<Representative>;
  create(params: CreateRepresentativeParams): Promise<Representative>;
  update(id: string, params: UpdateRepresentativeParams): Promise<Representative>;
  delete(id: string): Promise<void>;
  associateCustomer(representativeId: string, customerId: string): Promise<RepresentativeCustomer[]>;
  dissociateCustomer(representativeId: string, customerId: string): Promise<RepresentativeCustomer[]>;
  getCustomers(representativeId: string): Promise<RepresentativeCustomer[]>;
  getSalesReport(filters: SalesReportFilters): Promise<PaginatedSalesReport>;
}
