import type { ICrmPipelineRepository } from "../../domain/repositories/crm-pipeline-repository.interface";

export class DeletePipelineUseCase {
  constructor(private readonly repo: ICrmPipelineRepository) {}
  execute(id: string) {
    return this.repo.delete(id);
  }
}
