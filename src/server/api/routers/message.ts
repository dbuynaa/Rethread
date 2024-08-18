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
import EventEmitter from 'events';
import { type Message } from '@prisma/client';
import { observable } from '@trpc/server/observable';

const ee = new EventEmitter();

export const messageRouter = createTRPCRouter({
  onAdd: protectedProcedure.subscription(() => {
    // return an `observable` with a callback which is triggered immediately
    return observable<Message>((emit) => {
      const onAdd = (data: Message) => {
        // emit data to client
        emit.next(data);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on('add', onAdd);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off('add', onAdd);
      };
    });
  }),
  add: protectedProcedure
    .input(messageCreateInput)
    .mutation(async ({ ctx, input }) => {
      ee.emit(
        'add',
        await ctx.db.message.create({
          data: {
            content: input.content,
            user: { connect: { id: ctx.session.user.id } },
            post: { connect: { id: input.postId } },
          },
        }),
      );
    }),
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
      const userId = ctx.session?.user.id;
      const messages = await ctx.db.message.findMany({
        where: { postId: input?.postId },
        include: {
          user: true,
          votes: { where: { userId: userId } },
        },
        orderBy: [
          { points: 'desc' },
          { votes: { _count: 'desc' } },
          { createdAt: 'desc' },
        ],
      });

      return messages.map((message) => {
        return {
          ...message,
          userVote: message.votes?.[0],
        };
      });
    }),
});
