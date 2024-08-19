// hooks/useVote.ts
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

type VoteFunction = (id: string, value: number) => void;

export const useVote = () => {
  const utils = api.useUtils();
  const { toast } = useToast();
  const session = useSession();

  const postVoteMutation = api.vote.voteMutation.useMutation({
    onMutate: async ({ postId, value }) => {
      if (!postId) return;
      await utils.post.getPost.cancel({ id: postId });
      await utils.post.getPosts.cancel();

      const previousPost = utils.post.getPost.getData({ id: postId });

      utils.post.getPost.setData({ id: postId }, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          points: prev.points + value - (previousPost?.userVote?.value ?? 0),
          userVote: {
            value,
            id: '',
            userId: session.data?.user.id ?? '',
            postId,
            messageId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };
      });

      utils.post.getPosts.setData(undefined, (prev) => {
        if (!prev) return prev;
        return prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                points:
                  post.points + value - (previousPost?.userVote?.value ?? 0),
                userVote: {
                  value,
                  id: '',
                  userId: session.data?.user.id ?? '',
                  postId,
                  messageId: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              }
            : post,
        );
      });

      return { previousPost };
    },
    onError: (err, { postId }, context) => {
      utils.post.getPost.setData({ id: postId! }, context?.previousPost);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSettled: async () => {
      await utils.post.invalidate();
    },
  });

  const messageVoteMutation = api.vote.voteMutation.useMutation({
    onMutate: async ({ messageId, value }) => {
      await utils.message.getMessages.cancel();

      const previousMessages = utils.message.getMessages.getData();

      utils.message.getMessages.setData(undefined, (prev) => {
        if (!prev) return prev;
        return prev.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              points: message.points + value - (message.userVote?.value ?? 0),
              userVote: {
                value,
                id: '',
                userId: session.data?.user.id ?? '',
                postId: null,
                messageId,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            };
          }
          return message;
        });
      });

      return { previousMessages };
    },
    onError: (err, { messageId }, context) => {
      if (messageId) {
        utils.message.getMessages.setData(undefined, context?.previousMessages);
      }
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSettled: async () => {
      await utils.message.invalidate();
    },
  });

  const handlePostVote: VoteFunction = useCallback(
    (postId: string, value: number) => {
      postVoteMutation.mutate({ postId, value });
    },
    [postVoteMutation],
  );

  const handleMessageVote: VoteFunction = useCallback(
    (messageId: string, value: number) => {
      messageVoteMutation.mutate({ messageId, value });
    },
    [messageVoteMutation],
  );

  return { handlePostVote, handleMessageVote };
};
