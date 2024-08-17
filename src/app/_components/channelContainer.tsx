'use client';

import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';
import { CreatePostModal } from '../channel/components/postCreateModal';
import { PostsContainer } from './postsContainer';
import { useSearch } from '@/hooks/useSearch';
import { api } from '@/trpc/react';

export default function ChannelContainer({
  params,
}: {
  params: { id: string };
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const { setParam } = useSearch();
  const [posts, { isLoading }] = api.post.getPosts.useSuspenseQuery({
    channelId: params.id,
  });
  useEffect(() => {
    if (searchTerm) {
      setTimeout(() => {
        setParam('search', searchTerm);
      }, 500);
    }
  }, [searchTerm]);

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <CreatePostModal channelId={params.id} />
        </div>
      </div>
      <PostsContainer posts={posts} isLoading={isLoading} />
    </div>
  );
}
