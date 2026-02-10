'use client';

import { Spinner } from '@/components/ui/spinner';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

export default function NotificationList() {
  const { notifications, isPending, error } = useNotifications();

  if (isPending) {
    return (
      <div className='flex items-center justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );
  }

  if (error)
    return <p className='mt-4 px-4 text-muted-foreground'>{error.message}</p>;

  if (!notifications?.length)
    return (
      <p className='mt-4 text-muted-foreground px-4'>
        Nothing to see here - yet.
      </p>
    );

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
