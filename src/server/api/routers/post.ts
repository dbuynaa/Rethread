import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { postCreateInput, postsWhereInput, postWhereInput } from '../types';

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(postCreateInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: {
          name: input.name,
          content: input.content,
          createdBy: { connect: { id: ctx.session.user.id } },
          channel: { connect: { id: input.channelId } },
        },
      });
    }),
  delete: protectedProcedure
    .input(postWhereInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.delete({ where: { id: input.id } });
    }),

  update: protectedProcedure
    .input(postCreateInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.update({
        where: { id: input.id },
        data: {
          name: input.name,
          content: input.content,
        },
      });
    }),

  getPosts: publicProcedure
    .input(postsWhereInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      const posts = await ctx.db.post.findMany({
        where: {
          channelId: input?.channelId,
          name: { contains: input?.search ?? '' },
        },
        include: {
          votes: {
            where: { userId: userId },
          },
        },
        orderBy: [
          {
            points: 'desc',
          },
          {
            votes: {
              _count: 'desc',
            },
          },
          {
            createdAt: 'desc',
          },
        ],
      });

      return posts.map((post) => {
        return {
          ...post,
          userVote: post.votes?.[0],
        };
      });
    }),

  getPost: publicProcedure
    .input(postWhereInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      const post = await ctx.db.post.findFirst({
        where: { id: input.id },
        include: {
          createdBy: true,
          votes: {
            where: { userId: userId },
          },
        },
      });

      if (!post) throw new Error('Post not found');

      return {
        ...post,
        userVote: post.votes?.[0],
      };
    }),
});
