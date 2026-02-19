import { ProductRepository } from "../../domain/repositories/product-repository.interface";

export class SetRelatedProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(
    id: string,
    relatedProducts: { productId: string; order?: number }[],
  ): Promise<void> {
    return this.repository.setRelatedProducts(id, relatedProducts);
  }
}
