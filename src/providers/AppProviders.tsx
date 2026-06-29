'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { useMemo, useEffect, useState } from 'react';

import { store, useAppSelector, useAppDispatch } from '@/store';
import { initTheme } from '@/store/themeSlice';
import { initNotes } from '@/store/notesSlice';
import { queryClient } from '@/lib/queryClient';
import { GlobalSnackbar } from '@/shared/components/Snackbar';
import { NextAuthProvider } from './NextAuthProvider';

/**
 * Composition root for all app-wide providers.
 *
 * Order matters:
 * - ReduxProvider must wrap everything (store is used by AuthInitializer + ThemeProvider)
 * - QueryClientProvider before any component that uses useQuery
 * - ThemeProvider after Redux so it can read the theme slice
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <NextAuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <MuiThemeProvider>
              <CssBaseline />
              {children}
              <GlobalSnackbar />
            </MuiThemeProvider>
          </AppRouterCacheProvider>
          {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
      </NextAuthProvider>
    </ReduxProvider>
  );
}

/**
 * Separate component so it can read from Redux (which requires being inside ReduxProvider).
 * Creates a MUI theme based on the Redux theme slice.
 */
function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(initTheme());
    dispatch(initNotes());
    setMounted(true);
  }, [dispatch]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#818cf8' : '#4f46e5',
            light: '#a5b4fc',
            dark: '#3730a3',
          },
          secondary: {
            main: mode === 'dark' ? '#34d399' : '#059669',
          },
          background: {
            default: mode === 'dark' ? '#0f172a' : '#f8fafc',
            paper: mode === 'dark' ? '#1e293b' : '#ffffff',
          },
        },
        shape: {
          borderRadius: 8,
        },
        typography: {
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [mode],
  );

  // Prevent hydration mismatch by rendering a hidden/invisible app until theme loads,
  // or just render using the default (server) theme and swap immediately after mount.
  // We'll let it swap to avoid a blank screen, but MUI handles this reasonably well.
  return (
    <ThemeProvider theme={theme}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeProvider>
  );
}
