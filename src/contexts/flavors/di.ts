import { FlavorRepositoryImpl } from "./infrastructure/repositories/flavor-repository.impl";
import { GetAllFlavorsUseCase } from "./application/use-cases/get-all-flavors.use-case";
import { GetFlavorByIdUseCase } from "./application/use-cases/get-flavor-by-id.use-case";
import { CreateFlavorUseCase } from "./application/use-cases/create-flavor.use-case";
import { UpdateFlavorUseCase } from "./application/use-cases/update-flavor.use-case";
import { DeleteFlavorUseCase } from "./application/use-cases/delete-flavor.use-case";

const flavorRepository = new FlavorRepositoryImpl();

export const getAllFlavorsUseCase = new GetAllFlavorsUseCase(flavorRepository);
export const getFlavorByIdUseCase = new GetFlavorByIdUseCase(flavorRepository);
export const createFlavorUseCase = new CreateFlavorUseCase(flavorRepository);
export const updateFlavorUseCase = new UpdateFlavorUseCase(flavorRepository);
export const deleteFlavorUseCase = new DeleteFlavorUseCase(flavorRepository);
