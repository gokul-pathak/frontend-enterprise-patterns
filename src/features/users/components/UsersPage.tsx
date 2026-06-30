'use client';

import { useState, useMemo, useCallback } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/components/Avatar';
import { Button } from '@/shared/components/Button';
import { Person as PersonIcon } from '@mui/icons-material';
import { useConnections } from '../hooks/useUsers';
import { ConnectionDetailModal } from './ConnectionDetailModal';
import type { GitHubConnection, ConnectionType } from '../types/user.types';

export function UsersPage() {
  const [selectedConnection, setSelectedConnection] = useState<GitHubConnection | null>(null);
  const [connectionType, setConnectionType] = useState<ConnectionType>('followers');

  const { data, isLoading } = useConnections({
    type: connectionType,
    first: 50,
  });

  const handleCloseModal = useCallback(() => {
    setSelectedConnection(null);
  }, []);

  const columns: GridColDef<GitHubConnection>[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'User',
        flex: 1.5,
        minWidth: 200,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              name={params.row.name || params.row.login}
              src={params.row.avatarUrl}
              size={32}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2, mb: 0.5 }} noWrap>
                {params.row.name || params.row.login}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }} noWrap>
                @{params.row.login}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'company',
        headerName: 'Company',
        flex: 1,
        minWidth: 150,
        valueGetter: (params, row) => row.company || '—',
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        minWidth: 120,
        valueGetter: (params, row) => row.location || '—',
      },
      {
        field: 'bio',
        headerName: 'Bio',
        flex: 2,
        minWidth: 250,
        valueGetter: (params, row) => row.bio || '—',
      },
      {
        field: 'actions',
        headerName: '',
        width: 100,
        sortable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="text"
            startIcon={<PersonIcon />}
            onClick={() => setSelectedConnection(params.row)}
            aria-label={`View ${params.row.name || params.row.login}`}
          >
            View
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Connections"
        description="View your GitHub followers and following list."
        breadcrumbs={[{ label: 'GitHub Stats' }, { label: 'Connections' }]}
      />

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={connectionType}
            onChange={(_, newValue) => setConnectionType(newValue)}
            aria-label="connection tabs"
            sx={{ px: 2 }}
          >
            <Tab label="Followers" value="followers" />
            <Tab label="Following" value="following" />
          </Tabs>
        </Box>
        <CardContent>
          <DataGrid
            rows={data ?? []}
            columns={columns}
            loading={isLoading}
            disableRowSelectionOnClick
            hideFooterPagination
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

      <ConnectionDetailModal
        connection={selectedConnection}
        open={Boolean(selectedConnection)}
        onClose={handleCloseModal}
      />
    </div>
  );
}
