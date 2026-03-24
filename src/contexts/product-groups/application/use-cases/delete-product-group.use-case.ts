import { ProductGroupRepository } from "../../domain/repositories/product-group-repository.interface";

export class DeleteProductGroupUseCase {
  constructor(private readonly repository: ProductGroupRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
