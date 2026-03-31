import type { Deal, PaginatedDeals } from "../entities/deal";

export interface CreateDealDTO {
  title: string;
  pipelineId: string;
  stageId: string;
  customerId: string;
  description?: string;
  estimatedValue?: number;
  expectedCloseDate?: string;
  source?: string;
  assignedAdminId?: string;
}

export interface UpdateDealDTO {
  title?: string;
  description?: string;
  stageId?: string;
  estimatedValue?: number;
  expectedCloseDate?: string;
  lostReason?: string;
  assignedAdminId?: string;
}

export interface MoveDealStageDTO {
  stageId: string;
  lostReason?: string;
}

export interface DealFilters {
  search?: string;
  pipelineId?: string;
  stageId?: string;
  customerId?: string;
  assignedAdminId?: string;
}

export interface ICrmDealRepository {
  getAll(page: number, limit: number, filters?: DealFilters): Promise<PaginatedDeals>;
  getById(id: string): Promise<Deal>;
  create(dto: CreateDealDTO): Promise<Deal>;
  update(id: string, dto: UpdateDealDTO): Promise<Deal>;
  moveStage(id: string, dto: MoveDealStageDTO): Promise<Deal>;
  delete(id: string): Promise<void>;
}
