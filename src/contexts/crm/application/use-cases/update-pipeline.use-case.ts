import type { ICrmPipelineRepository, UpdatePipelineDTO } from "../../domain/repositories/crm-pipeline-repository.interface";

export class UpdatePipelineUseCase {
  constructor(private readonly repo: ICrmPipelineRepository) {}
  execute(id: string, dto: UpdatePipelineDTO) {
    return this.repo.update(id, dto);
  }
}
