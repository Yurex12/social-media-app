'use client';

import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { useProfile } from '../hooks/useProfile';

export function ProfileHeader() {
  const { user, isPending, error } = useProfile();

  if (isPending || error || !user) return null;

  const postsLength = user.postsCount;

  return (
    <Header>
      <div className='flex justify-between items-center w-full'>
        <div className='flex justify-between gap-6'>
          <BackButton />
          <div className='space-y-0'>
            <h3 className='line-clamp-1'>{user.name}</h3>
            {postsLength > 0 && (
              <span className='text-sm text-muted-foreground'>
                {postsLength} {postsLength > 1 ? 'posts' : 'post'}
              </span>
            )}
          </div>
        </div>

        {user.isCurrentUser && (
          <Button
            asChild
            variant='outline'
            className='shadow-none block sm:hidden'
          >
            <Link href='/settings' className='flex items-center gap-x-2'>
              <Settings />
            </Link>
          </Button>
        )}
      </div>
    </Header>
  );
}
