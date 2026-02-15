import { LoginForm } from "@/contexts/auth/presentation/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-bee-gold/5 p-4">
      <LoginForm />
    </main>
  );
}
