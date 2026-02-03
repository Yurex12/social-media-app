'use client';

import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { useProfile } from '../hooks/useProfile';

export function ProfileHeader() {
  const { user, isPending, error } = useProfile();

  if (isPending || error || !user) return null;

  const postsLength = user.postsCount;

  return (
    <Header>
      <BackButton />
      <div>
        <h3 className='text-lg font-semibold'>{user.name}</h3>
        {postsLength > 0 && (
          <span className='text-sm text-muted-foreground'>
            {postsLength} {postsLength > 1 ? 'posts' : 'post'}
          </span>
        )}
      </div>
    </Header>
  );
}
