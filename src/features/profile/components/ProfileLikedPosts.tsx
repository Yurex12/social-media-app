'use client';

import { PostFeed } from '@/features/post/components/PostFeed';
import { useProfileLikes } from '../hooks/useProfileLikes';
import { useProfile } from '../hooks/useProfile';

export function ProfileLikedPosts() {
  const {
    likedPosts,
    isPending: isLoadingProfileLikes,
    error: profileErrorLikes,
  } = useProfileLikes();
  const {
    error: profileError,
    isPending: isLoadingProfile,
    user,
  } = useProfile();

  if (profileError || isLoadingProfile || !user) return null;
  return (
    <div className='px-4'>
      <PostFeed
        posts={likedPosts}
        isPending={isLoadingProfileLikes}
        error={profileErrorLikes}
        emptyMessage='No liked post.'
      />
    </div>
  );
}
