import { UnitRepository } from "../../domain/repositories/unit-repository.interface";
import { Unit } from "../../domain/entities/unit";

export class GetActiveUnitsUseCase {
  constructor(private readonly unitRepository: UnitRepository) {}

  async execute(): Promise<Unit[]> {
    return this.unitRepository.getActive();
  }
}
