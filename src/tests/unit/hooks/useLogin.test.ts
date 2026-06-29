import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { createWrapper } from '../../utils/testWrapper';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('useLogin', () => {
  it('returns isPending true while the mutation is in flight', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
  });

  it('calls login and navigates on success', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ email: 'admin@meridian.io', password: 'password123' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('sets isError on invalid credentials', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ email: 'admin@meridian.io', password: 'wrong-password' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('handles server error gracefully', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate({ email: 'admin@meridian.io', password: 'password123' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
