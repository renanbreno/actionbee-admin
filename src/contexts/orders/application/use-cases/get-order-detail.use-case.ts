import { OrderRepository } from "../../domain/repositories/order-repository.interface";
import { OrderDetail } from "../../domain/entities/order";

export class GetOrderDetailUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(id: string): Promise<OrderDetail> {
    return this.orderRepository.getById(id);
  }
}
