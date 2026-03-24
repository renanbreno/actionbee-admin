import { ProductGroup } from "../entities/product-group";

export interface CreateProductGroupDto {
  name: string;
  productIds?: string[];
}

export interface UpdateProductGroupDto {
  name?: string;
  productIds?: string[];
}

export interface ProductGroupRepository {
  getAll(): Promise<ProductGroup[]>;
  getById(id: string): Promise<ProductGroup>;
  create(dto: CreateProductGroupDto): Promise<ProductGroup>;
  update(id: string, dto: UpdateProductGroupDto): Promise<ProductGroup>;
  delete(id: string): Promise<void>;
}
