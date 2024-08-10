import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import {
  messageCreateInput,
  messagesWhereInput,
  messageWhereInput,
} from '../types';

export const messageRouter = createTRPCRouter({
  create: protectedProcedure
    .input(messageCreateInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.message.create({
        data: {
          content: input.content,
          user: { connect: { id: ctx.session.user.id } },
          post: { connect: { id: input.postId } },
        },
      });
    }),

  delete: protectedProcedure
    .input(messageWhereInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.message.delete({
        where: { id: input.id },
      });
    }),

  getMessages: publicProcedure
    .input(messagesWhereInput)
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.message.findMany({
        where: { postId: input?.postId },
        include: { user: true },
      });

      return messages;
    }),
});
