'use client';

import { Grid, Skeleton, Card, CardContent, Box } from '@mui/material';

export function DashboardSkeleton() {
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Skeleton width={80} height={14} sx={{ mb: 1 }} />
                <Skeleton width={120} height={36} sx={{ mb: 1 }} />
                <Skeleton width={60} height={20} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Skeleton width={160} height={24} sx={{ mb: 2 }} />
              {Array.from({ length: 5 }).map((_, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={36} height={36} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="60%" height={16} sx={{ mb: 0.5 }} />
                    <Skeleton width="40%" height={14} />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Skeleton width={120} height={24} sx={{ mb: 2 }} />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} width="100%" height={40} sx={{ mb: 1 }} />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
