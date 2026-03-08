import { Representative } from "../../domain/entities/representative";
import {
  CreateRepresentativeParams,
  RepresentativeRepository,
} from "../../domain/repositories/representative-repository.interface";

export class CreateRepresentativeUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(params: CreateRepresentativeParams): Promise<Representative> {
    return this.repository.create(params);
  }
}
