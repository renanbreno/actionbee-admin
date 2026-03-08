import { RepresentativeCustomer } from "../../domain/entities/representative";
import { RepresentativeRepository } from "../../domain/repositories/representative-repository.interface";

export class GetRepresentativeCustomersUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(representativeId: string): Promise<RepresentativeCustomer[]> {
    return this.repository.getCustomers(representativeId);
  }
}
