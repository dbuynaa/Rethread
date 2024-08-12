// /components/core/Vote.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { api } from '@/trpc/react';
import { cn } from '@/lib/utils';
import { useToast } from '../ui/use-toast';

interface VoteProps {
  postId?: string;
  messageId?: string;
  userId: string;
  points?: number;
  className?: string;
}

export const Vote: React.FC<VoteProps> = ({
  postId,
  messageId,
  userId,
  className,
  points: initialPoints,
}) => {
  const utils = api.useUtils();
  const [points, setPoints] = React.useState(initialPoints ?? 0);
  const { toast } = useToast();

  const { data: voteData } = api.vote.getVote.useQuery(
    { postId, messageId, userId },
    { enabled: !!((postId ?? messageId) && userId) },
  );

  const { mutate: vote } = api.vote.voteMutation.useMutation({
    onMutate: async (newVote) => {
      // Cancel outgoing refetches
      await utils.vote.getVote.cancel({ postId, messageId, userId });

      // Snapshot the previous value
      const previousVote = utils.vote.getVote.getData({
        postId,
        messageId,
        userId,
      });

      // Optimistically update to the new value
      utils.vote.getVote.setData(
        { postId, messageId, userId },
        { value: newVote.value },
      );

      // Update points optimistically
      setPoints((prev) => {
        const diff = (newVote.value ?? 0) - (previousVote?.value ?? 0);
        return prev + diff;
      });

      return { previousVote };
    },
    onError: (err, newVote, context) => {
      // Revert the optimistic update
      utils.vote.getVote.setData(
        { postId, messageId, userId },
        context?.previousVote,
      );
      setPoints((prev) => {
        const diff = (context?.previousVote?.value ?? 0) - (newVote.value ?? 0);
        return prev + diff;
      });
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      // Refetch after error or success
      utils.vote.getVote.invalidate({ postId, messageId, userId });
    },
  });

  const handleVote = (value: number) => {
    vote({ postId, messageId, value });
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleVote(voteData?.value === 1 ? 0 : 1);
        }}
        variant={voteData?.value === 1 ? 'default' : 'ghost'}
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
        variant={voteData?.value === -1 ? 'default' : 'ghost'}
        size="sm"
      >
        <ArrowDownIcon />
      </Button>
    </div>
  );
};
