'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { links } from '@/constants';
import { useUnreadNotificationsCount } from '@/features/notification/hooks/useUnreadNotificationsCount';
import { signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar({ username }: { username: string }) {
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const { data: unreadCount } = useUnreadNotificationsCount();

  return (
    <nav className='flex flex-col h-[90vh] p-3'>
      {/* Top section links */}
      <div className='flex flex-col gap-3'>
        {links.map(({ href, label, Icon }) => {
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
                'flex items-center gap-3 rounded-full px-4 w-fit py-2 font-medium transition-colors hover:bg-primary/20 ',
                isActive && 'bg-primary/20  dark:bg-primary/25',
              )}
            >
              <div className='relative'>
                <Icon className='h-5 w-5' />
                {isNotifications && unreadCount && unreadCount > 0 ? (
                  <span className='absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white'>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                ) : null}
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <div className='mt-auto'>
        <Button
          variant='ghost'
          className='group justify-start rounded-full w-fit px-4 gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/10 transition-colors cursor-pointer'
          onClick={async () => {
            await signOut({
              fetchOptions: {
                onSuccess() {
                  queryClient.clear();
                  window.location.href = '/login';
                },
              },
            });
          }}
        >
          <LogOut className='h-5 w-5' />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
}
