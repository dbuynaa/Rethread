'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { CreateChannelModal } from '@/app/channel/components/channelCreateModal';
import { ChannelItem } from '@/components/core/channel-item';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [channels] = api.channel.getChannels.useSuspenseQuery();

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-72' : 'w-[72px]',
        className,
      )}
    >
      <div className="hidden overflow-hidden p-6 pt-10 lg:flex">
        <Link href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
        </Link>
        <span className="ml-2 hidden lg:block">ReThread</span>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl',
          isMinimized && 'rotate-180',
        )}
        onClick={toggle}
      />
      <div className="flex flex-col gap-6 px-3 py-6">
        <CreateChannelModal />
        <div className="flex flex-col gap-3">
          {channels.map((channel) => (
            <ChannelItem key={channel.id} {...channel} />
          ))}
        </div>
      </div>
    </aside>
  );
}
