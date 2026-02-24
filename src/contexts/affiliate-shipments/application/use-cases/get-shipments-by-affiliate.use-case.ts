import { AffiliateShipment } from "../../domain/entities/affiliate-shipment";
import { AffiliateShipmentRepository } from "../../domain/repositories/affiliate-shipment-repository.interface";

export class GetShipmentsByAffiliateUseCase {
  constructor(private readonly repository: AffiliateShipmentRepository) {}

  async execute(
    affiliateId: string,
    month?: string,
  ): Promise<AffiliateShipment[]> {
    return this.repository.getByAffiliate(affiliateId, month);
  }
}
