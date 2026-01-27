import { Button } from '@/components/ui/button';
import { useToggleFollow } from '../hooks/useToggleFollow';
import { UserWithRelations } from '../types';
import { UserAvatar } from './UserAvatar';

export function UserCard({ user }: { user: UserWithRelations }) {
  const { toggleFollow } = useToggleFollow();
  return (
    <div
      key={user.id}
      className='p-4 hover:bg-muted/50 transition-colors cursor-pointer group'
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 min-w-0'>
          <UserAvatar image={user.image} name={user.name} />

          <div className='flex flex-col min-w-0'>
            <span className='font-bold text-sm truncate group-hover:underline'>
              {user.name}
            </span>
            <span className='text-muted-foreground text-xs truncate'>
              @{user.username}
            </span>
          </div>
        </div>

        <Button
          className='rounded-full cursor-pointer'
          variant={user.isFollowing ? 'outline' : 'default'}
          onClick={() => toggleFollow(user.id)}
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
    </div>
  );
}
