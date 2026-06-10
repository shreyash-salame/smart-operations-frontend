import {
  Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Tooltip, Avatar,
} from "@mui/material";
import {
  Dashboard, Assignment, People, Notifications, History,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { getUserInitials, getFullName } from "@/utils/helpers";

const DRAWER_WIDTH = 240;
const MINI_WIDTH = 64;

const navItems = [
  { label: "Dashboard",     icon: <Dashboard />,     path: "/dashboard" },
  { label: "Tasks",         icon: <Assignment />,    path: "/tasks" },
  { label: "Team",          icon: <People />,        path: "/team",       adminOnly: true },
  { label: "Activity",      icon: <History />,       path: "/activity",   adminOnly: true },
  { label: "Notifications", icon: <Notifications />, path: "/notifications" },
];

interface Props { open: boolean; }

export default function AppSidebar({ open }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === "admin" || user?.role === "manager"
  );

  const initials = user ? getUserInitials(user) : "?";
  const fullName = user ? getFullName(user) : "";
  const displayName = fullName && fullName !== "Unknown" ? fullName : user?.email ?? "";

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : MINI_WIDTH,
        flexShrink: 0,
        transition: "width 0.2s ease",
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : MINI_WIDTH,
          overflow: "hidden",
          transition: "width 0.2s ease",
          background: "#fff",
          borderRight: "0.5px solid rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: open ? 2.5 : 1, py: 2, display: "flex", alignItems: "center", gap: 1.5, minHeight: 56 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: 1.5,
          background: "linear-gradient(135deg, #185fa5, #378add)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.8rem" }}>SO</Typography>
        </Box>
        {open && (
          <Typography variant="h2" sx={{ color: "#185fa5", whiteSpace: "nowrap", overflow: "hidden" }}>
            SmartOps
          </Typography>
        )}
      </Box>

      <Divider sx={{ mx: open ? 1.5 : 0.5 }} />

      {/* Nav */}
      <List sx={{ flex: 1, pt: 1 }}>
        {visibleItems.map((item) => {
          const active = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
          return (
            <Tooltip key={item.path} title={!open ? item.label : ""} placement="right">
              <ListItemButton
                selected={active}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1, mb: 0.25, borderRadius: 1.5, minHeight: 40,
                  justifyContent: open ? "initial" : "center",
                  px: open ? 1.5 : 1.25,
                  "&.Mui-selected": {
                    background: "rgba(24,95,165,0.09)",
                    "& .MuiListItemIcon-root": { color: "#185fa5" },
                    "& .MuiListItemText-primary": { color: "#185fa5", fontWeight: 600 },
                  },
                  "&:hover": { background: "rgba(24,95,165,0.05)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 1.5 : 0, color: active ? "#185fa5" : "#888" }}>
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: "0.8125rem" }} />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ mx: 1.5 }} />

      {/* User strip — no user && guard, always renders */}
      <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1.25, minHeight: 56 }}>
        <Avatar sx={{
          width: 34, height: 34,
          background: "linear-gradient(135deg, #185fa5, #378add)",
          fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
        }}>
          {initials}
        </Avatar>
        {open && (
          <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
            <Typography variant="body2" fontWeight={600} sx={{
              overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap", lineHeight: 1.3,
            }}>
              {displayName || "User"}
            </Typography>
            {user?.role && (
              <Typography variant="caption" sx={{
                color: "text.secondary", textTransform: "capitalize",
                lineHeight: 1.2, display: "block",
              }}>
                {user.role}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

// import {
//   Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText,
//   Typography, Divider, Tooltip, Avatar, Chip,
// } from "@mui/material";
// import {
//   Dashboard, Assignment, People, Notifications,
//   AccountCircle, History,
// } from "@mui/icons-material";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAppSelector } from "@/store";
// import { getUserInitials, getFullName } from "@/utils/helpers";

// const DRAWER_WIDTH = 240;
// const MINI_WIDTH = 64;

// const navItems = [
//   { label: "Dashboard",      icon: <Dashboard />,     path: "/dashboard" },
//   { label: "Tasks",          icon: <Assignment />,    path: "/tasks" },
//   { label: "Team",           icon: <People />,         path: "/team",          adminOnly: true },
//   { label: "Activity",       icon: <History />,        path: "/activity",      adminOnly: true },
//   { label: "Notifications",  icon: <Notifications />, path: "/notifications" },
// ];

// interface Props { open: boolean; }

// export default function AppSidebar({ open }: Props) {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();
//   const { user } = useAppSelector((s) => s.auth);

//   const visibleItems = navItems.filter(
//     (item) => !item.adminOnly || user?.role === "admin" || user?.role === "manager"
//   );
//   console.log("AUTH USER:", user);

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: open ? DRAWER_WIDTH : MINI_WIDTH,
//         flexShrink: 0,
//         transition: "width 0.2s ease",
//         "& .MuiDrawer-paper": {
//           width: open ? DRAWER_WIDTH : MINI_WIDTH,
//           overflow: "hidden",
//           transition: "width 0.2s ease",
//           background: "#fff",
//           borderRight: "0.5px solid rgba(0,0,0,0.08)",
//           display: "flex",
//           flexDirection: "column",
//         },
//       }}
//     >
//       {/* Logo */}
//       <Box sx={{ px: open ? 2.5 : 1, py: 2, display: "flex", alignItems: "center", gap: 1.5, minHeight: 56 }}>
//         <Box sx={{
//           width: 32, height: 32, borderRadius: 1.5,
//           background: "linear-gradient(135deg, #185fa5, #378add)",
//           display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//         }}>
//           <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.8rem" }}>SO</Typography>
//         </Box>
//         {open && (
//           <Typography variant="h2" sx={{ color: "#185fa5", whiteSpace: "nowrap", overflow: "hidden" }}>
//             SmartOps
//           </Typography>
//         )}
//       </Box>

//       <Divider sx={{ mx: open ? 1.5 : 0.5 }} />

//       {/* Nav */}
//       <List sx={{ flex: 1, pt: 1, px: open ? 0 : 0.5 }}>
//         {visibleItems.map((item) => {
//           const active = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
//           return (
//             <Tooltip key={item.path} title={!open ? item.label : ""} placement="right">
//               <ListItemButton
//                 selected={active}
//                 onClick={() => navigate(item.path)}
//                 sx={{
//                   mx: open ? 1 : 0.5,
//                   mb: 0.25,
//                   borderRadius: 1.5,
//                   justifyContent: open ? "initial" : "center",
//                   px: open ? 1.5 : 1,
//                   "&.Mui-selected": {
//                     background: "rgba(24,95,165,0.09)",
//                     "& .MuiListItemIcon-root": { color: "#185fa5" },
//                     "& .MuiListItemText-primary": { color: "#185fa5", fontWeight: 600 },
//                   },
//                   "&:hover": { background: "rgba(24,95,165,0.05)" },
//                 }}
//               >
//                 <ListItemIcon sx={{ minWidth: 0, mr: open ? 1.5 : 0, color: active ? "#185fa5" : "#666" }}>
//                   {item.icon}
//                 </ListItemIcon>
//                 {open && <ListItemText primary={item.label} />}
//               </ListItemButton>
//             </Tooltip>
//           );
//         })}
//       </List>

//       <Divider sx={{ mx: open ? 1.5 : 0.5 }} />

//       {/* User strip */}
//       <Box sx={{ p: open ? 2 : 1, display: "flex", alignItems: "center", gap: 1.5 }}>
//         <Avatar sx={{ width: 32, height: 32, background: "#185fa5", fontSize: "0.75rem", flexShrink: 0 }}>
//           {user ? getUserInitials(user) : "?"}
//         </Avatar>
//         {open && user && (
//           <Box sx={{ minWidth: 0 }}>
//             <Typography variant="body2" fontWeight={600} noWrap>{getFullName(user)}</Typography>
//             <Chip label={user?.role} size="small" sx={{ height: 16, fontSize: "0.65rem", mt: 0.25 }} />
//           </Box>
//         )}
//       </Box>
//     </Drawer>
//   );
// }