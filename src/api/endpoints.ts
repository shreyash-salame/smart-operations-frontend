export const API = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    profile: "/auth/profile",
    changePassword:
      "/auth/change-password",
  },

  users: {
    create: "/users",
    list: "/users/list",

    get: (id: string) =>
      `/users/${id}`,

    update: (id: string) =>
      `/users/${id}`,

    delete: (id: string) =>
      `/users/${id}`,

    role: (id: string) =>
      `/users/${id}/role`,
  },

  tasks: {
    create: "/tasks",

    list: "/tasks/list",

    get: (id: string) =>
      `/tasks/${id}`,

    update: (id: string) =>
      `/tasks/${id}`,

    delete: (id: string) =>
      `/tasks/${id}`,

    status: (id: string) =>
      `/tasks/${id}/status`,

    assign: (id: string) =>
      `/tasks/${id}/assign`,

    comments: (id: string) =>
      `/tasks/${id}/comments`,
  },

  dashboard: {
    summary: "/dashboard",

    teamInsights:
      "/dashboard/team-insights",
  },

  notifications: {
    list: "/notifications",

    markSeen:
      "/notifications/seen",

    markAllSeen:
      "/notifications/seen/all",
  },

  activity: {
    list: "/activity",

    resource: (
      resourceType: string,
      resourceId: string
    ) =>
      `/activity/${resourceType}/${resourceId}`,
  },
};