import type { ICrmInteractionRepository } from "../../domain/repositories/crm-interaction-repository.interface";

export class DeleteInteractionUseCase {
  constructor(private readonly repo: ICrmInteractionRepository) {}
  execute(id: string) {
    return this.repo.delete(id);
  }
}
