import { Task } from "../../types/index";

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  

  loading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  totalResults: number;
  totalPages: number;
  page: number;
  limit: number;

  error: string | null;
}

export interface TaskListPayload {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: string;
  dueDate?: string;
  assignedTo?: string;
}

export interface UpdateTaskPayload {
  id: string;
  data: Partial<CreateTaskPayload>;
}