// /components/core/Vote.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { api } from '@/trpc/react';
import { cn } from '@/lib/utils';
import { useToast } from '../ui/use-toast';
import { useSession } from 'next-auth/react';

interface VoteProps {
  postId?: string;
  messageId?: string;
  points?: number;
  voteData?: { value: number };
  className?: string;
}

export const Vote: React.FC<VoteProps> = ({
  className,
  points: initialPoints,
  voteData: previousVote,
  postId,
  messageId,
}) => {
  const utils = api.useUtils();
  const [points, setPoints] = useState(initialPoints ?? 0);
  const [voteData, setVoteData] = useState(previousVote);
  const { toast } = useToast();
  const session = useSession();

  console.log('voteData', voteData);
  const { mutate: vote } = api.vote.voteMutation.useMutation({
    onMutate: async (newVote) => {
      try {
        await utils.vote.getVote.cancel({ postId, messageId });

        // Update points optimistically
        setPoints((prev) => {
          const diff = (newVote.value ?? 0) - (previousVote?.value ?? 0);
          return prev + diff;
        });
        setVoteData(newVote);

        // Return a context object with the snapshotted value
        return { previousVote };
      } catch (error) {
        console.error('Error during optimistic update:', error);
      }
      // Cancel outgoing refetches
    },
    onError: (err, newVote, context) => {
      // Revert the optimistic update
      utils.vote.getVote.setData({ postId, messageId }, context?.previousVote);
      setPoints((prev) => {
        const diff = (context?.previousVote?.value ?? 0) - (newVote.value ?? 0);
        return prev + diff;
      });
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
