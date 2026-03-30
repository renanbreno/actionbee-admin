import type { Interaction, PaginatedInteractions } from "../entities/interaction";

export interface CreateInteractionDTO {
  customerId: string;
  type: string;
  description: string;
  dealId?: string;
  subject?: string;
  occurredAt?: string;
  createdByAdminId?: string;
}

export interface UpdateInteractionDTO {
  type?: string;
  subject?: string;
  description?: string;
  occurredAt?: string;
}

export interface InteractionFilters {
  customerId?: string;
  dealId?: string;
  type?: string;
  occurredAtFrom?: string;
  occurredAtTo?: string;
}

export interface ICrmInteractionRepository {
  getAll(page: number, limit: number, filters?: InteractionFilters): Promise<PaginatedInteractions>;
  getById(id: string): Promise<Interaction>;
  create(dto: CreateInteractionDTO): Promise<Interaction>;
  update(id: string, dto: UpdateInteractionDTO): Promise<Interaction>;
  delete(id: string): Promise<void>;
}
