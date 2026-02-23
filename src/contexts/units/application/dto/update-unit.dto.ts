import { Unit } from "../../domain/entities/unit";

export interface UpdateUnitDto {
  acronym?: string;
  name?: string;
  isActive?: boolean;
}

export type UpdateUnitOutputDto = Unit;
