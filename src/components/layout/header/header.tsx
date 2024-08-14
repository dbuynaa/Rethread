'use client';

import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from '../sidebar/mobile-sidebar';
import { UserNav } from './components/user-nav';
// import { api } from '@/trpc/server';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';

export function Header() {
  const { id } = useParams();
  const { data: channelDetail, isLoading } = api.channel.channelDetail.useQuery(
    {
      id: id as string,
    },
    { enabled: !!id },
  );
  return (
    <header className="sticky inset-x-0 top-0">
      <nav className="flex w-full items-center justify-between px-4 py-2 md:justify-end">
        {isLoading && (
          <div className="ml-4 flex-1">
            <Skeleton className="h-8 w-[15%]" />
          </div>
        )}
        {channelDetail && (
          <div className="ml-4 flex flex-1 items-baseline gap-2">
            <h1 className="text-2xl font-semibold">{channelDetail.name}</h1>
            <span className="text-xs text-muted-foreground">
              {dayjs(channelDetail.createdAt).format('YYYY-MM-DD')}
            </span>
          </div>
        )}
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
