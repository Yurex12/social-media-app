'use client';

import { useSearchUsers } from '../hooks/useSearchUsers';
import { UserList } from '@/features/profile/components/UserList';

export function UsersSearchResults({ query }: { query: string }) {
  const queryState = useSearchUsers(query);

  return (
    <UserList
      {...queryState}
      emptyMessage={
        <p>
          No result match{' '}
          <span className='font-semibold text-foreground/80'>
            &quot;{query}&quot;
          </span>
        </p>
      }
    />
  );
}
