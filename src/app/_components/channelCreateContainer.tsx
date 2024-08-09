"use client";

import { api } from "@/trpc/react";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CreateChannelInput } from "@/server/api/types";

export function CreateChannelContainer({ onFinish }: { onFinish: () => void }) {
  const { toast } = useToast();

  const utils = api.useUtils();
  const { mutate: createChannel, isPending } = api.channel.create.useMutation({
    onSuccess: async () => {
      await utils.channel.invalidate();
    },
  });

  const form = useForm<z.infer<typeof CreateChannelInput>>({
    resolver: zodResolver(CreateChannelInput),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof CreateChannelInput>) {
    createChannel(values, {
      onError(error) {
        onFinish();
        toast({
          title: "Error",
          description: error.message,
        });
      },
      onSuccess() {
        onFinish();
        toast({
          title: "Channel created",
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Channel name..." {...field} />
              </FormControl>
              <FormDescription>The name of the channel</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          Create
        </Button>
      </form>
    </Form>
  );
}
