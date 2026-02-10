'use client';

import { Button } from '@/components/ui/button';
import { useMarkAllAsRead } from '../hooks/useMarkAllAsRead';

export function MarkAllAsReadBtn() {
  const { markAllAsRead, isPending } = useMarkAllAsRead();

  return (
    <Button
      onClick={() => markAllAsRead()}
      disabled={isPending}
      variant='outline'
      className='shadow-none rounded-md cursor-pointer'
    >
      Mark All As Read
    </Button>
  );
}
