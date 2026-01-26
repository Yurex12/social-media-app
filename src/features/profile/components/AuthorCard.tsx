'use client';
import { Button } from '@/components/ui/button';

import { Spinner } from '@/components/ui/spinner';
import { UserAvatar } from './UserAvatar';
import { AuthorCardProps } from '../types';
import { useToggleFollow } from '../hooks/useToggleFollow';
import { useSession } from '@/lib/auth-client';

export function AuthorCard({ user, isPending, error }: AuthorCardProps) {
  const { toggleFollow } = useToggleFollow();

  const session = useSession();

  if (isPending)
    return (
      <div className='flex items-center justify-center'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error) return <p>{error.message}</p>;

  if (!user) return <p>No user yet</p>;

  const isCurrentUser = user.id === session.data?.user.id;

  return (
    <div className='rounded-md border p-4 space-y-2'>
      <div className='flex justify-between items-start'>
        <UserAvatar image={user.image} name={user.name} />

        <>
          {isCurrentUser ? (
            <Button variant='outline' className='rounded-full cursor-pointer'>
              Edit profile
            </Button>
          ) : (
            <Button
              className='rounded-full cursor-pointer shadow-none'
              variant={user.isFollowing ? 'outline' : 'default'}
              onClick={() => toggleFollow(user.id)}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </>
      </div>

      <div>
        <h3 className='text-lg'>{user.name}</h3>
        <p className='text-muted-foreground text-sm'>@{user.username}</p>
      </div>

      {user.bio && <p className='text-foreground/80 text-sm'>{user.bio}</p>}

      <div className='flex gap-4 pt-1'>
        <div className='flex gap-1 text-sm'>
          <span className='font-bold text-foreground/80'>
            {user?._count?.following ?? 0}
          </span>
          <span className='text-muted-foreground'>Following</span>
        </div>
        <div className='flex gap-1 text-sm'>
          <span className='font-bold text-foreground/80'>
            {user?._count?.followers ?? 0}
          </span>
          {user._count.followers > 1 ? 'Followers' : 'Follower'}
        </div>
      </div>
    </div>
  );
}
