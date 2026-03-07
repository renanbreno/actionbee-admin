import { apiFetch } from "@/shared/infrastructure/api/api-client";
import type { Customer, PaginatedCustomers } from "../../domain/entities/customer";
import type {
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from "../../domain/repositories/customer-repository.interface";

export const customersApiClient = {
  getAllPaginated: async (
    page: number,
    limit: number,
    search?: string,
    inactiveOnly?: boolean
  ): Promise<PaginatedCustomers> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.set("search", search);
    if (inactiveOnly) params.append("inactiveOnly", "true");

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
};
