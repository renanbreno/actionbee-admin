import { PaginatedProducts, Product, RelatedProduct } from "../../domain/entities/product";
import {
  CreateProductDTO,
  ProductRepository,
  UpdateProductDTO,
} from "../../domain/repositories/product-repository.interface";
import { productsApiClient } from "../api/products-api.client";

export class ProductRepositoryImpl implements ProductRepository {
  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
  ): Promise<PaginatedProducts> {
    return productsApiClient.getAllPaginated(page, limit, search, categoryId);
  }

  async getById(id: string): Promise<Product> {
    return productsApiClient.getById(id);
  }

  async create(
    data: CreateProductDTO,
    images: File[],
    nutritionalTableImage?: File,
  ): Promise<Product> {
    return productsApiClient.create(data, images, nutritionalTableImage);
  }

  async update(
    id: string,
    data: UpdateProductDTO,
    images?: File[],
    nutritionalTableImage?: File,
  ): Promise<Product> {
    return productsApiClient.update(id, data, images, nutritionalTableImage);
  }

  async getRelatedProducts(id: string): Promise<RelatedProduct[]> {
    return productsApiClient.getRelatedProducts(id);
  }

  async setRelatedProducts(
    id: string,
    relatedProducts: { productId: string; order?: number }[],
  ): Promise<void> {
    return productsApiClient.setRelatedProducts(id, relatedProducts);
  }
}
