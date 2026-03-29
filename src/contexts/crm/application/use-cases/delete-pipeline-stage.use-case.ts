import type { ICrmPipelineRepository } from "../../domain/repositories/crm-pipeline-repository.interface";

export class DeletePipelineStageUseCase {
  constructor(private readonly repo: ICrmPipelineRepository) {}
  execute(pipelineId: string, stageId: string) {
    return this.repo.deleteStage(pipelineId, stageId);
  }
}
