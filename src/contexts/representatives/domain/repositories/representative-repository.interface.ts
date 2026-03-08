import { Representative } from "../entities/representative";

export interface CreateRepresentativeParams {
  name: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  phone: string;
}

export interface UpdateRepresentativeParams {
  name?: string;
  email?: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
}

export interface RepresentativeRepository {
  getAll(name?: string): Promise<Representative[]>;
  getById(id: string): Promise<Representative>;
  create(params: CreateRepresentativeParams): Promise<Representative>;
  update(id: string, params: UpdateRepresentativeParams): Promise<Representative>;
  delete(id: string): Promise<void>;
}
