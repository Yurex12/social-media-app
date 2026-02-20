import { Button } from '@/components/ui/button';
import { useEntityStore } from '@/entities/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToggleFollow } from '../hooks/useToggleFollow';
import { UserAvatar } from './UserAvatar';
import { selectUserById } from '@/entities/userSelectors';
import { cn } from '@/lib/utils';

export function UserCard({
  userId,
  className,
}: {
  userId: string;
  className?: string;
}) {
  const user = useEntityStore((state) => selectUserById(state, userId));

  const { toggleFollow } = useToggleFollow();

  const router = useRouter();

  if (!user) return null;

  const handleCardClick = () => router.push(`/profile/${user.username}`);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollow(user.id);
  };

  return (
    <div
      key={user.id}
      className={cn(
        'py-2 sm:px-0 px-2 not-last:border-b hover:bg-muted/30 transition-colors cursor-pointer w-full max-w-140 mx-auto',
        className,
      )}
      onClick={handleCardClick}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 min-w-0'>
          <UserAvatar image={user.image} name={user.name} />

          <div className='flex flex-col min-w-0'>
            <Link
              onClick={(e) => e.stopPropagation()}
              href={`/profile/${user.username}`}
            >
              <h2 className='font-semibold leading-none tracking-tight truncate hover:underline'>
                {user.name}
              </h2>
            </Link>
            <span className='text-xs font-medium text-muted-foreground truncate'>
              @{user.username}
            </span>
          </div>
        </div>

        {!user.isCurrentUser && (
          <Button
            size='sm'
            className='rounded-full cursor-pointer transition-none shadow-none'
            variant={user.isFollowing ? 'outline' : 'default'}
            onClick={handleFollowClick}
          >
            {user.isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </div>
    </div>
  );
}
