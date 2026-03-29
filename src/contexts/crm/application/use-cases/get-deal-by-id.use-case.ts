import type { ICrmDealRepository } from "../../domain/repositories/crm-deal-repository.interface";

export class GetDealByIdUseCase {
  constructor(private readonly repo: ICrmDealRepository) {}
  execute(id: string) {
    return this.repo.getById(id);
  }
}
