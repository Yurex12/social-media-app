import * as z from 'zod';

export const commentSchema = z.object({
  content: z.string().max(500, 'Comment must be 500 characters or less'),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
