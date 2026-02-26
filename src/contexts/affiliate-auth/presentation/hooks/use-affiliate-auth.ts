'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrentAffiliateUserUseCase } from '../../di';
import { AffiliateUser } from '../../domain/entities/affiliate-user';

export function useAffiliateAuth() {
  const { data: user, isLoading } = useQuery<AffiliateUser | null>({
    queryKey: ['affiliate-auth', 'user'],
    queryFn: () => getCurrentAffiliateUserUseCase.execute(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
  };
}
