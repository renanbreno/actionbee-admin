"use client";

import { LoginForm } from "@/contexts/auth/presentation/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bee-gold shadow-lg shadow-bee-gold/20">
            <span className="text-xl font-black text-black">A</span>
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold tracking-tight">ActionBee</h1>
            <p className="text-xs text-muted-foreground">Painel Administrativo</p>
          </div>
        </div>

        {/* Card do formulário */}
        <div className="rounded-2xl border bg-background p-8 shadow-sm">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} ActionBee. Uso interno.
        </p>
      </div>
    </main>
  );
}
