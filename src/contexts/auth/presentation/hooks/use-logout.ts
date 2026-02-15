"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUseCase } from "../../di";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutUseCase.execute(),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear();
    },
  });
}
