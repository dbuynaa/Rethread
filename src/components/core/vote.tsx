// /components/core/Vote.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteProps {
  className?: string;
  points?: number;
  voteData?: { value: number };
  handleVote: (value: number) => void;
}
export const Vote: React.FC<VoteProps> = ({
  className,
  points = 0,
  voteData,
  handleVote,
}) => {
  const onVote = (value: number) => (e: React.MouseEvent) => {
    e.stopPropagation();

    handleVote(voteData?.value === value ? 0 : value);
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        onClick={onVote(1)}
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
        onClick={onVote(-1)}
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
