import type { CustomerRepository } from "../../domain/repositories/customer-repository.interface";
import type { CreateCustomerDTO } from "../../domain/repositories/customer-repository.interface";
import { Customer } from "../../domain/entities/customer";

export class CreateCustomerUseCase {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(data: CreateCustomerDTO): Promise<Customer> {
    return this.repository.create(data);
  }
}
