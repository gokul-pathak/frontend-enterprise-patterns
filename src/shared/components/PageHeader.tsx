'use client';

import { Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 0.5 }}
          >
            {breadcrumbs.map((crumb, index) =>
              crumb.href ? (
                <MuiLink
                  key={index}
                  component={Link}
                  href={crumb.href}
                  underline="hover"
                  color="inherit"
                  variant="body2"
                >
                  {crumb.label}
                </MuiLink>
              ) : (
                <Typography key={index} variant="body2" color="text.primary">
                  {crumb.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>
        )}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
    </Box>
  );
}
