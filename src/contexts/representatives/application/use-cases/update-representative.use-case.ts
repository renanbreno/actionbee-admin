import { Representative } from "../../domain/entities/representative";
import {
  UpdateRepresentativeParams,
  RepresentativeRepository,
} from "../../domain/repositories/representative-repository.interface";

export class UpdateRepresentativeUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(id: string, params: UpdateRepresentativeParams): Promise<Representative> {
    return this.repository.update(id, params);
  }
}
