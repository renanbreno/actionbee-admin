import type { ICrmPipelineRepository } from "../../domain/repositories/crm-pipeline-repository.interface";

export class GetPipelineByIdUseCase {
  constructor(private readonly repo: ICrmPipelineRepository) {}
  execute(id: string) {
    return this.repo.getById(id);
  }
}
