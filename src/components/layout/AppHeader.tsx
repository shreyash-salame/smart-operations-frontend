import {
  AppBar, Toolbar, IconButton, Typography, Badge, Box, Avatar,
  Tooltip, Menu, MenuItem, Divider, ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon, Notifications, AccountCircle, Logout, Settings,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { useGetNotificationsQuery } from "@/store/api/notificationApi";
import { getFullName, getUserInitials } from "@/utils/helpers";

export default function AppHeader() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: notifData } = useGetNotificationsQuery({ seen: false });
  const unreadCount = notifData?.pagination?.totalResults ?? 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "#fff",
        borderBottom: "0.5px solid rgba(0,0,0,0.08)",
        color: "text.primary",
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: "56px !important" }}>
        <IconButton size="small" onClick={() => dispatch(toggleSidebar())}>
          <MenuIcon fontSize="small" />
        </IconButton>

        <Typography variant="h2" sx={{ flex: 1, color: "text.secondary", fontWeight: 400 }} noWrap>
          {/* Breadcrumb can go here */}
        </Typography>

        <Tooltip title="Notifications">
          <IconButton size="small" onClick={() => navigate("/notifications")}>
            <Badge badgeContent={unreadCount > 0 ? unreadCount : undefined} color="error" max={99}>
              <Notifications fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title={getFullName(user ?? undefined)}>
          <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 28, height: 28, background: "#185fa5", fontSize: "0.7rem" }}>
              {user ? getUserInitials(user) : <AccountCircle fontSize="small" />}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{ elevation: 2, sx: { mt: 0.5, minWidth: 180 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" fontWeight={600}>{getFullName(user ?? undefined)}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { navigate("/profile"); setAnchorEl(null); }}>
            <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate("/profile?tab=security"); setAnchorEl(null); }}>
            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <ListItemIcon><Logout fontSize="small" sx={{ color: "error.main" }} /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}