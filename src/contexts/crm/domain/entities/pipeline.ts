import type { PipelineType } from "../enums";

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color?: string | null;
  isWonStage: boolean;
  isLostStage: boolean;
  dealsCount: number;
}

export interface Pipeline {
  id: string;
  name: string;
  type: PipelineType;
  description?: string | null;
  isActive: boolean;
  stages: PipelineStage[];
  totalDeals: number;
  createdAt: string;
  updatedAt: string;
}
