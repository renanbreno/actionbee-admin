import { PaginatedProducts } from "../../domain/entities/product";
import { ProductRepository } from "../../domain/repositories/product-repository.interface";

export class GetAllProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
  ): Promise<PaginatedProducts> {
    return this.repository.getAllPaginated(page, limit, search, categoryId);
  }
}
