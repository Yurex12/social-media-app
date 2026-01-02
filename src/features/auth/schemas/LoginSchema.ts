import * as z from 'zod';

export const loginSchema = z.object({
  identifier: z.union([
    z.email('Please enter a valid email address.').trim().toLowerCase(),
    z.string().trim().min(1, 'Username is required.'),
  ]),
  password: z.string().trim().nonempty('Password is required'),
  rememberMe: z.boolean(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
