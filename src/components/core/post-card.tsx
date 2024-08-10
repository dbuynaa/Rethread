import { type Post } from '@prisma/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Import the plugin
import { Vote } from './vote';
dayjs.extend(relativeTime);

export const PostCard = ({
  post,
  onClick,
}: {
  post: Post;
  onClick: (id: string) => void;
}) => {
  // Extend dayjs with the plugin

  return (
    <Card
      onClick={() => onClick(post.id)}
      key={post.id}
      // className="relative mb-4 cursor-pointer transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
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
        <Vote postId={post.id} />
        <CardDescription>{dayjs(post.createdAt).fromNow()}</CardDescription>
      </CardFooter>
    </Card>
  );
};
