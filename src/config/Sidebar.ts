import {
  Dashboard,
  Task,
  Group,
  Notifications,
  History,
  Settings,
} from "@mui/icons-material";

export const sidebarItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: Dashboard,
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: Task,
  },
  {
    title: "Users",
    path: "/users",
    icon: Group,
    roles: ["admin", "manager"],
  },
  {
    title: "Team",
    path: "/team",
    icon: Group,
  },
  {
    title: "Activity",
    path: "/activity",
    icon: History,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: Notifications,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];