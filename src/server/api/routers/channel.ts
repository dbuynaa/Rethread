
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";

export const channelRouter = createTRPCRouter({
    getChannels: publicProcedure
    .input(z.object({ take: z.number().optional(), skip: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
    const {take, skip} = input ?? {}
    const channel = await ctx.db.channel.findMany({
      orderBy: { createdAt: "desc" },
      take: take ?? 20,
      skip: skip ? take ?? 20 * skip + 1 : 0,
    });
      
    return channel ?? null;
  }),
   create: protectedProcedure
     .input(z.object({ name: z.string().min(1) }))
     .mutation(async ({ ctx, input }) => {
      console.log('ctx.session.user.id', ctx.session.user.id)
       return ctx.db.channel.create({
         data: {
           name: input.name,
           members: { create: { userId: ctx.session.user.id } },
           createdAt: new Date(),
         },
       });
     
     }),
 
   getSecretMessage: protectedProcedure.query(() => {
     return "you can now see this secret message!";
   }),
 })