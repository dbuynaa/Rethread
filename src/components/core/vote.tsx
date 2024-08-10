// /components/core/Vote.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { api } from '@/trpc/react';
import { cn } from '@/lib/utils';

interface VoteProps {
  postId?: string;
  messageId?: string;
  className?: string;
}

export const Vote: React.FC<VoteProps> = ({ postId, messageId, className }) => {
  const utils = api.useUtils();

  const { data: voteData } = api.vote.getVote.useQuery(
    { postId, messageId },
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
  });

  const handleVote = (value: number) => {
    vote({ postId, messageId, value });
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        onClick={() => handleVote(1)}
        variant={voteData?.userVote === 1 ? 'default' : 'ghost'}
        size="sm"
      >
        <ArrowUpIcon />
      </Button>
      <span>{voteData?.points ?? 0}</span>
      <Button
        onClick={() => handleVote(-1)}
        variant={voteData?.userVote === -1 ? 'default' : 'ghost'}
        size="sm"
      >
        <ArrowDownIcon />
      </Button>
    </div>
  );
};
