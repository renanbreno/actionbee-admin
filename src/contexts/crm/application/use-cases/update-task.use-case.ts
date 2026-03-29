import type { ICrmTaskRepository, UpdateTaskDTO } from "../../domain/repositories/crm-task-repository.interface";

export class UpdateTaskUseCase {
  constructor(private readonly repo: ICrmTaskRepository) {}
  execute(id: string, dto: UpdateTaskDTO) {
    return this.repo.update(id, dto);
  }
}
