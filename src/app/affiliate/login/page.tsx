'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AffiliateLoginForm } from '@/contexts/affiliate-auth/presentation/components/affiliate-login-form';
import { useAffiliateAuthContext } from '@/contexts/affiliate-auth/presentation/providers/affiliate-auth-provider';
import { useAffiliatePath } from '@/contexts/affiliate-auth/presentation/hooks/use-affiliate-path';

export default function AffiliateLoginPage() {
  const { isAuthenticated, isLoading } = useAffiliateAuthContext();
  const router = useRouter();
  const affiliatePath = useAffiliatePath();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(affiliatePath('/dashboard'));
    }
  }, [isAuthenticated, isLoading, router, affiliatePath]);

  const handleFirstAccess = (cpf: string) => {
    router.push(`${affiliatePath('/primeiro-acesso')}?cpf=${encodeURIComponent(cpf)}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-bee-gold text-2xl font-black text-black shadow-lg shadow-bee-gold/30">
            🐝
          </div>
          <h1 className="text-2xl font-black tracking-tight">ActionBee</h1>
          <p className="mt-1 text-sm text-muted-foreground">Portal do Afiliado</p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <AffiliateLoginForm
            onSuccess={() => router.push(affiliatePath('/dashboard'))}
            onFirstAccess={handleFirstAccess}
          />
        </div>
      </div>
    </div>
  );
}
