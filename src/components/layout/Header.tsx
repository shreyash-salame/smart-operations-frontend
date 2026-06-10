import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

import UserMenu from "./UserMenu";
import NotificationMenu from "./NotificationMenu";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1300,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
          }}
        >
          Smart Ops
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          gap={2}
        >
          <NotificationMenu />

          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;