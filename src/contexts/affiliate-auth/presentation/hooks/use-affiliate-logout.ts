'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliateLogoutUseCase } from '../../di';

export function useAffiliateLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => affiliateLogoutUseCase.execute(),
    onSuccess: () => {
      queryClient.setQueryData(['affiliate-auth', 'user'], null);
      queryClient.clear();
    },
  });
}
