import type { ICrmTaskRepository, TaskFilters } from "../../domain/repositories/crm-task-repository.interface";

export class GetTasksUseCase {
  constructor(private readonly repo: ICrmTaskRepository) {}
  execute(page: number, limit: number, filters?: TaskFilters) {
    return this.repo.getAll(page, limit, filters);
  }
}
