import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
  id: string;
  message: string;
  severity: NotificationSeverity;
}

interface NotificationsState {
  queue: AppNotification[];
}

const initialState: NotificationsState = {
  queue: [],
};

/**
 * Notification queue drives the global Snackbar component.
 * Adding to this slice from anywhere (API error handlers, feature code) means
 * the notification system is completely decoupled from the UI tree.
 */
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    enqueueNotification: (state, action: PayloadAction<Omit<AppNotification, 'id'>>) => {
      state.queue.push({
        id: Date.now().toString(),
        ...action.payload,
      });
    },
    dequeueNotification: (state) => {
      state.queue.shift();
    },
  },
});

export const { enqueueNotification, dequeueNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
