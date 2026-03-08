import { CustomerRepository, CreateCustomerDTO, UpdateCustomerDTO, PurchaseStatus, CustomerTypeFilter } from "../../domain/repositories/customer-repository.interface";
import { customersApiClient } from "../api/customers-api.client";
import { Customer, PaginatedCustomers } from "../../domain/entities/customer";

export class CustomerRepositoryImpl implements CustomerRepository {
  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
    purchaseStatus?: PurchaseStatus,
    customerType?: CustomerTypeFilter
  ): Promise<PaginatedCustomers> {
    return customersApiClient.getAllPaginated(page, limit, search, purchaseStatus, customerType);
  }

  async getById(id: string): Promise<Customer> {
    return customersApiClient.getById(id);
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    return customersApiClient.create(data);
  }

  async update(id: string, data: UpdateCustomerDTO): Promise<Customer> {
    return customersApiClient.update(id, data);
  }
}
