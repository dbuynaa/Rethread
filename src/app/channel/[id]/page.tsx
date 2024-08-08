"use client";

import { Icons } from "@/components/icons";
import PageContainer from "@/components/layout/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import dayjs from "dayjs";
import React, { useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const [searchTerm, setSearchTerm] = useState("");

  const [channelDetail] = api.channel.channel.useSuspenseQuery({
    id: params.id,
  });

  return (
    <PageContainer scrollable={true}>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>{channelDetail.name}</CardTitle>
          <CardDescription>
            {dayjs(channelDetail.createdAt).format("YYYY-MM-DD")}
          </CardDescription>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mr-2"
            />
            <Button variant="secondary">
              <Icons.add />
              New Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {channelDetail.posts.map((message) => (
            <Card key={message.id} className="mb-4">
              <CardHeader>
                <Avatar>
                  <AvatarImage src="/avatar.png" alt="Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <CardTitle className="ml-2">Claude</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{message.content}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </CardContent>
        {/* <CardFooter>
          <Textarea
            placeholder="Enter your message..."
            //   value={newMessage}
            //   onChange={(e) => setNewMessage(e.target.value)}
            rows={2}
            className="mr-2"
          />
          <Button>
            <Icons.send />
          </Button>
        </CardFooter> */}
      </Card>
    </PageContainer>
  );
}
