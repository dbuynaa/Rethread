"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { useState } from "react";
import { FormInput } from "@/components/form/form-item";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { postCreateInput } from "@/server/api/types";

export function CreatePostModal({ channelId }: { channelId: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();

  const { isPending, mutate: createPost } = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
  });

  const form = useForm<z.infer<typeof postCreateInput>>({
    resolver: zodResolver(postCreateInput),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof postCreateInput>) {
    createPost(
      { ...values, channelId },
      {
        onSuccess() {
          setOpen(false);
          toast({
            title: "Post created",
            description: "Your post has been created.",
            variant: "success",
          });
        },
        onError(error) {
          setOpen(false);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  }
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="default">New Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>New Post</DialogTitle>
          <DialogDescription>
            Create a new post to share with the community or ask a question.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full gap-4 py-4">
              <FormInput
                form={form}
                name="name"
                inputProps={{
                  className: "col-span-4",
                  placeholder: "What's on your mind? Add a title to your post.",
                }}
                label="Title"
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <Label>Description</Label>
                    <FormControl>
                      <Textarea
                        id="description"
                        className="col-span-4"
                        placeholder="Add a description to your post..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button disabled={isPending} type="submit">
                Create Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
