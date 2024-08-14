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
  // userId: string;
  points?: number;
  className?: string;
}

export const Vote: React.FC<VoteProps> = ({
  postId,
  messageId,
  className,
  points: initialPoints,
}) => {
  const utils = api.useUtils();
  const [points, setPoints] = useState(initialPoints ?? 0);
  const { toast } = useToast();
  const session = useSession();
  // const { data: session } = api.auth.getSession.useQuery();

  const { data: voteData } = api.vote.getVote.useQuery(
    { postId, messageId },
    { enabled: !!((postId ?? messageId) && session.data?.user) },
  );

  const { mutate: vote } = api.vote.voteMutation.useMutation({
    onMutate: async (newVote) => {
      // Cancel outgoing refetches
      await utils.vote.getVote.cancel({ postId, messageId });

      // Snapshot the previous value
      const previousVote = utils.vote.getVote.getData({
        postId,
        messageId,
        // userId,
      });

      // Optimistically update to the new value
      utils.vote.getVote.setData(
        { postId, messageId },
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
    },
    onSettled: () => {
      // Refetch after error or success
      void utils.vote.getVote.invalidate({ postId, messageId });
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
