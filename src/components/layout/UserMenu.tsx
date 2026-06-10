import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import { useState } from "react";

import {
  useNavigate,
} from "react-router-dom";

const UserMenu = () => {
  const navigate =
    useNavigate();

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(
      null
    );

  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  return (
    <>
      <IconButton
        onClick={(e) =>
          setAnchorEl(
            e.currentTarget
          )
        }
      >
        <Avatar>
          U
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() =>
          setAnchorEl(null)
        }
      >
        <MenuItem
          onClick={() =>
            navigate(
              "/settings"
            )
          }
        >
          Profile
        </MenuItem>

        <MenuItem
          onClick={logout}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;