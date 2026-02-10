'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { links } from '@/constants';
import { cn } from '@/lib/utils';
import { signOut, useSession } from '@/lib/auth-client';
import { Button } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useUnreadNotificationsCount } from '@/features/notification/hooks/useUnreadNotificationsCount';

export default function Navbar() {
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  const username = sessionData?.user?.username;

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: unreadCount } = useUnreadNotificationsCount();

  return (
    <nav className='flex flex-col gap-3 p-3'>
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
              'flex items-center gap-3 rounded-full px-4 w-fit py-2 font-medium transition-colors hover:bg-primary/10 hover:text-primary',
              isActive && 'bg-primary/15 text-primary',
            )}
          >
            <div className='relative'>
              <Icon className='h-5 w-5' />
              {isNotifications && unreadCount && unreadCount > 0 ? (
                <span className='absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white'>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </div>
            <span>{label}</span>
          </Link>
        );
      })}

      <Button
        variant='ghost'
        className='mt-auto justify-start rounded-full'
        onClick={async () => {
          await signOut({
            fetchOptions: {
              onSuccess() {
                router.replace('/login');
                queryClient.clear();
              },
            },
          });
        }}
      >
        Logout
      </Button>
    </nav>
  );
}
