import type { ICrmPipelineRepository, CreatePipelineDTO } from "../../domain/repositories/crm-pipeline-repository.interface";

export class CreatePipelineUseCase {
  constructor(private readonly repo: ICrmPipelineRepository) {}
  execute(dto: CreatePipelineDTO) {
    return this.repo.create(dto);
  }
}
