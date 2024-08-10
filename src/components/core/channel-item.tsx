import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export const ChannelItem = ({
  name,
  id,
  image,
}: {
  name: string;
  id: string;
  image: string | null;
}) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={() => router.replace(`/channel/${id}`)}
      className="justify-start overflow-hidden p-0"
    >
      <div className="flex items-center justify-start gap-4 overflow-hidden py-2">
        <Avatar className="ml-4 mr-3 h-10 w-10">
          <AvatarImage src={image ?? ''} alt={name ?? ''} />
          <AvatarFallback className="text-2xl font-bold text-primary">
            {name?.[0]}
          </AvatarFallback>
        </Avatar>
        {name}
      </div>
    </Button>
  );
};
