import { RepresentativeRepository } from "../../domain/repositories/representative-repository.interface";
import { RepresentativeCustomer } from "../../domain/entities/representative";

export class DissociateCustomerUseCase {
  constructor(private readonly repository: RepresentativeRepository) {}

  async execute(representativeId: string, customerId: string): Promise<RepresentativeCustomer[]> {
    return this.repository.dissociateCustomer(representativeId, customerId);
  }
}
