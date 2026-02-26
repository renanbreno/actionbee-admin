'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAffiliateSetupPassword } from '../hooks/use-affiliate-setup-password';

const setupSchema = z
  .object({
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type SetupFormValues = z.infer<typeof setupSchema>;

interface AffiliateSetupPasswordFormProps {
  cpf: string;
  onSuccess: () => void;
}

export function AffiliateSetupPasswordForm({ cpf, onSuccess }: AffiliateSetupPasswordFormProps) {
  const setupMutation = useAffiliateSetupPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
  });

  const onSubmit = (data: SetupFormValues) => {
    setupMutation.mutate({ cpf, password: data.password }, { onSuccess });
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Crie sua senha</h2>
        <p className="text-sm text-muted-foreground">
          Este é seu primeiro acesso. Escolha uma senha para sua conta.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-bee-gold/30 bg-bee-gold/5 px-4 py-3">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-bee-gold" />
        <p className="text-sm text-bee-gold font-medium">CPF verificado com sucesso</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Nova senha */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">Nova senha</Label>
          <div className="group relative">
            <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-bee-gold" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              className="h-12 border-border bg-muted/40 pl-10 pr-11 transition-all focus-visible:border-bee-gold/50 focus-visible:ring-2 focus-visible:ring-bee-gold/20"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirmar senha */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar senha</Label>
          <div className="group relative">
            <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-bee-gold" />
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repita a senha"
              className="h-12 border-border bg-muted/40 pl-10 pr-11 transition-all focus-visible:border-bee-gold/50 focus-visible:ring-2 focus-visible:ring-bee-gold/20"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showConfirm ? 'Ocultar' : 'Mostrar'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {setupMutation.isError && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">
              {setupMutation.error?.message ?? 'Erro ao configurar senha. Tente novamente.'}
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="h-12 w-full gap-2 shadow-lg shadow-bee-gold/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-bee-gold/30 active:scale-[0.99]"
          disabled={setupMutation.isPending}
        >
          {setupMutation.isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/20 border-t-current" />
              Salvando...
            </span>
          ) : (
            <>
              <KeyRound className="h-4 w-4" />
              Criar senha e entrar
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
