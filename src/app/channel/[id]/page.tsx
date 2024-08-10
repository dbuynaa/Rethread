import React from 'react';
import ChannelContainer from '@/app/_components/channelContainer';
import { api } from '@/trpc/server';
import { PageContainer } from '@/components/layout';

export default function Page({ params }: { params: { id: string } }) {
  void api.channel.channelDetail.prefetch({ id: params.id });

  return (
    <PageContainer scrollable={true}>
      <ChannelContainer params={params} />
    </PageContainer>
  );
}
