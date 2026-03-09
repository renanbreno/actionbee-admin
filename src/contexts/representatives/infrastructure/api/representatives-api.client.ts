import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { Representative, RepresentativeCustomer } from "../../domain/entities/representative";
import { PaginatedSalesReport, SalesReportFilters } from "../../domain/entities/sales-report";
import { CommissionSummary } from "../../domain/entities/commission-summary";

export interface CreateRepresentativeApiRequest {
  name: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  phone: string;
  commissionRate?: number;
}

export interface UpdateRepresentativeApiRequest {
  name?: string;
  email?: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  commissionRate?: number;
}

export const representativesApiClient = {
  getAll(name?: string): Promise<Representative[]> {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    return apiFetch<Representative[]>(`/admin/representatives${query}`);
  },

  getById(id: string): Promise<Representative> {
    return apiFetch<Representative>(`/admin/representatives/${id}`);
  },

  create(data: CreateRepresentativeApiRequest): Promise<Representative> {
    return apiFetch<Representative>("/admin/representatives", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateRepresentativeApiRequest): Promise<Representative> {
    return apiFetch<Representative>(`/admin/representatives/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/representatives/${id}`, {
      method: "DELETE",
    });
  },

  associateCustomer(representativeId: string, customerId: string): Promise<RepresentativeCustomer[]> {
    return apiFetch<RepresentativeCustomer[]>(`/admin/representatives/${representativeId}/customers`, {
      method: "POST",
      body: JSON.stringify({ customerId }),
    });
  },

  dissociateCustomer(representativeId: string, customerId: string): Promise<RepresentativeCustomer[]> {
    return apiFetch<RepresentativeCustomer[]>(`/admin/representatives/${representativeId}/customers/${customerId}`, {
      method: "DELETE",
    });
  },

  getCustomers(representativeId: string): Promise<RepresentativeCustomer[]> {
    return apiFetch<RepresentativeCustomer[]>(`/admin/representatives/${representativeId}/customers`);
  },

  getSalesReport(filters: SalesReportFilters): Promise<PaginatedSalesReport> {
    const params = new URLSearchParams();
    if (filters.representativeName) params.set("representativeName", filters.representativeName);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    const query = params.toString();
    return apiFetch<PaginatedSalesReport>(`/admin/representatives/sales-report${query ? `?${query}` : ""}`);
  },

  markRepresentativeCommissionPaid(orderId: string): Promise<void> {
    return apiFetch<void>(`/admin/representative-commissions/orders/${orderId}/mark-paid`, {
      method: "PATCH",
    });
  },

  cancelRepresentativeCommission(orderId: string): Promise<void> {
    return apiFetch<void>(`/admin/representative-commissions/orders/${orderId}/cancel`, {
      method: "PATCH",
    });
  },

  getCommissionSummary(): Promise<CommissionSummary> {
    return apiFetch<CommissionSummary>("/admin/representative-commissions/summary");
  },
};
