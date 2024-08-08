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
import { z } from "zod";
import { useState } from "react";
import { FormInput } from "@/components/form/form-item";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export function AddPostModal({ channelId }: { channelId: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { isPending, mutate: createPost } = api.post.create.useMutation();

  const formSchema = z.object({
    name: z.string().min(2).max(50),
    content: z.string().min(2).max(500),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPost(
      { ...values, channelId },
      {
        onSuccess() {
          toast({
            title: "Post created",
            description: "Your post has been created.",
            variant: "success",
          });
        },
        onError(error) {
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
        <Button variant="outline">New Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>New Post</DialogTitle>
              <DialogDescription>
                Create a new post to share with the community or ask a question.
              </DialogDescription>
            </DialogHeader>
            <div className="grid w-full gap-4 py-4">
              <FormInput
                form={form}
                name="name"
                className="grid grid-cols-4 items-center gap-4"
                props={{
                  className: "col-span-4",
                  placeholder:
                    "Introduce the problem and expand on what you put in the title",
                }}
                label="Title"
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <Label>name</Label>
                    <FormControl>
                      <Textarea
                        id="description"
                        className="col-span-4"
                        placeholder="Introduce the problem and expand on what you put in the title"
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
