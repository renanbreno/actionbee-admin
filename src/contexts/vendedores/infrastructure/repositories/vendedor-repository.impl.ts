import { Vendedor } from "../../domain/entities/vendedor";
import { PaginatedVendedorSalesReport, VendedorSalesReportFilters } from "../../domain/entities/sales-report";
import { VendedorCommissionSummary } from "../../domain/entities/commission-summary";
import {
  VendedorRepository,
  CreateVendedorParams,
  UpdateVendedorParams,
} from "../../domain/repositories/vendedor-repository.interface";
import { vendedoresApiClient } from "../api/vendedores-api.client";

export class VendedorRepositoryImpl implements VendedorRepository {
  async getAll(name?: string): Promise<Vendedor[]> {
    return vendedoresApiClient.getAll(name);
  }

  async getById(id: string): Promise<Vendedor> {
    return vendedoresApiClient.getById(id);
  }

  async create(params: CreateVendedorParams): Promise<Vendedor> {
    return vendedoresApiClient.create(params);
  }

  async update(id: string, params: UpdateVendedorParams): Promise<Vendedor> {
    return vendedoresApiClient.update(id, params);
  }

  async delete(id: string): Promise<void> {
    return vendedoresApiClient.delete(id);
  }

  async getSalesReport(filters: VendedorSalesReportFilters): Promise<PaginatedVendedorSalesReport> {
    return vendedoresApiClient.getSalesReport(filters);
  }

  async getCommissionSummary(): Promise<VendedorCommissionSummary> {
    return vendedoresApiClient.getCommissionSummary();
  }

  async markCommissionPaid(orderId: string): Promise<void> {
    return vendedoresApiClient.markCommissionPaid(orderId);
  }

  async cancelCommission(orderId: string): Promise<void> {
    return vendedoresApiClient.cancelCommission(orderId);
  }
}
