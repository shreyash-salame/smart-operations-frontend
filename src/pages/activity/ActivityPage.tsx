import {
  Box, Card, Table, TableHead, TableBody, TableRow, TableCell,
  TablePagination, Typography, Skeleton, Chip, Avatar,
} from "@mui/material";
import {
  PersonAdd, Edit, Delete, Login, Logout, AssignmentTurnedIn,
  Comment, Visibility, SwapHoriz,
} from "@mui/icons-material";
import { useGetActivityLogsQuery } from "@/store/api/notificationApi";
import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { formatDateTime, getFullName, getUserInitials } from "@/utils/helpers";
import type { ActivityLog, ActivityAction } from "@/types";

const ACTION_ICON: Record<ActivityAction, React.ReactNode> = {
  "user.created": <PersonAdd fontSize="small" />,
  "user.updated": <Edit fontSize="small" />,
  "user.deleted": <Delete fontSize="small" />,
  "user.login": <Login fontSize="small" />,
  "user.logout": <Logout fontSize="small" />,
  "user.role_changed": <SwapHoriz fontSize="small" />,
  "task.created": <AssignmentTurnedIn fontSize="small" />,
  "task.updated": <Edit fontSize="small" />,
  "task.deleted": <Delete fontSize="small" />,
  "task.assigned": <PersonAdd fontSize="small" />,
  "task.status_changed": <SwapHoriz fontSize="small" />,
  "task.comment_added": <Comment fontSize="small" />,
  "task.watched": <Visibility fontSize="small" />,
};

const ACTION_COLOR: Partial<Record<ActivityAction, "success" | "error" | "warning" | "info" | "default">> = {
  "user.created": "success",
  "task.created": "success",
  "user.deleted": "error",
  "task.deleted": "error",
  "user.login": "info",
  "task.status_changed": "warning",
  "user.role_changed": "warning",
};

function formatActionLabel(action: string) {
  return action.replace(".", " › ").replace(/_/g, " ");
}

export default function ActivityPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { data, isLoading } = useGetActivityLogsQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  const logs = data?.data ?? [];
  const total = data?.pagination?.totalResults ?? 0;

  return (
    <Box>
      <PageHeader title="Activity Log" subtitle="All system activity across users and tasks" />

      <Card sx={{ overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Changes</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {[1,2,3,4,5,6].map((j) => <TableCell key={j}><Skeleton height={20} /></TableCell>)}
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 6, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">No activity yet.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar sx={{ width: 26, height: 26, background: "#185fa5", fontSize: "0.65rem" }}>
                        {getUserInitials(log.userId)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500} noWrap>{getFullName(log.userId)}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>{log.userId?.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={ACTION_ICON[log.action] as any}
                      label={formatActionLabel(log.action)}
                      size="small"
                      color={ACTION_COLOR[log.action] ?? "default"}
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", height: 22 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{log.resourceTitle}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                        {log.resourceType}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {log.changes ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                        {Object.entries(log.changes).slice(0, 2).map(([field, change]) => (
                          <Typography key={field} variant="caption" color="text.secondary">
                            <strong>{field}:</strong>{" "}
                            <span style={{ color: "#a32d2d" }}>{String(change.from)}</span>
                            {" → "}
                            <span style={{ color: "#3b6d11" }}>{String(change.to)}</span>
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">{log.ipAddress || "—"}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">{formatDateTime(log.createdAt)}</Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          rowsPerPageOptions={[10, 20, 50]}
          sx={{ borderTop: "0.5px solid rgba(0,0,0,0.06)" }}
        />
      </Card>
    </Box>
  );
}