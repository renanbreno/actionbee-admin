"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "../providers/auth-provider";
import { Role } from "../../domain/value-objects/role";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  /** Permissões exigidas (basta ter qualquer uma). super_admin sempre passa. */
  requiredPermissions?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requiredPermissions,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, hasAnyPermission } =
    useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-destructive text-lg font-semibold">Access Denied</div>
      </div>
    );
  }

  if (
    requiredPermissions &&
    requiredPermissions.length > 0 &&
    !hasAnyPermission(requiredPermissions)
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-destructive text-lg font-semibold">
          Acesso negado
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
