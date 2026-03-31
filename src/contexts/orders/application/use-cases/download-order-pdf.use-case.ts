import { OrderRepository } from "../../domain/repositories/order-repository.interface";

export class DownloadOrderPdfUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  execute(orderId: string): Promise<Blob> {
    return this.orderRepository.downloadPdf(orderId);
  }
}
