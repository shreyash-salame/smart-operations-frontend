import { Box, Card, Typography, Skeleton } from "@mui/material";
import {
  Assignment, CheckCircle, Warning, ErrorOutline, Group,
} from "@mui/icons-material";
import type { DashboardData } from "@/types";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  suffix?: string;
}

function StatCard({ label, value, icon, iconBg, iconColor, suffix }: StatCardProps) {
  return (
    <Card sx={{ p: 2.5, flex: 1, minWidth: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="h1" sx={{ mt: 0.5, fontSize: "1.75rem" }}>
            {value}{suffix}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 44, height: 44, borderRadius: 2,
            background: iconBg, display: "flex", alignItems: "center",
            justifyContent: "center", color: iconColor,
          }}
        >
          {icon}
        </Box>
      </Box>
    </Card>
  );
}

interface Props {
  data?: DashboardData["overview"];
  loading?: boolean;
}

export default function DashboardStats({ data, loading }: Props) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {[1, 2, 3, 4].map((k) => (
          <Skeleton key={k} variant="rounded" height={96} sx={{ flex: 1, minWidth: 160 }} />
        ))}
      </Box>
    );
  }

  const cards: StatCardProps[] = [
    {
      label: "Total Tasks",
      value: data?.totalTasks ?? 0,
      icon: <Assignment fontSize="small" />,
      iconBg: "#e3f0fb",
      iconColor: "#185fa5",
    },
    {
      label: "Completion Rate",
      value: data?.completionRate ?? 0,
      suffix: "%",
      icon: <CheckCircle fontSize="small" />,
      iconBg: "#e8f5e9",
      iconColor: "#3b6d11",
    },
    {
      label: "Overdue",
      value: data?.overdueCount ?? 0,
      icon: <ErrorOutline fontSize="small" />,
      iconBg: "#ffebee",
      iconColor: "#a32d2d",
    },
    {
      label: "At Risk",
      value: data?.atRiskCount ?? 0,
      icon: <Warning fontSize="small" />,
      iconBg: "#fff3e0",
      iconColor: "#ba7517",
    },
    ...(data?.activeUsers !== undefined
      ? [{
          label: "Active Users",
          value: data.activeUsers,
          icon: <Group fontSize="small" />,
          iconBg: "#f3e5f5",
          iconColor: "#7b1fa2",
        }]
      : []),
  ];

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </Box>
  );
}