import { Product } from "../../domain/entities/product";
import { ProductRepository } from "../../domain/repositories/product-repository.interface";

export class GetProductByIdUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    return this.repository.getById(id);
  }
}
