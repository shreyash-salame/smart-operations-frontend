import {
  Box, Card, Typography, Grid, Chip, Button, Divider, TextField,
  CircularProgress, Skeleton, MenuItem, IconButton, Tooltip,
  List, ListItem, ListItemAvatar, ListItemText, Avatar,
} from "@mui/material";
import {
  Edit, Delete, Visibility, VisibilityOff, Send, Warning,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { openEditTask, showSnackbar } from "@/store/slices/uiSlice";
import {
  useGetTaskByIdQuery,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useAddCommentMutation,
  useWatchTaskMutation,
  useDeleteTaskMutation,
} from "@/store/api/taskApi";
import { useListUsersMutation } from "@/store/api/userApi";
import PageHeader from "@/components/common/PageHeader";
import StatusChip from "@/components/common/StatusChip";
import PriorityChip from "@/components/common/PriorityChip";
import UserAvatar from "@/components/common/UserAvatar";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { formatDate, formatDateTime, getFullName, getUserInitials, isOverdue } from "@/utils/helpers";
import type { TaskStatus, User } from "@/types";

const STATUSES: TaskStatus[] = ["todo", "in_progress", "in_review", "done", "cancelled"];

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.25, borderBottom: "0.5px solid rgba(0,0,0,0.05)" }}>
      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 120 }}>{label}</Typography>
      <Box sx={{ textAlign: "right" }}>{children}</Box>
    </Box>
  );
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: me } = useAppSelector((s) => s.auth);

  const { data, isLoading, refetch } = useGetTaskByIdQuery(id!, { skip: !id });
  const task = (data?.data as any)?.task;
  

  const [updateStatus] = useUpdateTaskStatusMutation();
  const [assignTask] = useAssignTaskMutation();
  const [addComment, { isLoading: commenting }] = useAddCommentMutation();
  const [watchTask] = useWatchTaskMutation();
  const [deleteTask, { isLoading: deleting }] = useDeleteTaskMutation();
  const [listUsers] = useListUsersMutation();

  const [comment, setComment] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isAdmin = me?.role === "admin" || me?.role === "manager";
  const isWatching = me?.id ? task?.watchedBy?.includes(me.id) : false;
  const overdue = isOverdue(task?.dueDate) && task?.status !== "done" && task?.status !== "cancelled";

  useEffect(() => {
    listUsers({
  filterOptions: {},
  searchFields: [],
  searchValues: [],
}).unwrap().then((r) => setUsers(r.data)).catch(() => {});
  }, []);

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      await updateStatus({ id: id!, status }).unwrap();
      dispatch(showSnackbar({ message: "Status updated", severity: "success" }));
      refetch();
    } catch {
      dispatch(showSnackbar({ message: "Failed to update status", severity: "error" }));
    }
  };

  const handleAssign = async (userId: string) => {
    try {
      await assignTask({ id: id!, assignedTo: userId }).unwrap();
      dispatch(showSnackbar({ message: "Task assigned", severity: "success" }));
      refetch();
    } catch {
      dispatch(showSnackbar({ message: "Failed to assign task", severity: "error" }));
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      await addComment({ id: id!, content: comment.trim() }).unwrap();
      setComment("");
      refetch();
    } catch {
      dispatch(showSnackbar({ message: "Failed to add comment", severity: "error" }));
    }
  };

  const handleWatch = async () => {
    try {
      await watchTask(id!).unwrap();
      refetch();
    } catch {
      dispatch(showSnackbar({ message: "Failed to update watch", severity: "error" }));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(id!).unwrap();
      dispatch(showSnackbar({ message: "Task deleted", severity: "success" }));
      navigate("/tasks");
    } catch {
      dispatch(showSnackbar({ message: "Failed to delete task", severity: "error" }));
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Skeleton height={40} width={200} sx={{ mb: 2 }} />
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={8}><Skeleton height={400} variant="rounded" /></Grid>
          <Grid item xs={12} md={4}><Skeleton height={400} variant="rounded" /></Grid>
        </Grid>
      </Box>
    );
  }

  if (!task) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h2" color="text.secondary">Task not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/tasks")}>Back to Tasks</Button>
      </Box>
    );
  }

  const assignee = typeof task.assignedTo === "object" ? task.assignedTo as User : undefined;
  const creator = typeof task.createdBy === "object" ? task.createdBy as User : undefined;
  const tags = task.tags ?? [];
  const comments = task.comments ?? [];
  const watchedBy = task.watchedBy ?? [];

  return (
    <Box>
      <PageHeader
        title={task.title}
        breadcrumbs={[{ label: "Tasks", path: "/tasks" }, { label: task.title }]}
        actions={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title={isWatching ? "Unwatch" : "Watch"}>
              <IconButton size="small" onClick={handleWatch}>
                {isWatching ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Button size="small" variant="outlined" startIcon={<Edit fontSize="small" />}
              onClick={() => dispatch(openEditTask(id!))}>
              Edit
            </Button>
            {isAdmin && (
              <Button size="small" variant="outlined" color="error" startIcon={<Delete fontSize="small" />}
                onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
            )}
          </Box>
        }
      />

      {task.isAtRisk && (
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1, p: 1.5, mb: 2,
          bgcolor: "rgba(186,117,23,0.08)", border: "1px solid rgba(186,117,23,0.3)", borderRadius: 2,
        }}>
          <Warning sx={{ color: "warning.main", fontSize: 18 }} />
          <Typography variant="body2" color="warning.main" fontWeight={500}>This task is marked at risk</Typography>
        </Box>
      )}

      {overdue && (
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1, p: 1.5, mb: 2,
          bgcolor: "rgba(163,45,45,0.08)", border: "1px solid rgba(163,45,45,0.3)", borderRadius: 2,
        }}>
          <Warning sx={{ color: "error.main", fontSize: 18 }} />
          <Typography variant="body2" color="error.main" fontWeight={500}>
            This task is overdue — due {formatDate(task.dueDate)}
          </Typography>
        </Box>
      )}

      <Grid container spacing={2.5}>
        {/* Left: Description + Comments */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2.5, mb: 2.5 }}>
            <Typography variant="h3" sx={{ mb: 1.5 }}>Description</Typography>
            {task.description ? (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                {task.description}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.disabled" fontStyle="italic">No description provided.</Typography>
            )}
            {tags.length > 0 && (
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 2 }}>
                {tags.map((tag:any) => (
                  <Chip key={tag} label={tag} size="small" sx={{ height: 22, fontSize: "0.7rem" }} />
                ))}
              </Box>
            )}
          </Card>

          <Card sx={{ p: 2.5 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Comments{" "}
              <Typography component="span" variant="caption" color="text.secondary">({comments.length})</Typography>
            </Typography>

            {comments.length === 0 ? (
              <Typography variant="body2" color="text.disabled" fontStyle="italic" sx={{ mb: 2 }}>
                No comments yet.
              </Typography>
            ) : (
              <List disablePadding sx={{ mb: 2 }}>
                {comments.map((c:any, i:any) => {
                  const commenter = typeof c.userId === "object" ? c.userId as User : undefined;
                  return (
                    <Box key={c._id}>
                      {i > 0 && <Divider sx={{ my: 1 }} />}
                      <ListItem alignItems="flex-start" disableGutters sx={{ py: 1 }}>
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <Avatar sx={{ width: 30, height: 30, background: "#185fa5", fontSize: "0.7rem" }}>
                            {commenter ? getUserInitials(commenter) : "?"}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                              <Typography variant="body2" fontWeight={600}>{getFullName(commenter)}</Typography>
                              <Typography variant="caption" color="text.secondary">{formatDateTime(c.createdAt)}</Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
                              {c.content}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Box>
                  );
                })}
              </List>
            )}

            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
              <UserAvatar user={me ?? undefined} size={30} showTooltip={false} />
              <TextField
                fullWidth size="small" placeholder="Write a comment…"
                multiline minRows={1} maxRows={4}
                value={comment} onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(); } }}
              />
              <IconButton size="small" color="primary"
                disabled={!comment.trim() || commenting} onClick={handleComment} sx={{ mb: 0.25 }}>
                {commenting ? <CircularProgress size={18} /> : <Send fontSize="small" />}
              </IconButton>
            </Box>
            <Typography variant="caption" color="text.disabled" sx={{ ml: 5 }}>
              Press Enter to send · Shift+Enter for new line
            </Typography>
          </Card>
        </Grid>

        {/* Right: Meta */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, mb: 2.5 }}>
            <Typography variant="h3" sx={{ mb: 1.5 }}>Details</Typography>

            <InfoRow label="Status">
              {isAdmin ? (
                <TextField select size="small" value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.75rem" }, minWidth: 130 }}>
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s} sx={{ fontSize: "0.8125rem", textTransform: "capitalize" }}>
                      {s.replace("_", " ")}
                    </MenuItem>
                  ))}
                </TextField>
              ) : <StatusChip status={task.status} />}
            </InfoRow>

            <InfoRow label="Priority"><PriorityChip priority={task.priority} /></InfoRow>

            <InfoRow label="Assignee">
              {isAdmin ? (
                <TextField select size="small"
                  value={typeof task.assignedTo === "object" ? (task.assignedTo as User).id : (task.assignedTo ?? "")}
                  onChange={(e) => handleAssign(e.target.value)}
                  sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.75rem" }, minWidth: 150 }}>
                  <MenuItem value=""><em>Unassigned</em></MenuItem>
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id} sx={{ fontSize: "0.8125rem" }}>
                      {u.firstName} {u.lastName}
                    </MenuItem>
                  ))}
                </TextField>
              ) : assignee ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <UserAvatar user={assignee} size={22} />
                  <Typography variant="body2">{getFullName(assignee)}</Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.disabled">Unassigned</Typography>
              )}
            </InfoRow>

            <InfoRow label="Created By">
              {creator ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <UserAvatar user={creator} size={22} />
                  <Typography variant="body2">{getFullName(creator)}</Typography>
                </Box>
              ) : <Typography variant="body2" color="text.disabled">—</Typography>}
            </InfoRow>

            <InfoRow label="Due Date">
              <Typography variant="body2" sx={{ color: overdue ? "error.main" : "text.primary", fontWeight: overdue ? 600 : 400 }}>
                {formatDate(task.dueDate)}
              </Typography>
            </InfoRow>

            {task.completedAt && (
              <InfoRow label="Completed">
                <Typography variant="body2">{formatDate(task.completedAt)}</Typography>
              </InfoRow>
            )}
            {task.project && (
              <InfoRow label="Project"><Typography variant="body2">{task.project}</Typography></InfoRow>
            )}
            {task.department && (
              <InfoRow label="Department"><Typography variant="body2">{task.department}</Typography></InfoRow>
            )}
            {task.estimatedHours != null && (
              <InfoRow label="Est. Hours"><Typography variant="body2">{task.estimatedHours}h</Typography></InfoRow>
            )}
            {task.actualHours != null && (
              <InfoRow label="Actual Hours"><Typography variant="body2">{task.actualHours}h</Typography></InfoRow>
            )}

            <InfoRow label="Created">
              <Typography variant="body2" color="text.secondary">{formatDateTime(task.createdAt)}</Typography>
            </InfoRow>
            <InfoRow label="Last Updated">
              <Typography variant="body2" color="text.secondary">{formatDateTime(task.updatedAt)}</Typography>
            </InfoRow>
            <InfoRow label="Watchers">
              <Typography variant="body2">{watchedBy.length}</Typography>
            </InfoRow>
          </Card>

          {task.estimatedHours != null && task.actualHours != null && (
            <Card sx={{ p: 2.5 }}>
              <Typography variant="h3" sx={{ mb: 1.5 }}>Time Tracking</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">Progress</Typography>
                <Typography variant="caption" fontWeight={600}>
                  {task.actualHours}h / {task.estimatedHours}h
                </Typography>
              </Box>
              <Box sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <Box sx={{
                  height: "100%",
                  width: `${Math.min((task.actualHours / task.estimatedHours) * 100, 100)}%`,
                  bgcolor: task.actualHours > task.estimatedHours ? "error.main" : "primary.main",
                  borderRadius: 4, transition: "width 0.3s ease",
                }} />
              </Box>
              {task.actualHours > task.estimatedHours && (
                <Typography variant="caption" color="error.main" sx={{ mt: 0.5, display: "block" }}>
                  {task.actualHours - task.estimatedHours}h over estimate
                </Typography>
              )}
            </Card>
          )}
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        confirmLabel="Delete" danger loading={deleting}
        onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}


