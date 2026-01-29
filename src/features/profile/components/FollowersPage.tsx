'use client';

import { Spinner } from '@/components/ui/spinner';
import { useParams } from 'next/navigation';
import { useFollowers } from '../hooks/useFollowers';
import { UserCard } from './UserCard';

export default function FollowersPage() {
  const { username } = useParams<{ username: string }>();

  const { users, isPending, error } = useFollowers(username);
  if (isPending) {
    return (
      <div className='flex items-center justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );
  }

  if (error) return <p className='px-4 mt-4'>{error.message}</p>;

  if (!users?.length)
    return <p className='px-4 mt-4 text-muted-foreground'>No followers yet</p>;

  return (
    <div className='py-2 flex flex-col'>
      {users.map((user) => (
        <UserCard user={user} key={user.id} />
      ))}
    </div>
  );
}
