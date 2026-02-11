'use client';

import { PostFeed } from '@/features/post/components/PostFeed';
import { useProfilePosts } from '../hooks/useProfilePosts';
import { useProfile } from '../hooks/useProfile';

export function ProfilePosts() {
  const queryState = useProfilePosts();

  const {
    error: profileError,
    isPending: isLoadingProfile,
    user,
  } = useProfile();

  if (profileError || isLoadingProfile || !user) return null;

  return (
    <div className='px-4'>
      <PostFeed {...queryState} emptyMessage="You haven't made any post" />
    </div>
  );
}
