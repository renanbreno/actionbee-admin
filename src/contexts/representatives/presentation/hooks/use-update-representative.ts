"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRepresentativeUseCase } from "../../di";
import { UpdateRepresentativeParams } from "../../domain/repositories/representative-repository.interface";

export function useUpdateRepresentative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRepresentativeParams }) =>
      updateRepresentativeUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["representatives"] });
    },
  });
}
