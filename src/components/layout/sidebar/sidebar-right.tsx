'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { api } from '@/trpc/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  LoaderCircle,
  MessageCircleQuestionIcon,
  SendIcon,
} from 'lucide-react';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Icons } from '@/components/icons';
import { useSearch } from '@/hooks/useSearch';
import { Textarea } from '@/components/ui/textarea';
import dayjs from 'dayjs';
import { Comment, Vote } from '@/components/core';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { ResizablePanel } from '@/components/ui/resizable';
import { useVote } from '@/hooks/useVote';

interface SidebarProps {
  className?: string;
}

export function SidebarRight({ className }: SidebarProps) {
  const params = useSearchParams();
  const postId = params.get('post');
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const { setParam } = useSearch();

  const { data: post, isLoading } = api.post.getPost.useQuery(
    { id: postId! },
    {
      enabled: !!postId,
    },
  );

  const { handlePostVote } = useVote();

  const {
    data: comments,
    refetch,
    isLoading: isLoadingComments,
  } = api.message.getMessages.useQuery(
    { postId: postId! },
    { enabled: !!postId },
  );
  const { isPending, mutate: createPost } = api.message.create.useMutation();
  const { isPending: deletePending, mutate: deletePost } =
    api.message.delete.useMutation();

  const handleClick = () => {
    setParam('post', null);
  };

  const handleDelete = (id: string) => {
    deletePost(
      { id },
      {
        onSuccess() {
          void refetch();
        },
        onError(error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        },
      },
    );
  };

  const handleCommentSubmit = () => {
    if (!comment || !postId) return;
    createPost(
      {
        content: comment,
        postId: postId,
      },
      {
        onSuccess() {
          void refetch();
          setComment('');
        },
        onError(error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        },
      },
    );
  };

  return (
    <ResizablePanel
      defaultSize={38}
      minSize={30}
      maxSize={50}
      className={cn(
        `relative h-screen flex-none border-l bg-card transition-[width] duration-200`,
        postId ? 'block' : 'hidden',
        className,
      )}
    >
      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <LoaderCircle className="h-12 w-12 animate-spin" />
        </div>
      )}
      {post && (
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="mb-4 mt-2 flex items-center gap-4">
              <MessageCircleQuestionIcon className="h-12 w-12" />
              <h1 className="text-2xl">{post.name}</h1>
            </div>
            <Separator className="my-6" />

            <div className="mb-4 flex items-start">
              <Avatar className="mr-3 h-10 w-10">
                <AvatarImage
                  src={post.createdBy.image ?? ''}
                  alt={post.createdBy.name ?? ''}
                />
                <AvatarFallback>{post.createdBy.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-lg font-semibold">
                    {post.createdBy.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    <span className="mr-1">Created At </span>
                    {dayjs(post.createdAt).format('YYYY-MM-DD')}
                  </p>
                </div>
                <p className="text-sm text-secondary-foreground">
                  {post.content}
                </p>
              </div>
            </div>
            <Vote
              points={post.points}
              handleVote={(value) => handlePostVote(post.id, value)}
              voteData={post.userVote ?? undefined}
            />
            <Separator className="my-6" />

            {/* Comment Input Section */}
            <div className="mb-6">
              <h3 className="text-md mb-2 font-semibold">Add a comment</h3>
              <div className="flex items-start space-x-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your comment here..."
                  className="flex-grow"
                />
                <Button
                  disabled={isPending}
                  onClick={handleCommentSubmit}
                  size="icon"
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="relative flex flex-col">
              {isLoadingComments && (
                <div className="absolute right-4 top-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              )}
              {comments?.map((comment) => (
                <Comment
                  handleDelete={handleDelete}
                  key={comment.id}
                  comment={comment}
                  userVote={comment.userVote}
                  user={comment.user}
                  loading={deletePending}
                />
              ))}
            </div>
          </div>

          <Button
            className="absolute right-4 top-4"
            variant={'ghost'}
            size={'icon'}
            onClick={handleClick}
          >
            <Icons.close />
          </Button>
        </ScrollArea>
      )}
    </ResizablePanel>
  );
}
