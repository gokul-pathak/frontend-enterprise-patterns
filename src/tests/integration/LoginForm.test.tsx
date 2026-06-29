import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWrapper } from '../utils/testWrapper';
import { LoginForm } from '@/features/auth/components/LoginForm';

describe('LoginForm integration', () => {
  it('renders email and password fields', () => {
    const Wrapper = createWrapper();
    render(<LoginForm />, { wrapper: Wrapper });

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    const Wrapper = createWrapper();
    render(<LoginForm />, { wrapper: Wrapper });

    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email format', async () => {
    const user = userEvent.setup();
    const Wrapper = createWrapper();
    render(<LoginForm />, { wrapper: Wrapper });

    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });

  it('submits successfully with valid credentials', async () => {
    const user = userEvent.setup();
    const Wrapper = createWrapper();
    render(<LoginForm />, { wrapper: Wrapper });

    await user.type(screen.getByLabelText(/email address/i), 'admin@meridian.io');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('quick-login buttons trigger login with correct credentials', async () => {
    const user = userEvent.setup();
    const Wrapper = createWrapper();
    render(<LoginForm />, { wrapper: Wrapper });

    await user.click(screen.getByRole('button', { name: /sign in as admin/i }));

    await waitFor(() => {
      // After successful login, the mutation should not be in error state
      const errorAlert = screen.queryByRole('alert');
      expect(errorAlert).not.toBeInTheDocument();
    });
  });
});
