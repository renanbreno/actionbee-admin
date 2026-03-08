import { RepresentativeRepositoryImpl } from "./infrastructure/repositories/representative-repository.impl";
import { GetAllRepresentativesUseCase } from "./application/use-cases/get-all-representatives.use-case";
import { CreateRepresentativeUseCase } from "./application/use-cases/create-representative.use-case";
import { UpdateRepresentativeUseCase } from "./application/use-cases/update-representative.use-case";
import { DeleteRepresentativeUseCase } from "./application/use-cases/delete-representative.use-case";

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
