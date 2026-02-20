'use client';

import { useParams } from 'next/navigation';
import { useFollowing } from '../hooks/useFollowing';
import { useProfile } from '../hooks/useProfile';
import { UserList } from './UserList';

export default function FollowingPage() {
  const { username } = useParams<{ username: string }>();

  const queryState = useFollowing(username);

  const {
    error: profileError,
    isPending: isLoadingProfile,
    user,
  } = useProfile();

  if (profileError || isLoadingProfile || !user) return null;

  return (
    <div className='sm:px-4'>
      <UserList {...queryState} emptyMessage='Not following anyone yet' />
    </div>
  );
}
