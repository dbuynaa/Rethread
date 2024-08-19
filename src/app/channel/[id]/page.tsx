import React from 'react';
import ChannelContainer from '@/app/_components/channelContainer';
import { PageContainer } from '@/components/layout';
import { api, HydrateClient } from '@/trpc/server';

export default function Page({ params }: { params: { id: string } }) {
  void api.post.getPosts.prefetch({ channelId: params.id });
  return (
    <HydrateClient>
      <PageContainer scrollable={true}>
        <ChannelContainer params={params} />
      </PageContainer>
    </HydrateClient>
  );
}
