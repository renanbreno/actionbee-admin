import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { ProductGroup } from "../../domain/entities/product-group";
import {
  CreateProductGroupDto,
  UpdateProductGroupDto,
} from "../../domain/repositories/product-group-repository.interface";

export const productGroupsApiClient = {
  getAll(): Promise<ProductGroup[]> {
    return apiFetch<ProductGroup[]>("/admin/product-groups");
  },

  getById(id: string): Promise<ProductGroup> {
    return apiFetch<ProductGroup>(`/admin/product-groups/${id}`);
  },

  create(data: CreateProductGroupDto): Promise<ProductGroup> {
    return apiFetch<ProductGroup>("/admin/product-groups", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateProductGroupDto): Promise<ProductGroup> {
    return apiFetch<ProductGroup>(`/admin/product-groups/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return apiFetch<void>(`/admin/product-groups/${id}`, {
      method: "DELETE",
    });
  },
};
