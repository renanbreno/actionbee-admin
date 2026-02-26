import { affiliateApiFetch } from '@/shared/infrastructure/api/affiliate-api-client';
import { CommissionReport } from '@/contexts/commissions/domain/entities/commission';
import { AffiliateShipment } from '@/contexts/affiliate-shipments/domain/entities/affiliate-shipment';

export interface GetMyCommissionsParams {
  status?: 'PENDING' | 'PAID' | 'CANCELLED';
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}

export interface GetMyShipmentsParams {
  startDate?: string;
  endDate?: string;
}

export const affiliatePortalApiClient = {
  getMyCommissions(params: GetMyCommissionsParams): Promise<CommissionReport> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    searchParams.append('page', params.page.toString());
    searchParams.append('limit', params.limit.toString());
    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    return affiliateApiFetch<CommissionReport>(`/affiliates/me/commissions?${searchParams.toString()}`);
  },

  getMyShipments(params?: GetMyShipmentsParams): Promise<AffiliateShipment[]> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    const qs = searchParams.toString();
    return affiliateApiFetch<AffiliateShipment[]>(`/affiliates/me/shipments${qs ? `?${qs}` : ''}`);
  },
};
