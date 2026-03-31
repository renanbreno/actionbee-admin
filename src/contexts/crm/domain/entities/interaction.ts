import type { InteractionType } from "../enums";

export interface Interaction {
  id: string;
  customerId: string;
  customerName: string;
  dealId?: string | null;
  dealTitle?: string | null;
  type: InteractionType;
  subject?: string | null;
  description: string;
  occurredAt: string;
  createdByAdminId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedInteractions {
  items: Interaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
