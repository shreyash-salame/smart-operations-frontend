import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#185fa5",
      light: "#378add",
      dark: "#0c447c",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ba7517",
      light: "#ef9f27",
      dark: "#633806",
    },
    success: {
      main: "#3b6d11",
      light: "#639922",
      dark: "#27500a",
    },
    warning: {
      main: "#ba7517",
      light: "#ef9f27",
      dark: "#633806",
    },
    error: {
      main: "#a32d2d",
      light: "#e24b4a",
      dark: "#791f1f",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#666666",
    },
    divider: "rgba(0,0,0,0.08)",
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontSize: "1.5rem", fontWeight: 600 },
    h2: { fontSize: "1.25rem", fontWeight: 600 },
    h3: { fontSize: "1rem", fontWeight: 600 },
    h4: { fontSize: "0.9rem", fontWeight: 600 },
    h5: { fontSize: "0.85rem", fontWeight: 600 },
    h6: { fontSize: "0.8rem", fontWeight: 600 },
    body1: { fontSize: "0.875rem" },
    body2: { fontSize: "0.8125rem" },
    caption: { fontSize: "0.75rem" },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0,0,0,0.06)",
    "0px 1px 4px rgba(0,0,0,0.08)",
    "0px 2px 8px rgba(0,0,0,0.08)",
    "0px 4px 12px rgba(0,0,0,0.1)",
    ...Array(20).fill("none"),
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
          fontSize: "0.8125rem",
        },
        sizeSmall: { padding: "4px 12px" },
        sizeMedium: { padding: "6px 16px" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "0.5px solid rgba(0,0,0,0.08)",
          boxShadow: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          color: "#666",
          backgroundColor: "#fafafa",
          borderBottom: "0.5px solid rgba(0,0,0,0.08)",
          padding: "10px 14px",
        },
        body: {
          fontSize: "0.8125rem",
          padding: "10px 14px",
          borderBottom: "0.5px solid rgba(0,0,0,0.06)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          height: 22,
          fontSize: "0.7rem",
          fontWeight: 500,
        },
        label: { padding: "0 8px" },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: "0.8125rem" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: "rgba(0,0,0,0.12)" },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "1px 8px",
          padding: "8px 12px",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: "0.75rem" },
      },
    },
  },
});

export default theme;