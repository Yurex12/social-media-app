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

      {(hasNextPage || isFetchingNextPage || isFetchNextPageError) && (
        <div ref={ref} className='py-8 flex justify-center'>
          {isFetchingNextPage && <Spinner className='size-6 text-primary' />}

          {isFetchNextPageError && (
            <button
              onClick={() => fetchNextPage()}
              className='text-sm text-primary hover:underline'
            >
              Retry loading
            </button>
          )}
        </div>
      )}
    </div>
  );
}
