// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "manager" | "user";
  status: "active" | "inactive" | "suspended";
  department?: string;
  avatar?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export type TaskStatus = "todo" | "in_progress" | "in_review" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface TaskComment {
  _id: string;
  userId: User | string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  _id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: User | string;
  createdBy: User | string;
  project?: string;
  department?: string;
  tags: string[];
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  comments: TaskComment[];
  isAtRisk: boolean;
  watchedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assignedTo?: string;
  project?: string;
  department?: string;
  tags?: string[];
  dueDate?: string;
  estimatedHours?: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  project?: string;
  tags?: string[];
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export type ActivityAction =
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "user.login"
  | "user.logout"
  | "user.role_changed"
  | "task.created"
  | "task.updated"
  | "task.deleted"
  | "task.assigned"
  | "task.status_changed"
  | "task.comment_added"
  | "task.watched";

export interface ActivityChange {
  from: any;
  to: any;
}

export interface ActivityLog {
  id: string;
  userId: User;
  action: ActivityAction;
  resourceType: "user" | "task";
  resourceId: string;
  resourceTitle: string;
  changes?: Record<string, ActivityChange>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

// ─── Notification ──────────────────────────────────────────────────────────────

export type NotificationType =
  | "task_assigned"
  | "task_status_changed"
  | "task_comment"
  | "task_due_soon"
  | "task_overdue"
  | "task_at_risk"
  | "user_mentioned";

export interface Notification {
  id: string;
  toUserId: string;
  fromUserId?: User;
  type: NotificationType;
  title: string;
  message: string;
  resourceType: "task" | "user";
  resourceId: string;
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}
export interface UserFilterPayload {
  page?: number;
  limit?: number;

  filterOptions?: {
    role?: string;
    status?: string;
    department?: string;
  };

  searchFields?: string[];
  searchValues?: string[];
}

export interface TaskFilterPayload {
  page?: number;
  limit?: number;

  filterOptions?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    department?: string;
    project?: string;
    isAtRisk?: boolean;
  };

  searchFields?: string[];
  searchValues?: string[];
}

// ─── API ───────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

export interface DashboardData {
  overview: {
    totalTasks: number;
    completionRate: number;
    overdueCount: number;
    atRiskCount: number;
    activeUsers?: number;
  };
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
  atRiskTasks: Task[];
  recentActivity: ActivityLog[];
}