'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { CreatePostModal } from '../channel/components/postCreateModal';
import { PostsContainer } from './postsContainer';

export default function ChannelContainer({
  params,
}: {
  params: { id: string };
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const [channelDetail] = api.channel.channelDetail.useSuspenseQuery({
    id: params.id,
  });
  const { data: posts, isLoading } = api.post.getPosts.useQuery({
    channelId: params.id,
    search: searchTerm,
  });

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{channelDetail.name}</CardTitle>
        <CardDescription>
          {dayjs(channelDetail.createdAt).format('YYYY-MM-DD')}
        </CardDescription>
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mr-2"
          />
          <CreatePostModal channelId={channelDetail.id} />
        </div>
      </CardHeader>
      <CardContent>
        <PostsContainer isLoading={isLoading} posts={posts} />
      </CardContent>
    </Card>
  );
}
