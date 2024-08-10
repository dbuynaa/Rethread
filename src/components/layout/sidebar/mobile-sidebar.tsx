'use client';
import { CreateChannelModal } from '@/app/channel/components/channelCreateModal';
import { ChannelItem } from '@/components/core';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { api } from '@/trpc/react';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [channels] = api.channel.getChannels.useSuspenseQuery();

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              {/* <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Overview
              </h2> */}
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
              <div className="flex flex-col gap-6 px-3 py-6">
                <CreateChannelModal />
                <div className="flex flex-col gap-3">
                  {channels.map((channel) => (
                    <ChannelItem key={channel.id} {...channel} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
