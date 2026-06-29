import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/shared/components/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('shows loading spinner and loading text when isLoading is true', () => {
    render(<Button isLoading loadingText="Saving…">Save</Button>);
    // The loading text replaces children
    expect(screen.getByText('Saving…')).toBeInTheDocument();
    // Spinner is present (aria-hidden to not duplicate the text in screen reader)
    const spinner = document.querySelector('[aria-hidden="true"]');
    expect(spinner).toBeInTheDocument();
  });

  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
