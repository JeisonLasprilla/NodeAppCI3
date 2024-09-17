import { z } from 'zod';

export const CommentSchema = z.object({
  content: z.string(),
  author: z.string(),
  parentComment: z.string().nullable().optional(),
  reactions: z.array(z.object({
    type: z.enum(['like', 'love', 'disagree']),
    user: z.string()
  })).default([])
});

export type CommentInputZod = z.infer<typeof CommentSchema>;