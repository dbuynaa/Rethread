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
  className?: string;
}

export const Vote: React.FC<VoteProps> = ({
  postId,
  messageId,
  userId,
  className,
}) => {
  const utils = api.useUtils();
  const { toast } = useToast();

  const { data: voteData } = api.vote.getVote.useQuery(
    { postId, messageId, userId },
    { enabled: !!(postId ?? messageId) },
  );

  const { mutate: vote } = api.vote.voteMutation.useMutation({
    onSuccess: () => {
      void utils.vote.getVote.invalidate({ postId, messageId });
      if (postId) {
        void utils.post.getPost.invalidate({ id: postId });
      } else if (messageId) {
        void utils.message.getMessages.invalidate();
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'default',
      });
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
          handleVote(1);
        }}
        variant={voteData?.userVote === 1 ? 'default' : 'ghost'}
        size="sm"
      >
        <ArrowUpIcon />
      </Button>
      <span>{voteData?.points ?? 0}</span>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleVote(-1);
        }}
        variant={voteData?.userVote === -1 ? 'default' : 'ghost'}
        size="sm"
      >
        <ArrowDownIcon />
      </Button>
    </div>
  );
};