// import {
//   Box, Card, Typography, Grid, Chip, Button, Divider, TextField,
//   CircularProgress, Skeleton, MenuItem, IconButton, Tooltip,
//   List, ListItem, ListItemAvatar, ListItemText, Avatar,
// } from "@mui/material";
// import {
//   ArrowBack, Edit, Delete, Visibility, VisibilityOff,
//   Send, Warning,
// } from "@mui/icons-material";
// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "@/store";
// import { openEditTask, showSnackbar } from "@/store/slices/uiSlice";
// import {
//   useGetTaskByIdQuery,
//   useUpdateTaskStatusMutation,
//   useAssignTaskMutation,
//   useAddCommentMutation,
//   useWatchTaskMutation,
//   useDeleteTaskMutation,
// } from "@/store/api/taskApi";
// import { useListUsersMutation } from "@/store/api/userApi";
// import PageHeader from "@/components/common/PageHeader";
// import StatusChip from "@/components/common/StatusChip";
// import PriorityChip from "@/components/common/PriorityChip";
// import UserAvatar from "@/components/common/UserAvatar";
// import ConfirmDialog from "@/components/common/ConfirmDialog";
// import { formatDate, formatDateTime, getFullName, getUserInitials, isOverdue } from "@/utils/helpers";
// import type { TaskStatus, User } from "@/types";
// import { useEffect } from "react";

