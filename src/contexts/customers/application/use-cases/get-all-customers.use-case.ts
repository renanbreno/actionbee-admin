import type { CustomerRepository } from "../../domain/repositories/customer-repository.interface";
import { PaginatedCustomers } from "../../domain/entities/customer";

export class GetAllCustomersUseCase {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedCustomers> {
    return this.repository.getAllPaginated(page, limit, search);
  }
}
