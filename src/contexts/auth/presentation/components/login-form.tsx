"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginSchema, LoginFormValues } from "../schemas/login.schema";
import { useLogin } from "../hooks/use-login";
import { resolveLandingRoute } from "../../domain/services/landing-route";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (user) => {
        // Leva para a primeira tela que o usuário pode acessar (dashboard se
        // tiver permissão; senão pedidos, etc.). Sem nenhum acesso, cai no
        // /dashboard, que exibe a mensagem de "sem acesso".
        router.push(resolveLandingRoute(user) ?? "/dashboard");
      },
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Heading */}
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Entrar na conta</h2>
        <p className="text-sm text-muted-foreground">
          Use suas credenciais de acesso.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="group relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-bee-gold" />
            <Input
              id="email"
              type="email"
              placeholder="admin@actionbee.com.br"
              className="h-12 border-border bg-muted/40 pl-10 transition-all focus-visible:border-bee-gold/50 focus-visible:ring-2 focus-visible:ring-bee-gold/20"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">
            Senha
          </Label>
          <div className="group relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-bee-gold" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-12 border-border bg-muted/40 pl-10 pr-11 transition-all focus-visible:border-bee-gold/50 focus-visible:ring-2 focus-visible:ring-bee-gold/20"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Error message */}
        {loginMutation.isError && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">Email ou senha inválidos.</p>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="h-12 w-full gap-2 shadow-lg shadow-bee-gold/20 transition-all duration-200 hover:scale-[1.01] hover:shadow-bee-gold/30 active:scale-[0.99]"
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
      </form>

    </div>
  );
}
