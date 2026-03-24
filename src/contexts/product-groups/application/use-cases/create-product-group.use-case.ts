import { ProductGroup } from "../../domain/entities/product-group";
import { ProductGroupRepository, CreateProductGroupDto } from "../../domain/repositories/product-group-repository.interface";

export class CreateProductGroupUseCase {
  constructor(private readonly repository: ProductGroupRepository) {}

  execute(dto: CreateProductGroupDto): Promise<ProductGroup> {
    return this.repository.create(dto);
  }
}
