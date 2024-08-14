import React from 'react';
import ChannelContainer from '@/app/_components/channelContainer';
import { PageContainer } from '@/components/layout';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <PageContainer scrollable={true}>
      <ChannelContainer params={params} />
    </PageContainer>
  );
}
