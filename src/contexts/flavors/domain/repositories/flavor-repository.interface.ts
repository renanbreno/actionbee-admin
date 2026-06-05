import { Flavor } from "../entities/flavor";

export interface CreateFlavorDTO {
  name: string;
  color?: string;
}

export interface UpdateFlavorDTO {
  name?: string;
  color?: string | null;
  isActive?: boolean;
}

export interface FlavorRepository {
  getAll(): Promise<Flavor[]>;
  getById(id: string): Promise<Flavor>;
  create(data: CreateFlavorDTO): Promise<Flavor>;
  update(id: string, data: UpdateFlavorDTO): Promise<Flavor>;
  delete(id: string): Promise<void>;
}
