'use client';

import { api } from '@/trpc/react';
import { PostsContainer } from './postsContainer';

export function HomePage() {
  const [posts] = api.post.getPosts.useSuspenseQuery();

  return (
    <div className="w-full space-y-2">
      <PostsContainer isLoading={false} posts={posts} />
    </div>
  );
}
