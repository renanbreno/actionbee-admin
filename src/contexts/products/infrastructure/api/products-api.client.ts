import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { PaginatedProducts, Product } from "../../domain/entities/product";
import {
  CreateProductDTO,
  UpdateProductDTO,
} from "../../domain/repositories/product-repository.interface";

export const productsApiClient = {
  getAllPaginated(
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
  ): Promise<PaginatedProducts> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    return apiFetch<PaginatedProducts>(
      `/admin/products?${params.toString()}`,
    );
  },

  getById(id: string): Promise<Product> {
    return apiFetch<Product>(`/admin/products/${id}`);
  },

  create(
    data: CreateProductDTO,
    images: File[],
    nutritionalTableImage?: File,
  ): Promise<Product> {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    images.forEach((f) => formData.append("images", f));
    if (nutritionalTableImage) {
      formData.append("nutritionalTableImage", nutritionalTableImage);
    }
    return apiFetch<Product>("/admin/products", { method: "POST", body: formData });
  },

  update(
    id: string,
    data: UpdateProductDTO,
    images?: File[],
    nutritionalTableImage?: File,
  ): Promise<Product> {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (images) {
      images.forEach((f) => formData.append("images", f));
    }
    if (nutritionalTableImage) {
      formData.append("nutritionalTableImage", nutritionalTableImage);
    }
    return apiFetch<Product>(`/admin/products/${id}`, { method: "PUT", body: formData });
  },

  async getRelatedProducts(id: string): Promise<{ productId: string; name: string; order?: number; isAutomatic?: boolean }[]> {
    // O backend retorna um array de ProductResponseDTO com campo `id`.
    // Mapeamos para a nomenclatura do domínio (productId).
    const data = await apiFetch<{ id: string; name: string; isAutomatic?: boolean }[]>(`/admin/products/${id}/related`);
    return data.map((item, index) => ({
      productId: item.id,
      name: item.name,
      order: index + 1,
      isAutomatic: item.isAutomatic,
    }));
  },

  setRelatedProducts(
    id: string,
    relatedProducts: { productId: string; order?: number }[],
  ): Promise<void> {
    return apiFetch<void>(`/admin/products/${id}/related`, {
      method: "PUT",
      body: JSON.stringify({ relatedProducts }),
    });
  },

  deleteImage(productId: string, imageId: string): Promise<void> {
    return apiFetch<void>(`/admin/products/${productId}/images/${imageId}`, {
      method: "DELETE",
    });
  },
};
