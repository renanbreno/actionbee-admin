'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateSetupPasswordUseCase } from '../../di';

export function useAffiliateSetupPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { cpf: string; password: string }) =>
      affiliateSetupPasswordUseCase.execute(data),
    onSuccess: (affiliate) => {
      queryClient.setQueryData(['affiliate-auth', 'user'], affiliate);
    },
  });
}
