import { z } from 'zod';

export const CommentSchema = z.object({
  content: z.string({ required_error: "Content is required" }),
  author: z.string({ required_error: "Author is required" }).refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Author must be a valid ObjectId",
  }),
  parentComment: z.string().nullable().refine((val) => val === null || /^[0-9a-fA-F]{24}$/.test(val), {
    message: "ParentComment must be a valid ObjectId",
  }),
  reactions: z.array(z.object({
    type: z.enum(['like', 'love', 'disagree'], { required_error: "Reaction type is required" }),
    user: z.string({ required_error: "User is required" }).refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "User must be a valid ObjectId",
    }),
  })).optional(),
}).strict();

export type CommentInputZod = z.infer<typeof CommentSchema>;