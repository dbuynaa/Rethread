'use client';

import { Skeleton } from '@/components/ui/skeleton';
// import { type Post } from '@prisma/client';
import { useSearch } from '@/hooks/useSearch';
import { PostCard } from '@/components/core';
import { api } from '@/trpc/react';
import { PageContainer } from '@/components/layout';
import type { Post } from '@prisma/client';

export type PostType = Post & {
  userVote?: { value: number };
};

export function PostsContainer({
  posts,
  isLoading,
}: {
  posts?: Post[];
  isLoading?: boolean;
}) {
  const { setParam } = useSearch();
  const utils = api.useUtils();

  const { mutate: deletePost, isPending: isDeleting } =
    api.post.delete.useMutation({
      onSuccess: () => {
        setParam('post', null);
        void utils.post.getPosts.invalidate();
      },
    });

  const handleUpdate = (id: string) => {
    console.log(id);
  };
  const handleClick = (id: string) => {
    setParam('post', id);
  };

  return (
    <PageContainer>
      {isLoading && (
        <>
          <Skeleton className="mb-2 h-8 w-full" />
          <Skeleton className="mb-2 h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </>
      )}
      {posts &&
        posts.length > 0 &&
        posts.map((post) => (
          <PostCard
            onDelete={(id) => deletePost({ id })}
            onUpdate={handleUpdate}
            key={post.id}
            post={post}
            onClick={handleClick}
            isDeleting={isDeleting}
          />
        ))}
      {posts && posts.length === 0 && <p>No posts found</p>}
    </PageContainer>
  );
}
