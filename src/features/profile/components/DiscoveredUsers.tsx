import { Spinner } from '@/components/ui/spinner';
import { useSuggestedUsers } from '../hooks/useSuggestedUser';
import { UserCard } from './UserCard';

export function DiscoveredUsers() {
  const { users, isPending, error } = useSuggestedUsers();

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
        You&apos;re following everyone! Check back later for new people.
      </p>
    );

  return (
    <div>
      <div className='py-2 flex flex-col'>
        {users.map((user) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}
