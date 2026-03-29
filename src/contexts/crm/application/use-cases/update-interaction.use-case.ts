import type { ICrmInteractionRepository, UpdateInteractionDTO } from "../../domain/repositories/crm-interaction-repository.interface";

export class UpdateInteractionUseCase {
  constructor(private readonly repo: ICrmInteractionRepository) {}
  execute(id: string, dto: UpdateInteractionDTO) {
    return this.repo.update(id, dto);
  }
}
