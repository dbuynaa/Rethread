import { type Post } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const CardPost = ({ post }: { post: Post }) => {
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
      {/* <CardFooter></CardFooter> */}
    </Card>
  );
};
