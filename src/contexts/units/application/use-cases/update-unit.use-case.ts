import { UnitRepository } from "../../domain/repositories/unit-repository.interface";
import { UpdateUnitInput } from "../../domain/entities/unit";

export class UpdateUnitUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(
    id: string,
    input: UpdateUnitInput
  ): Promise<ReturnType<typeof this.unitRepository.update>> {
    return this.unitRepository.update(id, input);
  }
}
