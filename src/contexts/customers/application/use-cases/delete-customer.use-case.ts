import { CustomerRepository } from "../../domain/repositories/customer-repository.interface";

export class DeleteCustomerUseCase {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
