"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  LoaderCircle,
  ShieldQuestionIcon,
  MessageCircleQuestionIcon,
} from "lucide-react";
import Vote from "@/components/core/vote";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Icons } from "@/components/icons";
import { useSearch } from "@/hooks/useSearch";

type SidebarProps = {
  className?: string;
};

export function SidebarRight({ className }: SidebarProps) {
  const params = useSearchParams();
  const postId = params.get("post");

  const { setParam } = useSearch();

  const handleClick = () => {
    setParam("post", null);
  };

  const { data: post, isLoading } = api.post.getPost.useQuery(
    { id: postId! },
    { enabled: !!postId },
  );

  return (
    <aside
      className={cn(
        `relative h-screen flex-none border-l bg-card transition-[width] duration-200`,
        postId ? "w-[41vw]" : "w-0",
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
                  src={post.createdBy.image ?? ""}
                  alt={post.createdBy.name ?? ""}
                />
                <AvatarFallback>{post.createdBy.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-lg font-semibold">
                    {post.createdBy.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    <span className="mr-1">Created At </span>
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-secondary-foreground">
                  {post.content}
                </p>
              </div>
            </div>
            <Vote />
            <Separator className="my-6" />
            <h3 className="text-md mb-2 font-semibold">Replies</h3>
            <p className="text-gray-500">No replies yet.</p>
          </div>
          <Button
            className="absolute right-4 top-4"
            variant={"ghost"}
            size={"icon"}
            onClick={handleClick}
          >
            <Icons.close />
          </Button>
        </ScrollArea>
      )}
    </aside>
  );
}
