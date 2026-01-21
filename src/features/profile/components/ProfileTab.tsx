'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function ProfileTabs({ username }: { username: string }) {
  const pathname = usePathname();

  const tabs = [
    { label: 'Posts', href: `/profile/${username}` },
    { label: 'Likes', href: `/profile/${username}/likes` },
  ];

  return (
    <div className='flex border-b border-border max-w-140 gap-4 mx-auto w-full'>
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
  );
}
