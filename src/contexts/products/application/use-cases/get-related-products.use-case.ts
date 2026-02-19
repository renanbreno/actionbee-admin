import { RelatedProduct } from "../../domain/entities/product";
import { ProductRepository } from "../../domain/repositories/product-repository.interface";

export class GetRelatedProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<RelatedProduct[]> {
    return this.repository.getRelatedProducts(id);
  }
}
