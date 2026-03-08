import { Representative } from "../../domain/entities/representative";
import {
  RepresentativeRepository,
  CreateRepresentativeParams,
  UpdateRepresentativeParams,
} from "../../domain/repositories/representative-repository.interface";
import { representativesApiClient } from "../api/representatives-api.client";

export class RepresentativeRepositoryImpl implements RepresentativeRepository {
  async getAll(name?: string): Promise<Representative[]> {
    return representativesApiClient.getAll(name);
  }

  async getById(id: string): Promise<Representative> {
    return representativesApiClient.getById(id);
  }

  async create(params: CreateRepresentativeParams): Promise<Representative> {
    return representativesApiClient.create(params);
  }

  async update(id: string, params: UpdateRepresentativeParams): Promise<Representative> {
    return representativesApiClient.update(id, params);
  }

  async delete(id: string): Promise<void> {
    return representativesApiClient.delete(id);
  }
}
