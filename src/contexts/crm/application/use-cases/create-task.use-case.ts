import type { ICrmTaskRepository, CreateTaskDTO } from "../../domain/repositories/crm-task-repository.interface";

export class CreateTaskUseCase {
  constructor(private readonly repo: ICrmTaskRepository) {}
  execute(dto: CreateTaskDTO) {
    return this.repo.create(dto);
  }
}
