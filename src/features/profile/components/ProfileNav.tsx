'use client';
import { useParams, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { useProfile } from '../hooks/useProfile';

export function ProfileNav() {
  const { username } = useParams<{ username: string }>();

  const pathname = usePathname();

  const session = useSession();

  const {
    error: profileError,
    isPending: isLoadingProfile,
    user,
  } = useProfile();

  if (profileError || isLoadingProfile || !user) return null;

  const tabs = [
    { label: 'Posts', href: `/profile/${username}` },
    { label: 'Likes', href: `/profile/${username}/likes` },
  ];

  if (session.data?.user.username !== username) return null;

  return (
    <div className='px-4 border-b'>
      <div className='flex gap-4 w-full'>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className='flex justify-center hover:bg-muted/50 transition-colors'
            >
              <div className='relative py-4 flex items-center'>
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground',
                  )}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <div className='absolute bottom-0 h-1 w-full bg-primary rounded-full' />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
