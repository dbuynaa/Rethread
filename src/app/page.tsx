import { api, HydrateClient } from '@/trpc/server';
import { HomePage } from './_components/post';
import { PageContainer } from '@/components/layout';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the plugin
import { extend } from 'dayjs';
extend(relativeTime);

export default function Page() {
  void api.post.getPosts.prefetch();

  return (
    <HydrateClient>
      <PageContainer scrollable={true}>
        <div className="space-y-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Hi, Welcome back 👋
            </h2>
          </div>
          <HomePage />
        </div>
      </PageContainer>
    </HydrateClient>
  );
}
