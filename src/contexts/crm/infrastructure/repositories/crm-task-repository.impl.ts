import { crmApiClient } from "../api/crm-api.client";
import type {
  ICrmTaskRepository,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskFilters,
} from "../../domain/repositories/crm-task-repository.interface";

export class CrmTaskRepositoryImpl implements ICrmTaskRepository {
  getAll(page: number, limit: number, filters?: TaskFilters) { return crmApiClient.getTasks(page, limit, filters); }
  getById(id: string) { return crmApiClient.getTaskById(id); }
  create(dto: CreateTaskDTO) { return crmApiClient.createTask(dto); }
  update(id: string, dto: UpdateTaskDTO) { return crmApiClient.updateTask(id, dto); }
  delete(id: string) { return crmApiClient.deleteTask(id); }
}
