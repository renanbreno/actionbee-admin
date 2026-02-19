import type { CustomerRepository } from "../../domain/repositories/customer-repository.interface";
import { Customer } from "../../domain/entities/customer";

export class GetCustomerByIdUseCase {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(id: string): Promise<Customer> {
    return this.repository.getById(id);
  }
}
