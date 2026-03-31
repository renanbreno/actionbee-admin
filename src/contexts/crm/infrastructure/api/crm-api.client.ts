import { apiFetch } from "@/shared/infrastructure/api/api-client";
import type { Pipeline } from "../../domain/entities/pipeline";
import type { Deal, PaginatedDeals } from "../../domain/entities/deal";
import type { Interaction, PaginatedInteractions } from "../../domain/entities/interaction";
import type { Task, PaginatedTasks } from "../../domain/entities/task";
import type { PipelineType } from "../../domain/enums";
import type {
  CreatePipelineDTO,
  UpdatePipelineDTO,
  AddStageDTO,
  UpdateStageDTO,
} from "../../domain/repositories/crm-pipeline-repository.interface";
import type {
  CreateDealDTO,
  UpdateDealDTO,
  MoveDealStageDTO,
  DealFilters,
} from "../../domain/repositories/crm-deal-repository.interface";
import type {
  CreateInteractionDTO,
  UpdateInteractionDTO,
  InteractionFilters,
} from "../../domain/repositories/crm-interaction-repository.interface";
import type {
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilters,
} from "../../domain/repositories/crm-task-repository.interface";

export const crmApiClient = {
  // Pipelines
  getPipelines(type?: PipelineType): Promise<Pipeline[]> {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    const qs = params.toString();
    return apiFetch(`/admin/crm/pipelines${qs ? `?${qs}` : ""}`);
  },

  getPipelineById(id: string): Promise<Pipeline> {
    return apiFetch(`/admin/crm/pipelines/${id}`);
  },

  createPipeline(dto: CreatePipelineDTO): Promise<Pipeline> {
    return apiFetch("/admin/crm/pipelines", { method: "POST", body: JSON.stringify(dto) });
  },

  updatePipeline(id: string, dto: UpdatePipelineDTO): Promise<Pipeline> {
    return apiFetch(`/admin/crm/pipelines/${id}`, { method: "PATCH", body: JSON.stringify(dto) });
  },

  deletePipeline(id: string): Promise<void> {
    return apiFetch(`/admin/crm/pipelines/${id}`, { method: "DELETE" });
  },

  addStage(pipelineId: string, dto: AddStageDTO): Promise<Pipeline> {
    return apiFetch(`/admin/crm/pipelines/${pipelineId}/stages`, { method: "POST", body: JSON.stringify(dto) });
  },

  updateStage(pipelineId: string, stageId: string, dto: UpdateStageDTO): Promise<Pipeline> {
    return apiFetch(`/admin/crm/pipelines/${pipelineId}/stages/${stageId}`, { method: "PATCH", body: JSON.stringify(dto) });
  },

  deleteStage(pipelineId: string, stageId: string): Promise<void> {
    return apiFetch(`/admin/crm/pipelines/${pipelineId}/stages/${stageId}`, { method: "DELETE" });
  },

  // Deals
  getDeals(page: number, limit: number, filters?: DealFilters): Promise<PaginatedDeals> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.search) params.set("search", filters.search);
    if (filters?.pipelineId) params.set("pipelineId", filters.pipelineId);
    if (filters?.stageId) params.set("stageId", filters.stageId);
    if (filters?.customerId) params.set("customerId", filters.customerId);
    if (filters?.assignedAdminId) params.set("assignedAdminId", filters.assignedAdminId);
    return apiFetch(`/admin/crm/deals?${params}`);
  },

  getDealById(id: string): Promise<Deal> {
    return apiFetch(`/admin/crm/deals/${id}`);
  },

  createDeal(dto: CreateDealDTO): Promise<Deal> {
    return apiFetch("/admin/crm/deals", { method: "POST", body: JSON.stringify(dto) });
  },

  updateDeal(id: string, dto: UpdateDealDTO): Promise<Deal> {
    return apiFetch(`/admin/crm/deals/${id}`, { method: "PATCH", body: JSON.stringify(dto) });
  },

  moveDealStage(id: string, dto: MoveDealStageDTO): Promise<Deal> {
    return apiFetch(`/admin/crm/deals/${id}/stage`, { method: "PATCH", body: JSON.stringify(dto) });
  },

  deleteDeal(id: string): Promise<void> {
    return apiFetch(`/admin/crm/deals/${id}`, { method: "DELETE" });
  },

  // Interactions
  getInteractions(page: number, limit: number, filters?: InteractionFilters): Promise<PaginatedInteractions> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.customerId) params.set("customerId", filters.customerId);
    if (filters?.dealId) params.set("dealId", filters.dealId);
    if (filters?.type) params.set("type", filters.type);
    if (filters?.occurredAtFrom) params.set("occurredAtFrom", filters.occurredAtFrom);
    if (filters?.occurredAtTo) params.set("occurredAtTo", filters.occurredAtTo);
    return apiFetch(`/admin/crm/interactions?${params}`);
  },

  getInteractionById(id: string): Promise<Interaction> {
    return apiFetch(`/admin/crm/interactions/${id}`);
  },

  createInteraction(dto: CreateInteractionDTO): Promise<Interaction> {
    return apiFetch("/admin/crm/interactions", { method: "POST", body: JSON.stringify(dto) });
  },

  updateInteraction(id: string, dto: UpdateInteractionDTO): Promise<Interaction> {
    return apiFetch(`/admin/crm/interactions/${id}`, { method: "PATCH", body: JSON.stringify(dto) });
  },

  deleteInteraction(id: string): Promise<void> {
    return apiFetch(`/admin/crm/interactions/${id}`, { method: "DELETE" });
  },

  // Tasks
  getTasks(page: number, limit: number, filters?: TaskFilters): Promise<PaginatedTasks> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.assignedAdminId) params.set("assignedAdminId", filters.assignedAdminId);
    if (filters?.status) params.set("status", filters.status);
    if (filters?.priority) params.set("priority", filters.priority);
    if (filters?.dealId) params.set("dealId", filters.dealId);
    if (filters?.customerId) params.set("customerId", filters.customerId);
    if (filters?.dueDateBefore) params.set("dueDateBefore", filters.dueDateBefore);
    return apiFetch(`/admin/crm/tasks?${params}`);
  },

  getTaskById(id: string): Promise<Task> {
    return apiFetch(`/admin/crm/tasks/${id}`);
  },

  createTask(dto: CreateTaskDTO): Promise<Task> {
    return apiFetch("/admin/crm/tasks", { method: "POST", body: JSON.stringify(dto) });
  },

  updateTask(id: string, dto: UpdateTaskDTO): Promise<Task> {
    return apiFetch(`/admin/crm/tasks/${id}`, { method: "PATCH", body: JSON.stringify(dto) });
  },

  deleteTask(id: string): Promise<void> {
    return apiFetch(`/admin/crm/tasks/${id}`, { method: "DELETE" });
  },
};
