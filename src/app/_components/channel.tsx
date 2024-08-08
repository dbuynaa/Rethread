"use client";

import { api } from "@/trpc/react";
import { z } from "zod";
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

export function Channels() {
  const [channels] = api.channel.getChannels.useSuspenseQuery();

  const { toast } = useToast();

  const utils = api.useUtils();
  const createChannel = api.channel.create.useMutation({
    onSuccess: async () => {
      await utils.channel.invalidate();
    },
  });

  const formSchema = z.object({
    name: z.string().min(2).max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createChannel.mutate(values, {
      onError(error) {
        toast({
          title: "Error",
          description: error.message,
        });
      },
      onSuccess() {
        toast({
          title: "Channel created",
        });
      },
    });
  }

  return (
    <Form {...form}>
      <div className="text-white">
        <h1>Channels</h1>
        {channels?.map((channel) => <p key={channel.id}>{channel.name}</p>)}
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
