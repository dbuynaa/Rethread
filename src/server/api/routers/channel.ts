import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "@/server/api/trpc";
import { CreateChannelInput } from "../types";
import { channelsWhereInput, channelWhereInput } from "../types/channel";

export const channelRouter = createTRPCRouter({
    getChannels: publicProcedure
    .input( channelsWhereInput)
    .query(async ({ ctx, input }) => {
    const {take, skip} = input ?? {}
    const channel = await ctx.db.channel.findMany({
      orderBy: { createdAt: "desc" },
      take: take ?? 20,
      skip: skip ? take ?? 20 * skip + 1 : 0,
    });
      
    return channel ?? null;
  }),

  channelDetail: publicProcedure
    .input(channelWhereInput)
    .query(async ({ ctx, input }) => {
      const channel = await ctx.db.channel.findUnique({
        where: { id: input.id },
      });
      if(!channel) throw new Error('Channel not found')
      return channel;
    }),
    
   create: protectedProcedure
     .input(CreateChannelInput)
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
 })