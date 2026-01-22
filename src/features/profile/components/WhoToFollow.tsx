'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useSuggestedUsers } from '../hooks/useSuggestedUser';
import { UserAvatar } from './UserAvatar';

const LIMIT = 3;

export function WhoToFollow() {
  const { users, isPending, error } = useSuggestedUsers(LIMIT);
  if (isPending) {
    return (
      <div className='flex items-center justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );
  }

  if (error)
    return <p className='px-4 mt-4 text-destructive'>{error.message}</p>;

  if (!users?.length) {
    return (
      <div className='p-4 text-center border rounded-2xl bg-muted/30'>
        <p className='text-sm text-muted-foreground'>
          You&apos;re following everyone! Check back later for new people.
        </p>
      </div>
    );
  }

  return (
    <div className='rounded-md border overflow-hidden'>
      <div className='px-4 pt-4 pb-2'>
        <h2 className='text-xl font-bold tracking-tight'>Who to follow</h2>
      </div>

      <div className='flex flex-col'>
        {users.map((user) => (
          <div
            key={user.id}
            className='flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group'
          >
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

            <Button className='rounded-full text-sm cursor-pointer'>
              Follow
            </Button>
          </div>
        ))}
      </div>

      <button className='w-full text-left px-4 py-3 text-sm text-primary hover:bg-muted/50 transition-colors'>
        Show more
      </button>
    </div>
  );
}
