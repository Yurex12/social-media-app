'use client';
import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { useProfile } from '../hooks/useProfile';

export function ProfileRelationsHeader() {
  const { user, isPending, error } = useProfile();

  if (isPending || error || !user) return null;

  return (
    <Header>
      <BackButton />
      <div>
        <h3 className='text-lg font-semibold'>{user.name}</h3>

        <span className='text-sm text-muted-foreground'>@{user.username}</span>
      </div>
    </Header>
  );
}
