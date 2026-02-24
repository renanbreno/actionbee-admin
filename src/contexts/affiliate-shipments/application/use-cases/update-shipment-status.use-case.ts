import {
  AffiliateShipment,
  ShipmentStatus,
} from "../../domain/entities/affiliate-shipment";
import { AffiliateShipmentRepository } from "../../domain/repositories/affiliate-shipment-repository.interface";

export class UpdateShipmentStatusUseCase {
  constructor(private readonly repository: AffiliateShipmentRepository) {}

  async execute(
    affiliateId: string,
    shipmentId: string,
    status: ShipmentStatus,
  ): Promise<AffiliateShipment> {
    return this.repository.updateStatus(affiliateId, shipmentId, status);
  }
}
