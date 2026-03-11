import { OrderRepository } from "../../domain/repositories/order-repository.interface";
import { UpdateOrderPaymentStatusDTO } from "../../application/dto/update-order-payment-status.dto";

export class UpdateOrderPaymentStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string, params: UpdateOrderPaymentStatusDTO): Promise<void> {
    await this.orderRepository.updatePaymentStatus(id, params);
  }
}
