// /server/api/routers/vote.ts

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const voteRouter = createTRPCRouter({
  voteMutation: protectedProcedure
    .input(
      z.object({
        postId: z.string().optional(),
        messageId: z.string().optional(),
        value: z.number().min(-1).max(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { postId, messageId, value } = input;

      if (!postId && !messageId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either postId or messageId must be provided',
        });
      }

      // Check if the user has already voted
      const existingVote = postId
        ? await ctx.db.vote.findUnique({
            where: {
              userId_postId: {
                userId,
                postId: postId,
              },
            },
          })
        : await ctx.db.vote.findUnique({
            where: {
              userId_messageId: {
                userId,
                messageId: messageId!,
              },
            },
          });

      if (existingVote) {
        // Update existing vote
        if (value === 0) {
          // Remove vote if value is 0
          await ctx.db.vote.delete({
            where: {
              id: existingVote.id,
            },
          });
        } else {
          // Update vote value
          await ctx.db.vote.update({
            where: {
              id: existingVote.id,
            },
            data: {
              value,
            },
          });
        }
      } else if (value !== 0) {
        // Create new vote if it doesn't exist and value is not 0
        await ctx.db.vote.create({
          data: {
            userId,
            postId,
            messageId,
            value,
          },
        });
      }

      // Update the points on the post or message
      if (postId) {
        await ctx.db.post.update({
          where: { id: postId },
          data: {
            points: {
              increment: value - (existingVote?.value ?? 0),
            },
          },
        });
      } else if (messageId) {
        await ctx.db.message.update({
          where: { id: messageId },
          data: {
            points: {
              increment: value - (existingVote?.value ?? 0),
            },
          },
        });
      }

      return { success: true };
    }),

  getVote: protectedProcedure
    .input(
      z.object({
        postId: z.string().optional(),
        messageId: z.string().optional(),
        // userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { postId, messageId } = input;
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