// const STATUSES: TaskStatus[] = ["todo", "in_progress", "in_review", "done", "cancelled"];

// function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.25, borderBottom: "0.5px solid rgba(0,0,0,0.05)" }}>
//       <Typography variant="caption" color="text.secondary" sx={{ minWidth: 120 }}>{label}</Typography>
//       <Box sx={{ textAlign: "right" }}>{children}</Box>
//     </Box>
//   );
// }

// export default function TaskDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { user: me } = useAppSelector((s) => s.auth);

//   const { data, isLoading, refetch } = useGetTaskByIdQuery(id!, { skip: !id });
//   const task = data?.data;

//   const [updateStatus] = useUpdateTaskStatusMutation();
//   const [assignTask] = useAssignTaskMutation();
//   const [addComment, { isLoading: commenting }] = useAddCommentMutation();
//   const [watchTask] = useWatchTaskMutation();
//   const [deleteTask, { isLoading: deleting }] = useDeleteTaskMutation();
//   const [listUsers] = useListUsersMutation();

//   const [comment, setComment] = useState("");
//   const [users, setUsers] = useState<User[]>([]);
//   const [deleteOpen, setDeleteOpen] = useState(false);

//   const isAdmin = me?.role === "admin" || me?.role === "manager";
//   const isWatching = me?.id ? task?.watchedBy?.includes(me.id) : false;
//   const overdue = isOverdue(task?.dueDate) && task?.status !== "done" && task?.status !== "cancelled";

