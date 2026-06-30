'use client';

import { memo } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';

import type { DashboardStat } from '../types/dashboard.types';

interface StatsCardProps {
  stat: DashboardStat;
}

const trendConfig = {
  up: { icon: TrendingUpIcon, color: 'success' as const },
  down: { icon: TrendingDownIcon, color: 'error' as const },
  neutral: { icon: TrendingFlatIcon, color: 'default' as const },
};

/**
 * Memoized because the dashboard renders 4+ of these and they re-render
 * together whenever useDashboardData() returns. memo prevents unnecessary
 * DOM updates for cards whose data hasn't changed.
 */
export const StatsCard = memo(function StatsCard({ stat }: StatsCardProps) {
  const { icon: TrendIcon, color } = trendConfig[stat.trend];

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <CardContent>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
          {stat.label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
          {stat.value}
          {stat.unit && (
            <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 0.5 }}>
              {stat.unit}
            </Typography>
          )}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<TrendIcon fontSize="small" />}
            label={`${stat.change > 0 ? '+' : ''}${stat.change}%`}
            color={color}
            size="small"
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            vs last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
});
