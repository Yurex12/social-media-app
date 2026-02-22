'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { links } from '@/constants';
import { User } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/features/profile/components/UserAvatar';

const hiddenLinks = ['settings', 'notifications'];

export function MobileNavbar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t bg-background pb-safe md:hidden'>
      {links
        .filter((link) => !hiddenLinks.includes(link.label.toLowerCase()))
        .map(({ href, label, Icon }) => {
          const isProfilePath = href === '/profile';

          const finalHref =
            isProfilePath && user.username ? `/profile/${user.username}` : href;

          const isActive = isProfilePath
            ? pathname.startsWith(finalHref)
            : pathname === href;

          return (
            <Link
              key={href}
              href={finalHref}
              className={cn(
                'relative flex flex-col items-center justify-center transition-colors px-2',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <div className='relative p-2'>
                {isProfilePath ? (
                  <UserAvatar
                    name={user.name}
                    image={user.image}
                    className={cn(
                      'size-7 transition-all ',
                      isActive ? 'ring-2 ring-offset-1 ring-primary' : '',
                    )}
                  />
                ) : (
                  <Icon className={cn('h-6 w-6', isActive && 'fill-current')} />
                )}
              </div>
              <span className='sr-only'>{label}</span>
            </Link>
          );
        })}
    </nav>
  );
}
