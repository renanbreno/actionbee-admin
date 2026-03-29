import type { ICrmDealRepository, MoveDealStageDTO } from "../../domain/repositories/crm-deal-repository.interface";

export class MoveDealStageUseCase {
  constructor(private readonly repo: ICrmDealRepository) {}
  execute(id: string, dto: MoveDealStageDTO) {
    return this.repo.moveStage(id, dto);
  }
}
