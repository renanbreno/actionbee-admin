import type { ICrmPipelineRepository, AddStageDTO } from "../../domain/repositories/crm-pipeline-repository.interface";

export class AddPipelineStageUseCase {
  constructor(private readonly repo: ICrmPipelineRepository) {}
  execute(pipelineId: string, dto: AddStageDTO) {
    return this.repo.addStage(pipelineId, dto);
  }
}
