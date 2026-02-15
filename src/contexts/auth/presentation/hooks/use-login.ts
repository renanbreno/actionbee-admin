"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUseCase } from "../../di";
import { LoginFormValues } from "../schemas/login.schema";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormValues) => loginUseCase.execute(data),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
    },
  });
}
