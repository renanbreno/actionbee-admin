import { CustomerRepository, CreateCustomerDTO, UpdateCustomerDTO, PurchaseStatus, CustomerTypeFilter, LifecycleStageFilter } from "../../domain/repositories/customer-repository.interface";
import { customersApiClient } from "../api/customers-api.client";
import { Customer, CustomerLifecycleStage, PaginatedCustomers } from "../../domain/entities/customer";

export class CustomerRepositoryImpl implements CustomerRepository {
  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
    purchaseStatus?: PurchaseStatus,
    customerType?: CustomerTypeFilter,
    lifecycleStage?: LifecycleStageFilter
  ): Promise<PaginatedCustomers> {
    return customersApiClient.getAllPaginated(page, limit, search, purchaseStatus, customerType, lifecycleStage);
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

  async delete(id: string): Promise<void> {
    return customersApiClient.delete(id);
  }

  async bulkUpdateLifecycleStage(ids: string[], stage: CustomerLifecycleStage): Promise<void> {
    return customersApiClient.bulkUpdateLifecycleStage(ids, stage);
  }
}
