'use client';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { AuthGuard } from '@/features/auth';
import { Avatar } from '@/shared/components/Avatar';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTheme } from '@/store/themeSlice';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { label: 'People', href: '/users', icon: <PeopleIcon /> },
  { label: 'My Profile', href: '/profile', icon: <PersonIcon /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar sx={{ px: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", letterSpacing: "-0.02em" }}>
            Meridian
          </Typography>
        </Toolbar>
        <Divider />
        <List sx={{ px: 1, pt: 1, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={pathname === item.href}
                sx={{
                  borderRadius: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': { color: 'inherit' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {user && <Avatar name={user.name} src={user.avatarUrl} size={32} />}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.role}
            </Typography>
          </Box>
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar
          position="static"
          elevation={0}
          color="transparent"
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Toolbar sx={{ gap: 1, justifyContent: 'flex-end' }}>
            <IconButton
              onClick={() => dispatch(toggleTheme())}
              aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton
              onClick={() => signOut({ callbackUrl: '/login' })}
              aria-label="Sign out"
              id="logout-button"
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: 3, bgcolor: 'background.default' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
