'use client';
import { useParams, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useProfile } from '../hooks/useProfile';

export function ProfileRelationsNav() {
  const { username } = useParams<{ username: string }>();

  const pathname = usePathname();

  const {
    error: profileError,
    isPending: isLoadingProfile,
    user,
  } = useProfile();

  if (profileError || isLoadingProfile || !user) return null;

  const tabs = [
    { label: 'Following', href: `/profile/${username}/following` },
    { label: 'Followers', href: `/profile/${username}/followers` },
  ];

  return (
    <div className='flex border-b border-gray-200 max-w-140 w-full mx-auto'>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className='flex justify-center hover:bg-muted/50 transition-colors'
          >
            <span
              className={cn(
                'px-4 py-2 font-medium transition-colors',
                isActive
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
