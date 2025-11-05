// Login Form Schema

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  
  password: z
    .string()
    .min(1, 'Password is required'),
  
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
