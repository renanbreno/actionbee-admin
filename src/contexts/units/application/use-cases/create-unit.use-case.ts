import { UnitRepository } from "../../domain/repositories/unit-repository.interface";
import { CreateUnitInput } from "../../domain/entities/unit";

export class CreateUnitUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(input: CreateUnitInput): Promise<ReturnType<typeof this.unitRepository.create>> {
    return this.unitRepository.create(input);
  }
}
