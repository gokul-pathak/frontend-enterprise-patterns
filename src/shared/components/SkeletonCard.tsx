'use client';

import { Skeleton, Card, CardContent } from '@mui/material';

interface SkeletonCardProps {
  lines?: number;
}

export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="rectangular" width={80} height={16} sx={{ mb: 2, borderRadius: 1 }} />
        <Skeleton variant="rectangular" width="60%" height={32} sx={{ mb: 1, borderRadius: 1 }} />
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={i === lines - 2 ? '40%' : '100%'}
            sx={{ fontSize: '0.875rem' }}
          />
        ))}
      </CardContent>
    </Card>
  );
}
