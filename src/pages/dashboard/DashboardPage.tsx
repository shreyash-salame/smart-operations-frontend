import {
  Box, Card, Typography, Grid, Skeleton, List, ListItem,
  ListItemText, ListItemAvatar, Chip, LinearProgress, Divider,
  Button,
} from "@mui/material";
import { Add, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetDashboardQuery } from "@/store/api/notificationApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { openCreateTask } from "@/store/slices/uiSlice";
import DashboardStats from "@/components/common/DashboardStats";
import PageHeader from "@/components/common/PageHeader";
import StatusChip from "@/components/common/StatusChip";
import PriorityChip from "@/components/common/PriorityChip";
import UserAvatar from "@/components/common/UserAvatar";
import { formatDate, formatDateTime, getFullName } from "@/utils/helpers";
import type { TaskStatus, TaskPriority } from "@/types";

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "in_review", "done", "cancelled"];
const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do", in_progress: "In Progress", in_review: "In Review",
  done: "Done", cancelled: "Cancelled",
};
const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "#9e9e9e", in_progress: "#ff9800", in_review: "#2196f3",
  done: "#4caf50", cancelled: "#f44336",
};

const PRIORITY_ORDER: TaskPriority[] = ["critical", "high", "medium", "low"];
const PRIORITY_LABELS: Record<TaskPriority, string> = {
  critical: "Critical", high: "High", medium: "Medium", low: "Low",
};
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  critical: "#9c27b0", high: "#f44336", medium: "#ff9800", low: "#4caf50",
};

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, py: 1.75, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
        <Typography variant="h3">{title}</Typography>
        {action}
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>{children}</Box>
    </Card>
  );
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { data, isLoading } = useGetDashboardQuery();
  const dashboard = data?.data;

  const totalByStatus = dashboard
    ? Object.values(dashboard.tasksByStatus).reduce((a, b) => a + b, 0) || 1
    : 1;
  const totalByPriority = dashboard
    ? Object.values(dashboard.tasksByPriority).reduce((a, b) => a + b, 0) || 1
    : 1;

  return (
    <Box>
      <PageHeader
        title={`Good ${getGreeting()}, ${user?.firstName ?? ""}!`}
        subtitle="Here's what's happening across your operations today."
        actions={
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={() => dispatch(openCreateTask())}
          >
            New Task
          </Button>
        }
      />

      {/* Stats */}
      <Box sx={{ mb: 3 }}>
        <DashboardStats data={dashboard?.overview} loading={isLoading} />
      </Box>

      <Grid container spacing={2.5}>
        {/* Tasks by Status */}
        <Grid item xs={12} md={4}>
          <SectionCard title="Tasks by Status">
            {isLoading ? (
              <Box sx={{ p: 2 }}>{[1,2,3,4,5].map((k) => <Skeleton key={k} height={36} sx={{ mb: 0.5 }} />)}</Box>
            ) : (
              <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>
                {STATUS_ORDER.map((status) => {
                  const count = dashboard?.tasksByStatus[status] ?? 0;
                  const pct = Math.round((count / totalByStatus) * 100);
                  return (
                    <Box key={status}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2">{STATUS_LABELS[status]}</Typography>
                        <Typography variant="body2" fontWeight={600}>{count}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 6, borderRadius: 3,
                          bgcolor: "rgba(0,0,0,0.06)",
                          "& .MuiLinearProgress-bar": { bgcolor: STATUS_COLORS[status], borderRadius: 3 },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </SectionCard>
        </Grid>

        {/* Tasks by Priority */}
        <Grid item xs={12} md={4}>
          <SectionCard title="Tasks by Priority">
            {isLoading ? (
              <Box sx={{ p: 2 }}>{[1,2,3,4].map((k) => <Skeleton key={k} height={36} sx={{ mb: 0.5 }} />)}</Box>
            ) : (
              <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>
                {PRIORITY_ORDER.map((priority) => {
                  const count = dashboard?.tasksByPriority[priority] ?? 0;
                  const pct = Math.round((count / totalByPriority) * 100);
                  return (
                    <Box key={priority}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2">{PRIORITY_LABELS[priority]}</Typography>
                        <Typography variant="body2" fontWeight={600}>{count}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 6, borderRadius: 3,
                          bgcolor: "rgba(0,0,0,0.06)",
                          "& .MuiLinearProgress-bar": { bgcolor: PRIORITY_COLORS[priority], borderRadius: 3 },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </SectionCard>
        </Grid>

        {/* At Risk Tasks */}
        <Grid item xs={12} md={4}>
          <SectionCard
            title="At Risk Tasks"
            action={
              <Button size="small" endIcon={<ArrowForward fontSize="inherit" />}
                onClick={() => navigate("/tasks")} sx={{ fontSize: "0.75rem" }}>
                View All
              </Button>
            }
          >
            {isLoading ? (
              <Box sx={{ p: 2 }}>{[1,2,3].map((k) => <Skeleton key={k} height={56} sx={{ mb: 1 }} />)}</Box>
            ) : dashboard?.atRiskTasks?.length ? (
              <List disablePadding>
                {dashboard.atRiskTasks.slice(0, 6).map((task, i) => (
                  <Box key={task.id || task._id}>
                    {i > 0 && <Divider />}
                    <ListItem
                      sx={{ px: 2.5, py: 1.25, cursor: "pointer", "&:hover": { bgcolor: "rgba(0,0,0,0.02)" } }}
                      onClick={() => navigate(`/tasks/${task.id || task._id}`)}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500} noWrap>{task.title}</Typography>
                        }
                        secondary={
                          <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                            <StatusChip status={task.status} />
                            <PriorityChip priority={task.priority} />
                          </Box>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">No at-risk tasks 🎉</Typography>
              </Box>
            )}
          </SectionCard>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <SectionCard
            title="Recent Activity"
            action={
              <Button size="small" endIcon={<ArrowForward fontSize="inherit" />}
                onClick={() => navigate("/activity")} sx={{ fontSize: "0.75rem" }}>
                View All
              </Button>
            }
          >
            {isLoading ? (
              <Box sx={{ p: 2 }}>{[1,2,3,4,5].map((k) => <Skeleton key={k} height={48} sx={{ mb: 0.5 }} />)}</Box>
            ) : dashboard?.recentActivity?.length ? (
              <List disablePadding>
                {dashboard.recentActivity.slice(0, 8).map((log, i) => (
                  <Box key={log.id}>
                    {i > 0 && <Divider />}
                    <ListItem sx={{ px: 2.5, py: 1.25 }}>
                      <ListItemAvatar sx={{ minWidth: 40 }}>
                        <UserAvatar user={log.userId} size={28} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <strong>{getFullName(log.userId)}</strong>{" "}
                            <span style={{ color: "#666" }}>{formatAction(log.action)}</span>{" "}
                            <strong>{log.resourceTitle}</strong>
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {formatDateTime(log.createdAt)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">No recent activity</Typography>
              </Box>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function formatAction(action: string) {
  return action.replace(".", " ").replace(/_/g, " ");
}