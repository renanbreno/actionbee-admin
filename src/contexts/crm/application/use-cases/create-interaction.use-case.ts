import type { ICrmInteractionRepository, CreateInteractionDTO } from "../../domain/repositories/crm-interaction-repository.interface";

export class CreateInteractionUseCase {
  constructor(private readonly repo: ICrmInteractionRepository) {}
  execute(dto: CreateInteractionDTO) {
    return this.repo.create(dto);
  }
}
