import { crmApiClient } from "../api/crm-api.client";
import type {
  ICrmInteractionRepository,
  CreateInteractionDTO,
  UpdateInteractionDTO,
  InteractionFilters,
} from "../../domain/repositories/crm-interaction-repository.interface";

export class CrmInteractionRepositoryImpl implements ICrmInteractionRepository {
  getAll(page: number, limit: number, filters?: InteractionFilters) { return crmApiClient.getInteractions(page, limit, filters); }
  getById(id: string) { return crmApiClient.getInteractionById(id); }
  create(dto: CreateInteractionDTO) { return crmApiClient.createInteraction(dto); }
  update(id: string, dto: UpdateInteractionDTO) { return crmApiClient.updateInteraction(id, dto); }
  delete(id: string) { return crmApiClient.deleteInteraction(id); }
}
