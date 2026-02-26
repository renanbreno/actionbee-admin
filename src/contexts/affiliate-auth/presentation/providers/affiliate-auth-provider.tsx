'use client';

import { createContext, useContext } from 'react';
import { useAffiliateAuth } from '../hooks/use-affiliate-auth';
import { AffiliateUser } from '../../domain/entities/affiliate-user';

interface AffiliateAuthContextValue {
  user: AffiliateUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AffiliateAuthContext = createContext<AffiliateAuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export function AffiliateAuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAffiliateAuth();

  return (
    <AffiliateAuthContext.Provider value={auth}>
      {children}
    </AffiliateAuthContext.Provider>
  );
}

export function useAffiliateAuthContext() {
  return useContext(AffiliateAuthContext);
}
