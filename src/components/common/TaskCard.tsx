import {
  Card, Box, Typography, Chip, Tooltip, IconButton, Stack,
} from "@mui/material";
import {
  CalendarToday, Warning, Visibility, MoreVert,
} from "@mui/icons-material";
import type { Task } from "@/types";
import StatusChip from "./StatusChip";
import PriorityChip from "./PriorityChip";
import UserAvatar from "./UserAvatar";
import { formatDate, isOverdue, getFullName } from "@/utils/helpers";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types";

interface Props {
  task: Task;
  onStatusChange?: (task: Task) => void;
}

export default function TaskCard({ task, onStatusChange }: Props) {
  const navigate = useNavigate();
  const assignee = typeof task.assignedTo === "object" ? task.assignedTo as User : undefined;
  const overdue = isOverdue(task.dueDate) && task.status !== "done" && task.status !== "cancelled";

  return (
    <Card
      sx={{
        p: 2,
        cursor: "pointer",
        transition: "box-shadow 0.15s",
        border: overdue ? "1px solid rgba(163,45,45,0.3)" : "0.5px solid rgba(0,0,0,0.08)",
        "&:hover": { boxShadow: 3 },
      }}
      onClick={() => navigate(`/tasks/${task.id || task._id}`)}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            flex: 1, mr: 1, overflow: "hidden",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {task.isAtRisk && (
            <Tooltip title="At risk">
              <Warning fontSize="inherit" sx={{ color: "warning.main", mr: 0.5, verticalAlign: "middle" }} />
            </Tooltip>
          )}
          {task.title}
        </Typography>
        <IconButton
          size="small"
          sx={{ p: 0.5, mt: -0.5, mr: -0.5 }}
          onClick={(e) => { e.stopPropagation(); onStatusChange?.(task); }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Box>

      {task.description && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden", mb: 1.5,
          }}
        >
          {task.description}
        </Typography>
      )}

      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 1.5 }}>
        <StatusChip status={task.status} />
        <PriorityChip priority={task.priority} />
        {task.tags.slice(0, 2).map((tag) => (
          <Chip key={tag} label={tag} size="small" sx={{ height: 20, fontSize: "0.65rem" }} />
        ))}
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {assignee && <UserAvatar user={assignee} size={22} />}
          {assignee && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {getFullName(assignee)}
            </Typography>
          )}
        </Box>

        {task.dueDate && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarToday sx={{ fontSize: 11, color: overdue ? "error.main" : "text.secondary" }} />
            <Typography
              variant="caption"
              sx={{ color: overdue ? "error.main" : "text.secondary", fontWeight: overdue ? 600 : 400 }}
            >
              {formatDate(task.dueDate)}
            </Typography>
          </Box>
        )}
      </Box>

      {task.watchedBy.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
          <Visibility sx={{ fontSize: 11, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">{task.watchedBy.length}</Typography>
        </Box>
      )}
    </Card>
  );
}