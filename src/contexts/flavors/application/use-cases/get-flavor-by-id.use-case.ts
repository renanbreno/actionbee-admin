import { FlavorRepository } from "../../domain/repositories/flavor-repository.interface";
import { Flavor } from "../../domain/entities/flavor";

export class GetFlavorByIdUseCase {
  constructor(private readonly flavorRepository: FlavorRepository) {}

  async execute(id: string): Promise<Flavor> {
    return this.flavorRepository.getById(id);
  }
}
