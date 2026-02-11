'use client';

import { useParams } from 'next/navigation';
import { useFollowers } from '../hooks/useFollowers';
import { useProfile } from '../hooks/useProfile';
import { UserList } from './UserList';

export default function FollowersPage() {
  const { username } = useParams<{ username: string }>();

  const queryState = useFollowers(username);

  const {
    error: profileError,
    isPending: isLoadingProfile,
    user,
  } = useProfile();

  if (profileError || isLoadingProfile || !user) return null;

  return <UserList {...queryState} emptyMessage='No followers yet' />;
}
