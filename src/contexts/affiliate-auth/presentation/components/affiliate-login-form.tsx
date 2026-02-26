'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, CreditCard, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useAffiliateLogin } from '../hooks/use-affiliate-login';
import { affiliateAuthApiClient } from '../../infrastructure/api/affiliate-auth-api.client';

function formatCpf(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

const passwordSchema = z.object({
  password: z.string().min(1, 'Senha obrigatória'),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface AffiliateLoginFormProps {
  onSuccess: () => void;
  onFirstAccess: (cpf: string) => void;
}

export function AffiliateLoginForm({ onSuccess, onFirstAccess }: AffiliateLoginFormProps) {
  const loginMutation = useAffiliateLogin();

  const [step, setStep] = useState<'cpf' | 'password'>('cpf');
  // cpf stores the raw 11-digit value; cpfDisplay stores the formatted string
  const [cpf, setCpf] = useState('');
  const [cpfDisplay, setCpfDisplay] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [probing, setProbing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpfError('');
    const formatted = formatCpf(e.target.value);
    setCpfDisplay(formatted);
    setCpf(formatted.replace(/\D/g, ''));
  };

  // Check if the CPF exists and has a password set.
  // If no password → first access flow.
  // If has password → show password field.
  const handleCpfSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cpf.length !== 11) {
      setCpfError('CPF inválido');
      return;
    }
    setProbing(true);
    try {
      const result = await affiliateAuthApiClient.checkCpf(cpf);
      if (result.hasPassword) {
        setStep('password');
      } else {
        onFirstAccess(cpf);
      }
    } catch {
      setCpfError('CPF não encontrado');
    } finally {
      setProbing(false);
    }
  };

  const handlePasswordSubmit = (data: PasswordFormValues) => {
    loginMutation.mutate(
      { cpf, password: data.password },
      {
        onSuccess,
        onError: () => {
          passwordForm.setError('password', { message: 'CPF ou senha incorretos' });
        },
      },
    );
  };

  /* ── Etapa 1: CPF ── */
  if (step === 'cpf') {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">Entrar no Portal do Afiliado</h2>
          <p className="text-sm text-muted-foreground">Digite seu CPF para continuar.</p>
        </div>

        <form onSubmit={handleCpfSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="cpf" className="text-sm font-medium">CPF</Label>
            <div className="group relative">
              <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-bee-gold" />
              <Input
                id="cpf"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpfDisplay}
                onChange={handleCpfChange}
                autoFocus
                className="h-12 border-border bg-muted/40 pl-10 transition-all focus-visible:border-bee-gold/50 focus-visible:ring-2 focus-visible:ring-bee-gold/20"
              />
            </div>
            {cpfError && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {cpfError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="h-12 w-full gap-2 shadow-lg shadow-bee-gold/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            disabled={probing}
          >
            {probing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/20 border-t-current" />
                Verificando...
              </span>
            ) : (
              <>
                Continuar
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    );
  }

  /* ── Etapa 2: Senha ── */
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Sua senha</h2>
        <p className="text-sm text-muted-foreground">
          CPF{' '}
          <span className="font-medium text-foreground">
            {cpfDisplay || cpf}
          </span>
        </p>
      </div>

      <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
          <div className="group relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-bee-gold" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={passwordForm.watch('password') || ''}
              onChange={(e) => passwordForm.setValue('password', e.target.value)}
              autoFocus
              className="h-12 border-border bg-muted/40 pl-10 pr-11 transition-all focus-visible:border-bee-gold/50 focus-visible:ring-2 focus-visible:ring-bee-gold/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordForm.formState.errors.password && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {passwordForm.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 w-full gap-2 shadow-lg shadow-bee-gold/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/20 border-t-current" />
              Entrando...
            </span>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Entrar
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={() => { setStep('cpf'); passwordForm.reset(); }}
          className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Usar outro CPF
        </button>
      </form>
    </div>
  );
}
