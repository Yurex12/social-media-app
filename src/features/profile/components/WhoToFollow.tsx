'use client';

import { Spinner } from '@/components/ui/spinner';
import { useSuggestedUsers } from '../hooks/useSuggestedUser';
import { UserCard } from './UserCard';
import { useRouter } from 'next/navigation';

const LIMIT = 3;

export function WhoToFollow() {
  const { userIds, isPending, error } = useSuggestedUsers(LIMIT);
  const router = useRouter();

  if (isPending) {
    return (
      <div className='flex items-center justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );
  }

  if (error)
    return <p className='px-4 mt-4 text-destructive'>{error.message}</p>;

  if (!userIds?.length) {
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
        <h2 className='text-lg font-semibold tracking-tight'>Who to follow</h2>
      </div>

      <div className='flex flex-col'>
        {userIds.map((userId) => (
          <UserCard
            userId={userId}
            key={userId}
            className='not-last:border-b-0 sm:px-4'
          />
        ))}
      </div>

      <button
        className='w-full text-left px-4 py-3 text-sm text-primary hover:bg-muted/50 cursor-pointer'
        onClick={() => router.push('/users/discover')}
      >
        Show more
      </button>
    </div>
  );
}
