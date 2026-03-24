import { ProductGroup } from "../../domain/entities/product-group";
import {
  CreateProductGroupDto,
  ProductGroupRepository,
  UpdateProductGroupDto,
} from "../../domain/repositories/product-group-repository.interface";
import { productGroupsApiClient } from "../api/product-groups-api.client";

export class ProductGroupRepositoryImpl implements ProductGroupRepository {
  getAll(): Promise<ProductGroup[]> {
    return productGroupsApiClient.getAll();
  }

  getById(id: string): Promise<ProductGroup> {
    return productGroupsApiClient.getById(id);
  }

  create(dto: CreateProductGroupDto): Promise<ProductGroup> {
    return productGroupsApiClient.create(dto);
  }

  update(id: string, dto: UpdateProductGroupDto): Promise<ProductGroup> {
    return productGroupsApiClient.update(id, dto);
  }

  delete(id: string): Promise<void> {
    return productGroupsApiClient.delete(id);
  }
}
