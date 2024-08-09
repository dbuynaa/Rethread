"use client";

import { PostCard } from "@/components/core";
import { Skeleton } from "@/components/ui/skeleton";
import { type Post } from "@prisma/client";
import { useSearch } from "@/hooks/useSearch";

export function PostsContainer({
  isLoading,
  posts,
}: {
  isLoading: boolean;
  posts: Post[] | undefined;
}) {
  const { setParam } = useSearch();

  const handleClick = (id: string) => {
    setParam("post", id);
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
      {posts ? (
        posts.map((post) => (
          <PostCard onClick={handleClick} key={post.id} post={post} />
        ))
      ) : (
        <p>You have no posts yet.</p>
      )}
    </div>
  );
}
