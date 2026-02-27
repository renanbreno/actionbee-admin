'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAffiliateResetPassword } from '../hooks/use-affiliate-reset-password';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface AffiliateResetPasswordFormProps {
  token: string;
  onSuccess?: () => void;
  email?: string;
}

export function AffiliateResetPasswordForm({ token, onSuccess, email }: AffiliateResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const mutation = useAffiliateResetPassword();

  const handleSubmit = (data: ResetPasswordFormValues) => {
    mutation.mutate(
      { token, password: data.password },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error: Error) => {
          if (error.message.includes('expirado') || error.message.includes('inválido')) {
            form.setError('root', { message: error.message });
          }
        },
      },
    );
  };

  if (mutation.isSuccess) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bee-gold/10">
            <CheckCircle2 className="h-8 w-8 text-bee-gold" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Senha redefinida!</h3>
          <p className="text-sm text-muted-foreground">
            Sua senha foi redefinida com sucesso. Você já pode entrar com sua nova senha.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            window.location.href = '/affiliate/login';
          }}
          className="h-12 w-full gap-2 shadow-lg shadow-bee-gold/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        >
          <ArrowRight className="h-4 w-4" />
          Ir para o login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-5">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Redefinir senha</h2>
        {email && (
          <p className="text-sm text-muted-foreground">
            {email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium">Nova senha</Label>
        <div className="group relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-bee-gold" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoFocus
            {...form.register('password')}
            className="h-12 border-border bg-muted/40 pl-10 pr-11 transition-all focus-visible:border-bee-gold/50 focus-visible:ring-2 focus-visible:ring-bee-gold/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar senha</Label>
        <div className="group relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-bee-gold" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...form.register('confirmPassword')}
            className="h-12 border-border bg-muted/40 pl-10 pr-11 transition-all focus-visible:border-bee-gold/50 focus-visible:ring-2 focus-visible:ring-bee-gold/20"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showConfirmPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {form.formState.errors.root && (
        <p className="flex items-center gap-1.5 text-xs text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {form.formState.errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        className="h-12 w-full gap-2 shadow-lg shadow-bee-gold/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/20 border-t-current" />
            Redefinindo...
          </span>
        ) : (
          <>
            Redefinir senha
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
