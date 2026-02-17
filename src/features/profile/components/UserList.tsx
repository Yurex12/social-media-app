'use client';

import { Spinner } from '@/components/ui/spinner';
import { ReactElement, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { UserCard } from './UserCard';

interface UserListProps {
  userIds: string[] | undefined;
  isPending: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: VoidFunction;
  isFetchNextPageError?: boolean;
  emptyMessage?: string | ReactElement;
}

export function UserList({
  userIds,
  isPending,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isFetchNextPageError,
  emptyMessage = 'No users found.',
}: UserListProps) {
  const { ref, inView } = useInView({ threshold: 0, rootMargin: '400px' });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  if (isPending)
    return (
      <div className='flex justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error && !userIds?.length)
    return (
      <p className='mt-4 text-center text-muted-foreground'>{error.message}</p>
    );

  if (!userIds?.length)
    return (
      <div className='mt-4 text-center text-muted-foreground'>
        {emptyMessage}
      </div>
    );

  return (
    <div className='w-full'>
      <div className='flex flex-col'>
        {userIds.map((userId) => (
          <UserCard userId={userId} key={userId} />
        ))}
      </div>

      {(hasNextPage || isFetchingNextPage || isFetchNextPageError) && (
        <div
          ref={ref}
          className='py-12 flex flex-col items-center justify-center border-t border-border/50'
        >
          {isFetchingNextPage && <Spinner className='size-6 text-primary' />}

          {isFetchNextPageError && (
            <button
              onClick={() => fetchNextPage()}
              className='text-sm text-primary hover:underline font-medium'
            >
              Retry loading users
            </button>
          )}
        </div>
      )}
    </div>
  );
}
