import { FlavorRepository } from "../../domain/repositories/flavor-repository.interface";
import { Flavor } from "../../domain/entities/flavor";

export class GetAllFlavorsUseCase {
  constructor(private readonly flavorRepository: FlavorRepository) {}

  async execute(): Promise<Flavor[]> {
    return this.flavorRepository.getAll();
  }
}
