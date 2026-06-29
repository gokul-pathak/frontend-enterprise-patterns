import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { PropsWithChildren } from 'react';
import { vi } from 'vitest';

import themeReducer from '@/store/themeSlice';
import notificationsReducer from '@/store/notificationsSlice';

// Mock Next.js navigation — not available in Vitest
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
}));

export function createWrapper() {
  const testStore = configureStore({
    reducer: {
      theme: themeReducer,
      notifications: notificationsReducer,
    },
  });

  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <ReduxProvider store={testStore}>
        <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
      </ReduxProvider>
    );
  };
}
