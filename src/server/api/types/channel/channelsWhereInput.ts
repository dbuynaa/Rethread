import { z } from 'zod';

const channelsWhereInput = z
  .object({ take: z.number().optional(), skip: z.number().optional() })
  .optional();

const channelWhereInput = z.object({ id: z.string() });

export { channelsWhereInput, channelWhereInput };
