'use client';

import { forwardRef } from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'children'> {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

/**
 * Thin wrapper around MUI Button that adds a consistent loading state.
 * Why wrap instead of using MUI directly? Two reasons:
 * 1. Uniform loading pattern — every button in the app behaves the same way.
 * 2. Single place to change if we ever swap the underlying component library.
 *
 * We intentionally expose all MUI ButtonProps so callers aren't restricted.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, isLoading = false, loadingText, disabled, ...props }, ref) => {
    return (
      <MuiButton ref={ref} disabled={disabled || isLoading} {...props}>
        {isLoading ? (
          <>
            <CircularProgress
              size={16}
              color="inherit"
              sx={{ mr: 1 }}
              aria-hidden="true"
            />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </MuiButton>
    );
  },
);

Button.displayName = 'Button';
