import { z } from 'zod';

export const messagesWhereInput = z
  .object({
    postId: z.string().optional(),
    channelId: z.string().optional(),
    search: z.string().optional(),
  })
  .optional();
export const messageWhereInput = z.object({
  id: z.string(),
  postId: z.string().optional(),
});
