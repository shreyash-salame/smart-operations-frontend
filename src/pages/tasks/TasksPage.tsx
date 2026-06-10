import {
  Box,
  Card,
  TextField,
  MenuItem,
  Button,
  Grid2,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
  Skeleton,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { Add, Search, ViewList, ViewModule, Edit, Delete, SwapVert, Visibility, PersonAdd } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { openCreateTask, openEditTask, showSnackbar } from '@/store/slices/uiSlice';
import { useListTasksMutation, useDeleteTaskMutation, useUpdateTaskStatusMutation, useAssignTaskMutation } from '@/store/api/taskApi';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import PriorityChip from '@/components/common/PriorityChip';
import UserAvatar from '@/components/common/UserAvatar';
import TaskCard from '@/components/common/TaskCard';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatDate, getFullName } from '@/utils/helpers';
import type { Task, TaskStatus, TaskPriority, User } from '@/types';

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'in_review', 'done', 'cancelled'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'critical'];

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const [view, setView] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const [listTasks, { isLoading }] = useListTasksMutation();
  const [deleteTask, { isLoading: deleting }] = useDeleteTaskMutation();
  const [updateStatus] = useUpdateTaskStatusMutation();

  // const fetchTasks = async () => {
  //   try {
  //     const res = await listTasks({
  //       page: page + 1, limit: rowsPerPage,
  //       ...(search && { search }),
  //       ...(statusFilter && { status: statusFilter }),
  //       ...(priorityFilter && { priority: priorityFilter }),
  //     }).unwrap();
  //     setTasks(res.data);
  //     setTotal(res.pagination.totalResults);
  //   } catch {
  //     dispatch(showSnackbar({ message: "Failed to load tasks", severity: "error" }));
  //   }
  // };
  const fetchTasks = async () => {
    try {
      const payload = {
        // page: page + 1,
        // limit: rowsPerPage,

        filterOptions: {
          ...(statusFilter && { status: statusFilter }),
          ...(priorityFilter && { priority: priorityFilter })
        },

        ...(search.trim() && {
          searchFields: ['title'],
          searchValues: [search.trim()]
        })
      };

      const res = await listTasks(payload).unwrap();

      setTasks(res.data);
      setTotal(res.pagination.totalResults);
    } catch (error) {
      console.error('Task fetch error:', error);

      dispatch(
        showSnackbar({
          message: 'Failed to load tasks',
          severity: 'error'
        })
      );
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [page, rowsPerPage, statusFilter, priorityFilter]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      fetchTasks();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask(deleteTarget.id || deleteTarget._id!).unwrap();
      dispatch(showSnackbar({ message: 'Task deleted', severity: 'success' }));
      fetchTasks();
    } catch {
      dispatch(showSnackbar({ message: 'Failed to delete task', severity: 'error' }));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      await updateStatus({ id: task.id || task._id!, status: newStatus }).unwrap();
      dispatch(showSnackbar({ message: 'Status updated', severity: 'success' }));
      fetchTasks();
    } catch {
      dispatch(showSnackbar({ message: 'Failed to update status', severity: 'error' }));
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  return (
    <Box>
      <PageHeader
        title="Tasks"
        subtitle={`${total} task${total !== 1 ? 's' : ''} total`}
        actions={
          <Button variant="contained" size="small" startIcon={<Add />} onClick={() => dispatch(openCreateTask())}>
            New Task
          </Button>
        }
      />

      {/* Filters */}
      <Card sx={{ p: 2, mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search tasks…"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              )
            }}
          />
          {/* <TextField select size="small" value={statusFilter} placeholder="Status" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            displayEmpty sx={{ minWidth: 140 }}>
            <MenuItem value="">All Statuses</MenuItem>
            {STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s.replace("_", " ")}</MenuItem>)}
          </TextField> */}
          <TextField
            select
            size="small"
            value={statusFilter}
            placeholder="Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 140 }}
            SelectProps={{
              displayEmpty: true
            }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>
                {s.replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
          {/* <TextField select size="small" value={priorityFilter} placeholder="Priority" onChange={(e) => { setPriorityFilter(e.target.value); setPage(0); }}
            displayEmpty sx={{ minWidth: 140 }}>
            <MenuItem value="">All Priorities</MenuItem>
            {PRIORITIES.map((p) => <MenuItem key={p} value={p} sx={{ textTransform: "capitalize" }}>{p}</MenuItem>)}
          </TextField> */}
          <TextField
            select
            size="small"
            value={priorityFilter}
            placeholder="Priority"
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 140 }}
            SelectProps={{
              displayEmpty: true
            }}
          >
            <MenuItem value="">All Priorities</MenuItem>
            {PRIORITIES.map((p) => (
              <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          {(search || statusFilter || priorityFilter) && (
            <Button
              size="small"
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setPriorityFilter('');
                setPage(0);
              }}
            >
              Clear
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <ToggleButtonGroup size="small" value={view} exclusive onChange={(_, v) => v && setView(v)}>
            <ToggleButton value="list">
              <ViewList fontSize="small" />
            </ToggleButton>
            <ToggleButton value="grid">
              <ViewModule fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Card>

      {/* Grid view */}
      {view === 'grid' && (
        <>
          {isLoading ? (
            // <Grid2 container spacing={2}>
            //   {[1, 2, 3, 4, 5, 6].map((k) => (
            //     <Grid2 item xs={12} sm={6} md={4} key={k}>
            //       <Skeleton height={160} variant="rounded" />
            //     </Grid2>
            //   ))}
            // </Grid2>
            <Grid2 container spacing={2}>
  {[1, 2, 3, 4, 5, 6].map((k) => (
    <Grid2 key={k} size={{ xs: 12, sm: 6, md: 4 }}>
      <Skeleton height={160} variant="rounded" />
    </Grid2>
  ))}
</Grid2>
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={<SwapVert />}
              title="No tasks found"
              description="Try adjusting your filters or create a new task."
              action={
                <Button variant="contained" size="small" onClick={() => dispatch(openCreateTask())}>
                  New Task
                </Button>
              }
            />
          ) : (
            // <Grid2 container spacing={2}>
            //   {tasks.map((task) => (
            //     <Grid2 item xs={12} sm={6} md={4} key={task.id || task._id}>
            //       <TaskCard task={task} onStatusChange={(t) => dispatch(openEditTask(t.id || t._id!))} />
            //     </Grid2>
            //   ))}
            // </Grid2>
            <Grid2 container spacing={2}>
  {tasks.map((task) => (
    <Grid2
      key={task.id || task._id}
      size={{ xs: 12, sm: 6, md: 4 }}
    >
      <TaskCard
        task={task}
        onStatusChange={(t) =>
          dispatch(openEditTask(t.id || t._id!))
        }
      />
    </Grid2>
  ))}
</Grid2>
          )}
        </>
      )}

      {/* List / table view */}
      {view === 'list' && (
        <Card sx={{ overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton height={20} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No tasks found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => {
                  const assignee = typeof task.assignedTo === 'object' ? (task.assignedTo as User) : undefined;
                  return (
                    <TableRow
                      key={task.id || task._id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/tasks/${task.id || task._id}`)}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} sx={{ maxWidth: 280 }} noWrap>
                          {task.title}
                        </Typography>
                        {task.project && (
                          <Typography variant="caption" color="text.secondary">
                            {task.project}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={task.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityChip priority={task.priority} />
                      </TableCell>
                      <TableCell>
                        {assignee ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <UserAvatar user={assignee} size={22} />
                            <Typography variant="caption" noWrap sx={{ maxWidth: 100 }}>
                              {getFullName(assignee)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Unassigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          color={task.dueDate && new Date(task.dueDate) < new Date() ? 'error' : 'text.secondary'}
                        >
                          {formatDate(task.dueDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {task.tags.slice(0, 2).map((tag) => (
                            <Chip key={tag} label={tag} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                          ))}
                          {task.tags.length > 2 && <Typography variant="caption">+{task.tags.length - 2}</Typography>}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => navigate(`/tasks/${task.id || task._id}`)}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => dispatch(openEditTask(task.id || task._id!))}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {isAdmin && (
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => setDeleteTarget(task)}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(+e.target.value);
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
            sx={{ borderTop: '0.5px solid rgba(0,0,0,0.06)', '& .MuiTablePagination-toolbar': { minHeight: 44 } }}
          />
        </Card>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
