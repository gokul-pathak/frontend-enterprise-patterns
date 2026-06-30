'use client';

import { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type InputProps = TextFieldProps & {
  errorMessage?: string;
};

/**
 * React Hook Form-aware text input.
 *
 * Accepts a ref (required for RHF's register()) and an errorMessage prop that
 * maps directly to MUI's helperText + error state. This eliminates the
 * boilerplate of wiring fieldState.error in every form field.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ errorMessage, ...props }, ref) => {
  // MUI TextField automatically assigns aria-describedby and aria-invalid
  // when 'error' and 'helperText' are provided, ensuring WCAG compliance natively.
  return (
    <TextField
      inputRef={ref}
      error={Boolean(errorMessage)}
      helperText={errorMessage}
      fullWidth
      variant="outlined"
      size="medium"
      {...props}
    />
  );
});

Input.displayName = 'Input';
