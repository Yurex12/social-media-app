'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { links } from '@/constants';
import { useUnreadNotificationsCount } from '@/features/notification/hooks/useUnreadNotificationsCount';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export default function MobileNavbar() {
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  const username = sessionData?.user?.username;

  const { data: unreadCount } = useUnreadNotificationsCount();

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 pb-safe md:hidden'>
      {links
        .filter((link) => link.label.toLowerCase() !== 'settings')
        .map(({ href, label, Icon }) => {
          const isProfilePath = href === '/profile';
          const isNotifications = href === '/notifications';

          const finalHref =
            isProfilePath && username ? `/profile/${username}` : href;

          const isActive = isProfilePath
            ? pathname.startsWith(finalHref)
            : pathname === href;

          return (
            <Link
              key={href}
              href={finalHref}
              className={cn(
                'relative flex flex-col items-center justify-center transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <div className='relative p-2'>
                <Icon className={cn('h-6 w-6', isActive && 'fill-current')} />

                {isNotifications && unreadCount && unreadCount > 0 ? (
                  <span className='absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white border-2 border-background'>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                ) : null}
              </div>

              <span className='sr-only'>{label}</span>
            </Link>
          );
        })}
    </nav>
  );
}
