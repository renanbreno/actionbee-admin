"use client";

import { createContext, useContext, useMemo } from "react";
import { useAuth } from "../hooks/use-auth";
import { AdminUser } from "../../domain/entities/admin-user";
import {
  userHasAnyPermission,
  userHasPermission,
} from "../../domain/services/permissions";

interface AuthContextValue {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  hasPermission: () => false,
  hasAnyPermission: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  const value = useMemo<AuthContextValue>(
    () => ({
      ...auth,
      hasPermission: (permission: string) =>
        userHasPermission(auth.user, permission),
      hasAnyPermission: (permissions: string[]) =>
        userHasAnyPermission(auth.user, permissions),
    }),
    [auth],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
