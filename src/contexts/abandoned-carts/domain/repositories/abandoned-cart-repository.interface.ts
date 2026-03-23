import { PaginatedAbandonedCarts } from "../entities/abandoned-cart.entity";
import { GetAbandonedCartsFiltersDTO } from "../../application/dto/get-abandoned-carts-filters.dto";

export interface AbandonedCartRepository {
  getAll(filters: GetAbandonedCartsFiltersDTO): Promise<PaginatedAbandonedCarts>;
}
