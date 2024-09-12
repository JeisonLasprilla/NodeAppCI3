import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentComment: z.string().optional()
});

export default commentSchema;