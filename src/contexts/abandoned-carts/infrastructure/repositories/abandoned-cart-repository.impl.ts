import { AbandonedCartRepository } from "../../domain/repositories/abandoned-cart-repository.interface";
import { PaginatedAbandonedCarts } from "../../domain/entities/abandoned-cart.entity";
import { GetAbandonedCartsFiltersDTO } from "../../application/dto/get-abandoned-carts-filters.dto";
import { abandonedCartsApiClient } from "../api/abandoned-carts-api.client";

export class AbandonedCartRepositoryImpl implements AbandonedCartRepository {
  getAll(filters: GetAbandonedCartsFiltersDTO): Promise<PaginatedAbandonedCarts> {
    return abandonedCartsApiClient.getAll(filters);
  }
}
