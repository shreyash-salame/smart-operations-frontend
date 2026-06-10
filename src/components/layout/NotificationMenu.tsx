import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { useState } from "react";

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(
      null
    );

  return (
    <>
      <IconButton
        color="inherit"
        onClick={(e) =>
          setAnchorEl(
            e.currentTarget
          )
        }
      >
        <Badge
          badgeContent={3}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() =>
          setAnchorEl(null)
        }
      >
        <MenuItem>
          New task assigned
        </MenuItem>

        <MenuItem>
          Task completed
        </MenuItem>

        <MenuItem>
          New comment added
        </MenuItem>
      </Menu>
    </>
  );
};

export default NotificationMenu;