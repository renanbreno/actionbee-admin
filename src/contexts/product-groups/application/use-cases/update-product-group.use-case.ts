import { ProductGroup } from "../../domain/entities/product-group";
import { ProductGroupRepository, UpdateProductGroupDto } from "../../domain/repositories/product-group-repository.interface";

export class UpdateProductGroupUseCase {
  constructor(private readonly repository: ProductGroupRepository) {}

  execute(id: string, dto: UpdateProductGroupDto): Promise<ProductGroup> {
    return this.repository.update(id, dto);
  }
}
