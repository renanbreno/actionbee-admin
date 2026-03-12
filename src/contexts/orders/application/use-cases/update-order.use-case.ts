import { OrderRepository } from "../../domain/repositories/order-repository.interface";
import { UpdateOrderDTO } from "../dto/update-order.dto";
import { OrderListItem } from "../../domain/entities/order";

export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(id: string, params: UpdateOrderDTO): Promise<OrderListItem> {
    return this.orderRepository.update(id, params);
  }
}
