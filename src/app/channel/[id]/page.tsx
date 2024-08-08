"use client";

import PageContainer from "@/components/layout/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import dayjs from "dayjs";
import React, { useState } from "react";
import { AddPostModal } from "../components/postCreateModal";
import { CardPost } from "@/components/card-post";

export default function Page({ params }: { params: { id: string } }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [channelDetail] = api.channel.channelDetail.useSuspenseQuery({
    id: params.id,
  });

  return (
    <PageContainer scrollable={true}>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>{channelDetail.name}</CardTitle>
          <CardDescription>
            {dayjs(channelDetail.createdAt).format("YYYY-MM-DD")}
          </CardDescription>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mr-2"
            />
            <AddPostModal channelId={channelDetail.id} />
          </div>
        </CardHeader>
        <CardContent>
          {channelDetail.posts.map((post) => (
            <CardPost key={post.id} post={post} />
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
