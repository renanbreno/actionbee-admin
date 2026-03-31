import { CustomerRepositoryImpl } from "./infrastructure/repositories/customer-repository.impl";
import { GetAllCustomersUseCase } from "./application/use-cases/get-all-customers.use-case";
import { GetCustomerByIdUseCase } from "./application/use-cases/get-customer-by-id.use-case";
import { CreateCustomerUseCase } from "./application/use-cases/create-customer.use-case";
import { UpdateCustomerUseCase } from "./application/use-cases/update-customer.use-case";
import { DeleteCustomerUseCase } from "./application/use-cases/delete-customer.use-case";
import { BulkUpdateLifecycleStageUseCase } from "./application/use-cases/bulk-update-lifecycle-stage.use-case";

const customerRepository = new CustomerRepositoryImpl();

export const getAllCustomersUseCase = new GetAllCustomersUseCase(customerRepository);
export const getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepository);
export const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
export const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
export const deleteCustomerUseCase = new DeleteCustomerUseCase(customerRepository);
export const bulkUpdateLifecycleStageUseCase = new BulkUpdateLifecycleStageUseCase(customerRepository);
