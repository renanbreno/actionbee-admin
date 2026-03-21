import { apiFetch } from "@/shared/infrastructure/api/api-client";
import type { Customer, PaginatedCustomers } from "../../domain/entities/customer";
import type {
  CreateCustomerDTO,
  UpdateCustomerDTO,
  PurchaseStatus,
  CustomerTypeFilter,
} from "../../domain/repositories/customer-repository.interface";

export const customersApiClient = {
  getAllPaginated: async (
    page: number,
    limit: number,
    search?: string,
    purchaseStatus?: PurchaseStatus,
    customerType?: CustomerTypeFilter
  ): Promise<PaginatedCustomers> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.set("search", search);
    if (purchaseStatus && purchaseStatus !== 'all') params.set("purchaseStatus", purchaseStatus);
    if (customerType && customerType !== 'all') params.set("customerType", customerType);

    return apiFetch<PaginatedCustomers>(
      `/admin/customers?${params.toString()}`
    );
  },

  getById: async (id: string): Promise<Customer> => {
    return apiFetch<Customer>(`/admin/customers/${id}`);
  },

  create: async (data: CreateCustomerDTO): Promise<Customer> => {
    return apiFetch<Customer>("/admin/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: UpdateCustomerDTO): Promise<Customer> => {
    return apiFetch<Customer>(`/admin/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiFetch<void>(`/admin/customers/${id}`, {
      method: "DELETE",
    });
  },
};
