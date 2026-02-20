'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Spinner } from '@/components/ui/spinner';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

export default function NotificationList() {
  const {
    notifications,
    isPending,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetchNextPageError,
  } = useNotifications();

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

  if (isPending) {
    return (
      <div className='flex items-center justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );
  }

  if (error && !notifications?.length) {
    return <p className='mt-4 px-4 text-muted-foreground'>{error.message}</p>;
  }

  if (!notifications?.length) {
    return (
      <p className='mt-4 text-muted-foreground px-4'>
        Nothing to see here - yet.
      </p>
    );
  }

  return (
    <div className='flex flex-col w-full'>
      <div>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>

      {hasNextPage && (
        <div ref={ref} className='h-1 w-full' aria-hidden='true' />
      )}

      <div className='flex flex-col items-center justify-center mb-20 sm:mb-0'>
        {isFetchingNextPage && <Spinner className='size-6' />}

        {isFetchNextPageError && !isFetchingNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className='text-sm text-primary font-medium px-4 py-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors'
          >
            Tap to retry
          </button>
        )}
      </div>
    </div>
  );
}
