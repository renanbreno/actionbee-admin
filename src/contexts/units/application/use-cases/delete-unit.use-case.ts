import { UnitRepository } from "../../domain/repositories/unit-repository.interface";

export class DeleteUnitUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(id: string): Promise<void> {
    return this.unitRepository.delete(id);
  }
}
