import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/province is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/, 'Please enter a valid phone number').or(z.literal('')),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters'),
  department: z.string().min(1, 'Department is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  address: addressSchema,
  linkedIn: z.string().url('Please enter a valid URL').or(z.literal('')),
  github: z.string().url('Please enter a valid URL').or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
