import { z } from 'zod';

export const messageCreateInput = z.object({
  postId: z.string(),
  content: z.string(),
});

export type MessageCreateInput = z.infer<typeof messageCreateInput>;
