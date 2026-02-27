'use client';

import { useQuery } from '@tanstack/react-query';
import { affiliateVerifyResetTokenUseCase } from '../../di';

export function useAffiliateVerifyResetToken(token: string, enabled = true) {
  return useQuery({
    queryKey: ['affiliate-auth', 'verify-token', token],
    queryFn: () => affiliateVerifyResetTokenUseCase.execute(token),
    enabled: enabled && !!token,
    retry: false,
  });
}
