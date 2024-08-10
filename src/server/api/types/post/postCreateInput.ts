import { z } from 'zod';

export const postCreateInput = z.object({
  id: z.string().optional(),
  name: z.string(),
  channelId: z.string(),
  content: z.string(),
});
