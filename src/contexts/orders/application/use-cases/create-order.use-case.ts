import { OrderRepository } from "../../domain/repositories/order-repository.interface";
import { CreateOrderDTO } from "../dto/create-order.dto";
import { OrderListItem } from "../../domain/entities/order";

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(params: CreateOrderDTO): Promise<OrderListItem> {
    return this.orderRepository.create(params);
  }
}
