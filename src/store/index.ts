import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import themeReducer from './themeSlice';
import notificationsReducer from './notificationsSlice';
import profileReducer from './profileSlice';
import notesReducer from './notesSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    notifications: notificationsReducer,
    profile: profileReducer,
    notes: notesReducer,
  },
});

// Typed hooks — use these instead of raw useDispatch/useSelector everywhere.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
