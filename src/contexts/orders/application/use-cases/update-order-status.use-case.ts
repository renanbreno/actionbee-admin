import { OrderRepository } from "../../domain/repositories/order-repository.interface";
import { UpdateOrderStatusDTO } from "../dto/update-order-status.dto";

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(id: string, params: UpdateOrderStatusDTO): Promise<void> {
    return this.orderRepository.updateStatus(id, params);
  }
}
