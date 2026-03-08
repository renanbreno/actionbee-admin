import { RepresentativeRepository } from "../../domain/repositories/representative-repository.interface";
import { RepresentativeCustomer } from "../../domain/entities/representative";

export class AssociateCustomerUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(representativeId: string, customerId: string): Promise<RepresentativeCustomer[]> {
    return this.repository.associateCustomer(representativeId, customerId);
  }
}
