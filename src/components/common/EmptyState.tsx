import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <Box
      sx={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", py: 8, gap: 1, color: "text.secondary",
      }}
    >
      {icon && (
        <Box sx={{ fontSize: 48, opacity: 0.3, mb: 1, "& svg": { fontSize: "inherit" } }}>
          {icon}
        </Box>
      )}
      <Typography variant="h3" color="text.primary">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={320}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
}