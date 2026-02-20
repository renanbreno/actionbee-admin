import { Brand } from "../entities/brand";

export interface CreateBrandDTO {
  name: string;
}

export interface UpdateBrandDTO {
  name?: string;
  isActive?: boolean;
}

export interface BrandRepository {
  getAll(): Promise<Brand[]>;
  getById(id: string): Promise<Brand>;
  create(data: CreateBrandDTO): Promise<Brand>;
  update(id: string, data: UpdateBrandDTO): Promise<Brand>;
  delete(id: string): Promise<void>;
}
