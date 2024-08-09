import { z } from "zod";

export const postWhereInput = z.object({ channelId: z.string().optional(), search: z.string().optional() }).optional()