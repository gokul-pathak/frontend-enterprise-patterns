import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWrapper } from '../utils/testWrapper';
import { LoginForm } from '@/features/auth/components/LoginForm';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

describe('LoginForm integration', () => {
  it('renders GitHub login button', () => {
    const Wrapper = createWrapper();
    render(<LoginForm />, { wrapper: Wrapper });

    expect(screen.getByRole('button', { name: /sign in with github/i })).toBeInTheDocument();
  });

  it('calls signIn on click', async () => {
    const { signIn } = await import('next-auth/react');
    const user = userEvent.setup();
    const Wrapper = createWrapper();
    render(<LoginForm />, { wrapper: Wrapper });

    await user.click(screen.getByRole('button', { name: /sign in with github/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('github', { callbackUrl: '/dashboard' });
    });
  });
});
