import PageContainer from "@/components/layout/page-container";
import React from "react";
import ChannelContainer from "@/app/_components/channelContainer";
import { api } from "@/trpc/server";

export default function Page({ params }: { params: { id: string } }) {
  void api.channel.channelDetail.prefetch({ id: params.id });
  // void api.post.getPosts.prefetch({ channelId: params.id });

  return (
    <PageContainer scrollable={true}>
      <ChannelContainer params={params} />
    </PageContainer>
  );
}
