import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import GroupIcon from "@mui/icons-material/Group";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelineIcon from "@mui/icons-material/Timeline";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const drawerWidth = 250;

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: <DashboardIcon />,
  },
  {
    label: "Tasks",
    path: "/tasks",
    icon: <TaskIcon />,
  },
  {
    label: "Team",
    path: "/team",
    icon: <GroupIcon />,
  },
  {
    label: "Activity",
    path: "/activity",
    icon: <TimelineIcon />,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: <NotificationsIcon />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <SettingsIcon />,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={
              location.pathname ===
              item.path
            }
            onClick={() =>
              navigate(item.path)
            }
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.label}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;