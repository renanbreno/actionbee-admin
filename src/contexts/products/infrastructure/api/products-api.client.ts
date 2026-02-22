import Cookies from "js-cookie";
import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { env } from "@/shared/config/env";
import { PaginatedProducts, Product } from "../../domain/entities/product";
import {
  CreateProductDTO,
  UpdateProductDTO,
} from "../../domain/repositories/product-repository.interface";

async function multipartFetch<T>(
  path: string,
  method: string,
  formData: FormData,
): Promise<T> {
  const accessToken = Cookies.get("ab_access_token");

  const res = await fetch(`${env.API_BASE_URL}${path}`, {
    method,
    body: formData,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

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
    return multipartFetch<Product>("/admin/products", "POST", formData);
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
    return multipartFetch<Product>(`/admin/products/${id}`, "PUT", formData);
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
