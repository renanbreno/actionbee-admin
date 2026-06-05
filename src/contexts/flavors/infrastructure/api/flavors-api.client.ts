import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { Flavor } from "../../domain/entities/flavor";
import { CreateFlavorDTO, UpdateFlavorDTO } from "../../domain/repositories/flavor-repository.interface";

export const flavorsApiClient = {
  getAll(): Promise<Flavor[]> {
    return apiFetch<Flavor[]>("/admin/flavors");
  },

  getById(id: string): Promise<Flavor> {
    return apiFetch<Flavor>(`/admin/flavors/${id}`);
  },

  create(data: CreateFlavorDTO): Promise<Flavor> {
    return apiFetch<Flavor>("/admin/flavors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateFlavorDTO): Promise<Flavor> {
    return apiFetch<Flavor>(`/admin/flavors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/flavors/${id}`, {
      method: "DELETE",
    });
  },
};