//   useEffect(() => {
//     listUsers({
//   filterOptions: {},
//   searchFields: [],
//   searchValues: [],
// }).unwrap().then((r) => setUsers(r.data)).catch(() => {});
//   }, []);

//   const handleStatusChange = async (status: TaskStatus) => {
//     try {
//       await updateStatus({ id: id!, status }).unwrap();
//       dispatch(showSnackbar({ message: "Status updated", severity: "success" }));
//       refetch();
//     } catch {
//       dispatch(showSnackbar({ message: "Failed to update status", severity: "error" }));
//     }
//   };

//   const handleAssign = async (userId: string) => {
//     try {
//       await assignTask({ id: id!, assignedTo: userId }).unwrap();
//       dispatch(showSnackbar({ message: "Task assigned", severity: "success" }));
//       refetch();
//     } catch {
//       dispatch(showSnackbar({ message: "Failed to assign task", severity: "error" }));
//     }
//   };

//   const handleComment = async () => {
//     if (!comment.trim()) return;
//     try {
//       await addComment({ id: id!, content: comment.trim() }).unwrap();
//       setComment("");
//       refetch();
//     } catch {
//       dispatch(showSnackbar({ message: "Failed to add comment", severity: "error" }));
//     }
//   };

//   const handleWatch = async () => {
//     try {
//       await watchTask(id!).unwrap();
//       refetch();
//     } catch {
//       dispatch(showSnackbar({ message: "Failed to update watch", severity: "error" }));
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteTask(id!).unwrap();
//       dispatch(showSnackbar({ message: "Task deleted", severity: "success" }));
//       navigate("/tasks");
//     } catch {
//       dispatch(showSnackbar({ message: "Failed to delete task", severity: "error" }));
//     }
//   };

