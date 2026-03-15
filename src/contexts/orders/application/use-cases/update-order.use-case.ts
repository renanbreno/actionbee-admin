import { OrderRepository } from "../../domain/repositories/order-repository.interface";
import { UpdateOrderDTO } from "../dto/update-order.dto";
import { OrderDetail } from "../../domain/entities/order";

export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(id: string, params: UpdateOrderDTO): Promise<OrderDetail> {
    return this.orderRepository.update(id, params);
  }
}
