import { Category } from "../entities/category";

export interface CreateCategoryParams {
  name: string;
  description?: string;
  featured?: boolean;
  parentId?: string;
}

export interface UpdateCategoryParams {
  name: string;
  description?: string;
  isActive?: boolean;
  featured?: boolean;
  parentId?: string;
}

export interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: string): Promise<Category>;
  create(params: CreateCategoryParams): Promise<Category>;
  update(id: string, params: UpdateCategoryParams): Promise<Category>;
  delete(id: string): Promise<void>;
}
