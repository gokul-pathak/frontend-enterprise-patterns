'use client';

import { Grid, Card, CardContent, Typography, Alert } from '@mui/material';

import { PageHeader } from '@/shared/components/PageHeader';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { DashboardSkeleton } from './DashboardSkeleton';
import { useDashboardData } from '../hooks/useDashboardData';
import { NotificationPrompt } from '@/features/notifications/components/NotificationPrompt';

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardData();

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Failed to load dashboard data. Please refresh the page.
      </Alert>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your organization's pulse at a glance."
        breadcrumbs={[{ label: 'Meridian' }, { label: 'Dashboard' }]}
      />

      <NotificationPrompt />

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
