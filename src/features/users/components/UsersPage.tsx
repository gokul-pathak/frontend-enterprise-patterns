'use client';

import { useState, useCallback, lazy, Suspense } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import {
  Search as SearchIcon,
  DeleteOutlined as DeleteIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';

import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/shared/components/Button';
import { Avatar } from '@/shared/components/Avatar';
import { PermissionGuard } from '@/features/auth';
import { useUsers } from '../hooks/useUsers';
import { useDeleteUser } from '../hooks/useUsersMutation';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { User } from '../types/user.types';

// Dynamic import: ConfirmDialog and UserDetailModal are not in the initial bundle.
// They only load when the user opens them. This reduces first-load JS by ~8kb.
const ConfirmDialog = lazy(() =>
  import('@/shared/components/ConfirmDialog').then((m) => ({ default: m.ConfirmDialog })),
);
const UserDetailModal = lazy(() =>
  import('./UserDetailModal').then((m) => ({ default: m.UserDetailModal })),
);

const STATUS_OPTIONS = ['all', 'active', 'inactive', 'pending'];
const DEPARTMENTS = ['all', 'Engineering', 'Design', 'Product', 'People Ops', 'Finance'];

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);
  const deleteUser = useDeleteUser();

  const { data, isLoading } = useUsers({
    page: paginationModel.page + 1, // API is 1-indexed
    pageSize: paginationModel.pageSize,
    search: debouncedSearch || undefined,
    department: department !== 'all' ? department : undefined,
    status: status !== 'all' ? status : undefined,
  });

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;
    await deleteUser.mutateAsync(deleteTargetId);
    setDeleteTargetId(null);
  }, [deleteTargetId, deleteUser]);

  const columns: GridColDef<User>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar name={params.row.name} src={params.row.avatarUrl} size={32} />
          <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2, mb: 0.5 }} noWrap>
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }} noWrap>
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color={
            params.value === 'admin'
              ? 'primary'
              : params.value === 'manager'
                ? 'secondary'
                : 'default'
          }
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'active'
              ? 'success'
              : params.value === 'inactive'
                ? 'error'
                : 'warning'
          }
        />
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button
            size="small"
            variant="text"
            startIcon={<PersonIcon />}
            onClick={() => setSelectedUser(params.row)}
            aria-label={`View ${params.row.name}`}
          >
            View
          </Button>
          <PermissionGuard allowedRoles={['admin']}>
            <Button
              size="small"
              variant="text"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteTargetId(params.row.id)}
              aria-label={`Delete ${params.row.name}`}
            >
              Delete
            </Button>
          </PermissionGuard>
        </Box>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="People"
        description="Manage your organization's members and their access."
        breadcrumbs={[{ label: 'Meridian' }, { label: 'People' }]}
        actions={
          <PermissionGuard allowedRoles={['admin', 'manager']}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Member
            </Button>
          </PermissionGuard>
        }
      />

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              id="users-search"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 240 }}
              slotProps={{
                input: {
                  startAdornment: <SearchIcon fontSize="small" color="action" sx={{ mr: 1 }} />,
                  'aria-label': 'search users',
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                value={department}
                label="Department"
                onChange={(e) => setDepartment(e.target.value)}
              >
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d === 'all' ? 'All departments' : d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <DataGrid
            rows={data?.data ?? []}
            columns={columns}
            rowCount={data?.pagination.total ?? 0}
            loading={isLoading}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight
            sx={{ '--DataGrid-overlayHeight': '200px' }}
            slots={{
              loadingOverlay: () => (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Suspense fallback={null}>
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            open={Boolean(selectedUser)}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {deleteTargetId && (
          <ConfirmDialog
            open={Boolean(deleteTargetId)}
            title="Remove team member"
            description="This will permanently deactivate the user's account. This action cannot be undone."
            confirmLabel="Remove"
            isDestructive
            isLoading={deleteUser.isPending}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTargetId(null)}
          />
        )}
      </Suspense>
    </div>
  );
}
