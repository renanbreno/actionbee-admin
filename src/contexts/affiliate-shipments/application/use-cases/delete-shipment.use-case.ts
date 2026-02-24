import { AffiliateShipmentRepository } from "../../domain/repositories/affiliate-shipment-repository.interface";

export class DeleteShipmentUseCase {
  constructor(private readonly repository: AffiliateShipmentRepository) {}

  async execute(affiliateId: string, shipmentId: string): Promise<void> {
    return this.repository.delete(affiliateId, shipmentId);
  }
}
