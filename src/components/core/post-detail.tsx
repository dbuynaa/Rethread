import { useState } from "react";
import { ChevronDownIcon } from "lucide-react"; // Import chevron icon from lucide
import { Card, CardHeader, CardContent } from "../ui/card"; // Import components from shadcn/ui
import { cn } from "@/lib/utils";
import { type Post } from "@prisma/client";
import { Button } from "../ui/button";

const PostDetails = ({ post }: { post: Post }) => {
  const [showParticipants, setShowParticipants] = useState(false);

  return (
    <div className="h-screen flex-1 overflow-y-auto p-6">
      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-xl font-semibold">{post.name}</h2>
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 transition-transform",
                showParticipants && "rotate-180",
              )}
            />
            {/* <span>{thread.participants.length} Participants</span> */}
          </Button>
          {/* {showParticipants && (
            <ul className="mt-2 space-y-1">
              {post..map((participant) => (
                <li key={participant.id} className="text-muted text-sm">
                  {participant.name}
                </li>
              ))}
            </ul>
          )} */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* {post.messages.map((message) => (
            <div key={message.id} className="p-3 bg-muted rounded-md">
              <div className="font-medium">{message.sender}</div>
              <p className="text-sm">{message.content}</p>
              <div className="text-xs text-muted">{message.timestamp}</div>
            </div>
          ))} */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetails;
