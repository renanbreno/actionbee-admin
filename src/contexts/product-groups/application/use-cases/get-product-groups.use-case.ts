import { ProductGroup } from "../../domain/entities/product-group";
import { ProductGroupRepository } from "../../domain/repositories/product-group-repository.interface";

export class GetProductGroupsUseCase {
  constructor(private readonly repository: ProductGroupRepository) {}

  execute(): Promise<ProductGroup[]> {
    return this.repository.getAll();
  }
}
