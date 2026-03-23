import { AbandonedCartRepository } from "../../domain/repositories/abandoned-cart-repository.interface";
import { GetAbandonedCartsFiltersDTO } from "../dto/get-abandoned-carts-filters.dto";
import { PaginatedAbandonedCarts } from "../../domain/entities/abandoned-cart.entity";

export class GetAbandonedCartsUseCase {
  constructor(private readonly abandonedCartRepository: AbandonedCartRepository) {}

  execute(filters: GetAbandonedCartsFiltersDTO): Promise<PaginatedAbandonedCarts> {
    return this.abandonedCartRepository.getAll(filters);
  }
}
