import { FlavorRepository, CreateFlavorDTO } from "../../domain/repositories/flavor-repository.interface";
import { Flavor } from "../../domain/entities/flavor";

export class CreateFlavorUseCase {
  constructor(private readonly flavorRepository: FlavorRepository) {}

  async execute(data: CreateFlavorDTO): Promise<Flavor> {
    return this.flavorRepository.create(data);
  }
}
