'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { links } from '@/constants';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const hiddenLinks = ['settings', 'notifications'];

export default function MobileNavbar() {
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  const username = sessionData?.user?.username;

  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2 pb-safe md:hidden'>
      {links
        .filter((link) => !hiddenLinks.includes(link.label.toLowerCase()))
        .map(({ href, label, Icon }) => {
          const isProfilePath = href === '/profile';

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
                'relative flex flex-col items-center justify-center transition-colors px-4',
                isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <div className='relative p-2'>
                <Icon className={cn('h-6 w-6', isActive && 'fill-current')} />
              </div>
              <span className='sr-only'>{label}</span>
            </Link>
          );
        })}
    </nav>
  );
}
