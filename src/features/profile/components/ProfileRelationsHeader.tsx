'use client';
import { BackButton } from '@/components/BackButton';
import { Header } from '@/components/Header';
import { useProfile } from '../hooks/useProfile';
import { Spinner } from '@/components/ui/spinner';

export function ProfileRelationsHeader() {
  const { user, isPending, error } = useProfile();

  if (isPending)
    return (
      <div className='flex items-center justify-center h-dvh'>
        <Spinner className='size-6 text-primary' />
      </div>
    );

  if (error)
    return (
      <div className='flex items-center justify-center h-dvh'>
        <p>{error.message}</p>
      </div>
    );

  if (!user) return <p>User not found</p>;

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