//   if (isLoading) {
//     return (
//       <Box>
//         <Skeleton height={40} width={200} sx={{ mb: 2 }} />
//         <Grid container spacing={2.5}>
//           <Grid item xs={12} md={8}><Skeleton height={400} variant="rounded" /></Grid>
//           <Grid item xs={12} md={4}><Skeleton height={400} variant="rounded" /></Grid>
//         </Grid>
//       </Box>
//     );
//   }

//   if (!task) {
//     return (
//       <Box sx={{ textAlign: "center", py: 8 }}>
//         <Typography variant="h2" color="text.secondary">Task not found</Typography>
//         <Button sx={{ mt: 2 }} onClick={() => navigate("/tasks")}>Back to Tasks</Button>
//       </Box>
//     );
//   }

//   const assignee = typeof task.assignedTo === "object" ? task.assignedTo as User : undefined;
//   const creator = typeof task.createdBy === "object" ? task.createdBy as User : undefined;

//   return (
//     <Box>
//       <PageHeader
//         title={task.title}
//         breadcrumbs={[{ label: "Tasks", path: "/tasks" }, { label: task.title }]}
//         actions={
//           <Box sx={{ display: "flex", gap: 1 }}>
//             <Tooltip title={isWatching ? "Unwatch" : "Watch"}>
//               <IconButton size="small" onClick={handleWatch}>
//                 {isWatching ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
//               </IconButton>
//             </Tooltip>
//             <Button size="small" variant="outlined" startIcon={<Edit fontSize="small" />}
//               onClick={() => dispatch(openEditTask(id!))}>
//               Edit
//             </Button>
//             {isAdmin && (
//               <Button size="small" variant="outlined" color="error" startIcon={<Delete fontSize="small" />}
//                 onClick={() => setDeleteOpen(true)}>
//                 Delete
//               </Button>
//             )}
//           </Box>
//         }
//       />

//       {task.isAtRisk && (
//         <Box sx={{
//           display: "flex", alignItems: "center", gap: 1, p: 1.5, mb: 2,
//           bgcolor: "rgba(186,117,23,0.08)", border: "1px solid rgba(186,117,23,0.3)",
//           borderRadius: 2,
//         }}>
//           <Warning sx={{ color: "warning.main", fontSize: 18 }} />
//           <Typography variant="body2" color="warning.main" fontWeight={500}>
//             This task is marked at risk
//           </Typography>
//         </Box>
//       )}

//       {overdue && (
//         <Box sx={{
//           display: "flex", alignItems: "center", gap: 1, p: 1.5, mb: 2,
//           bgcolor: "rgba(163,45,45,0.08)", border: "1px solid rgba(163,45,45,0.3)",
//           borderRadius: 2,
//         }}>
//           <Warning sx={{ color: "error.main", fontSize: 18 }} />
//           <Typography variant="body2" color="error.main" fontWeight={500}>
//             This task is overdue — due {formatDate(task.dueDate)}
//           </Typography>
//         </Box>
//       )}

//       <Grid container spacing={2.5}>
//         {/* Left: Description + Comments */}
//         <Grid item xs={12} md={8}>
//           {/* Description */}
//           <Card sx={{ p: 2.5, mb: 2.5 }}>
//             <Typography variant="h3" sx={{ mb: 1.5 }}>Description</Typography>
//             {task.description ? (
//               <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
//                 {task.description}
//               </Typography>
//             ) : (
//               <Typography variant="body2" color="text.disabled" fontStyle="italic">No description provided.</Typography>
//             )}

