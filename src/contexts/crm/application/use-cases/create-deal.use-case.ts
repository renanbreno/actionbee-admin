import type { ICrmDealRepository, CreateDealDTO } from "../../domain/repositories/crm-deal-repository.interface";

export class CreateDealUseCase {
  constructor(private readonly repo: ICrmDealRepository) {}
  execute(dto: CreateDealDTO) {
    return this.repo.create(dto);
  }
}
