'use client';

import { Grid, Card, CardContent, Typography, Alert, Box } from '@mui/material';
import { Button } from '@/shared/components/Button';

import { PageHeader } from '@/shared/components/PageHeader';
import { StatsCard } from './StatsCard';
import { DashboardSkeleton } from './DashboardSkeleton';
import { useDashboardData } from '../hooks/useDashboardData';
import dynamic from 'next/dynamic';

const RecentActivity = dynamic(() => import('./RecentActivity').then(mod => mod.RecentActivity), {
  loading: () => <DashboardSkeleton />,
});

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardData();

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        <Alert severity="error" sx={{ width: '100%' }}>
          Failed to load dashboard data. Please check your connection.
        </Alert>
        <Button variant="outlined" onClick={() => refetch()}>
          Retry Request
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your GitHub pulse at a glance."
        breadcrumbs={[{ label: 'GitHub Stats' }, { label: 'Dashboard' }]}
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {data?.stats.map((stat) => (
          <Grid key={stat.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatsCard stat={stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Recent Activity
              </Typography>
              <RecentActivity items={data?.recentActivity ?? []} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Stats
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data?.stats.length} metrics tracked across {data?.recentActivity.length} recent events.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