//             {(task.tags.length) > 0 && (
//               <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 2 }}>
//                 {task.tags.map((tag) => (
//                   <Chip key={tag} label={tag} size="small" sx={{ height: 22, fontSize: "0.7rem" }} />
//                 ))}
//               </Box>
//             )}
//           </Card>

//           {/* Comments */}
//           <Card sx={{ p: 2.5 }}>
//             <Typography variant="h3" sx={{ mb: 2 }}>
//               Comments <Typography component="span" variant="caption" color="text.secondary">({task.comments.length})</Typography>
//             </Typography>

//             {(task.comments.length) === 0 ? (
//               <Typography variant="body2" color="text.disabled" fontStyle="italic" sx={{ mb: 2 }}>
//                 No comments yet.
//               </Typography>
//             ) : (
//               <List disablePadding sx={{ mb: 2 }}>
//                 {task.comments.map((c, i) => {
//                   const commenter = typeof c.userId === "object" ? c.userId as User : undefined;
//                   return (
//                     <Box key={c._id}>
//                       {i > 0 && <Divider sx={{ my: 1 }} />}
//                       <ListItem alignItems="flex-start" disableGutters sx={{ py: 1 }}>
//                         <ListItemAvatar sx={{ minWidth: 40 }}>
//                           <Avatar sx={{ width: 30, height: 30, background: "#185fa5", fontSize: "0.7rem" }}>
//                             {commenter ? getUserInitials(commenter) : "?"}
//                           </Avatar>
//                         </ListItemAvatar>
//                         <ListItemText
//                           primary={
//                             <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
//                               <Typography variant="body2" fontWeight={600}>
//                                 {getFullName(commenter)}
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary">
//                                 {formatDateTime(c.createdAt)}
//                               </Typography>
//                             </Box>
//                           }
//                           secondary={
//                             <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
//                               {c.content}
//                             </Typography>
//                           }
//                         />
//                       </ListItem>
//                     </Box>
//                   );
//                 })}
//               </List>
//             )}

//             {/* Add comment */}
//             <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
//               <UserAvatar user={me ?? undefined} size={30} showTooltip={false} />
//               <TextField
//                 fullWidth
//                 size="small"
//                 placeholder="Write a comment…"
//                 multiline
//                 minRows={1}
//                 maxRows={4}
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleComment(); }
//                 }}
//               />
//               <IconButton
//                 size="small"
//                 color="primary"
//                 disabled={!comment.trim() || commenting}
//                 onClick={handleComment}
//                 sx={{ mb: 0.25 }}
//               >
//                 {commenting ? <CircularProgress size={18} /> : <Send fontSize="small" />}
//               </IconButton>
//             </Box>
//             <Typography variant="caption" color="text.disabled" sx={{ ml: 5 }}>
//               Press Enter to send · Shift+Enter for new line
//             </Typography>
//           </Card>
//         </Grid>

//         {/* Right: Meta */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ p: 2.5, mb: 2.5 }}>
//             <Typography variant="h3" sx={{ mb: 1.5 }}>Details</Typography>

//             <InfoRow label="Status">
//               {isAdmin ? (
//                 <TextField
//                   select size="small" value={task.status}
//                   onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
//                   sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.75rem" }, minWidth: 130 }}
//                 >
//                   {STATUSES.map((s) => (
//                     <MenuItem key={s} value={s} sx={{ fontSize: "0.8125rem", textTransform: "capitalize" }}>
//                       {s.replace("_", " ")}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               ) : (
//                 <StatusChip status={task.status} />
//               )}
//             </InfoRow>

//             <InfoRow label="Priority">
//               <PriorityChip priority={task.priority} />
//             </InfoRow>

