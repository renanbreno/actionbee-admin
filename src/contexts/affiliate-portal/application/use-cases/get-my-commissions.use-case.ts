import { CommissionReport } from '@/contexts/commissions/domain/entities/commission';
import { affiliatePortalApiClient, GetMyCommissionsParams } from '../../infrastructure/api/affiliate-portal-api.client';

export type { GetMyCommissionsParams };

export class GetMyCommissionsUseCase {
  async execute(params: GetMyCommissionsParams): Promise<CommissionReport> {
    return affiliatePortalApiClient.getMyCommissions(params);
  }
}
