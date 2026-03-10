import { OrderRepository, CreateShipmentResult } from "../../domain/repositories/order-repository.interface";

export class CreateShipmentUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(orderId: string): Promise<CreateShipmentResult> {
    return this.orderRepository.createShipment(orderId);
  }
}
