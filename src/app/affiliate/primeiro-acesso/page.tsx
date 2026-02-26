'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AffiliateSetupPasswordForm } from '@/contexts/affiliate-auth/presentation/components/affiliate-setup-password-form';
import { useAffiliateAuthContext } from '@/contexts/affiliate-auth/presentation/providers/affiliate-auth-provider';
import { useAffiliatePath } from '@/contexts/affiliate-auth/presentation/hooks/use-affiliate-path';

function PrimeiroAcessoContent() {
  const { isAuthenticated, isLoading } = useAffiliateAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const affiliatePath = useAffiliatePath();

  const cpf = searchParams.get('cpf') ?? '';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(affiliatePath('/dashboard'));
    }
  }, [isAuthenticated, isLoading, router, affiliatePath]);

  // Se não veio CPF na URL, volta para o login
  useEffect(() => {
    if (!cpf) {
      router.replace(affiliatePath('/login'));
    }
  }, [cpf, router, affiliatePath]);

  if (!cpf) return null;

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
          <AffiliateSetupPasswordForm
            cpf={cpf}
            onSuccess={() => router.push(affiliatePath('/dashboard'))}
          />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Já tem uma senha?{' '}
          <button
            onClick={() => router.push(affiliatePath('/login'))}
            className="font-medium text-bee-gold hover:underline"
          >
            Voltar ao login
          </button>
        </p>
      </div>
    </div>
  );
}

export default function AffiliatePrimeiroAcessoPage() {
  return (
    <Suspense>
      <PrimeiroAcessoContent />
    </Suspense>
  );
}
