'use client';

import { Spinner } from '@/components/ui/spinner';
import { useSearchUsers } from '../hooks/useSearchUsers';
import { UserCard } from '@/features/profile/components/UserCard';

export function UsersSearchResults({ query }: { query: string }) {
  const { users, error, isPending } = useSearchUsers(query);

  if (isPending) {
    return (
      <div className='flex items-center justify-center mt-4'>
        <Spinner className='size-6 text-primary' />
      </div>
    );
  }

  if (error) return <p className='px-4 mt-4'>{error.message}</p>;

  if (!users?.length)
    return (
      <p className='px-4 mt-4 text-muted-foreground'>
        No result match{' '}
        <span className='font-semibold text-foreground/80'>
          &quot;{query}&quot;
        </span>
      </p>
    );

  return (
    <div className='py-2 flex flex-col'>
      {users.map((user) => (
        <UserCard user={user} key={user.id} />
      ))}
    </div>
  );
}
