import type { TaskStatus, TaskPriority, User } from "@/types";

// ─── Task helpers ─────────────────────────────────────────────────────────────

export const statusColor: Record<TaskStatus, "default" | "warning" | "info" | "success" | "error"> = {
  todo: "default",
  in_progress: "warning",
  in_review: "info",
  done: "success",
  cancelled: "error",
};

export const statusLabel: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
  cancelled: "Cancelled",
};

export const priorityColor: Record<TaskPriority, string> = {
  low: "#4caf50",
  medium: "#ff9800",
  high: "#f44336",
  critical: "#9c27b0",
};

export const priorityBgColor: Record<TaskPriority, string> = {
  low: "#e8f5e9",
  medium: "#fff3e0",
  high: "#ffebee",
  critical: "#f3e5f5",
};

// ─── User helpers ─────────────────────────────────────────────────────────────

export const getFullName = (user: User | string | undefined | null): string => {
  if (!user || typeof user === "string") return "Unknown";
  const first = user.firstName?.trim() ?? "";
  const last = user.lastName?.trim() ?? "";
  return `${first} ${last}`.trim() || "Unknown";
};

export const getUserInitials = (user: User | string | undefined | null): string => {
  if (!user || typeof user === "string") return "?";
  const first = user.firstName?.trim() ?? "";
  const last = user.lastName?.trim() ?? "";
  const a = first.length > 0 ? first[0].toUpperCase() : "";
  const b = last.length > 0 ? last[0].toUpperCase() : "";
  return (a + b) || "?";
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

export const formatDate = (date: string | undefined | null): string => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

export const formatDateTime = (date: string | undefined | null): string => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

export const isOverdue = (dueDate?: string | null): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

// ─── Role helpers ─────────────────────────────────────────────────────────────

export const roleColor: Record<string, string> = {
  admin: "#185fa5",
  manager: "#ba7517",
  user: "#3b6d11",
};

export const roleBgColor: Record<string, string> = {
  admin: "#e3f0fb",
  manager: "#fef3e0",
  user: "#e8f5e9",
};

// import type { TaskStatus, TaskPriority, User } from "@/types";

// // ─── Task helpers ─────────────────────────────────────────────────────────────

// export const statusColor: Record<TaskStatus, "default" | "warning" | "info" | "success" | "error"> = {
//   todo: "default",
//   in_progress: "warning",
//   in_review: "info",
//   done: "success",
//   cancelled: "error",
// };

// export const statusLabel: Record<TaskStatus, string> = {
//   todo: "To Do",
//   in_progress: "In Progress",
//   in_review: "In Review",
//   done: "Done",
//   cancelled: "Cancelled",
// };

// export const priorityColor: Record<TaskPriority, string> = {
//   low: "#4caf50",
//   medium: "#ff9800",
//   high: "#f44336",
//   critical: "#9c27b0",
// };

// export const priorityBgColor: Record<TaskPriority, string> = {
//   low: "#e8f5e9",
//   medium: "#fff3e0",
//   high: "#ffebee",
//   critical: "#f3e5f5",
// };

// // ─── User helpers ─────────────────────────────────────────────────────────────

// export const getFullName = (user: User | string | undefined): string => {
//   if (!user || typeof user === "string") return "Unknown";
//   return `${user.firstName} ${user.lastName}`.trim();
// };

// export const getUserInitials = (user: User | string | undefined): string => {
//   if (!user || typeof user === "string") return "?";
//   return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
// };

// // ─── Date helpers ─────────────────────────────────────────────────────────────

// export const formatDate = (date: string | undefined): string => {
//   if (!date) return "—";
//   return new Date(date).toLocaleDateString("en-IN", {
//     day: "2-digit", month: "short", year: "numeric",
//   });
// };

// export const formatDateTime = (date: string | undefined): string => {
//   if (!date) return "—";
//   return new Date(date).toLocaleString("en-IN", {
//     day: "2-digit", month: "short", year: "numeric",
//     hour: "2-digit", minute: "2-digit",
//   });
// };

// export const isOverdue = (dueDate?: string): boolean => {
//   if (!dueDate) return false;
//   return new Date(dueDate) < new Date();
// };

// // ─── Role helpers ─────────────────────────────────────────────────────────────

// export const roleColor: Record<string, string> = {
//   admin: "#185fa5",
//   manager: "#ba7517",
//   user: "#3b6d11",
// };

// export const roleBgColor: Record<string, string> = {
//   admin: "#e3f0fb",
//   manager: "#fef3e0",
//   user: "#e8f5e9",
// };