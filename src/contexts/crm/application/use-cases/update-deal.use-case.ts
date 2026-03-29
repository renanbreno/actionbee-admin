import type { ICrmDealRepository, UpdateDealDTO } from "../../domain/repositories/crm-deal-repository.interface";

export class UpdateDealUseCase {
  constructor(private readonly repo: ICrmDealRepository) {}
  execute(id: string, dto: UpdateDealDTO) {
    return this.repo.update(id, dto);
  }
}
