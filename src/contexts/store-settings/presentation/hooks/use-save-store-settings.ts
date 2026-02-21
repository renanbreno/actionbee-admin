"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveStoreSettingsUseCase } from "../../di";
import { UpdateStoreSettingsDto } from "../../application/dto/update-store-settings.dto";

export function useSaveStoreSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, exists }: { data: UpdateStoreSettingsDto; exists: boolean }) =>
      saveStoreSettingsUseCase.execute(data, exists),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
    },
  });
}
