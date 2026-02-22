'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { ModeToggle } from './ModeToggle';
import { UserAvatar } from '@/features/profile/components/UserAvatar';
import { useSession } from '@/lib/auth-client';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';

export function RightSidebar({ children }: { children?: ReactNode }) {
  const { data, isPending } = useSession();
  return (
    <aside className='hidden xl:block space-y-4 h-dvh border-l border-border sticky top-0'>
      <Header className='justify-end xl:gap-4'>
        {isPending ? (
          <div className='flex items-center gap-4 min-w-0'>
            <UserAvatar
              isPending={true}
              className='ring-primary ring-2 ring-offset-2 size-8 ring-offset-background shrink-0'
            />
            <div className='flex flex-col gap-1.5'>
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-3 w-16' />
            </div>
          </div>
        ) : (
          <Link
            href={`/profile/${data?.user.username}`}
            className='flex items-center gap-4 min-w-0 hover:opacity-90 transition-opacity'
          >
            <UserAvatar
              image={data?.user.image}
              name={data?.user.name}
              className='ring-primary ring-2 ring-offset-2 size-8 ring-offset-background shrink-0'
            />
            <div className='flex flex-col text-sm text-left min-w-0'>
              <span className='font-bold leading-none truncate max-w-37.5'>
                {data?.user.name}
              </span>
              <span className='text-muted-foreground leading-tight truncate max-w-30'>
                @{data?.user.username}
              </span>
            </div>
          </Link>
        )}
        <ModeToggle />
      </Header>

      <div className='px-4 h-fit sticky top-20'>{children}</div>
    </aside>
  );
}
