"use client";

import { useQuery } from "@tanstack/react-query";
import { getPipelinesUseCase } from "../../di";
import type { PipelineType } from "../../domain/enums";

export function usePipelines(type?: PipelineType) {
  return useQuery({
    queryKey: ["crm-pipelines", type],
    queryFn: () => getPipelinesUseCase.execute(type),
  });
}
