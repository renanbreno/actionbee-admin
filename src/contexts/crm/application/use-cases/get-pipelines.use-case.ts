import type { ICrmPipelineRepository } from "../../domain/repositories/crm-pipeline-repository.interface";
import type { PipelineType } from "../../domain/enums";

export class GetPipelinesUseCase {
  constructor(private readonly repo: ICrmPipelineRepository) {}
  execute(type?: PipelineType) {
    return this.repo.getAll(type);
  }
}
