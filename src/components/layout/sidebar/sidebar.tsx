"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [channels] = api.channel.getChannels.useSuspenseQuery();
  const router = useRouter();

  const ChannelItem = ({
    name,
    id,
    image,
  }: {
    name: string;
    id: string;
    image: string | null;
  }) => (
    <Button
      variant="ghost"
      size="lg"
      onClick={() => router.replace(`/channel/${id}`)}
      className="justify-start overflow-hidden px-4 py-2 text-secondary-foreground"
    >
      <div className="flex items-center justify-start gap-4 overflow-hidden">
        {image ? (
          <Image src={image} alt={name} />
        ) : (
          <span className="text-2xl">#</span>
        )}
        {name}
      </div>
    </Button>
  );

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? "w-72" : "w-[72px]",
        className,
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
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
      </div>
      <ChevronLeft
        className={cn(
          "absolute -right-3 top-10 z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          isMinimized && "rotate-180",
        )}
        onClick={toggle}
      />
      <div className="flex flex-col gap-6 px-3 py-6">
        <Button
          variant="ghost"
          size="lg"
          className="justify-start overflow-hidden px-3 py-2 text-secondary-foreground"
        >
          <div className="flex items-center justify-start gap-4 overflow-hidden">
            <span>
              <Icons.add className="h-6 w-6" />
            </span>
            <p> Create Channel</p>
          </div>
        </Button>
        <div className="flex flex-col gap-3">
          {channels.map((channel) => (
            <ChannelItem key={channel.id} {...channel} />
          ))}
        </div>
      </div>
    </aside>
  );
}
