import { UnitRepositoryImpl } from "./infrastructure/repositories/unit-repository.impl";
import { GetUnitsUseCase } from "./application/use-cases/get-units.use-case";
import { GetActiveUnitsUseCase } from "./application/use-cases/get-active-units.use-case";
import { CreateUnitUseCase } from "./application/use-cases/create-unit.use-case";
import { UpdateUnitUseCase } from "./application/use-cases/update-unit.use-case";
import { DeleteUnitUseCase } from "./application/use-cases/delete-unit.use-case";

const unitRepository = new UnitRepositoryImpl();

export const getUnitsUseCase = new GetUnitsUseCase(unitRepository);
export const getActiveUnitsUseCase = new GetActiveUnitsUseCase(unitRepository);
export const createUnitUseCase = new CreateUnitUseCase(unitRepository);
export const updateUnitUseCase = new UpdateUnitUseCase(unitRepository);
export const deleteUnitUseCase = new DeleteUnitUseCase(unitRepository);