//             <InfoRow label="Assignee">
//               {isAdmin ? (
//                 <TextField
//                   select size="small"
//                   value={typeof task.assignedTo === "object" ? (task.assignedTo as User).id : (task.assignedTo ?? "")}
//                   onChange={(e) => handleAssign(e.target.value)}
//                   sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.75rem" }, minWidth: 150 }}
//                 >
//                   <MenuItem value=""><em>Unassigned</em></MenuItem>
//                   {users.map((u) => (
//                     <MenuItem key={u.id} value={u.id} sx={{ fontSize: "0.8125rem" }}>
//                       {u.firstName} {u.lastName}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               ) : (
//                 assignee ? (
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
//                     <UserAvatar user={assignee} size={22} />
//                     <Typography variant="body2">{getFullName(assignee)}</Typography>
//                   </Box>
//                 ) : (
//                   <Typography variant="body2" color="text.disabled">Unassigned</Typography>
//                 )
//               )}
//             </InfoRow>

//             <InfoRow label="Created By">
//               {creator ? (
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
//                   <UserAvatar user={creator} size={22} />
//                   <Typography variant="body2">{getFullName(creator)}</Typography>
//                 </Box>
//               ) : (
//                 <Typography variant="body2" color="text.disabled">—</Typography>
//               )}
//             </InfoRow>

//             <InfoRow label="Due Date">
//               <Typography variant="body2" sx={{ color: overdue ? "error.main" : "text.primary", fontWeight: overdue ? 600 : 400 }}>
//                 {formatDate(task.dueDate)}
//               </Typography>
//             </InfoRow>

//             {task.completedAt && (
//               <InfoRow label="Completed">
//                 <Typography variant="body2">{formatDate(task.completedAt)}</Typography>
//               </InfoRow>
//             )}

//             {task.project && (
//               <InfoRow label="Project">
//                 <Typography variant="body2">{task.project}</Typography>
//               </InfoRow>
//             )}

//             {task.department && (
//               <InfoRow label="Department">
//                 <Typography variant="body2">{task.department}</Typography>
//               </InfoRow>
//             )}

//             {task.estimatedHours != null && (
//               <InfoRow label="Est. Hours">
//                 <Typography variant="body2">{task.estimatedHours}h</Typography>
//               </InfoRow>
//             )}

//             {task.actualHours != null && (
//               <InfoRow label="Actual Hours">
//                 <Typography variant="body2">{task.actualHours}h</Typography>
//               </InfoRow>
//             )}

//             <InfoRow label="Created">
//               <Typography variant="body2" color="text.secondary">{formatDateTime(task.createdAt)}</Typography>
//             </InfoRow>

//             <InfoRow label="Last Updated">
//               <Typography variant="body2" color="text.secondary">{formatDateTime(task.updatedAt)}</Typography>
//             </InfoRow>

//             <InfoRow label="Watchers">
//               <Typography variant="body2">{task.watchedBy.length}</Typography>
//             </InfoRow>
//           </Card>

//           {/* Progress (if hours tracked) */}
//           {task.estimatedHours != null && task.actualHours != null && (
//             <Card sx={{ p: 2.5 }}>
//               <Typography variant="h3" sx={{ mb: 1.5 }}>Time Tracking</Typography>
//               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
//                 <Typography variant="caption" color="text.secondary">Progress</Typography>
//                 <Typography variant="caption" fontWeight={600}>
//                   {task.actualHours}h / {task.estimatedHours}h
//                 </Typography>
//               </Box>
//               <Box sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
//                 <Box
//                   sx={{
//                     height: "100%",
//                     width: `${Math.min((task.actualHours / task.estimatedHours) * 100, 100)}%`,
//                     bgcolor: task.actualHours > task.estimatedHours ? "error.main" : "primary.main",
//                     borderRadius: 4,
//                     transition: "width 0.3s ease",
//                   }}
//                 />
//               </Box>
//               {task.actualHours > task.estimatedHours && (
//                 <Typography variant="caption" color="error.main" sx={{ mt: 0.5, display: "block" }}>
//                   {task.actualHours - task.estimatedHours}h over estimate
//                 </Typography>
//               )}
//             </Card>
//           )}
//         </Grid>
//       </Grid>

//       <ConfirmDialog
//         open={deleteOpen}
//         title="Delete Task"
//         message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
//         confirmLabel="Delete"
//         danger
//         loading={deleting}
//         onConfirm={handleDelete}
//         onCancel={() => setDeleteOpen(false)}
//       />
//     </Box>
//   );
// }