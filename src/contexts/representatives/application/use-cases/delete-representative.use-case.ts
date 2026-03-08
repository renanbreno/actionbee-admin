import { RepresentativeRepository } from "../../domain/repositories/representative-repository.interface";

export class DeleteRepresentativeUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
