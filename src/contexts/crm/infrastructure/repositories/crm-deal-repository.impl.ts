import { crmApiClient } from "../api/crm-api.client";
import type {
  ICrmDealRepository,
  CreateDealDTO,
  UpdateDealDTO,
  MoveDealStageDTO,
  DealFilters,
} from "../../domain/repositories/crm-deal-repository.interface";

export class CrmDealRepositoryImpl implements ICrmDealRepository {
  getAll(page: number, limit: number, filters?: DealFilters) { return crmApiClient.getDeals(page, limit, filters); }
  getById(id: string) { return crmApiClient.getDealById(id); }
  create(dto: CreateDealDTO) { return crmApiClient.createDeal(dto); }
  update(id: string, dto: UpdateDealDTO) { return crmApiClient.updateDeal(id, dto); }
  moveStage(id: string, dto: MoveDealStageDTO) { return crmApiClient.moveDealStage(id, dto); }
  delete(id: string) { return crmApiClient.deleteDeal(id); }
}
