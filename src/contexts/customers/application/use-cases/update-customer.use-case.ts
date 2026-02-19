import type { CustomerRepository } from "../../domain/repositories/customer-repository.interface";
import type { UpdateCustomerDTO } from "../../domain/repositories/customer-repository.interface";
import { Customer } from "../../domain/entities/customer";

export class UpdateCustomerUseCase {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(id: string, data: UpdateCustomerDTO): Promise<Customer> {
    return this.repository.update(id, data);
  }
}
