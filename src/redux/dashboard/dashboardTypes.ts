export interface DashboardOverview {
  totalTasks: number;
  completionRate: number;
  overdueCount: number;
  atRiskCount: number;
  activeUsers: number;
}

export interface Activity {
  _id: string;
  action: string;
  resourceType: string;
  resourceTitle: string;
  createdAt: string;

  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export interface DashboardData {
  overview: DashboardOverview;

  tasksByStatus: {
    todo: number;
    in_progress: number;
    in_review: number;
    done: number;
    cancelled: number;
  };

  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };

  atRiskTasks: any[];

  recentActivity: Activity[];
}

export interface DashboardState {
  data: any;
  teamInsights: any;
  loading: boolean;
  error: string | null;
}

export interface TaskByUser {
  userId: string;
  name: string;
  email: string;

  total: number;
  done: number;
  inProgress: number;
  overdue: number;

  completionRate: number;
}

export interface TaskByDepartment {
  _id: string | null;

  total: number;
  done: number;
}

export interface TeamInsights {
  tasksByUser: TaskByUser[];

  tasksByDepartment: TaskByDepartment[];

  completionTrend: any[];
}