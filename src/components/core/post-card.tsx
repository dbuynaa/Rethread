import { type Post } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import VotePost from "./vote";

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{post.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="overflow-ellipsis">
          {post.content}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <VotePost />
      </CardFooter>
    </Card>
  );
};
