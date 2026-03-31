import type { Pipeline } from "../entities/pipeline";
import type { PipelineType } from "../enums";

export interface CreatePipelineDTO {
  name: string;
  type: PipelineType;
  description?: string;
  stages?: { name: string; order: number; color?: string; isWonStage?: boolean; isLostStage?: boolean }[];
}

export interface UpdatePipelineDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface AddStageDTO {
  name: string;
  order: number;
  color?: string;
  isWonStage?: boolean;
  isLostStage?: boolean;
}

export interface UpdateStageDTO {
  name?: string;
  order?: number;
  color?: string;
  isWonStage?: boolean;
  isLostStage?: boolean;
}

export interface ICrmPipelineRepository {
  getAll(type?: PipelineType): Promise<Pipeline[]>;
  getById(id: string): Promise<Pipeline>;
  create(dto: CreatePipelineDTO): Promise<Pipeline>;
  update(id: string, dto: UpdatePipelineDTO): Promise<Pipeline>;
  delete(id: string): Promise<void>;
  addStage(pipelineId: string, dto: AddStageDTO): Promise<Pipeline>;
  updateStage(pipelineId: string, stageId: string, dto: UpdateStageDTO): Promise<Pipeline>;
  deleteStage(pipelineId: string, stageId: string): Promise<void>;
}
