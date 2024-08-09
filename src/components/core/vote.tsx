import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "../ui/button";

const Vote = () => {
  const [votes, setVotes] = useState(10);
  const [userVote, setUserVote] = useState<string | null>(null);

  const handleUpvote = () => {
    if (userVote === "up") {
      setVotes((prevVotes) => prevVotes - 1);
      setUserVote(null);
    } else if (userVote === "down") {
      setVotes((prevVotes) => prevVotes + 2);
      setUserVote("up");
    } else {
      setVotes((prevVotes) => prevVotes + 1);
      setUserVote("up");
    }
  };

  const handleDownvote = () => {
    if (userVote === "down") {
      setVotes((prevVotes) => prevVotes + 1);
      setUserVote(null);
    } else if (userVote === "up") {
      setVotes((prevVotes) => prevVotes - 2);
      setUserVote("down");
    } else {
      setVotes((prevVotes) => prevVotes - 1);
      setUserVote("down");
    }
  };

  return (
    <div className="z-10 flex w-fit items-center justify-between text-center">
      <Button
        variant={userVote === "up" ? "default" : "ghost"}
        size="icon"
        onClick={handleUpvote}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
      <p className="px-2 text-center text-sm font-medium">{votes}</p>
      <Button
        variant={userVote === "down" ? "destructive" : "ghost"}
        size="icon"
        onClick={handleDownvote}
      >
        <ArrowDown className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Vote;
