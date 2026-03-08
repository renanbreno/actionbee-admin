import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { Representative, RepresentativeCustomer } from "../../domain/entities/representative";

export interface CreateRepresentativeApiRequest {
  name: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  phone: string;
}

export interface UpdateRepresentativeApiRequest {
  name?: string;
  email?: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
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
};
