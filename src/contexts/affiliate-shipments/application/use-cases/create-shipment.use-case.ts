import { AffiliateShipment } from "../../domain/entities/affiliate-shipment";
import {
  AffiliateShipmentRepository,
  CreateShipmentDTO,
} from "../../domain/repositories/affiliate-shipment-repository.interface";

export class CreateShipmentUseCase {
  constructor(private readonly repository: AffiliateShipmentRepository) {}

  async execute(
    affiliateId: string,
    data: CreateShipmentDTO,
  ): Promise<AffiliateShipment> {
    return this.repository.create(affiliateId, data);
  }
}
