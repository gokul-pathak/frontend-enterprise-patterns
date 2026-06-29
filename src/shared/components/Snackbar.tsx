'use client';

import { Snackbar as MuiSnackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store';
import { dequeueNotification } from '@/store/notificationsSlice';

/**
 * Global snackbar driven by the Redux notifications queue.
 *
 * Connected to the store so any code (hooks, interceptors, service workers)
 * can trigger a toast by dispatching enqueueNotification without needing
 * access to a React context.
 */
export function GlobalSnackbar() {
  const dispatch = useAppDispatch();
  const queue = useAppSelector((state) => state.notifications.queue);
  const current = queue[0];

  function handleClose(_: React.SyntheticEvent | Event, reason?: string) {
    if (reason === 'clickaway') return;
    dispatch(dequeueNotification());
  }

  return (
    <MuiSnackbar
      open={Boolean(current)}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      {current ? (
        <Alert
          onClose={handleClose}
          severity={current.severity}
          variant="filled"
          sx={{ width: '100%' }}
          role="alert"
        >
          {current.message}
        </Alert>
      ) : (
        <span />
      )}
    </MuiSnackbar>
  );
}
