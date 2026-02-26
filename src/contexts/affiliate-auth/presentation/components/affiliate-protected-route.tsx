'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAffiliateAuthContext } from '../providers/affiliate-auth-provider';
import { useAffiliatePath } from '../hooks/use-affiliate-path';

export function AffiliateProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAffiliateAuthContext();
  const router = useRouter();
  const affiliatePath = useAffiliatePath();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(affiliatePath('/login'));
    }
  }, [isLoading, isAuthenticated, router, affiliatePath]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-bee-gold/20 border-t-bee-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
