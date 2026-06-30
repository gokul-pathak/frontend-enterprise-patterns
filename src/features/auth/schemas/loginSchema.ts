import { z } from 'zod';

/**
 * Zod schema for the login form.
 *
 * Why Zod over manual validation?
 * - Single source of truth: schema defines both the TypeScript type and the
 *   runtime validation logic. No risk of them drifting apart.
 * - Composable: we can extend or reuse schemas across features.
 * - Works with React Hook Form's resolver — no validation boilerplate in the component.
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
