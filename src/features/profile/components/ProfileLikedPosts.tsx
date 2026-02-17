'use client';

import { PostFeed } from '@/features/post/components/PostFeed';
import { useProfileLikes } from '../hooks/useProfileLikes';
import { useProfile } from '../hooks/useProfile';

export function ProfileLikedPosts() {
  const queryState = useProfileLikes();
  const {
    error: profileError,
    isPending: isLoadingProfile,
    user,
  } = useProfile();

  if (profileError || isLoadingProfile || !user) return null;

  return <PostFeed {...queryState} emptyMessage='No liked post.' />;
}
