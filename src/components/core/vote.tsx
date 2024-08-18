// /components/core/Vote.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { api } from '@/trpc/react';
import { cn } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { useSession } from 'next-auth/react';

interface VoteProps {
  postId?: string;
  messageId?: string;
  className?: string;
  points?: number;
  voteData?: { value: number };
}

export const Vote: React.FC<VoteProps> = ({
  className,
  postId,
  messageId,
  points,
  voteData,
}) => {
  const utils = api.useUtils();
  const { toast } = useToast();
  const session = useSession();

  console.log('voteData', voteData);
  const { mutate: vote } = api.vote.voteMutation.useMutation({
    onMutate: async (newVote) => {
      try {
        if (postId) {
          await utils.post.getPost.cancel({ id: postId });
          await utils.post.getPosts.cancel();
          utils.post.getPost.setData({ id: postId }, (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              points:
                prev.points + (newVote.value ?? 0) - (voteData?.value ?? 0),
              userVote: prev.userVote
                ? {
                    ...prev.userVote, // spread the existing userVote object
                    value: newVote.value, // update the value
                  }
                : {
                    value: newVote.value, // update the value
                    id: '',
                    userId: session.data?.user.id ?? '',
                    postId: postId,
                    messageId: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
            };
          });
          const updatedPost = utils.post.getPost.getData({ id: postId });
          utils.post.getPosts.setData(undefined, (prev) => {
            if (!prev) return prev;
            return prev.map((post) => {
              if (post.id === updatedPost?.id) {
                return updatedPost;
              }
              return post;
            });
          });
        }
        if (messageId) {
          await utils.message.getMessages.cancel();
          utils.message.getMessages.setData(undefined, (prev) => {
            if (!prev) return prev;
            return prev.map((message) => {
              if (message.id === messageId) {
                return {
                  ...message,
                  points:
                    message.points +
                    (newVote.value ?? 0) -
                    (voteData?.value ?? 0),
                  userVote: message.userVote
                    ? {
                        ...message.userVote, // spread the existing userVote object
                        value: newVote.value, // update the value
                      }
                    : {
                        value: newVote.value, // update the value
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
        }

        // Return a context object with the snapshotted value
        return { voteData };
      } catch (error) {
        console.error('Error during optimistic update:', error);
      }
      // Cancel outgoing refetches
    },
    onError: (err, newVote, context) => {
      // Revert the optimistic update
      if (postId) {
        utils.post.getPost.setData({ id: postId }, (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            points:
              prev.points -
              (newVote.value ?? 0) +
              (context?.voteData?.value ?? 0),
            userVote: prev.userVote
              ? {
                  ...prev.userVote, // spread the existing userVote object
                  value: context?.voteData?.value ?? 0, // update the value
                }
              : undefined,
          };
        });
      }
      if (messageId) {
        utils.message.getMessages.setData(undefined, (prev) => {
          if (!prev) return prev;
          return prev.map((message) => {
            if (message.id === messageId) {
              return {
                ...message,
                points:
                  message.points -
                  (newVote.value ?? 0) +
                  (context?.voteData?.value ?? 0),
                userVote: message.userVote
                  ? {
                      ...message.userVote, // spread the existing userVote object
                      value: context?.voteData?.value ?? 0, // update the value
                    }
                  : undefined,
              };
            }
            return message;
          });
        });
      }

      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      console.log('Error during optimistic update:', err);
    },
    onSettled: () => {
      // Refetch after error or success
      if (postId) void utils.post.invalidate();
      if (messageId) void utils.message.invalidate();
    },
  });

  const handleVote = (value: number) => {
    if (!session.data?.user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to vote',
        variant: 'destructive',
      });
      return;
    } else vote({ postId, messageId, value });
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleVote(voteData?.value === 1 ? 0 : 1);
        }}
        className={`${
          voteData?.value === 1 ? 'text-green-500 hover:text-green-600' : ''
        }`}
        variant={'ghost'}
        // variant={voteData?.value === 1 ? 'default' : 'ghost'}
        size="sm"
      >
        <ArrowUpIcon />
      </Button>
      <span>{points ?? 0}</span>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleVote(voteData?.value === -1 ? 0 : -1);
        }}
        className={`${
          voteData?.value === -1 ? 'text-red-500 hover:text-red-600' : ''
        }`}
        variant={'ghost'}
        // variant={voteData?.value === -1 ? 'default' : 'ghost'}
        size="sm"
      >
        <ArrowDownIcon />
      </Button>
    </div>
  );
};
