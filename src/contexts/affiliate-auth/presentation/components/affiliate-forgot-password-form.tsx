'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validateEmail } from '@/shared/utils/validations';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAffiliateForgotPassword } from '../hooks/use-affiliate-forgot-password';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').refine(validateEmail, {
    message: 'Informe um e-mail válido',
  }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface AffiliateForgotPasswordFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function AffiliateForgotPasswordForm({ onBack, onSuccess }: AffiliateForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: { email: '' },
  });

  const mutation = useAffiliateForgotPassword();

  const handleSubmit = (data: ForgotPasswordFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
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
          <h3 className="text-lg font-semibold">Email enviado!</h3>
          <p className="text-sm text-muted-foreground">
            Enviamos instruções para redefinir sua senha. Verifique sua caixa de entrada.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="w-full gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-5">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Recuperar senha</h2>
        <p className="text-sm text-muted-foreground">
          Digite seu email para receber instruções de recuperação.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <div className="group relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-bee-gold" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoFocus
            {...form.register('email')}
            className="h-12 border-border bg-muted/40 pl-10 transition-all focus-visible:border-bee-gold/50 focus-visible:ring-2 focus-visible:ring-bee-gold/20"
          />
        </div>
        {form.formState.errors.email && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="h-12 w-full gap-2 shadow-lg shadow-bee-gold/20 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/20 border-t-current" />
            Enviando...
          </span>
        ) : (
          <>
            Enviar instruções
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Voltar para o login
        </button>
      )}
    </form>
  );
}
