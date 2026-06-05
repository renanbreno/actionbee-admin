import { FlavorRepository } from "../../domain/repositories/flavor-repository.interface";

export class DeleteFlavorUseCase {
  constructor(private readonly flavorRepository: FlavorRepository) {}

  async execute(id: string): Promise<void> {
    return this.flavorRepository.delete(id);
  }
}
