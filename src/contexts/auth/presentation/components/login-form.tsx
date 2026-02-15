"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { loginSchema, LoginFormValues } from "../schemas/login.schema";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => router.push("/dashboard"),
    });
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bee-gold shadow-lg shadow-bee-gold/25">
          <span className="text-2xl font-black text-black">A</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">ActionBee</h1>
          <p className="text-muted-foreground text-sm">Painel Administrativo</p>
        </div>
      </div>

      <Card className="w-full max-w-sm border-0 shadow-xl shadow-black/5">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Entrar</CardTitle>
          <CardDescription>
            Acesse com suas credenciais de administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@actionbee.com.br"
                className="h-11"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                className="h-11"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            {loginMutation.isError && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3">
                <p className="text-destructive text-sm font-medium">
                  Email ou senha inválidos.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.01] hover:brightness-110 active:scale-[0.99]"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                "Entrando..."
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
