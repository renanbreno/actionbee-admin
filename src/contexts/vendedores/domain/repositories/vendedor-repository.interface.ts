import { Vendedor } from "../entities/vendedor";
import { PaginatedVendedorSalesReport, VendedorSalesReportFilters } from "../entities/sales-report";
import { VendedorCommissionSummary } from "../entities/commission-summary";

export interface CreateVendedorParams {
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  birthDate?: string;
  commissionRate?: number;
}

export interface UpdateVendedorParams {
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  birthDate?: string;
  commissionRate?: number;
}

export interface VendedorRepository {
  getAll(name?: string): Promise<Vendedor[]>;
  getById(id: string): Promise<Vendedor>;
  create(params: CreateVendedorParams): Promise<Vendedor>;
  update(id: string, params: UpdateVendedorParams): Promise<Vendedor>;
  delete(id: string): Promise<void>;
  getSalesReport(filters: VendedorSalesReportFilters): Promise<PaginatedVendedorSalesReport>;
  getCommissionSummary(): Promise<VendedorCommissionSummary>;
  markCommissionPaid(orderId: string): Promise<void>;
  cancelCommission(orderId: string): Promise<void>;
}
