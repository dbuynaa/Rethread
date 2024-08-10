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
          channels: { connect: { id: input.channelId } },
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
      const posts = await ctx.db.post.findMany({
        where: {
          channelsId: input?.channelId,
          name: { contains: input?.search ?? '' },
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

      return posts ?? null;
    }),

  getPost: publicProcedure
    .input(postWhereInput)
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({
        where: { id: input.id },
        include: { createdBy: true },
      });

      if (!post) throw new Error('Post not found');

      return post;
    }),
});
