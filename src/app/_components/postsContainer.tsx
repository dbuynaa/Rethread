'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { type Post } from '@prisma/client';
import { useSearch } from '@/hooks/useSearch';
import { PostCard } from '@/components/core';
import { api } from '@/trpc/react';

export function PostsContainer({
  isLoading,
  posts,
}: {
  isLoading: boolean;
  posts: Post[] | undefined;
}) {
  const { setParam } = useSearch();
  const utils = api.useUtils();
  const { mutate: deletePost, isPending: deleteLoading } =
    api.post.delete.useMutation({
      onSuccess: () => {
        setParam('post', null);
        void utils.post.getPosts.invalidate();
      },
    });

  const handleClick = (id: string) => {
    setParam('post', id);
  };
  const handleDelete = (id: string) => {
    deletePost({ id });
  };

  const handleUpdate = (id: string) => {
    console.log(id);
  };

  return (
    <div>
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
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onClick={handleClick}
            loading={deleteLoading}
            key={post.id}
            post={post}
          />
        ))}
      {!isLoading && posts && posts.length === 0 && <p>No posts found</p>}
    </div>
  );
}
