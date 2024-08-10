'use client';

import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Vote } from './vote';
import { type Message, type User } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';

extend(relativeTime);

interface MessageProps {
  comment: Message;
  user: User;
  loading: boolean;
  handleDelete: (id: string) => void;
}

export const Comment = ({
  comment,
  user,
  loading,
  handleDelete,
}: MessageProps) => {
  const { data: session } = useSession();
  return (
    <div key={comment.id} className="relative mb-4 flex items-start space-x-4">
      <Avatar className="mr-3 h-10 w-10">
        <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">
            {dayjs(comment.createdAt).fromNow()}
          </p>
        </div>
        <p className="py-2 text-sm text-secondary-foreground">
          {comment.content}
        </p>
        <Vote messageId={comment.id} />
        {session?.user && session.user.id === user.id && (
          <Button
            size={'icon'}
            variant={'ghost'}
            disabled={loading}
            onClick={() => handleDelete(comment.id)}
            className="absolute right-2 top-2 hover:text-red-700"
          >
            <Icons.delete className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
