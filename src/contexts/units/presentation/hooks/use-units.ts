"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnitsUseCase } from "../../di";

export function useUnits() {
  return useQuery({
    queryKey: ["units"],
    queryFn: () => getUnitsUseCase.execute(),
  });
}
