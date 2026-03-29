import type { Interaction, PaginatedInteractions } from "../entities/interaction";
import type { InteractionType } from "../enums";

export interface CreateInteractionDTO {
  customerId: string;
  type: InteractionType;
  description: string;
  dealId?: string;
  subject?: string;
  occurredAt?: string;
  createdByAdminId?: string;
}

export interface UpdateInteractionDTO {
  type?: InteractionType;
  subject?: string;
  description?: string;
  occurredAt?: string;
}

export interface InteractionFilters {
  customerId?: string;
  dealId?: string;
  type?: InteractionType;
}

export interface ICrmInteractionRepository {
  getAll(page: number, limit: number, filters?: InteractionFilters): Promise<PaginatedInteractions>;
  getById(id: string): Promise<Interaction>;
  create(dto: CreateInteractionDTO): Promise<Interaction>;
  update(id: string, dto: UpdateInteractionDTO): Promise<Interaction>;
  delete(id: string): Promise<void>;
}
