import { Unit, CreateUnitInput, UpdateUnitInput } from "../entities/unit";

export interface UnitRepository {
  getAll(): Promise<Unit[]>;
  getActive(): Promise<Unit[]>;
  getById(id: string): Promise<Unit>;
  getByAcronym(acronym: string): Promise<Unit>;
  create(input: CreateUnitInput): Promise<Unit>;
  update(id: string, input: UpdateUnitInput): Promise<Unit>;
  delete(id: string): Promise<void>;
}
