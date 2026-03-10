import { OrderRepository } from "../../domain/repositories/order-repository.interface";

export class GetShipmentLabelUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(orderId: string): Promise<{ labelUrl: string }> {
    return this.orderRepository.getShipmentLabel(orderId);
  }
}
