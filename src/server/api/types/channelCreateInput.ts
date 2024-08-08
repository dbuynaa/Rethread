import { z } from "zod";

export const CreateChannelInput = z.object({ name: z.string().min(1).max(50) })