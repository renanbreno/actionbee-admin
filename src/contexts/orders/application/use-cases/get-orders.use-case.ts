import { OrderRepository } from "../../domain/repositories/order-repository.interface";
import { GetOrdersFiltersDTO } from "../dto/get-orders-filters.dto";
import { PaginatedOrders } from "../../domain/entities/order";

export class GetOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(filters: GetOrdersFiltersDTO): Promise<PaginatedOrders> {
    return this.orderRepository.getAll(filters);
  }
}
