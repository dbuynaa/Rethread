// hooks/useVote.ts
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

interface UseVoteProps {
  initialVoteData?: { value: number };
}

export const useVote = ({ initialVoteData }: UseVoteProps) => {
  const utils = api.useUtils();
  const { toast } = useToast();
  const session = useSession();

  function handlePostVote(postId: string) {
    const { mutate: vote } = api.vote.voteMutation.useMutation({
      onMutate: async (newVote) => {
        await utils.post.getPost.cancel({ id: postId });
        await utils.post.getPosts.cancel();

        const previousPost = utils.post.getPost.getData({ id: postId });

        utils.post.getPost.setData({ id: postId }, (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            points:
              prev.points +
              (newVote.value ?? 0) -
              (initialVoteData?.value ?? 0),
            userVote: {
              value: newVote.value,
              id: '',
              userId: session.data?.user.id ?? '',
              postId: postId,
              messageId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          };
        });

        utils.post.getPosts.setData(undefined, (prev) => {
          if (!prev) return prev;
          return prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                points:
                  post.points +
                  (newVote.value ?? 0) -
                  (initialVoteData?.value ?? 0),
                userVote: {
                  value: newVote.value,
                  id: '',
                  userId: session.data?.user.id ?? '',
                  postId: postId,
                  messageId: null,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              };
            }
            return post;
          });
        });

        return { previousPost };
      },
      onError: (err, newVote, context) => {
        utils.post.getPost.setData({ id: postId }, context?.previousPost);
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      },
      onSettled: async () => {
        if (postId) await utils.post.invalidate();
      },
    });

    return vote;
  }

  function handleMessageVote(messageId: string) {
    const { mutate: vote } = api.vote.voteMutation.useMutation({
      onMutate: async (newVote) => {
        if (messageId) {
          await utils.message.getMessages.cancel();

          const previousMessages = utils.message.getMessages.getData();

          utils.message.getMessages.setData(undefined, (prev) => {
            if (!prev) return prev;
            return prev.map((message) => {
              if (message.id === messageId) {
                return {
                  ...message,
                  points:
                    message.points +
                    (newVote.value ?? 0) -
                    (initialVoteData?.value ?? 0),
                  userVote: {
                    value: newVote.value,
                    id: '',
                    userId: session.data?.user.id ?? '',
                    postId: null,
                    messageId: messageId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                };
              }
              return message;
            });
          });

          return { previousMessages };
        }
      },
      onError: (err, newVote, context) => {
        if (messageId) {
          utils.message.getMessages.setData(
            undefined,
            context?.previousMessages,
          );
        }
        toast({
          title: 'Error',
          description: err.message,
          variant: 'destructive',
        });
      },
      onSettled: async () => {
        if (messageId) await utils.message.invalidate();
      },
    });

    return vote;
  }

  return { handlePostVote, handleMessageVote };
};
