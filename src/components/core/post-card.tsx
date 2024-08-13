import { type Post } from '@prisma/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import dayjs, { extend } from 'dayjs';
import { Vote } from './vote';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the plugin
import { useSession } from 'next-auth/react';
extend(relativeTime);

export const PostCard = ({
  post,
  onClick,
  onUpdate,
  onDelete,
  loading,
}: {
  post: Post;
  loading: boolean;
  onClick: (id: string) => void;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const session = useSession();
  return (
    <Card
      onClick={() => onClick(post.id)}
      key={post.id}
      className="mb-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <CardHeader>
        <CardTitle>{post.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 overflow-hidden text-ellipsis">
          {post.content}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center gap-4">
        <Vote postId={post.id} points={post.points} />
        <CardDescription>{dayjs(post.createdAt).fromNow()}</CardDescription>

        {session.data?.user && session.data.user.id === post.createdById && (
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(post.id);
              }}
              size={'sm'}
              variant="ghost"
              className="ml-auto"
            >
              <Icons.edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post.id);
              }}
              size={'sm'}
              disabled={loading}
              className="ml-2 hover:text-red-700"
              variant="ghost"
            >
              <Icons.delete className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
