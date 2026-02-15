import { Category } from "../../domain/entities/category";
import {
  CategoryRepository,
  CreateCategoryParams,
  UpdateCategoryParams,
} from "../../domain/repositories/category-repository.interface";
import { categoriesApiClient } from "../api/categories-api.client";

export class CategoryRepositoryImpl implements CategoryRepository {
  async getAll(): Promise<Category[]> {
    return categoriesApiClient.getAll();
  }

  async getById(id: string): Promise<Category> {
    return categoriesApiClient.getById(id);
  }

  async create(params: CreateCategoryParams): Promise<Category> {
    return categoriesApiClient.create(params);
  }

  async update(id: string, params: UpdateCategoryParams): Promise<Category> {
    return categoriesApiClient.update(id, params);
  }

  async delete(id: string): Promise<void> {
    return categoriesApiClient.delete(id);
  }
}
