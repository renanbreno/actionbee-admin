import { Representative } from "../../domain/entities/representative";
import { RepresentativeRepository } from "../../domain/repositories/representative-repository.interface";

export class GetAllRepresentativesUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(name?: string): Promise<Representative[]> {
    return this.repository.getAll(name);
  }
}
