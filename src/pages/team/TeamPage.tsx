import {
  Box,
  Card,
  TextField,
  MenuItem,
  Button,
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
  Avatar,
  Typography
} from '@mui/material';
import { Add, Search, Edit, Delete, Lock } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { openCreateUser, showSnackbar } from '@/store/slices/uiSlice';
import { useListUsersMutation, useDeleteUserMutation, useChangeUserRoleMutation } from '@/store/api/userApi';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { formatDateTime, getUserInitials, roleColor, roleBgColor } from '@/utils/helpers';
import type { User } from '@/types';

const ROLES = ['admin', 'manager', 'user'];
const STATUSES = ['active', 'inactive', 'suspended'];

export default function TeamPage() {
  const dispatch = useAppDispatch();
  const { user: me } = useAppSelector((s) => s.auth);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [listUsers, { isLoading }] = useListUsersMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [changeRole] = useChangeUserRoleMutation();

  const isAdmin = me?.role === 'admin';

  const fetchUsers = async () => {
    try {
      const res = await listUsers({
        filterOptions: {
          ...(statusFilter && { status: statusFilter }),
          ...(roleFilter && { role: roleFilter })
        },

        ...(search.trim() && {
          searchFields: ['firstName','lastName','email'],
          searchValues: [search.trim()]
        })
      }).unwrap();
      setUsers(res.data);
      setTotal(res.pagination.totalResults);
    } catch {
      dispatch(showSnackbar({ message: 'Failed to load users', severity: 'error' }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, roleFilter, statusFilter]);
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      fetchUsers();
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id).unwrap();
      dispatch(showSnackbar({ message: 'User deleted', severity: 'success' }));
      fetchUsers();
    } catch {
      dispatch(showSnackbar({ message: 'Failed to delete user', severity: 'error' }));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await changeRole({ id: userId, role }).unwrap();
      dispatch(showSnackbar({ message: 'Role updated', severity: 'success' }));
      fetchUsers();
    } catch {
      dispatch(showSnackbar({ message: 'Failed to update role', severity: 'error' }));
    }
  };

  return (
    <Box>
      <PageHeader
        title="Team"
        subtitle={`${total} member${total !== 1 ? 's' : ''}`}
        actions={
          isAdmin && (
            <Button variant="contained" size="small" startIcon={<Add />} onClick={() => dispatch(openCreateUser())}>
              Add User
            </Button>
          )
        }
      />

      <Card sx={{ mb: 2.5, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search users…"
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
          {/* <TextField select size="small" value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }} displayEmpty sx={{ minWidth: 130 }}>
            <MenuItem value="">All Roles</MenuItem>
            {ROLES.map((r) => <MenuItem key={r} value={r} sx={{ textTransform: "capitalize" }}>{r}</MenuItem>)}
          </TextField> */}
          <TextField
            select
            size="small"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 130 }}
            SelectProps={{
              displayEmpty: true
            }}
          >
            <MenuItem value="">All Roles</MenuItem>

            {ROLES.map((r) => (
              <MenuItem key={r} value={r} sx={{ textTransform: 'capitalize' }}>
                {r}
              </MenuItem>
            ))}
          </TextField>
          {/* <TextField select size="small" value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} displayEmpty sx={{ minWidth: 140 }}>
            <MenuItem value="">All Statuses</MenuItem>
            {STATUSES.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s}</MenuItem>)}
          </TextField> */}
          <TextField
            select
            size="small"
            value={statusFilter}
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
          {(search || roleFilter || statusFilter) && (
            <Button
              size="small"
              onClick={() => {
                setSearch('');
                setRoleFilter('');
                setStatusFilter('');
                setPage(0);
              }}
            >
              Clear
            </Button>
          )}
        </Box>
      </Card>

      <Card sx={{ overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Joined</TableCell>
              {isAdmin && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: isAdmin ? 7 : 6 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton height={20} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 7 : 6} sx={{ py: 6, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No users found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                      <Avatar sx={{ width: 30, height: 30, background: '#185fa5', fontSize: '0.7rem' }}>{getUserInitials(u)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {u.firstName} {u.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {u.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {isAdmin && u.id !== me?.id ? (
                      <TextField
                        select
                        size="small"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.75rem' } }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {ROLES.map((r) => (
                          <MenuItem key={r} value={r} sx={{ textTransform: 'capitalize', fontSize: '0.8125rem' }}>
                            {r}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <Chip
                        label={u.role}
                        size="small"
                        sx={{ bgcolor: roleBgColor[u.role], color: roleColor[u.role], fontWeight: 600, fontSize: '0.7rem' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.status}
                      size="small"
                      color={u.status === 'active' ? 'success' : u.status === 'suspended' ? 'error' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{u.department || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(u.lastLoginAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(u.createdAt)}
                    </Typography>
                  </TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Delete">
                          <span>
                            <IconButton size="small" color="error" disabled={u.id === me?.id} onClick={() => setDeleteTarget(u)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  )}
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
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
          sx={{ borderTop: '0.5px solid rgba(0,0,0,0.06)' }}
        />
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        message={`Delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
