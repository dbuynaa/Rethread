// /server/api/routers/vote.ts

import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const voteRouter = createTRPCRouter({
  voteUpMutation: protectedProcedure
    .input(
      z.object({
        postId: z.string().optional(),
        messageId: z.string().optional(),
        value: z.number().min(-1).max(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, messageId, value } = input;
      const userId = ctx.session.user.id;

      if (!postId && !messageId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either postId or messageId must be provided',
        });
      }

      if (!postId && messageId) {
        await ctx.db.vote.create({
          data: {
            userId,
            messageId,
            value: value,
          },
        });
        await ctx.db.message.update({
          where: { id: messageId },
          data: {
            points: { increment: value },
          },
          select: { points: true },
        });
      } else if (postId && !messageId) {
        await ctx.db.vote.create({
          data: {
            userId,
            messageId,
            value: value,
          },
        });
        await ctx.db.post.update({
          where: { id: postId },
          data: {
            points: { increment: value },
          },
          select: { points: true },
        });
      } else return false;

      return true;
    }),

  voteDeleteMutation: protectedProcedure
    .input(
      z.object({
        postId: z.string().optional(),
        messageId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, messageId } = input;
      const userId = ctx.session.user.id;

      if (!postId && !messageId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either postId or messageId must be provided',
        });
      }

      if (!postId && messageId) {
        await ctx.db.vote.delete({
          where: {
            userId_messageId: {
              userId,
              messageId,
            },
          },
        });
        await ctx.db.message.update({
          where: { id: messageId },
          data: {
            points: { decrement: 1 },
          },
          select: { points: true },
        });
      } else if (postId && !messageId) {
        await ctx.db.vote.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
        await ctx.db.post.update({
          where: { id: postId },
          data: {
            points: { decrement: 1 },
          },
          select: { points: true },
        });
      } else return false;

      return true;
    }),

  getVote: publicProcedure
    .input(
      z.object({
        postId: z.string().optional(),
        messageId: z.string().optional(),
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { postId, messageId, userId } = input;
      const vote = postId
        ? ctx.db.vote.findUnique({
            where: {
              userId_postId: {
                userId,
                postId: postId,
              },
            },
            select: { value: true },
          })
        : ctx.db.vote.findUnique({
            where: {
              userId_messageId: {
                userId,
                messageId: messageId!,
              },
            },
            select: { value: true },
          });

      return vote;
    }),
});
