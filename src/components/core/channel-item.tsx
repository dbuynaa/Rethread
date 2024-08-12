import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import Link from 'next/link';

export const ChannelItem = ({
  name,
  id,
  image,
}: {
  name: string;
  id: string;
  image: string | null;
}) => {
  return (
    <Button
      variant="ghost"
      size="lg"
      className="justify-start overflow-hidden p-0"
    >
      <Link
        href={`/channel/${id}`}
        className="flex w-full items-center justify-start gap-4 overflow-hidden py-2"
      >
        <Avatar className="ml-4 mr-3 h-10 w-10">
          <AvatarImage src={image ?? ''} alt={name ?? ''} />
          <AvatarFallback className="text-2xl font-bold text-primary">
            {name?.[0]}
          </AvatarFallback>
        </Avatar>
        {name}
      </Link>
    </Button>
  );
};
