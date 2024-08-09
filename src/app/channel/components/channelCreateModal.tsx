"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CreateChannelContainer } from "@/app/_components/channelCreateContainer";
import { Icons } from "@/components/icons";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export function CreateChannelModal() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="justify-start overflow-hidden px-3 py-2"
        >
          <div className="flex items-center justify-start gap-4 overflow-hidden">
            <span>
              <Icons.add className="h-6 w-6" />
            </span>
            <p> Create Channel</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>New Post</DialogTitle>
          <DialogDescription>
            Create a new post to share with the community or ask a question.
          </DialogDescription>
        </DialogHeader>
        <CreateChannelContainer onFinish={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
