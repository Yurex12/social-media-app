'use client';

import { PostFeed } from '@/features/post/components/PostFeed';
import { useBookmarks } from '../hooks/useBookmarks';

export function BookmarkList() {
  const queryState = useBookmarks();

  return (
    <PostFeed
      {...queryState}
      emptyMessage="You haven't bookmarked anything yet."
    />
  );
}
