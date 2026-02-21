'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useUnreadNotificationsCount } from '@/features/notification/hooks/useUnreadNotificationsCount';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function NotificationIcon({ className }: { className?: string }) {
  const { data: unreadCount } = useUnreadNotificationsCount();

  return (
    <Link href='/notifications' className='relative'>
      <Button variant='ghost' size='icon' className={cn('relative', className)}>
        <Bell className='size-6' />
        {unreadCount && unreadCount > 0 ? (
          <span className='absolute right-1.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white border-2 border-background'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </Button>
      <span className='sr-only'>Notifications</span>
    </Link>
  );
}
