import { Unit } from "../../domain/entities/unit";

export interface CreateUnitDto {
  acronym: string;
  name: string;
}

export type CreateUnitOutputDto = Unit;
