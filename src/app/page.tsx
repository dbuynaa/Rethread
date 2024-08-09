import PageContainer from "@/components/layout/page-container";
import { api } from "@/trpc/server";
import { HomePage } from "./_components/post";

export default function Page() {
  void api.post.getLatest.prefetch();

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <HomePage />
      </div>
    </PageContainer>
  );
}
