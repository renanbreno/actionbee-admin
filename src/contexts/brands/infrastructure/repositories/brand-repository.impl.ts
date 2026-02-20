import { Brand } from "../../domain/entities/brand";
import {
  BrandRepository,
  CreateBrandDTO,
  UpdateBrandDTO,
} from "../../domain/repositories/brand-repository.interface";
import { brandsApiClient } from "../api/brands-api.client";

export class BrandRepositoryImpl implements BrandRepository {
  async getAll(): Promise<Brand[]> {
    return brandsApiClient.getAll();
  }

  async getById(id: string): Promise<Brand> {
    return brandsApiClient.getById(id);
  }

  async create(data: CreateBrandDTO): Promise<Brand> {
    return brandsApiClient.create(data);
  }

  async update(id: string, data: UpdateBrandDTO): Promise<Brand> {
    return brandsApiClient.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return brandsApiClient.delete(id);
  }
}
