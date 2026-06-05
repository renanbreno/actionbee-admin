import { FlavorRepository, UpdateFlavorDTO } from "../../domain/repositories/flavor-repository.interface";
import { Flavor } from "../../domain/entities/flavor";

export class UpdateFlavorUseCase {
  constructor(private readonly flavorRepository: FlavorRepository) {}

  async execute(id: string, data: UpdateFlavorDTO): Promise<Flavor> {
    return this.flavorRepository.update(id, data);
  }
}
