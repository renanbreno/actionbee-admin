"use client";

import { useQuery } from "@tanstack/react-query";
import { getTasksUseCase } from "../../di";
import type { TaskFilters } from "../../domain/repositories/crm-task-repository.interface";

export function useTasks(page = 1, limit = 20, filters?: TaskFilters) {
  return useQuery({
    queryKey: ["crm-tasks", page, limit, filters],
    queryFn: () => getTasksUseCase.execute(page, limit, filters),
  });
}
