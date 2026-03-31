import type { Task, PaginatedTasks } from "../entities/task";
import type { TaskPriority, TaskStatus } from "../enums";

export interface CreateTaskDTO {
  title: string;
  type: string;
  description?: string;
  dealId?: string;
  customerId?: string;
  assignedAdminId?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedAdminId?: string;
}

export interface TaskFilters {
  assignedAdminId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dealId?: string;
  customerId?: string;
  dueDateBefore?: string;
}

export interface ICrmTaskRepository {
  getAll(page: number, limit: number, filters?: TaskFilters): Promise<PaginatedTasks>;
  getById(id: string): Promise<Task>;
  create(dto: CreateTaskDTO): Promise<Task>;
  update(id: string, dto: UpdateTaskDTO): Promise<Task>;
  delete(id: string): Promise<void>;
}
