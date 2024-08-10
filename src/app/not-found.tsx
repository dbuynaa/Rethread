import { PageContainer } from '@/components/layout';

export default function NotFound() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold tracking-tight">Not Found!</h2>
        </div>
      </div>
    </PageContainer>
  );
}
