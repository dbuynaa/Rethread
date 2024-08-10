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
      const { postId, messageId, value } = input;
      const userId = ctx.session.user.id;

      if (!postId && !messageId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either postId or messageId must be provided',
        });
      }

      // Use a transaction to ensure data consistency
      return ctx.db.$transaction(async (tx) => {
        let existingVote;
        if (postId) {
          existingVote = await tx.vote.findUnique({
            where: {
              userId_postId: {
                userId,
                postId: postId,
              },
            },
          });
        } else if (messageId) {
          existingVote = await tx.vote.findUnique({
            where: {
              userId_messageId: {
                userId,
                messageId: messageId,
              },
            },
          });
        }

        let pointsChange = value;

        if (existingVote) {
          if (existingVote.value === value) {
            // Remove vote if clicking the same button
            await tx.vote.delete({
              where: { id: existingVote.id },
            });
            pointsChange = -value;
          } else {
            // Change vote
            await tx.vote.update({
              where: { id: existingVote.id },
              data: { value },
            });
            pointsChange = value - existingVote.value;
          }
        } else {
          // Create new vote
          await tx.vote.create({
            data: {
              userId,
              postId,
              messageId,
              value,
            },
          });
        }

        let points;
        if (postId) {
          const updatedTarget = await tx.post.update({
            where: { id: postId },
            data: {
              points: { increment: pointsChange },
            },
            select: { points: true },
          });
          points = updatedTarget.points;
        } else if (messageId) {
          const updatedTarget = await tx.message.update({
            where: { id: messageId },
            data: {
              points: { increment: pointsChange },
            },
            select: { points: true },
          });
          points = updatedTarget.points;
        }
        return {
          success: true,
          // userVote: existingVote
          //   ? existingVote.value === value
          //     ? 0
          //     : value
          //   : value,
          points: points,
        };
      });
    }),

  getVote: protectedProcedure
    .input(
      z.object({
        postId: z.string().optional(),
        messageId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { postId, messageId } = input;
      const userId = ctx.session.user.id;

      const [vote, target] = await Promise.all([
        postId
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
            }),
        postId
          ? ctx.db.post.findUnique({
              where: { id: postId },
              select: { points: true },
            })
          : ctx.db.message.findUnique({
              where: { id: messageId },
              select: { points: true },
            }),
      ]);

      return {
        userVote: vote?.value ?? 0,
        points: target?.points ?? 0,
      };
    }),
});
