import { TypographyOptions } from "@mui/material/styles/createTypography";

export const typography: TypographyOptions = {
  fontFamily: [
    "Inter",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif",
  ].join(","),

  h1: {
    fontSize: "2rem",
    fontWeight: 700,
  },

  h2: {
    fontSize: "1.75rem",
    fontWeight: 700,
  },

  h3: {
    fontSize: "1.5rem",
    fontWeight: 600,
  },

  h4: {
    fontSize: "1.25rem",
    fontWeight: 600,
  },

  h5: {
    fontSize: "1.125rem",
    fontWeight: 600,
  },

  h6: {
    fontSize: "1rem",
    fontWeight: 600,
  },

  body1: {
    fontSize: "0.95rem",
  },

  body2: {
    fontSize: "0.875rem",
  },

  button: {
    textTransform: "none",
    fontWeight: 600,
  },
};