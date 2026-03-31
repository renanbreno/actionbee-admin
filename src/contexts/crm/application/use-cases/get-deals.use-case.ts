import type { ICrmDealRepository, DealFilters } from "../../domain/repositories/crm-deal-repository.interface";

export class GetDealsUseCase {
  constructor(private readonly repo: ICrmDealRepository) {}
  execute(page: number, limit: number, filters?: DealFilters) {
    return this.repo.getAll(page, limit, filters);
  }
}
