"use client";

import { useAuthContext } from "@/contexts/auth/presentation/providers/auth-provider";

export default function DashboardPage() {
  const { user } = useAuthContext();

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {user && (
        <p className="text-muted-foreground mt-2">
          Bem-vindo, {user.name}!
        </p>
      )}
    </div>
  );
}
