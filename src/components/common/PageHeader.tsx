import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Crumb { label: string; path?: string }

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumbs, actions }: Props) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
      <Box>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs sx={{ mb: 0.5 }}>
            {breadcrumbs.map((crumb, i) =>
              crumb.path ? (
                <Link
                  key={i}
                  component="button"
                  variant="caption"
                  color="text.secondary"
                  onClick={() => navigate(crumb.path!)}
                  underline="hover"
                  sx={{ cursor: "pointer" }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <Typography key={i} variant="caption" color="text.primary">
                  {crumb.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}
        <Typography variant="h1">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>{actions}</Box>}
    </Box>
  );
}