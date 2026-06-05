import { Flavor } from "../../domain/entities/flavor";
import {
  FlavorRepository,
  CreateFlavorDTO,
  UpdateFlavorDTO,
} from "../../domain/repositories/flavor-repository.interface";
import { flavorsApiClient } from "../api/flavors-api.client";

export class FlavorRepositoryImpl implements FlavorRepository {
  async getAll(): Promise<Flavor[]> {
    return flavorsApiClient.getAll();
  }

  async getById(id: string): Promise<Flavor> {
    return flavorsApiClient.getById(id);
  }

  async create(data: CreateFlavorDTO): Promise<Flavor> {
    return flavorsApiClient.create(data);
  }

  async update(id: string, data: UpdateFlavorDTO): Promise<Flavor> {
    return flavorsApiClient.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return flavorsApiClient.delete(id);
  }
}
