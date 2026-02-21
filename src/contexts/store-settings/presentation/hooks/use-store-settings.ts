"use client";

import { useQuery } from "@tanstack/react-query";
import { getStoreSettingsUseCase } from "../../di";

export function useStoreSettings() {
  return useQuery({
    queryKey: ["store-settings"],
    queryFn: () => getStoreSettingsUseCase.execute(),
  });
}
