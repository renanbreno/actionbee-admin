import type { ICrmTaskRepository } from "../../domain/repositories/crm-task-repository.interface";

export class DeleteTaskUseCase {
  constructor(private readonly repo: ICrmTaskRepository) {}
  execute(id: string) {
    return this.repo.delete(id);
  }
}
