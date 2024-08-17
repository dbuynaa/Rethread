// /hooks/useVoteData.ts

import { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { useToast } from '@/components/ui/use-toast';

export const useVoteData = (postId: string) => {
  const [points, setPoints] = useState<number>(0);
  const [voteData, setVoteData] = useState<{ value: number } | null>(null);
  const { toast } = useToast();

  const fetchVoteData = async () => {
    try {
      const posts = api.useUtils().post.getPosts.getData({
        /* your input params here */
      });
      const post = posts?.find((p) => p.id === postId);
      if (post) {
        const vote = post;
        setVoteData(vote.userVote || { value: 0 });
        setPoints(post.points);
      } else {
        throw new Error('Post not found');
      }
    } catch (error) {
      console.error('Error fetching vote data:', error);
      toast({
        title: 'Error',
        description: 'Error fetching vote data',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchVoteData();
  }, [postId]);

  return { points, voteData, fetchVoteData };
};
