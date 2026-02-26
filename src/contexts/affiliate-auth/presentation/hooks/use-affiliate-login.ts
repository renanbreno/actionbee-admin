'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateLoginUseCase } from '../../di';

export function useAffiliateLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { cpf: string; password: string }) =>
      affiliateLoginUseCase.execute(data),
    onSuccess: (affiliate) => {
      queryClient.setQueryData(['affiliate-auth', 'user'], affiliate);
    },
  });
}
