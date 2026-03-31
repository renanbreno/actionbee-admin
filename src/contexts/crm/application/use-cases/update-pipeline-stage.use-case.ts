import type { ICrmPipelineRepository, UpdateStageDTO } from "../../domain/repositories/crm-pipeline-repository.interface";

export class UpdatePipelineStageUseCase {
  constructor(private readonly repo: ICrmPipelineRepository) {}
  execute(pipelineId: string, stageId: string, dto: UpdateStageDTO) {
    return this.repo.updateStage(pipelineId, stageId, dto);
  }
}
