'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { links } from '@/constants';
import { cn } from '@/lib/utils';
import { signOut, useSession } from '@/lib/auth-client';
import { Button } from './ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function Navbar() {
  const pathname = usePathname();
  const session = useSession();
  const username = session.data?.user?.username;

  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <nav className='flex flex-col gap-3 p-3'>
      {links.map(({ href, label, Icon }) => {
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
              'flex items-center gap-3 rounded-full px-4 w-fit py-2 font-medium transition-colors hover:bg-primary/10 hover:text-primary',
              isActive && 'bg-primary/15 text-primary',
            )}
          >
            <Icon className='h-5 w-5' />
            <span>{label}</span>
          </Link>
        );
      })}
      <Button
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
