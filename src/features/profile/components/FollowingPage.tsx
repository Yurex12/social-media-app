'use client';

import { Spinner } from '@/components/ui/spinner';
import { useParams } from 'next/navigation';
import { useFollowing } from '../hooks/useFollowing';
import { UserCard } from './UserCard';
import { useProfile } from '../hooks/useProfile';

export default function FollowingPage() {
  const { username } = useParams<{ username: string }>();

  const { users: following, isPending, error } = useFollowing(username);

  const {
    error: profileError,
    isPending: isLoadingProfile,
    user,
  } = useProfile();

  if (profileError || isLoadingProfile || !user) return null;
  if (isPending) {
    return (
      <div className='flex items-center justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );
  }

  if (error) return <p className='px-4 mt-4'>{error.message}</p>;

  if (!following?.length)
    return <p className='px-4 mt-4 text-muted-foreground'>No following</p>;

  return (
    <div className='py-2 flex flex-col'>
      {following.map((user) => (
        <UserCard user={user} key={user.id} />
      ))}
    </div>
  );
}
