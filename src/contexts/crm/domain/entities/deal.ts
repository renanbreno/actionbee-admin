import type { DealSource } from "../enums";

export interface Deal {
  id: string;
  title: string;
  description?: string | null;
  pipelineId: string;
  pipelineName: string;
  stageId: string;
  stageName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  estimatedValue?: number | null;
  currency: string;
  expectedCloseDate?: string | null;
  closedAt?: string | null;
  lostReason?: string | null;
  source?: DealSource | null;
  assignedAdminId?: string | null;
  interactionsCount: number;
  tasksCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedDeals {
  items: Deal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
