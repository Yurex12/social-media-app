import { Button } from '@/components/ui/button';
import { useEntityStore } from '@/entities/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToggleFollow } from '../hooks/useToggleFollow';
import { UserAvatar } from './UserAvatar';
import { selectUserById } from '@/entities/userSelectors';

export function UserCard({ userId }: { userId: string }) {
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
      className='p-4 hover:bg-muted/30 transition-colors cursor-pointer'
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
            <span className='text-sm font-medium text-muted-foreground truncate'>
              @{user.username}
            </span>
          </div>
        </div>

        {!user.isCurrentUser && (
          <Button
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
