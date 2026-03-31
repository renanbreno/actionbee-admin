import type { TaskType, TaskPriority, TaskStatus } from "../enums";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  dealId?: string | null;
  dealTitle?: string | null;
  customerId?: string | null;
  customerName?: string | null;
  assignedAdminId?: string | null;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTasks {
  items: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
