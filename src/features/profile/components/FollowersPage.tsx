'use client';

import { Spinner } from '@/components/ui/spinner';
import { useParams } from 'next/navigation';
import { useFollowers } from '../hooks/useFollowers';
import { UserCard } from './UserCard';
import { useProfile } from '../hooks/useProfile';

export default function FollowersPage() {
  const { username } = useParams<{ username: string }>();

  const { users: followers, isPending, error } = useFollowers(username);

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

  if (!followers?.length)
    return <p className='px-4 mt-4 text-muted-foreground'>No followers yet</p>;

  return (
    <div className='py-2 flex flex-col'>
      {followers.map((follower) => (
        <UserCard user={follower} key={follower.id} />
      ))}
    </div>
  );
}
