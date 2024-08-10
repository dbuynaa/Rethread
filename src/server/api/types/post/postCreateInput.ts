import { z } from 'zod';

export const postCreateInput = z.object({
  name: z.string(),
  channelId: z.string(),
  content: z.string(),
});
