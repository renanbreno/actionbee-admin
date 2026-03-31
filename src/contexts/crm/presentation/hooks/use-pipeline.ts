"use client";

import { useQuery } from "@tanstack/react-query";
import { getPipelineByIdUseCase } from "../../di";

export function usePipeline(id: string) {
  return useQuery({
    queryKey: ["crm-pipeline", id],
    queryFn: () => getPipelineByIdUseCase.execute(id),
    enabled: !!id,
  });
}
