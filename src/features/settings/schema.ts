import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/constants';
import z from 'zod';

export const usernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(
      MIN_USERNAME_LENGTH,
      `Username must be at least ${MIN_USERNAME_LENGTH} characters.`,
    )
    .max(
      MAX_USERNAME_LENGTH,
      `Username cannot exceed ${MAX_USERNAME_LENGTH} characters.`,
    )
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Only letters, numbers, and underscores are allowed.',
    )
    .regex(/[a-zA-Z]/, 'Username must contain at least one letter.'),
});

export type UsernameFormValues = z.infer<typeof usernameSchema>;
