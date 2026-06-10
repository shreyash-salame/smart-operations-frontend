import {
  Box, Card, Typography, List, ListItem, ListItemText, ListItemAvatar,
  IconButton, Button, Chip, Divider, Skeleton, Tooltip,
} from "@mui/material";
import {
  Notifications as NotifIcon, DoneAll, CheckCircle, Circle,
  Assignment, Person,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetNotificationsQuery, useMarkSeenMutation, useMarkAllSeenMutation,
} from "@/store/api/notificationApi";
import PageHeader from "@/components/common/PageHeader";
import UserAvatar from "@/components/common/UserAvatar";
import EmptyState from "@/components/common/EmptyState";
import { formatDateTime, getFullName } from "@/utils/helpers";
import type { NotificationType } from "@/types";

const TYPE_COLOR: Record<NotificationType, "error" | "warning" | "info" | "success" | "default"> = {
  task_assigned: "info",
  task_status_changed: "warning",
  task_comment: "default",
  task_due_soon: "warning",
  task_overdue: "error",
  task_at_risk: "error",
  user_mentioned: "info",
};

const TYPE_LABEL: Record<NotificationType, string> = {
  task_assigned: "Assigned",
  task_status_changed: "Status Changed",
  task_comment: "Comment",
  task_due_soon: "Due Soon",
  task_overdue: "Overdue",
  task_at_risk: "At Risk",
  user_mentioned: "Mentioned",
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data, isLoading, refetch } = useGetNotificationsQuery({
    ...(filter === "unread" && { seen: false }),
    page: 1,
  });
  const [markSeen] = useMarkSeenMutation();
  const [markAll] = useMarkAllSeenMutation();

  const notifications = data?.data ?? [];
  const total = data?.pagination?.totalResults ?? 0;
  const unread = notifications.filter((n) => !n.seen).length;

  const handleMarkSeen = async (id: string) => {
    await markSeen(id);
    refetch();
  };

  const handleMarkAll = async () => {
    await markAll();
    refetch();
  };

  const handleClick = async (notif: typeof notifications[0]) => {
    if (!notif.seen) await markSeen(notif.id);
    if (notif.resourceType === "task") navigate(`/tasks/${notif.resourceId}`);
  };

  return (
    <Box>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread`}
        actions={
          unread > 0 && (
            <Button size="small" startIcon={<DoneAll fontSize="small" />} onClick={handleMarkAll}>
              Mark all read
            </Button>
          )
        }
      />

      {/* Filter tabs */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        {(["all", "unread"] as const).map((f) => (
          <Button
            key={f}
            size="small"
            variant={filter === f ? "contained" : "outlined"}
            onClick={() => setFilter(f)}
            sx={{ textTransform: "capitalize" }}
          >
            {f}
          </Button>
        ))}
      </Box>

      <Card>
        {isLoading ? (
          <List disablePadding>
            {[1,2,3,4,5].map((k) => (
              <ListItem key={k} sx={{ px: 2.5, py: 1.5 }}>
                <ListItemAvatar><Skeleton variant="circular" width={32} height={32} /></ListItemAvatar>
                <ListItemText
                  primary={<Skeleton width="60%" />}
                  secondary={<Skeleton width="40%" />}
                />
              </ListItem>
            ))}
          </List>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<NotifIcon />}
            title="No notifications"
            description={filter === "unread" ? "You're all caught up!" : "No notifications yet."}
          />
        ) : (
          <List disablePadding>
            {notifications.map((notif, i) => (
              <Box key={notif.id}>
                {i > 0 && <Divider />}
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 2.5, py: 1.5, cursor: "pointer",
                    bgcolor: notif.seen ? "transparent" : "rgba(24,95,165,0.04)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.03)" },
                    transition: "background 0.15s",
                  }}
                  onClick={() => handleClick(notif)}
                  secondaryAction={
                    !notif.seen && (
                      <Tooltip title="Mark as read">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMarkSeen(notif.id); }}>
                          <CheckCircle fontSize="small" sx={{ color: "#185fa5" }} />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    {notif.fromUserId ? (
                      <UserAvatar user={notif.fromUserId} size={32} />
                    ) : (
                      <Box sx={{
                        width: 32, height: 32, borderRadius: "50%",
                        bgcolor: "rgba(24,95,165,0.1)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        {notif.resourceType === "task" ? (
                          <Assignment fontSize="small" sx={{ color: "#185fa5" }} />
                        ) : (
                          <Person fontSize="small" sx={{ color: "#185fa5" }} />
                        )}
                      </Box>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                        {!notif.seen && (
                          <Circle sx={{ fontSize: 8, color: "#185fa5", flexShrink: 0 }} />
                        )}
                        <Typography variant="body2" fontWeight={notif.seen ? 400 : 600}>
                          {notif.title}
                        </Typography>
                        <Chip
                          label={TYPE_LABEL[notif.type]}
                          size="small"
                          color={TYPE_COLOR[notif.type]}
                          variant="outlined"
                          sx={{ height: 18, fontSize: "0.65rem", ml: "auto" }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 0.25 }}>
                          {formatDateTime(notif.createdAt)}
                          {notif.fromUserId && ` · from ${getFullName(notif.fromUserId)}`}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Card>
    </Box>
  );
}