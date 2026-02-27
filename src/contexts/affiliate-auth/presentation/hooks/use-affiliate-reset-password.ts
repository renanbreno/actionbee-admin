'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateResetPasswordUseCase } from '../../di';

export function useAffiliateResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      affiliateResetPasswordUseCase.execute(data),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['affiliate-auth', 'verify-token'] });
    },
  });
}
