import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { Unit } from "../../domain/entities/unit";

export interface CreateUnitApiRequest {
  acronym: string;
  name: string;
}

export interface UpdateUnitApiRequest {
  acronym?: string;
  name?: string;
  isActive?: boolean;
}

export const unitsApiClient = {
  getAll(): Promise<Unit[]> {
    return apiFetch<Unit[]>("/admin/units");
  },

  getActive(): Promise<Unit[]> {
    return apiFetch<Unit[]>("/admin/units/active");
  },

  getById(id: string): Promise<Unit> {
    return apiFetch<Unit>(`/admin/units/${id}`);
  },

  getByAcronym(acronym: string): Promise<Unit> {
    return apiFetch<Unit>(`/admin/units/acronym/${acronym}`);
  },

  create(data: CreateUnitApiRequest): Promise<Unit> {
    return apiFetch<Unit>("/admin/units", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateUnitApiRequest): Promise<Unit> {
    return apiFetch<Unit>(`/admin/units/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/units/${id}`, {
      method: "DELETE",
    });
  },
};
