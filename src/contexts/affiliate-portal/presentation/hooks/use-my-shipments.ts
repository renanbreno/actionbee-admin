'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyShipmentsUseCase } from '../../di';

export function useMyShipments(dateFilter?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['affiliate-portal', 'shipments', dateFilter?.startDate, dateFilter?.endDate],
    queryFn: () => getMyShipmentsUseCase.execute(dateFilter),
    staleTime: 2 * 60 * 1000,
  });
}
