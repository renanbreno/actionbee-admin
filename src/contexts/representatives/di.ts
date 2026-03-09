import { RepresentativeRepositoryImpl } from "./infrastructure/repositories/representative-repository.impl";
import { GetAllRepresentativesUseCase } from "./application/use-cases/get-all-representatives.use-case";
import { CreateRepresentativeUseCase } from "./application/use-cases/create-representative.use-case";
import { UpdateRepresentativeUseCase } from "./application/use-cases/update-representative.use-case";
import { DeleteRepresentativeUseCase } from "./application/use-cases/delete-representative.use-case";
import { AssociateCustomerUseCase } from "./application/use-cases/associate-customer.use-case";
import { DissociateCustomerUseCase } from "./application/use-cases/dissociate-customer.use-case";
import { GetRepresentativeCustomersUseCase } from "./application/use-cases/get-representative-customers.use-case";
import { GetSalesReportUseCase } from "./application/use-cases/get-sales-report.use-case";

const representativeRepository = new RepresentativeRepositoryImpl();

export const getAllRepresentativesUseCase = new GetAllRepresentativesUseCase(
  representativeRepository,
);
export const createRepresentativeUseCase = new CreateRepresentativeUseCase(
  representativeRepository,
);
export const updateRepresentativeUseCase = new UpdateRepresentativeUseCase(
  representativeRepository,
);
export const deleteRepresentativeUseCase = new DeleteRepresentativeUseCase(
  representativeRepository,
);
export const associateCustomerUseCase = new AssociateCustomerUseCase(
  representativeRepository,
);
export const dissociateCustomerUseCase = new DissociateCustomerUseCase(
  representativeRepository,
);
export const getRepresentativeCustomersUseCase = new GetRepresentativeCustomersUseCase(
  representativeRepository,
);
export const getSalesReportUseCase = new GetSalesReportUseCase(
  representativeRepository,
);
