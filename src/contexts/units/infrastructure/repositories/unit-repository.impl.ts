import { UnitRepository } from "../../domain/repositories/unit-repository.interface";
import { Unit, CreateUnitInput, UpdateUnitInput } from "../../domain/entities/unit";
import { unitsApiClient } from "../api/units-api.client";

export class UnitRepositoryImpl implements UnitRepository {
  async getAll(): Promise<Unit[]> {
    return unitsApiClient.getAll();
  }

  async getActive(): Promise<Unit[]> {
    return unitsApiClient.getActive();
  }

  async getById(id: string): Promise<Unit> {
    return unitsApiClient.getById(id);
  }

  async getByAcronym(acronym: string): Promise<Unit> {
    return unitsApiClient.getByAcronym(acronym);
  }

  async create(input: CreateUnitInput): Promise<Unit> {
    return unitsApiClient.create({
      acronym: input.acronym.toUpperCase(),
      name: input.name,
    });
  }

  async update(id: string, input: UpdateUnitInput): Promise<Unit> {
    const data: Record<string, string | boolean> = {};
    if (input.acronym !== undefined) {
      data.acronym = input.acronym.toUpperCase();
    }
    if (input.name !== undefined) {
      data.name = input.name;
    }
    if (input.isActive !== undefined) {
      data.isActive = input.isActive;
    }
    return unitsApiClient.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return unitsApiClient.delete(id);
  }
}
