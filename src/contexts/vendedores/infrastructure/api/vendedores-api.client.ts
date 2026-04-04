import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { Vendedor } from "../../domain/entities/vendedor";
import { PaginatedVendedorSalesReport, VendedorSalesReportFilters } from "../../domain/entities/sales-report";
import { VendedorCommissionSummary } from "../../domain/entities/commission-summary";

export interface CreateVendedorApiRequest {
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  birthDate?: string;
  commissionRate?: number;
}

export interface UpdateVendedorApiRequest {
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  birthDate?: string;
  commissionRate?: number;
}

export const vendedoresApiClient = {
  getAll(name?: string): Promise<Vendedor[]> {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    return apiFetch<Vendedor[]>(`/admin/vendedores${query}`);
  },

  getById(id: string): Promise<Vendedor> {
    return apiFetch<Vendedor>(`/admin/vendedores/${id}`);
  },

  create(data: CreateVendedorApiRequest): Promise<Vendedor> {
    return apiFetch<Vendedor>("/admin/vendedores", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateVendedorApiRequest): Promise<Vendedor> {
    return apiFetch<Vendedor>(`/admin/vendedores/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/vendedores/${id}`, {
      method: "DELETE",
    });
  },

  getSalesReport(filters: VendedorSalesReportFilters): Promise<PaginatedVendedorSalesReport> {
    const params = new URLSearchParams();
    if (filters.vendedorName) params.set("vendedorName", filters.vendedorName);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    const query = params.toString();
    return apiFetch<PaginatedVendedorSalesReport>(`/admin/vendedores/sales-report${query ? `?${query}` : ""}`);
  },

  getCommissionSummary(): Promise<VendedorCommissionSummary> {
    return apiFetch<VendedorCommissionSummary>("/admin/vendedor-commissions/summary");
  },
};
