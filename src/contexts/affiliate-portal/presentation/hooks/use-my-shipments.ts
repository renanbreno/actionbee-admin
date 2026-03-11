'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyShipmentsUseCase } from '../../di';

export function useMyShipments(
  page = 1,
  limit = 20,
  dateFilter?: { startDate?: string; endDate?: string }
) {
  return useQuery({
    queryKey: ['affiliate-portal', 'shipments', page, limit, dateFilter?.startDate, dateFilter?.endDate],
    queryFn: () => getMyShipmentsUseCase.execute({
      page,
      limit,
      startDate: dateFilter?.startDate,
      endDate: dateFilter?.endDate,
    }),
  });
}
