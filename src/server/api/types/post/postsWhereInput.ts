import { z } from 'zod';

export const postsWhereInput = z
  .object({
    channelId: z.string().optional(),
    search: z.string().optional(),
    postId: z.string().optional(),
  })
  .optional();
export const postWhereInput = z.object({ id: z.string() });
