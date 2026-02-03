'use client';

import { PostFeed } from '@/features/post/components/PostFeed';
import { useProfileLikes } from '../hooks/useProfileLikes';
import { useProfile } from '../hooks/useProfile';

export function ProfileLikedPosts() {
  const {
    postIds: likedPostIds,
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
        postIds={likedPostIds}
        isPending={isLoadingProfileLikes}
        error={profileErrorLikes}
        emptyMessage='No liked post.'
      />
    </div>
  );
}
