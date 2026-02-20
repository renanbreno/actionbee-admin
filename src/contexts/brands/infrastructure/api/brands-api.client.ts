import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { env } from "@/shared/config/env";
import { Brand } from "../../domain/entities/brand";
import { CreateBrandDTO, UpdateBrandDTO } from "../../domain/repositories/brand-repository.interface";

export const brandsApiClient = {
  getAll(): Promise<Brand[]> {
    return apiFetch<Brand[]>("/admin/brands");
  },

  getById(id: string): Promise<Brand> {
    return apiFetch<Brand>(`/admin/brands/${id}`);
  },

  create(data: CreateBrandDTO): Promise<Brand> {
    return apiFetch<Brand>("/admin/brands", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateBrandDTO): Promise<Brand> {
    return apiFetch<Brand>(`/admin/brands/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/brands/${id}`, {
      method: "DELETE",
    });
  },
};
