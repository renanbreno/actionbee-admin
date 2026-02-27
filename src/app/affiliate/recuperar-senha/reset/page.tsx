'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AffiliateResetPasswordForm } from '@/contexts/affiliate-auth/presentation/components/affiliate-reset-password-form';
import { useAffiliateVerifyResetToken } from '@/contexts/affiliate-auth/presentation/hooks/use-affiliate-verify-reset-token';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAffiliatePath } from '@/contexts/affiliate-auth/presentation/hooks/use-affiliate-path';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const affiliatePath = useAffiliatePath();
  const token = searchParams.get('token');

  const [isValidated, setIsValidated] = useState(false);
  const [email, setEmail] = useState<string>();

  const { data, isLoading, isError, error } = useAffiliateVerifyResetToken(
    token ?? '',
    !!token
  );

  useEffect(() => {
    if (data) {
      setIsValidated(true);
      setEmail(data.email);
    }
  }, [data]);

  if (!token) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Token não fornecido</h3>
          <p className="text-sm text-muted-foreground">
            O link de recuperação está incompleto. Solicite uma nova recuperação de senha.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(affiliatePath('/recuperar-senha'))}
        >
          Solicitar nova recuperação
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-bee-gold" />
        <p className="text-sm text-muted-foreground">Verificando token...</p>
      </div>
    );
  }

  if (isError || (!isValidated && !isLoading)) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Link inválido ou expirado</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Este link não é mais válido.'}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(affiliatePath('/recuperar-senha'))}
        >
          Solicitar nova recuperação
        </Button>
      </div>
    );
  }

  return (
    <AffiliateResetPasswordForm
      token={token}
      email={email}
      onSuccess={() => {
        // Form handles success state internally
      }}
    />
  );
}

export default function AffiliateResetPasswordPage() {
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
          <Suspense fallback={
            <div className="flex w-full flex-col items-center justify-center space-y-4 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-bee-gold" />
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          }>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
