import type { ICrmInteractionRepository, InteractionFilters } from "../../domain/repositories/crm-interaction-repository.interface";

export class GetInteractionsUseCase {
  constructor(private readonly repo: ICrmInteractionRepository) {}
  execute(page: number, limit: number, filters?: InteractionFilters) {
    return this.repo.getAll(page, limit, filters);
  }
}
