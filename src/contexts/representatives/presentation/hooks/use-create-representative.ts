"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRepresentativeUseCase } from "../../di";
import { CreateRepresentativeParams } from "../../domain/repositories/representative-repository.interface";

export function useCreateRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateRepresentativeParams) =>
      createRepresentativeUseCase.execute(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["representatives"] });
    },
  });
}
