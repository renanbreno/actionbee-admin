'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAffiliateAuthContext } from '@/contexts/affiliate-auth/presentation/providers/affiliate-auth-provider';
import { useAffiliatePath } from '@/contexts/affiliate-auth/presentation/hooks/use-affiliate-path';

export default function AffiliateRootPage() {
  const { isAuthenticated, isLoading } = useAffiliateAuthContext();
  const router = useRouter();
  const affiliatePath = useAffiliatePath();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace(affiliatePath('/dashboard'));
    } else {
      router.replace(affiliatePath('/login'));
    }
  }, [isAuthenticated, isLoading, router, affiliatePath]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-bee-gold/20 border-t-bee-gold" />
    </div>
  );
}
