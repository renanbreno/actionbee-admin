import { AffiliateShipment } from '@/contexts/affiliate-shipments/domain/entities/affiliate-shipment';
import { affiliatePortalApiClient, GetMyShipmentsParams } from '../../infrastructure/api/affiliate-portal-api.client';

export type { GetMyShipmentsParams };

export class GetMyShipmentsUseCase {
  async execute(params?: GetMyShipmentsParams): Promise<AffiliateShipment[]> {
    return affiliatePortalApiClient.getMyShipments(params);
  }
}
