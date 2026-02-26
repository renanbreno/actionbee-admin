'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyCommissionsUseCase } from '../../di';

export function useMyCommissions(
  page = 1,
  limit = 20,
  dateFilter?: { startDate?: string; endDate?: string },
) {
  return useQuery({
    queryKey: ['affiliate-portal', 'commissions', page, limit, dateFilter?.startDate, dateFilter?.endDate],
    queryFn: () => getMyCommissionsUseCase.execute({
      page,
      limit,
      startDate: dateFilter?.startDate,
      endDate: dateFilter?.endDate,
    }),
    staleTime: 2 * 60 * 1000,
  });
}
