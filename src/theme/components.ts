import { Components } from "@mui/material";

export const components: Components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        height: 40,
        boxShadow: "none",
      },

      contained: {
        boxShadow: "none",

        "&:hover": {
          boxShadow: "none",
        },
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        border: "1px solid #E2E8F0",
        boxShadow:
          "0px 2px 8px rgba(15,23,42,0.08)",
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
    },
  },

  MuiTableHead: {
    styleOverrides: {
      root: {
        background: "#F8FAFC",
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 999,
        fontWeight: 600,
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: "#0C447C",
        color: "#FFFFFF",
      },
    },
  },

  MuiTextField: {
    defaultProps: {
      size: "small",
      fullWidth: true,
    },
  },
};