"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserUseCase } from "../../di";
import { AdminUser } from "../../domain/entities/admin-user";

export function useAuth() {
  const { data: user, isLoading } = useQuery<AdminUser | null>({
    queryKey: ["auth", "user"],
    queryFn: () => getCurrentUserUseCase.execute(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
  };
}
